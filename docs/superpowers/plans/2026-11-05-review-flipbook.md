# 棣栭〉涔﹁瘎缈讳功 UI 瀹炴柦璁″垝

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 鍦ㄥ叕寮€闂ㄦ埛棣栭〉鐨勬瘡鏈功涓婂姞銆岀炕涔︾湅璇勮銆嶏紝鐐瑰嚮鍚庣敤 BookBlock 鍏ㄥ睆缈讳功 UI 灞曠ず璇ヤ功璇勮锛屽苟杩樺師灏侀潰寮€鍚堝姩鐢汇€?
**Architecture:** 绾嚱鏁版妸 `book.reviews` 鎺掓垚銆屽皝闈㈣法椤?+ 姣忎袱鏉¤瘎璁轰竴涓法椤点€嶏紱涓€涓彈鎺х殑鍏ㄥ睆娴眰缁勪欢璐熻矗寮€鍚堟椂搴忋€佹粴鍔ㄩ攣瀹氫笌閿洏浜や簰锛屽唴閮ㄥ鐢ㄧ幇鏈?`BookBlock`锛涢椤靛崱鐗囧彧璐熻矗瑙﹀彂骞朵紶鍏?`book`銆傚悗绔浂鏀瑰姩銆?
**Tech Stack:** React 18銆乂ite 5銆丆SS Modules銆乣react-quill-new`锛堜粎鍚庡彴锛夈€乣lucide-react`銆佺幇鏈?BookBlock/FlipPage 缁勪欢銆?
**Spec:** `docs/superpowers/specs/2026-11-05-review-flipbook-design.md`

## Global Constraints

- 璇勮椤哄簭锛歚created_at` 鍊掑簭锛屾渶鏂板湪鍓嶏紱鏃堕棿鐩稿悓/缂哄け鏃舵寜 `id` 鍊掑簭
- 涓€涓法椤?= 涓ゆ潯璇勮锛涘皝闈㈠崟鐙崰绗?0 涓法椤?- `onClose` 鍙湪鍏抽棴鍔ㄧ敾缁撴潫鍚庤Е鍙?- 鎵撳紑鍔ㄧ敾涓敹鍒板叧闂姹傛椂鎺掗槦锛岃繘鍏?`open` 鍚庣珛鍗冲叧闂?- 鍑忓皯鍔ㄦ晥妯″紡锛氫繚鐣欑炕涔︿氦浜掞紝璺宠繃 3D 寮€鍚堜笌缈婚〉鍔ㄧ敾
- 鍙闂€у榻愮幇鏈?`Dialog`锛欵sc銆佸垵濮嬬劍鐐广€佺劍鐐规仮澶嶃€侀攣婊氬姩锛涗笉鍋氬畬鏁?focus trap
- 涓嶆敼鍚庣/鏁版嵁搴擄紱棣栭〉鍗＄墖甯冨眬闄ゆ柊澧炴寜閽涓嶅彉
- 棰滆壊浣跨敤涓婚 token锛坄--color-background` / `--color-foreground` / `--color-primary` / `--color-border-input`锛?
## Review Focus

1. **0 鏉¤瘎璁虹殑涔?*锛氫笉鏄剧ず鍏ュ彛锛屾诞灞備笉鎵撳紑锛屼笉浜х敓绌?`BookBlock`銆?2. **濂囨暟鏉¤瘎璁?*锛氭渶鍚庝竴涓法椤靛彸渚т负绌虹櫧椤碉紝缈婚〉涓嶈秺鐣屻€佷笉鎶ラ敊銆?3. **瓒呴暱璇勮**锛氶〉楂樺浐瀹氾紝姝ｆ枃鍦ㄩ〉鍐呮粴鍔紝涓嶈兘鎾戠牬璺ㄩ〉鎴栭伄鎸″鑸€?4. **寮€鍚堝姩鐢绘湡闂磋繛鐐瑰叧闂?*锛氫笉鍗″湪 `opening`锛屼笉閲嶅瑙﹀彂锛屽叧闂悗婊氬姩浣嶇疆涓庣劍鐐规仮澶嶃€?5. **灏侀潰缂哄け / `font_color` 闈炴硶**锛氬洖閫€鍒伴瀛?+ 涓婚娓愬彉锛屼笉鍑虹幇绌虹櫧澶╃獥銆?
---

