# MCP Design-to-Code: Stitch + Nano Banana 2

Guía de configuración y uso del entorno MCP para flujos de diseño a código.

---

## Arquitectura

```
Claude Code
├── stitch            (HTTP remoto) → https://stitch.googleapis.com/mcp
│                                     Auth: X-Goog-Api-Key
│                                     Herramientas: list_projects, list_screens,
│                                                   get_screen, generate_screen_from_text
│
└── nanobanana-mcp    (stdio local) → node mcp-servers/nanobanana-mcp/index.js
                                      Auth: FAL_KEY (env var)
                                      Herramientas: generate_ui_mockup,
                                                    iterate_on_design,
                                                    list_ui_templates
```

---

## Configuración: Claves reales

### 1. FAL_KEY para Nano Banana 2

1. Crea cuenta en https://fal.ai
2. Ve a Settings → API Keys → Create Key
3. Edita `~/.claude.json` y reemplaza `YOUR_FAL_KEY_HERE`:

```json
"nanobanana-mcp": {
  "env": {
    "FAL_KEY": "TU_CLAVE_REAL_AQUI"
  }
}
```

O re-registra el servidor con tu clave real (ejecutar en terminal):

```bash
claude mcp remove nanobanana-mcp -s user
claude mcp add nanobanana-mcp -s user \
  -e "FAL_KEY=tu_clave_real" \
  -- node "C:/Users/Dell 5520/Documents/AgenticWorkflows/Landing Page/mcp-servers/nanobanana-mcp/index.js"
```

### 2. Stitch API Key

1. Ve a https://stitch.withgoogle.com (beta — puede requerir acceso)
2. Settings → API Keys → Create API Key
3. Re-registra con tu clave:

```bash
claude mcp remove stitch -s user
claude mcp add stitch -s user \
  --transport http https://stitch.googleapis.com/mcp \
  --header "X-Goog-Api-Key: tu_clave_stitch" \
  -s user
```

### Verificar estado

```bash
claude mcp list
```

Debes ver `✓ Connected` en ambos: `stitch` y `nanobanana-mcp`.

---

## Stitch: herramientas disponibles

| Herramienta | Parámetros | Descripción |
|---|---|---|
| `list_projects` | `filter?` | Lista todos tus proyectos Stitch |
| `get_project` | `name` | Detalle de un proyecto específico |
| `list_screens` | `project_id` | Todas las pantallas de un proyecto |
| `get_screen` | `project_id`, `screen_id` | Detalle + jerarquía de componentes de una pantalla |
| `generate_screen_from_text` | `project_id`, `prompt`, `model_id` | Genera diseño desde texto (`GEMINI_3_PRO` o `GEMINI_3_FLASH`) |
| `create_project` | `name` | Crea un nuevo proyecto |

---

## Nano Banana 2: herramientas disponibles

| Herramienta | Parámetros clave | Descripción |
|---|---|---|
| `list_ui_templates` | — | Lista los templates de prompt disponibles |
| `generate_ui_mockup` | `description`, `template`, `aspect_ratio`, `resolution`, `num_images`, `save_locally` | Genera mockup de UI/UX |
| `iterate_on_design` | `original_description`, `change_instructions`, `template`, `num_variants` | Genera variantes sobre un diseño existente |

### Templates disponibles

| Template | Ideal para |
|---|---|
| `landing_b2b` | Landing pages SaaS desktop con hero + features + pricing |
| `mobile_onboarding` | Pantallas de onboarding mobile portrait |
| `dashboard` | Dashboards con sidebar + KPIs + gráficas |
| `pricing_table` | Tablas de precios de 3 tiers |
| `custom` | Descripción libre, sin formato predefinido |

### Parámetros recomendados por caso

| Caso | `aspect_ratio` | `resolution` | `template` |
|---|---|---|---|
| Web desktop | `16:9` | `2K` | `landing_b2b` / `dashboard` |
| Mobile app | `9:16` | `2K` | `mobile_onboarding` |
| Pricing | `auto` | `2K` | `pricing_table` |
| Concepto libre | `auto` | `1K` | `custom` |

---

## Flujos de trabajo

### Flujo A: "Ideación desde texto → mockup → código"

> Input: descripción textual de una pantalla

**Pasos que Claude sigue:**

1. `generate_ui_mockup` con template apropiado → obtiene URL de imagen
2. (Opcional) `generate_screen_from_text` en Stitch → obtiene estructura de layout
3. Genera código frontend (React/HTML/CSS) basado en el mockup y la estructura Stitch

**Prompt de ejemplo para Claude:**

