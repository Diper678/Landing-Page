# Handoff: Diseño de backend inteligente con alertas para las landing pages

**Fecha:** 2026-07-04
**De:** sesión anterior (implementación página Método ICM + landing Microsec)
**Para:** sesión nueva — diseñar (no necesariamente implementar todavía) un backend inteligente con alertas para las landing pages de Sisteco y Microsec.

## Objetivo de esta tarea

Felipe pidió preparar el terreno para que otra sesión, con contexto fresco, diseñe un **backend inteligente con alertas** para las landing pages. La fuente de inspiración explícita que dio es el PDF `Five Levels of a Self Driving Landing Page_260702_201038.pdf` (carpeta Descargas del usuario) — un framework de 5 niveles para llevar una landing page de estática a "auto-personalizante". Su contenido completo está resumido más abajo para que no haga falta volver a leer el PDF.

**Importante:** esto es una tarea de **diseño**, no de implementación directa. La sesión nueva debería producir una propuesta/arquitectura (probablemente un documento en `docs/plans/` o `docs/specs/` de este mismo repo) antes de tocar código, y validarla con Felipe antes de construir nada — sobre todo la parte de alertas automáticas y cualquier paso de "auto-iteración" que edite código o contenido sin supervisión.

## Qué existe HOY (verificado en este repo, no asumir más de esto)

Repo: `Diper678/Landing-Page` (`Z:\Landing Page`), desplegado en Vercel. Stack: HTML/CSS/JS vanilla + Convex (backend/DB) + Vercel Functions (`api/*.js`) + n8n para orquestación externa.

- **Tracking actual — muy básico, no es analítica de comportamiento:**
  - `api/track.js` recibe clicks de CTA (`buttonId`, `buttonText`, `pageUrl`) y los guarda vía `convex/ctaClicks.ts` → tabla `ctaClicks` en Convex.
  - `convex/leads.ts`, `convex/demoRequests.ts` manejan leads y solicitudes de demo.
  - **No hay PostHog ni ninguna herramienta de heatmaps/scrollmaps/session replay instalada.** Ningún nivel del framework de 5 niveles está implementado más allá de un tracking manual de clicks equivalente a un fragmento de Level 1-2.
- **n8n ya está configurado como capa de orquestación** (no es que haya que introducirlo de cero):
  - `.env.example` ya tiene `N8N_WEBHOOK_URL` y `N8N_AUTH_KEY` — Sisteco ya usa n8n para flujos (ver `Z:\Sisteco Systems\AgenticWorkflows` y el patrón SAAN — Sisteco Autonomous Agent Network — que usa n8n + Convex + **alertas por Telegram** + circuit breaker + métricas de aprendizaje; ver skill `agent-creator` si está disponible).
  - **No hay ninguna alerta de Telegram conectada a eventos de la landing page todavía** — no se encontró ninguna referencia a Telegram en `api/` ni `convex/`.
- Páginas nuevas recién agregadas (contexto, no relevante al backend pero por si acaso): `pages/metodo-icm.html` (Método ICM) y el proyecto separado `Diper678/microsec-landing` (`Z:\Microsec Landing`, deploy en `https://microsec-landing.vercel.app`) — un sitio estático sin ningún backend propio.

## Fuente de inspiración: resumen completo del PDF "5 Levels of a Self-Driving Landing Page"

Autor: Angus Sewell (angussewell.com). Framework de 5 niveles, cada uno es una "OP card" con objetivo, prompt copy-paste, y pasos de ejecución.

| Nivel | Nombre | Qué hace |
|---|---|---|
| L1 | **Static** | Landing page desplegada en Vercel, sin ninguna instrumentación. Ya superado — Sisteco tiene esto y más. |
| L2 | **Watch** | Instalar PostHog (`posthog-js`) para autocapture, heatmaps, scrollmaps y session replay con un solo snippet de init. |
| L3 | **Test** | A/B testing: no-code (visual editor de PostHog, edita texto/CSS de una variante sin redeploy) o vía feature flags en código (`posthog.getFeatureFlag(...)`). PostHog decide el ganador estadísticamente (95%+ de confianza, ≥50 exposiciones/variante). |
| L4 | **Auto-iterate** | Un agente (Claude Code, Codex) corre semanalmente vía el MCP de PostHog (modo read-only primero), lee resultados del experimento, propone el próximo cambio, **espera aprobación humana explícita**, y solo entonces edita el repo y abre un PR — nunca mergea sin aprobación. Vercel redeploya automáticamente al mergear.
| L5 | **Personalize** | PostHog reconoce visitantes recurrentes por `distinct_id` (no por IP), los agrupa en cohortes dinámicas (ej. "vieron pricing en los últimos 30 días"), y sirve una variante distinta vía un feature flag multivariante con payload JSON por cohorte. Un agente puede leer las cohortes top vía MCP y redactar copy nuevo para cada una. Requiere consentimiento (GDPR/Ley 21.719) porque cookies + GeoIP son datos personales.

