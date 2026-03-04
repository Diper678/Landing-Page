Cla# Sisteco — Brand Guidelines
> Versión 1.0 · Febrero 2026

---

## 1. Identidad de Marca

### Misión
Sisteco es la **infraestructura inteligente** que automatiza la prospección B2B. No somos una herramienta más: somos la capa de orquestación que conecta extracción de datos, IA y activación multicanal en un único sistema cohesionado.

### Posicionamiento
- **Categoría:** B2B Sales Infrastructure / Revenue Automation
- **Para:** Equipos de ventas y founders de empresas SaaS, agencias y consultoras
- **Diferencial:** Composable — cada capa trabaja en sincronía para convertir datos en ingresos

### Personalidad de Marca
| Atributo | Expresión práctica 
|---|---|
| **Técnico pero cercano** | Lenguaje preciso sin jerga innecesaria |
| **Orientado a resultados** | Métricas siempre presentes (10x, 40%, 500+) |
| **Confiable** | Arquitectura modular, GDPR compliant |
| **Eficiente** | Sin fricciones, setup en 5 minutos |

### Voz y Tono
- **Idioma principal:** Español (es-ES), tuteo profesional (`tu`)
- **Verbos de acción:** Automatiza, Escala, Orquesta, Convierte
- **Nunca:** Frases largas, promesas vagas, tono corporativo frío
- **Siempre:** Métrica concreta > afirmación genérica

**Ejemplos de copy aprobados:**
```
✅ "Pasamos de 20 a 200 leads al día, con mejor calidad."
✅ "Configura tu primer workflow en minutos, no en días."
✅ "Tu equipo solo habla con leads que ya quieren comprar."

❌ "Solución innovadora de vanguardia para el crecimiento empresarial."
❌ "Plataforma integral de gestión comercial avanzada."
```

---

## 2. Paleta de Colores

### Colores Primarios

| Token | Hex | Uso |
|---|---|---|
| `--color-bg` | `#F8F7F5` | Fondo principal (warm white) |
| `--color-text-main` | `#111111` | Texto principal, botones oscuros, superficies dark |
| `--color-text-sub` | `#666666` | Texto secundario, descripciones |
| `--color-accent` | `#c5ed36` | Acento principal (lime) — CTAs, highlights |
| `--color-accent-hover` | `#b3d82f` | Estado hover del acento |
| `--color-border` | `#e5e5e5` | Bordes de cards y separadores |

### Paleta Completa

```
Warm White    #F8F7F5  ████  → Fondo base de toda la UI
Near Black    #111111  ████  → Texto, superficies oscuras, btn-primary bg
Dark Gray     #333333  ████  → Hover de superficies oscuras
Mid Gray      #666666  ████  → Texto secundario
Light Gray    #888888  ████  → Texto terciario (trust items)
Border Gray   #e5e5e5  ████  → Bordes
Lime          #c5ed36  ████  → Acento principal — usar con precaución
Lime Dark     #b3d82f  ████  → Hover del acento
```

### Superficies

| Superficie | Color | Uso |
|---|---|---|
| **Light** | `#F8F7F5` / `#ffffff` | Cards, secciones principales |
| **Dark** | `#111111` | CTA section, footer, hero badges, featured card |
| **Glass** | `rgba(248,247,245,0.85)` + `backdrop-filter:blur(20px)` | Navbar sticky |
| **Accent-tinted** | `rgba(197,237,54,0.07-0.15)` | Glow effects, selection highlight |

### Gradientes

```css
/* Texto sobre fondo claro */
.gradient-text {
  background: linear-gradient(135deg, #111111 0%, #b3d82f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Texto sobre fondo oscuro */
.gradient-text-light {
  background: linear-gradient(135deg, #ffffff 0%, #c5ed36 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Glow ambiental (fondo animado) */
radial-gradient(ellipse at center, rgba(197, 237, 54, 0.07) 0%, transparent 70%)
```

### Reglas de Uso del Color

