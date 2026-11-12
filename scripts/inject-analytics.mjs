import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : null;
};

const DIST = path.resolve(ROOT, getArg('--dist') || 'dist');
const REQUIRE_TOKEN = args.includes('--require');
const env = loadEnv('production', ROOT, '');
const token = (
  process.env.CLOUDFLARE_ANALYTICS_TOKEN ||
  env.CLOUDFLARE_ANALYTICS_TOKEN ||
  process.env.VITE_CLOUDFLARE_ANALYTICS_TOKEN ||
  env.VITE_CLOUDFLARE_ANALYTICS_TOKEN ||
  ''
).trim();

if (!token) {
  if (REQUIRE_TOKEN) {
    console.error(
      '[analytics] CLOUDFLARE_ANALYTICS_TOKEN is required but not set.'
    );
    console.error(
      '[analytics] Add it to .env.production.local or set it in the environment before deploying.'
    );
    process.exit(1);
  }

  console.warn(
    '[analytics] CLOUDFLARE_ANALYTICS_TOKEN is not set; skipping Cloudflare Web Analytics injection.'
  );
  process.exit(0);
}

if (!/^[A-Za-z0-9_-]{16,128}$/.test(token)) {
  console.error(
    '[analytics] CLOUDFLARE_ANALYTICS_TOKEN contains unexpected characters.'
  );
  process.exit(1);
}

const snippet = `  <!-- Cloudflare Web Analytics -->
  <script
    type="module"
    src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon='{"token":"${token}"}'
  ></script>
  <!-- End Cloudflare Web Analytics -->
`;

async function* walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (entry.isFile()) {
      yield fullPath;
    }
  }
}

let htmlFiles = 0;
let injected = 0;
let alreadyPresent = 0;
let skipped = 0;

try {
  for await (const file of walk(DIST)) {
    if (!file.toLowerCase().endsWith('.html')) continue;
    htmlFiles += 1;

    const html = await readFile(file, 'utf8');
    if (html.includes('static.cloudflareinsights.com/beacon.min.js')) {
      alreadyPresent += 1;
      continue;
    }

    const bodyClose = html.toLowerCase().lastIndexOf('</body>');
    if (bodyClose === -1) {
      skipped += 1;
      console.warn(`[analytics] Skipped ${path.relative(ROOT, file)}: no </body>.`);
      continue;
    }

    const nextHtml = `${html.slice(0, bodyClose)}${snippet}${html.slice(bodyClose)}`;
    await writeFile(file, nextHtml, 'utf8');
    injected += 1;
  }
} catch (error) {
  console.error(`[analytics] Could not read ${DIST}: ${error.message}`);
  process.exit(1);
}

if (htmlFiles === 0) {
  console.error(`[analytics] No HTML files found under ${DIST}. Build first.`);
  process.exit(1);
}

console.log(
  `[analytics] Cloudflare Web Analytics: ${injected} injected, ${alreadyPresent} already present, ${skipped} skipped (${htmlFiles} HTML files).`
);
