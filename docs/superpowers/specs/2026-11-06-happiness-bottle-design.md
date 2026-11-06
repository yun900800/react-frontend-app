# 幸福瓶（Happiness Bottle）设计

日期：2026-11-06
状态：reviewed（builder check 完成，待用户最终确认）

## 意图与背景

参考原型：`https://yun900800.github.io/bottle/bottle-demo.html`（HTML + `bottle-style.css`，
纯 div/CSS 手绘立体水壶，无 JS、无图片）。用户希望在 react-frontend-app 中做一个 React 版本，
命名为「幸福瓶」，作为 Lab 实验区的一个实验页面。相比原版，新增两个配置维度：
**水色可配置**、**四叶草相关全可配（草的株数、每株的叶片数、每片叶子的颜色）**。

善意彩蛋场景：瓶中漂着四叶草，寓意"把幸福装进瓶里"。

## 原型技术事实（builder 可直接依赖，无需再抓取）

- 瓶壳由 3 个 CSS 变量推导尺寸：`--bottle-main-width`（150px）、`--bottle-main-height`（150px）、
  `--water-height`（100px）；瓶颈/瓶顶宽度均为 `calc(main-width - Npx)`。
- 结构：`.bottle` > `.bottle_top`（含 `.bottle_mouth` 瓶口、`.highlight`）→ `.bottle_neck` →
  `.bottle_main`（含 `.bottle_inner` 内壁、`.highlight`）。桌面投影用 `.bottle::before/::after`
  的 `border-radius: 46px/10px` 椭圆 + 彩色阴影（阴影颜色跟水色成套）。
- 玻璃质感全部来自半透明白色（`rgba(255,255,255,0.3~0.7)`）的 border / box-shadow inset / 渐变 highlight。
- 水 `.water`：`linear-gradient(-85deg, 基色35%, 深色55% 70%, 深色40%)`；水面高光 `:after`、
  水底反光 `:before`；inset 光晕 shadow 与外发光全部基于水的 RGB（如蓝为 `0,204,255`，
  深 `0,173,216`）。原版有 `.pink/.yellow/.green` 整套配色变体，都是把同一套 alpha 结构
  应用到另一组 RGB 上。
- 内容物（均为绝对定位 px，与瓶壳变量无关联——这是原版的缺陷，见"自适应"）：
  - 四叶草 `.clover`：`.leaves > .leave × 4`（rotate ±45/135°，`transform-origin` 在叶柄根部），
    叶色 `#2cb62c`、阴面 `#219b21`；茎 `.branch` 用 border-bottom 弧线；整株有 4s 摇摆动画。
  - 水母 `.jellyfish`：头 + 尾，两层 scale 呼吸动画，4s 游动。
  - 气泡 `.bubble × 3`：两条 keyframes（微扰漂动 + 上升破裂，4s infinity）。
- 页面背景 `#ddd`，13 只瓶子 `flex-wrap` 并排。

## 需求（已与用户确认）

1. **放置**：Lab 实验区新增一个"幸福瓶"实验页（全页 demo），不是产品页面。
2. **自适应**：瓶子尺寸随手机/桌面自适应。
3. **水色可配置**。
4. **四叶草可配置**：
   - 草的株数可配置；
   - 每株的**叶片数目**可配置（不限 4 片，n≠4 时按 `360°/n` 等分旋转）；
   - **每片叶子**的颜色可配置。
5. **主题适配**：背景 light/dark 跟随项目主题切换；瓶身（玻璃件）必须两种主题下都成立。

## 非目标（Non-goals）

- 不接入任何后端/持久化，配置只在页面内存中（刷新还原默认）。
- 不做分享/导出图片功能。
- 不在产品区（books/portal/auth）任何位置内嵌。
- 不追求逐像素复刻原版；追求同等质感 + 更好的工程化。

## 反目标（Anti-goals，出现即算失败）

- 缩放后瓶内装饰物错位/溢出瓶壁（重蹈原版 px 定位缺陷）。
- dark 模式下瓶子"消失"（白玻璃在深色背景上不可见）。
- 动画导致低端手机明显掉帧（动画只用 transform/opacity，不 paint 大面积）。
- 忽略 `prefers-reduced-motion`（项目既有惯例必须遵守）。

## 已确认的设计决策（用户拍板）

- D1. 实验页面形态：主舞台大瓶子 + **实时控制面板** + 底部一排小瓶子成品预设（陈列感）。
- D2. 控制面板内容：水色选色器 + 蓝/粉/黄/绿四个原版 preset、株数步进器、
  每株叶片数步进器、每片叶色选色器、水母开关、light/dark 预览切换。
- D3. 叶片配置 API 允许任意 n，不限于四叶（n=4 回退到原版造型）。

## 由我拍板的默认值（builder 可沿用，用户可推翻）

