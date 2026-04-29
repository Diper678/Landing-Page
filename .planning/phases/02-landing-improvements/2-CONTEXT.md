# Phase 2: Landing Page Improvements - Context

**Gathered:** 2026-03-04
**Updated:** 2026-03-04 (added Bento Grid redesign for "Cómo Funciona" section)
**Status:** Ready for planning

<domain>
## Phase Boundary

Improve the Sisteco landing page UX/UI based on competitor analysis (Apollo, AmpleMarket, Firecrawl, Base10, HumbleOps). 6 improvements: **Bento Grid redesign of "Cómo Funciona" section**, floating navbar, background animations, commercial comparison table, ROI calculator, and autonomous agents vision section. NO new pages created — only modify existing index.html, vision.html, style.css, and js files. All 20 pages get the floating navbar.

</domain>

<decisions>
## Implementation Decisions

### BENTO GRID — Rediseño "Cómo Funciona" (index.html lines 251-437)

**What to remove:**
- Entire `<section id="como-funciona">` with 5 `solution-detail` blocks (alternating light/dark)
- ~186 lines of repetitive HTML with full-width layout

**What to build:**
- Bento Grid asymmetric layout (Apple/Linear style) on DARK background (#111)
- 5 capability cards in asymmetric grid with visual hierarchy
- Use `ui-ux-pro-max` skill for design implementation

**Grid Layout:**
- **Card hero (2x2):** Prospección IA — dominant card, 2 columns × 2 rows
  - Contains: mini animated flow diagram (LinkedIn → IA Scoring → HOT/WARM/SKIP)
  - Plus: title, description, 2-3 features, 2 stats
- **4 smaller cards (1x1):** Secuencias, Omnicanal, Análisis, Seguridad
  - Each: icon + title + 2-line description + 2-3 features + 2 stats

**Visual Style:**
- Dark background: `#111` (contrasts with light hero above)
- Card borders: subtle glass/dark-glass effect
- Accent: `#c5ed36` for icons, glow, highlights
- Card spacing: consistent gap (16-24px)

**Content Density (per card — MEDIUM):**
- Icon (Lucide, 32-48px)
- Title (h3)
- 2-line description
- 2-3 key features (short bullets, checkmark icon)
- 2 highlight stats

**Interactions:**
- Hover: border glow (#c5ed36), subtle scale (1.02), elevated shadow
- Each card is clickable → links to pages/soluciones.html#section
- Hover arrow indicator (existing pattern from feature-cards)
- GSAP stagger animation on scroll entry

**Content Mapping (current → bento):**
1. **Prospección IA (2x2 hero card):** scoring 100pts, HOT/WARM/NURTURE/SKIP, 5-7x conversiones, -70% costo/lead → link: soluciones.html#data-quality
2. **Secuencias (1x1):** 5 emails, 35 días, 9AM, 78% first responder → link: soluciones.html#ai-247
3. **Omnicanal (1x1):** LinkedIn→Email→Slack→Notion, 89% retención, +40% respuestas → link: soluciones.html#omnichannel
4. **Análisis (1x1):** dashboards real-time, reportes auto, alertas, 360° pipeline → link: soluciones.html#analytics
5. **Seguridad (1x1):** Ley 21.719, E2E encryption, privacy by design, Dic '26 → link: soluciones.html#security

### Floating Navbar (AmpleMarket-style)
- Applies to ALL 20 pages (consistent experience)
- Full-width at top → shrinks to ~900px pill with border-radius ~50px on scroll (>80px)
- CSS transition ~0.4s cubic-bezier for smooth effect
- Adds: box-shadow, backdrop-blur, rounded corners when scrolled
- Must work with existing hamburger mobile menu
- Class toggle: `.navbar.scrolled` via JS scroll listener
- Shared CSS in `style.css` (already imported by all pages)

### Background Animations (Firecrawl-style) — FULL treatment
- **Gradient orbs:** 2-3 animated blobs in hero section (CSS @keyframes, not JS)
- **GSAP ScrollTrigger:** Fade-in + slide-up for ALL sections as they enter viewport
- **Card hover glow:** Border glow in accent color (#c5ed36) on hover for feature cards
- **Cursor-following glow:** Subtle radial gradient that follows mouse (desktop only, no mobile)
- GSAP already loaded via CDN (3.12.7 + ScrollTrigger) — use existing scripts
- Performance: use `will-change` sparingly, `transform` over `top/left`, `requestAnimationFrame` for cursor

### Commercial Comparison Table (index.html)
- NEW section on index.html — 4-column comparison table
- Columns: Sisteco vs DIY Stack vs Contratar SDR vs No hacer nada
- Rows: Costo mensual, Setup time, Time to first value, Canales activos, Horario, Leads/semana, Tasa respuesta, ROI, Cash at risk
- Visual style: dark background, checkmarks green vs X red (HumbleOps-style)
- KEEP existing DIY comparison on precios.html unchanged

### ROI Calculator (index.html)
- Interactive calculator: user inputs # vendedores and ticket promedio (CLP)
- Output: estimated monthly ROI, leads generated, cost savings vs DIY/SDR
- Place near or after the comparison table on index.html
- Simple JS — no framework dependencies
- Formula based on FINANCIAL_STRATEGY.md data (5-7x conversions, $1,253 DIY cost, SDR CLP 1.2M)

### Vision Section — Agentes Autónomos
- **index.html teaser:** Compact section before CTA — headline + subtext + 4-step timeline (2026-2030) + CTA to vision.html
- **vision.html full version:** Expand existing content with the autonomous agents future vision
- Timeline: 2026 (ventas B2B) → 2027 (pipelines completos) → 2028 (agent-to-agent) → 2030 (departamentos autónomos)
- Core message: "Vende más, preocúpate menos. Automatizacion de ventas B2B hecha para Chile."

### Claude's Discretion
- Bento grid exact CSS grid-template values (responsive breakpoints)
- Mini diagram animation details inside hero card
- Exact gradient orb colors (should complement #c5ed36 accent)
- ScrollTrigger animation timing/easing details
- Cursor glow radius and opacity
- ROI calculator layout (horizontal vs vertical form)
- Vision timeline visual treatment
- Comparison table exact row ordering

</decisions>

<specifics>
## Specific Ideas

- Bento Grid: Apple-style asymmetric grid where the hero card (Prospección IA) dominates visually
- Mini flow diagram in hero card: LinkedIn icon → brain/AI icon → color-coded labels (HOT green, WARM yellow, SKIP gray)
- Dark background creates visual break between light hero and light features section below
- AmpleMarket navbar: starts full-width transparent, shrinks to floating pill on scroll
- Firecrawl: gradient orbs that slowly move/pulse behind hero content
- HumbleOps: 4-column comparison table with "Cash at risk" and "Time to first value"
- Felipe's vision: "Agentes autónomos gestionando departamentos completos, agent-to-agent commerce"

</specifics>

<code_context>
## Existing Code Insights

### Current "Cómo Funciona" to Remove (index.html:251-437)
- `<section id="como-funciona">` — header with section-label, section-title, section-desc
- 5x `<div class="solution-detail">` blocks with alternating `solution-detail--dark` class
- Each block: `.solution-detail-grid` (2-col) with `.solution-visual` + `.solution-content`
- Grid reversal: `.solution-detail-grid--reversed` for dark sections
- Content per block: icon-large, tool-pills, solution-label, h3, p, feature-list (4 items), solution-stats (4 items)
- CSS for these in `style.css` (solution-detail, solution-detail-grid, etc.) and `css/pages.css`

### Reusable Assets
- `style.css` (~2970 lines): Feature card patterns, dark section styles, stats patterns
- `js/main.js`: Scroll listeners, Lucide init, form handling
- GSAP 3.12.7 + ScrollTrigger: Already loaded via CDN
- `.animated-bg` and `.grid-pattern-overlay`: Background effect classes
- Lucide icons CDN 0.468.0
- Existing `.feature-card` with hover effects — pattern to follow for Bento cards

### Established Patterns
- Section: `<section>` with `<div class="container">`
- Dark sections: dark bg with noise texture
- Brand colors: `#c5ed36` accent, `#111` dark, `#F8F7F5` light bg
- Font: Sharp Grotesk (body), JetBrains Mono (technical labels)
- Cards: border-radius 16px, hover transitions

### Integration Points
- `style.css`: New bento grid styles, card glow, navbar scrolled
- `js/main.js`: GSAP stagger for bento cards, navbar toggle, cursor glow
- `index.html`: Replace lines 251-437 with Bento Grid section

### Files to Modify
- `index.html` — Replace "Cómo Funciona" section + add comparison, calculator, vision sections
- `style.css` — Bento grid layout, card styles, dark section, animations
- `js/main.js` — GSAP bento stagger, navbar scroll, cursor glow, ROI calculator
- `pages/vision.html` — Expanded autonomous agents vision

</code_context>

<deferred>
## Deferred Ideas

- Phase 3-5 payments backend (dLocal Go API, webhooks, checkout flow) — paused pending blockers
- Social proof / resultados reales section — P3 priority
- Hero animation/video dashboard — P3 priority
- CTA with inline form (Apollo-style) — P3 priority
- Cleanup unused brand SVGs (claude.svg, gemini.svg, kimi.svg) from assets/icons/

</deferred>

---

*Phase: 02-landing-improvements*
*Context gathered: 2026-03-04*
*Bento Grid redesign added: 2026-03-04*
