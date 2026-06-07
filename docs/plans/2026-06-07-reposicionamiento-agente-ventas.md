# Reposicionamiento Landing "Tu agente de ventas autónomo" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposicionar la landing pública de Sisteco de "departamento de ventas agéntico" a "tu agente de ventas autónomo que llena tu agenda de reuniones", con una home lean de 5 bloques, 7 diagramas en branding Sisteco, y todo el copy en la voz real de Felipe.

**Architecture:** Equipo de 3 subagentes (Voz, Copy, QA) coordinado vía tablero de tareas + orquestador en main para diagramas, HTML/CSS, y verificación. Fuente de verdad: `docs/specs/2026-06-07-reposicionamiento-agente-ventas-design.md`. Cada bloque se construye → humanizer → impeccable audit → Playwright screenshot → checkpoint con Felipe.

**Tech Stack:** HTML/CSS/JS vanilla, GSAP, Lucide, SVG diagrams. Tooling: humanizer (skill), impeccable (npm CLI), UI/UX Pro Max (skill), Playwright (MCP), brand-voice agents.

---

## File Structure

**Crea:**
- `assets/diagrams/proceso-senales.svg` — pipeline de señales (rebrand)
- `assets/diagrams/implementacion-fases.svg` — timeline 3 fases (rebrand)
- `assets/diagrams/motor-infraestructura.svg` — infra técnica (rebrand)
- `assets/diagrams/prospecto-a-reunion.svg` — nuevo
- `assets/diagrams/dolores-cliente.svg` — nuevo
- `assets/diagrams/agente-vs-tu.svg` — nuevo
- `assets/diagrams/senales-vs-lista-fria.svg` — nuevo
- `docs/research/voz-felipe-dolores-proceso.md` — output del Agente Voz

**Modifica:**
- `index.html` — reconstrucción lean de 5 bloques
- `style.css` — estilos de los bloques nuevos / cleanup
- `sisteco-knowledge/empresa/IDENTIDAD_MARCA.md` — actualizar al nuevo posicionamiento
- `sisteco-knowledge/CLAUDE.md` — tagline, ICP, reglas de stats

**No tocar todavía:** subpáginas (`soluciones`, `como-funciona`, `vision`, `dashboard`, `sobre-nosotros`) hasta checkpoint con Felipe.

---

## Branding de diagramas (mapping determinístico para TODOS los SVG)

Colapsar la paleta Anthropic (3 colores) a la paleta Sisteco (monocromo + 1 acento lima):

| Origen (Anthropic) | Destino (Sisteco) |
|--------------------|-------------------|
| `Anthropic Sans` (títulos) | `Space Grotesk` |
| `Anthropic Sans` (cuerpo) | `Hanken Grotesk` |
| fill verde `rgb(225,245,238)` / morado `rgb(238,237,254)` / naranja `rgb(250,236,231)` | fill neutro `#FFFFFF` |
| fill warm `rgb(241,239,232)` | `#F1F0EC` |
| stroke verde `rgb(15,110,86)` / morado `rgb(83,74,183)` / naranja `rgb(153,60,29)` | borde `#E5E5E5` |
| texto de color (verde/morado/naranja oscuro) | `#111111` |
| nodo/etapa CLAVE o final (output) | fill `#c5ed36`, texto `#111` |
| flechas `rgb(115,114,108)` | `#111111` |
| label vertical "AGENTES AI" | `#111`, letter-spacing 2px |
| fondo del lienzo | transparente (hereda el bloque) |

Regla: el **lima `#c5ed36` se usa SOLO como acento** (nodo clave, output final, flechas de avance). El resto monocromo. Mantener `viewBox`, `width=100%`, `<title>`/`<desc>`.

---

## Phase 0 — Setup

### Task 0.1: Levantar dev server + verificar herramientas

**Files:** ninguno (entorno)

- [ ] **Step 1: Iniciar dev server**

Run: `npm start` (en background)
Expected: servidor en `http://localhost:3000`

- [ ] **Step 2: Instalar impeccable**

Run: `npx impeccable@latest --help`
Expected: lista de comandos (audit, polish, critique). Si falla el npx, instalar global: `npm i -g impeccable`.

- [ ] **Step 3: Verificar Playwright MCP**

Acción: `mcp__playwright__browser_navigate` a `http://localhost:3000`, luego `browser_take_screenshot`.
Expected: screenshot del index actual (baseline "antes").

- [ ] **Step 4: Commit baseline**

