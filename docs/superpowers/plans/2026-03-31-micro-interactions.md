# Smooth Micro-Interactions & Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add smooth page fade-in animations, multi-layer depth shadows, tilt/hover effects, and ambient background lighting to elevate the luxurious feel.

**Architecture:** Extend `src/index.css` with animation keyframes, utility classes for smooth fade-ins and 3D hover states, and atmospheric lighting variables.

**Tech Stack:** CSS Keyframes, Transition, Transform.

**Spec:** User request for slow, careful micro-interactions and animations.

## Global Constraints

- **Performance:** Hardware-accelerated CSS animations (`transform`, `opacity`) without layout thrashing.
- **Visual Style:** Subtle, elegant, unhurried easing (`cubic-bezier(0.4, 0, 0.2, 1)`).

## Review Focus

1. **Animation Smoothness:** Avoiding jank during hover or page load.
2. **Reduced Motion:** Respecting accessibility standards if possible.

---

### Task 1: Add Animation Keyframes and Ambient Lighting to `src/index.css`

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: CSS animation classes (`.lux-fade-in`, `.lux-hover-lift`, `.lux-ambient-glow`).

- [ ] **Step 1: Add animation utilities and ambient background glow to `src/index.css`**

```css
@keyframes luxFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.lux-fade-in {
  animation: luxFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.lux-hover-lift {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.lux-hover-lift:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 20px 40px -15px rgba(223, 189, 115, 0.25);
  border-color: var(--lux-border-hover);
}

/* Ambient background glow */
body::before {
  content: '';
  position: fixed;
  top: -20vh;
  left: 50%;
  transform: translateX(-50%);
  width: 70vw;
  height: 50vh;
  background: radial-gradient(circle, rgba(223, 189, 115, 0.04) 0%, rgba(12, 14, 18, 0) 70%);
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit changes**

```bash
git add src/index.css
git commit -m "style: add smooth fade-in animations, hover lifts, and ambient background glow"
```
