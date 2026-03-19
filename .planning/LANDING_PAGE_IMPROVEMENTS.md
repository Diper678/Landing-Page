# Sisteco Landing Page — Análisis de Mejoras

> Basado en scraping de: Apollo.io, AmpleMarket, Firecrawl.dev, Base10.vc, HumbleOps.com
> Fecha: 2026-03-04

---

## 1. NAVBAR — Floating Shrink (Inspiración: AmpleMarket)

### Qué hacen ellos
AmpleMarket usa una navbar que:
- Empieza full-width, transparente sobre el hero
- Al hacer scroll, **se encoge** horizontalmente (max-width ~900px)
- Se le aplican **bordes redondeados** (border-radius ~50px)
- Flota con **sombra** y backdrop-blur
- Transición suave CSS (~0.3s)

### Qué tenemos nosotros
- Navbar sticky con backdrop-blur (bueno)
- Full-width siempre, sin transición on scroll
- Sin border-radius, sin encogimiento

### Implementación propuesta
```css
/* Estado base: full width */
.navbar {
  position: sticky; top: 0; width: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Estado scroll: floating pill */
.navbar.scrolled {
  max-width: 900px;
  margin: 12px auto;
  border-radius: 50px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  padding: 8px 24px;
}
```
```js
// JS: toggle class on scroll
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
});
```

**Esfuerzo:** ~2h | **Impacto visual:** Alto

---

## 2. ANIMACIONES DE FONDO (Inspiración: Firecrawl)

### Qué hacen ellos
- Gradient orbs animados (blobs de color que se mueven lentamente)
- Partículas/grid animado sutil
- Efecto "glow" en hover sobre cards
- Transiciones suaves en scroll con GSAP ScrollTrigger

### Qué tenemos nosotros
- `animated-bg` y `grid-pattern-overlay` (estático)
- GSAP ya cargado pero subutilizado
- Noise texture en dark sections (bueno)

### Mejoras propuestas
1. **Gradient orbs animados** en el hero (2-3 blobs con CSS animation keyframes)
2. **Card hover glow** — borde que brilla en accent color al hover
3. **GSAP ScrollTrigger** — fade-in + slide-up para secciones al entrar en viewport
4. **Cursor glow** — sutil efecto de luz que sigue al mouse (solo desktop)

**Esfuerzo:** ~4h | **Impacto visual:** Alto

---

## 3. COMPARATIVA COMERCIAL — Stack DIY vs Sisteco (Mejora)

### Estado actual (como-funciona.html + precios.html)
- Lista de features ✓/✗
- Precios: DIY ~$1,253/mes vs Sisteco desde $472/mes
- Falta: **métricas de resultado comercial**

### Datos que tenemos para enriquecer
| Métrica | DIY Stack | Con Sisteco |
|---------|-----------|-------------|
| Tiempo de setup | 2-4 semanas | <24 horas |
| Leads generados/semana | ~50 (manual) | ~200+ (automatizado) |
| Tiempo primer contacto | 4-42 horas | <5 minutos |
| Tasa de respuesta email | 2-5% (genérico) | 15-25% (personalizado IA) |
| Conversiones (respuesta <5min) | Baseline | 21x más |
| Secuencia email | Manual, inconsistente | 5 emails automatizados, 7d intervalos |
| Horario operación | 8h/día (horario laboral) | 24/7 (agentes IA) |
| Canales activos | 1-2 | 5 (Email, LinkedIn, WhatsApp, Slack, Instagram) |
| Costo mensual total | ~$1,253 + setup $3-8K | Desde $472 (setup incluido) |
| ROI esperado | Incierto | 391% (Forrester/PolyAI) |