### Task 1: 璇勮璺ㄩ〉鏁版嵁

**Files:**
- Create: `src/features/portal/utils/buildReviewSpreads.js`
- Test: `.tmp/review-spreads.test.mjs`锛堜竴娆℃€ц剼鏈紝涓嶆彁浜わ級

**Interfaces:**
- Produces:
  - `buildReviewSpreads(book) -> { cover, spreads }`
  - `cover: { type: 'cover', title: string, author: string, coverUrl: string|null, fontColor: string|null, firstChar: string, preface: string }`
  - `spreads: Array<{ type: 'reviews', left: Review|null, right: Review|null }>`
  - `Review = { id, reviewer, chapter_title, content, created_at }`
- Consumes: 鏃?
- [x] **Step 1: 鍐欏け璐ョ敤渚?*

```js
import assert from "node:assert/strict";
import { buildReviewSpreads } from "../src/features/portal/utils/buildReviewSpreads.js";

const book = { title: "鐧惧勾瀛ょ嫭", author: "椹皵鍏嬫柉", reviews: [
  { id: 1, created_at: "2025-01-01T00:00:00Z" },
  { id: 2, created_at: "2025-03-01T00:00:00Z" },
  { id: 3, created_at: "2025-02-01T00:00:00Z" },
]};

const { cover, spreads } = buildReviewSpreads(book);
assert.equal(cover.firstChar, "鐧?);
assert.equal(spreads.length, 2);
assert.deepEqual(spreads[0].left.id, 2);   // 鏈€鏂板湪鍓?assert.deepEqual(spreads[0].right.id, 3);
assert.deepEqual(spreads[1].left.id, 1);
assert.equal(spreads[1].right, null);      // 濂囨暟琛ョ┖
assert.deepEqual(buildReviewSpreads({ title: "绌? }).spreads, []);
```

- [x] **Step 2: 杩愯纭澶辫触**

Run: `node .tmp/review-spreads.test.mjs`
Expected: FAIL锛堟ā鍧椾笉瀛樺湪锛?
- [x] **Step 3: 瀹炵幇绾嚱鏁?*

鎸?`created_at` 鍊掑簭锛坄new Date` 鏃犳晥鍊兼帓鏈€鍚庯級锛屽悓鏃堕棿鎸?`id` 鍊掑簭锛涙瘡 2 鏉″垏涓€涓?spread锛涗笉淇敼鍏ュ弬銆?
- [x] **Step 4: 杩愯纭閫氳繃**

Run: `node .tmp/review-spreads.test.mjs`
Expected: PASS

---

### Task 2: BookBlock 鎺ュ叆鍓嶅姞鍥?
**Files:**
- Modify: `src/features/books/components/BookReader/BookBlock.jsx`

**Interfaces:**
- Consumes: 鐜版湁 props `{ pages, orientation, direction, width, height, maxWidth, initialPage }`
- Produces: 鍚屾牱鐨?props 濂戠害锛涘鑸敼涓?`<button type="button">`锛屾柊澧?`navStyles.navButton`

- [x] **Step 1: 鍘绘帀璋冭瘯涓庡啿绐佹簮**

鍒犻櫎 `navigate` 閲岀殑 `console.log`锛涘垹闄ゅ啓姝荤殑 `id="bb-bookblock"`锛堟棤 CSS 渚濊禆锛夈€?
- [x] **Step 2: 淇濇姢 aspectRatio**

浠呭綋 `width` 鍜?`height` 閮戒笉鍚?`%` 鏃舵墠璁剧疆 `aspectRatio`锛屽惁鍒欎笉璁剧疆璇ユ牱寮忋€?
- [x] **Step 3: 瀵艰埅鏀圭敤 button**

鍥涗釜 `<a href="#">` 鏀逛负 `<button type="button">`锛屼繚鐣?`onClick={() => navigate('first'|'prev'|'next'|'last')}`锛屽姞 `aria-label`锛堥椤?/ 涓婁竴椤?/ 涓嬩竴椤?/ 鏈〉锛夈€?
- [x] **Step 4: 楠岃瘉**

Run: `npm run build`
Expected: 鏋勫缓閫氳繃锛沗/lab` 鐨?BookReader 绀轰緥缈婚〉浠嶅彲鐢ㄣ€?
---

