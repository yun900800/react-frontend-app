# 幸福瓶 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 在 Lab 实验区交付「幸福瓶」实验页：纯 CSS 玻璃瓶 + 可配置水色/株数/叶片数/每叶颜色/水母，light/dark 主题与移动端自适应。

**Architecture:** 复用组件 `HappinessBottle`（尺寸=CSS 变量三件套，内容物按 calc 比例定位，不走 transform scale）；颜色从单一 hex 由纯函数派生成 CSS 变量注入根节点；实验页 = 主舞台 + 逐株控制面板 + 底部静态陈列行。

**Tech Stack:** React 18 + CSS Modules（不新增依赖；不使用 framer-motion，全部 keyframes 纯 CSS，与原版一致）。

**Spec:** `docs/superpowers/specs/2026-11-06-happiness-bottle-design.md`（执行者必须先读；本文档与其中的 D1-D8、B1-B4 决策一并生效）

## Global Constraints

- **不新增任何 npm 依赖**（spec 非目标）。
- `npm run lint` 在本仓库不可用（缺 ESLint 配置），**不要补配置、不要排 lint 步骤**。
- UI 文案全部中文；组件/CSS 类名为英文。
- 主题：只依赖 `[data-theme='light'|'dark']`（`src/index.css` 已有令牌）；实验页内局部主题覆写只作用于页面容器，不得写 `localStorage`、不得改 `documentElement`。
- `@media (prefers-reduced-motion: reduce)` 下停用所有 keyframes。
- 不用整体 `transform: scale()` 做自适应；内容物定位一律 `calc()` 引用瓶壳变量。
- 原 prototype 参考：`https://yun900800.github.io/bottle/bottle-demo.html`（`bottle-style.css` 可随时抓取对照）。

## Review Focus

1. **换色不彻底**：改水色后仍残留原版蓝色（`rgba(0,204,255,…)` / `rgba(0,173,216,…)` 硬编码）。期望：所有水系颜色都来自派生变量，改一色全局成套变。测试：Task 4 Step V（临时挂 `waterColor="#ff00cc"` 逐项目检 + grep 检查）。
2. **n≠4 的叶子形态崩坏**：叶片重叠/超出瓶壁。期望：2..10 任意叶数形态正常、n=4 等于原版。测试：Task 5 Step V。
3. **dark 主题瓶子消失**：白玻璃描线在深底不可见。期望：dark 下玻璃件有可见（更低透明度）描边，暗部有残留高光。测试：Task 6 Step V。
4. **移动端横向滚动 / 装饰错位**：<768 断点创设产物溢出。期望：375px 宽无横向滚动条。测试：Task 7 Step V（375×812 目检）。
5. **reduced-motion 失效**：期望 emulate 减少动效后页面静止。测试：Task 6 Step V。

---

### Task 1: 调色纯函数 `palette.js`

**Files:**
- Create: `src/lab/happiness-bottle/utils/palette.js`

**Interfaces:**
- Produces（后续所有任务依赖，签名一字不改）:
  - `rgbToTriplet(hex) -> 'r,g,b'`：hex（`'#rgb'`、`'#rrggbb'`）→ 逗号三联字符串，非法输入抛 `Error`
  - `deriveWaterPalette(hex) -> { base: 'r,g,b', deep: 'r,g,b' }`：deep = base 在 HSL 上降 12% 亮度后的回写值
  - `deriveLeafPalette(hex) -> { front: 'r,g,b', back: 'r,g,b' }`：back = front 降 18% 亮度（默认绿 `#2cb62c` 时 back 必须为 `33,155,33`，即原版 `#219b21`）
- 消费约定：CSS 里写 `rgba(var(--hb-water-rgb), 0.35)` 形式（变量值为 `r,g,b` 三联串），所以函数返回三联串而非数组。

- [x] **Step 1: 实现 palette.js**（两个派生函数 + `shade(hex, lumDelta)` 内部 hsl 工具；水色 deep 的偏移量与叶色 back 的偏移量可复用 `shade`）

- [x] **Step 2: node 冒烟验证**

Run:
```
node --input-type=module -e "import('./src/lab/happiness-bottle/utils/palette.js').then(m=>{const w=m.deriveWaterPalette('#00ccff');console.log(JSON.stringify(w));const l=m.deriveLeafPalette('#2cb62c');console.log(JSON.stringify(l));});"
```
Expected: 第一行含 `"base":"0,204,255"`（原版蓝）；第二行含 `"back":"33,155,33"`。另试 `deriveWaterPalette('#abc')` 与 `rgbToTriplet('#zzz')`（应抛错）。

