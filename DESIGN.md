---
name: FIARIL Orthopedics
description: Precisión en movimiento. Anatomía de puntos, plano técnico y una superficie nocturna puntual.
colors:
  orbital-navy: "#07253f"
  signal-red: "#b1282f"
  energy-yellow: "#f3b234"
  titanium-grey: "#72767f"
  graphite: "#222222"
  mineral: "#f7f7f7"
  white: "#ffffff"
  ink-muted: "#5b5f67"
  night-muted: "#afb8c0"
typography:
  display:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "clamp(3rem, 1.6rem + 6vw, 7.5rem)"
    fontWeight: 300
    lineHeight: 0.98
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 1.9rem + 3.5vw, 5.25rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 1.7rem + 2vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "'ss01'"
  label:
    fontFamily: "Manrope Variable, system-ui, sans-serif"
    fontSize: "clamp(0.8rem, 0.78rem + 0.1vw, 0.875rem)"
    fontWeight: 600
    letterSpacing: "0.12em"
    fontFeature: "'tnum'"
rounded:
  technical: "2px"
  pill: "999px"
spacing:
  2xs: "0.25rem"
  xs: "0.5rem"
  s: "1rem"
  m: "1.5rem"
  l: "clamp(2rem, 1.5rem + 2.5vw, 3.5rem)"
  xl: "clamp(4rem, 3rem + 5vw, 8rem)"
  2xl: "clamp(6rem, 4rem + 8vw, 12rem)"
  gutter: "clamp(1rem, 0.5rem + 2.5vw, 2.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.orbital-navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0.85em 1.4em"
    height: "44px"
  button-primary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.orbital-navy}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.orbital-navy}"
    rounded: "{rounded.pill}"
    padding: "0.85em 1.4em"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.orbital-navy}"
    textColor: "{colors.white}"
  button-primary-inverse:
    backgroundColor: "{colors.mineral}"
    textColor: "{colors.orbital-navy}"
    rounded: "{rounded.pill}"
    padding: "0.85em 1.4em"
    height: "44px"
---

# Design System: FIARIL Orthopedics

Fuente normativa de los valores: el frontmatter de este archivo y `src/styles/global.css`, que deben coincidir. Contexto de producto, voz y reglas de contenido: `PRODUCT.md`. Historial de decisiones: `docs/DECISIONS.md`.

## Overview

**Creative North Star: "Precisión en movimiento"**

FIARIL se construye con puntos, no se decora con ellos. La identidad combina tres vocabularios con papeles fijos:

- **A · Raster Anatomy, el mundo base.** Superficie mineral clara, tinta navy y halftone como único material gráfico. Las imágenes se forman con partículas cuyo tamaño codifica volumen y luz, igual que una trama de imprenta.
- **C · Plano técnico, el vocabulario.** Cotas, coordenadas, cortes y referencias medidas. Aparece donde el contenido es técnico (Especialidades, Acompañamiento técnico) y siempre transmite datos reales.
- **B · Quirófano nocturno, el momento.** Una superficie navy profunda en la que las partículas se comportan como luz. Es puntual y cinematográfica; nunca es el ambiente general.

La metáfora rectora es la **resolución**: lo disperso converge en estructura. Las partículas nacen en las órbitas del isotipo y se ordenan en anatomía; una onda atraviesa la estructura y la devuelve al equilibrio. El contraste entre elementos quietos y elementos vivos es la esencia del sistema. La mayor parte de la página está en reposo, y por eso se nota lo que se mueve.

Composición editorial asimétrica, alineada a la izquierda, con mucho aire entre capítulos y densidad alta solo dentro de la imagen generativa.

**Rechazos confirmados:** la plantilla de distribuidor médico, la web SaaS genérica, la estética de hospital y la paleta medtech de azules fríos.

**Key Characteristics:**
- Superficie mineral, tinta navy, rojo como señal, amarillo como energía.
- Manrope en todos los niveles; la voz tipográfica es el display ligero a gran tamaño.
- Plano por defecto: líneas finas en lugar de sombras.
- Un solo campo generativo vivo en pantalla a la vez.
- Todo movimiento tiene un equivalente estático.

## Colors

Seis colores de marca extraídos del logo, sin colores ajenos a la identidad. El significado de cada uno se mantiene en interfaz y en arte generativo.

### Primary
- **Orbital Navy** (`orbital-navy`): estructura. Texto, tinta de las partículas asentadas, acciones principales y superficie inversa. Es el color dominante en cualquier pantalla.