### Task 3: 缈婚〉瀵艰埅鍥炬爣

**Files:**
- Modify: `src/features/books/components/BookReader/nav.module.css`

**Interfaces:**
- Consumes: Task 2 浜у嚭鐨?`navButton` 绫诲悕
- Produces: `.navButton` + `.first` / `.prev` / `.next` / `.last` 鍥涗釜鏂瑰悜鍥炬爣绫?
- [x] **Step 1: 鍐欏浘鏍囨牱寮?*

姣忎釜鏂瑰悜绫讳娇鐢ㄥ唴鑱?SVG data URI锛坄stroke="%23fff"`锛夛紝灏哄 30脳30锛岃儗鏅?`oklch(var(--color-primary2))`锛屽渾瑙?6px锛沗:hover` 鎻愪寒锛沗:focus-visible` 鏄剧ず outline銆?
- [x] **Step 2: 楠岃瘉**

Run: `npm run dev`锛屾墦寮€ `/lab` 鐨?BookReader 绀轰緥锛岀‘璁?4 涓寜閽兘鏈夊彲瑙佸浘鏍囦笖鍙炕椤点€?
---

### Task 4: 鍏ㄥ睆缈讳功娴眰

**Files:**
- Create: `src/features/portal/components/ReviewBookOverlay.jsx`
- Create: `src/features/portal/components/ReviewBookOverlay.module.css`

**Interfaces:**
- Consumes:
  - `buildReviewSpreads(book)`锛圱ask 1锛?  - `BookBlock` props锛圱ask 2锛?  - `sanitizeHtml(html)` from `src/features/editor/utils/sanitizeHtml.js`
  - `useMediaQuery(query)` from `src/shared/hooks/useMediaQuery.js`
- Produces:
  - `export default function ReviewBookOverlay({ book, onClose })`
  - 璇箟锛氱粍浠舵寕杞藉嵆寮€濮嬫墦寮€鍔ㄧ敾锛沗onClose` 鍦ㄥ叧闂姩鐢荤粨鏉熷悗璋冪敤涓€娆?
- [x] **Step 1: 鐘舵€佹満涓庡畾鏃跺櫒**

`phase: 'opening' | 'open' | 'closing'`锛沗closeRequested` 甯冨皵锛沗timersRef` 淇濆瓨鎵€鏈?`setTimeout` id锛屽嵏杞芥椂鍏ㄩ儴娓呯悊銆?
鎵撳紑锛氭寕杞藉悗 `requestAnimationFrame` 缁欏皝闈㈠姞 `open` 绫伙紱500ms 鍚庢寕杞?`BookBlock`锛坄showBig`锛夛紝1000ms 鍚?`phase='open'`銆?
鍏抽棴锛歚requestClose()` 鍦?`opening` 鏃剁疆 `closeRequested=true`锛涜繘鍏?`open` 鍚庤嫢宸茶姹傚垯绔嬪嵆鍏抽棴銆傚叧闂祦绋嬶細`showBig=false`锛?00ms锛夆啋 灏侀潰 `open=false/close=true`锛?00ms锛夆啋 `onClose()`銆傚噺灏戝姩鏁堟椂鎬绘椂闀挎寜 0 澶勭悊锛堢洿鎺?`onClose`锛夈€?
- [x] **Step 2: 娓叉煋缁撴瀯**

