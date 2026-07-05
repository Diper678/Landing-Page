# Spec: Loop agente semanal (Level 4 — "Auto-iterate")

**Fecha:** 2026-07-04 · **Estado:** diseño aprobado, pendiente de datos (requiere ≥2 semanas de captura PostHog y al menos un experimento corriendo).

## Objetivo

Un agente (Claude Code) corre una vez por semana, lee la analítica y los experimentos de PostHog, y propone el siguiente cambio de copy/layout/experimento para las landings de Sisteco y Microsec. **Propone, nunca publica**: el gate de aprobación humana de Felipe es obligatorio (patrón SAAN, mismo principio del PDF "5 Levels": *"Never merge without my approval"*).

## Ciclo semanal

1. **Leer** (read-only): vía MCP de PostHog — resultados de experimentos activos, funnels (pageview → CTA click → form submit, por sitio usando `demoRequests.source`), páginas con más rebote, heatmaps destacados.
2. **Analizar**: comparar contra la semana anterior; identificar UNA hipótesis de mejora priorizada (no una lista).
3. **Proponer**: mensaje a Discord (mismo `DISCORD_WEBHOOK_URL`) con: hallazgo, hipótesis, cambio concreto propuesto, métrica que lo validaría.
4. **Esperar aprobación explícita** de Felipe (respuesta en Discord o en la sesión).
5. **Solo si aprueba**: crear branch, aplicar el cambio, abrir PR en `Diper678/Landing-Page` o `Diper678/microsec-landing`. Nunca mergear — Felipe mergea y Vercel redeploya.
6. Registrar el resultado del cambio anterior en la propuesta siguiente (loop de aprendizaje).

## Implementación sugerida

- Tarea programada de Claude Code (`/schedule`, semanal, p.ej. lunes 9:00) con prompt que apunte a esta spec.
- MCP de PostHog configurado con la **personal API key read-only** (`POSTHOG_API_KEY` — la misma del cron `api/cron/behavior-alerts.js`).
- Circuit breaker: si dos propuestas seguidas son rechazadas o el agente no puede leer datos, se detiene y avisa en vez de insistir.

## Reglas de contenido (heredadas de CLAUDE.md)

- Nunca inventar métricas ni testimonios en el copy propuesto.
- Ley 21.719 siempre nombrada así en contexto de privacidad.
- Voz Felipe (directo, sin buzzwords) — pasar el copy propuesto por `brand-voice:content-generation` antes de proponer.

## Level 5 (personalización por cohortes) — futuro, NO implementar aún

Requiere feature flags multivariante por cohorte en PostHog + consentimiento ya operativo (hecho en Fase 1). Se evaluará cuando el loop L4 lleve ≥1 mes funcionando.