- El lime `#c5ed36` **nunca** se usa como fondo de texto oscuro en superficies grandes (cansa la vista). Solo en botones, badges pequeños y highlights.
- Sobre superficie oscura (`#111`), el lime se usa directamente como texto acento.
- Los gradientes de texto aplican solo a **1-3 palabras clave** en un heading, no a párrafos enteros.
- El `selection` color es `rgba(197,237,54,0.3)` — coherente con la identidad.

---

## 3. Tipografía

### Familias

| Familia | Uso | Pesos disponibles |
|---|---|---|
| **Sharp Grotesk** | Headings (h1–h6), botones, navegación, labels | 400 (Book), 500 (Medium), 700 (Bold) |
| **Source Sans 3** | Body text, párrafos, formularios | 400, 600 |
| **Nasalization** | Logo wordmark (`Sisteco`) únicamente | 400 |

```css
/* CSS Variables */
--font-heading: 'Sharp Grotesk', sans-serif;
--font-body: 'Source Sans 3', sans-serif;
/* Nasalization solo en .logo-text */
```

### Escala Tipográfica

| Nivel | Tamaño | Peso | Tracking | Line-height | Uso |
|---|---|---|---|---|---|
| **Display / H1** | `clamp(36px, 4vw, 52px)` | 500 | `-0.025em` | `1.08` | Hero headline único |
| **H2 Section** | `clamp(28px, 3vw, 40px)` | 500 | `-0.02em` | `1.15` | Títulos de sección |
| **H3 Card** | `20–22px` | 500 | `normal` | `1.3` | Títulos de feature cards |
| **H4 Small** | `16px` | 500 | `normal` | `1.4` | Sub-items (additional features) |
| **Body Large** | `18px` | 400 | `normal` | `1.7` | Descripciones hero y sección |
| **Body** | `16px` | 400 | `normal` | `1.5` | Texto general |
| **Body Small** | `14px` | 400 | `normal` | `1.5` | Nav links, labels |
| **Caption / Meta** | `13px` | 400 | `normal` | `1.4` | Timestamps, metadata, trust items |
| **Logo** | `18px` | 400 | `0.02em` | `1` | Wordmark únicamente (Nasalization) |
| **Section Label** | `12px` | 700 | `0.1em` | `1` | Eyebrow tags de sección (uppercase) |
| **Badge** | `13px` | 700 | `0.05em` | `1` | `.new-badge`, pills |
| **Metric Value** | `28–48px` | 700 | `-0.02em` | `1` | KPI numbers (10x, 500+, 40%) |

### Reglas Tipográficas

- **Siempre** usar Sharp Grotesk para cualquier texto que no sea párrafo corrido.
- El peso 500 (Medium) es el default de headings — el 700 solo para números KPI y badges.
- No usar italic en Sharp Grotesk (no forma parte de la personalidad de marca).
- Los section labels van siempre en **uppercase + tracking 0.1em**, son el "eyebrow" que introduce la sección.

---

## 4. Espaciado y Layout

### Grid y Contenedor

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;       /* gutter mobile */
}
```

- Layout desktop: hasta **1200px** de ancho útil
- Gutter de contenedor: **24px** en cada lado
- Grid hero (2 columnas): `1fr 1fr`, gap `72px`
- Hero colapsa a 1 columna por debajo de **1024px**

### Espaciado Vertical de Secciones

| Elemento | Valor |
|---|---|
| Padding vertical de secciones | `80px 0` — `120px 0` |
| Espacio entre section-label y h2 | `16px` |
| Espacio entre h2 y section-desc | `16px` |
| Espacio entre section y su contenido | `48–64px` |
| Gap entre cards (grid) | `24–32px` |
| Espacio entre elementos de form | `12px` |

### Border Radius

```css
--radius-sm: 12px;   /* inputs, small cards, tool pills */
--radius-md: 14px;   /* feature cards */
--radius-lg: 24px;   /* hero dashboard, large panels */
/* pill */  100px;   /* buttons, badges, avatars */
```

---

## 5. Componentes

### Botones

```
btn-primary   → bg:#c5ed36  text:#111  pill  padding:10px 22px  font:SharpGrotesk 500 14px
btn-primary hover → bg:#b3d82f  translateY(-2px)  box-shadow:0 8px 25px rgba(197,237,54,0.3)

