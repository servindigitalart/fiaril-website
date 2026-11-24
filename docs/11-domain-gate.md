# 11 — Separación DEMO / dominio oficial

Fecha: 2026-11-24 · Decisión: D-023.

## Estado verificado antes del cambio (solo lectura)

- `fiarilorthopedics.com.mx` ya es un dominio personalizado del mismo sitio de Netlify (`fiaril-orthopedics`). Nameservers de Cloudflare en modo DNS-only; el apex apunta al balanceador de Netlify (`75.2.60.5`, `99.83.231.61`) y `www` es un CNAME a `fiaril-orthopedics.netlify.app` con 301 al apex.
- HTTPS: certificado Let's Encrypt para el apex y `www`, válido hasta el 22/02/2027. `http` redirige a `https`.
- MX: `smtp.google.com` (Google Workspace).
- **El dominio oficial servía el sitio de desarrollo completo, incluido `/lab/`.** Lo seguirá haciendo hasta que este cambio se despliegue.

Nada de lo anterior se ha modificado: ni DNS, ni nameservers, ni Cloudflare, ni Google Workspace, ni los dominios en Netlify.

## Arquitectura

| Pieza | Función |
|---|---|
| `netlify/edge-functions/domain-gate.ts` | Edge Function en `/*` (excluye `/.netlify/*` y `/.well-known/*`). Si el host es `*.netlify.app` o `localhost`, no hace nada. Con cualquier otro host, todo lo que no esté bajo `/maintenance/` se reescribe a `/maintenance/` (200, la URL no cambia) |
| `src/pages/maintenance.astro` | Página temporal autocontenida: CSS y JS en línea, sin nada de `/_astro/` |
| `public/maintenance/` | Logo (variante de tamaño de `logo/new-logo.png`), favicon de 32 px y `apple-touch-icon` (de `logo/favicon.png`) y Manrope latin (OFL) |
| `tests/domain-gate.test.ts` | Prueba de la lógica de enrutado (`node tests/domain-gate.test.ts`) |

Decisiones:
- **Fallo cerrado.** La lista abierta son los hosts de Netlify, no la lista de dominios oficiales. Un alias nuevo que se añada en el futuro mostrará la página temporal, nunca el sitio de desarrollo.
- **Sin bucles.** La reescritura apunta a `/maintenance/`, que está permitido, y la segunda pasada devuelve `undefined`.
- **Sin SSR ni adaptador.** Netlify empaqueta `netlify/edge-functions/` con independencia del framework; Astro sigue generando un sitio estático.
- **Certificados.** `/.well-known/*` queda excluido para no interferir con la renovación ACME.
- **`/maintenance/` también existe en el subdominio Netlify**, con `noindex`. Es inofensivo y permite revisarla antes del lanzamiento.
- **Coste.** La función se ejecuta en cada petición, incluidas las de `*.netlify.app` (allí apenas compara el hostname). En el sitio actual el volumen de invocaciones es despreciable.

## Activar el sitio completo en el dominio oficial

Cambio controlado, revisable en Git:

1. Eliminar `netlify/edge-functions/domain-gate.ts`. Opcionalmente, también `tests/domain-gate.test.ts`, `src/pages/maintenance.astro` y `public/maintenance/`, o conservarlos como página de mantenimiento futura.
2. Quitar `noindex` de `src/layouts/Base.astro` si el lanzamiento incluye indexación (D-008) y cambiar `site` en `astro.config.mjs` a `https://fiarilorthopedics.com.mx`.
3. `npm run build`, commit y push. El despliegue continuo publica el cambio; las Edge Functions forman parte del deploy atómico.
4. Comprobar con `curl -s https://fiarilorthopedics.com.mx/ | grep '<title>'` que se sirve la home.

**Revertir:** «Rollback» al deploy anterior en Netlify (incluye las Edge Functions) o `git revert` del commit de activación.

## Validación tras el despliegue (pendiente de autorización)

```sh
for h in fiarilorthopedics.com.mx www.fiarilorthopedics.com.mx fiaril-orthopedics.netlify.app; do
  for p in / /lab/ /lab/f03-living-anatomy/ /maintenance/logo.webp; do
    printf '%-32s %-28s ' $h $p; curl -sL -o /tmp/b -w '%{http_code} %{content_type}' https://$h$p; echo " maint=$(grep -c 'Estamos afinando' /tmp/b)"
  done
done
```

Resultado esperado: maint=1 en todas las páginas de los dominios oficiales; maint=0 y el contenido original en `netlify.app`.
