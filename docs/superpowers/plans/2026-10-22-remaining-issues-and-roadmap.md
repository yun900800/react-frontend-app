# Remaining Issues & Roadmap

Date: 2026-10-22
Status: Open
Related: `docs/superpowers/specs/2026-10-22-product-lab-split-design.md`, `docs/superpowers/plans/2026-10-22-product-lab-split.md`

This document persists the issues found during the product/lab split review so they are not lost between sessions.

## Current State

- Product and lab now use separate shells (`ProductLayout`, `LabLayout`).
- Navigation is responsive: desktop sidebar, tablet icon rail, mobile bottom tabs + drawer.
- Lab routes and index are registry-driven (`src/lab/registry.jsx`).
- 3D shelf and book reader moved into `features/books/components`.
- Home page is a business workbench with the 3D shelf as the main visual.
- `npm run build` passes.

## P0 — Security / Data Integrity

- [ ] **XSS via `dangerouslySetInnerHTML`**
  - `src/features/books/components/BookShelf3D/BookPageContent.jsx`
  - `src/features/books/components/BookShelf3D/FlipBook.jsx` (or equivalent flipbook page)
  - `src/features/editor/pages/BookReviewEditor.jsx`
  - `src/features/editor/pages/BookReviewEditorNew.jsx`
  - Fix: sanitize HTML with DOMPurify, or render structured content instead of raw HTML.
- [ ] **Token stored in `localStorage`**
  - `src/features/auth/components/SignInForm.jsx`
  - `src/shared/lib/fetch.js`
  - `src/features/auth/components/ProtectedRoute.jsx`
  - Fix: move to httpOnly secure cookie if backend supports it; otherwise add short expiry, refresh flow, and XSS mitigation.
- [ ] **401 handler creates a never-settling Promise**
  - `src/shared/lib/fetch.js` (`401` branch)
  - Fix: reject/throw a typed `AuthError`, let callers handle redirect once.
- [ ] **Hardcoded fallback backend**
  - `src/api.js`
  - `src/shared/lib/fetch.js`
  - Fix: require `VITE_API_BASE_URL`, validate at startup, fail fast with a clear message.
- [ ] **API debug tool is public**
  - Moved to `/lab/tools/api-debug`; now protected by `RequireAuth`.
  - Keep an eye on any future tools added to `src/lab/registry.jsx`.

## P1 — Correctness / Data Layer

- [ ] Timeout has no `AbortController`; `DEFAULT_TIMEOUT` is 50000 while the comment says 5s.
- [ ] Duplicated `handleApiResult` in `client/api.js` and `books/api.js`.
- [ ] `booksApi` unwrap semantics are inconsistent.
- [ ] `useBooks` checks `res.data` on already-unwrapped results.
- [ ] `HomePage` previously double-unwrapped; now normalized, keep it that way.
- [ ] `usePagination` has no race protection.
- [ ] `ChatComponent` re-imports on every message change.
- [ ] Toast ID collision.
- [ ] Hardcoded reviewer `"jim"` in `BookReviewEditor`.
- [ ] `window.confirm` in `useClientData`.
- [ ] Hardcoded page size 10 in `BooksPage`.

## P2 — Architecture / UX / Maintenance

- [ ] Duplicate modal implementations.
- [ ] Duplicate `BookList` / `BookReviewEditor` variants.
- [ ] Duplicate `lucide` + `lucide-react`; remove one.
- [ ] Three animation libraries (`framer-motion`, `react-spring`, `react-transition-group`); choose one per use case.
- [ ] `lodash` used only for debounce; use a local utility or `useDeferredValue`.
- [ ] 30+ `console.*` calls.
- [ ] Deep relative imports; add a path alias.
- [ ] Dead shells left in place: `MainLayout`, `SidebarLayout`, `GlobalBackButton`, `RouteHistoryProvider`.
  - Do not delete blindly: `MainLayout.module.css` has uncommitted changes.
- [ ] Old layout experiments still contain internal dead links; review when touching lab pages.

## Engineering Gaps

- [ ] ESLint has no config; `npm run lint` is not trustworthy.
- [ ] No automated tests.
- [ ] Empty `.github/workflows/`.
- [ ] No README / setup documentation.
- [ ] No env validation.
- [ ] `.env.*` now ignored, but no `.env.example`.

## Recommended Remediation Order

### Stage 0 — Stop the bleeding

- Sanitize all HTML injection points.
- Fix 401 handling and API timeout.
- Require and validate `VITE_API_BASE_URL`.
- Add `.env.example`.

### Stage 1 — Auth / data layer

- Unify `handleApiResult`.
- Fix `booksApi` unwrap semantics and `useBooks`.
- Add `AbortController` + race protection to pagination.
- Move token strategy forward (cookie or short-lived token + refresh).

### Stage 2 — Architecture convergence

- Consolidate modals and book list variants.
- Choose animation stack.
- Remove dead shells and duplicate dependencies.
- Add path aliases.

### Stage 3 — Quality gates

- Add ESLint config and make `npm run lint` pass.
- Add Vitest + Testing Library; cover data layer and critical flows.
- Add GitHub Actions: lint, test, build.
- Add README and env documentation.

## Immediate Focus

The next task is the standalone 3D book showcase at:

- Source: `C:\Users\86135\Desktop\code\3DBookShowcase\index2.html`
- Preview: `http://172.20.48.1:5501/3DBookShowcase/index2.html`

Goal: clicking a book opens it and allows right-page flipping; clicking it again returns it to the shelf. The result should become the reference behavior for the React `BookShelf3D` component.
