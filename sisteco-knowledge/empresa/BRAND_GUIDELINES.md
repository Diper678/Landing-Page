# Sisteco — Brand Guidelines (Design System)

> Version 1.0 · Febrero 2026
> Sistema de diseno completo para todos los productos digitales de Sisteco.

---

## Paleta de Colores

### Tokens principales

```css
--color-bg:           #F8F7F5;   /* Warm white — fondo base */
--color-text-main:    #111111;   /* Near black — texto, botones, superficies dark */
--color-text-sub:     #666666;   /* Mid gray — texto secundario, descripciones */
--color-primary:      #111111;   /* Identico a text-main */
--color-primary-hover:#333333;   /* Dark gray — hover de superficies oscuras */
--color-accent:       #c5ed36;   /* Lime — acento principal */
--color-accent-hover: #b3d82f;   /* Lime oscuro — hover del acento */
--color-border:       #e5e5e5;   /* Border gray — bordes de cards */
```

### Superficies

| Superficie | Color | Uso |
|---|---|---|
| Light | `#F8F7F5` / `#ffffff` | Cards, secciones principales |
| Dark | `#111111` | CTA section, footer, hero badges, featured card |
| Glass | `rgba(248,247,245,0.85)` + `backdrop-filter:blur(20px)` | Navbar sticky |
| Accent-tinted | `rgba(197,237,54,0.07-0.15)` | Glow effects, selection highlight |

### Gradientes

```css
/* Texto heading sobre fondo claro */
.gradient-text {
  background: linear-gradient(135deg, #111111 0%, #b3d82f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Texto heading sobre fondo oscuro */
.gradient-text-light {
  background: linear-gradient(135deg, #ffffff 0%, #c5ed36 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Glow ambiental */
radial-gradient(ellipse at center, rgba(197, 237, 54, 0.07) 0%, transparent 70%)
```

### Reglas de color

- Lime `#c5ed36` NUNCA como fondo de texto en superficies grandes
- Sobre superficie oscura `#111`, el lime va directo como texto acento
- Gradientes de texto: solo en 1-3 palabras clave de un heading
- `::selection`: `rgba(197,237,54,0.3)`

---

## Tipografia

### Familias

| Familia | Uso | Pesos |
|---|---|---|
| **Sharp Grotesk** | Headings (h1-h6), botones, nav, labels | 400, 500, 700 |
| **Source Sans 3** | Body text, parrafos, formularios | 400, 600 |
| **Nasalization** | Logo wordmark "Sisteco" UNICAMENTE | 400 |

```css
--font-heading: 'Sharp Grotesk', sans-serif;
--font-body:    'Source Sans 3', sans-serif;
/* Nasalization solo en .logo-text */
```

### Escala tipografica

| Nivel | Tamano | Peso | Uso |
|---|---|---|---|
| Display H1 | `clamp(36px, 4vw, 52px)` | 500 | Hero headline |
| H2 Section | `clamp(28px, 3vw, 40px)` | 500 | Titulos de seccion |
| H3 Card | `20-22px` | 500 | Titulos de feature cards |
| H4 Small | `16px` | 500 | Sub-items |
| Body Large | `18px` | 400 | Descripciones hero |
| Body | `16px` | 400 | Texto general |
| Body Small | `14px` | 400 | Nav links, labels |
| Caption | `13px` | 400 | Timestamps, metadata |
| Section Label | `12px` | 700 | Eyebrow tags (uppercase) |
| Metric Value | `28-48px` | 700 | KPI numbers (10x, 500+) |

---

## Espaciado y Layout

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
```

- Padding vertical secciones: `80px 0` a `120px 0`
- Gap entre cards: `24-32px`
- Hero grid: `1fr 1fr`, gap `72px`, colapsa a 1 col bajo `1024px`

### Border Radius

```css
--radius-sm: 12px;   /* inputs, small cards */
--radius-md: 14px;   /* feature cards */
--radius-lg: 24px;   /* hero dashboard, panels grandes */
/* pill */   100px;  /* botones, badges, avatares */
```

---

## Componentes

### Botones

```
btn-primary  → bg:#c5ed36  text:#111  pill  padding:10px 22px  font:SharpGrotesk 500 14px
              hover → bg:#b3d82f  translateY(-2px)  box-shadow:0 8px 25px rgba(197,237,54,0.3)

btn-ghost    → bg:transparent  text:#666  pill
              hover → bg:rgba(0,0,0,0.05)  underline animada (lime) desde centro

