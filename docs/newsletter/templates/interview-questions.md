# Banco de preguntas de entrevista — Newsletter viernes

> Preguntas que Claude usa para entrevistar a Felipe antes de redactar un post.
> Cada categoría tiene 5 preguntas base + 3 de profundización. Felipe responde
> corto, Claude redacta largo. La entrevista debe tomar <15 min.

## Regla de oro

**No hagas más de 5 preguntas por sesión.** Si Felipe da una respuesta corta que
necesita desarrollo, repregunta sobre esa misma — no agregues más temas.

## Preguntas universales (para cualquier tema)

1. **Posición:** "¿Cuál es tu opinión principal sobre [tema]? Resúmelo en una frase."
2. **Evidencia concreta:** "¿Qué has visto trabajando con clientes que respalde eso?"
3. **Contraste:** "¿Qué dice la industria o tus competidores que tú no compras?"
4. **Aplicación Sisteco:** "¿Cómo esto cambia lo que hace Sisteco?"
5. **Tactical:** "¿Qué debería hacer un gerente de ventas tech este lunes con esta info?"

## Por categoría

### Opinión Felipe

1. ¿Por qué este tema te molesta / te interesa ahora?
2. ¿Cuándo cambiaste de opinión al respecto y por qué?
3. ¿Qué dirían los competidores de esta opinión?
4. ¿Hay datos que te den la razón o solo experiencia?
5. ¿Cómo se lo explicarías a un fundador de startup tech escéptico?

**Profundización:**
- "Dame un ejemplo específico que respalde eso."
- "¿Y qué pasa cuando eso falla?"
- "¿Qué harías diferente si estuvieras empezando hoy?"

### Review GEO (herramienta / stack)

1. ¿Qué hace [herramienta] que ninguna otra hace?
2. ¿Qué parte de su marketing es humo?
3. ¿Cuánto cuesta realmente en un mes real?
4. ¿Para quién NO es la herramienta?
5. ¿Cómo se compara con nuestro stack interno?

**Profundización:**
- "¿Has perdido tiempo con ella? ¿En qué?"
- "Si pudieras mejorarla en una cosa, ¿cuál sería?"

### Caso real (cliente anónimo)

1. ¿Cuál era el problema específico del cliente al empezar?
2. ¿Qué probaron antes que no funcionó?
3. ¿Qué métricas cambiaron y en cuánto tiempo?
4. ¿Qué error cometimos nosotros durante el proyecto?
5. ¿Qué le dirías a otro fundador en esa misma situación?

**Profundización:**
- "¿El cliente nos dejaría compartir esos números?"
- "¿Qué es lo que no funcionaría para otra empresa con ese mismo problema?"

### Técnica (arquitectura, prompt, workflow)

1. ¿Cuál es el insight técnico clave?
2. ¿Qué error típico comete la gente al intentar esto?
3. ¿Cuál es el trade-off que nadie menciona?
4. ¿Cómo sabes que tu implementación funciona?
5. ¿Dónde están los límites? ¿Cuándo se rompe?

**Profundización:**
- "¿Tienes el prompt / el snippet real que podamos mostrar?"
- "¿Cuánto tiempo tomó llegar a esta versión?"

### Chile-específico

1. ¿Por qué este tema importa en Chile particularmente?
2. ¿Qué hacen mal las empresas chilenas al respecto?
3. ¿Qué hace bien alguien en Chile y nadie lo nota?
4. ¿Cómo se compara con lo que ves en LATAM / US?
5. ¿Qué cambio regulatorio o de mercado está forzando esto ahora?

**Profundización:**
- "¿Tienes una fuente oficial (SII, gobierno, Ley 21.719) que respalde eso?"
- "¿Alguna empresa chilena lo está haciendo bien?"

### Contra-tesis (opinión impopular)

1. ¿Cuál es la afirmación consensus que crees que es falsa?
2. ¿Qué evidencia tienes de que el consenso se equivoca?
3. ¿Por qué mucha gente cree lo contrario?
4. ¿Qué pasa si te equivocas?
5. ¿Qué decisión debería cambiar alguien si compra tu contra-tesis?

**Profundización:**
- "¿En qué porcentaje estás seguro de esto (0-100%)?"
- "¿Qué evidencia te haría cambiar de opinión?"

## Flujo de la entrevista

1. **Setup (30 seg):** "Viernes, tema X. ¿Lo tomamos o proponemos otro?"
2. **Confirmación del ángulo (1 min):** "La tesis que veo es Y. ¿Así la ves?"
3. **5 preguntas principales (10 min):** una por vez, Felipe responde corto.
4. **1-2 profundizaciones (3 min):** sobre la respuesta más jugosa.
5. **Wrap (30 seg):** "Listo. Redacto draft y lo dejo en drafts/ con notificación."

## Qué hace Claude DESPUÉS de la entrevista

1. Guarda las respuestas crudas en `pages/recursos/posts/drafts/YYYY-MM-DD-slug-raw.md`
2. Genera draft HTML siguiendo `style-guide.md` y `post-template.html`
3. Corre `brand-voice:quality-assurance` sobre el draft
4. Aplica correcciones si hay issues críticos
5. Notifica a Felipe con:
   - Ruta del archivo
   - Título y tiempo de lectura
   - Resumen del argumento central (2 líneas)
   - Issues del QA (si los hay)
6. **NO publica.** Felipe revisa y mueve manualmente cuando está listo.
