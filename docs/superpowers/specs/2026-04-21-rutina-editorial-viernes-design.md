# Rutina editorial semanal — Sub-proyecto 3

**Fecha:** 2026-04-21
**Estado:** ✅ Scaffolding completo — pendiente primera ejecución real con Felipe
**Palabra clave para reanudar:** `continuar rutina-viernes` o `/loop rutina-viernes`

## Implementación (sesión 2026-04-21)

- ✅ `docs/newsletter/topics-backlog.md` — 10 temas cargados en cola activa + 7 ideas sueltas + sección de publicados (con el primer post GEO ya registrado).
- ✅ `docs/newsletter/style-guide.md` — Reglas de voz, estructura estándar, longitud objetivo por categoría, checklist pre-publicación, reglas de contenido sensible.
- ✅ `docs/newsletter/templates/interview-questions.md` — 5 preguntas universales + banco específico por categoría (Opinión / Review / Caso / Técnica / Chile / Contra-tesis) + flujo paso a paso.
- ✅ `docs/newsletter/templates/post-template.html` — Template HTML con placeholders `{{...}}` + schemas TechArticle/FAQPage/BreadcrumbList + nav/footer coherentes con el resto de `/recursos`.
- ✅ `.claude/commands/newsletter-viernes.md` — Slash command con flujo completo de 9 pasos (leer estado → proponer tema → validar ángulo → entrevista 5 preguntas → guardar raw → redactar draft → QA → notificar → NO publicar).
- ✅ `pages/recursos/posts/drafts/README.md` — Flujo manual de publicación que debe seguir Felipe cuando apruebe un draft.

**Pendiente (acción manual de Felipe):**
- Configurar scheduled task (Opción A del spec) para disparar `/newsletter-viernes` los viernes 10:00 AM CLT. Usar `mcp__scheduled-tasks__create_scheduled_task` con cron `0 10 * * 5` y timezone `America/Santiago`.
- Alternativamente usar `/loop` semanal.
- Ejecutar la primera ronda real cualquier viernes con Felipe presente para calibrar voz.
- Decidir si se agrega hook de SessionStart (Opción C) como recordatorio.

**Criterios de éxito a medir tras 4 semanas:**
- 4 drafts generados
- Al menos 2 publicados sin edición mayor
- Tiempo total de Felipe: <20 min por semana
- `/recursos` con 5+ posts en 30 días

---

## Objetivo

Automatizar el flujo de creación de newsletters semanales de Sisteco. Cada viernes, Claude despierta, entrevista a Felipe sobre un tema tech/ventas, captura su voz, y redacta un draft de post listo para revisión.

## Cómo funciona (flujo semanal)

### Viernes 10:00 AM — Disparo automático

Un **scheduled task** (Claude Code scheduled-tasks MCP o hook `/loop`) dispara el slash command `/newsletter-viernes` que:

1. Lee un archivo `docs/newsletter/topics-backlog.md` con temas candidatos
2. Selecciona uno (prioridad manual o rotación) — o pregunta a Felipe cuál quiere tocar
3. Abre una conversación con Felipe:
   - **"Hola Felipe, es viernes. Hoy propongo hablar de X. ¿Te parece o prefieres otro tema?"**
4. Si Felipe acepta, ejecuta la entrevista (ver abajo)
5. Si Felipe pospone, registra la intención y reagenda para el siguiente viernes

### Entrevista estructurada (10–15 min de Felipe)

Claude hace 4–5 preguntas quirúrgicas sobre el tema:

1. **Posición:** "¿Cuál es tu opinión principal sobre [tema]? En una frase."
2. **Evidencia:** "¿Qué has visto trabajando con clientes que respalde eso?"
3. **Contraste:** "¿Qué dice la industria que tú no compras?"
4. **Aplicación:** "¿Cómo esto cambia lo que hace Sisteco?"
5. **Tactical:** "¿Qué debería hacer un gerente de ventas tech este lunes con esta info?"

Felipe responde en texto o voz (si hay integración con transcripción). Respuestas cortas, sin editar.

