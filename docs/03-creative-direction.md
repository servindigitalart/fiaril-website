# 03 — Creative Direction: Kinetic Raster System

> Construir imágenes con partículas, no decorar con partículas.

## Gramática derivada del isotipo

| Elemento del logo | Traducción digital |
|---|---|
| 3 elipses entrelazadas | Trayectorias orbitales 3D (F03), recorrido del pozo radial (F01) |
| 3 nodos grises | Nodos que viajan por las órbitas; marcadores de interacción |
| Columna negro/rojo/amarillo | Las tres planchas del Chromatic Offset (F02) |
| Asimetría, movimiento | Ninguna composición centrada; los campos derivan lentamente |

## Las cuatro familias

1. **Raster Anatomy** — anatomía como superficie de puntos con sombreado halftone (oscuro = punto grande). Referencia: retrato raster. Experimento: F03.
2. **Chromatic Fields** — retículas con desregistro de tintas en multiplicación. Referencias: Zgraf '75, offset cian/rojo, Bauhaus. Experimentos: F01, F02.
3. **Motion Studies** — perturbación que se propaga; más adelante, siluetas biomecánicas (referencia: siluetas atléticas). Experimento: F04.
4. **Technical Structures** — producto real + diagramas y líneas de conexión. **Bloqueado** hasta recibir producto real.

## Semántica de color en lo generativo

Navy = estructura asentada · Rojo = actividad / tránsito / cresta · Amarillo = interacción, solo como plancha en F02 · Gris = nodos.

## Creative Lab — estado

| ID | Rutas | Estado | Valoración |
|---|---|---|---|
| F01 Dot Field | `/lab/f01-dot-field/` | ✅ | Pozo orbital + campo de fuerza del cursor con muelle. Candidato a fondos de sección. |
| F02 Chromatic Offset | `/lab/f02-chromatic-offset/` | ✅ | El más "Zgraf". Navy como plancha clave fija = legibilidad. Coste de render alto (ver 07). |
| F03 Living Anatomy | `/lab/f03-living-anatomy/` | ✅ | Base del hero. Dispersión en órbitas → convergencia → respiración; 60 fps. |
| F04 Cursor Waves | `/lab/f04-cursor-waves/` | ✅ | Ecuación de onda real; gotas autónomas para táctil. Candidato a sección Servicio técnico. |
| F05 Orbital Motion | — | ⏳ | Parcialmente absorbido por F03 (órbitas + nodos). Decidir si merece experimento propio. |

## Hero "The Living Matrix" — propuesta

F03 + capa HTML. Las capas del brief ya están separadas en el código: anatomía (muestreo), geometría de partículas (lattice), campos de movimiento (respiración + muelles), trayectorias (órbitas), interferencia cromática (rojo en tránsito; ampliable con desregistro F02 local al cursor), interacción (campo de fuerza), tipografía (HTML encima, en panel propio).

**Ajustes pendientes antes de la homepage:** silueta de la rodilla más anatómica (condilos fusionados con la metáfisis, meseta tibial cóncava); explorar un modelo real con licencia (BodyParts3D) convertido a nube de puntos offline para que el cliente no cargue un GLB.

**Restricción:** se rotula siempre como abstracción; nunca como producto de FIARIL ni como representación clínica.

## Titulares — alternativas (no definitivas)

1. *"Precisión ortopédica en cada procedimiento."* — directo, institucional.
2. *"Soluciones ortopédicas para el entorno quirúrgico."* — descriptivo, máxima claridad SEO.
3. *"Ortopedia en movimiento."* — traduce el tagline "Ortopedi i rörelse"; conecta con la identidad.

**Recomendación:** 3 como H1 (anclado en la marca existente) + 2 como subtítulo (claridad para comprador institucional). Pendiente de validar con FIARIL.