### Propuesta
- Tabla comparativa visual estilo HumbleOps (columnas side-by-side, checkmarks verdes vs X rojas)
- Agregar **timeline visual**: "Minuto 0 → Minuto 5: ya tienes lista de prospectos y outreach corriendo"
- Sección "En 1 semana con Sisteco" con métricas proyectadas
- **Calculadora ROI interactiva** (input: # vendedores, ticket promedio → output: ROI estimado)

**Esfuerzo:** ~6h | **Impacto comercial:** MUY Alto

---

## 4. VISIÓN AGENTES AUTÓNOMOS — Nueva sección

### Concepto de Felipe
El futuro es un mundo donde agentes autónomos:
- Manejan departamentos completos de empresas
- Compran, invierten, toman decisiones operativas
- Consumen servicios y APIs de manera autónoma
- Operan 24/7 sin intervención humana (OpenAI Operator, Claude Computer Use, Mold Bot)

### Propuesta: Sección "El Futuro que Construimos"
**Ubicación:** Nueva sección en index.html antes del CTA final, o página dedicada en visión.html

**Contenido:**
1. **Headline:** "Construimos infraestructura para el mundo que viene"
2. **Subtext:** "Hoy automatizamos tu prospección. Mañana, los agentes autónomos manejarán departamentos completos."
3. **Timeline visual:**
   - **2026:** Automatización de ventas B2B (donde estamos)
   - **2027:** Agentes que gestionan pipelines completos
   - **2028:** Plataformas agent-to-agent (compra, venta, negociación entre agentes)
   - **2030:** Departamentos autónomos gestionados por IA
4. **Diferenciador:** "Automatizacion de ventas B2B hecha para Chile. Workflows inteligentes + datos locales (SII, RUT, Ley 21.719) = mas cierres con menos esfuerzo."

**Esfuerzo:** ~4h | **Impacto de posicionamiento:** Alto

---

## 5. MEJORAS GENERALES DE UX/UI

### 5.1 Hero Section
- **Actual:** Grid 2 columnas (texto + dashboard mockup CSS)
- **Mejora:** Agregar video/animación del dashboard funcionando (como HumbleOps)
- **Alternativa rápida:** Animación CSS del dashboard con datos que se actualizan

### 5.2 Social Proof (Inspiración: Apollo)
- Apollo muestra: "500K+ companies", testimonios con foto + cargo + empresa + métrica
- **Nosotros:** Eliminamos testimonios fake (correcto), pero falta reemplazar
- **Propuesta:** Sección "Resultados reales" con métricas verificables sin nombres de clientes

### 5.3 CTA Sections
- **Actual:** CTA simple con 3 stats
- **Mejora (Apollo-style):** CTA con signup form inline + badges de seguridad debajo

### 5.4 Página de Precios (Inspiración: Apollo + HumbleOps)
- HumbleOps tiene tabla comparativa excelente (Humble vs Big Box vs DIY vs Status Quo)
- **Propuesta:** Replicar esa tabla con Sisteco vs DIY vs Contratar SDR vs No hacer nada
- Incluir "Cash at risk" y "Time to first value" como columnas

---

## 6. PRIORIZACIÓN PARA GSD

| # | Mejora | Esfuerzo | Impacto | Prioridad |
|---|--------|----------|---------|-----------|
| 1 | Navbar floating/shrink | 2h | Alto visual | P1 |
| 2 | Comparativa comercial mejorada | 6h | MUY Alto comercial | P1 |
| 3 | Animaciones background (hero orbs + scroll) | 4h | Alto visual | P2 |
| 4 | Visión agentes autónomos | 4h | Alto posicionamiento | P2 |
| 5 | Tabla precios estilo HumbleOps | 3h | Alto comercial | P2 |
| 6 | Social proof / resultados reales | 2h | Medio | P3 |
| 7 | Hero animation/video | 4h | Medio | P3 |
| 8 | CTA con form inline | 2h | Medio | P3 |

### Fases GSD sugeridas
- **Fase 1:** Navbar floating + Comparativa comercial (P1s)
- **Fase 2:** Animaciones + Visión agentes + Tabla precios
- **Fase 3:** Social proof + Hero + CTA polish

---

## REFERENCIAS CLAVE POR COMPETIDOR

| Sitio | Lo mejor para copiar |
|-------|---------------------|
| **AmpleMarket** | Navbar floating pill on scroll |
| **Apollo.io** | Footer horizontal (DONE ✅), social proof con métricas, CTA con form |
| **Firecrawl** | Gradient orbs animados, card hover glow, dark theme animations |
| **Base10.vc** | Estética dark minimal, tipografía bold, portfolio visual |
| **HumbleOps** | Tabla comparativa (Humble vs alternatives), timeline de implementación, FAQ section, "Day 1-11" roadmap visual |
