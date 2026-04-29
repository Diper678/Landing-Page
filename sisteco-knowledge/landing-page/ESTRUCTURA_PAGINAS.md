# Sisteco — Estructura de Paginas del Landing

> Mapa completo de todas las paginas del sitio sisteco.cl y su contenido.

---

## Archivos principales

| Archivo | Ruta publica | Proposito |
|---|---|---|
| `index.html` | `/` | Landing page principal |
| `style.css` | — | Estilos globales (~2970 lineas) |
| `css/pages.css` | — | Estilos especificos de sub-paginas (~1700 lineas) |
| `js/main.js` | — | Logica frontend: form handling, animaciones, Lucide |
| `server.js` | — | Express server para desarrollo local |

---

## index.html — Estructura de secciones

Orden de secciones (de arriba a abajo):

1. **`<nav.navbar>`** — Sticky con backdrop-blur, hamburger mobile menu
   - Floating pill al hacer scroll (clase `.scrolled` agregada via JS a 80px)
   - Logo izquierda, links centro, CTA derecha

2. **`<header.hero>`** — Grid 2 columnas
   - Col izquierda: headline, subtitulo, form de captura de email
   - Col derecha: Dashboard CSS mockup animado (datos en vivo)

3. **`<div.logos-bar>`** — Barra de herramientas y canales
   - "Data tools": ScrapingBee, Firecrawl, PhantomBuster
   - "Canales": Email, LinkedIn, WhatsApp, Slack, Instagram
   - "Compliance": CRM, IA, Ley 21.719, 24/7

