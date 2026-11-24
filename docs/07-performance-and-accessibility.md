# 07 — Performance & Accessibility

## Objetivos

LCP < 2.5 s · INP < 200 ms · CLS < 0.1 · 60 fps en dispositivos compatibles · WCAG 2.2 AA.

## Equipo de medición

MacBookPro11,5 (2015): i7-4870HQ, Intel Iris Pro (GPU usada por Chrome, WebGL vía ANGLE/OpenGL 4.1), pantalla Retina 2880×1800 (DPR 2). Es un equipo de **gama baja para 2026**: útil como suelo, no como media.

## Perfil por experimento (2026-11-24, Astro 7.4.13)

Instrumentación externa (init script de Playwright, sin tocar el código): conteo de llamadas al contexto 2D, tiempo de JS de cada callback de `requestAnimationFrame` y métricas CDP del hilo principal. Cursor en movimiento. Viewport 1440×900.

| | Puntos / arcos por frame | `fill()` por frame | Canvas a DPR 1 / DPR 2 | JS por frame (mediana) |
|---|---|---|---|---|
| F01 Dot Field | 5 928 | 1 | 1440×774 / 2880×1548 | 3.1 ms |
| F02 Chromatic Offset | 8 760 (2 920 × 3 tintas, `multiply`) | 3 | idem | 2.6 ms |
| F03 Living Anatomy | 5 118 + 3 órbitas (`stroke`) | 5 | idem | 3.7 ms |
| F04 Cursor Waves | ~8 000 (navy + crestas rojas) | 2 | idem | 2.4 ms |

Frecuencia: `requestAnimationFrame` (vsync, 60 Hz), activo solo con el canvas visible y la pestaña activa.

### fps medidos

| | Headless DPR 1 | Headless DPR 1, sin GPU | Chrome visible DPR 1 | **Chrome visible DPR 2 (Retina real)** | Emulación móvil visible (390×844, DPR 3→2) |
|---|---|---|---|---|---|
| F01 | 39 | 38 | 38 | **18** | 60 |
| F02 | 26 | 18 | 24 | **11** | 36 |
| F03 | 60 | 56 | 60 | **44** | 60 |
| F04 | 57 | 58 | 46 | **21** | 60 |
| *Sonda WebGL (carga de F02)* | — | — | 60 | **60** | — |

### Diagnóstico

1. **No es el JS:** 2–4 ms de 16.7 ms. Con GPU, el hilo principal está ocupado solo el 4–26 % del tiempo.
2. **No son los draw calls:** 1–5 `fill()` por frame.
3. **Es el rasterizado de paths:** cada `fill()` contiene miles de subpaths circulares que Skia debe teselar y rasterizar.
   - Al cuadruplicar los píxeles (DPR 1 → 2) con el mismo número de arcos, los fps caen a la mitad o menos. El coste escala con la superficie: estamos limitados por fill-rate y raster.
   - Con `--disable-gpu`, el hilo principal pasa al 77–100 % y los fps apenas cambian: en este equipo la GPU no rasteriza estos paths más rápido que la CPU. **La GPU es el cuello de botella con aceleración y la CPU sin ella.**
   - F02 es el peor caso: más puntos, tres capas y blending `multiply` sobre toda la superficie.
4. **WebGL elimina el problema:** la misma carga dibujada como `gl.POINTS` (el disco se recorta en el fragment shader) llega al tope de vsync a DPR 2 con resultado visual equivalente.

Recomendación de render: ver `05-technical-architecture.md` § Estrategia de render.

### Límites de la medición headless

- Headless sí usa la GPU (se confirmó con el renderer WebGL y comparando con `--disable-gpu`), pero Playwright fija **DPR 1 por defecto**, mientras que la pantalla real es Retina (DPR 2). Las cifras headless sobreestiman el rendimiento real a la mitad o más.
- Headless no compone en pantalla ni sufre la competencia con otras ventanas.
- La emulación móvil usa la GPU del Mac, no la de un teléfono: no sirve para estimar fps en móvil.
- Varianza observada de ±20 % entre ejecuciones (ej. F01 visible a DPR 2: 18–26 fps).
- No hay dispositivo físico disponible: **rendimiento en móvil real sin medir**.

## Peso

JS del Lab: unos 10 kB en total (runtime 1.5 kB + 1–3 kB por experimento, cada uno en su propio chunk). CSS 8.4 kB. Fuente latin 25 kB. Logo 2.6 kB (WebP).

## Accesibilidad implementada

- `lang="es"`, landmarks (`header`, `nav`, `main`, `footer`), un solo `h1` por página.
- Canvas con `role="img"` y `aria-label` descriptivo; el contenido nunca vive solo en el canvas.
- El texto nunca va sobre una trama activa (siempre sobre panel sólido).
- `prefers-reduced-motion` respetado en CSS y en canvas (verificado: frame estático determinista).
- Foco visible; objetivos táctiles de al menos 44 px en botones.
- Sin overflow horizontal a 390 px (verificado).

## No probado todavía

Lighthouse, axe-core, Web Vitals de campo, lectores de pantalla, Safari/Firefox, dispositivos físicos.
