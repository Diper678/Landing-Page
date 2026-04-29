# GEMINI.md — Landing Page Sisteco

## Contexto
Landing page pública de Sisteco. HTML/CSS/JS vanilla + Vercel.

## Stack
- HTML/CSS/JS vanilla (sin frameworks)
- GSAP 3.12.7 + Lucide 0.468.0
- Deploy: `npx vercel --prod`
- Dev local: `npm start` → http://localhost:3000
- Páginas: index, soluciones, cómo-funciona, precios, visión, sobre-nosotros, privacidad, términos

## Identidad Visual (nunca cambiar sin razón)
| Elemento | Valor |
|----------|-------|
| Fondo | #F8F7F5 | Texto | #111111 | Acento | #c5ed36 (lime) |
| Font heading | Sharp Grotesk | Font body | Source Sans 3 |
| Font logo | Nasalization (SOLO wordmark "Sisteco") |
| Iconos | Lucide 0.468.0 |

## Reglas
- NUNCA inventar testimonios, métricas o estadísticas
- NUNCA mencionar Claude/Gemini/Kimi en frontend público
- SIEMPRE "Ley 21.719" en contexto Chile
- Responsive mobile-first
- NO frameworks CSS (NO Tailwind, NO Bootstrap)
- NO React, NO Vue — vanilla JS
