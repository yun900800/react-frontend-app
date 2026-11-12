# Core Web Vitals 快照：2026-11-12

站点：https://home.bayh.pp.ua  
工具：Lighthouse 12.8.2 + Playwright Chromium（本地 headless）  
说明：PageSpeed Insights API 连续返回 429，改用本地 Lighthouse。以下为 lab data，不是真实用户 field data。

## 测试页面

- 首页：`https://home.bayh.pp.ua/`
- 详情页：`https://home.bayh.pp.ua/books/bai-nian-gu-du`

## 结果

| 页面 | 设备 | Performance | SEO | Accessibility | Best Practices | FCP | LCP | TBT | CLS |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 首页 | 移动端 | 91 | 100 | 95 | 100 | 2.0 s | 2.0 s | 230 ms | 0 |
| 详情页 | 移动端 | 83 | 100 | 95 | 100 | 1.5 s | 3.8 s | 160 ms | 0 |
| 首页 | 桌面端 | 95 | 100 | 95 | 100 | 1.0 s | 1.0 s | 20 ms | 0 |
| 详情页 | 桌面端 | 84 | 100 | 95 | 100 | 1.3 s | 2.0 s | 10 ms | 0 |

补充：

| 页面 | 设备 | Speed Index | TTI | 总传输量 |
|---|---|---:|---:|---:|
| 首页 | 移动端 | 4.5 s | 4.2 s | 777 KiB |
| 详情页 | 移动端 | 4.6 s | 4.1 s | 483 KiB |
| 首页 | 桌面端 | 1.7 s | 1.4 s | 776 KiB |
| 详情页 | 桌面端 | 1.9 s | 2.0 s | 526 KiB |

## 主要发现

1. **SEO、Accessibility、Best Practices 都很好**：四组测试均为 SEO 100、Accessibility 95、Best Practices 100。
2. **唯一需要关注的指标是详情页移动端 LCP 3.8 s**，处于 Lighthouse 的“需要改进”区间，但还没有超过 4 s。
3. 详情页 LCP 元素是书籍封面：

   ```html
   <img class="_cover_" src="https://short.bayh.pp.ua/ihLVH" alt="百年孤独">
   ```

   它经过一次短链跳转：

   `short.bayh.pp.ua/ihLVH` → `img.bayh.pp.ua/2026/11/20261110-175812-6kno9q-images.jpg`

   移动端 LCP 时间构成里，Load Delay 约 1.98 s，是主要成本。
4. 首页移动端 TBT 230 ms，略高于 200 ms 的“good”参考线，但 Performance 仍有 91，暂不构成问题。
5. 桌面端详情页 Performance 84，但 LCP 2.0 s、CLS 0、TBT 10 ms，实际体验指标正常；分数受 LCP 图片和渲染阻塞影响。
6. 主要机会：
   - `prioritize-lcp-image`：预计节省约 1,160 ms（移动端详情页）
   - `server-response-time`：约 470–510 ms
   - `render-blocking-resources`：约 275 ms（移动端详情页）

## 判断

**不需要现在专门做 Core Web Vitals 项目。**

理由：

- 首页移动端 Performance 91，已经很好。
- 四组页面 SEO 都是 100，Best Practices 100，Accessibility 95。
- 详情页移动端 Performance 83，唯一明显短板是 LCP 3.8 s；原因是封面图短链跳转，不是整体架构问题。
- 当前最大的流量瓶颈仍是内容量和收录，不是性能。

## 建议只做一个小修复

优先做低风险、收益明确的一项：

1. 给详情页封面图加 `fetchpriority="high"`，保持 eager，不要 lazy。
2. 更彻底的做法：把 `cover_url` 从 `short.bayh.pp.ua/...` 换成 `img.bayh.pp.ua/...` 直链，去掉一次重定向。这个改动对详情页 LCP 更有效。
3. 做完后只复测详情页移动端，目标 LCP < 2.5 s。

暂时不做：

- 关键 CSS 内联
- JS 代码分割
- Cloudflare HTML 缓存策略改造
- 图片 CDN/格式迁移

这些等自然流量起来或页面明显变慢后再处理。

## 复测触发条件

- 详情页移动端 LCP 超过 4 s
- 首页或详情页 Performance 低于 70
- 大改版、增加大量第三方脚本、或图片明显变多
- 自然流量开始起量后，每月复测一次
