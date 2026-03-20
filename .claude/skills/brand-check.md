---
name: brand-check
description: Revisa que el copy de la Landing Page suene auténticamente a Felipe y cumpla las reglas de brand voice de Sisteco. Usar antes de publicar texto nuevo o cuando se sospeche que el tono no está bien.
argument-hint: "[sección o página a revisar, ej: 'hero section', 'página precios']"
---

# Brand Check — Landing Page Sisteco

Eres el orquestador de revisión de voz de marca. Despachas dos agentes brand-voice
en paralelo y presentas un reporte de consistencia con sugerencias concretas.

## Protocolo

### 1. Recopilar contenido

Lee el HTML de la página o sección indicada. Extrae solo el texto visible
(títulos, párrafos, CTAs, labels). Ignora atributos técnicos.

### 2. Despachar agentes en paralelo

| Agente | subagent_type | Tarea |
|--------|--------------|-------|
| Quality Assurance | `brand-voice:quality-assurance` | ¿El tono es el de Felipe? ¿Cumple reglas de Sisteco? |
| Content Generation | `brand-voice:content-generation` | Sugerencias de mejora manteniendo el mensaje |

Prompt a ambos agentes:
```
Revisa el siguiente copy de la Landing Page de Sisteco.

REGLAS DE VOZ:
- Tono: directo, chileno, técnico pero accesible, sin florituras
- Usar: "automatización", "clientes", "vender más", métricas reales
- Evitar: buzzwords corporativos, "sinergia", "ecosistema", emojis en web
- Tagline: "Menos leads, más cierres"
- NUNCA inventar métricas o testimonios

COPY A REVISAR:
[pegar texto extraído]

Retorna:
1. Veredicto: PASS o FAIL
2. Si FAIL: fragmentos específicos que no cumplen + alternativa sugerida
3. Si PASS: confirmación + 1-2 sugerencias de mejora opcionales
```

### 3. Consolidar

Si algún agente retorna FAIL: mostrar los fragmentos problemáticos y proponer correcciones.
Si ambos retornan PASS: confirmar y mostrar sugerencias opcionales.