```bash
git add -A && git commit -m "chore: baseline antes de reposicionamiento agente ventas"
```

---

## Phase 1 — Minería de fuente (Agente Voz)

### Task 1.1: Extraer voz, dolores y hechos del proceso

**Files:**
- Create: `docs/research/voz-felipe-dolores-proceso.md`

- [ ] **Step 1: Dispatch Agente Voz**

Subagente: `brand-voice:conversation-analysis`. Prompt:
> Lee el material en `Z:\Sisteco Systems\Automatizacion Digital\02_production\content-engine`
> (reglas de contenido, conocimiento, captions, transcripciones) y busca el "plan de prospección
> reducida" con copy de dolores. También revisa transcripciones de video del sistema en
> `The Agentic Company/02_production`. Extrae y entrega en markdown:
> 1. **Léxico real de Felipe** — palabras/frases que usa, muletillas, cómo nombra las cosas.
> 2. **Dolores del cliente en sus palabras** — lista de 4-6 dolores concretos, con la frase original.
> 3. **Hechos del proceso actual** — cómo funciona la prospección por señales hoy (pasos reales).
> 4. **Citas reutilizables** — frases textuales que sirvan para copy.
> NO inventes. Si algo no está, dilo. Output a `docs/research/voz-felipe-dolores-proceso.md`.

- [ ] **Step 2: Verificar el output**

Acción: Read `docs/research/voz-felipe-dolores-proceso.md`.
Expected: 4 secciones completas, sin invención, con la ruta del plan de prospección reducida localizada.

- [ ] **Step 3: Checkpoint con Felipe**

Mostrar a Felipe los dolores extraídos + léxico. Que confirme/corrija antes de generar copy.

- [ ] **Step 4: Commit**

```bash
git add docs/research/voz-felipe-dolores-proceso.md && git commit -m "docs: voz Felipe + dolores + proceso (Agente Voz)"
```

---

## Phase 2 — Diagramas

> Cada diagrama: construir SVG → render en navegador → Playwright screenshot → revisar branding → ajustar.
> El orquestador (main) hace los diagramas; puede delegar la conversión mecánica a un subagente general.

### Task 2.1: Rebrand `proceso-senales.svg`

**Files:**
- Create: `assets/diagrams/proceso-senales.svg` (desde `C:\Users\Dell 5520\Downloads\sisteco_pipeline_senales.svg`)

- [ ] **Step 1:** Copiar el SVG fuente y aplicar el mapping de branding (tabla arriba). El output final
  "Prospecto calificado listo para tu equipo" se mantiene pero se pinta el nodo final en lima `#c5ed36`.
- [ ] **Step 2:** Guardar en `assets/diagrams/proceso-senales.svg`.
- [ ] **Step 3:** Render: navegar a un HTML temporal que embeba el SVG; Playwright screenshot.
- [ ] **Step 4:** Verificar: 0 colores Anthropic, fuentes Space Grotesk/Hanken, lima solo como acento.
- [ ] **Step 5: Commit** `git add assets/diagrams/proceso-senales.svg && git commit -m "feat: diagrama proceso-senales en branding Sisteco"`

### Task 2.2: Rebrand `implementacion-fases.svg`

**Files:** Create `assets/diagrams/implementacion-fases.svg` (desde `sisteco_implementacion_timeline.svg`)
- [ ] Mismos pasos que 2.1 aplicando el mapping. Nodos de fase (Sem1/2/3+) con header en lima. Commit.

### Task 2.3: Rebrand `motor-infraestructura.svg`

**Files:** Create `assets/diagrams/motor-infraestructura.svg` (desde `sisteco_motor_senales_infraestructura.svg`)
- [ ] Mismos pasos. Capa superior (señales en tiempo real) acentuada en lima. Commit.

### Task 2.4: Nuevo `prospecto-a-reunion.svg`

**Files:** Create `assets/diagrams/prospecto-a-reunion.svg`

- [ ] **Step 1:** Construir SVG horizontal (viewBox 0 0 680 240) con flujo de 4 nodos + output:
  `Prospecto calificado` → `Secuencia multicanal` (email · LinkedIn · WhatsApp) → `Respuesta detectada` →
  `Reunión agendada en tu calendario` (nodo final en lima `#c5ed36`). Branding Sisteco.
- [ ] **Step 2:** Guardar, render, Playwright screenshot, verificar branding. Commit.

