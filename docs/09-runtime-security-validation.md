# 09 — Runtime Security & Creative Lab Validation (Fase 2.5)

Fecha: 2026-11-24 · Equipo de pruebas: MacBookPro11,5 (2015) · i7-4870HQ · Intel Iris Pro + AMD R9 M370X · pantalla Retina 2880×1800 · macOS 12 · Chrome estable.

## Versiones

| | Antes | Después |
|---|---|---|
| Node.js | 22.16.0 (`.pkg` oficial, `/usr/local/bin`) | **22.23.5** LTS "Jod" (tarball oficial, `~/.local/share/node/node-v22.23.5-darwin-x64`) |
| npm | 10.9.2 | 10.9.9 |
| Astro | 6.4.8 | **7.4.13** |
| Vite | 7.x (vía Astro 6) | 8.3.8 |
| sharp | 0.34.5 (libvips 1.2.4) | 0.35.5 (libvips 1.3.4) |
| esbuild | 0.25.x | 0.28.2 |
| @fontsource-variable/manrope | 5.3.0 | 5.3.0 (sin cambios) |
| Netlify CLI | 27.20.1 | 27.20.1 (verificada con Node 22.23.5) |

Declaración en el proyecto: `.nvmrc` = `22.23.5` · `package.json` `engines.node` = `>=22.23.4` (mínimo de Astro 7) · `netlify.toml` `NODE_VERSION = "22.23.5"`.

## Instalación de Node — qué se hizo y por qué

- No había gestor de versiones (ni nvm, fnm, Volta ni Node de Homebrew). Node 22.16.0 venía del instalador `.pkg` (propiedad de root).
- **Intento 1, fnm vía Homebrew → abortado.** Homebrew en macOS 12 no tiene binarios precompilados y empezó a compilar cmake desde fuente (y después tocaría Rust). Lo interrumpí con SIGINT y la compilación parcial de cmake 4.5.1 se descartó. **Efectos secundarios que quedan** (dependencias que Homebrew instaló antes del corte, inofensivas): `ca-certificates` 2026-11-05, `libssh2` 1.11.1_7 y `openssl@4` 4.1.0 (nuevo). Se pueden quitar con `brew uninstall openssl@4` si no los usa nada más.
- **Método final:** tarball oficial `node-v22.23.5-darwin-x64.tar.gz` de nodejs.org, con **SHA-256 verificado contra `SHASUMS256.txt`** (servido por HTTPS; la firma GPG no se verificó porque `gpg` no está instalado). Se instaló en el directorio del usuario. **`/usr/local/bin/node` 22.16.0 sigue intacto** como respaldo.
- Pendiente de tu decisión: cómo activarlo por defecto (ver "Riesgos").

## Advisories resueltos

`npm audit`: antes **3** (1 crítica, 1 alta, 1 baja) → después **0**.

| Paquete | Advisory | Gravedad | Corregido en | ¿Nos afectaba en la práctica? |
|---|---|---|---|---|
| astro | GHSA-26w7-cxv4-gfx2 RCE en la optimización de imágenes AVIF | crítica | 7.2.8 | Solo procesando AVIF no confiables al compilar; nosotros solo procesamos un JPEG propio |
| astro | GHSA-7pw4-f3q4-r2p2 XSS vía directivas `transition:*` en islas | baja | 7.0.4 | No (sin islas) |
| astro | GHSA-f48w-9m4c-m7f5 XSS vía nombres de atributos spread | baja | 7.0.5 | No (sin spread de datos externos) |
| astro | GHSA-4g3v-8h47-v7g6 XSS en propiedades de animación de View Transitions | media | 7.1.0 | No (sin View Transitions) |
| astro | GHSA-98hj-9722-w3j8 XSS en `<script>`/`<style>` dinámicos | media | 7.3.2 | No |
| astro | GHSA-mh32-jxcr-mh9f XSS vía nombres de etiqueta dinámicos | baja | 7.4.5 | No |
| astro | GHSA-376h-93r7-7g6f bypass de autorización con `base` | media | 7.2.4 | No (estático, sin `base`) |
| sharp | CVEs de libvips (CVE-2026-33327/33328/35590/35591), libheif, librsvg | alta | 0.35.5 | Solo en build, con imágenes propias |
| esbuild | Lectura arbitraria de archivos del servidor de desarrollo en Windows | baja | 0.28.x | No (macOS) |