### Redacción automática

Claude toma las respuestas crudas y redacta un post con **voz Felipe** aplicando:

- `brand-voice:content-generation` con las guidelines de `CLAUDE.md` global
- Estructura estándar: TL;DR → punto principal → evidencia → contraste → acción
- Largo objetivo: 800–1200 palabras
- Voz: directo, chileno, sin clichés corporativos, ejemplos concretos
- SEO: keywords del tema, meta description, slug, FAQ JSON-LD

### Entrega

1. Guarda el draft en `pages/recursos/posts/drafts/YYYY-MM-DD-slug.html`
2. Abre el archivo en el IDE de Felipe
3. Envía notificación (PushNotification MCP o email): *"Draft del viernes listo: [título]. Tiempo de lectura: X min. Revisar y publicar."*
4. Felipe revisa → edita lo que quiera → mueve manualmente a `pages/recursos/posts/` para publicar, o descarta

## Arquitectura

### Archivos nuevos

```
docs/newsletter/
  topics-backlog.md        # Lista de temas candidatos, ordenada por prioridad
  style-guide.md           # Guía específica para newsletters (sub-set del CLAUDE.md global)
  templates/
    post-template.html     # HTML base con placeholders
    interview-questions.md # Banco de preguntas por categoría de tema

pages/recursos/posts/drafts/
  (drafts semanales)

.claude/commands/
  newsletter-viernes.md    # Slash command que orquesta el flujo
```

### Categorías de tema (para variedad)

- **Opinión Felipe** — hot takes sobre tendencias de ventas/tech
- **Review GEO** — herramientas del stack (continuación del primer post)
- **Caso real** — historia anónima de un cliente (con permiso)
- **Técnica** — cómo armar X parte de un sistema agéntico
- **Chile-específico** — Ley 21.719, datos SII, dinámica del mercado local
- **Contra-tesis** — opinión impopular bien argumentada

Rotación sugerida: Opinión → Review → Técnica → Chile → Caso → Contra-tesis → (repeat)

### Scheduled task (configuración)

**Opción A — Claude Code scheduled-tasks MCP:**

```json
{
  "name": "newsletter-viernes",
  "schedule": "0 10 * * 5",   // Todos los viernes 10 AM
  "prompt": "/newsletter-viernes",
  "timezone": "America/Santiago"
}
```

**Opción B — `/loop` skill con trigger manual:**

Felipe invoca `/loop 7d /newsletter-viernes` una vez; el loop se dispara semanal.

**Opción C — Hook del SessionStart:**

Si es viernes y no hay draft de esta semana, recordarle a Felipe al abrir una sesión.

**Decisión:** Opción A como primaria (más confiable), Opción C como backup visual.

## Criterios de éxito

- 4 drafts generados en el primer mes (un viernes por semana)
- Al menos 2 publicados sin edición mayor (voz Felipe funciona)
- Tiempo total de Felipe por semana: <20 min (entrevista + revisión final)
- `/recursos` pasa de 1 post a 5+ posts en 30 días

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Felipe salta viernes | Backlog acumula, siguiente viernes ofrece 2 temas |
| Voz Felipe no queda bien | Revisión con `brand-voice:quality-assurance` antes de entregar |
| Posts repetitivos | Rotación obligatoria de categorías |
| Tema sin sustancia | Claude rechaza temas sin posición clara (<10% del tiempo) |

## Orden de ejecución

1. Crear `docs/newsletter/` con backlog, style-guide, templates
2. Escribir el slash command `/newsletter-viernes`
3. Configurar scheduled task (Opción A)
4. Ejecutar prueba manual: `/newsletter-viernes` → entrevista → draft
5. Iterar la voz tras el primer draft real
6. Activar la rutina recurrente

## Fuera de alcance

- Publicación automática sin revisión (Felipe siempre aprueba antes de publicar)
- Distribución a redes sociales (fase posterior)
- Newsletter por email (Resend/Mailchimp) — fase posterior
- Generación de imágenes por post (fase posterior, con nanobanana-mcp)