### Secondary
- **Signal Red** (`signal-red`): actividad y estado sobre superficie clara. Foco, partícula en tránsito, cresta de onda, sección activa en la navegación. Sobre mineral da 6.1:1, apto para texto.

### Tertiary
- **Energy Yellow** (`energy-yellow`): energía e interacción. Sobre mineral es solo gráfico (1.75:1, nunca texto ni borde funcional). **Sobre navy es el acento** (8.35:1): foco, enlaces y estado activo en superficie inversa.

### Neutral
- **Mineral** (`mineral`): superficie por defecto.
- **White** (`white`): superficie elevada y texto sobre botones navy.
- **Ink Muted** (`ink-muted`): texto secundario sobre mineral (5.98:1). Es titanium oscurecido para tamaños de lectura.
- **Night Muted** (`night-muted`): texto secundario sobre navy (7.76:1); se obtiene como mezcla de mineral al 70 % con navy.
- **Titanium Grey** (`titanium-grey`): nodos, metadatos grandes (≥ 24 px, o 18.66 px en negrita; 4.25:1) y bordes de controles de formulario (≥ 3:1, WCAG 1.4.11).
- **Graphite** (`graphite`): reservado. Es el punto negro del isotipo. Sobre navy da 1.02:1, así que es invisible.
- **Hairline:** navy al 14 % sobre claro y mineral al 18 % sobre navy. Solo para divisores decorativos.

### Contraste verificado (WCAG 2.x)

| Primer plano / fondo | Ratio | Uso permitido |
|---|---|---|
| Navy / mineral | 14.57 | Todo texto |
| Red / mineral | 6.10 | Texto, foco |
| Ink Muted / mineral | 5.98 | Texto secundario |
| Titanium / mineral | 4.25 | Texto grande, bordes de control |
| Yellow / mineral | 1.75 | Solo gráfico |
| Mineral / navy | 14.57 | Todo texto |
| Yellow / navy | 8.35 | Texto, foco, acento |
| Night Muted / navy | 7.76 | Texto secundario |
| Titanium / navy | 3.43 | Solo texto grande |
| Red / navy | 2.39 | Solo gráfico |
| White / red | 6.53 | Texto sobre rojo |

### Named Rules

**The Surface Swap Rule.** El acento depende de la superficie: rojo sobre mineral, amarillo sobre navy. Los componentes nunca eligen el color directamente: usan `--color-accent` y `--color-focus`, que `.surface-inverse` reasigna.

**The Signal Rule.** Rojo significa que algo está ocurriendo (foco, tránsito, cresta, «estás aquí»). No se usa como decoración ni para errores genéricos de marca.

**The Two Inks Rule.** En un mismo componente de interfaz no conviven rojo y amarillo. Solo coinciden en el arte generativo, donde la interferencia es el tema.

## Typography

**Display Font:** Manrope Variable (con system-ui)
**Body Font:** Manrope Variable (con system-ui)

**Character:** una sola familia geométrica y técnica trabajada por contraste de peso y tamaño. El display a peso 300, enorme y con tracking cerrado, da la voz editorial. El texto a 400 aporta claridad. El 600 con cifras tabulares sirve para los datos.

### Hierarchy
- **Display** (300, `--step-5`, 0.98, −0.045em): una sola frase por página, la del hero («La precisión lo cambia todo.»). Clase `.display`.
- **Headline** (600, `--step-4`, 1.08, −0.035em): `h1` de páginas interiores.
- **Title** (600, `--step-3` / `--step-2`): `h2` de capítulo y `h3` de bloque.
- **Body** (400, `--step-0`, 1.6): medida máxima de 62ch; `text-wrap: pretty`.
- **UI** (500, `--step--1`, +0.04em): botones y navegación.
- **Label** (600, `--step--1`, +0.12em, mayúsculas, cifras tabulares): **solo datos técnicos reales**, como referencias, códigos, medidas y coordenadas.

Escala fluida con `clamp()` y sin saltos por breakpoint. Pasos: −1 (0.8–0.875 rem) · 0 (1–1.125) · 1 (1.25–1.5) · 2 (1.6–2.25) · 3 (2.1–3.5) · 4 (2.6–5.25) · 5 (3–7.5).

### Named Rules

**The Data Label Rule.** Las mayúsculas espaciadas identifican datos, no secciones. No van como eyebrow sobre cada título, no se combinan con puntos medios (`A · B · C`) como metadato decorativo y la numeración `01/02` solo aparece si el contenido es una secuencia real (por ejemplo, el proceso de acompañamiento técnico).

**The One Statement Rule.** El peso 300 a escala display aparece una sola vez por página. Si todo es display, nada lo es.