btn-ghost     → bg:transparent  text:#666  pill
btn-ghost hover → bg:rgba(0,0,0,0.05)  underline animada (lime) desde centro

btn-large     → padding:16px 36px  font-size:18px  (usado en CTA section)
btn-shine     → efecto shimmer blanco en hover (para CTAs prominentes)
```

**Regla:** Siempre máximo **1 btn-primary** visible en pantalla en el mismo eje de atención. Los secundarios van como ghost.

### Badges y Pills

```
.new-badge / .section-label  →  bg:#111  text:#c5ed36  pill  13px  font-weight:700  tracking:0.05em
.tool-pill                   →  bg:#f5f5f5  border:#e5e5e5  12px radius  12px 14px padding
.db-badge-live               →  con dot animado (livePulse) para indicar "en vivo"
```

### Section Labels (Eyebrow)
```css
.section-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent-hover);
  margin-bottom: 16px;
}
```

### Cards

**Feature Card (light)**
- Background: `#fff`
- Border: `1px solid #e5e5e5`
- Radius: `var(--radius-md)` = 14px
- Hover: lift (`translateY(-4px)`) + border `#c5ed36`
- Diagrama: icono micro-workflow en header de card

**Testimonial Card (light)**
- Background: `#fff`, border: `1px solid #e5e5e5`, radius: 14px
- Stars: `★★★★★` en `#c5ed36`

**Testimonial Card Featured (dark)**
- Background: `#111`
- Texto blanco + acento lime
- Badge "Caso destacado" con borde lime
- Métrica grande (10x) en lime bold

**Hero Dashboard**
- Background: `rgba(255,255,255,0.9)` con glassmorphism
- Radius: 16px, border: `1px solid rgba(229,229,229,0.8)`
- Header con dots decorativos (rojo/amarillo/verde)

### Formularios

```
Input email  →  bg:#fff  border:#e5e5e5  radius:var(--radius-sm)=12px  padding:12px 16px
             →  focus: border:#c5ed36  box-shadow:0 0 0 3px rgba(197,237,54,0.15)
             →  font: Source Sans 3 16px  placeholder:#999
```

### Avatares

- Círculo, `radius:50%`, 36–40px
- Iniciales en 2 letras, peso 600
- Paleta interna: lime+dark (`#c5ed36`/`#111`), dark+white (`#111`/`#fff`), neutral (`#f0f0f0`/`#666`)

### Infra Layers (Pill horizontal)

Cada capa es una fila con: número `01`–`05` (Nasalization) + título + descripción + tool pills. Las capas se conectan con conectores `arrow-down`. Sin línea de spine vertical (eliminada en v1).

---

## 6. Iconografía

### Sistema Principal
**Lucide Icons** (versión `0.468.0`)
```html
<script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
```
- Tamaños estándar: `14px` (inline/meta), `18px` (nav/CTA), `20px` (features), `24px` (sección)
- Color default: heredar del texto. Accent: `var(--color-accent)` o `var(--color-accent-hover)`
- Trazo: 1.5–2px (Lucide default), nunca rellenar

**Iconos de marca específicos (Lucide):**
| Concepto | Icono |
|---|---|
| Automatización / CTA | `sparkles`, `zap` |
| Seguridad / GDPR | `shield`, `shield-check` |
| Datos / IA | `database`, `brain`, `sparkles` |
| Tiempo / eficiencia | `clock`, `timer` |
| Crecimiento | `trending-up`, `line-chart` |
| Multicanal | `mail`, `linkedin`, `message-circle` |
| Leads | `users`, `user-check` |

### Brand SVGs (integrations)
Ubicados en `assets/icons/`:
- `scrapingbee.svg` — extracción web
- `firecrawl.svg` — crawling
- `claude.svg` — AI análisis
- `gemini.svg` — AI análisis
- `kimi.svg` — AI análisis

Los brand SVGs siempre van con texto debajo (`<span>NombreHerramienta</span>`) para accesibilidad y contexto.

