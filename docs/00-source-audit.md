# 00 — Source Audit

Fecha: 2026-11-24 · Raíz del repo: `/Users/servinemilio/Documents/REPOS/fiaril`

Leyenda: **[C]** confirmado en archivo · **[H]** hipótesis / fuente secundaria · **[P]** pendiente / falta.

## 1. Estado inicial del repositorio

- No era un repo Git, no tenía `package.json` ni código. Solo `logo/` y `references/`.
- Entorno: Node 22.16.0, npm 10.9.2, Git 2.37.1, macOS 12 (Darwin 21.6).
- Netlify CLI: no instalada → instalada globalmente (`netlify-cli/27.20.1`), sin login ni vinculación.
- Ponytail: plugin `ponytail@ponytail` v4.8.4 instalado desde el marketplace oficial `DietrichGebert/ponytail` (commit `16f2980`), activo en modo **full** vía hook de inicio de sesión.

## 2. Rutas reales encontradas

| Material esperado | Ruta real | Estado |
|---|---|---|
| Enovis | `references/sites/enovis-surgical.com/` | [C] solo output del UX Analyzer, **no** es una descarga del sitio (no hay HTML/CSS) |
| UX Analyzer (copia origen) | `~/Documents/REPOS/ux-analyzer/analyses/enovis-surgical.com/` | [C] idéntico + carpeta `motion/` |
| Pinterest | `references/pinterest images/` (8 JPEG) | [C] |
| `sites/pinterest images` | — | no existe |
| `fiaril Info/fiaril` (34 elementos) | — | **[P] no existe en el disco.** Búsqueda en `~`, `~/Documents`, `~/Desktop`, `~/Downloads` y Spotlight sin resultados |
| Logo | `logo/logo-fiaril.jpeg` (1041×837) | [C] único asset original de FIARIL |
| Benchmark | `~/Downloads/Benchmark Digital Ortopedia B2B FIARIL.docx` | [C] fuera del repo, leído sin copiar |
| Sitio actual | `https://fiaril-orthopedics.odoo.com/` | [C] plantilla Odoo sin contenido real |

## 3. Inventario de materiales FIARIL

**Logo** — lockup completo (isotipo + wordmark "FIARIL ORTHOPEDICS" + tagline "ORTHOPEDI I RÖRELSE") en JPEG sobre fondo gris `#F7F7F7`. Isotipo: tres elipses navy entrelazadas, tres nodos grises en intersecciones, columna de tres puntos (negro, rojo, amarillo). El wordmark tiene ligaduras propias (la "A" y la "H" modificadas): la tipografía del logo es custom → no se redibuja.

Colores muestreados (mediana de píxeles, JPEG → ±2 por compresión):

| Elemento | Hex |
|---|---|
| Órbitas / wordmark | `#07253F` |
| Punto rojo | `#B1282F` |
| Punto amarillo | `#F3B234` |
| Nodos / tagline | `#72767F` |
| Punto negro | `#222222` |
| Fondo | `#F7F7F7` |

**No hay**: SVG/vector, versión monocroma o invertida, isotipo aislado, fotografías, catálogos, fichas técnicas, fabricantes, datos de contacto.

**Datos comerciales** (benchmark docx, fuente secundaria → todo [H] hasta confirmar con FIARIL):
- FIARIL ORTHOPEDICS es marca comercial de **ISO Soluciones Ortopédicas S. de R.L. de C.V.**
- Distribuidora B2B ubicada en **Guanajuato, México**; experiencia en licitación pública.
- El sitio debe estar en **español** (mercado mexicano); el tagline del logo está en sueco.

**Sitio Odoo** — solo el nombre de marca es real. Teléfono `+1 555-555-5556`, correo `info@yourcompany.example.com`, dirección "3575 Fake Buena Vista Avenue" y textos "Somos un equipo…" son placeholders de plantilla: **no reutilizar**.

## 4. UX Analyzer — hallazgos

**Hallazgo crítico:** el analizador capturó la **puerta de acceso HCP** de Enovis ("Healthcare Professional / Non Healthcare Professional Access") con el banner de cookies encima, no el sitio. Evidencias: `site_name: "Check - Enovis Surgical"`, altura total 1038 px, 1 enlace de navegación, CTAs "CONTINUE TO WEBSITE". Por tanto:

- Métricas de densidad, premium score (58), secciones y navegación **no representan el sitio real**.
- `editorial-serif-headings` es un falso positivo (la tipografía es Unineue, sans).
- Válido: detección de Motion One (`window.mo`) como motor de animación, botones pill, tipografía sans geométrica en mayúsculas.
- Recomendación: repetir el análisis haciendo clic en "Non HCP" + aceptar cookies antes de capturar (ajuste del analizador).