**The Logo Is Not Type Rule.** El wordmark del logo nunca se compone en Manrope ni en ninguna otra fuente.

## Layout

- **Contenedor:** `.wrap`, máximo de 90 rem con gutter fluido de 1 a 2.5 rem (16 px en móvil).
- **Retícula:** `--grid-columns` vale 4 en móvil, 6 desde 40 em y 12 desde 64 em; el gap es igual al gutter.
- **Breakpoints:** 40 em (640 px), 64 em (1024 px) y 90 em (1440 px), elegidos por contenido. En componentes se prefieren las container queries.
- **Ritmo vertical:** de `--space-2xs` (0.25 rem) a `--space-2xl` (6–12 rem). `xl` separa secciones y `2xl` separa capítulos narrativos. Los saltos grandes son deliberados: el aire editorial compensa la densidad de las tramas.
- **Alineación:** a la izquierda siempre. Las composiciones son asimétricas: ningún bloque de texto se centra sobre un campo generativo.
- **Móvil:** decisiones propias, no una reducción del escritorio. La imagen generativa se recorta y se coloca encima, el texto va debajo sobre fondo sólido y los objetivos táctiles miden al menos 44 px.

### Named Rules

**The Solid Ground Rule.** El texto nunca va sobre una trama activa; se apoya en un plano sólido de la superficie.

## Elevation & Depth

El sistema es **plano**. La profundidad la aportan la superficie inversa, las líneas finas y la propia imagen generativa (tamaño de punto y perspectiva), no las sombras.

### Shadow Vocabulary
- **Overlay** (`--shadow-overlay`: `0 24px 48px -24px` navy al 35 %): solo menús desplegables, hoja móvil y diálogos, es decir, elementos que flotan sobre el contenido.

### Capas (z-index)
`--z-canvas` 0 · `--z-content` 1 · `--z-header` 100 · `--z-overlay` 200 · `--z-toast` 300 · `--z-skip` 400. No se usan valores fuera de esta escala.

### Named Rules

**The Flat-By-Default Rule.** Una tarjeta en reposo no lleva sombra. Para separar se usa una línea fina o un cambio de superficie.

**The One Live Field Rule.** Como máximo un canvas animado visible a la vez. Divisores, fondos y estados hover usan halftone estático (CSS o SVG); se animan solo en respuesta a una acción.

## Shapes

Lenguaje técnico, casi recto. **Radio de 2 px** en controles, paneles y etiquetas; **pill** solo en botones, para que la acción se reconozca al instante; **0** en imágenes y campos generativos. Los bordes son de 1 px. La geometría característica viene del isotipo: elipses orbitales, nodos circulares y la columna de tres puntos. Se usa como **comportamiento** (trayectorias, indicadores, estados), nunca como redibujo del logo.

## Components

Los componentes consumen solo tokens semánticos (`--color-*`, `--space-*`, `--dur-*`). Si se colocan dentro de `.surface-inverse`, se adaptan sin variantes nuevas.

### Buttons
- **Shape:** pill (999 px), altura mínima de 44 px, padding de 0.85 × 1.4 em, texto UI a 500.
- **Primary:** relleno `--color-primary` y texto `--color-on-primary` (navy/blanco sobre claro, mineral/navy sobre inverso).
- **Hover** (solo con `hover: hover` y puntero fino): pasa a contorno en `--dur-hover` con `--ease-out`.
- **Active:** `scale(0.97)` en `--dur-press`.
- **Focus:** contorno de 2 px en `--color-focus` con offset de 3 px.
- **Ghost:** contorno que pasa a relleno en hover.
- **Previstos:** botón con icono, botón de pausa del campo generativo.

