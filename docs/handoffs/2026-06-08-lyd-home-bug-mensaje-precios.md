# Handoff — LYD: fix de cards, mensaje recuperado y precios a medida

| | |
|---|---|
| **Fecha** | 2026-06-08 |
| **Origen** | Sesión reposicionamiento (rama `reposicionamiento-agente-ventas`) |
| **Destino** | Próxima sesión / Felipe / Cristián |
| **Estado** | Cambios aplicados y verificados en local. Sin deploy (Felipe deploya). |
| **Autor** | Claude (Opus 4.8), Felipe dirigió |

---

## 0. Misión TL;DR

Sisteco = **paraguas**. **LYD** = la solución de leadgen (la `index.html` actual es la página de LYD). Esta sesión cerró el pedido de seis partes de Felipe: arreglar el bug de carga de las cards, recuperar mensaje perdido (fugas del pipeline + LinkedIn con seguridad por diseño), pasar el home a "planes a medida", limpiar anglicismos, generalizar páginas a nivel Sisteco, y dejar a Cristián con acceso para trabajar la próxima solución. Quedan dos cosas **abiertas a decisión de Felipe**: el mockup del hub de soluciones (le presenté opciones) y el encuadre de "estudio de Diseño Transformacional" de Cristián (en pausa).

---

## 1. Qué cambió (aplicado y verificado)

### Bug de carga de las feature-cards — ARREGLADO
- **Síntoma:** en "Todo lo que hace un equipo de ventas, menos cerrar" (#soluciones), si la sección entraba parcialmente y el scroll se detenía, la tercera card quedaba pegada en `opacity:0` (invisible).
- **Causa raíz:** el reveal creaba un `gsap.fromTo()` nuevo dentro de `onEnter` con `once:true` e `immediateRender`. ScrollTrigger no era dueño del tween, así que el último elemento del stagger podía quedar varado en el estado "from". No había red de seguridad en CSS (las cards no tienen `opacity` inicial).
- **Fix:** [js/main.js](js/main.js) `initFeaturesAnimations()` — se reemplazó el patrón `onEnter + fromTo` por el idiomático `gsap.from('.feature-card', { ..., scrollTrigger: {...}, clearProps:'opacity,transform' })`. ScrollTrigger gestiona el ciclo de vida y `clearProps` borra el estilo inline al terminar, así ninguna card queda invisible.
- **Verificado:** las 3 cards terminan en `opacity:1` con inline limpio, sin errores de consola.

### Mensaje recuperado (lo que Felipe pidió de vuelta)
La investigación confirmó que estos conceptos **nunca vivieron en la landing** — están en el vault Obsidian (SOPs de Social Selling LinkedIn). Se reincorporaron al home, en versión pública suave:
- **LinkedIn con seguridad por diseño** → feature card #3 de [index.html](index.html): "Contacto coordinado, sin quemar tu LinkedIn" + stat "Sin quemar tu cuenta / Seguridad por diseño". Lenguaje suave a propósito: **no** se exponen caps numéricos ni nombres de stack (Unipile/n8n/Convex quedan internos).
- **Fugas del pipeline** → párrafo de diagnóstico de #garantia: "te mostramos dónde se te está fugando el pipeline: los leads que generas y nunca reciben seguimiento, las reuniones que no llegan."

### Precios del home → "planes a medida" (sin precios fijos)
- [index.html](index.html) #precios: se quitó el grid de UF/USD (Junior 20 UF, Senior 50 UF, Manager) y la nota de "15%/10% descuento · 1 UF ≈ CLP 38.500". Ahora es un modelo de 3 pasos coherente con [pages/precios.html](pages/precios.html): **Conversamos tu caso → Diseñamos tu plan → El agente sale a operar**, con CTA "Arma tu plan a medida". Verificado en pantalla.

### Limpieza y coherencia
- #garantia: se quitó "15% de descuento / primer trimestre / precio lleno" (incoherente con planes a medida) y se de-anglicizó "batch" → "primera tanda" (2 veces).
- CTA final: "Al primer batch" → "A la primera tanda"; "Compliance total" → "Cumplimiento total".
- Footer del home: tagline alineado al canónico → "LYD, tu agente de ventas autónomo. Te llenamos la agenda de reuniones; tú cierras."
- [pages/sobre-nosotros.html](pages/sobre-nosotros.html): title, H1 ("El equipo detrás de Sisteco"), meta y subtítulo de equipo generalizados de "tu agente de ventas" → Sisteco-paraguas.

---

## 2. Abierto — decisión de Felipe

1. **Mockup del hub de soluciones.** Felipe pidió un mockup más atractivo para [pages/soluciones.html](pages/soluciones.html) (hoy: hero + 3 cards, LYD "Disponible" + 2 "En desarrollo"). Le presenté opciones de dirección visual; falta que elija una para construirla.
2. **Encuadre "estudio de Diseño Transformacional" (Cristián).** En pausa por decisión de Felipe ("hablémoslo primero"). Acuerdos parciales: se eliminó "sin depender de proveedores externos" (contradecía el agente-como-servicio) y se reescribió la garantía para que ya no diga "no prometemos reuniones". El relato de estudio sigue sobre la mesa como narrativa de marca de mayor altura, no aplicado aún.
3. **"Fugas del pipeline" como framework completo.** Hoy quedó como framing en el home. El framework real (la auditoría / checklist "10 señales de que se te fuga el pipeline") es un **lead magnet** y su lugar natural es `/recursos`, no el home. Pendiente de decidir si se arma como recurso descargable. Copy verbatim en el vault: `Obsidian/Sisteco/procesos/Social Selling LinkedIn — SOPs/SOP 02`.
4. **recursos/index.html (P2).** Hoy está 100% acotado a "prospección B2B tech". Si se quiere a nivel Sisteco-paraguas, cambiar "prospección" → "ventas" en title/meta/og/H1. Tiene **riesgo SEO** (toca términos indexables); dejar como está si ya posiciona por "prospección". Decisión de scope, no urgente.

---

## 3. Cómo arrancar la próxima sesión

- Dev local: `npm start` → http://localhost:3000 ("Convex: Conectado").
- Rama: `reposicionamiento-agente-ventas`. **No deployar** salvo que Felipe lo pida (`npx vercel --prod`).
- **No tocar el WIP sin commitear de Felipe:** `.env.example`, `BRAND_GUIDELINES.md`, `api/*`, `convex/emailSequence.ts`, `llms.txt`, `mirrors/precios.md`, y los screenshots/SVG sueltos.
- Reglas vivas: nunca inventar métricas/testimonios; siempre "Ley 21.719"; fuentes self-host (no Google Fonts CDN); "LYD" es nombre propio (lead estilizado, Y = embudo), no sigla.
- Para sumar a Cristián al repo y que trabaje la próxima solución: ver [ONBOARDING-CRISTIAN-repo-landing.md](docs/handoffs/ONBOARDING-CRISTIAN-repo-landing.md).

---

## 4. Estado del reposicionamiento (recordatorio)

- Metáfora producto: **"Tu agente de ventas autónomo"** (singular). Unidad de resultado = **reuniones** (no leads/cierres).
- Tagline: "Llenamos tu agenda. Tú cierras." · CTA: "Agenda una reunión" → https://cal.com/sisteco/ventas (+ wa.me/56940065566 + contacto@sisteco.cl).
- ICP: empresas tech B2B en Chile, 10+ empleados. Sin precios fijos.
- Moat: datos del SII · prospección por señales · Ley 21.719.
