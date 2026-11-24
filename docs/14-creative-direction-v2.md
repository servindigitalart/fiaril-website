# 14 — Creative Direction V2: tecnología ortopédica en movimiento

Fecha: 2026-11-24 · Decisiones: D-037 a D-046 · Base estable de referencia: commit `c60119d`, deploy `6b0574d9743a545fb445a0dd`.

## 1. Diagnóstico de la versión publicada

Revisé el código, la producción y las capturas de `c60119d`. Los problemas son de dirección de arte, no de implementación:

| Problema | Evidencia |
|---|---|
| **Tipografía sin sistema** | Las categorías usaban `--step-4` a peso 300, los h2 `--step-3` a 400, el enunciado de Acompañamiento `--step-4` a 300, las acciones y la ficha técnica `--step--1` (12.8 px). Elementos equivalentes no compartían nivel, y había texto diminuto sin función. |
| **Una sola superficie** | Cuatro de cinco secciones sobre mineral `#F7F7F7`; solo Acompañamiento cambiaba. El scroll no tenía capítulos. |
| **Sin materialidad** | La única imagen eran los puntos generativos. Ni producto, ni anatomía real, ni metal, ni profundidad. |
| **Estático** | Fuera del hero, el movimiento se limitaba a fundidos de texto iguales en cada sección. |
| **Especialidades plana** | Un índice tipográfico: tres palabras grandes y un enlace pequeño. Parecía una lista, no una oferta. |
| **Header genérico** | Una barra blanca con línea fina, igual sobre cualquier fondo. |
| **Formularios genéricos** | Campos HTML con estilos mínimos y sin componentes propios (archivo, casilla, select). |

**Se conserva:** el hero F05 (concepto aprobado H1 «Ensamblaje»), el copy aprobado, la paleta, Manrope, el halftone como pegamento visual, el modo honesto de recepción, el Lab y el domain gate.

## 2. Nueva dirección: tres actos

La home se lee como un recorrido de luz a quirófano y de vuelta a la luz:

1. **Luz:** Hero (mineral) y Nosotros (mist). Anatomía raster, ficha técnica, la primera radiografía real.
2. **Quirófano:** Especialidades (navy), Tecnología ortopédica (grafito) y Acompañamiento técnico (navy). El metal aparece: renders de producto sobre fondo oscuro, radiografías, un visor 3D en vivo y la lámpara quirúrgica.
3. **Regreso a la luz:** Contacto (mineral) y Bolsa de trabajo (mist). Formularios y cierre institucional.

El tramo oscuro es el «quirófano nocturno» (dirección B) convertido en un capítulo central, no en un momento aislado.

## 3. Sistema tipográfico

Una familia (Manrope Variable) y **seis roles**. Ningún componente define tamaños propios:

| Rol | Clase | Tamaño | Peso | Uso |
|---|---|---|---|---|
| Display | `.t-display` | 2.75 → 6 rem | 300 | Solo el titular del hero |
| Title | `.t-title` | 2.25 → 4 rem | 400 | Todos los h2 de sección |
| Subtitle | `.t-subtitle` | 1.75 → 3 rem | 400 | Elementos equivalentes dentro de una sección: las tres especialidades comparten este nivel |
| Lead | `.t-lead` | 1.125 → 1.375 rem | 400 | La frase de contexto bajo cada título |
| Body | (base) | 1 → 1.125 rem | 400 | Párrafos y campos |
| Meta | `.t-meta` | 0.875 rem fijo | 600 | Etiquetas de campo, pies de imagen, «Visualización conceptual». Mínimo 14 px |

Los botones y la navegación usan el tamaño meta a peso 500. Sin mayúsculas espaciadas, salvo la firma de marca.

## 4. Sistema de superficies

| Superficie | Valor | Texto | Secundario | Acento |
|---|---|---|---|---|
| Mineral | `#F7F7F7` | navy 14.6:1 | `#5B5F67` 6.0:1 | rojo |
| Mist (intermedia) | `#E7E8E9` (mineral + 12 % titanio) | navy 12.7:1 | `#5B5F67` 5.2:1 | rojo |
| Navy | `#07253F` | mineral 14.6:1 | `#AFB8C0` 7.8:1 | amarillo |
| Grafito (cinematográfica) | `#222222` | mineral 14.9:1 | `#B1B2B3` 7.5:1 | amarillo |

Cada sección declara `data-surface`, y las clases `.surface-*` reasignan los tokens semánticos: los componentes se adaptan solos.

## 5. Transiciones entre secciones

- **Claro → oscuro:** banda halftone. Puntos del color oscuro que crecen en densidad hasta volverse sólidos, como una trama que se cierra.
- **Oscuro → oscuro:** degradado navy ↔ grafito, como un cambio de iluminación.
- **Oscuro → claro:** banda halftone inversa.
- **Claro → mist:** línea técnica con marcas de regla (vocabulario de plano técnico, sin números).
- **Cruce de límites:** el primer render de Especialidades invade la banda superior.

Son elementos estáticos en CSS, sin canvas y sin cambios de layout.

## 6. Lenguaje de imágenes

