# 10 — Fase 1: fundamentos de producto y diseño

Fecha: 2026-11-24 · Node 22.23.5 · Astro 7.4.13 · Decisiones: D-015 a D-022.

## 1. Entregables

| Archivo | Qué es |
|---|---|
| `PRODUCT.md` | Verdad de producto (impeccable `init`): usuarios, propósito, posicionamiento, voz, principios. Hechos [C] y pendientes [P] separados |
| `DESIGN.md` | Sistema de diseño (formato DESIGN.md: frontmatter de tokens + 8 secciones canónicas) |
| `.impeccable/design.json` | Sidecar de Impeccable: rampas tonales OKLCH, motion, breakpoints, 5 componentes de referencia, narrativa |
| `src/styles/global.css` | Tokens refactorizados en capas; todos los nombres anteriores se conservan |
| `.npmrc` | `engine-strict=true` |
| `docs/DECISIONS.md` | D-015 a D-022 |
| `docs/02-brand-system.md` | Marcado como sustituido por `DESIGN.md` (contenido sin cambios) |

## 2. Entrevista de `init` (respuestas del equipo)

- Audiencia prioritaria: **compras institucionales**; cirujanos y quirófano son la audiencia secundaria.
- Datos del benchmark: **no usar** (D-016).
- Tratamiento: **impersonal + usted**.

## 3. Tokens incorporados

Primitivos (sin cambios) → semánticos → utilidades. Añadidos:

- **Color:** `--color-text-muted`, `--color-border-control`, `--color-on-primary`, `--color-focus` y la superficie `.surface-inverse`, que reasigna todos los semánticos (acento amarillo, foco amarillo, botón invertido).
- **Tipo:** `--step-5` (display) y los tokens de peso, interlineado y tracking (`--weight-*`, `--leading-*`, `--tracking-*`), más la utilidad `.display`.
- **Espacio y retícula:** `--space-2xs`, `--space-2xl`, `--grid-columns` (4 → 6 → 12) y `--grid-gap`.
- **Forma:** `--radius-pill`, `--border-width`, `--focus-width`, `--focus-offset`.
- **Elevación y capas:** `--shadow-overlay` y `--z-canvas` … `--z-skip`.
- **Motion:** `--ease-out`, `--ease-in-out`, `--ease-drawer`, `--dur-press`, `--dur-hover`, `--dur-ui`, `--dur-panel`, `--dur-reveal` y `--press-scale`.
- **Breakpoints:** 40, 64 y 90 em, documentados como literales (las custom properties no funcionan dentro de `@media`).

Cambios de comportamiento deliberados (D-020): el hover de `.btn` dura 160 ms y solo se aplica en dispositivos con hover real; se añade el press `scale(.97)` y `touch-action: manipulation`; `html` declara `color-scheme: light`.

## 4. Node: diagnóstico y solución

**Causa.** `~/.zshrc` (línea 15) ya antepone `~/.local/share/node/node-v22.23.5-darwin-x64/bin` al PATH, pero zsh solo lee `.zshrc` en shells **interactivas**. Los procesos no interactivos (agentes, tareas del IDE, scripts, apps GUI) heredan `/usr/local/bin/node` 22.16.0, y `astro build` aborta con: «Node.js v22.16.0 is not supported by Astro! … >=22.23.4».

**En el repo (hecho):**
- `.nvmrc` = 22.23.5 (ya existía; lo leen nvm, fnm y Netlify).
- `engines.node` = `>=22.23.4` (ya existía).
- `netlify.toml` → `NODE_VERSION = "22.23.5"` (ya existía; el build de producción no se ve afectado).
- **Nuevo:** `.npmrc` `engine-strict=true`. Verificado: con 22.16 `npm install` falla en el acto con `EBADENGINE` («Required: >=22.23.4, Actual: v22.16.0»); con 22.23.5 funciona.

**En la máquina (pendiente de autorización, no se ha tocado):** la opción recomendada es mover la línea del PATH de `~/.zshrc` a `~/.zshenv`, que zsh lee en todas las shells:

```sh
echo 'export PATH="$HOME/.local/share/node/node-v22.23.5-darwin-x64/bin:$PATH"' >> ~/.zshenv
```

Alternativas: instalar el `.pkg` oficial 22.23.5 (sustituye `/usr/local/bin/node` y requiere sudo), o fnm desde su binario de GitHub con `fnm use` automático por `.nvmrc`.

## 5. Validación

| Prueba | Método | Resultado |
|---|---|---|
| Build | `npm run build`, Node 22.23.5 | ✅ 6 páginas, sin avisos |
| Rutas | Playwright, 6 rutas × 1440×900 y 390×844 | ✅ 12/12 HTTP 200, 0 errores de consola, sin overflow, Manrope cargada |
| Regresión visual | Capturas de página completa antes y después (reduced-motion, frame determinista) + diff píxel a píxel | ✅ **12/12 idénticas** (incluye F01–F04). Se verificó que el servidor servía el CSS nuevo |
| Superficie inversa | Estilos computados de `.surface-inverse` | ✅ fondo `#07253F`, texto `#F7F7F7`, foco `#F3B234`, botón mineral/navy |
| Accesibilidad | axe-core (wcag2a/aa, 21aa, 22aa) en las 6 rutas | ✅ 0 violaciones |
| Impeccable | `impeccable detect --json src` | ✅ 0 hallazgos |
| Activos originales | SHA-256 + mtime de `logo/*`; `git diff` | ✅ sin modificar (JPEG sin diff; PNG con fecha anterior a la sesión) |

SHA-256 de referencia: `new-logo.png` 111d37c0…bf718 · `favicon.png` 034f0f9e…535d8 · `logo-fiaril.jpeg` f2d330dd…7966d.

Las herramientas de QA (Playwright 1.64.1 + @axe-core/playwright 4.14.0) se usaron desde fuera del repo; entran como devDependencies en la fase de QA.

**Límites:** sin pruebas en Safari/Firefox ni en dispositivos físicos. Los cambios de hover y press no aparecen en capturas estáticas.

## 6. Pendiente

- Orden de la shell para Node (§4).
- Si `.claude/skills/`, `.agents/skills/` y `skills-lock.json` entran al repositorio.
- Lockup para el header: el logo completo necesita unos 136 px de alto de contenido para que la línea «Orthopedi i rörelse» siga legible (DESIGN.md › Logo). En un header compacto solo cabe el isotipo (`favicon.png`). Es una decisión de Fase 2.
- Todo el contenido [P] de `PRODUCT.md`.
