---
phase: 02-landing-improvements
plan: 02
subsystem: ui
tags: [bento-grid, gsap, scroll-animations, css-keyframes, cursor-glow, hero-orbs]

# Dependency graph
requires:
  - phase: 02-01
    provides: "Floating pill navbar CSS/JS across all pages"
provides:
  - "Dark bento grid section replacing old Como Funciona (5 cards)"
  - "Hero gradient orbs with CSS keyframe animations"
  - "GSAP scroll reveal animations for all below-fold sections"
  - "Bento card stagger animations on scroll entry"
  - "Card hover glow effect (accent border + shadow)"
  - "Cursor-following radial gradient glow (desktop only)"
affects: [02-03, landing-page-visual-quality]

# Tech tracking
tech-stack:
  added: []
  patterns: [bento-grid-layout, gsap-scrolltrigger-once, css-keyframe-orbs, requestAnimationFrame-cursor]

key-files:
  created: []
  modified:
    - index.html
    - style.css
    - js/main.js

key-decisions:
  - "Bento hero card uses mini flow diagram (LinkedIn -> IA -> HOT/WARM/SKIP) with animated dot connectors"
  - "Cursor glow at z-index:1 coexists with custom cursor ring at z-index:10000"
  - "All animations guard prefers-reduced-motion with opacity:1 fallback for bento cards"

patterns-established:
  - "Bento grid: 3-col desktop, 2-col tablet (hero full-width), 1-col mobile"
  - "GSAP ScrollTrigger with once:true for one-shot scroll reveals"
  - "requestAnimationFrame throttled mousemove for cursor glow performance"

requirements-completed: [BENTO-01, ANIM-01, ANIM-02, ANIM-03, ANIM-04]

# Metrics
duration: 4min
completed: 2026-03-04
---

# Phase 02 Plan 02: Bento Grid + Animation Layer Summary

**Dark bento grid with 5 capability cards (2x2 hero + 4x1x1), hero gradient orbs, GSAP scroll reveals, card hover glow, and cursor-following glow**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-04T23:09:06Z
- **Completed:** 2026-03-04T23:12:59Z
- **Tasks:** 4 (3 auto + 1 checkpoint auto-approved)
- **Files modified:** 3

## Accomplishments
- Replaced static Como Funciona section (5 solution-detail blocks) with dark bento grid
- Hero card features mini animated flow diagram (LinkedIn -> IA -> HOT/WARM/SKIP labels)
- Full animation layer: hero orbs, scroll reveals, bento stagger, card glow, cursor glow
- All 5 bento card links verified against soluciones.html anchor IDs
- Complete responsive design (3-col -> 2-col -> 1-col) with reduced-motion guards

## Task Commits

Each task was committed atomically:

1. **Task 1: Bento grid HTML + CSS and hero orbs HTML** - `99d03a6` (feat)
2. **Task 2: Hero orbs CSS + card glow CSS + cursor glow CSS** - `8fddc00` (feat)
3. **Task 3: GSAP scroll reveals + cursor glow + bento stagger JS** - `bd021aa` (feat)
4. **Task 4: Verify bento grid and animations** - auto-approved (checkpoint)

## Files Created/Modified
- `index.html` - Replaced Como Funciona with bento grid HTML, added hero orbs
- `style.css` - Bento grid layout, flow diagram, hero orbs keyframes, card glow, cursor glow CSS
- `js/main.js` - initScrollReveal(), initBentoAnimations(), initCursorGlow() functions

## Decisions Made
- Hero card mini flow diagram uses animated dot connectors (flowPulse keyframe) for visual interest
- Cursor glow uses requestAnimationFrame for performance-optimized mousemove tracking
- All animations disabled via prefers-reduced-motion with opacity:1 fallback for content visibility

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Bento grid and animation layer complete, ready for Plan 03 (comparison table, ROI calculator, agents vision)
- All visual elements responsive and accessible
- GSAP ScrollTrigger patterns established for reuse in future sections

---
*Phase: 02-landing-improvements*
*Completed: 2026-03-04*
