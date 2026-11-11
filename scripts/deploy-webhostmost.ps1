<#
.SYNOPSIS
  Build the frontend and deploy dist/ to WebHostMost over SSH/SCP.

.DESCRIPTION
  Local replacement for the GitHub Actions auto-deploy workflow. The script:
    1. optionally installs dependencies
    2. runs npm run build
    3. creates a timestamped tar of dist/
    4. backs up the remote public_html
    5. uploads and extracts the tar
    6. verifies the remote index.html references the new main JS asset

  The remote host defaults to the SSH config alias "webhostmost".

.PARAMETER SshHost
  SSH config alias or hostname. Default: webhostmost.

.PARAMETER RemotePath
  Absolute POSIX path to the deployed public_html directory.

.PARAMETER Port
  Optional SSH port. Leave 0 to use the SSH config / default port.

.PARAMETER InstallDeps
  Run npm ci before building.

.PARAMETER SkipBuild
  Reuse the existing dist/ directory.

.PARAMETER SkipBackup
  Do not create a remote public_html backup before uploading.

.PARAMETER SkipVerify
  Do not verify the remote index.html asset hash.

.PARAMETER KeepLocalArchive
  Keep the generated local tar.gz for debugging.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts/deploy-webhostmost.ps1

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts/deploy-webhostmost.ps1 -InstallDeps -SkipBackup
#>
[CmdletBinding()]
param(
    [string]$SshHost = 'webhostmost',
    [string]$RemotePath = '/home/xqfisebj/domains/home.bayh.pp.ua/public_html',
    [int]$Port = 0,
    [switch]$InstallDeps,
    [switch]$SkipBuild,
    [switch]$SkipBackup,
    [switch]$SkipVerify,
    [switch]$KeepLocalArchive
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Step {
    param([Parameter(Mandatory = $true)][string]$Message)
    Write-Host ''
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Get-RequiredCommand {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [string]$Fallback
    )
    $command = Get-Command $Name -ErrorAction SilentlyContinue
    if (-not $command -and $Fallback) {
        $command = Get-Command $Fallback -ErrorAction SilentlyContinue
    }
    if (-not $command) {
        throw "Required command not found: $Name"
    }
    return $command.Source
}

function Invoke-Native {
    param(
        [Parameter(Mandatory = $true)][string]$FilePath,
        [string[]]$Arguments = @()
    )
    & $FilePath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code $LASTEXITCODE`: $FilePath $($Arguments -join ' ')"
    }
}

function Assert-RemotePath {
    param([Parameter(Mandatory = $true)][string]$Value)
    if (-not $Value.StartsWith('/')) {
        throw 'RemotePath must be an absolute POSIX path, for example /home/user/domains/example.com/public_html.'
    }
    if ($Value.Contains("'")) {
        throw "RemotePath must not contain a single quote: $Value"
    }
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir
$distDir = Join-Path $repoRoot 'dist'
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$archiveName = "home-bayh-dist-$timestamp.tar.gz"
$localArchive = Join-Path ([System.IO.Path]::GetTempPath()) $archiveName
$backupName = "public_html-backup-$timestamp.tar.gz"
$remoteBackup = $null
$mainAsset = $null

Assert-RemotePath -Value $RemotePath
$RemotePath = $RemotePath.TrimEnd('/')
$lastSlash = $RemotePath.LastIndexOf('/')
if ($lastSlash -le 0 -or $lastSlash -eq ($RemotePath.Length - 1)) {
    throw "RemotePath must include a parent directory and a leaf directory: $RemotePath"
}
$remoteParent = $RemotePath.Substring(0, $lastSlash)
$remoteLeaf = $RemotePath.Substring($lastSlash + 1)
$remoteArchive = "$remoteParent/$archiveName"

$npm = Get-RequiredCommand -Name 'npm.cmd' -Fallback 'npm'
$tar = Get-RequiredCommand -Name 'tar.exe' -Fallback 'tar'
$ssh = Get-RequiredCommand -Name 'ssh.exe' -Fallback 'ssh'
$scp = Get-RequiredCommand -Name 'scp.exe' -Fallback 'scp'

$sshArgs = @('-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15')
$scpArgs = @('-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15')
if ($Port -gt 0) {
    $sshArgs += @('-p', "$Port")
    $scpArgs += @('-P', "$Port")
}

Push-Location $repoRoot
try {
    Write-Step "Repository: $repoRoot"

    if ($InstallDeps) {
        Write-Step 'Installing dependencies (npm ci)'
        Invoke-Native -FilePath $npm -Arguments @('ci')
    }

    if (-not $SkipBuild) {
        Write-Step 'Building frontend (npm run build)'
        Invoke-Native -FilePath $npm -Arguments @('run', 'build')
    }

    $indexPath = Join-Path $distDir 'index.html'
    if (-not (Test-Path $indexPath)) {
        throw "Build output not found: $indexPath"
    }

    Write-Step "Packing dist/ into $archiveName"
    Invoke-Native -FilePath $tar -Arguments @('-czf', $localArchive, '-C', $distDir, '.')

    Write-Step "Checking SSH connection to $SshHost"
    Invoke-Native -FilePath $ssh -Arguments ($sshArgs + @($SshHost, 'true'))

    Write-Step "Checking remote path: $RemotePath"
    Invoke-Native -FilePath $ssh -Arguments ($sshArgs + @($SshHost, "test -d '$RemotePath'"))

    if (-not $SkipBackup) {
        $remoteBackup = "$remoteParent/$backupName"
        Write-Step "Creating remote backup: $remoteBackup"
        $backupCommand = "cd '$remoteParent' && tar -czf '$backupName' '$remoteLeaf'"
        Invoke-Native -FilePath $ssh -Arguments ($sshArgs + @($SshHost, $backupCommand))
    } else {
        Write-Step 'Skipping remote backup'
    }

    Write-Step "Uploading archive to ${SshHost}:${remoteParent}/"
    Invoke-Native -FilePath $scp -Arguments ($scpArgs + @($localArchive, "${SshHost}:${remoteParent}/"))

    Write-Step 'Extracting archive into remote public_html'
    $extractCommand = "cd '$RemotePath' && tar -xzf '$remoteArchive' && rm -f '$remoteArchive'"
    Invoke-Native -FilePath $ssh -Arguments ($sshArgs + @($SshHost, $extractCommand))

    if (-not $SkipVerify) {
        $localIndex = Get-Content -Path $indexPath -Raw
        $match = [regex]::Match($localIndex, 'assets/index-[A-Za-z0-9_-]+\.js')
        if (-not $match.Success) {
            throw 'Could not find the main JS asset in dist/index.html.'
        }
        $mainAsset = $match.Value
        Write-Step "Verifying remote index.html references $mainAsset"
        $grepCommand = "grep -Fq '$mainAsset' '$RemotePath/index.html'"
        Invoke-Native -FilePath $ssh -Arguments ($sshArgs + @($SshHost, $grepCommand))
    } else {
        Write-Step 'Skipping remote verification'
    }

    Write-Host ''
    Write-Host 'Deployment complete.' -ForegroundColor Green
    Write-Host "  Host:        $SshHost"
    Write-Host "  Remote path: $RemotePath"
    if ($remoteBackup) {
        Write-Host "  Backup:      $remoteBackup"
    } else {
        Write-Host '  Backup:      skipped'
    }
    if ($mainAsset) {
        Write-Host "  Main asset:  $mainAsset"
    }
    Write-Host "  Local tar:   $localArchive"
}
catch {
    Write-Host ''
    Write-Host "Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($remoteBackup) {
        Write-Host "Remote backup kept at: $remoteBackup" -ForegroundColor Yellow
    }
    exit 1
}
finally {
    if (-not $KeepLocalArchive -and (Test-Path $localArchive)) {
        Remove-Item -Path $localArchive -Force -ErrorAction SilentlyContinue
    }
    Pop-Location
}
