# 15 — V2.1: navegación, conversión, motion 3D y acabado

Fecha: 2026-11-24 · Base: `e567c1a` (deploy `6b05c702cda45a6d066c5421`) · Decisiones: D-047 a D-054 · Estado: local, sin publicar.

## Arquitectura

| Ruta | Contenido |
|---|---|
| `/` | Hero, Nosotros, Especialidades, Tecnología ortopédica, Acompañamiento técnico, footer. **Sin formularios** |
| `/cotizacion/` | Conversión comercial (navy). Admite `?interes=implantes\|equipamiento\|consumibles\|acompanamiento\|otra` |
| `/bolsa-de-trabajo/` | Candidatura (mineral) |
| `/privacidad/`, `/lab/`, F01–F05, 404 | Sin cambios funcionales |

Navegación principal: Especialidades · Tecnología · Acompañamiento + CTA «Solicitar cotización» (`/cotizacion/`). Bolsa de trabajo: menú móvil y footer (ubicación secundaria).

## Header

Una sola geometría (barra de 64 px). El cambio es de color y de logo: el logo completo y el isotipo están posicionados en absoluto dentro de una caja fija de 44 px, así que el cambio no mueve nada (CLS de 0.0013 en toda la home). Tono por IntersectionObserver sobre `[data-surface]`.

## Campo de Acompañamiento técnico

`src/scripts/surgical-field.ts` sobre `stage()`:
- Retícula al tresbolillo que cubre toda la sección.
- Luz ambiental que deriva en una trayectoria de Lissajous y luz del cursor (o del toque) con amortiguación.
- Empuje del cursor con muelle y desplazamiento limitado (una ondulación, nunca un hueco).
- Opacidad en 6 niveles (6 trazados por frame).
- Cerca del texto, la luz ambiental baja al 55 %, pero la del cursor no se apaga: el campo responde también junto al titular.

## Visor 3D

`src/three/viewer.ts`:
- Grupo de órbita (lemniscata de Gerono: `x = A·sin s`, `y = A/2·sin 2s`, `z = 0.35A·cos s`, con `A` igual al 8 % de la diagonal del modelo) y grupo de orientación (tangente, cursor y arrastre).
- Cámara fija.
- Sin asignaciones por frame.
- Encuadre al 84 % para que la pieza nunca salga del marco durante la órbita.
- Control de pausa discreto (D-055, que resuelve D-049).

## Formularios

`src/scripts/forms.ts`, compartido por los dos formularios:
- Validación en línea y foco en el primer error.
- Preselección por URL.
- CV: solo PDF, máximo 5 MB, nombre y tamaño visibles, opción de quitarlo o sustituirlo.
- Estado «completa, sin enviar».
- Interruptor único: `src/scripts/reception.ts`.

## Netlify

Distintivo desactivado en la configuración del sitio mediante la API de Netlify (`updateSite` con `built_with_badge_enabled: false`, lo único que se envió). La ruta exacta del ajuste en la interfaz web no se verificó; el campo de la API es la referencia. No se tocaron dominios, DNS ni funciones. Para revertirlo: el mismo campo a `true`.

## QA (local)

| Prueba | Resultado |
|---|---|
| Build | ✅ 12 páginas |
| Rutas (12) en 6 tamaños | ✅ Sin desbordamiento ni errores; favicon, OG y descripción en todas |
| Accesibilidad (axe, WCAG 2.2 AA) a 1440 y 390 px | ✅ 0 violaciones |
| Header | ✅ Misma geometría en top, ink y paper; CLS de 0.0013 |
| 3D | ✅ Three.js no se descarga al cargar; control de pausa discreto (D-055); se mueve (3.9 % de píxeles en 1.5 s); el arrastre táctil gira (6.2 %); estático con movimiento reducido (0 rAF); 60 fps |
| Campo de Acompañamiento | ✅ Movimiento ambiental (0.95 %); 60 fps; estático con movimiento reducido |
| Formularios | ✅ Preselección por URL; errores y foco; correo inválido; PDF inválido; más de 5 MB; quitar archivo; estados «sin enviar»; **0 peticiones de envío, 0 almacenamiento, 0 formularios registrados** |
| Firefox 131 y WebKit 18 | ✅ Home, 3D, header de 64 px, páginas nuevas y validación |
| Regresión | ✅ F01–F05 idénticos bit a bit a `e567c1a`; gate y página temporal sin cambios |
| Tipos | ✅ 0 errores en el sitio (sigue el error conocido de `tests/`, por falta de `@types/node`) |
| `npm audit` | ✅ 0 vulnerabilidades |
