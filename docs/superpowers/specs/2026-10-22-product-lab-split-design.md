# Product / Lab Split — Design

Date: 2026-10-22
Status: Approved

## Intent

The app started as a layout playground and grew business features (clients, books, reviews, AI) plus experimental demos (animations, 3D, alternative layouts). The goal is to keep both, deploy both, but separate them behind two application shells so the business area stays maintainable and the lab can evolve or be removed without touching product code.

## Goals

- Two shells: `ProductLayout` (business) and `LabLayout` (experiments), both online.
- One navigation model that works on desktop, tablet, and mobile.
- Promote the 3D book shelf to a business component owned by `features/books`.
- Keep the lab publicly browsable; the business area stays behind auth.
- Product never imports lab. Lab may consume product/shared components.

## Non-goals

- Splitting into two repositories or two Vite apps.
- Adding a global state library.
- Redesigning the visual theme.

## Seams

```
app      → features / lab
lab      → features / shared      (showcase consumer)
features → shared
features → lab                    forbidden
shared   → features / lab         forbidden
```

Deletion test: deleting `src/lab` must leave the product build working.

## Information architecture

### Product

| Label | Path |
|---|---|
| 工作台 | `/` |
| 客户管理 | `/clients` |
| 图书 | `/books` |
| 评论编辑 | `/editor` |
| AI 助手 | `/ai` |
| 日历 | `/calendar` |
| 实验室 | `/lab` (sidebar footer) |

Mobile primary tabs: 工作台 / 客户 / 图书 / AI / 更多.
More drawer: 评论编辑 / 日历 / 实验室 / theme / logout.

### Lab

Groups: 布局实验, 动效实验, 3D / 交互, 工具.
The lab index and sidebar are generated from `src/lab/registry.jsx`.
The lab is public; only the API debug tool is marked `protected: true` and requires login.

## Navigation behaviour

- Desktop (>=1024px): fixed sidebar, collapsible, breadcrumbs, top bar actions.
- Tablet (768–1023px): 72px icon rail.
- Mobile (<768px): top bar + 5-slot bottom tabs + drawer.
- Drawer: focus trap, ESC to close, body scroll lock, focus restored on close.
- Active route uses `aria-current="page"`.
- Back navigation on mobile is derived from breadcrumbs, not `history.back()`.

## 3D book shelf

- Moves to `features/books/components/BookShelf3D`.
- Small interface: `books`, `variant`, `onSelect`, `loading`, `empty`.
- Data normalisation lives in `features/books/model`, not in the page.
- Mobile / reduced motion: render a cover grid fallback; never hide the shelf.
- Lazy-loaded with a skeleton; covers lazy-loaded.

## URL compatibility

Old lab URLs redirect to the new `/lab/...` paths.

## Acceptance

- All routes reachable in <=2 taps on mobile.
- No whole-page horizontal scroll at 320px.
- `/lab` is online and index-driven.
- Home page shows the 3D shelf on desktop/tablet and a grid on mobile.
- `features` has zero imports from `lab`; deleting `lab` keeps the product build green.
