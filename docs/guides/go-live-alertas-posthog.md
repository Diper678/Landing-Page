# Guía go-live: analítica, alertas y deploy de las landings

**Fecha:** 2026-07-05 · Para: Felipe · Contexto: activar en producción el sistema de analítica + alertas construido para Sisteco y Microsec.

Esta guía cubre solo lo que **requiere tu intervención** (crear claves en dashboards, pegar links, desplegar). Todo el código ya está escrito y verificado localmente. La referencia técnica completa de PostHog vive en el skill `content-engine/.claude/skills/posthog.md` — esta guía no la duplica, solo te lleva paso a paso.

> **Sobre "instalar el CLI de PostHog":** no existe un CLI de PostHog que cree proyectos ni personal API keys — el paquete `posthog-cli` solo sube sourcemaps. Crear la personal API key, el project ID y el proyecto de Microsec son acciones del dashboard web (requieren tu login). Por eso esto es una guía y no algo que yo pueda ejecutar solo. Lo que **sí** verifiqué: la project key `phc_ugKr…` que ya está en el sitio es válida y está ingiriendo eventos (test `status:Ok`).

---

## Estado actual (qué ya funciona)

| Pieza | Estado | Necesita de ti |
|---|---|---|
| PostHog frontend + banner consentimiento (Sisteco, 23 páginas) | Código listo, key verificada | Solo desplegar |
| PostHog frontend + banner (Microsec) | Código listo | Proyecto PostHog propio (opcional) + desplegar |
| Alertas Discord en leads/contacto/pagos | Código listo | `DISCORD_WEBHOOK_URL` en Vercel |
| Cron de alertas de comportamiento (visitas repetidas a precios, sesiones largas) | Código listo | `POSTHOG_API_KEY` + `POSTHOG_PROJECT_ID` en Vercel |
| Formulario de contacto Microsec → backend Sisteco | Código listo | Desplegar ambos |
| Agendador Google Calendar | Código listo (placeholder vacío) | Pegar el link real |

---

## Paso 1 — PostHog: personal API key + project ID (para el cron de alertas)

El frontend ya usa la **project key** (`phc_…`, pública, va en el HTML). El cron `api/cron/behavior-alerts.js` necesita además una **personal API key** (`phx_…`, secreta, solo servidor) para *leer* datos.

1. Entra a **https://eu.posthog.com** (host EU — obligatorio por Ley 21.719, no uses us.posthog.com).
2. **Personal API key:** avatar arriba a la derecha → *Settings* → *Personal API keys* → *Create personal API key*.
   - Nombre: `sisteco-behavior-alerts`
   - Scope: **Read-only** sobre *Query* y *Insights* (mínimo privilegio).
   - Copia el valor `phx_…` (solo se muestra una vez).
3. **Project ID:** *Settings* → *Project* → busca "Project ID" (un número, ej. `12345`).

Guarda ambos para el Paso 4.

---

## Paso 2 — PostHog: proyecto propio de Microsec (opcional pero recomendado)

Hoy Microsec usaría la misma key de Sisteco, lo que mezcla los funnels de dos negocios distintos. Para separarlos:

1. En https://eu.posthog.com, arriba a la izquierda (selector de proyecto) → *New project* → nombre `Microsec`.
2. Copia su **project key** (`phc_…`).
3. Pégala en `Z:\Microsec Landing\index.html`, `privacidad.html` y `cookies.html`, en el atributo `data-ph-key` del `<script src="assets/js/consent.js" …>` (hoy hereda la de Sisteco, marcado con un TODO).

Si prefieres postergarlo, Microsec seguirá reportando al proyecto de Sisteco — funciona, solo mezcla datos.

---

## Paso 3 — Discord: confirmar el webhook

Las alertas reutilizan el webhook que ya usa `api/flow-webhook.js` (`DISCORD_WEBHOOK_URL`). Si quieres un canal dedicado para no mezclar con pagos:

1. En tu servidor Discord: *Editar canal* (ej. crea `#landing-alerts`) → *Integraciones* → *Webhooks* → *Nuevo webhook* → *Copiar URL*.
2. Ese URL es el valor de `DISCORD_WEBHOOK_URL` (Paso 4). Si reusas el actual, no hace falta nada.

---

## Paso 4 — Cargar variables de entorno en Vercel (proyecto Sisteco)

En el dashboard de Vercel → proyecto `sisteco-landing` → *Settings* → *Environment Variables*, agrega (entorno **Production**):

```
DISCORD_WEBHOOK_URL   = https://discord.com/api/webhooks/…    (del Paso 3)
POSTHOG_API_KEY       = phx_…                                  (del Paso 1)
POSTHOG_PROJECT_ID    = 12345                                  (del Paso 1)
GOOGLE_CALENDAR_BOOKING_URL = https://calendar.app.google/…   (del Paso 5)
```

`.env.example` ya documenta estas cuatro. `CRON_SECRET` ya existe (lo usa el cron de drip).

---

## Paso 5 — Google Calendar: link de agendamiento

1. Google Calendar → *Crear* → *Cita* (appointment schedule) → configura tu disponibilidad → *Compartir* → copia el link público (`https://calendar.app.google/…`).
2. Pégalo en **dos lugares**:
   - `Z:\Landing Page\js\consent.js` → variable `BOOKING_URL` (reescribe todos los CTAs de Cal.com del sitio de una vez).
   - `Z:\Microsec Landing\index.html` → variable `BOOKING_URL` en el script del final.

Mientras esté vacío, Sisteco sigue usando los links de Cal.com actuales y Microsec cae al `mailto:` — nada se rompe.

---

## Paso 6 — Desplegar

### Sisteco (`Z:\Landing Page`)
El deploy corre `npx convex deploy` en el build (migra el schema nuevo: campo `source` en demoRequests + tabla `alertsSent`). Con Vercel CLI:
```bash
cd "Z:\Landing Page"
npx vercel --prod
```
O si el proyecto está conectado a GitHub, hacer push a `master` dispara el deploy.

> **Ojo:** el working tree de Sisteco tiene decenas de archivos modificados de sesiones anteriores (repositioning). Revisa `git status` y commitea de forma deliberada antes de desplegar — no subas todo a ciegas.

### Microsec (`Z:\Microsec Landing`)
Ya arreglé dos cosas que rompían el sitio publicado (ver sección siguiente). Para desplegar:
```bash
cd "Z:\Microsec Landing"
npx vercel --prod
```
o push a su repo si está conectado a GitHub.

---

## Paso 7 — Verificar en producción

- Abrir el sitio → aparece el banner → *Aceptar* → en PostHog *Activity* / *Live events* llegan pageviews. *Solo esenciales* → cero eventos.
- Enviar el formulario de contacto de Microsec → llega a Convex (`demoRequests` con `source: "microsec"`) y cae una alerta en Discord.
- Invocar el cron manualmente (o esperar la hora): debe alertar visitas repetidas a `/precios` sin duplicar (dedupe en tabla `alertsSent`).

---

## Anexo — Bug de Microsec en producción (encontrado y corregido el 2026-07-05)

El sitio publicado `microsec-landing.vercel.app` mostraba **página en blanco** ("no se ve nada") por dos causas independientes, ambas ya corregidas en el código local:

1. **Deploy:** Vercel corría `server.cjs` (Express, pensado solo para dev local) como función serverless, y esa función no empaqueta la carpeta `assets/` → **CSS, JS e imágenes daban 404**. Fix: nuevo `.vercelignore` que excluye `server.cjs`/`package.json` para forzar deploy estático. Si tras el redeploy sigue fallando, revisar en el dashboard de Vercel que *Framework Preset = Other* y *Build & Output Settings* estén vacíos (sin build command).
2. **Código:** el `main.js` observaba elementos `[data-reveal]` pero el HTML usa `class="reveal"` → el IntersectionObserver nunca los hacía visibles (quedaban en `opacity:0`). Fix aplicado en `assets/js/main.js`.

Ambos fixes llegan a producción con el deploy del Paso 6.
