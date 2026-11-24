# 05 — Technical Architecture

## Stack actual

| Pieza | Versión | Motivo |
|---|---|---|
| Node.js | 22.23.5 LTS | `.nvmrc`, `engines >=22.23.4`, `NODE_VERSION` en Netlify (ver 09) |
| Astro | 7.4.13 | Sitio estático, cero JS por defecto, sin adaptador (Vite 8, compilador Rust) |
| `@fontsource-variable/manrope` | 5.3.0 | Fuente local, sin petición a Google |
| Canvas 2D nativo | — | Todos los experimentos; 0 dependencias de render |
| sharp | 0.35.5 (opcional de Astro) | Optimización de imágenes vía `astro:assets` |

**No añadidas (y por qué):** Three.js / OGL (Canvas 2D basta para ≤ 5 k puntos a 60 fps en F03), Motion (no hay animación de UI aún; CSS cubre lo actual), GSAP (no hay secuencia de scroll), React (no hay islas), TypeScript checker (`astro check` añade 2 deps; activar cuando haya más superficie de tipos), Playwright como dependencia (usado de forma temporal fuera del repo para verificar; entra en Fase 7).

## Estructura

```
src/
  styles/global.css        tokens + base + utilidades (.label .btn .wrap .pending)
  layouts/Base.astro       html, header, footer
  assets/logo-fiaril.jpeg  copia del original (el original en logo/ no se toca)
  lab/stage.ts             runtime compartido de canvas
  lab/f0X-*.ts             un experimento por archivo, export default (canvas) => void
  lab/experiments.ts       metadatos del Lab (fuente única para índice y páginas)
  pages/index.astro        portada provisional
  pages/lab/index.astro    índice del Lab
  pages/lab/[slug].astro   una página por experimento (import dinámico → cada uno es su propio chunk)
docs/                      esta documentación
references/                material de estudio (ignorado por Git)
```

## `stage.ts` — contrato

`stage(canvas, { setup?(w,h), draw(frame) })` se encarga de:
- Tamaño por DPR (tope 2) con `ResizeObserver`.
- Loop `requestAnimationFrame` **solo** si el canvas es visible (`IntersectionObserver`) y la pestaña está activa.
- `prefers-reduced-motion`: un único frame estático con `t = 6` (estado final ensamblado).
- Puntero unificado: ratón = campo continuo con fade in/out; táctil = pulso que decae + contador `taps`. Listeners en el canvas, no globales. `touch-action: pan-y` preserva el scroll.
- `dt` acotado a 50 ms para que volver de otra pestaña no dispare la física.

`dots()` agrupa todos los círculos de un color en un único path + un `fill()`.

## Estrategia de render — recomendación (Fase 2.5)

Datos en `07-performance-and-accessibility.md`. El cuello de botella es el rasterizado GPU de miles de arcos en Canvas 2D, no el JS ni el número de draw calls (1–3 `fill()` por frame).

| Opción | Qué es | Pros | Contras | Techo medido |
|---|---|---|---|---|
| **A. Optimizar Canvas 2D** | Menos puntos (gap mayor), DPR 1 forzado en campos, sin `multiply` | 0 código nuevo | Pierde densidad y nitidez en Retina; F02 sigue por debajo de 30 fps aun a DPR 1 | F01 38 · F02 24 · F04 46 fps (DPR 1, Chrome visible) |
| **B. WebGL** | `dots()` reimplementado como `gl.POINTS` con el disco recortado en el shader; `multiply` = `blendFunc(DST_COLOR, ZERO)` | 60 fps a DPR 2 con la carga de F02; misma firma de `dots()`, los experimentos no cambian | ~80 líneas propias; necesita un fallback si no hay WebGL; las líneas de órbita de F03 no son puntos | Sonda F02: **60 fps a DPR 2** (vsync) |
| **C. Híbrida** | WebGL para las nubes de puntos + Canvas 2D o SVG superpuesto para líneas, nodos y texto | Cada capa usa la herramienta adecuada; encaja con las capas separadas del brief | Dos canvas apilados que sincronizar | Igual que B para los puntos |

**Recomendación: C, implementada como B + capa 2D solo donde hacen falta líneas.**
- `dots()` pasa a WebGL2 sin dependencias (no Three.js ni OGL: solo dibujamos puntos de un color por pasada).
- Fallback: si `getContext('webgl2')` falla, se usa el `dots()` actual de Canvas 2D (ya existe y funciona).
- F03 se queda en Canvas 2D por ahora: es el único a 60 fps a DPR 1 (44 a DPR 2) y el hero puede limitar su tamaño. Se migra solo si se mide un problema en el hero real.
- Se hace **antes** de llevar F01, F02 o F04 a la homepage, no ahora.

## Netlify

`netlify.toml`: build `npm run build`, publish `dist`, `NODE_VERSION 22.23.5`, caché inmutable para `/_astro/*`. Sin adaptador (sitio 100 % estático). Formularios: usar Netlify Forms (atributo `data-netlify`) en Fase 6 — no requiere adaptador.
Pendiente de autorización: `netlify login`, `netlify init`, deploy preview.

## Scripts

`npm run dev` · `npm run build` · `npm run preview` · `netlify dev` (cuando haya Forms).
