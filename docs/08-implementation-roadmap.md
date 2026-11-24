# 08 — Implementation Roadmap

| Fase | Entregable | Estado |
|---|---|---|
| 0 Source audit | `00-source-audit.md` | ✅ |
| 1 Brand system | tokens en `global.css`, `02-brand-system.md` | ✅ base (falta: logo vectorial, versión negativa) |
| 2 Creative Lab | F01–F04 en `/lab/` | ✅ F01–F04 · ⏳ F05 |
| 2.5 Runtime & validación | Node 22.23.5, Astro 7.4.13, auditoría 0, perfil de rendimiento, `09-runtime-security-validation.md` | ✅ |
| 3 UX & arquitectura | `04-ux-architecture.md` + wireframes | ⏳ siguiente · borrador de IA listo |
| 4 Componentes | Header/nav completo, footer, cards, labels, grid | ⏳ |
| 4b Renderer WebGL | `dots()` en WebGL2 con fallback a Canvas 2D (D-012) | ⏳ antes de que F01/F02/F04 entren en la homepage |
| 5 Homepage | Hero Living Matrix (F03) + secciones | ⏳ |
| 6 Páginas internas | Según el contenido real recibido | 🔒 bloqueado por contenido |
| 7 QA | Playwright en el repo (los scripts de 2.5 son la base), Lighthouse, axe | ⏳ |
| 8 Netlify preview | `netlify init` + deploy preview | 🔒 requiere autorización |

## Bloqueos externos (FIARIL)

1. Carpeta de 34 elementos y logo en SVG.
2. Catálogo, fabricantes autorizados y certificaciones.
3. Datos de contacto y razón social confirmados.
4. Alcance real del servicio técnico en quirófano.

## Decisiones pendientes del equipo

1. Método para activar Node 22.23.5 por defecto (09 § Riesgos): `.pkg` oficial, PATH en `~/.zshrc` o fnm binario.
2. Elegir la dirección del hero tras revisar F01–F04.

## Próximos pasos técnicos

1. Fase 3: wireframes de la homepage con placeholders `.pending`.
2. Fase 4b (renderer WebGL) en paralelo a la Fase 4, medida con `perf` antes y después.
3. Medir en un teléfono real (Android de gama media + iPhone).