**Stack propuesto en el PDF:** PostHog (analítica/experimentos/flags/MCP), Vercel (hosting), Claude Code o Codex (agente que construye y luego opera el loop semanal), GitHub (repo que el agente edita).

**Principio clave que se repite en el PDF y que Felipe probablemente quiere preservar:** el agente **propone, nunca mergea sin aprobación humana** ("Never merge without my approval"). Esto es coherente con el patrón SAAN de Sisteco (circuit breaker + gate humano).

## Lo que hay que diseñar (no construir todavía)

Traducir este framework — pensado originalmente para *optimizar conversión de una landing page genérica vía PostHog* — a un **"backend inteligente con alertas"** que tenga sentido para el stack real de Sisteco (Convex + n8n + Telegram, no necesariamente PostHog) y para DOS landing pages con objetivos de negocio distintos (Sisteco: agendar diagnósticos/demos; Microsec: agendar reuniones).

Preguntas abiertas que la sesión de diseño debe resolver con Felipe antes de construir:

1. **¿PostHog o instrumentación propia?** El PDF asume PostHog como "el cerebro". Sisteco ya tiene Convex + tracking manual de CTAs. Hay que decidir si conviene sumar PostHog (heatmaps, replays, flags, MCP — gratis para empezar) o extender lo que ya existe en Convex. PostHog trae el MCP ya construido para que un agente lea resultados, lo cual ahorra trabajo de diseño de "auto-iteración" (Level 4).
2. **¿Qué cuenta como una "alerta"?** El PDF no tiene alertas explícitas — hay que definir qué señales de comportamiento en la landing (ej. visitante viendo pricing repetidamente, sesión larga en una página, un lead completando el formulario de agenda, un experimento A/B alcanzando significancia estadística) deberían disparar una notificación a Felipe, y por qué canal (Telegram vía n8n es lo natural dado lo que ya existe).
3. **¿Qué nivel de autonomía tiene el agente?** Replicar el gate de aprobación humana del Level 4/5 del PDF (el agente propone cambios de copy/layout basados en datos, pero nunca los publica sin que Felipe apruebe) parece el patrón correcto dado cómo está construido el resto de SAAN.
4. **¿Aplica a ambas landing pages o solo a una?** Microsec es un repo/proyecto separado sin Convex ni backend propio — si se quiere el mismo sistema de alertas ahí, hay que decidir si comparte infraestructura con Sisteco o es independiente.
5. **Cumplimiento:** si se implementa Level 5 (personalización por cohortes) hay que pedir consentimiento de cookies — Sisteco ya tiene una página `gdpr.html`/`privacidad.html` y CLAUDE.md exige mencionar Ley 21.719 en contexto de privacidad; cualquier tracking nuevo debe revisarse contra eso.

## Dónde mirar primero (código real, no assumir)

- `Z:\Landing Page\api\track.js`, `convex/ctaClicks.ts`, `convex/leads.ts`, `convex/demoRequests.ts` — tracking actual.
- `Z:\Landing Page\.env.example` — variables ya definidas (`N8N_WEBHOOK_URL`, `N8N_AUTH_KEY`, `CRON_SECRET`, etc.) y cuáles hacen falta agregar.
- `Z:\Landing Page\api\cron\` — ya hay cron jobs corriendo en Vercel, revisar antes de asumir que hay que crear infraestructura de scheduling desde cero.
- Skill `agent-creator` (si está disponible en la sesión) — describe la arquitectura estándar SAAN (n8n + Convex + Telegram + circuit breaker + métricas) que Sisteco usa para otros agentes; el backend de alertas de la landing debería seguir ese mismo patrón por consistencia, no inventar uno nuevo.
- El PDF original está en `C:\Users\Dell 5520\Downloads\Five Levels of a Self Driving Landing Page_260702_201038.pdf` por si se necesita releer algún detalle no capturado en el resumen de arriba.

## Qué NO se ha hecho (para que la sesión nueva no asuma nada de más)

- No se instaló PostHog ni ninguna librería de analítica nueva.
- No se creó ningún webhook de Telegram ni se conectó ninguna alerta.
- No se escribió ningún plan/spec formal todavía — este documento es solo el handoff de contexto, no el diseño en sí.
- No se tocó nada del proyecto Microsec en relación a este tema.
