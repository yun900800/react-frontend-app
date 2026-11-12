# SEO 与统计基线：2026-11-12

站点：https://home.bayh.pp.ua  
API：https://bayh.pp.ua  
记录时间：2026-11-12

## 内容基线

由 `npm run seo:baseline` 从公开 API 和线上 sitemap 读取：

| 指标 | 当前值 |
|---|---:|
| 公开书籍 | 12 |
| 公开书评 | 38 |
| 分类数 | 5 |
| 标签数 | 38 |
| 系列数 | 3 |
| sitemap 可发现 URL | 35 |
| 最早书籍日期 | 2025-11-07 |
| 最新书籍日期 | 2026-11-11 |

2026-11-12 已执行书籍分类/标签/系列回填；《百年孤独-精装版》《我的书籍》《一本无名的书籍》改为草稿，未删除。详见 `docs/book-taxonomy-backfill-2026-11-12.md`。

## Core Web Vitals 基线

2026-11-12 的 Lighthouse 快照见 `docs/cwv-snapshot-2026-11-12.md`。结论：不需要现在专门做 CWV 项目；只建议给详情页封面图加 `fetchpriority="high"` 或改用直链，去掉短链重定向。

## Google Search Console 基线

在 GSC 后台按以下位置填写。建议先记录“自验证以来”的累计值，再记录最近 3 个月和最近 28 天，方便后续对比。

| 指标 | 自验证以来 | 最近 3 个月 | 最近 28 天 |
|---|---:|---:|---:|
| 已编入索引页数 | 待填 | 待填 | 待填 |
| Impressions | 待填 | 待填 | 待填 |
| Clicks | 待填 | 待填 | 待填 |
| CTR | 待填 | 待填 | 待填 |
| 平均排名 | 待填 | 待填 | 待填 |

数据位置：

- **索引页数**：GSC → Indexing → Pages → “Indexed”。
- **Impressions / Clicks / CTR / 平均排名**：GSC → Performance → Search results，切换日期范围。
- 建议同时导出 CSV，保存到 `docs/seo-exports/`（该目录可后续加入 `.gitignore`）。

## Bing Webmaster Tools 基线

状态：Bing Webmaster Tools 已验证并提交 sitemap（2026-11-12）。流量数字暂时不补，等后续需要复盘时再记录。

| 指标 | 当前值 |
|---|---:|
| 已编入索引页数 | 暂不记录 |
| Impressions | 暂不记录 |
| Clicks | 暂不记录 |
| CTR | 暂不记录 |
| 平均排名 | 暂不记录 |

数据位置：Bing Webmaster Tools → Search Performance → 选择日期范围。

## Cloudflare Web Analytics 基线

| 项目 | 状态 |
|---|---|
| 接入方式 | 手动接入（构建后注入 beacon） |
| 代码状态 | 已上线（2026-11-12） |
| 线上验证 | 首页、书籍详情、分类/标签/系列页、About 均含 beacon |
| Beacon 请求 | `beacon.min.js` 200；RUM POST 返回 204 |
| 首次数据 | 预计部署后 24–48 小时 |
| 当前 Page views / Visits | 待首次数据 |

查看位置：Cloudflare Dashboard → Analytics & Logs → Web Analytics → `home.bayh.pp.ua`。

接入步骤见 `docs/analytics-setup.md`。token 保存在本地 `.env.production.local`（已被 git 忽略）。

## 已知限制

1. Cloudflare Web Analytics 不记录查询参数 / UTM，来源细分能力有限。
2. 广告拦截器会拦截 beacon，报表会低于真实访问。
3. GSC/Bing 的“已编入索引页数”是搜索引擎侧数据，不等于 sitemap URL 数。
4. sitemap 当前 35 个 URL；只有 1 本书的标签页保持可访问但标记 `noindex`，也不进入 sitemap，避免薄页。
5. 后续新增书籍、分类或标签后需要重新部署并更新本基线；旧分类/标签的静态目录会在部署时清理，未知 taxonomy 路径返回 404。

## 下一步

1. ~~在 Cloudflare 获取 Web Analytics token，写入 `.env.production.local` 并部署。~~ 已完成（2026-11-12）。
2. ~~Bing Webmaster Tools 验证并提交 sitemap。~~ 已完成（2026-11-12）。
3. GSC 和 GSC/Bing 流量数字暂时不补；需要复盘时再按本文档表格记录。
4. 部署 24–48 小时后补记 Cloudflare Web Analytics 首次 Page views / Visits。
