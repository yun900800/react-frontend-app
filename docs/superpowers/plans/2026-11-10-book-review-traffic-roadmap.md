# 书评站流量增长里程碑

日期：2026-11-10
状态：M0 收尾，M2/M3 主体进行中（2026-11-12 更新）
目标：把 `home.bayh.pp.ua` 从书评展示页变成可持续获取自然搜索流量的公开书评站。

## 总体判断

流量 = 技术 SEO + 内容量 + 分发。10–12 周先建好“能被收录、能被搜索、能被内链、能被分享”的引擎；自然流量通常需要 3–6 个月起量。

## 里程碑

| 里程碑 | 周期 | 核心交付 | 验收 / 指标 |
|---|---|---|---|
| **M0 基线与 SEO 地基** | 第 1 周 | Analytics、Google Search Console、Bing Webmaster；canonical 域名与 URL 规则；robots.txt、sitemap.xml、404、基础 meta；速度基线 | GSC/Bing 验证成功；sitemap 已提交；每页有唯一 title/description；拿到基线报告 |
| **M1 内容模型与发布流程** | 第 2–3 周 | slug、标签、分类、系列、作者、status、published_at、SEO 字段、阅读时长、封面上传 | 发布一篇带标签/封面/SEO 字段的书评；草稿不公开；旧 URL 有重定向 |
| **M2 发现与内链** | 第 3–4 周 | 关键词搜索、标签页、作者页、系列页、相关书评、面包屑、分页 SEO；每页 3+ 内链 | 搜索按标题/作者/标签命中；标签页可收录；每篇有同标签/同作者/相关内链 |
| **M3 渲染与结构化数据** | 第 5–6 周 | 动态 title/description/OG；JSON-LD（Book/Review/Breadcrumb）；RSS；自动 sitemap；图片压缩/懒加载；预渲染方案 | 爬虫能看到渲染后的 HTML；Rich Results 通过；Core Web Vitals 达标；RSS 可订阅 |
| **M4 内容生产引擎** | 第 7–8 周 | 编辑日历、定时发布、AI 辅助标题/SEO 描述/标签/大纲、内容模板、发布检查清单 | 新增 20–30 篇可收录页面；稳定每周 3–5 篇或 2 篇长文 |
| **M5 分发与增长** | 第 9–10 周 | 分享卡片、邮件订阅、站外分发、外链建设、GSC 查询复盘 | 有订阅入口；有站外引用/外链；自然搜索 impressions 开始上升 |
| **M6 复盘与扩展** | 第 11–12 周 | 按 GSC 查询优化标题和内链；合并/删减薄内容；系列/书单；下一季度计划 | 流量复盘 + 下一季度内容计划 |

## M0 任务清单

### 代码侧

- [x] 保存本里程碑文档
- [x] 修正 `index.html` 默认 title/description/OG，改为公开书评站定位
- [x] 增加 `public/robots.txt`，屏蔽后台路由并指向 sitemap
- [x] 增加 `scripts/generate-sitemap.mjs`，构建前从公开 API 生成 `public/sitemap.xml`
- [x] 增加公开页动态 meta（title、description、canonical、OG、robots）
- [x] 404 页设置 `noindex`，并引导回公开首页
- [x] 增加 `.htaccess`：SPA fallback、index 不缓存、静态资源长缓存
- [x] 生成并提交 `public/sitemap.xml`
- [x] 本地构建验证
- [x] 部署到 WebHostMost，验证线上首页/详情页 meta 与 sitemap
- [ ] Cloudflare 清除 `/robots.txt` 的旧缓存（当前边缘节点仍返回旧 SPA HTML，约 4 小时 TTL）

### 需要账号/人工完成

- [ ] Google Search Console 验证 `home.bayh.pp.ua`，提交 `sitemap.xml`
- [x] Bing Webmaster Tools 验证并提交 sitemap（2026-11-12）
- [x] 选择并接入轻量统计（Cloudflare Web Analytics，2026-11-12 上线）
- [x] 验证线上 beacon：28 个 HTML 均注入，RUM POST 返回 204
- [ ] 确认 canonical 域名：短期保持 `https://home.bayh.pp.ua`，后续再评估是否迁到主域
- [ ] 在 GSC 记录当前索引页数、impressions、平均排名作为基线

## 关键决策

### canonical 域名

短期保持 `https://home.bayh.pp.ua`，避免迁移风险。所有 canonical、OG、sitemap 都指向该域名。后续如果内容量放大，再评估迁到 `bayh.pp.ua` 主域或独立域名。

### SEO 渲染

M0 先做动态 meta + sitemap；M3 再解决预渲染。公开站是 Vite SPA，百度和部分爬虫对 JS 渲染不稳定，M3 必须二选一：

- 方案 A（推荐先做）：保留 SPA，构建时预渲染书籍列表/详情页。
- 方案 B（更彻底）：公开站迁到 Astro/Next.js 静态生成，后台继续用 React 管理端。

## 内容节奏

- 每周 2–3 篇新书评
- 每周优化 1 篇旧文（标题、首段、内链）
- 每篇 1 个主关键词 + 2–3 个长尾词
- 每篇至少 3 条站内内链
- 周五看 GSC：优先优化“有曝光、排名 10–30”的页面

## 现在不做

评论系统、会员/付费、PWA、复杂推荐、多人协作、多租户。等有稳定流量后再做。
