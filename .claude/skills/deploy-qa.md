---
name: deploy-qa
description: Pipeline de calidad secuencial antes de hacer deploy a Vercel. Bloquea el deploy si hay issues críticos de SEO o brand voice. Usar siempre antes de ejecutar `npx vercel --prod`.
argument-hint: "[opcional: página específica a revisar]"
---

# Deploy QA — Landing Page Sisteco

Pipeline secuencial de calidad pre-deploy. Si cualquier paso CRÍTICO falla,
imprime STOP y NO se ejecuta `npx vercel --prod`.

## Pipeline

### Paso 1 [CRÍTICO]: Meta Optimizer

Invocar agente `seo-technical-optimization:seo-meta-optimizer` sobre todas las páginas modificadas.

**Umbrales de bloqueo (cualquiera de estos → STOP):**
- Meta title ausente en cualquier página
- Meta description ausente en cualquier página
- H1 duplicado entre páginas
- Meta title > 60 caracteres o < 30 caracteres

**Si pasa:** continuar al Paso 2.
**Si falla:** imprimir:
```
🚨 STOP — Deploy bloqueado por Meta Optimizer
Problemas críticos: [lista]
Corregir y volver a correr /deploy-qa
```

### Paso 2 [CRÍTICO]: Brand Voice QA

Invocar agente `brand-voice:quality-assurance` sobre el copy de páginas modificadas.

**Umbral de bloqueo:** el agente retorna explícitamente `FAIL` (no solo advertencias).

**Si FAIL:** imprimir:
```
🚨 STOP — Deploy bloqueado por Brand Voice QA
Fragmentos problemáticos: [lista]
Corregir con /brand-check y volver a correr /deploy-qa
```

### Paso 3 [REPORTE]: Authority Builder

Invocar agente `seo-analysis-monitoring:seo-authority-builder`.
Solo reporte — no bloquea. Mostrar hallazgos como advertencias.

### Paso 4 [CRÍTICO]: Code Review

Invocar skill `superpowers:code-reviewer` sobre archivos HTML/CSS/JS modificados.

**Umbrales de bloqueo:**
- Links rotos o recursos 404 detectados
- JavaScript con errores de sintaxis
- Imágenes sin atributo `alt`

**Si falla:** imprimir:
```
🚨 STOP — Deploy bloqueado por Code Review
Errores: [lista]
```

### Resultado Final

Si todos los pasos críticos pasan:
```
✅ DEPLOY AUTORIZADO
Todos los checks pasaron. Puedes ejecutar: npx vercel --prod
```

**NUNCA ejecutar `npx vercel --prod` sin autorización explícita del usuario.**