- D4. 组件 API（见下节），文件落在 `src/lab/happiness-bottle/`。
- D5. registry：在 `src/lab/registry.jsx` 新增分组 `visual`（label「视觉实验」，
  icon 用 lucide `GlassWater`），entry `id: 'happiness-bottle'`，`path: 'visual/happiness-bottle'`，
  `fullBleed: true`，`load: () => import('./happiness-bottle/HappinessBottleLab')`。
- D6. 自适应策略：瓶壳继续走 CSS 变量；在断点（>=1024 / 768–1023 / <768）给组件根
  覆写 3 个尺寸变量；**内容物不再用 px 绝对定位**，改为全部以 `--bottle-main-width` /
  `--water-height` 的 calc 比例定位（或等价的百分比 + `em` 缩放），保证任意尺寸等比成立。
  不用 `transform: scale()` 整体缩放（缩放会让阴影模糊、文字/锯齿劣化，且断点間跳变）。
- D7. 颜色派生：对外只收一个水色 hex；内部把 hex 解析为 RGB，生成与原版结构完全一致
  的三阶渐变（基色 40% 亮度偏移）与配套 shadow/glow；叶色同理（每片叶收 hex，
  自动派生阴面色）。派生逻辑放 `deriveWaterPalette.mjs`（纯函数，可单测）。
- D8. 主题：组件只读项目既有 `[data-theme]`（`src/index.css` 的 `:root[data-theme=light/dark]`），
  不自行管理主题；实验页内的「light/dark 预览切换」仅操作本页容器内的局部
  `data-theme` 属性（局部容器覆写，不影响全局），默认跟随全局。

## 组件 API

```jsx
<HappinessBottle
  size="md"                // 'sm' | 'md' | 'lg'：预设尺寸档（内部映射为三变量值）；
                           // 未来页面级调用也可不传 size，由容器宽度决定
  waterColor="#00ccff"     // 水色 hex；默认蓝（原版）
  clovers={[               // 默认一株 4 叶绿草（回退原版）
    {
      leaves: 4,           // 2–10，等分 360°/n
      leafColors: [],      // 按叶序 hex；空数组 → 默认绿；少于叶数 → 循环；多于 → 截断
    },
  ]}
  jellyfish={true}         // 水母是否在场
  bubbles={true}           // 气泡是否在场（面板可关，默认开）
/>
```

- `clovers` 长度即株数（1–5 株）；>1 株时横向分布在水域内，允许 ±10% 随机化横向偏移
  （确定性偏移用伪随机种子 = 株 index，避免每次渲染跳变）。
- n 片叶的形态规则：叶片长度 `min(16px, 34px * sin(180°/n) 的比例因子)` 的比例表示；
  n=4 时精确等于原版 16px/10px 叶形。茎与阴面规矩保持原版。

## 实验页面布局（HappinessBottleLab）

- 桌面（>=1024）：左主舞台（大瓶居中，背景用主题底色 + 水色微光晕），右控制面板（宽约 320px），
  底部通栏小瓶陈列行（4–6 只预设）。移动（<768）：纵向排列，面板在瓶子下方；断点规范
  遵循 product-lab-split 设计文档（>=1024 / 768–1023 / <768）。
- 面板控件用项目已有 UI 基元（如有原生 input range/color 即先满足功能，样式从简）。
- 文案中文。

## 无障碍与动效

- `prefers-reduced-motion: reduce` 时：全部 keyframes 暂停/移除（静态构图），交互仍可用。
- 瓶子为纯装饰，`aria-hidden` 或 `role="img"` + `aria-label="幸福瓶装饰"`（二选一，builder 定）。
- 控制面板可键盘操作（原生控件天然满足）。

## 交付文件（建议）

```
src/lab/happiness-bottle/
├── HappinessBottleLab.jsx     # 实验页（主舞台 + 面板 + 预设陈列）
├── HappinessBottleLab.module.css
├── components/
│   ├── HappinessBottle.jsx    # 复用组件（对外 API）
│   ├── HappinessBottle.module.css
│   ├── Clover.jsx (+ .module.css)
│   ├── Jellyfish.jsx (+ .module.css)
│   └── Bubbles.jsx (+ .module.css)
└── utils/
    └── deriveWaterPalette.mjs # hex → { base, dark, light, shadow 系列 } 纯函数
src/lab/registry.jsx           # 新增 visual 分组 + entry（D5）
docs/superpowers/specs/2026-11-06-happiness-bottle-design.md
```

## 验收清单

- [x] `npm run build` 通过；无新依赖。
- [x] `/lab/visual/happiness-bottle` 出现在 Lab 索引分组「视觉实验」下并可打开。
- [x] 水色：换任一 hex 后，水渐变、水面高光、底部发光、外圈 glow、气泡色全部成套变化（无遗留蓝色）。
- [x] 叶片：n=2..10 均形态正常无重叠；n=4 与原版观感一致；每片叶可独立换色。
- [x] 株数 1–5 分布自然；换配置页面不闪烁/不跳位。
- [x] light / dark 两主题：瓶子、草、水、光晕均完整可辨（合理明度范围内，见 B4）；
  实验页内局部主题预览不污染全局主题。
