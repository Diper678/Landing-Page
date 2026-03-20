# CLAUDE.md — Landing Page Sisteco

## Contexto
Landing page pública de Sisteco. HTML/CSS/JS vanilla + Vercel.
Ver `sisteco-knowledge/CLAUDE.md` en el proyecto central para reglas generales de la empresa.

## Stack
- HTML/CSS/JS vanilla (sin frameworks)
- GSAP 3.12.7 + Lucide 0.468.0
- Deploy: `npx vercel --prod`
- Dev local: `npm start` → http://localhost:3000
- Páginas: index, soluciones, cómo-funciona, precios, visión, sobre-nosotros, privacidad, términos, cookies, gdpr, success

## Auto-Invocación de Agentes (OBLIGATORIO)

Claude invoca estos agentes automáticamente — sin que el usuario lo pida:

| Situación | Agentes a invocar |
|-----------|------------------|
| Escribir o editar copy web (títulos, párrafos, CTAs) | `brand-voice:content-generation` + `seo-keyword-strategist` |
| Terminar de editar un archivo `.html` | `seo-meta-optimizer` (revisar meta tags de esa página) |
| Crear una página nueva | `seo-structure-architect` + `seo-meta-optimizer` |
| Generar o revisar texto de email de marketing | `brand-voice:conversation-analysis` |

**Invocar como subagentes con el Agent tool** usando los `subagent_type` exactos:
- `brand-voice:content-generation`
- `brand-voice:conversation-analysis`
- `seo-technical-optimization:seo-keyword-strategist`
- `seo-technical-optimization:seo-meta-optimizer`
- `seo-technical-optimization:seo-structure-architect`

## Slash Commands Disponibles

- `/seo-audit` — Auditoría SEO completa (7 agentes en paralelo)
- `/brand-check` — Revisión de voz Felipe en copy web
- `/deploy-qa` — Pipeline de calidad pre-deploy (bloquea si hay issues críticos)

## Reglas de Contenido

- NUNCA inventar testimonios, métricas o estadísticas
- SIEMPRE usar "Ley 21.719" (no solo "GDPR")
- SIEMPRE contacto Chile: contacto@sisteco.cl · +56 9 40065566 · Las Condes
- Métricas verificadas: 5-7x conversiones, 21x respondiendo <5min, 78% primer vendedor, 391% ROI

## Identidad Visual (no cambiar)

```
Fondo:        #F8F7F5 (warm white)
Texto:        #111111
Acento:       #c5ed36 (lime)
Hover:        #b3d82f
Borde:        #e5e5e5
Font heading: Sharp Grotesk
Font body:    Source Sans 3
Font logo:    Nasalization (SOLO wordmark "Sisteco")
Iconos:       Lucide 0.468.0
```
