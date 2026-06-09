# Onboarding — Cristián construye la próxima solución de Sisteco

| | |
|---|---|
| **Para** | Cristián (socio comercial), para **construir la próxima solución de Sisteco** (nueva, desde cero) |
| **Repo** | `github.com/Diper678/Landing-Page` (remoto `origin`) |
| **Local** | `C:\Users\Dell 5520\Documents\AgenticWorkflows\Landing Page\` (la máquina de Felipe) |
| **Stack** | HTML/CSS/JS vanilla · GSAP 3.12.7 · Lucide 0.468.0 · sin frameworks · deploy en Vercel |
| **Autor** | Claude (Felipe dirigió) · 2026-06-08 |

---

## 0. TL;DR

Sisteco es un **paraguas** con varias soluciones. La primera y principal es **LYD** (la solución de leadgen), y es lo que ya vive en este repo. Cristián va a trabajar en **la próxima solución, que es nueva y en blanco**.

Léelo claro: **la solución nueva no es LYD y no hereda nada de LYD.** No usa su mensaje, su nombre ni su encuadre. El ángulo de las "fugas del pipeline", por ejemplo, es **solo de LYD**: no lo arrastres a lo nuevo. Lo que sí se traspasa de un proyecto al otro es el **método** y las **skills** (la forma de trabajar), no el contenido.

Lo primero en serio, antes de construir nada, es **definir bien qué quieres**: para eso arrancas con la skill `grill-me` (§6). El resto de la guía: acceso al repo (§1), cómo editar (§2), el mapa (§3), ramas y PR (§4), tu carpeta de trabajo estilo Jake (§5), cómo construir con nuestras skills (§6) y cómo subir la solución al sitio (§7).

**Regla de oro:** nunca trabajar directo sobre `master`. Siempre en una rama propia y abrir un *Pull Request* (PR). Así Felipe revisa antes de que entre a producción.

---

## 1. Acceso al repo: cuenta de GitHub + conexión con tu Claude

Esto es de una sola vez. Si nunca usaste GitHub, sigue los tres pasos en orden. GitHub es donde vive el código de la web; tu cuenta es tu llave para entrar y proponer cambios. Hazlo una vez y después tú y Felipe pueden trabajar la web cada uno por su lado.

### 1.1 — Crea tu cuenta de GitHub (si no tienes)

1. Entra a `https://github.com/signup`.
2. Pon tu correo (idealmente el de Sisteco), inventa una contraseña y elige un nombre de usuario, ej. `cristian-sisteco`. **Anota usuario y contraseña**: son los que vas a usar siempre.
3. GitHub te manda un código al correo para confirmar. Revisa tu bandeja (y spam), copia el código y pégalo.
4. Cuando te pregunte el plan, elige **Free** (gratis). Listo, ya tienes cuenta.

> ¿Ya tienes cuenta pero no sabes entrar? En `github.com` aprieta **Sign in**. Si olvidaste la clave, "Forgot password" te manda un reset al correo. Pásale tu nombre de usuario a Felipe para el paso 1.2.

### 1.2 — Felipe te invita al repo

1. Felipe entra a `https://github.com/Diper678/Landing-Page` → **Settings → Collaborators → Add people** → escribe tu nombre de usuario de GitHub y te invita.
2. A ti te llega un correo de GitHub con la invitación: ábrelo y aprieta **Accept invitation**. (También aparece entrando a `https://github.com/Diper678/Landing-Page/invitations`.)

Desde acá ya tienes acceso al repo. Falta conectar tu cuenta a tu Claude para trabajar sin fricción.

### 1.3 — Conecta GitHub con tu Claude (en VS Code)

Para que Claude Code pueda traer el repo, guardar cambios y abrir Pull Requests por ti, tu VS Code tiene que estar logueado en GitHub. La forma más simple:

1. En VS Code, abajo a la izquierda, ícono de **Accounts** (la silueta) → **Sign in with GitHub** → se abre el navegador → **Authorize**. Con eso, VS Code (y Claude Code adentro) quedan autenticados con tu cuenta.
2. Trae el repo a tu máquina: en el panel de Claude Code dile "clona el repo `Diper678/Landing-Page` y ábrelo", o usa **Source Control → Clone Repository → `Diper678/Landing-Page`**. (Si prefieres cero terminal: **GitHub Desktop** → File → Clone repository.)
3. Comprueba que quedó: Claude Code debería poder crear una rama y, más tarde, hacer push y abrir un PR (§4) sin pedirte usuario y clave cada vez.