### Task 2.5: Nuevo `dolores-cliente.svg`

**Files:** Create `assets/diagrams/dolores-cliente.svg`

- [ ] **Step 1:** Construir SVG con 4 "dolores" en cards (usar los dolores reales del Task 1.1, no inventar).
  Estructura: título "Lo que pasa hoy" + 4 cards con icono + frase corta. Estética: cards neutras, el
  problema central (ej. "las reuniones no llegan") acentuado.
- [ ] **Step 2:** Guardar, render, screenshot, verificar. Commit.

### Task 2.6: Nuevo `agente-vs-tu.svg`

**Files:** Create `assets/diagrams/agente-vs-tu.svg`

- [ ] **Step 1:** SVG de 2 columnas: **El agente** (Encuentra · Califica con SII · Contacta · Agenda) vs.
  **Tú** (Cierras). Columna "Tú" minimal y acentuada en lima para enfatizar el foco humano.
- [ ] **Step 2:** Guardar, render, screenshot, verificar. Commit.

### Task 2.7: Nuevo `senales-vs-lista-fria.svg`

**Files:** Create `assets/diagrams/senales-vs-lista-fria.svg`

- [ ] **Step 1:** SVG comparativo 2 columnas: **Lista fría** (sin timing, contacto genérico, baja respuesta)
  vs. **Señales** (timing real: licitación/contratación/noticia, mensaje con contexto, alta relevancia).
  Columna "Señales" acentuada en lima.
- [ ] **Step 2:** Guardar, render, screenshot, verificar. Commit.

---

## Phase 3 — Copy de la home (Agente Copy + humanizer + QA)

> Por cada bloque: Agente Copy redacta (con framework + Task 1.1) → humanizer → Agente QA valida.
> El copy NO se escribe en este plan; se genera en ejecución con estas restricciones.

### Task 3.1: Copy Bloque 1 — Hero

**Files:** borrador en `docs/research/copy-home.md` (sección Hero)

- [ ] **Step 1: Dispatch Agente Copy** (`brand-voice:content-generation`) para el Hero:
  - Tagline principal: "Llenamos tu agenda. Tú cierras."
  - Subhead: 1-2 frases con "tu agente de ventas autónomo" + outcome reuniones.
  - 1 CTA: "Agenda una reunión".
  - Restricciones: es-CL, directo, sin anglicismos, sin stats, sin nombres de stack.
- [ ] **Step 2:** Pasar el borrador por el skill `humanizer`.
- [ ] **Step 3: Dispatch Agente QA** (`brand-voice:quality-assurance`): validar vs. framework + reglas.
- [ ] **Step 4:** Guardar copy aprobado en `docs/research/copy-home.md`. Checkpoint Felipe.

### Task 3.2–3.5: Copy Bloques 2–5

**Files:** `docs/research/copy-home.md` (secciones por bloque)

- [ ] **Bloque 2 — El dolor:** Agente Copy usa los dolores reales del Task 1.1 → humanizer → QA.
- [ ] **Bloque 3 — El proceso:** pasos simples (detectar→enriquecer→calificar→contactar→agendar), 1 frase por paso → humanizer → QA.
- [ ] **Bloque 4 — Qué recibes:** el output (reuniones agendadas con quien sí compra) → humanizer → QA.
- [ ] **Bloque 5 — Para quién sí/no:** honestidad lean (conservar el espíritu del actual) → humanizer → QA.
- [ ] **Commit:** `git add docs/research/copy-home.md && git commit -m "docs: copy home aprobado (Copy+humanizer+QA)"`

---

## Phase 4 — Armado de la home (HTML/CSS + UI/UX Pro Max + Playwright + impeccable)

> Invocar skill UI/UX Pro Max para el diseño de cada bloque. Construir bloque por bloque, verificar visual.

### Task 4.1: Estructura base lean de `index.html`

**Files:** Modify `index.html`

- [ ] **Step 1:** Invocar skill `ui-ux-pro-max` para el layout de la home lean (5 bloques).
- [ ] **Step 2:** Reemplazar el `<body>` actual por el esqueleto de 5 bloques + nav slim + footer slim.
  Conservar `<head>` (fuentes, GSAP, Lucide), navbar y footer canónicos.
- [ ] **Step 3:** Playwright screenshot de la estructura vacía. Verificar que carga sin errores de consola.
- [ ] **Step 4: Commit** `git commit -am "feat: esqueleto home lean 5 bloques"`