`createPortal` 鍒?`document.body`锛?- `.backdrop`锛堟湪绾硅儗鏅?+ 鍗婇€忔槑閬僵锛夛紝`onMouseDown` 鍙湪鐩爣涓鸿嚜韬椂鍏抽棴
- `.perspective > .book > .cover > (.front, .innerLeft) + .innerRight`
- `showBig && .bigBook > (鍏抽棴鎸夐挳 + BookBlock)`

椤甸潰鑺傜偣鐢?`useMemo` 鍩轰簬 `book` 鐢熸垚锛氬皝闈㈣法椤?+ 姣忎釜 spread 涓や釜 `.side`銆傝瘎璁烘鏂?`sanitizeHtml` 鍚?`dangerouslySetInnerHTML`锛涜瘎璁洪〉椤堕儴鏄剧ず `reviewer` / `chapter_title` / 鏃ユ湡锛涙鏂囧鍣?`tabIndex={0}`銆?
- [x] **Step 3: 浜や簰涓庡彲璁块棶鎬?*

Esc 鐩戝惉锛涘叧闂寜閽?`aria-label="鍏抽棴"`锛沗role="dialog"` `aria-modal="true"` `aria-label={`${book.title} 涔﹁瘎`}`锛涙墦寮€鏃朵繚瀛?`document.activeElement` 鍜?`window.scrollY`銆侀攣 `body.overflow`锛屽叧闂椂鎭㈠锛涘垵濮嬬劍鐐瑰埌鍏抽棴鎸夐挳锛涘嵏杞芥椂娓呯悊鐩戝惉銆?
- [x] **Step 4: 鏍峰紡涓庡姩鐢?*

绉绘 `C:\Users\86135\Desktop\code\BookPreview\css\component.css`锛?- `.perspective` / `.book` / `.cover` / `.front` / `.innerLeft` / `.innerRight`
- `.bigBook` + `openBigBook` / `closeBigBook`
- `openSmallBook` / `closeSmallBook` / `scaleUpSmallBook` / `scaleDownSmallBook`
- `.side`锛堟闈?50%/50%锛宍<=768px` 瀹?100%/楂?50%锛屼腑缂濋槾褰憋級
- `@media (prefers-reduced-motion: reduce)` 鍏抽棴鎵€鏈?animation/transition

- [x] **Step 5: 楠岃瘉**

Run: `npm run build`
Expected: 鏃犺娉?妯″潡閿欒銆?
---

### Task 5: 棣栭〉鍗＄墖鍏ュ彛

**Files:**
- Modify: `src/features/portal/components/BookCard.jsx`
- Modify: `src/features/portal/components/BookCard.module.css`

**Interfaces:**
- Consumes: 鏃?- Produces: `<BookCard book onOpenReviews={fn} />`锛涙牴鑺傜偣 `div.card`

- [x] **Step 1: 璋冩暣缁撴瀯**

鏍硅妭鐐逛粠 `<Link>` 鏀逛负 `<div>`锛涘皝闈笌鏍囬鍖呭湪 `<Link to={/books/${book.id}}>`锛沠ooter 澧炲姞鎸夐挳锛?
```jsx
<button type="button" onClick={() => onOpenReviews?.(book)} disabled={reviewCount === 0}>
  <BookOpen size={14} /> 缈讳功鐪嬭瘎璁?</button>
```

鏃犺瘎璁烘椂鎸夐挳闅愯棌锛堜笉鍗犱綅锛夋垨绂佺敤骞舵樉绀恒€屾殏鏃犺瘎璁恒€嶏紝浜岄€変竴鎸夌幇鏈?footer 瀹藉害鍙栨洿绋崇殑涓€绉嶏紝淇濇寔甯冨眬涓嶈烦銆?
- [x] **Step 2: 鏍峰紡**