El patrón de **gate HCP** en sí es relevante: en México (COFEPRIS) la publicidad de dispositivos médicos dirigida a profesionales puede requerir segmentación similar. [P] confirmar con FIARIL si aplica.

## 5. Patrones de Enovis que conviene adaptar

Fuente: benchmark docx (inspección del sitio real) + capturas.

1. **Repositorio abierto de documentación** (e-IFU, guías de limpieza/esterilización, tarjetas de implante) → sección Recursos.
2. **Cuadrícula de soluciones con conteo de productos** por categoría → solo cuando haya catálogo real; nunca mostrar categorías con 0.
3. **Navegación por prioridades del sector** (Company, Solutions, Resources, Careers, Contact).
4. **Careers con pilares culturales** → candidaturas espontáneas.
5. Evitar sus fallos: "Contact us" apuntando a `#`, categorías vacías visibles, assets llamados `placeholders`.

Complementos del benchmark: Bonebridge (catálogo anatómico, descargas en menú, certificados en footer), Corin (separar comprador institucional vs. personal quirúrgico en el hero), Brainlab (organización por flujo quirúrgico).

## 6. Referencias visuales (Pinterest)

| Archivo | Principio | Uso en FIARIL |
|---|---|---|
| `Raster-Porträt – Gesicht aus Punkten` | Volumen 3D por tamaño de punto en retícula deformada | **Raster Anatomy** (F03) — referencia principal del hero |
| `Zgraf_ Slavko Henigsman 1975` | Anillos concéntricos CMY+K, gradiente de tamaño, desregistro | **Chromatic Fields** (F02); paleta del logo ≈ la del póster |
| `_ (4)` Bauhaus | Pozo radial: puntos que crecen desde un vacío curvo | **Dot Field** (F01) |
| `_ (5)` | Cinta de puntos en perspectiva | Transiciones de sección, Motion Studies |
| `_ (6)` | Cinta en S con halftone navy | Separadores / Motion Studies |
| `_ (7)` Programm 2008 | Campos de puntos rojo/negro con desplazamiento | Chromatic Fields en rojo (actividad) |
| `_ (8)` | Retícula diagonal con offset cian/rojo | Chromatic Offset (F02) |
| `(1) Inbox • Direct` | Siluetas atléticas por puntos (6 técnicas: halftone, stipple, metaballs) | **Motion Studies** (biomecánica) |

## 7. Assets utilizables / a optimizar

- `logo-fiaril.jpeg` → usable vía `astro:assets` (WebP 2 kB a 120 px). Funciona solo sobre `#F7F7F7`. **Necesita**: SVG original, versión en negativo para fondos navy, isotipo aislado para favicon.
- Manrope Variable: OFL, servida localmente vía `@fontsource-variable/manrope`.
- Ningún asset de Enovis ni Pinterest se publica.

## 8. Información faltante [P]

Razón social y datos fiscales confirmados · dirección · teléfono · correo · catálogo de productos · fabricantes/marcas representadas (y autorización de uso de sus logos) · certificaciones (COFEPRIS, ISO) · descripción real del servicio de asistencia técnica en quirófano · historia de la empresa · fotografía propia · vector del logo · dominio definitivo · aviso de privacidad (LFPDPPP) · si se requiere gate HCP · la carpeta de 34 elementos.

## 9. Riesgos de licencias

- **Pinterest**: obras de terceros (Henigsman 1975, póster Bauhaus, etc.). Solo estudio; nunca publicar ni calcar. `references/` está en `.gitignore`.
- **Enovis**: marca y fotografía protegidas; solo análisis funcional.
- **Modelos anatómicos 3D**: no se ha incorporado ninguno. F03 es geometría procedural propia (sin riesgo). Si se usa BodyParts3D (CC BY-SA 2.1 JP → atribución + share-alike sobre el modelo derivado) o NIH 3D (licencia por modelo), registrar en `06-assets-and-licensing.md`.

## 10. Recomendaciones

1. Pedir a FIARIL la carpeta de 34 elementos y el logo vectorial antes de la Fase 3.
2. Re-ejecutar el UX Analyzer sobre Enovis atravesando el gate.
3. Construir la arquitectura de información a partir del benchmark (más fiable que el analizador).
4. Hero a partir de F03 (Raster Anatomy + órbitas), que además es el experimento más ligero.
