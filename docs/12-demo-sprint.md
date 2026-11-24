# 12 — Sprint de demo

Fecha: 2026-11-24 · Decisiones: D-024 a D-030 · Estado: implementado y probado en local, **sin publicar**.

> Actualizado por `13-excellence-sprint.md`: el formulario ya no hace POST y muestra el estado «recepción en preparación» (D-031).

## Qué se construyó

| Área | Implementación |
|---|---|
| Header | `src/components/SiteHeader.astro`: dos estados (top con logo completo en la home a ≥ 64 em; compact con isotipo), navegación con «estás aquí», CTA permanente y menú móvil en `<dialog>` |
| Hero | `src/pages/index.astro` + `src/lab/f05-precision-field.ts`: copy aprobado, dos CTA, firma, campo F05 y botón de pausa |
| Nosotros | Enunciado y ficha técnica (`<dl>`) con líneas finas que se dibujan al entrar en pantalla |
| Especialidades | Índice editorial de las tres líneas confirmadas; cada fila abre el formulario con la línea preseleccionada; nota de catálogo en preparación |
| Acompañamiento técnico | Momento «quirófano nocturno»: superficie navy y lámpara halftone que sigue al cursor (CSS, sin canvas) |
| Contacto | Formulario de cotización (Netlify Forms) con validación accesible y estados de envío, error y éxito |
| Footer | `src/components/SiteFooter.astro`: logo completo sobre mineral, firma, navegación, privacidad y Lab |
| Páginas | `/privacidad/` (aviso pendiente, sin texto inventado) y `404` |
| Lab | F05 añadido (`/lab/f05-precision-field/`); F01–F04 sin cambios de comportamiento |
| Activos | `src/assets/logo-fiaril-full.png` e `isotype.png` (recortes de los originales aprobados, optimizados por Astro a WebP de 1 a 23 KB), `public/favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `og.png` |

## Verificación

| Prueba | Resultado |
|---|---|
| Build | ✅ 10 páginas, sin avisos |
| Rutas × 2 viewports (`/`, `/privacidad/`, 404, `/lab/`, F01–F05, `/maintenance/`) | ✅ Códigos correctos, 0 errores de consola, 0 respuestas 4xx/5xx, sin overflow horizontal |
| axe (WCAG 2.2 AA) en las 10 rutas × 2 viewports | ✅ 0 violaciones |
| Regresión de F01–F04 frente a `754e9a5` (canvas con reduced-motion, escritorio y móvil) | ✅ 8/8 idénticos bit a bit |
| Teclado | ✅ El orden empieza por el skip link; foco visible en todos los elementos |
| Menú móvil | ✅ Abre, se cierra con Esc (el foco vuelve a «Menú") y al pulsar un enlace navega y se cierra |
| Formulario | ✅ Los envíos vacíos muestran 6 errores con el foco en el primero; detecta correos inválidos; preselecciona la línea; sin backend muestra un error honesto y conserva los datos |
| Hero | ✅ Animado con normalidad; estático y sin botón de pausa con reduced-motion; la pausa congela el campo; mediana de 16.7 ms por frame y p95 de 33 ms a DPR 2 (MacBook Pro de 2015) |
| Responsive | ✅ 1920, 1440, 1280, 768, 390 y 844 × 390 en horizontal |
| Domain gate | ✅ Test unitario superado; `netlify/`, `maintenance.astro` y `public/maintenance/` sin cambios; la página temporal sigue sin referencias a `/_astro/` |
| `impeccable detect` | 2 avisos de `#000` en `mask-image`: es el canal alpha de la máscara, no un color visible (falso positivo) |
| `npm audit` | 0 vulnerabilidades |

**No verificado:** Safari, Firefox, dispositivos físicos y la recepción real de Netlify Forms (necesita deploy y que la detección de formularios esté activada).

## Pendiente para presentar

- **El formulario no recibe envíos hasta que se active la detección de formularios en Netlify.** Mientras tanto, enviar muestra «No se pudo enviar la solicitud…». No se simula el éxito.

## Pendiente para publicar en el dominio oficial

1. Contenido de FIARIL: especialidades o catálogo, datos de contacto, razón social y domicilio para el aviso de privacidad (LFPDPPP), alcance del acompañamiento técnico y la consulta COFEPRIS.
2. Aviso de privacidad real antes de recibir datos personales.
3. Activar Netlify Forms y definir quién recibe las notificaciones.
4. Pruebas en Safari, Firefox e iOS/Android reales.
5. Procedimiento de `docs/11-domain-gate.md` § Activar (eliminar el gate, quitar `noindex`, `site` al dominio oficial).
