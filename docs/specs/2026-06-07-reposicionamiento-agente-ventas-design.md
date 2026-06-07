# Spec — Reposicionamiento Landing: "Tu agente de ventas autónomo"

> Fecha: 2026-06-07 · Autor: Felipe + Claude · Estado: en revisión
> Esta es la fuente de verdad del reposicionamiento. Toda página, copy y diagrama se deriva de aquí.

---

## 1. Contexto y objetivo

Sisteco evoluciona otra vez. **Misma infra-problema-ICP**, pero el producto deja de venderse como
"departamento/equipo de ventas agéntico" y pasa a ser **un agente de ventas autónomo que produce
reuniones por ti**. El sitio actual está sobrecargado para una agencia lean. Objetivo:

1. Limpiar copy y posicionamiento a la nueva narrativa.
2. Adelgazar la estructura (menos secciones, menos subpáginas).
3. Mostrar **en pasos simples** el proceso y los dolores del cliente, con diagramas en branding Sisteco.
4. Felipe co-escribe: nada se publica sin su voz. Todo el copy pasa por `humanizer`.

**No cambia:** ICP (10+ empleados, tech B2B Chile), el problema, el moat (SII, Ley 21.719), la voz Felipe.

---

## 2. Decisiones de posicionamiento (LOCKED)

| Elemento | Valor |
|----------|-------|
| **Metáfora central** | "Tu agente de ventas autónomo" (singular, opera solo, no humano simulado) |
| **Outcome / unidad de valor** | **Reuniones agendadas** (ya no "leads" ni "cierres") |
| **Tagline principal** | **"Llenamos tu agenda. Tú cierras."** |
| **Frase núcleo** | "Sisteco es tu agente de ventas autónomo. Llena tu agenda de reuniones; tú solo cierras." |
| **CTA único** | "Agenda una reunión" (coherente con el producto) |
| **ICP** | Empresas chilenas tech B2B de 10+ empleados (consultoras tech, ISVs, ciber-boutiques, integradores) |

### Vocabulario

| ☠️ Muere | ✅ Nace | 🔒 Se mantiene |
|---------|--------|---------------|
| "departamento / equipo de ventas agéntico" | "tu agente de ventas autónomo" | datos del SII (moat) |
| "leads" como producto final | "reuniones" como producto final | Ley 21.719 |
| "Vende más, preocúpate menos" | "Llenamos tu agenda. Tú cierras." | "tú solo cierras" |
| "empresa agéntica de ventas" | "agente de ventas autónomo" | tono directo, chileno, sin buzzwords |
| stats 5-7x / 21x / 78% / 391% / 89% | afirmaciones cualitativas + capacidades reales | contacto Chile, Las Condes |
| 50+ empleados | 10+ empleados | "no es para todos" (honestidad) |
| "Service-as-a-Software" (jerga a16z) | "un agente que trabaja por ti" | prospección por señales |
| nombres de stack interno (público) | "infraestructura propia" / genérico | es-CL, tuteo profesional |

---

## 3. Narrativa (arco invisible que toda página respeta)

1. **El dolor (mismo de siempre):** generas interés pero las reuniones no llegan — nadie persigue,
   califica ni agenda a tiempo. Los leads se enfrían. Tu equipo persigue en vez de cerrar.
2. **El giro:** no necesitas otra herramienta ni contratar un SDR caro. Necesitas un **agente de
   ventas autónomo** que haga ese trabajo completo.
3. **Cómo:** detecta señales → enriquece → califica con datos del SII → contacta → **agenda la
   reunión** en tu calendario. Tú apareces solo a cerrar.
4. **Prueba (sin stats infladas):** datos verificados del SII, compliance Ley 21.719, opera 24/7,
   honestidad sobre para quién sirve.
5. **CTA único:** *Agenda una reunión.*

---

## 4. Estructura lean

### Home (index.html) — 5 bloques

| # | Bloque | Contenido | Diagrama |
|---|--------|-----------|----------|
| 1 | **Hero** | Tagline + "tu agente de ventas autónomo" + 1 CTA (*Agenda una reunión*) | — |
| 2 | **El dolor** | Dolores reales del cliente (fuente: plan prospección reducida + transcripciones) | "Los dolores del cliente" |
| 3 | **El proceso** | Step-by-step simple del sistema (detectar→enriquecer→calificar→contactar→agendar) | "Pipeline de señales" (rebrand) + "Agente vs. tú" |
| 4 | **Qué recibes** | El output: reuniones agendadas con quien sí compra | "Del prospecto a la reunión" + "Implementación timeline" (rebrand) |
| 5 | **Para quién sí / no** | Honestidad lean (se mantiene) | "Señales vs. lista fría" (opcional aquí o en proceso) |
| — | **CTA final + footer** | *Agenda una reunión* + contacto Chile, footer slim | — |

Regla: **cada cierta cantidad de texto, un paso visual simple** que muestre cómo se ve lo que hacemos
para el cliente. Nada de muros de texto.

### Subpáginas

- **Conservar:** `precios`, `recursos` (newsletter), legal (`privacidad`, `terminos`, `cookies`, `gdpr`),
  `contrato`, página técnica (deep-dive con `motor_senales_infraestructura`).
- **Absorber en la home o archivar:** `soluciones`, `como-funciona`, `vision`, `dashboard`,
  `sobre-nosotros` (evaluar 1 a 1 con Felipe antes de borrar).

---

## 5. Plan de diagramas

### Branding Sisteco (target para TODOS los diagramas)

```
Fondo bloque:   #F8F7F5 (warm white)   | dark variant: #111111
Texto:          #111111                 | sobre dark: #F8F7F5
Acento:         #c5ed36 (lima)          | hover #b3d82f
Borde/cajas:    #e5e5e5
Fuente títulos: Space Grotesk (variable)
Fuente cuerpo:  Hanken Grotesk (variable)
NO usar:        Anthropic Sans, paleta verde/morado/naranja Anthropic
```