btn-large    → padding:16px 36px  font-size:18px  (CTA section)
btn-shine    → efecto shimmer blanco en hover (CTAs prominentes)
```

Regla: maximo **1 btn-primary visible por eje de atencion**. Los secundarios van como ghost.

### Badges y Pills

```
.section-label  → bg:none  text:#b3d82f  12px  font-weight:700  tracking:0.1em  uppercase
.new-badge      → bg:#111  text:#c5ed36  pill  13px  tracking:0.05em
.tool-pill      → bg:#f5f5f5  border:#e5e5e5  radius:12px  padding:12px 14px
.db-badge-live  → con dot animado livePulse
```

### Cards

**Feature Card (light)**
```
Background: #fff · Border: 1px solid #e5e5e5 · Radius: 14px
Hover: lift translateY(-4px) + border #c5ed36
```

**Featured/Dark Card**
```
Background: #111 · Texto blanco + acento lime
Badge "Caso destacado" con borde lime
Metrica grande en lime bold
```

**Hero Dashboard (glassmorphism)**
```
Background: rgba(255,255,255,0.9) · Radius: 16px · Border: 1px solid rgba(229,229,229,0.8)
Header dots decorativos rojo/amarillo/verde
```

### Section Label Pattern

```html
<section class="[nombre]-section">
  <div class="container">
    <span class="section-label">CATEGORIA EN MAYUSCULAS</span>
    <h2 class="section-title center">
      Titulo con <span class="gradient-text">palabra clave</span>
    </h2>
    <p class="section-desc">Descripcion de apoyo, max. 2 lineas.</p>
    <!-- Contenido: grid de cards, lista, etc. -->
  </div>
</section>
```

---

## Iconografia

**Sistema:** Lucide Icons `0.468.0`
```html
<script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
```

| Concepto | Icono Lucide |
|---|---|
| Automatizacion / CTA | `sparkles`, `zap` |
| Seguridad / Ley 21.719 | `shield`, `shield-check` |
| Datos / IA | `database`, `brain`, `sparkles` |
| Tiempo / eficiencia | `clock`, `timer` |
| Crecimiento | `trending-up`, `line-chart` |
| Multicanal | `mail`, `linkedin`, `message-circle` |
| Leads | `users`, `user-check` |

**Logo Sisteco:**
- `assets/logos/Logo 2 no background.png` — fondos claros, navbar
- `assets/logos/Logo Sisteco Negativo-01.png` — fondos oscuros, footer

---

## Animaciones

### Easing principal

```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

### Keyframes definidos

| Keyframe | Uso |
|---|---|
| `bgFloat` | Fondo animado lime, 20-25s, infinite |
| `barGrow` | Barras del dashboard hero crecen desde 0 |
| `slideInLead` | Lead items entran desde la derecha con fadeIn |
| `floatUp` | Badges hero se elevan suavemente, infinite |
| `livePulse` | Dot "en vivo" late 0.8 a 1.2 escala, 1.5s |
| `fadeInUp` | GSAP ScrollTrigger: fade + slide-up al entrar en viewport |

### Principios

1. Cada animacion comunica algo (datos en vivo, crecimiento, precision)
2. Fondo sutil (4-7% opacidad) — interacciones expresivas
3. Respetar `prefers-reduced-motion`
4. GSAP ScrollTrigger: `start: "top 85%"` para `.section-title`, `.feature-card`

---

## Fondo visual ambiental (siempre presente)

```html
<div class="animated-bg"></div>          <!-- glow lime flotante, fixed, z-index:0 -->
<div class="grid-pattern-overlay"></div> <!-- grid 60x60px, 2% opacidad, fixed -->
```

El grid refuerza la sensacion de "sistema tecnico / infraestructura".

---

## Responsive

| Breakpoint | Comportamiento |
|---|---|
| `> 1024px` | 2 columnas hero, hero-visual visible |
| `768px - 1024px` | Hero 1 col centrado, visual oculto |
| `<= 768px` | Nav hamburger, btn-primary en nav oculto |

Touch targets minimos: 44px.

---

## Do's & Don'ts

### Colores
```
DO   Lime solo como acento: botones, badges, highlights, metricas
DO   #111 como fondo en secciones alto impacto
DO   gradient-text en exactamente 1-2 palabras de heading
DON'T Lime como fondo en superficies grandes
DON'T Colores fuera de paleta (azul, rojo, naranja) salvo logos de terceros
```

### Tipografia
```
DO   Sharp Grotesk para todos los headings, botones y labels
DO   Nasalization EXCLUSIVAMENTE para el wordmark "Sisteco"
DON'T Mezclar mas de 2 familias tipograficas en la misma pantalla
DON'T Texto en lime sobre fondo blanco (contraste insuficiente)
```

---

*Derivado de la implementacion real del landing de Sisteco v1, febrero 2026.*
