# CLAUDE.md — Instrucciones para Claude Code en proyectos Sisteco

> Copia este archivo a la raiz de cualquier nuevo proyecto de Sisteco como `CLAUDE.md`.
> Claude Code lo lee automaticamente al inicio de cada sesion.

---

## Contexto de la empresa

**Sisteco** es una plataforma B2B SaaS de automatizacion de ventas para empresas medianas chilenas.
- **Mision:** Infraestructura inteligente para ventas B2B
- **Tagline:** "Vende más, preocúpate menos"
- **Mercado:** Chile (50+ empleados) → LATAM (2027+)
- **Contacto:** contacto@sisteco.cl · +56 9 40065566 · Las Condes, Santiago de Chile

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
Font heading: Sharp Grotesk
Font body:    Source Sans 3
Font logo:    Nasalization (SOLO para el wordmark "Sisteco")
Iconos:       Lucide 0.468.0
```

## Reglas de contenido

- NUNCA inventar testimonios, metricas o estadisticas
- NUNCA mencionar Claude/Gemini/Kimi en el frontend publico
- SIEMPRE usar "Ley 21.719" (no solo "GDPR") en contexto Chile
- SIEMPRE usar contacto Chile: contacto@sisteco.cl, +56 9 40065566, Santiago
- Metricas verificadas que SI se pueden usar:
  - 5-7x mas conversiones vs stack DIY
  - 21x mas conversiones respondiendo < 5 minutos
  - 78% de clientes compran del primer vendedor en responder
  - 391% ROI en automatizacion (Forrester/PolyAI)
  - 89% retencion omnicanal vs 33% monocanal

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
