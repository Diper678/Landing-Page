# Skill: UI/UX Pro Max — Guia de Uso

> Skill de Claude Code para diseno e implementacion de UI/UX de alta calidad.
> Se activa con: `/ui-ux-pro-max` o mencionando la skill en el contexto

---

## Que hace esta skill

UI/UX Pro Max es inteligencia de diseno integrada en Claude Code con:
- **67 estilos** de diseno (glassmorphism, claymorphism, minimalism, brutalism, etc.)
- **96 paletas** de colores curadas
- **57 pares de fuentes** tipograficos
- **25 tipos de charts** y visualizaciones
- **13 stacks** de implementacion (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui)

---

## Cuando usar esta skill

### Activar cuando:
- Construir un sitio web o landing page desde cero
- Crear un dashboard, panel admin, o e-commerce
- Implementar componentes: buttons, modals, navbars, sidebars, cards, tables, forms, charts
- Aplicar estilos visuales: glassmorphism, dark mode, bento grid, responsive
- Elegir paletas de colores o pares de tipografia
- Revisar y mejorar codigo UI/UX existente
- Implementar animaciones y transiciones
- Hacer diseno responsive y accesible

### No activar cuando:
- Trabajas solo con logica de backend
- Debuggeas APIs o base de datos
- Haces git operations

---

## Estilos disponibles (muestra)

| Categoria | Estilos |
|---|---|
| **Moderno** | Glassmorphism, Claymorphism, Neumorphism, Bento Grid |
| **Minimalista** | Minimalism, Flat Design, Swiss/International |
| **Bold** | Brutalism, Neo-Brutalism, Typography-First |
| **Oscuro** | Dark Mode, Dark Glassmorphism, Cyberpunk |
| **Clasico** | Skeuomorphism, Material Design, Apple HIG |

---

## Uso en el proyecto Sisteco

Esta skill se uso para implementar:

### Bento Grid ("Como Funciona" section)
```
/gsd:execute-phase → incluyo en el contexto:
"Usa ui-ux-pro-max para el diseno del bento grid"

Resultado: Grid asimetrico Apple/Linear style
- Card hero 2x2: Prospeccion IA con mini flow diagram
- 4 cards 1x1: Secuencias, Omnicanal, Analisis, Seguridad
- Dark background #111 con card borders glass/dark-glass
- GSAP stagger animation en scroll entry
```

### Floating Navbar (AmpleMarket style)
```
Implementado con:
- CSS transition cubic-bezier(0.4, 0, 0.2, 1) 0.4s
- .navbar.scrolled: max-width 900px, border-radius 50px, box-shadow
- JS: window.addEventListener('scroll', ...) toggle a 80px
```

### Animaciones de fondo (Firecrawl style)
```
- Gradient orbs: CSS @keyframes blobs en hero
- GSAP ScrollTrigger: fadeInUp para todas las secciones
- Card hover glow: border accent al hover
- Cursor glow: radial gradient siguiendo mouse (desktop)
```

---

## Paleta de Sisteco en esta skill

Cuando uses esta skill para proyectos de Sisteco, proporciona este contexto:

```
Paleta de marca Sisteco:
- Background: #F8F7F5 (warm white)
- Text primary: #111111
- Text secondary: #666666
- Accent: #c5ed36 (lime)
- Accent hover: #b3d82f
- Border: #e5e5e5

Fuentes:
- Headings: Sharp Grotesk
- Body: Source Sans 3
- Logo only: Nasalization

Iconos: Lucide 0.468.0

Estilo objetivo: Minimalist + Dark accents + Lime highlights
Inspiraciones: Apollo.io, AmpleMarket, Firecrawl, Linear
```

---

## Comandos tipicos

```
# Crear un componente nuevo
"Usa ui-ux-pro-max para crear una card de feature con glassmorphism,
dark background, lime accent, usando la paleta de Sisteco"

# Revisar diseno existente
"Revisa la seccion de comparativa en index.html con ui-ux-pro-max
y sugiere mejoras de espaciado y jerarquia visual"

# Implementar animacion
"Con ui-ux-pro-max implementa una animacion de fade-in-up con GSAP
para las cards del bento grid al entrar en viewport"
```

---

*Esta skill esta integrada en Claude Code y se actualiza automaticamente con el sistema GSD.*
