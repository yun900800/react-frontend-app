# Product / Lab Split Implementation Plan

> **For agentic workers:** execute tasks in order. Each task must leave the app buildable.

**Goal:** Separate business features and experiments into two responsive application shells, keep both online, and promote the 3D shelf to a business component.

**Architecture:** Two layout shells (`ProductLayout`, `LabLayout`) share one `AppShell` navigation module. Lab routes are generated from a registry. Product routes never import lab.

**Tech Stack:** Vite 5, React 18, React Router 6, CSS Modules, lucide-react.

**Spec:** `docs/superpowers/specs/2026-10-22-product-lab-split-design.md`

## Global Constraints

- No new UI or state dependency.
- No TypeScript migration in this plan.
- Keep existing page components working; move them, don't rewrite them.
- Every route must remain reachable; old lab URLs redirect.
- `features/**` must never import `lab/**`.

---

### Task 1: Navigation foundation

**Files:**
- Create: `src/app/navigation.jsx`
- Create: `src/shared/ui/navigation/AppShell.jsx`
- Create: `src/shared/ui/navigation/AppShell.module.css`
- Modify: `src/shared/components/ThemeToggle.jsx`

- [x] Add product nav groups, mobile primary/secondary items, titles and breadcrumb helpers.
- [x] Build `AppShell` with desktop sidebar, tablet rail, mobile top bar, bottom tabs and drawer.
- [x] Convert `ThemeToggle` from `<a>` to `<button>` with an accessible label.
- [x] Run `npm run build`.

### Task 2: Product shell and routes

**Files:**
- Create: `src/app/ProductLayout.jsx`
- Create: `src/app/routes/product.jsx`
- Modify: `src/App.jsx`

- [x] Wrap product pages in `ProductLayout`.
- [x] Remove `GlobalBackButton` and `RouteHistoryProvider` from the render tree.
- [x] Verify `/`, `/clients`, `/books`, `/editor`, `/ai`, `/calendar`.

### Task 3: Lab registry, shell and index

**Files:**
- Create: `src/lab/registry.jsx`
- Create: `src/lab/index/LabIndex.jsx`
- Create: `src/lab/index/LabIndex.module.css`
- Create: `src/app/LabLayout.jsx`
- Create: `src/app/routes/lab.jsx`

- [x] Register existing lab pages with lazy loaders and metadata.
- [x] Generate sidebar, breadcrumbs and index cards from the registry.
- [x] Add legacy redirects for old lab URLs.
- [x] Verify `/lab` and every lab route.

### Task 4: Promote the 3D shelf

**Files:**
- Move: `src/shared/components/3d-book/*` → `src/features/books/components/BookShelf3D/*`
- Move: `src/shared/components/book-block/*` → `src/features/books/components/BookReader/*`
- Create: `src/features/books/model/normalizeBook.js`
- Modify: `src/features/home/pages/HomePage.jsx`, `CalendarPage.jsx`, and lab layout pages.

- [x] Move files with `git mv`.
- [x] Add feature-level index re-exports.
- [x] Normalise API data outside the component.
- [x] Add a mobile/reduced-motion cover-grid fallback.
- [x] Run `npm run build`.

### Task 5: Responsive and accessibility pass

- [x] Check 320px, 768px, 1024px, 1440px.
- [x] Keyboard: tab order, drawer trap, ESC, focus restore.
- [x] Replace remaining icon-only `<a onClick>` controls in the shells.
- [x] Add `aria-current`, labels and skip link.

### Task 6: Validation

- [x] `npm run build`.
- [x] Route smoke test: every product and lab path renders.
- [x] Verify `features` has no `lab` imports.
- [x] Verify deleting `src/lab` leaves product imports untouched.

---

## Remaining / Follow-ups

- **Lint is still unconfigured.** `npm run lint` cannot be trusted until an ESLint config is added. Build and browser smoke tests passed.
- **No automated tests.** The repo has no test runner; this work was verified with `npm run build` and Playwright smoke checks.
- **P0 security items remain from the original audit:** `dangerouslySetInnerHTML` in the review/flipbook pages, token in `localStorage`, the never-settling 401 Promise in `shared/lib/fetch.js`, and the hardcoded fallback backend.
- **Dead shells:** `MainLayout`, `SidebarLayout`, `GlobalBackButton`, and `RouteHistoryProvider` are no longer rendered. Delete them after confirming no remaining imports.
- **Console cleanup:** remaining `console.*` calls in feature pages should be routed through a small logger or removed for production.