- [x] **Step 3: Commit**

```bash
git add src/lab/happiness-bottle/utils/palette.js
git commit -m "feat(lab): happiness-bottle palette derivation utils"
```

### Task 2: Lab 注册 + 页面骨架

**Files:**
- Modify: `src/lab/registry.jsx`（新增分组与 entry）
- Create: `src/lab/happiness-bottle/HappinessBottleLab.jsx`（骨架：仅页面标题 + 占位段落）
- Create: `src/lab/happiness-bottle/HappinessBottleLab.module.css`

**Interfaces:**
- Produces: registry entry `{ id:'happiness-bottle', title:'幸福瓶', description:'可配置水色与四叶草的玻璃瓶视觉实验。', path:'visual/happiness-bottle', fullBleed: true, load: () => import('./happiness-bottle/HappinessBottleLab') }`；分组 `{ id:'visual', label:'视觉实验', icon: GlassWater }`（lucide-react）。默认导出名固定 `HappinessBottleLab`。
- 参照 registry 现有分组写法（icon 来自 `lucide-react`，`GlassWater` 已存在）。

- [x] **Step 1: registry.jsx 添加 visual 分组（置于 motion 之后）+ HappinessBottleLab entry**

- [x] **Step 2: 骨架页面 + module.css（标题「幸福瓶」，暂用 `<p>` 占位说明）**

- [x] **Step 3: 运行验证**

Run: `npm run dev`（后台），访问 `http://localhost:5173/lab/visual/happiness-bottle`
Expected: 页面可打开，Lab 索引里出现分组「视觉实验」与卡片「幸福瓶」；控制台 0 error。

- [x] **Step 4: Commit**

```bash
git add src/lab/registry.jsx src/lab/happiness-bottle/
git commit -m "feat(lab): register happiness-bottle lab entry with page skeleton"
```

### Task 3: 瓶壳组件（尺寸自适应）

**Files:**
- Create: `src/lab/happiness-bottle/components/HappinessBottle.jsx`
- Create: `src/lab/happiness-bottle/components/HappinessBottle.module.css`
- Modify: `HappinessBottleLab.jsx`（主舞台挂 `<HappinessBottle />`）

**Interfaces:**
- Produces: `props = { size = 'md', waterColor = '#00ccff', clovers = [{ leaves: 4, leafColors: [] }], jellyfish = true, bubbles = true }`
- 瓶壳 CSS 变量命名（后续任务全部引用，勿改名）：组件根上按 `size` 设
  `--hb-main-w / --hb-main-h / --hb-top-h / --hb-neck-h / --hb-mouth-h / --hb-water-h`；
  sm=110/110/22/16/42/72，md=150/150/30/20/58/100，lg=210/210/42/28/78/140。断点缩放：<768 全档 ×0.85（同样用 calc 乘在变量定义处）。
- 结构重命名为 BEM 风格：`hbRoot > hbTop(hbMouth, hbHighlight) > hbNeck > hbMain(hbInner) > hbWater`，克隆原版对应的 border/radius/box-shadow 值（对照 bottle-style.css 逐条迁移，数值不变只改量词名）。桌面椭圆投影（`.bottle::before/::after`）本任务一并实现，默认蓝色阴影（Task 4 改变量化）。

- [x] **Step 1: 迁移瓶壳 markup + CSS**（比例定位：瓶颈/瓶顶宽度 `calc(var(--hb-main-w) - 40px/-58px)`；瓶内水面 `bottom: calc(var(--hb-main-h) - var(--hb-water-h))` 起算部分留 Task 4）。根元素加 `role="img"` + `aria-label="幸福瓶装饰"`（spec 让 builder 选，本计划定为 `role="img"`）

- [x] **Step 2: 验证**

Run: `npm run dev` + `npm run build`
Expected: dev 中 md 瓶观感≈原版（浅底白玻璃）；浏览器 375 宽与桌面各看一次，瓶子等比缩放、无横向滚动条。

- [x] **Step 3: Commit**

```bash
git add src/lab/happiness-bottle/components/ src/lab/happiness-bottle/HappinessBottleLab.jsx
git commit -m "feat(lab): happiness bottle shell with size scaling"
```

### Task 4: 水 + 颜色派生接线

**Files:**
- Modify: `components/HappinessBottle.jsx`（style 注入变量）
- Modify: `components/HappinessBottle.module.css`

