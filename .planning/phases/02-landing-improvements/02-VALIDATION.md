---
phase: 02
slug: landing-improvements
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-04
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual browser testing + visual inspection (no automated test framework) |
| **Config file** | none — frontend-only HTML/CSS/JS project |
| **Quick run command** | `npm start` → http://localhost:3000 |
| **Full suite command** | `npm start` then manually check index.html, vision.html, and 2-3 sub-pages |
| **Estimated runtime** | ~30 seconds (page load + visual scan) |

---

## Sampling Rate

- **After every task commit:** Run `npm start` and visually verify modified page
- **After every plan wave:** Full cross-page check: index.html + vision.html + precios.html + como-funciona.html on desktop + mobile viewport
- **Before `/gsd:verify-work`:** All 14 requirements below must pass
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | NAV-01 | visual/manual | `npm start` → scroll index.html | n/a | pending |
| 02-01-02 | 01 | 1 | NAV-02 | visual/manual | `npm start` → check 3+ sub-pages | n/a | pending |
| 02-01-03 | 01 | 1 | NAV-03 | visual/manual | `npm start` → resize to mobile | n/a | pending |
| 02-02-01 | 02 | 2 | BENTO-01 | visual/manual | `npm start` → scroll to bento grid | n/a | pending |
| 02-02-02 | 02 | 2 | ANIM-01 | visual/manual | `npm start` → observe hero 5s | n/a | pending |
| 02-02-03 | 02 | 2 | ANIM-02 | visual/manual | `npm start` → scroll index.html | n/a | pending |
| 02-02-04 | 02 | 2 | ANIM-03 | visual/manual | `npm start` → hover cards | n/a | pending |
| 02-02-05 | 02 | 2 | ANIM-04 | visual/manual | `npm start` → move mouse | n/a | pending |
| 02-03-01 | 03 | 3 | COMP-01 | visual/manual | `npm start` → scroll to comparison | n/a | pending |
| 02-03-02 | 03 | 3 | COMP-02 | visual/manual | `npm start` → mobile viewport | n/a | pending |
| 02-03-03 | 03 | 3 | ROI-01 | visual/manual | `npm start` → change inputs | n/a | pending |
| 02-03-04 | 03 | 3 | ROI-02 | visual/manual | `npm start` → verify CLP format | n/a | pending |
| 02-04-01 | 04 | 4 | VIS-01 | visual/manual | `npm start` → scroll to bottom | n/a | pending |
| 02-04-02 | 04 | 4 | VIS-02 | visual/manual | Click "Ver vision completa" | n/a | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.* No automated test framework needed — this is a frontend-only HTML/CSS/JS project with visual/manual validation.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Navbar pill animation smoothness | NAV-01 | CSS transition quality is visual | Scroll slowly, check for jank |
| Gradient orb animation | ANIM-01 | Animation aesthetics are subjective | Watch hero for 5s, verify movement |
| Cursor glow on desktop only | ANIM-04 | Requires mouse interaction | Move mouse, verify glow follows; check mobile doesn't show it |
| ROI calculator CLP formatting | ROI-02 | Locale-specific number display | Input values, verify Chilean number format (dot thousands, comma decimals) |
| Vision section content quality | VIS-01 | Content review is editorial | Read teaser text, verify it matches brand messaging |

---

## Validation Sign-Off

- [ ] All tasks have visual/manual verification instructions
- [ ] Sampling continuity: every commit includes visual check
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
