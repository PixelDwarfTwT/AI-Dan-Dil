# Aidil Birthday Website Implementation Plan

> **For agentic workers:** Implementation is handled in this session. Steps use checkbox syntax.

**Goal:** Replace the legacy birthday page with a responsive, personal website for Aidil.

**Architecture:** Keep a static, two-page site with semantic HTML, shared CSS variables, and a small vanilla JavaScript file. Reuse `hbd.mp3` and add a generated cake image.

**Tech Stack:** HTML, CSS, browser JavaScript, existing `http-server`.

**Spec:** `docs/superpowers/specs/2026-10-30-aidil-birthday-design.md`

## Global Constraints
- Do not add runtime dependencies.
- Respect `prefers-color-scheme` and `prefers-reduced-motion`.
- Start audio only on an explicit user action.
- Personalize the recipient to Aidil.
- Use a muted palette across sections and avoid decorative symbols in visible copy.

## Review Focus
- At narrow widths, the split hero must collapse without horizontal overflow.
- With reduced motion, page entry and celebration effects must settle immediately.
- If audio playback is unavailable, the control must report the failure accessibly.
- The generated image and local audio must both load from the served page.
- Both system color schemes must keep readable text and controls.

---

### Task 1: Replace the greeting page and interactions

**Files:**
- Modify: `index.html`
- Create: `app.css`
- Create: `app.js`
- Add: `aidil-birthday.png`

**Interfaces:**
- `index.html` uses `app.css`, `app.js`, `aidil-birthday.png`, and `hbd.mp3`.
- `app.js` controls the song toggle and one-shot wish celebration.

- [x] Add a browser smoke check for personalized copy and controls, verify it fails on the current page.
- [x] Implement the accessible responsive page and both interactions.
- [x] Serve locally and verify desktop, mobile, dark mode, and the interactive controls in a browser.

### Task 2: Split the greeting into linked pages

**Files:**
- Modify: `index.html`, `app.css`, `app.js`
- Create: `note.html`
- Modify: `README.md`, package metadata, and page tests

- [x] Write page-structure checks for two pages, shared navigation, active-page state, and local assets.
- [x] Add a dedicated birthday note page and a wish interaction on that page.
- [x] Keep the shared music control and palette consistent across the pages.
- [x] Verify the page layouts and wish interaction in the browser at desktop and mobile widths.

### Task 3: Keep the experience to two pages

- [x] Merge the wish interaction into `note.html` and remove `wish.html`.
- [x] Update cache-busted navigation links, documentation, and regression checks.
- [x] Verify both pages and the wish interaction locally before updating GitHub `main`.