4. **`<section#como-funciona.bento-section>`** — Bento grid (dark, #111)
   - Card hero 2x2: Prospeccion IA (scoring, HOT/WARM/NURTURE/SKIP)
   - 4 cards 1x1: Secuencias, Omnicanal, Analisis, Seguridad
   - Cada card linkea a `pages/soluciones.html#seccion`
   - GSAP stagger animation al entrar en viewport

5. **`<section.features>`** — 3 cards de features
   - Extraccion de datos
   - IA Adaptativa (optimizacion continua)
   - Secuencias automatizadas
   - Fila adicional de features secundarios

6. **`<section.comparison-section>`** — Tabla comparativa 4 columnas
   - Sisteco vs DIY Stack vs Contratar SDR vs No hacer nada
   - 9 filas de comparacion (costo, setup, velocidad, ROI, etc.)
   - Sisteco destacado con columna accent

7. **`<section.roi-section>`** — Calculadora ROI interactiva
   - Inputs: # vendedores, ticket promedio en CLP
   - Outputs: ROI mensual estimado, leads generados, ahorro vs DIY/SDR
   - Formulas basadas en datos reales de FINANCIAL_STRATEGY.md

8. **`<section.vision-teaser-section>`** — Teaser de vision agentes
   - Timeline 2026-2030 horizontal (vertical en mobile)
   - CTA → `pages/vision.html`

9. **`<section.cta-section>`** (dark, #111) — CTA principal
   - 3 stats reales (24/7, <5min respuesta, Ley 21.719)
   - Form de captura de email

10. **`<footer>`** — Dark, 4 columnas
    - Brand row: logo + tagline + social (LinkedIn + email)
    - 4 columnas: Producto / Empresa / Legal / Contacto
    - Contacto: Santiago Chile, tel, email

---

## Sub-paginas en /pages/

| Pagina | Ruta | Contenido |
|---|---|---|
| `soluciones.html` | `/pages/soluciones.html` | 5 secciones de soluciones |
| `como-funciona.html` | `/pages/como-funciona.html` | Infraestructura de 5 capas |
| `precios.html` | `/pages/precios.html` | 3 planes + add-ons + comparativa |
| `vision.html` | `/pages/vision.html` | Manifiesto + vision workflows-first y data layer Chile |
| `dashboard.html` | `/pages/dashboard.html` | Mockup de dashboard |
| `sobre-nosotros.html` | `/pages/sobre-nosotros.html` | Equipo (3 fundadores reales) |
| `contacto.html` | `/pages/contacto.html` | Formulario de contacto, Santiago Chile |
| `legal.html` | `/pages/legal.html` | Terminos y privacidad |
| + otras | — | ~20 paginas en total |

---

## soluciones.html — Secciones

5 secciones con navegacion por pills en la parte superior:

1. **`#data-quality`** — Prospeccion con IA
   - LinkedIn Lead Scoring (HOT/WARM/NURTURE/SKIP)
   - Motor de 100 puntos (empresa, perfil, senales de interes)
   - Stats: 5-7x conversiones, -70% costo/lead

2. **`#ai-247`** — Ventas Automatizadas
   - Secuencias de 5 emails, 9AM, intervalos 7 dias
   - Deteccion de respuestas → pausa automatica
   - Stats: 21x mas conversiones respondiendo < 5 min

3. **`#omnichannel`** — Omnicanal
   - LinkedIn → Email → Slack → Notion pipeline
   - 5 canales activos simultaneamente
   - Stats: 89% retencion vs 33% sin omnicanal

4. **`#analytics`** — Analisis e Inteligencia de Datos
   - Dashboards en tiempo real
   - Reportes automaticos
   - Alertas y 360° pipeline view

5. **`#security`** — Seguridad
   - Cumplimiento Ley 21.719 (diciembre 2026)
   - Cifrado E2E
   - Privacy by design

**Alternancia de secciones:** Claro / Oscuro / Claro / Oscuro / Claro

---

## sobre-nosotros.html — Equipo real

| Nombre | Cargo |
|---|---|
| Felipe Martinez | CEO / Fundador |
| Cristian Martinez G. | CTO |
| Jhonatan Ramirez G. | COO |

**Metricas reales (no inventadas):** 5-7x conversiones, <5min respuesta, 24/7, 391% ROI

---

## Footer canonico (identico en todas las paginas)

```html
<!-- Estructura del footer -->
<footer class="footer">
  <!-- Brand row: logo + tagline + social inline -->
  <div class="footer-brand-row">
    <img src="../assets/logos/Logo Sisteco Negativo-01.png" />
    <span>Infraestructura inteligente para ventas B2B</span>
    <a href="https://www.linkedin.com/company/sisteco/">LinkedIn</a>
    <a href="mailto:contacto@sisteco.cl">Email</a>
  </div>

  <!-- 4 columnas -->
  <div class="footer-columns">
    <div>Producto: Soluciones, Como funciona, Dashboard, Precios, Vision</div>
    <div>Empresa: Sobre nosotros, Contacto</div>
    <div>Legal: Terminos, Privacidad, Ley 21.719</div>
    <div>Contacto: contacto@sisteco.cl, +56 9 40065566, Santiago</div>
  </div>

  <!-- Bottom bar -->
  <div class="footer-bottom">
    © 2026 Sisteco · Av. Alonso de Cordova 5870 Of. 413, Las Condes, Santiago de Chile
  </div>
</footer>
```

---

## Navbar flotante (todas las paginas)

```javascript
// js/main.js
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
});
```

```css
/* style.css */
.navbar.scrolled {
  max-width: 900px;
  margin: 12px auto;
  border-radius: 50px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  padding: 8px 24px;
}
```

---

## Animaciones implementadas

1. **Gradient orbs** en hero (CSS @keyframes, 2-3 blobs animados)
2. **GSAP ScrollTrigger** — fade-in + slide-up para todas las secciones al entrar en viewport
3. **Card hover glow** — borde accent en hover de feature cards
4. **Cursor glow** — radial gradient que sigue al mouse (solo desktop)
5. **Bento grid stagger** — GSAP stagger para cards de "Como Funciona"
6. **Dashboard animations** — barras que crecen, leads que entran, dot "en vivo"

---

## Formularios de captura

Todos los formularios de email van a `api/leads.js` que hace upsert en Convex:

```javascript
// Campos capturados
{
  email: "...",
  source: "hero_form" | "cta_form" | "demo_form",
  utmSource: req.body.utm_source,
  utmMedium: req.body.utm_medium,
  utmCampaign: req.body.utm_campaign,
  referrer: req.headers.referer,
  userAgent: req.headers['user-agent']
}
```

---

*Ultima actualizacion: 2026-03-04 (post-Phase 02 landing improvements completo)*