Además, Node 22.23.5 es un *security release*: 22.16.0 arrastraba las correcciones de Node publicadas entre mayo y noviembre de 2026.

Advisories de paquetes que **no usamos** (adaptadores `@astrojs/node`, `@astrojs/netlify`, `@astrojs/vercel`, svelte/solid, prism, rss): no aplican. La arquitectura sigue siendo 100 % estática, sin adaptador.

## Cambios de dependencias

- `npm install astro@7.4.13`: el lockfile pasa de 0 a 87 paquetes añadidos, 115 eliminados y 40 cambiados. Rollup se sustituye por Rolldown (Vite 8), `@astrojs/compiler` (Go/WASM) por `@astrojs/compiler-rs` (Rust) y Markdown pasa de remark a Sätteri.
- `npm audit fix` **sin `--force`**: solo sube esbuild 0.27.7 → 0.28.2, dentro del rango que declara Vite 8 (`^0.27.0 || ^0.28.0`). Previsualizado antes con `--dry-run`.
- `npm prune`: eliminado `tslib`, que había quedado huérfano.

**Breaking changes de Astro 7 revisados** (guía oficial de migración): compilador Rust estricto con HTML inválido, `compressHTML` por defecto `'jsx'` (puede eliminar espacios entre elementos inline), Vite 8, flags experimentales eliminados, `src/fetch.ts` reservado y `@astrojs/db` eliminado. Ninguno rompe este proyecto: el build sale limpio, sin avisos, y las capturas son idénticas píxel a píxel.

## Pruebas

| Prueba | Método | Resultado |
|---|---|---|
| Build de producción | `astro build` con Node 22.23.5 | ✅ 6 páginas, sin avisos |
| Rutas | 6 rutas × escritorio y móvil | ✅ todas HTTP 200, 0 respuestas ≥ 400 |
| Manrope | `document.fonts` (estado `loaded`) | ✅ "Manrope Variable" en todas |
| Consola | `pageerror` + `console.error` | ✅ 0 errores |
| Responsive | `scrollWidth` vs `innerWidth`, 390 px y 1440 px | ✅ sin overflow horizontal |
| Regresión visual | reduced-motion (frame determinista) antes y después, diff de píxeles | ✅ **12/12 idénticas** |
| Reduced motion | incluido en lo anterior: frame estático | ✅ |
| Interacción ratón/táctil | reloj falso + diff con entrada vs. sin entrada, comparado con el ruido sin entrada | ✅ 8/8 (F02 con ratón confirmado visualmente: el ruido de fase es alto) |
| Auditoría de dependencias | `npm audit` | ✅ 0 vulnerabilidades |

La primera versión del test de interacción **no era válida**: dos ejecuciones sin entrada ya diferían, porque `IntersectionObserver` arranca el loop en tiempo real y el reloj falso no lo controla. Se rehízo comparando magnitudes contra ese ruido.

## Rendimiento (resumen; detalle en 07)

- Los cuatro experimentos siguen funcionando con los mismos fps que antes de la actualización.
- El JS ocupa 2–4 ms por frame y el hilo principal está ocioso el 75–92 %. El cuello de botella es el **rasterizado de Canvas 2D en la GPU** (Skia), no el JS.
- Una sonda WebGL desechable que reproduce la carga de F02 da **60 fps a DPR 2**, frente a 11 fps de F02 en Canvas 2D.

## Riesgos pendientes

1. **Node 22.23.5 no es todavía el Node por defecto.** Opciones (decisión tuya):
   a. Instalar el `.pkg` oficial de 22.23.5 (sustituye `/usr/local/bin/node`; requiere `sudo`). Es lo más simple.
   b. Mantener el tarball y añadir `export PATH="$HOME/.local/share/node/node-v22.23.5-darwin-x64/bin:$PATH"` a `~/.zshrc`.
   c. Instalar fnm desde su binario oficial de GitHub (no desde Homebrew en este macOS).
   Mientras tanto, `npm run build` con el Node del sistema falla por el `engines` de Astro 7.
2. Sin verificación GPG de `SHASUMS256.txt` (solo HTTPS + SHA-256).
3. macOS 12 ya no recibe binarios de Homebrew: cualquier `brew install` compila desde fuente.
4. Rendimiento no medido en un teléfono real.
5. Astro 7 sale con mucha frecuencia (13 parches en 4 semanas): conviene revisar `npm audit` en cada fase.
