# CLAUDE.md — Instrucciones para Claude Code en proyectos Sisteco

> Copia este archivo a la raiz de cualquier nuevo proyecto de Sisteco como `CLAUDE.md`.
> Claude Code lo lee automaticamente al inicio de cada sesion.

---

## Contexto de la empresa

**Sisteco** es un agente de ventas autónomo (Service-as-a-Software): hace el trabajo de prospección por ti y te agenda reuniones. No es una herramienta que operas tú.
- **Identidad / producto:** "Tu agente de ventas autónomo que te agenda reuniones"
- **Tagline:** "Llenamos tu agenda. Tú cierras."
- **Unidad de valor:** reuniones agendadas (NO "leads" ni "cierres")
- **CTA único:** "Agenda una reunión" → cal.com/sisteco/ventas
- **Mercado:** Chile, empresas tech B2B desde 10+ empleados → LATAM (2027+)
- **Contacto:** contacto@sisteco.cl · +56 9 40065566 · Av. Alonso de Córdova 5870 Of. 413, Las Condes, Santiago de Chile

## Stack tecnologico estandar

```
Frontend:     HTML/CSS/JS (vanilla) + GSAP 3.12.7 + Lucide 0.468.0
Backend:      Vercel Serverless Functions
DB:           Convex (reactiva en la nube) — NO Supabase
Auth:         Clerk (Email + Google OAuth)
Email:        Resend
Pagos:        dLocal Go (API) / Reveniu (quick-start)
Workflows:    n8n self-hosted
AI/Scoring:   Google Gemini (workflows) · Claude Sonnet (desarrollo)
Deploy:       npx vercel --prod (sin git remote)
Dev local:    npm start → http://localhost:3000
```

## Sistema de planificacion: GSD

Usamos el sistema GSD (Get Shit Done) de Claude Code para todos los proyectos.
- **Iniciar proyecto:** `/gsd:new-project`
- **Ver estado:** `/gsd:progress`
- **Planificar fase:** `/gsd:plan-phase`
- **Ejecutar:** `/gsd:execute-phase`
- **Reanudar sesion:** `/gsd:resume-work`

## Identidad visual (nunca cambiar sin razon)

```
Fondo:       #F8F7F5 (warm white)
Texto:       #111111
Acento:      #c5ed36 (lime)
Hover:       #b3d82f
Borde:       #e5e5e5
Font heading: Space Grotesk (self-host assets/fonts/SpaceGrotesk-Variable.woff2)
Font body:    Hanken Grotesk (self-host assets/fonts/HankenGrotesk-Variable.woff2)
Font logo:    Nasalization (SOLO para el wordmark "Sisteco")
Iconos:       Lucide 0.468.0
Fuentes self-hosted (sin Google Fonts CDN) por cumplimiento Ley 21.719
```

## Reglas de contenido (reposición "agente de ventas autónomo")

- La unidad de valor es la **reunión agendada**. NO usar "leads" ni "cierres" como promesa.
- NO usar el posicionamiento viejo: "departamento de ventas agéntico", "empresa agéntica de ventas".
- CTA único: **"Agenda una reunión"** → cal.com/sisteco/ventas (también WhatsApp wa.me/56940065566 y mailto).
- **Sin precios fijos** en el frontend público: planes a medida ("diseñamos el plan según a quién quieres llegar y cuántas reuniones necesitas").
- Voz Felipe (es-CL): directa, sin floritura, sin anglicismos (scoring→calificar, timing→momento, ICP→perfil, self-annealing→se ajusta sola, stack→infraestructura).
- NUNCA inventar testimonios, metricas o estadisticas.
- NUNCA mencionar Claude/Gemini/Kimi ni nombres de proveedores (Apollo, Clay, Instantly, n8n, Convex) en el frontend publico.
- SIEMPRE usar "Ley 21.719" (no solo "GDPR") en contexto Chile.
- SIEMPRE usar contacto Chile: contacto@sisteco.cl, +56 9 40065566, Av. Alonso de Córdova 5870 Of. 413, Las Condes, Santiago.
- Métricas de investigación (21x, 78%, 391% ROI, 89% omnicanal): son de respaldo interno; en la web ya NO se lideran. Si se usan, citar contexto y nunca como dato propio inventado.

## Documentos de referencia en este proyecto

Ver carpeta `sisteco-knowledge/` para:
- `empresa/IDENTIDAD_MARCA.md` — Identidad, voz, tono, estadisticas
- `empresa/BRAND_GUIDELINES.md` — Sistema de diseno completo
- `empresa/VISION_AGENTES_AUTONOMOS.md` — Vision de largo plazo
- `financiero/ESTRATEGIA_FINANCIERA.md` — Precios, planes, margenes
- `tech-stack/STACK_COMPLETO.md` — Todo el stack tecnologico
- `tech-stack/ENV_SETUP.md` — Setup de variables de entorno
- `integraciones/WORKFLOWS_N8N.md` — Workflows construidos
- `skills/GSD_SKILLS.md` — Comandos GSD disponibles
- `skills/UI_UX_PRO_MAX.md` — Skill de diseno UI/UX
- `mcps/MCP_OVERVIEW.md` — MCPs disponibles (Firecrawl, Perplexity, Playwright)
- `roadmap/ESTADO_ACTUAL.md` — Estado del proyecto (actualizar periodicamente)
- `roadmap/PROXIMOS_PASOS.md` — Que hacer primero

## Preferencias de trabajo

- Respuestas en espanol (es-CL)
- Uso de GSD para todas las tareas significativas
- Deploy via `npx vercel --prod` (no hay git remote en los proyectos de landing)
- Sin Python en este entorno — usar Node.js para scripts
- Herramienta de diseno visual: Gemini 3 en Antigravity IDE (cuando necesite diseno grafico)
- Claude Code: logica, APIs, CSS, HTML, arquitectura de sistemas
