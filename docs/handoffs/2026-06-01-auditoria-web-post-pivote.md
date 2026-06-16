# Handoff — Auditoría integral de sisteco.cl (post-pivote)

| | |
|---|---|
| **Fecha** | 2026-06-01 |
| **Origen** | Sesión en *The Agentic Company* (revisión presentación social selling Ingetic) |
| **Destino** | Sesión nueva sobre el proyecto **Landing Page** (`C:\Users\Dell 5520\Documents\AgenticWorkflows\Landing Page\`) |
| **Estado** | Listo para ejecutar · varias decisiones requieren a Felipe (§4) |
| **Autor** | Claude (Felipe dirigió) |

---

## 0. Misión (TL;DR)

Auditar **toda** la web pública de Sisteco (sisteco.cl) y alinearla con la estrategia post-pivote: **precios nuevos**, **modos de servicio nuevos** (Consultoría / Agencia), **diagramas de proceso**, y traspasar el **"motor"** de la presentación de implementación (publicar → conectar → conversar → agendar) a una página que explique de forma simple **qué hace Sisteco por el cliente**.

La web NO está toda mal: la **home** y **precios** ya se actualizaron al pricing nuevo + Meta Ads. El problema es **inconsistencia** — hay capas viejas conviviendo con las nuevas (sobre todo `llms.txt`, `style.css`, `sobre-nosotros`, y el sistema de social selling que no aparece). Esta auditoría cierra ese gap.

**Regla de oro de este trabajo:** antes de tocar cualquier copy, leer las **fuentes canónicas** (§3). No reinventar pricing ni inventar métricas.

---

## 1. Cómo arrancar

- **Proyecto:** `C:\Users\Dell 5520\Documents\AgenticWorkflows\Landing Page\`
- **Stack:** HTML/CSS/JS vanilla · GSAP 3.12.7 · Lucide 0.468.0 · sin frameworks. Servido con Express (`server.cjs`) y deploy en **Vercel** (`vercel.json`, `.vercel/`).
- **Correr local:** `npm start` → http://localhost:3000
- **Deploy:** `npx vercel --prod`
- **Backend:** hay `convex/` y `api/` (funciones serverless Vercel — el form de `/suscribete` y pagos). NO tocar sin razón; esta auditoría es de **contenido/copy**, no de backend.
- **Su propio `CLAUDE.md`** (en la raíz del proyecto) define identidad visual, agentes SEO auto-invocados y slash commands (`/seo-audit`, `/brand-check`, `/deploy-qa`). Léelo.
- **Branch actual del repo madre:** `feat/suscribete-hero-image` (trabajo de suscripción en curso — ojo al hacer ramas).

### Inventario de páginas (`pages/` + `index.html`)
```
index.html                  home (113 KB — posicionamiento "outbound + Meta Ads, un equipo")
pages/precios.html          planes Base/Crecimiento/Hablemos + Meta Ads
pages/soluciones.html       qué hace Sisteco (revisar: ¿refleja social selling?)
pages/como-funciona.html    proceso (← candidata a recibir el "motor")
pages/vision.html           visión
pages/sobre-nosotros.html   equipo (STALE — ver §4 D4)
pages/contacto.html         contacto
pages/agendar-demo.html · pages/agenda.html   agendamiento Cal.com
pages/suscribete.html · pages/gracias.html    newsletter (reciente, 29-may)
pages/recursos/index.html + posts/            blog/recursos
pages/soluciones/*.html      3 landings BoF (prospección, lead-scoring SII, compliance)
pages/docs/como-funciona-tecnicamente.html
pages/privacidad · terminos · cookies · gdpr · contrato   legal
pages/pago-fallido.html · 404.html
llms.txt                    descripción del sitio para LLMs (STALE — alta prioridad)
```

---

## 2. Estado actual — qué está al día y qué NO

Evidencia recogida 2026-06-01 (rutas relativas al proyecto Landing Page).

| Área | Estado | Evidencia / nota |
|------|--------|------------------|
| Pricing en home (`index.html`) | ✅ Al día | Base 20 UF, Crecimiento CLP 1.200.000, Meta Ads cap USD 5.000, "antes Junior/Senior/Manager" en comentarios. Líneas ~180, ~1509-1533. |
| Pricing en `pages/precios.html` | ✅ Al día | Title/meta/planes correctos. Modelo Meta Ads bien explicado (cliente paga ad spend directo). |
| Fuentes en home | ✅ Al día | Precarga `assets/fonts/HankenGrotesk-Variable.woff2`; usa Space Grotesk. |
| "ejecutivo de prospección" (no "SDR") | ✅ Cumple | `precios.html:380`. |
| **`llms.txt`** | ❌ **STALE (P1)** | Planes **Junior/Senior/Manager**, **50 UF**, **Plan Gratis**, **Plan Fundadores 40%**, posicionamiento viejo "infraestructura agéntica", equipo viejo (Jhonatan, sin Fernanda), métricas sin fuente (97%, 89%, 391%). Es lo que citan los LLMs → reescribir completo. |
| **`style.css`** (90 KB) | ❌ **Font debt (P2)** | **10 referencias a SharpGrotesk** (deprecada 2026-04-23). También `css/pages.css` (1) y `pages/docs/como-funciona-tecnicamente.html` (1). La migración a Space Grotesk + Hanken quedó a medias en el CSS. |
| **Sistema social selling LinkedIn** | ❌ **Falta (P1)** | El "motor" (publicar→conectar→conversar→agendar) y los modelos **Consultoría/Agencia** no tienen página/sección propia. Felipe quiere traspasar el diagrama de la presentación. Ver §5. |
| **`pages/sobre-nosotros.html`** | ⚠️ **STALE (P2)** | Lista **Cristián Martínez G.** y **Jhonatan Ramirez G.** (`:186`, `:192`). Falta **Fernanda**. Confirmar equipo actual con Felipe (§4 D4). |
| Métricas en todo el sitio | ⚠️ **Auditar (P1-compliance)** | "391% ROI", "97% precisión", "89% retención", "78% primer vendedor", "5-7x", "21x", "-70%". Regla dura: **nunca inventar métricas**. Verificar fuente de cada una o marcarla "estimación interna" / quitarla. |
| `pages/soluciones/*` (3 BoF) | ⚠️ Revisar | Describen el modelo viejo de 5 capacidades agénticas. Validar que no contradigan el posicionamiento nuevo. |
| Legal (`privacidad`, `gdpr`, `terminos`, `cookies`) | ⚠️ Revisar | Confirmar que reflejan Ley 21.719 + base legal **interés legítimo** del social selling (ver fuente legal §3). |

---

## 3. Fuentes canónicas — LEER ANTES DE TOCAR COPY

> ⚠️ La sesión nueva corre en el proyecto **Landing Page**. Estas fuentes viven en **The Agentic Company** → se citan con **ruta absoluta**.

Raíz: `C:\Users\Dell 5520\Documents\AgenticWorkflows\The Agentic Company\`

| Tema | Ruta (absoluta desde la raíz de arriba) |
|------|------|
| **Pricing canónico** (autoritativo) | `_brand\voice\pricing.md` |
| Pricing v4 (detalle gastos) | `docs\research\2026-05-21-plan-gastos-post-pivote.md` |
| Modelo de cobro + entregables | `docs\handoffs\2026-05-24-modelo-cobro-y-entregables.md` |
| Rename planes + Meta Ads integrado | `docs\decisions\2026-05-21-rename-planes-meta-ads-integrado.md` |
| **Sistema Social Selling LinkedIn (diseño maestro)** | `docs\superpowers\specs\2026-05-29-linkedin-social-selling-system-design.md` |
| **Legal — Ley 21.719 + social selling** (base legal, deber de información, ARCO+) | `04_legal\research\2026-05-31-ley-21719-linkedin-social-selling.md` |
| **Presentación de implementación (el "motor")** — fuente del diagrama a traspasar | `.claude\worktrees\wf7-base\01_writing_room\content\deliverables\social-selling-linkedin\presentacion-implementacion-ingetic.html` |
| **Propuesta social selling** (modelos + precios Consultoría/Agencia) | `.claude\worktrees\wf7-base\01_writing_room\content\deliverables\social-selling-linkedin\propuesta-ingetic.html` |
| Reglas de contenido / voz Felipe | `.claude\rules\content.md` |
| Reglas frontend (identidad visual, fuentes) | `.claude\rules\frontend.md` |
| Reglas compliance (Ley 21.719) | `.claude\rules\compliance.md` |

> ⚠️ Las dos últimas HTML (presentación + propuesta) están en un **git worktree** (`.claude\worktrees\wf7-base\`) que puede limpiarse. Su contenido esencial está volcado **inline** en §5 de este handoff, así que no dependes del worktree. Si el worktree existe, úsalo como referencia visual.

---

## 4. Decisiones que requieren a Felipe (algunas bloquean la auditoría)

Estas no las resuelve Claude solo — son llamadas estratégicas/comerciales. Resolverlas **al inicio** de la sesión de trabajo.

**D1 — ¿Cómo se relaciona el social selling (Consultoría/Agencia) con los planes (Base/Crecimiento/Hablemos)?**
La home hoy vende "outbound + Meta Ads" en planes Base/Crecimiento/Hablemos. La propuesta de social selling vende dos **modos de entrega**: Consultoría (montar+capacitar, 3 meses) vs Agencia (llave en mano, mensual). Opciones:
- (a) **Reencuadre:** el "motor" + Consultoría/Agencia pasa a ser la narrativa central; los planes se re-mapean debajo.
- (b) **Servicio adicional:** se mantienen los planes actuales y se **agrega** el social selling como línea/página nueva.
- (c) **Es lo mismo, mejor explicado:** el "motor" explica mejor lo que ya hace Crecimiento; Consultoría/Agencia = dos formas de comprarlo.
- *Recomendación Claude:* (c) o (b). El "motor" es una explicación visual potentísima de lo que ya se vende; encaja como sección en `como-funciona` sin romper el pricing actual. Confirmar con Felipe.

**D2 — Colisión de nombre "Consultoría".**
`content.md` lista **"Consultoría"** entre los nombres de plan **DEPRECADOS** (junto a Junior/Senior/Manager/Enterprise). Pero la propuesta social selling usa **"Consultoría"** como nombre de un **modo de entrega**. Hay que decidir: ¿se renombra el modo (p. ej. "Adopción asistida" / "Implementación") para no chocar con el plan deprecado, o se acepta el término en el nuevo contexto? **Bloquea** redactar la sección de modelos.

**D3 — Dos tracks de precio sin reconciliar.**
- Planes (canónico `pricing.md`): Base **20 UF** · Crecimiento **CLP 1.200.000/mes** · Hablemos ~100 UF.
- Propuesta social selling (Ingetic): Consultoría **≈60 UF total (3 meses)** · Agencia **≈CLP 1.5M/mes**.
¿Son el mismo producto a distinto precio, o dos líneas distintas? La web no puede mostrar ambos sin una historia clara. Resolver antes de publicar pricing del social selling.

**D4 — Equipo (`sobre-nosotros.html`).**
Hoy figuran Cristián + Jhonatan. El equipo operativo actual (memoria del proyecto) es **Felipe + Fernanda + Cristián**. ¿Se agrega Fernanda? ¿Jhonatan sigue? Confirmar y actualizar foto/bio.

**D5 — Métricas sin fuente.**
391% ROI, 97% precisión, 89% retención, 78% primer vendedor, etc. ¿Cuáles tienen fuente verificable? Las que no → "estimación interna" o se quitan. **Regla dura, no negociable.** Felipe debe decir cuáles se mantienen.

**D6 — Plan Fundadores.**
`precios.html` lo muestra al **10% permanente** (con TODO de ocultar al llenar 10 cupos); `llms.txt` dice **40%**. Unificar el número real y decidir si sigue activo.

---

## 5. El "motor" a traspasar a la web (contenido inline)

Felipe quiere que el diagrama de la presentación de implementación viva en la web (probablemente en `pages/como-funciona.html`, o sección nueva en la home). **Adaptarlo a genérico**: la presentación es un template por-prospecto (dice "Ingetic" y se usa en reuniones) — la versión web **no lleva nombre de cliente ni precios en el diagrama**.

### El motor (4 pasos automatizados → entrega a tu equipo)
> *De un desconocido a una reunión en tu agenda.*

1. **Publicamos** — contenido útil en nombre de tu equipo, para hacerse visible.
2. **Conectamos** — con los decisores de las empresas que te interesan.
3. **Conversamos** — uno a uno, entregando valor real, sin spam.
4. **Agendamos** — la reunión queda en la agenda de tu vendedor.
→ **Tu equipo: cierra la venta** (llega con contexto, no a una llamada en frío).

### Dos modos de tenerlo (sujeto a D1/D2/D3)
| | Consultoría (adopción) | Agencia (llave en mano) |
|---|---|---|
| Quién opera al final | Tu equipo | Sisteco |
| Tu involucramiento | Alto al inicio, baja al final | Mínimo y constante |
| Duración | 3 meses, luego autónomo | Mes a mes, continuo |
| Qué te queda | El sistema + el know-how adentro | Un flujo de reuniones |
| Ideal si… | Quieres ser dueño del proceso | Quieres resultados sin sumar trabajo |

### Bloque de seguridad (recomendado incluir — diferenciador real)
Sisteco vende a empresas tech, **incluida ciberseguridad**. La seguridad es objeción #1. El "motor" web debería incluir las garantías (sacadas del diseño maestro + research legal, **todas reales**):

- **Cuentas LinkedIn protegidas:** solo cuentas reales del equipo (nunca falsas), ritmo controlado muy por debajo de los límites de LinkedIn (calentamiento gradual), sin spam cruzado (una persona nunca recibe contacto de dos cuentas).
- **Datos en regla con la Ley 21.719:** solo datos profesionales, base legal de **interés legítimo** para B2B, identificación + salida fácil desde el primer mensaje, todo trazable, opt-out inmediato.
- Si LinkedIn cambia algo, el sistema **se detiene con cuidado** antes de arriesgar una cuenta.

> La presentación con este contenido (incluida una slide de seguridad ya redactada) está en la fuente HTML de §3. Reusar el estilo visual de la marca, NO copiar el HTML del deck tal cual (es A4/print; la web es responsive y con la identidad de sisteco.cl).

---

## 6. Plan de auditoría priorizado

### P1 — Consistencia y compliance (hacer primero)
1. [ ] **Reescribir `llms.txt`** completo: pricing nuevo (Base/Crecimiento/Hablemos), posicionamiento actual, equipo actual, quitar métricas sin fuente, quitar Plan Gratis/planes viejos. Es lo que leen los LLMs → impacto desproporcionado.
2. [ ] **Auditoría de métricas** (D5): listar cada métrica del sitio con su fuente; corregir/quitar las no verificables.
3. [ ] **Resolver D1/D2/D3** con Felipe → definir cómo entra el social selling y con qué nombres/precios.
4. [ ] **Traspasar el "motor"** (§5) a `como-funciona.html` (o sección home), genérico y responsive.

### P2 — Páginas y deuda visual
5. [ ] **`style.css`** + `css/pages.css`: reemplazar las 10+ referencias a SharpGrotesk por Space Grotesk / Hanken; verificar que ninguna página quede con fuente rota. Limpiar `Sharp_Grotesk/` y `assets/fonts/SharpGrotesk-*.otf` si ya no se usan.
6. [ ] **`sobre-nosotros.html`** (D4): actualizar equipo.
7. [ ] **`soluciones.html` + 3 landings BoF**: alinear el discurso de "qué hace Sisteco" con el posicionamiento actual (¿siguen siendo "5 capacidades agénticas" o se reencuadra hacia outbound+ads+social selling?).
8. [ ] **Legal**: confirmar que privacidad/gdpr/términos reflejan Ley 21.719 + base legal interés legítimo del social selling.

### P3 — Pulido
9. [ ] Revisar `vision.html`, `recursos/`, `agendar-demo`/`agenda` (¿duplicadas?), `contrato.html`.
10. [ ] Consistencia de dirección/contacto en todo el sitio (verificar "Las Condes, Santiago" vs "Av. Alonso de Córdova 5870 Of. 413" en `llms.txt`).
11. [ ] Correr `/seo-audit` y `/brand-check` (slash commands del proyecto) + `/deploy-qa` antes de publicar.

---

## 7. Reglas duras a respetar (del proyecto)

1. **NUNCA inventar** testimonios, métricas o estadísticas. Sin fuente → no va, o "estimación interna".
2. **SIEMPRE "Ley 21.719"** en contexto Chile (no solo GDPR).
3. **NUNCA** mencionar Claude/Gemini/Kimi/OpenRouter ni herramientas AI internas en el frontend público. Hablar de "automatización".
4. **NUNCA "SDR"** en material público → "ejecutivo de prospección" / "vendedor junior".
5. **Pricing** solo desde `_brand\voice\pricing.md`. Nombres deprecados prohibidos: Junior/Senior/Manager/Consultoría(como plan)/Enterprise/"Crecimiento 50 UF".
6. **Meta Ads** (si se menciona): aclarar siempre que el cliente paga el ad spend directo a Meta, Sisteco no marca up, dentro de cap USD 5.000/mes.
7. **Identidad visual** (no cambiar): fondo #F8F7F5, texto #111111, acento #c5ed36, hover #b3d82f. Fuentes Space Grotesk (headings) + Hanken Grotesk (body) + Nasalization (solo wordmark).
8. **Voz Felipe:** directo, sin buzzwords, es-CL. Evitar "sinergia/ecosistema/disrumpir/world-class". Usar "automatización", "clientes", "vender más", "siguiente paso".
9. Idioma: **español (es-CL)**.

---

## 8. Definition of Done

- [ ] `llms.txt` reescrito y consistente con el sitio.
- [ ] Cero métricas sin fuente declarada.
- [ ] Cero referencias a planes deprecados (Junior/Senior/Manager/50 UF/Plan Gratis salvo decisión explícita).
- [ ] El "motor" del social selling vive en una página, genérico y responsive, con identidad sisteco.cl.
- [ ] Decisiones D1–D6 resueltas y reflejadas.
- [ ] Sin font debt SharpGrotesk en CSS.
- [ ] `sobre-nosotros` con equipo real.
- [ ] `/deploy-qa` en verde antes de `npx vercel --prod`.

---

## 9. Notas para la sesión nueva

- El `CLAUDE.md` del proyecto Landing Page **auto-invoca agentes SEO + brand-voice** al editar copy/HTML. Respetarlo.
- Empezar **leyendo §3 (fuentes canónicas)** y **resolviendo §4 (decisiones)** con Felipe — sin eso, el resto es adivinar.
- Trabajar en **rama nueva** (no commitear directo a la rama de suscripción en curso).
- Esta auditoría es de **contenido/copy/CSS**, no de backend (`convex/`, `api/`): no tocar lógica de pagos ni suscripción sin razón.
