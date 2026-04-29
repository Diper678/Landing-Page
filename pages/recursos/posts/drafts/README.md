# Drafts folder — Newsletter semanal Sisteco

Aquí viven los drafts generados por `/newsletter-viernes`.
Claude **nunca** publica automáticamente. Felipe revisa, edita y mueve.

## Flujo de publicación manual

Cuando un draft esté listo para publicar:

1. **Revisar el HTML** del draft en `drafts/YYYY-MM-DD-<slug>.html`
2. **Editar** lo que necesite (Felipe ajusta la voz, agrega ejemplos, etc.)
3. **Mover** el archivo de `drafts/` a `pages/recursos/posts/`:
   ```bash
   mv drafts/YYYY-MM-DD-<slug>.html ./
   ```
4. **Agregar una entrada** a `pages/recursos/api/posts.json` con el nuevo post:
   ```json
   {
     "slug": "<slug>",
     "url": "/recursos/posts/<slug>",
     "category": "...",
     "title": "...",
     "excerpt": "...",
     "author": "Felipe Martínez",
     "date": "YYYY-MM-DD",
     "readingTime": "X min",
     "cover": "/assets/og-image.png",
     "featured": false
   }
   ```
5. **Agregar al `sitemap.xml`:**
   ```xml
   <url>
     <loc>https://sisteco.cl/recursos/posts/<slug></loc>
     <lastmod>YYYY-MM-DD</lastmod>
     <changefreq>monthly</changefreq>
     <priority>0.7</priority>
   </url>
   ```
6. **Agregar al `llms.txt`** (sección Documentation) una línea con título + 1 sumario de 2 líneas.
7. **Marcar como publicado** en `docs/newsletter/topics-backlog.md` moviendo la entrada de "Cola activa" a "Publicados".
8. **Limpiar** el draft raw (`.md`) si ya no es necesario, o dejarlo como archivo histórico.
9. **Deploy:** `npx vercel --prod`

## Descartar un draft

Si Felipe decide que un tema no sirve:

1. Mover `drafts/YYYY-MM-DD-<slug>.html` y `-raw.md` a `drafts/_discarded/`
2. Actualizar el backlog con nota del descarte y razón