**Interfaces:**
- Consumes: Task 1 `deriveWaterPalette`；Task 3 CSS 变量名。
- Produces: 组件根注入 `--hb-water-rgb`（=palette.base）、`--hb-water-deep-rgb`（=palette.deep）；CSS 内一切水的渐变/水面高光/水底反光/inset 光晕/外发光/桌面投影颜色全部改写为 `rgba(var(--hb-water-rgb), a)` / `rgba(var(--hb-water-deep-rgb), a)`，alpha 值照抄原版。瓶子 0 色残留。
- 本任务**不做**水内生物（Clover/Jellyfish/Bubbles 由 Task 5/6 补）。

- [x] **Step 1: 改写水层 markup（hbWater + 高光/反光伪元素）+ 变量化颜色**

- [x] **Step 2: 换色目检（Review Focus 1）**

Run: dev 中临时写死 `<HappinessBottle waterColor="#ff00cc" />`，逐项检查：水渐变、水面高光、底部反光、内壁光晕、外圈 glow、桌面椭圆投影全部变粉。
Expected: 全套一致；随后 grep `src/lab/happiness-bottle` 确认无 `204,255` / `0,173` 残留；还原默认蓝色并提交。

- [x] **Step 3: Commit**

```bash
git add src/lab/happiness-bottle/components/
git commit -m "feat(lab): water layer driven by configurable palette"
```

### Task 5: 四叶草（任意叶数 + 每叶颜色）

**Files:**
- Create: `src/lab/happiness-bottle/components/Clover.jsx`
- Create: `src/lab/happiness-bottle/components/Clover.module.css`
- Modify: `components/HappinessBottle.jsx`（渲染株数组）+ `.module.css`

**Interfaces:**
- Consumes: Task 1 `deriveLeafPalette`；Task 4 水色变量。
- Produces: `<Clover leaves={n} leafColors={[hex,...]} swayDelay={s} />`（n clamp 到 2..10）。
  - 叶片角 `i * (360/n) - 90`（i 从 0 计），n=4 时四片叶落在原版 ±45/135° 等价方位；
  - 叶长 `calc(var(--hb-water-h) * f(n))`，f(4)=原版叶高/水高之比，f(2)=f(4)×1.25，f(≤3)×1.15，f(n>4)=f(4)×max(0.62, sin(π·4/n))（公式精确值 builder 可在视觉验证中微调，n=4 必须=原版）；
  - 每叶色：叶主体 `rgba(var(--hb-leaf-rgb-i), 1)`——每片叶一个临时变量 `--hb-leaf-0..9` 由组件注入；叶背阴影色用 deriveLeafPalette.back；
  - 株定位：水内横向均匀分布（`left = (i+1)/(n+1) × 100%` 减去叶宽一半），`-2%~+2%` 确定性偏移（用株 index 作种子的伪随机，每次渲染稳定）；
  - 茎/藤线与摇摆动画照原版（动画 delay 按株错开 0/0.6/1.2s…）。

- [x] **Step 1: 实现 Clover 组件与株数渲染逻辑**

- [x] **Step 2: 形态目检（Review Focus 2）**

Run: dev 中把 props 临时设为 `{clovers:[{leaves:2},{leaves:3},{leaves:4},{leaves:6},{leaves:8},{leaves:10}]}` 平铺 6 只 md 瓶。
Expected: 2..10 无重叠无溢出；n=4 观感与原版一致；每叶独立换色（leafColors 长度 < 叶数时循环）。检查后还原 props。

- [x] **Step 3: Commit**

```bash
git add src/lab/happiness-bottle/components/
git commit -m "feat(lab): configurable clovers with arbitrary leaf counts"
```

### Task 6: 水母 + 气泡 + 主题与减动效适配

**Files:**
- Create: `components/Jellyfish.jsx`、`components/Jellyfish.module.css`、`components/Bubbles.jsx`、`components/Bubbles.module.css`
- Modify: `components/HappinessBottle.jsx`（jellyfish/bubbles 开关）+ `components/HappinessBottle.module.css`（dark 覆写 + reduced-motion + 幸运样式）
- Modify: `HappinessBottleLab.module.css`（页面底色用主题令牌）

**Interfaces:**
- Consumes: Task 4 变量；水色三联串。
- Produces: 水母/气泡颜色同样走 `--hb-water-rgb/-deep-rgb`（alpha 变体）；dark 主题覆盖规则集中在 `[data-theme='dark'] &:...` 或容器选择器：玻璃件透明度 ×0.5、噪声描边由 `rgba(255,255,255,0.5)` 降为 `rgba(255,255,255,0.22)`、瓶底投影保留水色 glow；水内物加一点水色 tint。页面局部主题：`HappinessBottleLab` 规定一个容器类 `[data-theme='force-dark']` / `force-light` 的子模块样式（Task 7 才接入切换按钮）。
- reduced-motion：三个 module.css 内 `@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }`（限本组件命名空间内）。

