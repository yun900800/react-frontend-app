# UI Luxurious Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the React portal UI into a modern, clean, luxurious ("简洁轻奢") style with elegant dark/light theme tokens, subtle glassmorphism, refined typography, and smooth micro-interactions.

**Architecture:** Update global CSS variables (`src/index.css`) for luxurious tokens (gold accents, rich dark background, refined glassmorphism), refactor `MainLayout` and navigation components for a polished header/sidebar experience, and refine card styles and loading states across features.

**Tech Stack:** React, CSS Modules / Global CSS, Vite, Lucide/React icons (if available) or clean custom SVG icons.

**Spec:** User request for clean luxurious UI portal redesign.

## Global Constraints

- **Visual Style:** Clean & Luxurious (Clean layouts, ample whitespace, champagne gold / obsidian accents, soft glowing borders).
- **Responsive:** Fully responsive across mobile, tablet, and desktop viewports.
- **Backward Compatibility:** Keep existing route structure and data flow intact.

## Review Focus

1. **Contrast & Readability:** Ensuring text over dark/gold luxurious backgrounds maintains WCAG AA contrast.
2. **Glassmorphism performance:** Smooth `backdrop-filter` rendering without layout jank.
3. **Empty & Loading States:** Replacing basic text loading with elegant skeleton/spinner states.
4. **Interactive Feedback:** Smooth hover and transition states on cards and buttons.
5. **Mobile Responsiveness:** Ensuring luxurious drawer/sidebar and navigation remain fluid on small screens.

---

### Task 1: Establish Luxurious Design Tokens in `src/index.css`

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: CSS custom properties for colors, shadows, glassmorphism effects, and typography.

- [ ] **Step 1: Update `src/index.css` with luxurious color tokens and glassmorphism utilities**

```css
:root {
  --lux-bg: #0c0e12;
  --lux-surface: #14171f;
  --lux-surface-hover: #1c202a;
  --lux-gold: #dfbd73;
  --lux-gold-light: #f3e5ab;
  --lux-gold-dark: #b89742;
  --lux-text-main: #f5f6f8;
  --lux-text-muted: #9ba1a6;
  --lux-border: rgba(223, 189, 115, 0.15);
  --lux-border-hover: rgba(223, 189, 115, 0.4);
  --lux-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  --lux-glow: 0 0 20px rgba(223, 189, 115, 0.15);
  --glass-bg: rgba(20, 23, 31, 0.75);
}

body {
  background-color: var(--lux-bg);
  color: var(--lux-text-main);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  -webkit-font-smoothing: antialiased;
}

/* Luxurious Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: var(--lux-bg);
}
::-webkit-scrollbar-thumb {
  background: rgba(223, 189, 115, 0.2);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--lux-gold);
}
```

- [ ] **Step 2: Commit changes**

```bash
git add src/index.css
git commit -m "style: add luxurious design tokens and global styles"
```

---

### Task 2: Refactor Main Layout and Navigation

**Files:**
- Modify: `src/shared/components/layout/MainLayout.jsx` (and corresponding CSS if any)

**Interfaces:**
- Consumes: CSS tokens from `src/index.css`
- Produces: A polished, floating glassmorphism header and sidebar navigation.

- [ ] **Step 1: Enhance `MainLayout` with luxurious header, subtle border accents, and smooth transitions**
- [ ] **Step 2: Verify build and UI layout**
- [ ] **Step 3: Commit changes**

```bash
git add src/shared/components/layout/
git commit -m "style: refine MainLayout with luxurious glassmorphism navigation"
```

---

### Task 3: Refactor HomePage & Book/Card Portals with Refined Aesthetics

**Files:**
- Modify: `src/features/home/pages/HomePage.jsx`
- Modify: `src/shared/components/layout/ContentWrapper.jsx`

**Interfaces:**
- Consumes: `booksApi`, `BookBlock`, `BookList`
- Produces: A stunning landing page with gold gradient accents, clean card containers, and polished loading states.

- [ ] **Step 1: Update `ContentWrapper` and `HomePage` container with luxury card borders and typography**
- [ ] **Step 2: Replace plain text loading/error states with exquisite skeleton loaders or spinner components**
- [ ] **Step 3: Verify build and test**
- [ ] **Step 4: Commit changes**

```bash
git add src/features/home/pages/HomePage.jsx src/shared/components/layout/
git commit -m "style: elevate HomePage and ContentWrapper with clean luxurious styling"
```
