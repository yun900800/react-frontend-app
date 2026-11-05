# 首页书评翻书 UI（Review Flipbook）设计

日期：2026-11-05
状态：待确认

## Intent

当前公开门户首页（`/`）是书籍卡片网格，点卡片进入 `/books/:id` 看评论。
用户喜欢 `BookPreview`（Codrops BookBlock demo）里 "Look inside" 的全屏翻书效果，希望在首页每本书上增加一个入口，点击后用同一套 UI 翻看这本书的评论。

## Goals

- 首页每张书籍卡片增加「翻书看评论」入口（书籍有评论时才显示）
- 点击后停留在首页，弹出全屏浮层，完整还原：**封面打开 → 放大到全屏 → 翻页 → 关闭收回**
- 一个跨页展示两条评论（左页一条、右页一条）
- 桌面端和移动端都可用；尊重 `prefers-reduced-motion`
- 不改后端、不改数据库

## Non-goals

- 不替换 `/books/:id` 详情页
- 不在浮层里提供评论的增删改
- 不重做首页卡片网格布局
- 不改后台编辑器 / 工作台

## 已确定的决策

- 入口形态：首页卡片 + 全屏浮层（不新增路由）
- 排版：一个跨页 = 两条评论
- 评论顺序：最新在前（与详情页一致）
- 还原程度：包含开合动画，不只是翻页

## 现有可复用资产

| 资产 | 路径 | 用途 |
|---|---|---|
| BookBlock（React 版） | `src/features/books/components/BookReader/BookBlock.jsx` | 3D 翻页 + 触摸滑动 + 首末页 |
| FlipPage | `.../BookReader/FlipPage.jsx` | 单次翻页动画与阴影 |
| 全屏用法参考 | `src/features/home/pages/FullPageBookApp.jsx` | 整屏 + 木纹背景 + BookBlock |
| 木纹背景 | `src/assets/resources/3d-book-images/wood.jpg` | 浮层背景 |
| 评论消毒 | `src/features/editor/utils/sanitizeHtml.js` | 富文本评论安全渲染 |
| 响应式 | `src/shared/hooks/useMediaQuery.js` | 移动端 / 减少动效判断 |
| Toast/Dialog | `src/shared/components`、`src/features/books/components/Dialog.jsx` | 关闭逻辑、锁滚动参考 |
| 图标 | `lucide-react` | 关闭、翻页箭头 |

数据：`GET /api/public/books` 的每本书已内嵌 `reviews`（`id/reviewer/chapter_title/content/created_at`），首页无需额外请求。

## 结构设计

### 1. 纯函数：把书籍转成跨页数据

新增 `src/features/portal/utils/buildReviewSpreads.js`

```js
buildReviewSpreads(book) -> {
  cover: { type: 'cover', title, author, coverUrl, fontColor, firstChar, preface },
  spreads: [
    { type: 'reviews', left: review|null, right: review|null },
    ...
  ]
}
```

规则：
- 封面单独作为第 0 个跨页
- 评论按 `created_at` **倒序**（最新在前）排序，与 `/books/:id` 详情页保持一致；时间相同或缺失时按 `id` 倒序兜底
- 排序后每 2 条一组；奇数时右侧为 `null`
- 不修改原始数据，返回新数组（纯函数，便于单测）

### 2. 浮层组件

新增 `src/features/portal/components/ReviewBookOverlay.jsx` + `.module.css`

Props：`{ book, open, onClose }`

内部状态机：`closed → opening → open → closing → closed`

打开时序（对齐 Codrops 的 500ms + 500ms）：
1. 浮层根节点挂载，背景淡入
2. 约 500ms：中央的 3D 闭合书本执行封面打开 + 放大（`openSmallBook` / `scaleUpSmallBook`）
3. 约 500ms：全屏书页容器淡入 + 放大（`openBigBook`），首次进入跳到第 0 页
4. 容器内渲染 `BookBlock`

关闭时序：
1. `closeBigBook` 500ms
2. 封面合上 + 书本缩小（`closeSmallBook` / `scaleDownSmallBook`）
3. 卸载、解锁滚动、把焦点还给触发按钮

交互：
- 右上角关闭按钮
- `Esc` 关闭
- 点击背景关闭（正在翻页时不打断动画，只排队关闭）
- 打开时锁定 `body` 滚动并记录滚动位置，关闭时恢复
- 打开动画期间不重复触发

可访问性：
- `role="dialog"` `aria-modal="true"` `aria-label="{书名} 书评"`
- 打开后焦点落在关闭按钮；关闭后焦点回到触发元素
- 减少动效模式（`prefers-reduced-motion: reduce`）：跳过 3D 开合，直接淡入/淡出

### 3. 书页内容

`BookBlock` 的每个 `pages` 元素是一个跨页，内部两个 `.bb-custom-side`：

- 封面跨页：左页 = 封面（`cover_url`，没有则用 `font_color` 渐变 + 首字），右页 = 书名 / 作者 / 序言
- 评论跨页：左页/右页各一条评论
  - 顶部：评论者、章节标签、日期
  - 正文：`dangerouslySetInnerHTML` + `sanitizeHtml(review.content)`
  - 正文超出页高时页内滚动（`overflow-y:auto`）
- 空评论：不显示入口按钮，浮层不会打开

### 4. 首页卡片入口