> Con esto listo, tú y Felipe trabajan la web **cada uno por su lado**: cada uno en su rama, sin pisarse, y juntando el trabajo por Pull Request (§4). Tú le hablas a Claude Code en lenguaje natural (Camino C, §2) y él hace los cambios de forma inteligente respetando el branding.

---

## 2. Cómo editar: elige UN camino

Caminos **A** y **B** sirven para editar el repo directo (cambios chicos, casi sin instalar nada). El **Camino C** es tu flujo completo: armas la solución en una **carpeta-taller** aparte (ver §5) y la página que sale de ahí entra al repo por PR (§4). Si ya tienes Claude + VS Code, parte por el C.

### Camino A — Sin instalar nada (recomendado para empezar)

**GitHub en el navegador + Codespaces.** Es VS Code completo dentro del browser, sin instalar Node ni Git.

1. Entra a `https://github.com/Diper678/Landing-Page`.
2. Botón verde **Code → Codespaces → Create codespace on master** (o sobre tu rama).
3. Se abre un editor en el navegador. En la terminal de abajo escribe:
   ```bash
   npm install
   npm start
   ```
4. Codespaces te ofrece abrir el preview en `http://localhost:3000` (puerto reenviado). Ahí ves la web en vivo mientras editas.
5. Para guardar: panel **Source Control** (ícono de ramas) → escribe un mensaje → **Commit** → **Sync/Push**. (Ver §4 para hacerlo sobre una rama, no sobre master.)

> Atajo aún más simple para cambios chicos de texto: en cualquier archivo de GitHub, apreta la tecla **`.`** (punto) y se abre `github.dev`, un editor web liviano. Sirve para editar y commitear texto, pero **no** corre el `npm start` (no ves el preview en vivo).

### Camino B — Local en tu PC (más potencia)

Para una persona comercial, lo más cómodo es **GitHub Desktop** (interfaz gráfica, sin terminal para git):

1. Instala **Node.js LTS** desde `nodejs.org` (incluye `npm`).
2. Instala **GitHub Desktop** desde `desktop.github.com` e inicia sesión.
3. **File → Clone repository →** elige `Diper678/Landing-Page` → Clone.
4. Instala **VS Code** (`code.visualstudio.com`) para editar los archivos.
5. Abre una terminal en la carpeta del repo y corre:
   ```bash
   npm install
   npm start
   ```
   Abre `http://localhost:3000` en el navegador.
6. Editas en VS Code, guardas, y refrescas el navegador para ver el cambio.
7. Para guardar al repo: en GitHub Desktop escribes un resumen y **Commit**, luego **Push** (sobre tu rama, ver §4).

### Camino C — Claude Code dentro de VS Code (tu camino: ya tienes todo)

Ya tienes **Claude** (suscripción) + **VS Code**. Con eso corres la **extensión de Claude Code dentro de VS Code**, sin instalar nada más. Es la forma de máxima palanca, la misma que usa Felipe. A diferencia de los Caminos A y B (que editan el repo directo para cambios chicos), acá trabajas en tu propia **carpeta-taller** y la página que sale de ahí entra al repo por PR.

1. En VS Code: **Extensions** (Ctrl+Shift+X), busca **Claude Code** (Anthropic), **Install**.
2. Abre tu **carpeta de trabajo** (la del §5, "Cómo ordenar la carpeta de la nueva solución"), no el repo público todavía. Ahí vives mientras desarrollas la solución.
3. Inicia sesión con tu cuenta de Claude cuando la extensión lo pida.
4. Le hablas en lenguaje natural en el panel y **él lee y edita tus archivos directo**.