### Task 4.2–4.6: Construir cada bloque

**Files:** Modify `index.html`, `style.css`

Por cada bloque (Hero, Dolor, Proceso, Qué recibes, Para quién):
- [ ] **Step 1:** Insertar el copy aprobado (Task 3.x) + el diagrama correspondiente (Phase 2).
- [ ] **Step 2:** Estilar con UI/UX Pro Max, identidad visual Sisteco intacta.
- [ ] **Step 3:** Playwright screenshot del bloque. Revisar con Felipe si es bloque clave (Hero, Proceso).
- [ ] **Step 4:** `npx impeccable audit` sobre `index.html`. Resolver issues críticos.
- [ ] **Step 5: Commit** por bloque.

Mapeo diagrama↔bloque: Dolor→`dolores-cliente`; Proceso→`proceso-senales`+`agente-vs-tu`;
Qué recibes→`prospecto-a-reunion`+`implementacion-fases`; Para quién→`senales-vs-lista-fria`.

### Task 4.7: Pase final de la home

- [ ] **Step 1:** Playwright: screenshot full-page desktop + mobile (responsive).
- [ ] **Step 2:** `npx impeccable audit` final de `index.html`. 0 críticos.
- [ ] **Step 3:** Revisar consola (0 errores), links, CTA apunta a agendar reunión.
- [ ] **Step 4:** Checkpoint completo con Felipe. Commit.

---

## Phase 5 — Docs canónicos + subpáginas

### Task 5.1: Actualizar `IDENTIDAD_MARCA.md` y `CLAUDE.md`

**Files:** Modify `sisteco-knowledge/empresa/IDENTIDAD_MARCA.md`, `sisteco-knowledge/CLAUDE.md`

- [ ] **Step 1:** Reescribir misión, posicionamiento, tagline ("Llenamos tu agenda. Tú cierras."),
  metáfora (agente de ventas autónomo), ICP (10+), outcome (reuniones). Borrar tabla de stats inventadas.
  Quitar nombres de stack de la sección arquitectura. Actualizar a prospección por señales.
- [ ] **Step 2:** Sincronizar `CLAUDE.md` (tagline, ICP, reglas de stats → cualitativas).
- [ ] **Step 3: Commit** `git commit -am "docs: IDENTIDAD_MARCA + CLAUDE al nuevo posicionamiento"`

### Task 5.2: Decisión 1-a-1 de subpáginas

- [ ] **Step 1:** Con Felipe, revisar `soluciones`, `como-funciona`, `vision`, `dashboard`,
  `sobre-nosotros`: absorber en home, conservar, o archivar.
- [ ] **Step 2:** Ejecutar la decisión (mover a `_archive/` o limpiar copy al nuevo posicionamiento).
- [ ] **Step 3:** Verificar que no queden links rotos (Playwright + grep de hrefs). Commit.

### Task 5.3: Verificación global final

- [ ] **Step 1:** Grep global: 0 "leads" como producto, 0 stats inventadas, 0 "50+ empleados",
  0 "departamento de ventas", 0 nombres de stack en páginas públicas.
- [ ] **Step 2:** Playwright sweep de páginas conservadas (screenshots).
- [ ] **Step 3:** `npx impeccable audit` de páginas tocadas.
- [ ] **Step 4:** Checkpoint final Felipe. Commit. (Deploy `npx vercel --prod` solo si Felipe lo pide.)

---

## Self-Review (cobertura del spec)

- §2 Posicionamiento → Tasks 3.1, 5.1 ✔
- §3 Narrativa → Phase 3 (copy por bloque) ✔
- §4 Estructura lean → Phase 4 ✔; subpáginas Task 5.2 ✔
- §5 Diagramas (3 rebrand + 4 nuevos) → Phase 2 (Tasks 2.1–2.7) ✔
- §6 Material fuente → Task 1.1 ✔
- §7 Stack ejecución (humanizer/impeccable/UI-UX/Playwright/agents) → Phases 0,2,3,4 ✔
- §8 Equipo de agentes → Voz (1.1), Copy (3.x), QA (3.x), Orquestador (main) ✔
- §9 Reglas de contenido → restricciones en cada task de copy + Task 5.3 ✔
- §10 Criterios de aceptación → Tasks 4.7, 5.3 ✔

Sin placeholders de tipo "TBD/TODO" en pasos accionables. El copy final se genera en ejecución bajo
restricciones explícitas (apropiado para proyecto de contenido, no determinístico).