### Logo y favicon
- **Logo principal:** `logo/new-logo.png` (4096², RGBA, lockup vertical: isotipo + wordmark + línea «Orthopedi i rörelse»). **Favicon:** `logo/favicon.png` (512², RGBA, isotipo). `logo/logo-fiaril.jpeg` es solo referencia histórica.
- **Permitido:** reescalar, recortar el margen transparente sobrante y exportar a WebP, AVIF o PNG en distintos tamaños. Los originales en `logo/` nunca se modifican.
- **Prohibido:** redibujar, vectorizar, retrazar, recolorear (incluidos los filtros CSS `invert`, `brightness` o `hue-rotate`), separar el wordmark para recomponerlo y componer el nombre en tipografía.
- **Superficie:** solo **claras** (mineral o blanco). No existe versión negativa: sobre navy desaparecen las órbitas y el wordmark navy, y el punto negro (1.02:1). En secciones inversas el logo no aparece, o se coloca sobre una placa mineral con aire suficiente.
- **Tamaño mínimo del logo completo:** el contenido opaco mide 3809 × 3284 px dentro de un lienzo de 4096², con unos 330 px transparentes arriba y unos 480 px abajo. La altura de mayúsculas del wordmark es el 8.8 % del alto del contenido y la de la línea inferior el 4.5 %. Para que esa línea siga siendo legible (≈ 6 px de altura de mayúsculas), el contenido debe medir **al menos unos 136 px de alto**. Por debajo se usa el isotipo (`favicon.png`).
- **Zona de respeto:** como mínimo la altura de mayúsculas del wordmark en todos los lados.
- **Favicon:** a 16 px el isotipo pierde legibilidad y en pestañas oscuras las órbitas navy desaparecen. Son limitaciones del activo aprobado y se documentan, no se corrigen redibujando.
- **Calidad del activo:** el canal alpha de `new-logo.png` tiene píxeles casi transparentes dispersos por el lienzo (polvo de recorte). Es invisible sobre fondos claros, pero cualquier tratamiento que amplifique el alpha lo haría visible.

### Navigation (prevista, Fase 4)
Barra integrada con el hero. Se oculta al bajar y reaparece al subir sobre superficie sólida con una línea fina. La sección activa se marca con un punto en `--color-accent`. En móvil, una hoja `<dialog>` con `--ease-drawer` y `--dur-panel` y acceso directo a contacto. Desplegables con disclosure accesible (`aria-expanded`, Esc) que no dependen del hover.

### FieldCanvas (signature, prevista, Fase 3)
El campo F05, que une la anatomía de F03 con la onda de F04 en WebGL2, con respaldo en Canvas 2D. Tiene botón de pausa visible, usa un frame final estático con reduced-motion y la imagen no transmite información que no esté también en texto.

### Halftone estático (previsto)
Divisores, hover de tarjetas y footer. Patrón CSS de puntos cuya densidad se controla con variables. No usa canvas.

### Inputs / Fields (previstos, Fase 8)
Borde de 1 px en `--color-border-control`, radio de 2 px, etiqueta visible siempre, error en línea junto al campo con el texto en rojo y el foco en el primer error.

### Pending
Contorno rojo discontinuo (`.pending`) en todo contenido provisional. Es visible a propósito y no se publica en producción.

### Motion
- **Curvas:** `--ease-out` (0.23, 1, 0.32, 1) para entrar y responder, que es la curva por defecto; `--ease-in-out` (0.77, 0, 0.175, 1) para elementos que se desplazan en pantalla; `--ease-drawer` (0.32, 0.72, 0, 1) para hojas y menús. Nunca `ease-in` en interfaz.
- **Duraciones:** press 120 ms · hover 160 ms · UI 200 ms · panel 320 ms · reveal 600 ms. La interfaz se mantiene por debajo de 300 ms salvo paneles. La salida es más rápida que la entrada.
- **Qué se anima:** solo `transform` y `opacity` en interfaz. Transiciones CSS interrumpibles; WAAPI para lo programático; `@starting-style` para entradas.
- **Narrativa:** un único momento orquestado por página (el ensamblaje del hero). No hay fade-up por sección.
- **Reduced motion:** las transiciones se anulan y los canvas muestran su estado final estático.

## Do's and Don'ts

### Do:
- **Do** usar `--color-accent` y `--color-focus` en lugar de rojo o amarillo directos, para que la superficie decida (The Surface Swap Rule).
- **Do** reservar `.display` para una sola frase por página.
- **Do** apoyar todo texto sobre un plano sólido de la superficie.
- **Do** dar a cada animación autónoma de más de 5 s un control de pausa y un estado estático.
- **Do** marcar con `.pending` todo dato no confirmado por FIARIL.
- **Do** mostrar el logo solo sobre superficies claras y a una altura de contenido de al menos unos 136 px; por debajo, el isotipo.

### Don't:
- **Don't** usar amarillo como texto o borde funcional sobre superficies claras (1.75:1).
- **Don't** usar rojo como texto sobre navy (2.39:1).
- **Don't** poner sombras en tarjetas en reposo ni inventar valores de z-index fuera de la escala.
- **Don't** usar mayúsculas espaciadas como eyebrow decorativo ni numerar lo que no es una secuencia.
- **Don't** tener más de un campo generativo animado visible a la vez.
- **Don't** redibujar, vectorizar, recolorear ni invertir el logo.
- **Don't** usar la paleta medtech genérica de azules fríos ni gradientes decorativos.
- **Don't** usar `transition: all` ni animar propiedades de layout.