- [x] 375×812 移动端：瓶子缩放、面板纵排、无横向滚动条。
- [x] `prefers-reduced-motion` 下静态呈现。
- [x] 控制台 0 error / 0 warning。

## Builder Check 议定（2026-11-06，第二轮）

- B1. **控制面板按「逐株编辑」实现**（a/b 之选：b）。株数 >1 时出现分株编辑器
  （每株一个小卡片：叶片数步进 + 该株叶色选色器组），株数 =1 时退化为单套控件。
  依据：用户原话"每株的叶片数、每片叶的颜色都能配置"，逐株独立是字面要求。
- B2. **底部陈列行为静态陈列，不可点**。内容 = 4~6 只 size="sm" 的组合预设
  （水色四 preset × 不同叶片数/叶色变体），纯展示组件可复用性；移动端
  <768 保留但压缩为 3 只可横向滑动。
- B3. **size 与断点的契约（本次范围）**：`size` 是基准档，断点对其做系数缩放
  （无视口时也能工作）；**容器级自适应（ResizeObserver / 容器查询）本次不做**，
  留给未来正式嵌入产品页面时再升级。
- B4. **极端水色不加纠偏**：派生函数按传入 hex 原样渲染（保持"颜色可配置"的诚实），
  仅在 dark 主题下给水与光晕一点统一的最小可见度处理；验收第 6 条措辞修正为
  "在合理明度范围内（非近黑/近背景色）两主题下完整可辨"。



- 具体断点数值档位对应的 3 变量具体值（sm/md/lg 的基准尺寸表）。
- 叶长比例因子的精确公式与调参（要求：n=4 时=原版）。
- 面板控件的具体组件选型/样式。
- `role="img"` 与 `aria-hidden` 的选择、各 aria 文案。
- 动画时序的微调（保持 4s 周期感即可）。
- 派生函数的具体色彩空间算法（HSL 或 RGB 偏移均可，需通过验收清单第 3/4 条）。


## 验收记录（2026-11-06）

- 
pm run build 通过（vite 5.4.20，5.31s）。
- 页面：/lab/visual/happiness-bottle，Lab 侧栏「视觉实验」分组可选。
- 水色：#ff00cc 预设与自定义 #7f3fff 均全链路生效（--hb-water-rgb = 127,63,255）。
- 叶数 2/3/4/6/8/10 目检通过；n=4 与原版一致；每叶独立颜色验证通过（--hb-leaf-0-c = 255,59,48）。
- 株数 1–5：深度错落、横向均布、z 交替；5 株无「绿篱」感。
- light/dark：全局主题切换与页面级局部预览均成立；局部预览不污染 documentElement。
- 375×812：doc scrollWidth 360 < 375，无横向滚动；面板纵排；陈列行 3 只。
- prefers-reduced-motion: reduce 下 clover/jellyfish/bubble 动画均为 none；正常态动画生效。
- 控制台 0 error / 0 warning。

## 终审修复记录（2026-11-06）

审查（1 Critical + 5 Important + 14 Minor）后的唯一修复轮，全部验证：

- 修复 C1：Clover 深度错落/稀疏系数此前未提交，已随本提交入库（工作树=HEAD）。
- 修复 I2/I3：玻璃件白色系收敛为主题变量（`--hb-line/-strong/--hb-white-*`），按「最近 data-theme 作用域」取值；瓶子接受 `theme` prop。已验证叉乘：全局 dark + 局部 light → 描边 0.5 / lab 底 oklch 浅色 / 无 water filter；全局 light + 局部 dark → 描边 0.22 / lab 底 #0f1115 / filter 生效。同时把 `--color-*` 令牌改为 `oklch(var(--...))` 正确用法，激活色环恢复。
- 修复 I4：舞台光晕改用 `rgba(var(--hb-stage-rgb), .08)`，随水色联动（粉 preset 后 computed 为 rgba(255,0,204,0.08)）。
- 修复 I5：改为「周长预算」叶宽 `--hb-leaf-w = len × min(0.625, 2.59/n)`，恢复计划叶长公式；5 株×10 叶由圆点变为可辨叶盘（叶宽 4.1px）。
- 修复 I6：叶数变化时物化 `leafColors`（与 Clover 循环规则一致），面板与瓶内一致（4→6 叶后 input[5]=#ff3b30 对应 --hb-leaf-4-c=255,59,48）。
- `npm run build` 通过（6.33s）；控制台 0 error / 0 warning；375 宽无横向滚动（回归）。
- 审阅的 Minor（定位右偏、数字输入逐键夹取、非法 hex 兜底、陈旧的 Task 注释、水母未取水色、茎色随叶 0、陈列 aria 标签）按规则记录为 deferred minors，不在本轮修复。