```
Usa Nano Banana 2 para generar 2 variantes de mockup de una pantalla de pricing
para nuestra landing B2B SaaS (Sisteco). Usa el template 'pricing_table', 3 tiers,
tema oscuro, con el plan Pro destacado. Aspecto 16:9, resolución 2K.
Luego propón el HTML/CSS correspondiente usando nuestro design system
(colores: #111 bg, #c5ed36 accent, Sharp Grotesk font).
```

**Flujo CLI equivalente:**
```
generate_ui_mockup(
  description="Pricing page para Sisteco (agencia B2B SaaS Chile). Tiers: Starter $190k CLP, Pro $390k CLP (destacado), Enterprise custom. Tema oscuro, #111 background, lime green (#c5ed36) accents. Sans-serif moderna.",
  template="pricing_table",
  aspect_ratio="16:9",
  resolution="2K",
  num_images=2
)
```

---

### Flujo B: "Refinamiento de diseño Stitch con variantes Nano Banana 2"

> Input: referencia a pantalla en Stitch

**Pasos:**

1. `list_projects` → identificar project_id
2. `list_screens(project_id)` → listar pantallas disponibles
3. `get_screen(project_id, screen_id)` → leer jerarquía actual
4. `iterate_on_design(original, change_instructions, num_variants=3)` → generar variantes
5. Elegir variante → actualizar código en repo

**Prompt de ejemplo para Claude:**

```
Conecta con Stitch y trae la última pantalla del dashboard de analytics del proyecto "sisteco-landing".
Luego usa Nano Banana 2 para generar 3 variantes de esa pantalla: una en dark mode,
una con layout de 2 columnas, y una con énfasis en el gráfico principal.
Finalmente propón el código React para la variante que mejor se adapte
al design system actual de Sisteco.
```

---

### Flujo C: "Prototipo express landing B2B"

```
Usa Nano Banana 2 para prototipar una landing B2B SaaS con énfasis en credibilidad
y claridad para el mercado chileno. Genera 3 variantes desktop (16:9, 2K).
Para la mejor variante, crea también la versión mobile (9:16).
Luego crea un proyecto en Stitch llamado 'sisteco-v2-prototype',
genera la pantalla hero con generate_screen_from_text usando GEMINI_3_PRO,
y finalmente produce el HTML/CSS implementable para index.html.
```

---

### Flujo D: "Sistema de diseño completo"

```
Genera mockups para las 5 páginas principales de Sisteco:
1. Hero / Landing (template: landing_b2b, 16:9)
2. Dashboard mockup (template: dashboard, 16:9)
3. Pricing (template: pricing_table, auto)
4. Onboarding mobile (template: mobile_onboarding, 9:16)
5. Contacto (template: custom, "página de contacto B2B minimalista con mapa y formulario")

Para cada una: resolution 2K, 1 imagen. Guarda todas localmente (save_locally: true).
Al final resume qué cambios de código propones para reflejar los mockups aprobados.
```

---

## Comandos de referencia rápida

### Registrar Stitch (con clave real)
```bash
claude mcp add stitch -s user \
  --transport http https://stitch.googleapis.com/mcp \
  --header "X-Goog-Api-Key: TU_CLAVE_STITCH"
```

### Registrar Nano Banana 2 (con clave real)
```bash
claude mcp add nanobanana-mcp -s user \
  -e "FAL_KEY=TU_FAL_KEY" \
  -- node "C:/Users/Dell 5520/Documents/AgenticWorkflows/Landing Page/mcp-servers/nanobanana-mcp/index.js"
```

### Ver estado de todos los MCP
```bash
claude mcp list
```

### Actualizar dependencias del servidor local
```bash
cd "C:/Users/Dell 5520/Documents/AgenticWorkflows/Landing Page/mcp-servers/nanobanana-mcp"
npm install
```

---

## Notas importantes

- **Stitch es beta**: La API puede cambiar. El endpoint actual es `https://stitch.googleapis.com/mcp`.
- **Stitch API Key vs OAuth**: Usamos API Key (más simple). Si caduca o se invalida, genera una nueva en https://stitch.withgoogle.com/settings y re-registra con `claude mcp add`.
- **Nano Banana 2 vs Pro**: Usamos `fal-ai/nano-banana-2` (más rápido, Gemini 3.1 Flash). `fal-ai/nano-banana-pro` es la versión Pro con mayor calidad pero más lenta.
- **Mockups guardados**: Con `save_locally: true` se guardan en `./mockups/` en el directorio del proyecto actual.
- **Costos fal.ai**: La generación a 2K es más costosa que 1K. Para exploración inicial usar 1K.
