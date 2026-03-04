# Phase 02: Landing Page Improvements - Research

**Researched:** 2026-03-04
**Domain:** Frontend UI/UX — vanilla HTML/CSS/JS, GSAP 3.12.7, ScrollTrigger, CSS animations
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Floating navbar applies to ALL 20 pages (consistent experience)
- Full-width at top → shrinks to ~900px pill with border-radius ~50px on scroll (>80px)
- CSS transition ~0.4s cubic-bezier for smooth effect
- Adds: box-shadow, backdrop-blur, rounded corners when scrolled
- Must work with existing hamburger mobile menu
- Class toggle: `.navbar.scrolled` via JS scroll listener
- Shared CSS in `style.css` (already imported by all pages)
- Gradient orbs: 2-3 animated blobs in hero section (CSS @keyframes, not JS)
- GSAP ScrollTrigger: Fade-in + slide-up for ALL sections as they enter viewport
- Card hover glow: Border glow in accent color (#c5ed36) on hover for feature cards
- Cursor-following glow: Subtle radial gradient that follows mouse (desktop only, no mobile)
- GSAP already loaded via CDN (3.12.7 + ScrollTrigger) — use existing scripts
- Performance: use `will-change` sparingly, `transform` over `top/left`, `requestAnimationFrame` for cursor
- Comparison table: NEW section on index.html, 4-column, dark background, checkmarks green vs X red (HumbleOps-style)
- ROI calculator: Simple JS, no framework, place near/after comparison table on index.html
- ROI formula based on FINANCIAL_STRATEGY.md data (5-7x conversions, $1,253 DIY, SDR CLP 1.2M)
- Vision teaser: Compact section before CTA in index.html with 4-step timeline (2026-2030) + CTA to vision.html
- vision.html: Expand existing content with autonomous agents future vision
- KEEP existing DIY comparison on precios.html unchanged
- NO new pages created — only modify existing index.html, vision.html, style.css, and js files

### Claude's Discretion
- Exact gradient orb colors (should complement #c5ed36 accent)
- ScrollTrigger animation timing/easing details
- Cursor glow radius and opacity
- ROI calculator layout (horizontal vs vertical form)
- Vision timeline visual treatment (vertical timeline, horizontal steps, etc.)
- Comparison table exact row ordering

### Deferred Ideas (OUT OF SCOPE)
- Phase 3-5 payments backend (dLocal Go API, webhooks, checkout flow) — paused pending blockers
- Social proof / resultados reales section — P3 priority
- Hero animation/video dashboard — P3 priority
- CTA with inline form (Apollo-style) — P3 priority
</user_constraints>

---

## Summary

This phase is pure frontend enhancement — no new backend, no new pages, no framework changes. The stack is locked: vanilla HTML/CSS/JS with GSAP 3.12.7 + ScrollTrigger already loaded via CDN in all 20 pages. The single `style.css` (imported by all pages) is the leverage point for site-wide changes.

The five improvements fall into three categories: (1) **structural CSS/JS** changes that affect all pages (navbar pill), (2) **animation layer** additions that enhance existing sections (GSAP scroll reveals, CSS orbs, card glow, cursor glow), and (3) **new HTML sections** on index.html and vision.html (comparison table, ROI calculator, vision teaser).

The key technical risks are: (a) the navbar pill animation must not break the mobile hamburger menu, (b) gradient orbs already exist as static backgrounds — the "improvement" is making them more visually dramatic and hero-specific, and (c) the ROI calculator requires accurate Chilean peso formatting and realistic formulas sourced from FINANCIAL_STRATEGY.md.

**Primary recommendation:** Implement in dependency order — navbar CSS/JS first (all pages benefit immediately), then animations (build on working nav), then new HTML sections (isolated to index.html and vision.html).

---

## Standard Stack

### Core (already present — no new installs)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| GSAP | 3.12.7 CDN | Scroll-triggered animations, timeline orchestration | Loaded in all pages |
| ScrollTrigger | 3.12.7 CDN | Viewport-based triggers for GSAP | Registered in `initAnimations()` |
| Lucide | 0.468.0 CDN | Icons for comparison table (check, x, etc.) | Loaded in all pages |
| style.css | ~2970 lines | Single CSS file shared by all 20 pages | Shared via `<link>` |
| js/main.js | — | index.html logic, GSAP init, hamburger, cursor | index.html only |
| js/pages.js | — | Sub-pages logic, same cursor/scroll patterns | All pages/* |

### No new dependencies needed
All required libraries are already loaded. The entire phase requires only CSS edits, JS additions, and HTML additions.

---

## Architecture Patterns

### Existing CSS Architecture — Critical Knowledge

```
style.css (~2970 lines)
├── CSS variables (:root) — colors, radii, ease curves
├── Animated background (.animated-bg, .grid-pattern-overlay)
├── Navbar (.navbar, .navbar .container, .hamburger)
├── Hero (.hero, .hero-grid, .hero-text, .hero-form)
├── Feature cards (.feature-card)
├── Sections (.page-section, .page-section-dark)
├── Toast, Modal, Scroll progress
└── [~line 2556] Phase 7 brutalist additions (navbar border-bottom, glassmorphism note)
```

**Important:** The `.navbar` rule appears TWICE in style.css:
- Line 204: main definition (`position: sticky`, `transition: all 0.5s ease`)
- Line 2556: augmented with `border-bottom: 1px solid rgba(197, 237, 54, 0.12)`

The `.scrolled` state must be added AFTER both existing rules to ensure correct cascade.

### Pattern 1: Navbar Floating Pill

**What:** CSS class toggle approach — base state is current sticky navbar, `.scrolled` class overrides to floating pill.

**Critical constraint:** The navbar uses `position: sticky; top: 0`. To make it float/shrink, the container must be allowed to narrow while the outer navbar wrapper stays sticky. The cleanest approach is transitioning `max-width` on `.navbar .container` (not `.navbar` itself) to avoid breaking the sticky positioning context.

```css
/* Source: Derived from existing style.css lines 204-214 */

/* Add after existing .navbar rules */
.navbar.scrolled {
  padding: 6px 0;
  background: rgba(248, 247, 245, 0.95);
  border-bottom: 1px solid rgba(197, 237, 54, 0.2);
}

.navbar.scrolled .container {
  max-width: 900px;
  background: rgba(248, 247, 245, 0.97);
  border-radius: 50px;
  border: 1px solid rgba(229, 229, 229, 0.6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.10);
  padding: 8px 20px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**JS pattern (add to existing scroll listener in main.js and pages.js):**
```javascript
// Source: LANDING_PAGE_IMPROVEMENTS.md implementation guide
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}
```

**Mobile handling:** On mobile, `.navbar.scrolled .container` must not apply `border-radius` or constrained `max-width`. Use a media query breakpoint matching the existing hamburger breakpoint (check: hamburger appears at `@media (max-width: 768px)` per standard convention, verify in style.css).

### Pattern 2: Gradient Orbs — Upgrade Existing

**What exists:** `.animated-bg::before` and `::after` already create two floating radial gradient blobs (rgba(197,237,54, 0.07) and 0.04 opacity). These are `position: fixed` — they follow the scroll.

**The improvement:** Current orbs are very subtle (0.04-0.07 opacity) and globally fixed. The upgrade creates dedicated hero-section orbs that are `position: absolute` (scroll with the hero), more visible, and have richer colors. Keep the existing `.animated-bg` for global ambient effect.

```css
/* Source: Pattern inspired by Firecrawl, adapted to Sisteco palette */

/* Add to hero section in index.html */
.hero-orbs {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  will-change: transform;
}

.hero-orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(ellipse, rgba(197, 237, 54, 0.15) 0%, transparent 70%);
  top: -100px;
  right: -100px;
  animation: orbFloat1 18s ease-in-out infinite;
}

.hero-orb-2 {
  width: 350px;
  height: 350px;
  background: radial-gradient(ellipse, rgba(197, 237, 54, 0.08) 0%, rgba(180, 220, 40, 0.05) 40%, transparent 70%);
  bottom: -50px;
  left: 5%;
  animation: orbFloat2 22s ease-in-out infinite reverse;
}

.hero-orb-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(ellipse, rgba(197, 237, 54, 0.06) 0%, transparent 70%);
  top: 30%;
  left: 40%;
  animation: orbFloat3 15s ease-in-out infinite;
}

@keyframes orbFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(-40px, 30px) scale(1.08); }
  66%       { transform: translate(20px, -20px) scale(0.95); }
}

@keyframes orbFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(30px, -40px) scale(1.1); }
}

@keyframes orbFloat3 {
  0%, 100% { transform: translate(0, 0); }
  50%       { transform: translate(-20px, 25px); }
}
```

**Important:** Hero must have `position: relative` and `overflow: hidden` for the absolute orbs to clip correctly. Check current hero CSS before adding.

### Pattern 3: GSAP ScrollTrigger — Section Reveals

**What exists:** `initFeaturesAnimations()` in main.js already animates `.feature-card` and `.features-title`. The upgrade applies the same pattern to ALL sections site-wide.

```javascript
// Source: Extending existing initFeaturesAnimations() pattern in main.js
function initScrollReveal() {
  if (typeof ScrollTrigger === 'undefined') return;

  // Generic reveal for section titles
  gsap.utils.toArray('.section-title, .page-section h2').forEach(el => {
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true }
      }
    );
  });

  // Staggered card reveals
  gsap.utils.toArray('.comparison-col, .roi-output-card').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });
}
```

### Pattern 4: Card Hover Glow

**What exists:** Feature cards have `border: 1px solid var(--color-border)` and `transition: transform 0.3s ease, box-shadow 0.3s ease`. Adding glow is a CSS-only addition.

```css
/* Source: Extending existing .feature-card pattern in style.css */
.feature-card:hover,
.comparison-col.featured:hover {
  border-color: rgba(197, 237, 54, 0.5);
  box-shadow: 0 0 0 1px rgba(197, 237, 54, 0.2),
              0 8px 32px rgba(197, 237, 54, 0.12),
              0 20px 60px rgba(0, 0, 0, 0.08);
}
```

### Pattern 5: Cursor Glow (Radial Gradient — distinct from custom cursor)

**What exists:** `initCustomCursor()` in both main.js and pages.js already creates a 24px circle cursor that follows the mouse using direct `style.left/top`. The new cursor glow is a DIFFERENT effect: a large radial gradient spotlight that follows the mouse, applied as a `::before` pseudo-element or via a `div` with CSS `mask`.

**The simpler and more performant approach — mousemove CSS variable:**
```javascript
// Source: Common CSS custom property mousemove pattern
function initCursorGlow() {
  if ('ontouchstart' in window) return; // desktop only

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  });
}
```

```css
.cursor-glow {
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(197, 237, 54, 0.06) 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  will-change: left, top;
}
```

**Performance note:** Using `left/top` with `requestAnimationFrame` is acceptable for a fixed-position element. Using `transform: translate3d` would be smoother — store the position in CSS vars and use transform.

### Pattern 6: Comparison Table (4-Column)

**Structure pattern (HumbleOps-inspired):**
```html
<!-- Section: dark background -->
<section class="page-section page-section-dark comparison-section">
  <div class="container">
    <span class="section-label">¿Por qué Sisteco?</span>
    <h2 class="section-title center">Elige tu camino</h2>

    <div class="comparison-table">
      <!-- Header row -->
      <div class="comparison-header">
        <div class="comparison-label-col"></div>
        <div class="comparison-col">DIY Stack</div>
        <div class="comparison-col">Contratar SDR</div>
        <div class="comparison-col">No hacer nada</div>
        <div class="comparison-col featured">
          Sisteco
          <span class="featured-badge">Recomendado</span>
        </div>
      </div>

      <!-- Data rows -->
      <!-- Each row: label + 4 values (text or icon) -->
    </div>
  </div>
</section>
```

**Row data from FINANCIAL_STRATEGY.md + LANDING_PAGE_IMPROVEMENTS.md:**
| Row | DIY Stack | Contratar SDR | No hacer nada | Sisteco |
|-----|-----------|---------------|---------------|---------|
| Costo mensual | ~$1,253 | CLP 1.2M | $0 | Desde $472 |
| Setup time | 2-4 semanas | 1-2 meses | — | < 24 horas |
| Time to first value | 2-4 semanas | 1-2 meses | Nunca | Hoy |
| Canales activos | 1-2 | 1 | 0 | 5 |
| Horario | 8h/día | 8h/día | — | 24/7 |
| Leads/semana | ~50 | ~30 | 0 | ~200+ |
| Tasa respuesta email | 2-5% | 3-7% | — | 15-25% |
| Cash at risk | $3-8K setup | $14K/año mínimo | Oportunidad perdida | $0 setup |
| ROI esperado | Incierto | Incierto | Negativo | 391% (Forrester) |

### Pattern 7: ROI Calculator

**Formula inputs/outputs (from FINANCIAL_STRATEGY.md):**
- **Input A:** Número de vendedores (default: 2)
- **Input B:** Ticket promedio CLP (default: 1,500,000)
- **Output 1:** Leads adicionales/mes = vendedores × 50 × 4 (approximate: 200 leads/mes baseline × scale factor)
- **Output 2:** Conversiones adicionales con Sisteco = leads × 0.08 (8% average from 15-25% email response rate × conversion)
- **Output 3:** Ingreso adicional estimado = conversiones × ticket
- **Output 4:** Ahorro vs DIY = $1,253 - $472 = $781/mes (para plan base)
- **Output 5:** ROI estimado = ((ingreso adicional + ahorro) / precio Sisteco) × 100

**Simple JS pattern:**
```javascript
function calcROI() {
  const vendedores = parseInt(document.getElementById('roi-vendedores').value) || 2;
  const ticket = parseInt(document.getElementById('roi-ticket').value) || 1500000;
  const plan = 472; // USD base plan

  const leadsAdicionales = vendedores * 200;
  const conversionesAdicionales = Math.round(leadsAdicionales * 0.03); // conservative 3%
  const ingresoAdicional = conversionesAdicionales * ticket;
  const ahorroVsDIY = 781; // USD: $1,253 DIY - $472 Sisteco

  const roiPorcentaje = Math.round(((ingresoAdicional / 500 + ahorroVsDIY) / plan) * 100);
  // Note: ticket is CLP, divide by ~500 for rough USD equivalent for ROI display

  return { leadsAdicionales, conversionesAdicionales, ingresoAdicional, ahorroVsDIY, roiPorcentaje };
}
```

**Important:** CLP formatting uses `toLocaleString('es-CL')`. ROI display should be in % with a disclaimer about estimated values.

### Pattern 8: Vision Timeline

**HTML structure (compact teaser for index.html):**
```html
<section class="page-section vision-teaser-section">
  <div class="container">
    <span class="section-label">Nuestra visión</span>
    <h2 class="section-title">Construimos infraestructura para el mundo que viene</h2>
    <p class="section-desc">Hoy automatizamos tu prospección. Mañana, los agentes autónomos gestionarán departamentos completos.</p>

    <div class="vision-timeline">
      <div class="timeline-step">
        <span class="timeline-year">2026</span>
        <h4>Ventas B2B automatizadas</h4>
        <p>Prospección, secuencias, scoring — sin SDRs</p>
      </div>
      <div class="timeline-connector"></div>
      <div class="timeline-step">
        <span class="timeline-year">2027</span>
        <h4>Pipelines autónomos</h4>
        <p>Agentes que gestionan el ciclo completo de ventas</p>
      </div>
      <div class="timeline-connector"></div>
      <div class="timeline-step">
        <span class="timeline-year">2028</span>
        <h4>Agent-to-agent commerce</h4>
        <p>Plataformas donde agentes compran, venden y negocian</p>
      </div>
      <div class="timeline-connector"></div>
      <div class="timeline-step featured">
        <span class="timeline-year">2030</span>
        <h4>Departamentos autónomos</h4>
        <p>IA gestionando equipos completos 24/7</p>
      </div>
    </div>

    <a href="pages/vision.html" class="btn btn-primary">Ver nuestra visión completa</a>
  </div>
</section>
```

### Anti-Patterns to Avoid

- **Animating `position: sticky` wrapper:** Don't animate `width` or `max-width` on the `.navbar` element itself — it breaks sticky context. Animate the inner `.container` instead.
- **Overusing `will-change`:** Only apply to elements with active CSS animations. Remove after animation completes if possible.
- **Fixed + transform performance:** Using `left/top` on fixed elements causes layout thrash. Use `transform: translate()` where possible.
- **`position: fixed` orbs:** Current `.animated-bg` orbs are `position: fixed` — they don't move with scroll. New hero orbs should be `position: absolute` inside a `position: relative` hero section so they scroll naturally.
- **jQuery-style DOM queries in GSAP:** Use `gsap.utils.toArray()` instead of `document.querySelectorAll()` for collections — more reliable.
- **CLP formatting without locale:** Always use `toLocaleString('es-CL')` for Chilean peso display.
- **Cursor glow on scroll:** The glow `div` uses `style.left/top` in a mousemove listener — this is fine for mouse, but ensure the scroll listener for navbar is `{ passive: true }` to avoid blocking scroll.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-triggered animations | Custom IntersectionObserver + CSS | GSAP ScrollTrigger (already loaded) | Already in project, handles edge cases, browser compat |
| Icon set for comparison table | Custom SVG icons | Lucide (already loaded) — `check`, `x`, `minus`, `zap` | Zero additional load, consistent style |
| Bezier easing curves | Manual cubic-bezier calculation | Use named GSAP eases: `power3.out`, `expo.out` | Battle-tested values |
| CLP number formatting | Manual string manipulation | `toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })` | Handles thousands separator and peso sign |
| Mobile detection for cursor | `navigator.userAgent` parsing | `'ontouchstart' in window` | Simpler, more reliable |
| Debouncing scroll events | Custom debounce utility | `{ passive: true }` event listener + direct class toggle | Passive listeners are enough for simple class toggles |

---

## Common Pitfalls

### Pitfall 1: Navbar Pill Breaks Mobile Menu
**What goes wrong:** When `.navbar.scrolled .container` gets `border-radius: 50px`, the mobile hamburger dropdown (`.nav-links.open`) inherits the overflow clip and gets cut off.
**Why it happens:** The dropdown is a child of `.navbar .container`; border-radius + overflow:hidden clips it.
**How to avoid:** The `.nav-links.open` menu should have `position: fixed` or break out of the container on mobile. Verify existing mobile menu positioning before adding border-radius to the container. Add `@media (max-width: 768px) { .navbar.scrolled .container { border-radius: 0; max-width: 100%; } }`.
**Warning signs:** Mobile menu opens but items are clipped or invisible.

### Pitfall 2: Double Navbar Definition Cascade Conflict
**What goes wrong:** style.css has `.navbar` defined at ~line 204 and again at ~line 2556. Adding `.navbar.scrolled` styles near the top will be overridden by the second `.navbar` block at line 2556.
**Why it happens:** CSS specificity — the second `.navbar` rule (same specificity) overwrites background/border added to `.navbar.scrolled`.
**How to avoid:** Place all `.navbar.scrolled` styles AFTER line 2556 in style.css, or use `.navbar.scrolled.scrolled` for higher specificity.
**Warning signs:** Scrolled state styles not appearing, or only partially applying.

### Pitfall 3: GSAP ScrollTrigger Firing Before Fonts Load
**What goes wrong:** GSAP calculates element positions at registration time. If the page layout hasn't settled (fonts loading, images), the trigger start positions are wrong.
**Why it happens:** GSAP's CDN scripts are `defer` — they run after DOMContentLoaded, but fonts from Google Fonts may not be fully applied.
**How to avoid:** Call `ScrollTrigger.refresh()` on `window.load` event, after all resources have loaded.
```javascript
window.addEventListener('load', () => ScrollTrigger.refresh());
```
**Warning signs:** Sections that trigger too early or too late on first page load.

### Pitfall 4: ROI Calculator CLP/USD Mixing
**What goes wrong:** FINANCIAL_STRATEGY.md uses USD for Sisteco pricing ($472/mes) but Chilean context uses CLP for ticket promedio. Mixing currencies without conversion gives nonsensical ROI numbers.
**Why it happens:** The calculator inputs are in CLP (ticket promedio) but Sisteco plan costs are in USD.
**How to avoid:** Either (a) display savings in CLP using an approximate conversion, (b) display ROI as a ratio rather than absolute number, or (c) keep all outputs in CLP using CLP plan price (CLP ~472 × 900 = CLP 424,800/mes approximately). Use clear labels on each output.
**Warning signs:** ROI % of 50,000% or outputs that look unrealistic.

### Pitfall 5: Vision Section Conflicts with Existing vision.html
**What goes wrong:** The teaser added to index.html links to `pages/vision.html`, but the existing vision.html has its own distinct "manifesto" content. The two must feel coherent, not redundant.
**Why it happens:** The existing vision.html covers "buyer power shift" manifesto — this is different from the autonomous agents future vision.
**How to avoid:** vision.html should be EXPANDED with a new section specifically about autonomous agents (2026→2030 timeline), appended after the existing manifesto sections, not replacing them.
**Warning signs:** Clicking "Ver nuestra visión completa" leads to content that doesn't match the teaser.

### Pitfall 6: Cursor Glow Competing with Custom Cursor
**What goes wrong:** main.js already has `initCustomCursor()` which creates a 24px circle cursor following the mouse. Adding a cursor glow creates a second element — both track `mousemove`. They can interfere visually.
**Why it happens:** Two separate DOM elements both following cursor position.
**How to avoid:** The cursor glow (large 400px radial gradient) and the custom cursor ring (24px circle) serve different purposes and can coexist if z-index is managed correctly: cursor ring at z-index: 10000, glow at z-index: 1. They should not conflict.
**Warning signs:** Visual jank with two things moving, or z-index stacking issues.

---

## Code Examples

### Existing animated-bg reference (style.css lines 141-187)
```css
/* Current implementation — already in style.css */
.animated-bg::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    background: radial-gradient(ellipse at center, rgba(197, 237, 54, 0.07) 0%, transparent 70%);
    border-radius: 50%;
    top: -200px; right: -200px;
    animation: bgFloat 20s ease-in-out infinite;
}
/* The hero orbs upgrade adds MORE opacity and hero-specific positioning */
```

### Existing initCustomCursor pattern (main.js lines 490-534)
```javascript
// Already exists — cursor glow is a COMPANION to this, not a replacement
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed; width: 24px; height: 24px;
    border: 1.5px solid rgba(197, 237, 54, 0.5);
    border-radius: 50%; pointer-events: none; z-index: 10000;
  `;
  // ... mousemove handler using direct style.left/top
}
// New cursor glow is a separate 400px radial gradient div at z-index: 1
```

### GSAP ScrollTrigger pattern already in use (main.js lines 395-427)
```javascript
// Existing pattern — extend this, don't duplicate it
ScrollTrigger.create({
  trigger: '.features-grid',
  start: 'top 80%',
  onEnter: () => {
    gsap.fromTo('.feature-card',
      { y: 60, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out' }
    );
  },
  once: true,
});
```

### CLP Formatting
```javascript
// Chilean peso format
function formatCLP(amount) {
  return amount.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
}
// Example: formatCLP(1500000) → "$ 1.500.000"
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Sticky full-width navbar always | Floating pill navbar on scroll | Modern, premium feel (AmpleMarket, Linear, Vercel) |
| Static gradient orbs | Multiple layered animated orbs with blur | Depth, motion in hero (Firecrawl, Resend) |
| No scroll animations | GSAP ScrollTrigger per-section reveals | Industry standard for landing pages |
| Feature list comparison | 4-column visual comparison table | Much stronger commercial argument (HumbleOps) |

---

## Open Questions

1. **Navbar pill on sub-pages with dark backgrounds**
   - What we know: Most sub-pages have `#F8F7F5` light bg, but some sections are dark
   - What's unclear: Does the pill need a dark variant for dark-hero sub-pages?
   - Recommendation: Start with light pill only, verify visually on como-funciona.html and dashboard.html

2. **ROI calculator CLP/USD conversion rate**
   - What we know: Sisteco prices are in USD ($472), tickets are in CLP (~1.2M+)
   - What's unclear: Should we use a fixed rate (e.g., 900 CLP/USD) or display ROI differently?
   - Recommendation: Display all outputs in CLP using a fixed reference rate of CLP 900/USD (conservative). Add disclaimer: "Estimación referencial basada en tasa de cambio aproximada."

3. **vision.html expansion scope**
   - What we know: Current vision.html has 4+ sections on buyer power manifesto
   - What's unclear: How much new content is needed for the autonomous agents section?
   - Recommendation: Add ONE new section at the bottom of vision.html — a dark-background section with the 2026-2030 timeline, matching the teaser design. Keep existing manifesto intact.

---

## Validation Architecture

> nyquist_validation key absent from .planning/config.json — treated as enabled.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual browser testing + visual inspection (no automated test framework in this project) |
| Config file | none — frontend-only HTML/CSS/JS project |
| Quick run command | `npm start` → http://localhost:3000 |
| Full suite command | `npm start` then manually check index.html, vision.html, and 2-3 sub-pages |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NAV-01 | Navbar shrinks to pill on scroll >80px | visual/manual | `npm start` → scroll index.html | n/a |
| NAV-02 | Pill navbar works on all 20 pages | visual/manual | `npm start` → check pages/precios.html | n/a |
| NAV-03 | Mobile hamburger menu still works with pill | visual/manual | `npm start` → resize to mobile | n/a |
| ANIM-01 | Hero gradient orbs animate (not static) | visual/manual | `npm start` → observe hero 5 seconds | n/a |
| ANIM-02 | GSAP scroll reveals trigger as sections enter | visual/manual | `npm start` → scroll through index.html | n/a |
| ANIM-03 | Card hover glow appears on feature cards | visual/manual | `npm start` → hover over cards | n/a |
| ANIM-04 | Cursor glow follows mouse on desktop | visual/manual | `npm start` → move mouse | n/a |
| COMP-01 | 4-column comparison table renders correctly | visual/manual | `npm start` → scroll to comparison | n/a |
| COMP-02 | Table is responsive on mobile | visual/manual | `npm start` → mobile viewport | n/a |
| ROI-01 | Calculator shows output when inputs change | visual/manual | `npm start` → change inputs | n/a |
| ROI-02 | CLP values format correctly (es-CL locale) | visual/manual | `npm start` → verify number format | n/a |
| VIS-01 | Vision teaser appears before CTA in index.html | visual/manual | `npm start` → scroll to bottom | n/a |
| VIS-02 | CTA links to vision.html and matches teaser | visual/manual | Click "Ver visión completa" button | n/a |

### Sampling Rate
- **Per task commit:** `npm start` and visually verify the modified page
- **Per wave merge:** Full cross-page check: index.html + vision.html + 2 sub-pages (precios.html, como-funciona.html) on desktop + mobile viewport
- **Phase gate:** All 13 requirements above pass before `/gsd:verify-work`

### Wave 0 Gaps
None — this is a frontend-only project with no automated test infrastructure. All validation is visual/manual via `npm start`.

---

## Sources

### Primary (HIGH confidence)
- Project codebase: style.css (lines 141-214, 2553-2558), js/main.js (lines 309-534), js/pages.js (lines 149-210) — direct code inspection
- CONTEXT.md — locked user decisions
- FINANCIAL_STRATEGY.md — ROI formula data ($1,253 DIY, CLP 1.2M SDR, 5-7x conversions)
- LANDING_PAGE_IMPROVEMENTS.md — competitor analysis and implementation specs

### Secondary (MEDIUM confidence)
- GSAP 3.12.7 documented behavior: ScrollTrigger `once: true`, `gsap.utils.toArray()`, `gsap.registerPlugin()` — consistent with code already working in project
- CSS sticky + pill technique: standard pattern, no external source needed, verified against existing sticky navbar in codebase

### Tertiary (LOW confidence — verify during implementation)
- CLP/USD conversion rate of 900: approximate as of 2026-03, should be verified or made configurable
- "Mobile hamburger at 768px breakpoint" — assumed based on common convention, must verify exact breakpoint in style.css before implementing mobile guard

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already loaded, verified in HTML source
- Architecture: HIGH — based on direct code inspection of style.css and JS files
- Pitfalls: HIGH — sourced from direct code analysis (double navbar definition, existing cursor pattern)
- ROI formula: MEDIUM — data from FINANCIAL_STRATEGY.md, currency conversion is approximate

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (stable tech: GSAP 3.12.7 CDN, Lucide 0.468.0, no framework churn expected)