### A. Rebrand de los 3 existentes (Descargas → SVG Sisteco)

1. `sisteco_pipeline_senales.svg` → **Bloque 3 "El proceso"**.
   Nota: actualizar el output final de "prospecto calificado" a encadenar con "reunión agendada".
2. `sisteco_implementacion_timeline.svg` → **Bloque 4 "Qué recibes"** (3 fases + qué recibe el equipo).
3. `sisteco_motor_senales_infraestructura.svg` → **Página técnica** (deep-dive).

### B. Diagramas nuevos (los 4 elegidos)

1. **Del prospecto a la reunión** — prospecto calificado → secuencia multicanal → respuesta →
   reunión agendada en tu calendario. *Cierra el gap del nuevo outcome.* → Bloque 4.
2. **Los dolores del cliente** — interés que no convierte, nadie agenda, leads que se enfrían,
   equipo persiguiendo. → Bloque 2.
3. **Qué hace el agente vs. tú** — agente: encuentra/califica/contacta/agenda; tú: cierras. → Bloque 3.
4. **Señales vs. lista fría** — por qué prospectar por señales (timing real) gana a una lista fría. → Bloque 5 o 3.

Todos en SVG, responsive (`viewBox`, `width=100%`), self-hosted en `assets/diagrams/`, con `<title>`/`<desc>`
para accesibilidad y SEO.

---

## 6. Material fuente

- **Content Engine:** `Z:\Sisteco Systems\Automatizacion Digital\02_production\content-engine`
  (reglas de contenido, conocimiento, contenido social real).
- **Transcripciones de video** explicando el sistema (Content Engine + `The Agentic Company/02_production`).
- **Plan de prospección reducida** con el primer copy de los dolores (ubicar exacto en ejecución).
- **Diagramas fuente:** `C:\Users\Dell 5520\Downloads\sisteco_*.svg`.
- **Marca canónica a reescribir:** `sisteco-knowledge/empresa/IDENTIDAD_MARCA.md` (desactualizada).

---

## 7. Stack de ejecución

| Herramienta | Uso |
|-------------|-----|
| **humanizer** (skill) | TODO copy generado pasa por humanizer antes de publicar (quitar tells de IA, sonar a Felipe) |
| **impeccable** (npm CLI) | Instalar; correr `impeccable audit` sobre cada página redISeñada |
| **UI/UX Pro Max** (skill) | Guía de rediseño visual de cada bloque/página |
| **Playwright** (MCP) | Verificación visual: screenshot de cada bloque conforme se construye, en `localhost:3000` |
| **brand-voice:conversation-analysis** | Minar transcripciones → extraer voz real de Felipe + dolores |
| **brand-voice:content-generation** | Draft de copy por bloque aplicando este framework |
| **brand-voice:quality-assurance** | Validar copy vs. framework + reglas de contenido |

---

## 8. Equipo de agentes coordinado

Felipe pidió explícitamente un equipo coordinado. Diseño lean (cada spawn es costoso, así que roles claros):

- **Agente Voz (conversation-analysis):** lee Content Engine + transcripciones + plan prospección reducida.
  Devuelve: (a) léxico real de Felipe, (b) lista de dolores en sus palabras, (c) hechos del proceso actual.
- **Agente Copy (content-generation):** con el output del Agente Voz + este framework, redacta el copy
  de cada bloque/página. Output crudo → pasa por humanizer.
- **Agente QA (quality-assurance):** valida cada copy contra el framework, reglas de contenido y voz.
- **Orquestador (yo, en main):** diagramas (rebrand + nuevos), HTML/CSS con UI/UX Pro Max, integración,
  pase de humanizer + impeccable, verificación con Playwright, y checkpoints con Felipe.

Coordinación vía `TaskCreate`/`TaskList` (tablero compartido) + dependencias entre tareas.

---

## 9. Reglas de contenido (NO romper)

- NUNCA inventar testimonios, métricas o estadísticas. Solo capacidades reales y verificables.
- NUNCA mencionar en público: nombres de stack interno (scrapers, modelos, orquestadores por nombre).
- SIEMPRE "Ley 21.719" en contexto privacidad (no solo GDPR).
- SIEMPRE contacto Chile: contacto@sisteco.cl · +56 9 40065566 · Las Condes, Santiago.
- Idioma es-CL, tuteo profesional, directo, sin anglicismos ni palabras complejas.
- Un solo CTA por página, siempre orientado a *agendar reunión*.
- Identidad visual intacta: #F8F7F5 / #111 / #c5ed36 / Space Grotesk + Hanken Grotesk.

---

## 10. Criterios de aceptación

1. Home lean de 5 bloques, sin stats inventadas, sin nombres de stack, tagline nuevo, CTA único.
2. 7 diagramas (3 rebrand + 4 nuevos) en branding Sisteco, SVG responsive, mapeados a su sección.
3. Cada bloque alterna texto simple + paso visual; ningún muro de texto.
4. Todo el copy pasó por humanizer y QA; suena a Felipe.
5. `impeccable audit` sin issues críticos en cada página tocada.
6. Verificación visual con Playwright de cada página antes de cerrar.
7. `IDENTIDAD_MARCA.md` actualizado al nuevo posicionamiento.
8. Subpáginas reducidas según decisión 1-a-1 con Felipe.

---

## 11. Fuera de alcance (por ahora)

- Cambios de infraestructura/backend (el reposicionamiento es de copy + presentación).
- Describir la infra nueva en público (es secreto).
- Rediseño del dashboard de producto (solo landing pública).