**La regla que más importa (anti-patrón #1 de Jake):** no copies y pegues tus documentos al chat. Eso es "usar un auto para revisar el buzón", desperdicias la herramienta. Dejas los archivos en la carpeta y le dices "lee `_source/transcript-call.md` y resúmeme las objeciones" o "abre `01_research/notas.md` y dame los 3 ángulos más fuertes". Él los abre solo. El contexto se direcciona por **dónde están los archivos**, no por lo que pegues.

**Qué herramienta para qué (no las mezcles):**

| Herramienta | Para qué | Para qué NO |
|---|---|---|
| **Claude Code** (extensión en VS Code) | Código, estructura de carpetas y texto del repo: copy, research escrito, decisiones, HTML/CSS de la página final. Todo lo que se versiona. | Generar imágenes o mockups visuales pesados. |
| **Antigravity** (IDE de Google, corre con Gemini) | Trabajo pesado **no-código**: visuales, mockups, exploración de diseño, variantes de layout, bocetos. | Editar el código del repo o decidir copy on-brand (eso es Claude Code). |

La idea: **Claude Code construye qué dice y cómo se estructura; Antigravity te ayuda a ver cómo se ve** antes de pasarlo a HTML. Lo visual que sirva baja a `03_diseno/` (ver §5) y de ahí Claude Code la convierte en página.

---

## 3. Mapa del repo (lo que importa)

```
index.html                  ← HOME = la página de LYD (la solución de leadgen). NO es genérica.
style.css                   ← estilos del home (sistema "clásico", hero con globo animado)
css/pages.css               ← estilos de subpáginas
css/home-2026.css           ← sistema "rh-" (subpáginas reposicionadas: precios, soluciones, como-funciona)
js/main.js                  ← lógica del home (animaciones, formulario)
js/globe.js                 ← el globo animado del hero
pages/
  soluciones.html           ← HUB GENERAL de Sisteco. Acá viven las cards de soluciones
                              (LYD "Disponible" + dos "En desarrollo"). AQUÍ entra la nueva solución.
  como-funciona.html        ← "Cómo trabaja LYD por dentro" (contenido de LYD)
  precios.html              ← "El precio de LYD" (planes a medida)
  vision.html               ← nivel Sisteco (general)
  sobre-nosotros.html       ← nivel Sisteco (general)
  contacto.html             ← general
  recursos/                 ← blog/recursos (general)
  soluciones/*.html         ← sub-páginas SEO de LYD (lead scoring, prospección, compliance)
docs/                       ← specs, research, planes y handoffs (este archivo)
api/  convex/               ← BACKEND. NO TOCAR (formularios, pagos). No es parte del trabajo de contenido.
```

**Sisteco = paraguas · LYD = solución de leadgen.** Todo lo específico de ventas/leadgen es de **LYD**. Las páginas generales (vision, sobre-nosotros, contacto, recursos) hablan a nivel **Sisteco**, para que quepan las soluciones nuevas.

---

## 4. Cómo trabajar sin romper nada (ramas + PR)

**Nunca** edites `master` directo. Flujo:

1. Crea una rama con tu nombre y la solución, ej: `cristian/solucion-x`.
   - En GitHub Desktop: **Current Branch → New Branch**.
   - En terminal: `git checkout -b cristian/solucion-x`
2. Haz tus cambios y commitea con mensajes claros.
3. **Push** de tu rama.
4. En GitHub: **Pull requests → New pull request** desde tu rama hacia `master`. Felipe revisa y aprueba.
5. Si Vercel está conectado al repo, cada PR genera una **URL de preview** automática para mirar el cambio antes de mergear. Si no, Felipe lo previsualiza local y deploya con `npx vercel --prod`.

> Producción (`sisteco.cl`) sale de `master`. Mientras tu trabajo viva en tu rama, **no afecta el sitio en vivo**. Tranquilo para experimentar.

---

## 5. Cómo ordenar la carpeta de la nueva solución (forma Jake)

Antes de escribir una línea de la página final, ordena tu **carpeta de trabajo** al estilo **Jake ICM** (Interpretable Context Methodology), el mismo método Jake que Sisteco ya usa en su repo principal. No es burocracia: es lo que hace que Claude Code trabaje bien sin que andes pegando archivos al chat.

### El principio: la carpeta es la app

**"The folder is the app."** El contexto de la IA se direcciona por **dónde están físicamente los archivos**, no por búsqueda. Cuando Claude Code (o Gemini en Antigravity) entra a una carpeta, carga su contexto; cuando sale, lo descarga. Por eso organizas por **modo de trabajo** (lo que estás haciendo *ahora*: investigar, escribir, diseñar, producir) y no por tema. En fase temprana de una solución casi todo es research, copy y diseño; el código viene al final.

### Folder map (tu carpeta de trabajo, NO el repo público)

```
solucion-<nombre>/
├── 01_research/        → research del problema, mercado, competencia, intel del cliente
├── 02_copy/            → mensaje, titulares, propuesta de valor, textos de la página
├── 03_diseno/          → mockups, visuales y variantes de layout (aquí vive Antigravity/Gemini)
├── 04_produccion/      → el HTML/CSS final, listo para llevarlo al repo Landing-Page
├── _source/            → material crudo SIN procesar (transcripts, PDFs, audio, notas, capturas)
├── _brand/             → voz Felipe, identidad visual, reglas de marca (copia o link al canónico)
├── _operations/        → estado, decisiones, pendientes, handoffs
├── _archive/           → versiones viejas; no tocar sin razón
├── CLAUDE.md           → router mínimo (~50 líneas): folder map + reglas duras + qué hay en cada carpeta
└── GEMINI.md           → espejo exacto de CLAUDE.md (lo que lee Antigravity)
```

- **Carpetas numeradas (`01_`, `02_`...)** = los modos en los que trabajas activamente, en orden natural: primero investigas, luego escribes el mensaje, luego lo ves, luego lo produces.
- **Carpetas con guion bajo (`_brand`, `_operations`, `_source`, `_archive`)** = material compartido o meta, que cruza todos los modos.
- Los **nombres** se adaptan al trabajo de una página (research → copy → diseño → producción). Lo que copias del repo principal es el **principio** (carpeta = modo de trabajo), no los nombres literales: allá son otros, porque ese repo opera la empresa entera, no una sola página.

### `context.md` por workspace

Cada **workspace** (cada carpeta de trabajo, numeradas y de guion bajo donde aplique) lleva su propio **`context.md`** con las reglas locales de ese modo, y Claude Code (o Gemini) **debe leerlo al entrar**. Ejemplo: `02_copy/context.md` dice "voz Felipe es-CL, sin floritura, LYD es nombre propio, nunca inventar métricas"; `_brand/context.md` guarda la voz canónica. Así las reglas viven donde se aplican, no amontonadas en la raíz.

### Tres capas de skills

Jake separa las *skills* (instrucciones reutilizables que la IA puede invocar) en tres capas, y te conviene copiar la idea:

- **Global** (`~/.claude/skills/`): sirven a todos tus proyectos. Acá van las que siempre aplican: voz Felipe, reglas de marca Sisteco, convertir material con markitdown.
- **De workspace**: viven dentro de una carpeta de modo y solo aplican ahí. Ej.: una skill de "estructura SEO de página" dentro de `04_produccion/`.
- **Raíz vacía**: la raíz del proyecto no lleva skills propias a propósito, para forzar que la IA *entre* a un modo (una carpeta) antes de actuar, en vez de operar en el aire.

### `CLAUDE.md` router + `GEMINI.md` espejo

- En la **raíz** va un `CLAUDE.md` corto (~50 líneas): el folder map, las reglas duras de Sisteco y una línea por carpeta diciendo qué hay adentro. Nada más. Sirve para que la IA no escanee toda la carpeta y queme tokens antes de empezar: entra, lee 50 líneas, y ya sabe a qué carpeta ir.
- **Mantén `GEMINI.md` idéntico a `CLAUDE.md`** (cópialo tal cual cada vez que edites uno). En nuestro caso importa el doble: **Antigravity corre con Gemini, y Gemini lee `GEMINI.md`, no `CLAUDE.md`**. Si los dos no dicen lo mismo, Claude Code y Antigravity trabajan con reglas distintas y terminas con copy de una voz y diseño de otra.
- Durante una sesión puedes meter notas temporales en `CLAUDE.md` (TODOs, decisiones en curso) y limpiarlas al cerrar, para no ensuciar el archivo base.

### Material crudo → `_source/` y pasar por markitdown

Todo lo que llega de afuera (la transcripción de una call, un PDF de la competencia, notas de una reunión, un audio) entra primero a **`_source/`** antes de procesarlo. Regla general de Sisteco: el material entrante pasa por **markitdown** (lo convierte a Markdown) antes de que Claude Code lo lea, así trabajas siempre sobre texto limpio. Si no tienes markitdown a mano, deja el crudo en `_source/` igual y pídele a Claude Code que lo convierta, o que Felipe lo procese.

### Qué NO hacer (anti-patrones de Jake)

- **No copies y pegues tus archivos al chat.** Deja que Claude Code los lea desde la carpeta. Pegar es "usar un auto para revisar el buzón": tienes la herramienta buena y la desperdicias.
- **No armes frameworks multi-agente rígidos** (LangChain, CrewAI y compañía) para esto. Tu "framework" son carpetas + archivos Markdown. Más simple y rinde más.
- **No automatices el criterio.** Automatiza lo tedioso y repetitivo (limpiar texto, ordenar research, generar variantes); la decisión estratégica (qué mensaje, qué posicionamiento, qué se ve bien) la tomas tú. Esa es tu pega y tu valor.

### Y al final, la página entra al repo

Tu carpeta de trabajo es el taller. Cuando la página esté lista en `04_produccion/`, súmala al sitio con la **receta del §7**: rama `cristian/<solucion>` + Pull Request, Felipe revisa. Nunca push directo a `master`. El taller es tuyo; la vitrina (`sisteco.cl`) sale de `master` y pasa por revisión.

---

## 6. Cómo construir la solución: define primero, arma después (las skills que usamos)

> **Esto va ANTES de ejecutar cualquier plan.** Antes de tocar HTML, antes de pedirle a la IA que construya nada. La solución está en blanco, así que el primer trabajo no es escribir código: es **definir súper bien qué quieres construir y la idea detrás**. Estas son las mismas skills con las que armamos la landing, en el orden en que las usamos.

Una *skill* es una instrucción reutilizable que la IA invoca: un `SKILL.md` chico que le dice cómo comportarse para una tarea. Las nuestras viven en la máquina de Felipe, en `~/.claude/skills/`. Para usarlas en la tuya, instálalas (ver la nota al final de esta sección).

### Paso 1 — `grill-me`: que la IA te interrogue hasta que la idea quede clara

Antes de cualquier plan, corre **`grill-me`**. Es una skill cortita: hace que Claude Code te entreviste sin piedad sobre lo que quieres construir, una pregunta a la vez, recomendándote una respuesta en cada una, hasta que los dos entiendan lo mismo. Sirve justo para esto: una solución en blanco donde todavía no está claro el mensaje, el público ni el alcance.

Como es tan corta y la quiero sí o sí desde el día uno, va escrita textual acá. Instálala en `.claude/skills/grill-me/SKILL.md` y **córrela primero**, antes de hacer un plan o tocar archivos.

> **`grill-me/SKILL.md` (traducido a es-CL, fiel al original):**
>
> Interrógame sin piedad sobre cada aspecto de este plan hasta que lleguemos a un entendimiento compartido. Recorre cada rama del árbol de diseño, resolviendo una por una las dependencias entre decisiones. Para cada pregunta, dame tu respuesta recomendada.
>
> Haz las preguntas de a una.
>
> Si una pregunta se puede contestar explorando el código, explóralo en vez de preguntar.

En la práctica: abres Claude Code en tu carpeta de trabajo, le dices "grill me sobre la solución que quiero construir" y dejas que te lleve por el árbol de decisiones (qué problema resuelve, para quién, qué hace y qué no hace, cómo se llama, cómo se ve el éxito). Responde de a una. Si algo se contesta mirando el material que ya tienes en `_source/`, que lo mire en vez de preguntarte. Sales de este paso con la idea clara, no con una corazonada.

### Paso 2 — `write-a-prd`: baja lo conversado a un documento

Cuando `grill-me` ya dejó la idea firme, corre **`write-a-prd`** para congelarla. Esta skill toma tu brief, explora el material, te vuelve a interrogar si algo quedó flojo (mismo espíritu que `grill-me`), boceta los módulos y escribe un **PRD** (documento de requisitos del producto). Estructura que produce: *Problem Statement* (problema), *Solution* (solución), *User Stories* (historias de usuario), *Implementation Decisions* (decisiones de implementación), *Testing Decisions* (cómo se valida), *Out of Scope* (lo que queda fuera) y *Further Notes*.

Esto separa "tengo una idea" de "sé exactamente qué voy a construir". **La skill escribe el archivo en `issues/prd.md`** (crea la carpeta `issues/` si no existe; no manda nada a GitHub). Si lo quieres dentro de tu estructura Jake, muévelo a mano después a `01_research/prd.md`. Existe `prd-to-issues` como complemento, que parte el PRD en tareas concretas si lo necesitas.

### Paso 3 — `ui-ux-pro-max` + `frontend-design`: el diseño

Para el diseño usamos dos skills, y van juntas:

- **`ui-ux-pro-max`** — inteligencia de diseño dentro de Claude Code: 67 estilos (glassmorphism, claymorphism, minimalism, brutalism, bento grid, dark mode...), 96 paletas, 57 pares de fuentes, 25 tipos de gráficos, 13 stacks. Es la que usamos para la landing: el **Bento Grid** de "Cómo Funciona" (card hero 2x2 + 4 cards 1x1, fondo oscuro `#111`, stagger con GSAP), el **Floating Navbar** estilo AmpleMarket (`.navbar.scrolled` con `max-width` 900px y `border-radius` 50px) y las **animaciones de fondo** estilo Firecrawl (gradient orbs, fadeInUp con GSAP ScrollTrigger, glow al hover, cursor glow). Se activa con `/ui-ux-pro-max` o mencionándola. **OJO: no trae la marca sola.** Cuando la uses para Sisteco tienes que pasarle el bloque de paleta como contexto; su `SKILL.md` lo trae listo para copiar, pero ese bloque tiene **fuentes desactualizadas** (dice "Sharp Grotesk / Source Sans 3"): la fuente de verdad es el `CLAUDE.md` del proyecto y el §8 (self-host: Space Grotesk para títulos, Hanken Grotesk para cuerpo). Copia los colores, no las fuentes.
- **`frontend-design`** — para interfaces distintivas y listas para producción, que evitan el look genérico de IA (el "AI slop"). Aporta composición espacial, jerarquía visual y motion de alto impacto (un page-load orquestado pesa más que micro-interacciones sueltas).

> **La identidad visual de Sisteco es FIJA.** `frontend-design` dice cosas como "nunca converjas en Space Grotesk, varía fuentes y temas". **Eso aplica a piezas sin identidad de marca, no a Sisteco.** Acá los colores y las fuentes están definidos y no se tocan (ver §8). Estas dos skills te aportan **layout, composición, jerarquía y motion**, no una paleta ni fuentes nuevas. Lo visual que explores baja a `03_diseno/` (§5) y de ahí Claude Code lo convierte en página.

### Paso 4 — `humanizer`: el copy en voz Felipe

Para el texto usamos **`humanizer`** (ya en uso en el repo). Saca los patrones típicos de escritura de IA y deja la **voz Felipe (es-CL)**: directa, sin floritura, sin anglicismos, em-dashes cambiados por comas o paréntesis, y nunca inventando datos. Cada vez que generes copy (titulares, párrafos, CTAs), pásalo por `humanizer` antes de darlo por bueno. Las reglas de voz están en §8.

### Paso 5 — construir con el método (sobre la estructura Jake del §5)

Con la idea definida (`grill-me`), el PRD escrito (`write-a-prd`), el diseño encuadrado (`ui-ux-pro-max` + `frontend-design`) y el copy en voz (`humanizer`), recién ahí se construye. El método viene del set **superpowers**:

1. **`brainstorming`** — explora la intención y los requisitos antes de implementar nada. El "pensemos bien antes de tocar código".
2. **`writing-plans`** — cuando ya hay un spec, escribe un plan de varios pasos antes de tocar el código.
3. **Ejecutar por tareas** — `executing-plans` / `subagent-driven-development` bajan el plan a tareas y las ejecutan una por una, con verificación, y `tdd` si la pieza lo amerita.

Todo esto vive dentro de tu **carpeta de trabajo estilo Jake** (§5): research → copy → diseño → producción, con `CLAUDE.md` de router y `GEMINI.md` espejo. La regla de oro del método: **automatizas lo tedioso, pero el criterio (qué mensaje, qué posicionamiento, qué se ve bien) lo decides tú.**

### Resumen: todo lo que usamos para crear el landing

| Skill | Para qué | Cuándo la usas |
|---|---|---|
| **`grill-me`** | Que la IA te interrogue hasta que la idea quede clara | **Primero de todo**, antes de cualquier plan |
| **`write-a-prd`** | Bajar la idea a un PRD escrito (problema/solución/alcance) | Apenas `grill-me` cierra la idea |
| **`ui-ux-pro-max`** | Layout, estilos, paletas, motion (Bento, Floating Navbar, fondos) | Al diseñar la página (identidad Sisteco fija) |
| **`frontend-design`** | Composición, jerarquía y motion sin "AI slop" | Junto con `ui-ux-pro-max`, en diseño |
| **`humanizer`** | Dejar el copy en voz Felipe es-CL, sin datos inventados | Cada vez que escribes o revisas texto |
| **`superpowers`** (`brainstorming`, `writing-plans`, `subagent-driven-development`, `tdd`) | El método: definir → planificar → ejecutar por tareas con verificación | Al construir, después de definir y diseñar |

> **Cómo instalar las skills:** viven en `~/.claude/skills/` de la máquina de Felipe. Para tenerlas en la tuya, copia las carpetas que quieras (cada una es un `SKILL.md` dentro de su propio directorio) a tu `.claude/skills/`, o pídeselas a Felipe. `grill-me` la tienes textual arriba: pégala en `.claude/skills/grill-me/SKILL.md` y listo. El resto (`ui-ux-pro-max`, `frontend-design`, `write-a-prd`, `humanizer`, `superpowers`) son carpetas; cópialas tal cual.

---

## 7. Receta — agregar la PRÓXIMA solución de Sisteco

Cuando la solución nueva tenga nombre y mensaje:

1. **Activa su card en el hub.** En `pages/soluciones.html`, reemplaza una de las dos cards `"Próxima solución / En desarrollo"` por una card activa (copia la estructura de la card de **LYD**: ícono, título, badge "Disponible", descripción y los links). Cambia el `opacity:.5` por card normal.
2. **Crea su página.** Lo más rápido: duplica `pages/como-funciona.html` o `pages/precios.html` (ya usan el sistema `rh-` y traen nav + footer + estilos listos), renómbrala (ej. `pages/<nueva-solucion>.html`) y reemplaza el contenido. Mantén el `<head>` (title/meta/OG) actualizado al nombre nuevo.
3. **Enlázala** desde la card del hub y, si corresponde, desde el footer (columna "Producto").
4. **Respeta el branding** (§8). No inventes métricas ni testimonios.
5. Rama → PR → Felipe revisa.

> **Nota:** reutilizar el armazón del sitio (nav, footer, cards, estilos `rh-`) al maquetar es por **coherencia visual del sitio**, no porque la solución copie a LYD. El mensaje, el nombre y el diseño de la solución son **propios**: defínelos desde cero con el flujo de skills del §6 (no heredes el encuadre de LYD).

> Si no quieres tocar HTML, escribe el mensaje de la solución en un doc (Notion/Markdown) y que Felipe o Claude Code la maqueten. Tu valor acá es el **contenido y el posicionamiento comercial**, no el código.

---

## 8. Reglas de marca y contenido (para escribir on-brand)

- **Voz Felipe (es-CL):** directa, sin floritura, sin anglicismos ni clichés corporativos. Nada de "solución end-to-end", "sinergia", "disrumpir".
- **LYD** se escribe así, como nombre propio. Es "lead" estilizado (la **Y** mayúscula es un embudo). **No es sigla, no se explica qué significan las letras.**
- **Nunca inventar** métricas, testimonios ni estadísticas.
- **Siempre "Ley 21.719"** (no solo "GDPR") en contexto de privacidad.
- **Contacto Chile:** contacto@sisteco.cl · +56 9 40065566 · Av. Alonso de Córdova 5870 Of. 413, Las Condes, Santiago.
- **Identidad visual (no cambiar):** fondo `#F8F7F5` · texto `#111` · acento lima `#c5ed36` · hover `#b3d82f` · borde `#e5e5e5`. Tipografías self-host (no Google Fonts CDN, por Ley 21.719). Íconos Lucide 0.468.0.
- **CTA único:** "Agenda una reunión" → `https://cal.com/sisteco/ventas` (+ WhatsApp `wa.me/56940065566` + `mailto:contacto@sisteco.cl`).

---

## 9. Qué NO tocar

- `api/` y `convex/` (backend: formularios, pagos). 
- `style.css` / `js/globe.js` del home sin acordar con Felipe (el hero animado es delicado).
- `master` directo. Deploy a producción lo hace Felipe.

---

## 10. Dudas

Felipe (`felipe.martinez@sisteco.cl`). Para contexto profundo del proyecto está el vault de Obsidian (`Documents/Obsidian/Sisteco/`) y `docs/` en el repo.
