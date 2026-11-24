export const experiments = [
  {
    slug: 'f01-dot-field', code: 'F01', title: 'Dot Field', family: 'Chromatic Fields',
    note: 'Trama halftone cuyo tamaño de punto sigue un pozo radial que recorre una órbita. El cursor actúa como campo de fuerza con retorno elástico.',
    try: 'Mueve el cursor sobre la trama. En táctil: toca.',
  },
  {
    slug: 'f02-chromatic-offset', code: 'F02', title: 'Chromatic Offset', family: 'Chromatic Fields',
    note: 'Tres planchas de tinta (navy, rojo, amarillo) en multiplicación y desregistro rotatorio. El navy es la plancha clave y nunca se desplaza: la legibilidad se mantiene.',
    try: 'El cursor amplía la separación cromática localmente.',
  },
  {
    slug: 'f03-living-anatomy', code: 'F03', title: 'Living Anatomy', family: 'Raster Anatomy',
    note: 'Abstracción procedural de una articulación de rodilla (no es un modelo clínico). Dispersión en las órbitas del isotipo → convergencia → precisión con respiración. Rojo = partícula en tránsito.',
    try: 'Recarga para ver la secuencia completa. El cursor perturba la superficie.',
  },
  {
    slug: 'f04-cursor-waves', code: 'F04', title: 'Cursor Waves', family: 'Motion Studies',
    note: 'Ecuación de onda amortiguada sobre la retícula: la estela del cursor inyecta energía, la perturbación se propaga y el campo recupera el equilibrio. Las crestas se tiñen de rojo.',
    try: 'Mueve el cursor rápido o toca. Gotas autónomas mantienen vivo el campo.',
  },
  {
    slug: 'f05-precision-field', code: 'F05', title: 'Precision Field', family: 'Raster Anatomy × Motion Studies',
    note: 'Híbrido de F03 y F04 en un solo medio: la anatomía se ensambla desde las órbitas del isotipo y la onda la atraviesa. Las partículas se refractan con la pendiente del campo y se tiñen de rojo al paso de una cresta. Motor del hero.',
    try: 'Mueve el cursor o toca. Los nodos de las órbitas emiten ondas por sí solos.',
  },
] as const;
