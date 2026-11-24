# Decisions

| ID | Fecha | Decisión | Motivo | Revisar cuando |
|---|---|---|---|---|
| D-001 | 2026-11-24 | Paleta tomada del logo, no del brief | Valores muestreados son la identidad real | Llegue el SVG (valores exactos) |
| D-002 | 2026-11-24 | ~~Astro 6.4.8~~ → **sustituida por D-010** | Astro 7 exigía Node ≥ 22.23.4 | — |
| D-003 | 2026-11-24 | Canvas 2D nativo, sin Three.js | F03 (≤ 5.2 k puntos con proyección 3D manual) a 60 fps; 0 kB de dependencias | Ver D-012 |
| D-004 | 2026-11-24 | Sin IBM Plex Mono | `.label` (Manrope 600, mayúsculas, tabular-nums) cubre metadatos | Aparezcan tablas de especificaciones/referencias |
| D-005 | 2026-11-24 | Superficie `#F7F7F7` | Coincide con el fondo del logo JPEG → sin recuadro visible | Llegue logo con transparencia |
| D-006 | 2026-11-24 | `references/` fuera de Git | Material de terceros con derechos; no debe acabar en un remoto | — |
| D-007 | 2026-11-24 | Rodilla procedural en F03 | Sin riesgo de licencia, ~3 kB; rotulada como abstracción | Se valide un modelo con licencia compatible |
| D-008 | 2026-11-24 | `noindex` global | Pre-producción con contenido no validado | Lanzamiento |
| D-009 | 2026-11-24 | Sitio en español | Mercado mexicano (Guanajuato) según benchmark | FIARIL confirme mercados/idiomas |
| D-010 | 2026-11-24 | Node 22.23.5 + Astro 7.4.13 | Cierra 1 crítica (RCE AVIF), XSS de la rama 6 y CVEs de sharp/libvips; `npm audit` = 0. Capturas idénticas píxel a píxel | Cada fase: `npm audit` |
| D-011 | 2026-11-24 | Node desde el tarball oficial (SHA-256 verificado) en `~/.local/share/node`, no desde Homebrew/fnm | Homebrew en macOS 12 compila desde fuente (cmake/Rust, horas). El Node del sistema sigue intacto como respaldo | El usuario elija el método por defecto (ver 09 § Riesgos) |
| D-012 | 2026-11-24 | Render recomendado: `dots()` en WebGL2 propio con fallback a Canvas 2D; líneas y texto en 2D/HTML (híbrido) | Medido: el límite es el raster de paths en la GPU, no el JS. Sonda WebGL 60 fps a DPR 2 frente a 11 fps de F02 en Canvas 2D | Implementar antes de llevar F01/F02/F04 a la homepage. Sin Three.js mientras solo dibujemos puntos |
| D-013 | 2026-11-24 | F03 sin cambios | 60 fps a DPR 1 y 44 a DPR 2 en un equipo de 2015; no es un bug | Medir en el hero real |
| D-014 | 2026-11-24 | `npm audit fix` sin `--force` (esbuild 0.28.2) | Dentro del rango declarado por Vite 8; previsualizado con `--dry-run` | — |