### Logo Sisteco
Ubicado en `assets/logos/`:
- `Logo 2 no background.png` — versión positiva (para fondo claro, navbar)
- `Logo Sisteco Negativo-01.png` — versión negativa (para fondo oscuro, footer)
- En navbar: altura fija `28px`, ancho auto
- En footer: clase `.footer-logo` con altura definida
- Wordmark: Nasalization 18px, `letter-spacing: 0.02em`, color `#111111`

**Zona de exclusión del logo:** Espacio mínimo equivalente a la altura del icono en todos los lados.

---

## 7. Motion y Animaciones

### Easing Principal
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```
Se usa en todos los hover de botones, cards y nav items. Transmite energía y precisión.

### Transiciones Estándar
| Elemento | Duración | Easing |
|---|---|---|
| Hover botones | `0.3s` | `ease-out-expo` |
| Hover cards | `0.3s` | `ease` |
| Nav collapse | `0.3–0.5s` | `ease` |
| Shimmer shine | `0.7s` | `ease` |

### Keyframes Definidas

```
bgFloat      → fondo animado lime, 20-25s, infinite, easing ease-in-out
barGrow      → barras del chart del dashboard crecen desde 0 al valor definido
slideInLead  → lead items entran desde la derecha con fadeIn
floatUp      → badges flotantes del hero se elevan suavemente, infinito
livePulse    → dot del badge "en vivo" late en escala 0.8↔1.2, 1.5s infinito
fadeInUp     → elementos de sección aparecen desde abajo con scroll (GSAP ScrollTrigger)
```

### Principios de Animación
1. **Propósito:** Cada animación comunica algo (datos en vivo, crecimiento, precisión). Sin decoración vacía.
2. **Sutil en fondo, expresivo en interacción:** El animated-bg es a 4–7% opacidad. Los hover son nítidos.
3. **`prefers-reduced-motion`:** Las animaciones infinitas deben detenerse si el usuario lo indica.
4. **ScrollTrigger:** El `fadeInUp` de GSAP se aplica a `.section-title`, `.feature-card`, `.infra-layer`, etc. con `start: "top 85%"`.

---

## 8. Patrones de Sección

### Estructura Estándar de Sección

```html
<section class="[nombre]-section">
  <div class="container">
    <span class="section-label">Categoría en mayúsculas</span>
    <h2 class="section-title center">
      Título con <span class="gradient-text">palabra clave</span>
    </h2>
    <p class="section-desc">Descripción de apoyo, máx. 2 líneas.</p>
    <!-- Contenido: grid de cards, lista, etc. -->
  </div>
</section>
```

- `section-label`: eyebrow en lime
- `section-title`: Sharp Grotesk 500, con 1 fragmento en gradient-text
- `section-desc`: Source Sans 3, `#666`, centrado, máx 600px ancho

### Secciones Oscuras (Dark Surface)
Usadas para romper la monotonía de la página:
- **CTA Section:** bg `#111`, texto blanco, gradient-text-light en la keyword, btn-primary lime
- **Footer:** bg `#111`, borde superior lime sutil (`rgba(197,237,54,0.15)`)
- **Featured testimonial card:** bg `#111` inline dentro de sección clara

### Patrón de Social Proof
- **Logos Bar:** fila horizontal de herramientas con iconos + texto, separador visual entre "Data tools" y "Channels"
- **Testimonials:** siempre 3 cards en grid, 1 de ellas featured/dark para ancla visual
- **Stats en CTA:** 3 métricas en fila (ícono + número grande + label)

---

## 9. Responsive y Mobile

| Breakpoint | Comportamiento |
|---|---|
| `> 1024px` | 2 columnas en hero, hero-visual visible |
| `768px – 1024px` | Hero colapsa a 1 col centrado, visual oculto |
| `≤ 768px` | Nav collapsa a hamburger, btn-primary en nav oculto, mobile-cta visible en menú |

**Mobile-first principles:**
- El contenido nunca se trunca — siempre colapsa a 1 columna
- Touch targets mínimo 44px
- El hero en mobile centra el texto y el form ocupa full width

---

## 10. Fondo Visual Ambiental

Dos capas siempre presentes en toda la app:

```html
<div class="animated-bg"></div>     <!-- glow lime flotante, position:fixed, z-index:0 -->
<div class="grid-pattern-overlay"></div>  <!-- grid 60x60px, 2% opacidad, position:fixed -->
```

El grid pattern refuerza la sensación de "sistema técnico/infraestructura". Nunca suprimirlo en aplicaciones web. En documentos o PDFs: omitir.

---

## 11. Integrations & Stack Visual

Cuando se represente la arquitectura de Sisteco usar el modelo de **5 capas composables**:

```
01 · Adquisición de Datos    → ScrapingBee, Firecrawl
      ↓
02 · Inteligencia AI         → Claude, Gemini, Kimi
      ↓
03 · Sisteco Core            → Motor de orquestación central
      ↓
04 · Activación              → Email, LinkedIn, WhatsApp
      ↓
05 · Retención               → CRM Sync, Reporting
```

Los números `01`–`05` usan **Nasalization** para crear coherencia con el logo. Las capas van de mayor distancia al lead (arriba) a mayor cercanía (abajo).

---

## 12. Do's & Don'ts

### Colores
```
✅ DO    Usar lime solo como acento en botones, badges, highlights y métricas clave
✅ DO    Usar #111 como fondo en secciones de alto impacto (CTA, footer)
✅ DO    Usar gradient-text en exactamente 1–2 palabras de cada heading de sección
❌ DON'T Usar lime como color de fondo en superficies grandes
❌ DON'T Combinar más de 2 colores de acento distintos en la misma pantalla
❌ DON'T Usar colores fuera de la paleta definida (ej: azul, rojo, naranja) salvo en logos de terceros
```

### Tipografía
```
✅ DO    Sharp Grotesk para todos los headings, botones y labels
✅ DO    Nasalization exclusivamente para el wordmark "Sisteco"
✅ DO    Métricas grandes (KPIs) en peso 700 para máximo impacto
❌ DON'T Usar Nasalization en texto corrido o headings de sección
❌ DON'T Mezclar más de 2 familias tipográficas en la misma pantalla
❌ DON'T Texto en lime sobre fondo blanco (ratio de contraste insuficiente)
```

### Logo
```
✅ DO    Logo positivo (con background) en fondos claros
✅ DO    Logo negativo en footer y fondos oscuros
✅ DO    Zona de exclusión ≥ altura del icono en todos los lados
❌ DON'T Distorsionar proporciones del logo
❌ DON'T Colocar el logo sobre fondos muy texturizados sin zona limpia
❌ DON'T Usar el logo en colores que no sean los originales
```

### Voz
```
✅ DO    Métricas específicas: "10x más leads en 30 días"
✅ DO    Beneficio antes que feature: "Tu equipo solo habla con quien quiere comprar"
✅ DO    CTAs con verbo de acción: "Comenzar prueba gratuita", "Ver cómo funciona"
❌ DON'T Promesas vagas: "Solución integral para el crecimiento"
❌ DON'T Jargon técnico sin contexto: "ML pipeline orchestration"
❌ DON'T CTAs pasivos: "Más información", "Saber más"
```

---

## Apéndice — Tokens CSS de Referencia Rápida

```css
/* ── COLORS ───────────────────────────── */
--color-bg:           #F8F7F5;
--color-text-main:    #111111;
--color-text-sub:     #666666;
--color-primary:      #111111;
--color-primary-hover:#333333;
--color-accent:       #c5ed36;
--color-accent-hover: #b3d82f;
--color-border:       #e5e5e5;

/* ── TYPOGRAPHY ──────────────────────── */
--font-heading: 'Sharp Grotesk', sans-serif;
--font-body:    'Source Sans 3', sans-serif;
/* Nasalization solo en logo-text */

/* ── SPACING / RADIUS ────────────────── */
--radius-sm: 12px;
--radius-md: 14px;
--radius-lg: 24px;
/* pill = 100px */

/* ── ANIMATION ───────────────────────── */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

---

*Estas guidelines se derivan de la implementación real de la landing page de Sisteco (v1, febrero 2026). Actualizar este documento ante cualquier cambio mayor en el sistema de diseño.*
