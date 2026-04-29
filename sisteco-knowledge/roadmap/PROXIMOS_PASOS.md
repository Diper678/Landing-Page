# Sisteco — Proximos Pasos y Roadmap

> Guia de que hacer primero al retomar el proyecto en una nueva sesion o proyecto.

---

## Accion mas urgente: Habilitar cobros

### Ruta A — Quick Start SIN entidad legal (1 dia)

Reveniu permite cobrar en Chile sin RUT empresa:

```
1. Ir a reveniu.com y crear cuenta Starter (gratis)
2. Crear 3 planes:
   - Plan Inicio Mensual: CLP 369,000/mes
   - Plan Crecimiento Mensual: CLP 741,000/mes
   - Plan Enterprise: Cotizacion
3. Obtener los links de pago de cada plan
4. Agregar al .env:
   REVENIU_LINK_BASE_MONTHLY=https://app.reveniu.com/checkout/xxx
   REVENIU_LINK_GROWTH_MONTHLY=https://app.reveniu.com/checkout/xxx
5. Actualizar pages/precios.html para que los botones usen esos links
6. Deploy: npx vercel --prod
```

**Tiempo estimado:** 1-2 horas
**Resultado:** Primeros clientes pueden pagar hoy mismo

### Ruta B — API Completa CON entidad legal (1-2 semanas)

```
1. Crear entidad legal (SpA recomendada):
   - Ir a portal.sii.cl
   - Registro en linea: ~24-48h, costo minimo
2. Abrir cuenta corriente empresarial (BCI/Banco Chile)
3. Crear cuenta dLocal Go en dlocalgo.com
4. Completar KYC (documentos empresa)
5. Obtener API keys de produccion
6. Implementar Phase 3 del milestone
```

---

## Roadmap por trimestre

### Q1 2026 (actual)
- [x] Landing page completa con todas las mejoras
- [x] Backend con Convex + Clerk
- [ ] **Primeros 3-5 clientes fundadores** (30-40% descuento)
- [ ] Setup de cobro (Reveniu quick-start)

### Q2 2026
- [ ] Entidad legal (SpA)
- [ ] dLocal Go API completa
- [ ] Facturacion DTE con Bsale
- [ ] Portal de cliente (login con Clerk, ver plan)
- [ ] 10-15 clientes activos

### Q3 2026
- [ ] Plan Crecimiento como plan estrella dominante
- [ ] Casos de estudio de clientes fundadores
- [ ] Testimonios reales en la landing
- [ ] Social proof: metricas reales de clientes
- [ ] Preparacion expansion LATAM (Colombia, Peru)
- [ ] MRR objetivo: USD 10,000-15,000

### Q4 2026
- [ ] Expansion LATAM: Colombia primero
- [ ] Partners locales por pais
- [ ] Dashboard de cliente self-service
- [ ] API publica para integraciones personalizadas
- [ ] MRR objetivo: USD 15,000-25,000

---

## Mejoras de landing page pendientes (Phase 3)

| Mejora | Esfuerzo | Impacto | Prioridad |
|---|---|---|---|
| Social proof / resultados reales | 2h | Medio | P3 |
| Hero animation (dashboard en vivo) | 4h | Medio | P3 |
| CTA con form inline (Apollo-style) | 2h | Medio | P3 |
| Limpiar brand SVGs no usados | 0.5h | Bajo | Baja |

---

## Para iniciar una nueva sesion de trabajo

### Cheklist de inicio de sesion

```
1. Leer MEMORY.md del proyecto (ya cargado en contexto)
2. /gsd:resume-work  → ver estado de la sesion anterior
3. /gsd:progress     → ver donde estamos en el roadmap
4. npm start         → levantar servidor local (http://localhost:3000)
5. Empezar con la tarea pendiente mas urgente
```

### Si es un proyecto nuevo basado en Sisteco

```
1. Copiar sisteco-knowledge/ al nuevo proyecto
2. Instruir a Claude Code: "Lee sisteco-knowledge/README.md primero"
3. /gsd:new-project → inicializar GSD con contexto de Sisteco
4. Definir el objetivo especifico del nuevo proyecto
```

---

## Contexto para nuevos proyectos de Sisteco

### Premisas invariables

1. **Identidad:** Somos B2B Sales Infrastructure, no una herramienta puntual
2. **Mercado primario:** Chile (empresas 50-500 empleados) → LATAM expansion
3. **Precio de entrada:** USD 397/mes (Plan Inicio) — nunca bajar de este nivel
4. **Stack:** Convex + Clerk + n8n self-hosted + Vercel + Claude Sonnet
5. **Legal:** Siempre mencionar cumplimiento Ley 21.719 en comunicaciones Chile
6. **Vision:** Workflows-first — ser la capa de datos B2B de Chile (SII, RUT, Ley 21.719) usando plataformas de IA existentes, no construyendo agentes propios

### Valores de diseno invariables

1. **Paleta:** #F8F7F5 / #111111 / #c5ed36 — nunca cambiar sin razon fuerte
2. **Fuente logo:** Nasalization para "Sisteco" unicamente
3. **Fuente headings:** Sharp Grotesk
4. **Iconos:** Lucide 0.468.0 via CDN
5. **Fondo:** animated-bg + grid-pattern-overlay siempre presentes

### Mensajes prohibidos

```
NO usar:  "Solución innovadora de vanguardia"
NO usar:  Testimonios o metricas inventadas
NO usar:  Referencias a Claude/Gemini/Kimi en el frontend publico
NO usar:  "GDPR" solas — siempre incluir "Ley 21.719"
NO usar:  Informacion de contacto de Espana (era la version anterior)
```

---

*Roadmap basado en el estado del proyecto a 2026-03-04. Actualizar segun avance real.*
