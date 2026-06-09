# Design handoff — Constelación Sisteco (hero de soluciones)

| | |
|---|---|
| **Para** | Claude Design (visual / SVG / motion) |
| **Dónde** | `pages/soluciones.html` — hero, `<div class="sol-constellation">` |
| **Estado** | Hay un **v1 funcional** hand-coded (SVG inline). Esto pide elevarlo. |
| **Autor** | Claude (Opus 4.8), 2026-06-08 |

---

## Qué es

El hero del hub de soluciones abre con una **constelación**: un nodo central **Sisteco** del que salen ramas a sus soluciones. La rama **LYD** está encendida (lima, "Disponible"); las otras dos están tenues ("En desarrollo"). Comunica de un vistazo que Sisteco es un **paraguas** y LYD es la solución viva hoy; las futuras se irán encendiendo acá mismo.

## Qué hace el v1 (lo que ya está)

SVG inline `viewBox="0 0 760 280"`: hub `Sisteco` (círculo #111), nodo `LYD` lima conectado con línea sólida lima, dos nodos en blanco con borde punteado gris conectados con líneas punteadas. Funciona y es responsive, pero es plano y estático.

## Qué quiero de ti (elevarlo)

1. **Profundidad y jerarquía visual.** Que LYD se sienta "encendida" de verdad: glow lima sutil, peso, foco. Las futuras, presentes pero claramente en segundo plano (no solo opacity baja — textura de "en construcción").
2. **Movimiento sutil, no distractor.** Idea: un pulso lento que viaja por la rama de LYD (señal → reunión), y/o las ramas tenues con un shimmer muy leve. Respetar `prefers-reduced-motion` (sin animación si está activo). Nada que compita con el globo del home.
3. **Coherencia de marca.** Lima `#c5ed36` (hover `#b3d82f`), texto `#111`, bordes `#e5e5e5`, fondo warm white `#F8F7F5`. Tipografía heading del sitio. Nada de gradientes ajenos a la paleta.
4. **Responsive real.** En móvil (<760px) debe seguir leyéndose; si hace falta, reflow vertical (hub arriba, soluciones debajo) en vez de encoger todo.
5. **Accesibilidad.** Mantener `role="img"` + `aria-label` descriptivo. El movimiento es decorativo.

## Reglas duras (no romper)

- "LYD" es nombre propio (lead estilizado, Y = embudo). **No** es sigla, no se expande, no se explica qué significan las letras.
- Sin métricas/testimonios inventados en el visual.
- Self-host de fuentes (no Google Fonts CDN), por Ley 21.719.
- Es **decorativo**: si el SVG falla, el hero (H1 + sub + CTA) tiene que seguir vivo. No meter el copy dentro del SVG como única fuente.

## Entregable

Reemplazar el `<svg>` dentro de `.sol-constellation` por tu versión (SVG + CSS/animación, idealmente self-contained o en `css/home-2026.css`). Si propones algo más ambicioso (canvas, lottie), conversarlo con Felipe antes — el default es SVG + CSS, liviano.

## Notas de arquitectura (contexto)

El hub vive en el sistema `rh-` (`css/home-2026.css`). Los estilos del componente (`.sol-feature`, `.sol-card--dev`, etc.) están en un `<style>` scoped dentro de `pages/soluciones.html`. La constelación es lo único que falta elevar; el resto de la página (LYD destacada orientada a resultado + cards "en desarrollo") ya está armado.
