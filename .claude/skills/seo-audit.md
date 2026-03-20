---
name: seo-audit
description: Auditoría SEO completa de la Landing Page de Sisteco. Despacha 7 agentes especializados en paralelo y produce un reporte consolidado con prioridad Alta/Media/Baja. Usar cuando se quiera revisar el estado SEO de cualquier página antes de publicar o periódicamente.
argument-hint: "[página específica a auditar, ej: index.html, o 'todas' para sitio completo]"
---

# SEO Audit — Landing Page Sisteco

Eres el orquestador de una auditoría SEO completa. Despachas 7 agentes especializados
en paralelo, consolidas sus reportes y presentas un resumen accionable.

## Protocolo

### 1. Determinar alcance

Si el usuario especificó una página, auditar solo esa. Si no, auditar todas las páginas HTML:
- `index.html`
- `pages/soluciones.html`
- `pages/como-funciona.html`
- `pages/precios.html`
- `pages/vision.html`
- `pages/sobre-nosotros.html`

Lee el HTML de las páginas relevantes antes de despachar los agentes.

### 2. Despachar agentes en paralelo

Despachar TODOS en la misma llamada (paralelo):

| Agente | subagent_type | Tarea |
|--------|--------------|-------|
| Keyword Strategist | `seo-technical-optimization:seo-keyword-strategist` | Densidad keyword, variaciones semánticas, LSI |
| Meta Optimizer | `seo-technical-optimization:seo-meta-optimizer` | Títulos, descriptions, URLs |
| Structure Architect | `seo-technical-optimization:seo-structure-architect` | H1-H6, schema markup, internal links |
| Snippet Hunter | `seo-technical-optimization:seo-snippet-hunter` | Featured snippets eligibility |
| Authority Builder | `seo-analysis-monitoring:seo-authority-builder` | E-E-A-T signals, credibilidad |
| Cannibalization Detector | `seo-analysis-monitoring:seo-cannibalization-detector` | Overlap keywords entre páginas |
| Content Auditor | `seo-content-creation:seo-content-auditor` | Calidad, completitud, thin content |

Prompt a cada agente:
```
Analiza el siguiente HTML de la Landing Page de Sisteco (plataforma B2B SaaS Chile).
Empresa: automatización de ventas B2B, mercado Chile.
Keywords objetivo: automatización ventas B2B Chile, pipeline de ventas, CRM automatizado, leads B2B.
[pegar HTML relevante]
Retorna: lista de issues con prioridad ALTA/MEDIA/BAJA y recomendación concreta para cada uno.
```

### 3. Consolidar y reportar

```
## SEO Audit Report — [fecha]

### 🔴 ALTA PRIORIDAD (resolver antes del próximo deploy)
- [issue] → [recomendación concreta]

### 🟡 MEDIA PRIORIDAD (resolver esta semana)
- [issue] → [recomendación concreta]

### 🟢 BAJA PRIORIDAD (backlog)
- [issue] → [recomendación concreta]

### ✅ OK (sin cambios necesarios)
- [áreas que están bien]
```

Aplicar las correcciones de Alta prioridad de inmediato si el usuario lo indica.
