# Cloudflare Web Analytics 接入

本项目使用 **Cloudflare Web Analytics 手动接入**。构建完成后，`scripts/inject-analytics.mjs` 会扫描 `dist/**/*.html`，把 beacon 插入到每个页面的 `</body>` 前。这样预渲染阶段不会向统计发送虚假访问。

## 1. 获取 token

1. 登录 Cloudflare Dashboard。
2. 进入 **Analytics & Logs → Web Analytics**。
3. 添加站点 `home.bayh.pp.ua`（如果已存在则直接打开）。
4. 选择 **Manual setup / 手动设置**，复制 JS 片段里的 `token`。

> 不要同时开启自动注入（Automatic setup），否则可能重复上报或与预渲染构建互相干扰。

## 2. 本地配置 token

在 `react-frontend-app` 根目录创建 `.env.production.local`（已被 `.gitignore` 忽略）：

```dotenv
CLOUDFLARE_ANALYTICS_TOKEN=你的token
```

也可以临时通过环境变量运行：

```powershell
$env:CLOUDFLARE_ANALYTICS_TOKEN = "你的token"
```

token 会出现在公开 HTML 中，它不是秘密；但不要把 Cloudflare API Token 或账号密码写进仓库。

## 3. 部署

```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy-webhostmost.ps1
```

部署脚本会按顺序执行：

1. `npm run build`
2. `npm run prerender`
3. `npm run analytics:inject -- --require`

没有 token 时，第 3 步会失败，避免“以为接入了统计但线上没有 beacon”。紧急情况下可以加 `-SkipAnalytics` 跳过。

## 4. 验证

部署后检查任意页面源码：

```powershell
curl.exe -s https://home.bayh.pp.ua/ | Select-String "cloudflareinsights"
```

应看到：

```html
<script
  type="module"
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token":"..."}'
></script>
```

也可以检查预渲染页面：

```powershell
curl.exe -s "https://home.bayh.pp.ua/books/hua-qian-de-yi-shu" | Select-String "cloudflareinsights"
```

## 5. 数据查看

- 首次数据通常在部署后 **24–48 小时**出现。
- Cloudflare Web Analytics 会自动跟踪 SPA 路由变化（History API），不需要手写 `pageview()`。
- 查询参数 / UTM 不会进入报表；需要区分来源时优先用独立落地页。
- beacon 不使用 cookie / localStorage，不读取 IP；本项目不需要为它单独加 cookie 同意横幅。
- 部分广告拦截器（Adblock、Brave、DuckDuckGo）会拦截 beacon，报表会少一部分访问，这是预期行为。

## 6. 排查

如果 48 小时后仍无数据：

1. 确认线上 HTML 含 `static.cloudflareinsights.com/beacon.min.js`。
2. 确认 token 与 Cloudflare Dashboard 中 `home.bayh.pp.ua` 的 Web Analytics 站点一致。
3. 确认没有同时开启自动注入。
4. 清除 Cloudflare 对该 HTML 的缓存后重试。
5. 用无广告拦截的浏览器访问一次，再等待几分钟。