琛?`.cardLink`锛堢户鎵块鑹层€佸幓涓嬪垝绾裤€佽仛鐒﹀彲瑙侊級銆乣.bookButton`锛堜笌 reviewCount 鍚岃銆乣font-size:0.78rem`銆乣gap:4px`锛夛紱`hover`/`focus-visible` 鐢ㄤ富棰樿壊锛涗笉鏀瑰姩灏侀潰姣斾緥銆?
- [x] **Step 3: 楠岃瘉**

`npm run dev` 鎵撳紑 `/`锛岀‘璁ゅ崱鐗囩偣鍑讳粛杩涜鎯呫€佹寜閽彲鑱氱劍銆佹棤璇勮鐨勫崱鐗囨棤鍏ュ彛銆?
---

### Task 6: 棣栭〉鎺ョ嚎

**Files:**
- Modify: `src/features/portal/pages/PortalHomePage.jsx`

**Interfaces:**
- Consumes: `ReviewBookOverlay`锛圱ask 4锛夈€乣BookCard` 鐨?`onOpenReviews`锛圱ask 5锛?- Produces: 鏃?
- [x] **Step 1: 鐘舵€佷笌娓叉煋**

```jsx
const [activeBook, setActiveBook] = useState(null);
...
<BookCard book={book} onOpenReviews={setActiveBook} />
...
{activeBook ? (
  <ReviewBookOverlay book={activeBook} onClose={() => setActiveBook(null)} />
) : null}
```

- [x] **Step 2: 楠岃瘉**

`npm run dev`锛岃蛋閫氥€岀偣鎸夐挳 鈫?灏侀潰鎵撳紑 鈫?鍏ㄥ睆 鈫?缈婚〉 鈫?鍏抽棴銆嶅叏娴佺▼銆?
---

### Task 7: 绔埌绔獙璇?
**Files:** 鏃?
- [x] **Step 1: 妗岄潰绔?Playwright**

`/` 鈫?鐐圭涓€鏈湁璇勮鐨勪功鐨勬寜閽?鈫?绛夊緟 `role=dialog` 鍑虹幇 鈫?杩炵画銆屼笅涓€椤点€? 娆?鈫?銆屽叧闂€嶁啋 纭娴眰娑堝け銆佹粴鍔ㄤ綅缃仮澶嶃€?
- [x] **Step 2: 绉诲姩绔?*

375脳812 瑙嗗彛閲嶅 Step 1锛涚‘璁や袱涓崐椤典笂涓嬫帓鍒椼€佽Е鎽告粦鍔ㄥ彲缈婚〉銆?
- [x] **Step 3: 杈圭晫**

- 鏃犺瘎璁虹殑涔︼細鏃犳寜閽?- 1 鏉¤瘎璁虹殑涔︼細璺ㄩ〉鍙充晶绌虹櫧锛岀炕椤垫甯?- 寮€鍚堝姩鐢讳腑杩炵偣鍏抽棴 3 娆★細鏈€缁堟甯稿叧闂€佹棤鎶ラ敊
- 鎺у埗鍙帮細鏃?`console.log`銆佹棤 React 璀﹀憡

- [x] **Step 4: 鏋勫缓**

Run: `npm run build`
Expected: PASS

---

## Self-Review

- Spec coverage锛氬叆鍙ｏ紙Task 5/6锛夈€佸紑鍚堝姩鐢伙紙Task 4锛夈€佷袱鏉¤瘎璁?璺ㄩ〉锛圱ask 1/4锛夈€佹渶鏂板湪鍓嶏紙Task 1锛夈€丅ookBlock 鍔犲浐锛圱ask 2/3锛夈€佺Щ鍔ㄧ/鍑忓皯鍔ㄦ晥锛圱ask 4锛夈€傛棤缂哄彛銆?- 绫诲瀷涓€鑷存€э細`buildReviewSpreads` 鐨勮繑鍥炵粨鏋勫湪 Task 1 瀹氫箟銆乀ask 4 娑堣垂锛沗onOpenReviews(book)` 鍦?Task 5 浜у嚭銆乀ask 6 娑堣垂銆?- Review Focus 鐨?5 绫昏緭鍏ュ垎鍒湪 Task 1锛堢┖/濂囨暟锛夈€乀ask 4锛堥暱鏂?灏侀潰鍥為€€/鍏抽棴鏃跺簭锛夈€乀ask 7锛堝叏閮級鏈夐獙璇佹楠ゃ€?