# Skills GSD (Get Shit Done) — Guia Completa

> GSD es el sistema de planificacion y ejecucion de proyectos que usamos en Sisteco con Claude Code.
> Se activan con el comando `/gsd:<nombre>` en Claude Code.
> Instalacion: `C:\Users\Dell 5520\.claude\get-shit-done\`

---

## Que es GSD

GSD es una metodologia estructurada para:
1. Planificar proyectos en fases con contexto rico
2. Ejecutar fases con paralelizacion (wave-based)
3. Verificar calidad con UAT estructurado
4. Mantener estado entre sesiones (no perder contexto)

**Directorio de planning:** `.planning/` en la raiz de cada proyecto

**Archivos clave:**
- `.planning/PROJECT.md` — Vision del milestone actual
- `.planning/ROADMAP.md` — Todas las fases con status
- `.planning/STATE.md` — Estado actual de la sesion
- `.planning/phases/[fase]/` — Planes detallados de cada fase

---

## Comandos GSD disponibles

### Inicio de proyecto y milestone

| Comando | Cuando usarlo |
|---|---|
| `/gsd:new-project` | Inicializar un proyecto desde cero con contexto profundo |
| `/gsd:new-milestone` | Comenzar un nuevo ciclo de milestone |
| `/gsd:progress` | Ver estado del proyecto y siguiente accion recomendada |

### Planificacion de fases

| Comando | Cuando usarlo |
|---|---|
| `/gsd:discuss-phase` | Recopilar contexto antes de planificar (preguntas adaptativas) |
| `/gsd:research-phase` | Investigar como implementar una fase |
| `/gsd:plan-phase` | Crear PLAN.md detallado con loop de verificacion |
| `/gsd:list-phase-assumptions` | Ver supuestos de Claude sobre la fase antes de planificar |
| `/gsd:add-phase` | Agregar una fase al final del milestone actual |
| `/gsd:insert-phase` | Insertar fase urgente como fase decimal (ej: 72.1) |
| `/gsd:remove-phase` | Eliminar una fase futura y renumerar |

### Ejecucion

| Comando | Cuando usarlo |
|---|---|
| `/gsd:execute-phase` | Ejecutar todos los planes de una fase con paralelizacion |
| `/gsd:quick` | Ejecutar tarea rapida con garantias GSD (sin agentes opcionales) |

### Verificacion y calidad

| Comando | Cuando usarlo |
|---|---|
| `/gsd:verify-work` | Validar features construidas con UAT conversacional |
| `/gsd:add-tests` | Generar tests para una fase completada |
| `/gsd:validate-phase` | Auditoria retroactiva y rellenar brechas de validacion |

### Sesiones y contexto

| Comando | Cuando usarlo |
|---|---|
| `/gsd:resume-work` | Retomar trabajo desde la sesion anterior con contexto completo |
| `/gsd:pause-work` | Crear handoff de contexto al pausar trabajo |
| `/gsd:audit-milestone` | Auditar completion del milestone antes de archivar |
| `/gsd:complete-milestone` | Archivar milestone completado y preparar el siguiente |
| `/gsd:cleanup` | Archivar directorios de fases completadas |

### Diagnostico y configuracion

| Comando | Cuando usarlo |
|---|---|
| `/gsd:health` | Diagnosticar salud del directorio .planning |
| `/gsd:debug` | Debugging sistematico con estado persistente |
| `/gsd:settings` | Configurar toggles y perfil de modelos |
| `/gsd:set-profile` | Cambiar perfil de modelo (quality/balanced/budget) |
| `/gsd:map-codebase` | Analizar codebase con agentes mapper en paralelo |

### Utilidades

| Comando | Cuando usarlo |
|---|---|
| `/gsd:add-todo` | Capturar idea o tarea del contexto actual |
| `/gsd:check-todos` | Listar TODOs pendientes y seleccionar uno |
| `/gsd:help` | Ver guia completa de comandos GSD |
| `/gsd:update` | Actualizar GSD a la ultima version |

---

## Flujo tipico de trabajo con GSD

### Para un proyecto nuevo:
```
/gsd:new-project
→ GSD hace preguntas sobre el proyecto
→ Genera PROJECT.md con vision completa
→ Sugiere ROADMAP.md con fases

/gsd:progress
→ Ver donde estamos y que sigue
```

### Para una nueva fase:
```
/gsd:discuss-phase
→ GSD hace preguntas adaptativas para recopilar contexto
→ Genera CONTEXT.md con decisiones documentadas

/gsd:plan-phase
→ GSD investiga y crea PLAN.md detallado
→ Loop de verificacion: Claude propone → tu apruebas o corriges

/gsd:execute-phase
→ GSD ejecuta tareas en waves (paralelo cuando posible)
→ Checkpoints humanos en momentos criticos

/gsd:verify-work
→ UAT estructurado: GSD te pregunta, tu verificas
```

### Para reanudar trabajo:
```
/gsd:resume-work
→ GSD lee STATE.md y te da contexto completo de donde estabas
→ Continuas desde exactamente donde lo dejaste
```

---

## Estructura de un PLAN.md

```yaml
---
phase: 02-landing-improvements
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - index.html
  - style.css
autonomous: false
requirements:
  - NAV-01
  - NAV-02

must_haves:
  truths:
    - "Navbar tiene clase .scrolled al hacer scroll > 80px"
  artifacts:
    - path: "index.html"
      provides: "Navbar con floating pill"
      contains: ".scrolled"
---

<objective>
Descripcion del objetivo de la fase.
</objective>

<tasks>
<task type="auto">
  <name>Task 1: ...</name>
  <action>Instrucciones detalladas...</action>
  <verify>Comando de verificacion automatico</verify>
  <done>Checklist de completitud</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 2: Verificacion humana</name>
  <how-to-verify>Pasos para que el humano verifique</how-to-verify>
  <resume-signal>Escribe "approved" o describe problemas</resume-signal>
</task>
</tasks>
```

---

## Configuracion GSD en Sisteco

**Directorio:** `.planning/`
**Config:** `.planning/config.json`
**Estado:** `.planning/STATE.md`
**Roadmap:** `.planning/ROADMAP.md`

### Milestone actual (v1.0)
- Phase 1: Estrategia Financiera — COMPLETE
- Phase 2: Landing Page Improvements — COMPLETE
- Phase 3-5: Payments Backend — PAUSED

---

*GSD es una herramienta de Claude Code que se actualiza independientemente. Para ver la ultima version: `/gsd:update`*