- [x] **Step 1: 处理 Jellyfish + Bubbles 迁移与开关**

- [x] **Step 2: dark / 主题覆写 + 减动效（Review Focus 3/5）**

Run: dev 中用项目 ThemeToggle 切 dark；再 DevTools Rendering 面板 emulate `prefers-reduced-motion`。
Expected: dark 下瓶/草/水/光晕完整可辨、差异明显；减少动效后页面完全静止。

- [x] **Step 3: Commit**

```bash
git add src/lab/happiness-bottle/components/ src/lab/happiness-bottle/HappinessBottleLab.module.css
git commit -m "feat(lab): jellyfish, bubbles, theme and reduced-motion support"
```

### Task 7: 控制面板（逐株）+ 局部主题预览

**Files:**
- Modify: `HappinessBottleLab.jsx`（useState 状态 + 面板 JSX）
- Modify: `HappinessBottleLab.module.css`（面板布局 + <768 纵排断点）

**Interfaces:**
- Consumes: Task 6 的组件 props。
- Produces（状态模型，给 Task 8/9 用）:
  - `const [config, setConfig] = useState({ waterColor:'#00ccff', clovers:[{leaves:4, leafColors:[]}], jellyfish:true, bubbles:true })`
  - 面板交互按 B1：株数步进（1..5）→ 逐株卡片（叶片数步进 2..10 + 每叶 `input[type=color]`）；水色选色器 + 四个 preset 按钮（蓝`#00ccff`/粉`#ff00cc`/黄`#fff014`/绿`#5ae600`）;水母/气泡 checkbox；**局部 light/dark 预览切换**（写容器 `data-theme`，不动全局和 localStorage）；「重置」按钮恢复默认 config。

- [x] **Step 1: 面板与状态接线**

- [x] **Step 2: 交互目检（Review Focus 4）**

Run: dev，桌面 1024 与移动 375×812 各一遍。
Expected: 桌面左瓶右面板；移动纵排无横向滚动；逐株增删改时瓶子即时更新、无闪烁跳位；局部预览切换不影响顶栏全局主题。

- [x] **Step 3: Commit**

```bash
git add src/lab/happiness-bottle/HappinessBottleLab.jsx src/lab/happiness-bottle/HappinessBottleLab.module.css
git commit -m "feat(lab): live config panel for happiness bottle"
```

### Task 8: 底部预设陈列行

**Files:**
- Modify: `HappinessBottleLab.jsx`（陈列行 JSX + `PRESETS` 常量）
- Modify: `HappinessBottleLab.module.css`

**Interfaces:**
- Produces: 常量 `PRESETS`（4~6 个 config 对象）复用面板 config 的同一 shape，直接喂 `<HappinessBottle size="sm" {...preset} />`；纯展示不可点、无 hover 状态。移动 <768 保留 3 个，横向 `overflow-x:auto`。

- [x] **Step 1: 陈列行 + 3 只移动端精简**

- [x] **Step 2: 验证**

Run: `npm run build` + dev 桌面/移动目检
Expected: 陈列行各瓶内容与主舞台互不影响；移动仅 3 只可横滑。

- [x] **Step 3: Commit**

```bash
git add src/lab/happiness-bottle/HappinessBottleLab.jsx src/lab/happiness-bottle/HappinessBottleLab.module.css
git commit -m "feat(lab): happiness bottle preset showcase row"
```

### Task 9: 验收清单全走查 + 文档收口

**Files:**
- Modify: `docs/superpowers/specs/2026-11-06-happiness-bottle-design.md`（勾掉验收清单）
- Modify: `docs/superpowers/plans/2026-11-06-happiness-bottle.md`（勾掉所有步骤）

- [x] **Step 1: 全量验证**

Run: `npm run build` → 0 error；dev 中按 spec「验收清单」逐条走查（含 Review Focus 全部 5 项）。
Expected: 清单全部通过；控制台 0 error / 0 warning。

- [x] **Step 2: 更新两份文档勾选状态并提交**

```bash
git add docs/superpowers/specs/2026-11-06-happiness-bottle-design.md docs/superpowers/plans/2026-11-06-happiness-bottle.md
git commit -m "docs: happiness bottle acceptance sweep"
```

- [x] **Step 3: 最终提交总结**（向用户报告：构建产物、验证结果、遗留项）
