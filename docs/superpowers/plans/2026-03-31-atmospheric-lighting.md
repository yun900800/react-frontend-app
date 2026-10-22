# Atmospheric Lighting & Ambient Gradients Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the luxurious portal atmosphere by adding subtle, rich ambient lighting, dynamic glowing background gradients, and refined lighting vignettes across the layout.

**Architecture:** Add atmospheric ambient lighting classes and glowing background layers in `src/index.css` and `MainLayout.module.css`.

**Tech Stack:** CSS Radial Gradients, Pseudo-elements.

**Spec:** User request for second UI enhancement (ambient lighting & gradients).

## Global Constraints

- **Performance:** Keep animations and background layers pointer-events-none and GPU-accelerated.
- **Visual Harmony:** Maintain the clean, luxurious obsidian-and-gold color scheme.

## Review Focus

1. **Visual Depth:** Ensuring the background doesn't look flat or murky.
2. **Readability:** Content remains crystal clear above glowing ambient layers.

---

### Task 1: Add Ambient Glow and Vignette Lighting to `src/index.css`

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: Enhanced `.lux-ambient-vignette` and glowing background atmosphere.

- [ ] **Step 1: Add ambient vignette and multi-point atmospheric glow in `src/index.css`**

```css
/* Ambient Lighting & Vignette */
body::after {
  content: '';
  position: fixed;
  bottom: -30vh;
  right: -10vw;
  width: 60vw;
  height: 60vh;
  background: radial-gradient(circle, rgba(184, 151, 66, 0.05) 0%, rgba(12, 14, 18, 0) 65%);
  pointer-events: none;
  z-index: 0;
}

.lux-ambient-card {
  position: relative;
  overflow: hidden;
}

.lux-ambient-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(223, 189, 115, 0.4), transparent);
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit changes**

```bash
git add src/index.css
git commit -m "style: add atmospheric lighting vignettes and card top-border gold gradients"
```