修改 `src/features/portal/components/BookCard.jsx` / `.module.css`

- 根节点从 `<Link class="card">` 改为 `<div class="card">`（避免 `<a>` 嵌套 `<button>`）
- 封面和标题仍然包在 `<Link to={/books/:id}>` 内
- footer 增加按钮：`BookOpen` 图标 + 「翻书看评论」
- `reviewCount === 0` 时按钮隐藏或禁用
- 按钮 `type="button"`，键盘可聚焦

修改 `src/features/portal/pages/PortalHomePage.jsx`
- 增加 `activeBook` 状态
- 把 `onOpenReviews(book)` 传给 `BookCard`
- 页面底部渲染一个 `ReviewBookOverlay`

### 5. `BookBlock` 接入前的小修

- 去掉 `navigate` 里的 `console.log`
- 把固定 `id="bb-bookblock"` 改成 `useId()`（避免与 lab/calendar 等页面实例冲突）
- `aspectRatio: width/height` 在传入 `%` 时会得到 `NaN`，加保护：只有数值单位才设置
- 导航链接补图标与 `aria-label`（见下）

### 6. 导航样式

`src/features/books/components/BookReader/nav.module.css`
- 当前 4 个链接是 `font-size:0` 的空白色块
- 用内联 SVG data URI 或改用 `lucide-react` 图标，补首/上一页/下一页/末页
- 确保键盘 focus 可见
- 该样式是共享的，改动会同时改善 lab / 日历 / FullPageBookApp，属于可接受的统一修复

## 动画与样式

从 `C:\Users\86135\Desktop\code\BookPreview\css\component.css` 移植（按需裁剪）：

- `.perspective` / `.book` / `.cover` / `.front` / `.inner-left` / `.inner-right`（3D 书本）
- `.bb-custom-wrapper`（全屏容器、左右书脊渐变）
- `.bb-custom-side`（左右页、中缝阴影）
- keyframes：`openSmallBook`、`closeSmallBook`、`scaleUpSmallBook`、`scaleDownSmallBook`、`openBigBook`、`closeBigBook`

颜色不照搬 Codrops 的固定色，改用门户主题 token（`--color-background`、`--color-foreground`、`--color-primary` 等），暗色模式跟随主题。书页本身保持纸张浅色。

## 移动端

- `<= 768px`：`.bb-custom-side` 改为宽 100% / 高 50% 上下排列（沿用 Codrops 的断点策略）
- 浮层留出安全区域，关闭按钮不遮挡内容
- 翻页方向沿用 `FullPageBookApp` 的现有行为（移动端 `horizontal`），实现时以真机视觉为准调整

## 实现约定（设计评审后补充）

以下 4 点由实现方拍板，写进本文件供后续执行参考：

1. **减少动效模式**：不另做一套网格视图。仍然使用翻书，但跳过 3D 开合与 3D 翻页——`BookBlock` 在 reduce 模式下把翻页时长设为 0 并用同步回调结束（不依赖 `transitionend`）。这样只有一条渲染路径。
2. **关闭生命周期**：`onClose` 只在关闭动画（约 1s）结束后触发，父组件收到后才清空 `activeBook` 并卸载浮层。不支持外部 `open=false` 强制中断（本项目没有路由切换场景）。
3. **动画期间关闭**：打开动画进行中收到关闭请求（X / Esc / 背景点击）时**排队**，等待进入 `open` 后立即执行 `open → closing`。不在 `opening` 中途反向。
4. **可访问性范围**：与仓库现有 `Dialog` 保持一致——`role="dialog"`、`aria-modal`、Esc、初始焦点、焦点恢复、锁滚动；**不做完整 focus trap，也不设置背景 `inert`**（接受与现有 Dialog 相同的能力缺口）。评论正文滚动区加 `tabIndex={0}`，保证键盘用户能滚动长文。

## 受影响文件

新增：
- `src/features/portal/utils/buildReviewSpreads.js`
- `src/features/portal/components/ReviewBookOverlay.jsx`
- `src/features/portal/components/ReviewBookOverlay.module.css`

修改：
- `src/features/portal/components/BookCard.jsx`
- `src/features/portal/components/BookCard.module.css`
- `src/features/portal/pages/PortalHomePage.jsx`
- `src/features/books/components/BookReader/BookBlock.jsx`
- `src/features/books/components/BookReader/nav.module.css`

后端：无改动。

## 验证

- `buildReviewSpreads` 用一次性 Node 脚本覆盖：0 条、1 条、2 条、奇数条、缺封面
- 本地 `npm run dev`，用 Playwright 在 `/` 验证：
  - 有评论的书显示入口，无评论的不显示
  - 点击后完成「封面打开 → 全屏 → 翻页 → 关闭」全流程
  - 控制台无报错、无 `console.log` 噪音
  - 移动端视口（375x812）可用
- `npm run build` 通过
- 仓库当前没有 ESLint 配置，`npm run lint` 不可用（既有问题，不在本次范围）

## 风险

- `BookBlock` 是实验/lab 代码，翻页在边界、快速连点、RTL 下的行为需要在浮层里重新验证
- 两条评论跨页 + 长正文可能撑破页面，必须限制页高并允许页内滚动
- 开合动画与滚动锁定的时序若处理不好会出现背景跳动
- 浮层同时只渲染一个 `BookBlock` 实例，避免固定 id / 动画冲突
