# 13 — Sprint de excelencia y publicación de la demo

Fecha: 2026-11-24 · Decisiones: D-031 a D-036 · Publicación autorizada: solo `fiaril-orthopedics.netlify.app`.

## Hallazgos de la auditoría y qué se hizo

| Hallazgo | Acción |
|---|---|
| F05: unas 7 000 asignaciones de arrays por frame (`proj`, `orbit`), presión de garbage collection | Bucle sin asignaciones; la órbita solo se calcula mientras una partícula está en tránsito (D-032) |
| F05: la máscara de texto se calculaba para cada punto de la retícula en cada frame y se leía el DOM cada 30 frames | Máscara por layout; refresco por eventos (D-032) |
| `stage()`: `getBoundingClientRect()` en cada `pointermove` | `offsetX/offsetY` (D-033) |
| CLS por el cambio de fuente en el hero | Preload de Manrope (D-034) |
| Formulario: POST a Netlify y error técnico visible; riesgo de habilitar la recepción sin aviso de privacidad | Modo «recepción en preparación» honesto y sin red (D-031) |
| Panel de estado del formulario sin estilo (los elementos creados por script quedaban fuera del CSS con ámbito) | Selectores `:global()` |
| Lab: bloque gris vacío con 5 tarjetas; eyebrow «Fase 2 · Creative Lab» y texto de proceso interno | Rejilla con bordes por tarjeta y 5 columnas; título y texto para el cliente |
| El campo del hero terminaba en un corte duro | Máscara de desvanecimiento hacia la sección siguiente |
| Footer sin línea institucional | Línea confirmada: implantes, equipamiento, consumibles y acompañamiento técnico |

## Mediciones (Chromium, MacBook Pro de 2015, DPR nativo)

| Métrica | Antes | Después |
|---|---|---|
| Script del hero (% del hilo principal, escritorio, DPR 2) | 27 % | 11 % |
| Script del hero (móvil, DPR 3 emulado) | 16–18 % | 9–10 % |
| Frames (escritorio) | p50 16.7 ms · p95 33.3 ms | p50 16.7 ms · p95 16.8–33.3 ms (54.7 fps efectivos, 9.8 % de frames > 20 ms) |
| Tareas largas | 1 | 0 |
| CLS | 0.002–0.0035 | 0–0.0014 |
| LCP (local) | 172–280 ms | 104–192 ms |
| Peso de la home | 109 KB, 11 peticiones | 112 KB, 11 peticiones (+3 KB por el preload y el nuevo código) |
| JS transferido | 9.3 KB | 10.3 KB |

El LCP y el peso se midieron con `astro preview` en local, no en red real.

## QA

- Build ✅ · `node tests/domain-gate.test.ts` ✅ · `astro-check` (ejecutado con `npx`, sin añadirlo al proyecto): 0 errores en el sitio; 1 error solo de tipos en `tests/` (`node:assert` sin `@types/node`) · `npm audit` 0.
- **Chromium (Chrome estable):** 10 rutas × 2 viewports con 0 errores y axe 0; teclado; menú; formulario (0 POST); pausa; reduced-motion; 6 viewports.
- **Firefox 131 y WebKit 18** (Playwright 1.48.2, el último compatible con macOS 12): 9 rutas × 2 viewports, 0 errores, animaciones, menú con Esc y devolución de foco, validación y estado pendiente del formulario.
- **Regresión:** el canvas de F01–F04 es idéntico bit a bit al de `754e9a5` (8/8).
- **No probado:** dispositivos físicos y Safari real en iOS/macOS reciente.