| Tipo | Origen | Uso | Rótulo |
|---|---|---|---|
| Radiografías reales | Wikimedia Commons, **CC0**, M. Häggström (consentimiento del paciente documentado) | Nosotros (rodilla lateral) y Tecnología (cadera AP) | «Imagen ilustrativa» |
| Renders de producto | Propios, generados con Three.js desde `src/three/models.ts` | Especialidades | «Visualización conceptual» |
| 3D en vivo | El mismo código, en tiempo real | Tecnología ortopédica | «Visualización conceptual» |
| Halftone generativo | F05 y CSS | Hero y transiciones | — |

Las radiografías se integran en navy con `mix-blend-mode: screen`: el negro se vuelve navy y el hueso queda luminoso. **Descarté** dos fotos CC0 de instrumental porque llevan grabadas marcas de fabricante. No hay fotografía de stock de personas.

## 7. Lenguaje 3D

- **Biblioteca:** Three.js 0.187.0 (MIT, sin dependencias), cargada de forma diferida al acercarse la sección (D-038).
- **Modelos procedurales:** prótesis de cadera en vista explosionada, placa de fijación con tornillos, destornillador quirúrgico con mango navy y consumibles (agujas de Kirschner, broca, tornillos).
- **Materiales:** titanio, titanio poroso, acero pulido, cerámica con clearcoat y polímero.
- **Visor:** selector de modelo, vista «Material / Geometría» (wireframe técnico), rotación muy lenta, inclinación según el cursor y botón de pausa. Se detiene fuera de pantalla y con movimiento reducido muestra un único frame.

## 8. Motion

Un vocabulario corto, siempre con un estado estático equivalente:

1. **Ensamblaje del hero** (F05): el único momento orquestado.
2. **Revelado por máscara:** las imágenes aparecen con `clip-path` y una escala de 1.06 a 1 (1 s, ease-out).
3. **Parallax moderado:** los renders se desplazan ±6 % con scroll-driven animations nativas; sin soporte, quedan quietos.
4. **3D:** rotación lenta e inclinación por cursor con amortiguación.
5. **Header:** transición de transparente a pastilla y cambio de tema por superficie.
6. **Lámpara quirúrgica** en Acompañamiento.

Sin GSAP, Lenis ni scroll hijacking. Como máximo un bucle `requestAnimationFrame` activo: el hero y el visor no coinciden en pantalla y ambos se pausan fuera de ella.

## 9. Header contextual

- **Top (hero, escritorio):** transparente, con el logo completo a 136 px.
- **Al hacer scroll:** pastilla flotante y compacta.
  - Sobre superficies claras: **pastilla navy**, texto mineral, CTA invertido y acento amarillo.
  - Sobre superficies oscuras: **pastilla mineral**, texto navy, CTA navy y acento rojo.
- **Isotipo:** siempre sobre un disco mineral. No existe versión negativa (D-018), así que nunca se apoya sobre navy.
- **Detección:** un IntersectionObserver observa la franja superior del viewport; no hay listeners de scroll.

## 10. Arquitectura de la home

| # | Sección | Superficie | Función | Visual |
|---|---|---|---|---|
| 1 | Hero | mineral | Mensaje y CTA | F05 |
| 2 | Nosotros | mist | Qué es FIARIL | Ficha técnica y radiografía de rodilla |
| 3 | Especialidades | navy | Las tres líneas confirmadas | Tres filas alternas con render, mismo nivel tipográfico |
| 4 | Tecnología ortopédica | grafito | Materialidad y precisión | Visor 3D y radiografía de cadera |
| 5 | Acompañamiento técnico | navy | Presencia en el procedimiento | Lámpara halftone |
| 6 | Contacto | mineral | Cotización (conversión principal) | Formulario |
| 7 | Bolsa de trabajo | mist | Institucional | Formulario de candidatura con CV |
| 8 | Footer | mineral | Cierre | Logo completo |

Contacto va antes que Bolsa de trabajo: la conversión principal (compras institucionales) no debe quedar al final.

## 11. Formularios

Un solo sistema para los dos formularios (`.form` en `global.css` y `src/scripts/forms.ts`):
- Campos de 52 px con etiqueta siempre visible y texto de ayuda.
- Foco con anillo de acento.
- Select, casilla y selector de archivo propios.
- Validación en línea accesible.

El estado de recepción es honesto: «Solicitud completa, sin enviar» y «Candidatura completa, sin enviar». Ninguno de los dos hace peticiones de red mientras `RECEPCION_ACTIVA = false`. El CV se valida en el navegador (PDF, máximo 5 MB) y **nunca sale del dispositivo**.

## 12. Responsive

- **Escritorio y laptop:** composiciones asimétricas de 12 columnas.
- **Tablet:** dos columnas donde caben; las filas de Especialidades se apilan con la imagen arriba.
- **Móvil:**
  - Todo en una columna.
  - El visor 3D baja a DPR 1.5 y usa menos segmentos.
  - Los renders son WebP de un tamaño adecuado.
  - Los títulos mantienen sus roles, solo cambia el tamaño fluido.
- **Móvil horizontal:** el hero en dos columnas, como hasta ahora.
- **Táctil:** sin hover, y el visor se puede rotar arrastrando.
