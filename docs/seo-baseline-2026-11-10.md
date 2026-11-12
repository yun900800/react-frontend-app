# SEO 基线报告：书评集

> 最新内容、GSC/Bing 和 Cloudflare Web Analytics 基线见 `docs/seo-baseline-2026-11-12.md`。

日期：2026-11-10
站点：https://home.bayh.pp.ua
API：https://bayh.pp.ua

## 内容基线

| 指标 | 当前值 |
|---|---|
| 公开书籍 | 14 |
| 公开书评 | 42 |
| 最新书籍创建时间 | 2026-11-08 |
| 最早书籍创建时间 | 2025-11-03 |
| sitemap 可发现 URL | 15（首页 + 14 本书） |

## M0 前状态

| 项目 | 状态 |
|---|---|
| 首页 title | `投标工作台`（公开站定位错误） |
| 首页 description | `投标项目工作台：客户、图书、评论编辑、AI 助手与实验区。` |
| canonical | 无 |
| Open Graph | 0 个 |
| `/robots.txt` | 返回 SPA `index.html`，不是纯文本 |
| `/sitemap.xml` | 返回 SPA `index.html`，不是 XML |
| 404 | 只有客户端兜底，无 `noindex` |

## M0 后线上验证

| 项目 | 状态 |
|---|---|
| 首页 title | `书评集 · 用书评记录每一次阅读` |
| 首页 description | `书评集：记录每一次阅读。浏览书籍、经典评论与阅读笔记。` |
| 首页 canonical | `https://home.bayh.pp.ua/` |
| 首页 robots | `index,follow` |
| 书籍详情 title | `一如既往 \| 书评集` |
| 书籍详情 canonical | `https://home.bayh.pp.ua/books/15` |
| 书籍详情 OG type | `article` |
| 详情页 description | 使用书籍 description，截断到 160 字 |
| 404 | title `页面未找到 \| 书评集`，robots `noindex,follow` |
| `/sitemap.xml` | `200 application/xml`，15 个 URL |
| `/robots.txt` | 源站文件正确；Cloudflare 边缘仍缓存旧 SPA HTML，需 purge 或等待 TTL |

## 性能基线

用 `fetch` 连续请求 3 次，取中位数（2026-11-10）：

| 请求 | 中位数 | 备注 |
|---|---:|---|
| `GET /` | 370 ms | 有一次 1.6 s 冷启动 |
| `GET /api/public/books` | 888 ms | 有一次 2.6 s 冷启动 |
| `GET /health` | 504 ms | 含 DB ping |

PageSpeed Insights API 当日配额已用尽（429），未取得 Lighthouse 分数。M3 做预渲染后再用 Lighthouse 做正式 CWV 基线。

## 已知限制

1. 公开站是 Vite SPA。Google 能执行 JS，但百度/部分爬虫不稳定；当前 title/description/canonical 是客户端设置，非 JS 爬虫只能看到 `index.html` 默认值。M3 必须做预渲染或 SSG。
2. 未知路径返回 HTTP 200 + 客户端 404（soft 404）。已加 `noindex`，但 HTTP 状态仍不理想；M3 预渲染时一起修。
3. Cloudflare 对 `/robots.txt` 仍返回 M0 前的缓存内容。源站已验证正确，需在 Cloudflare 控制台 Purge Single URL，或等待约 4 小时 TTL。
4. 书籍详情 URL 目前是数字 ID（`/books/15`），M1 加 slug 后需要 301 重定向旧 URL。

## 下一步

1. 人工完成 GSC/Bing 验证并提交 sitemap。
2. 清理 Cloudflare 的 `/robots.txt` 缓存。
3. 进入 M1：slug、标签、分类、系列、发布状态、SEO 字段。
