# SEO 与统计基线：2026-11-12

站点：https://home.bayh.pp.ua  
API：https://bayh.pp.ua  
记录时间：2026-11-12

## 内容基线

由 `npm run seo:baseline` 从公开 API 和线上 sitemap 读取：

| 指标 | 当前值 |
|---|---:|
| 公开书籍 | 15 |
| 公开书评 | 44 |
| 分类数 | 1 |
| 标签数 | 5 |
| 系列数 | 2 |
| sitemap 可发现 URL | 28 |
| 最早书籍日期 | 2025-11-03 |
| 最新书籍日期 | 2026-11-11 |

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

| 指标 | 当前值 |
|---|---:|
| 已编入索引页数 | 待填 |
| Impressions | 待填 |
| Clicks | 待填 |
| CTR | 待填 |
| 平均排名 | 待填 |

数据位置：Bing Webmaster Tools → Search Performance → 选择日期范围。

## Cloudflare Web Analytics 基线

| 项目 | 状态 |
|---|---|
| 接入方式 | 手动接入（构建后注入 beacon） |
| 代码状态 | 已完成，等待 `CLOUDFLARE_ANALYTICS_TOKEN` |
| 首次数据 | 部署后 24–48 小时 |
| 当前 Page views / Visits | 待首次数据 |

查看位置：Cloudflare Dashboard → Analytics & Logs → Web Analytics → `home.bayh.pp.ua`。

接入步骤见 `docs/analytics-setup.md`。

## 已知限制

1. Cloudflare Web Analytics 不记录查询参数 / UTM，来源细分能力有限。
2. 广告拦截器会拦截 beacon，报表会低于真实访问。
3. GSC/Bing 的“已编入索引页数”是搜索引擎侧数据，不等于 sitemap URL 数。
4. sitemap 当前 28 个 URL，其中包含首页、About、3 个分类索引和 8 个分类详情页；后续新增书籍或分类后需要重新部署并更新本基线。

## 下一步

1. 在 Cloudflare 获取 Web Analytics token，写入 `.env.production.local` 并部署。
2. 登录 GSC/Bing，把上表“待填”替换为实际数字。
3. 部署 24–48 小时后补记 Cloudflare Web Analytics 首次 Page views / Visits。
4. 之后每周五更新一次 GSC/Bing 的 impressions、平均排名和索引页数。
