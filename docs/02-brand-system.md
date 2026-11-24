# 02 — Brand System

> **Sustituido por `DESIGN.md` (2026-11-24).** Se conserva como historial; ante cualquier discrepancia manda `DESIGN.md`.

Fuente de verdad: `src/styles/global.css`. Este documento explica el porqué; no duplica valores salvo la paleta.

## Paleta

Muestreada del logo original (ver `00-source-audit.md` §3). Sustituye a los valores provisionales del brief.

| Token primitivo | Hex | Provisional del brief | Rol |
|---|---|---|---|
| `--orbital-navy` | `#07253F` | `#102B43` | Estructura, texto, plancha clave |
| `--signal-red` | `#B1282F` | `#C9283B` | Actividad, estado, foco |
| `--energy-yellow` | `#F3B234` | `#F2B735` | Interacción, energía (nunca texto) |
| `--titanium-grey` | `#72767F` | `#858991` | Nodos, metadatos grandes |
| `--graphite` | `#222222` | `#171C22` | Reservado (punto negro del isotipo) |
| `--mineral` | `#F7F7F7` | `#F5F4F0` | Superficie = fondo del JPEG del logo |
| `--white` | `#FFFFFF` | — | Superficie elevada |

Semánticos: `--color-primary` navy · `--color-secondary` titanium · `--color-accent` red · `--color-energy` yellow · `--color-surface` mineral · `--color-text` navy · `--color-muted` `#5B5F67` · `--color-border` navy 14 %.

**Contraste (WCAG 2.2, sobre `#F7F7F7`)**: navy 14.6:1 · red 6.1:1 · muted `#5B5F67` 6.0:1 (AA texto normal) · titanium `#72767F` 4.25:1 (solo ≥ 18.66 px bold / 24 px) · yellow 1.75:1 (**nunca** texto ni borde funcional).

**Reglas**: navy domina; rojo y amarillo nunca juntos en un mismo componente de UI (sí en assets generativos, donde la interferencia es el tema); el rojo marca "algo está ocurriendo" (partícula en tránsito, cresta de onda, foco).

## Tipografía

**Manrope Variable** (OFL), local vía `@fontsource-variable/manrope`; solo se descarga el subset latin (25 kB) gracias a `unicode-range`.

| Uso | Peso | Notas |
|---|---|---|
| Texto largo | 400 | `line-height 1.6`, medida 62ch |
| Navegación, botones | 500 | |
| Titulares | 600 | tracking −0.02 / −0.035em en h1 |
| Llamadas puntuales | 700 | |
| `.label` técnica | 600 | mayúsculas, +0.12em, `tabular-nums` |

Escala fluida `--step--1` … `--step-4` (0.8 → 5.25 rem) con `clamp()`, sin breakpoints.
**IBM Plex Mono descartada por ahora** (ver DECISIONS D-004): `.label` con `tabular-nums` cubre códigos y metadatos. Reevaluar si aparecen tablas de especificaciones con referencias alfanuméricas largas.
El logotipo conserva su tipografía original (se usa la imagen, nunca se compone en Manrope).

## Retícula y espaciado

- Contenedor `.wrap`: máx. 90 rem, gutter fluido 1 → 2.5 rem (16 px en móvil).
- Espaciado `--space-xs … xl`; los saltos entre secciones (`--space-xl`) son deliberadamente grandes: el ritmo editorial compensa la densidad de las tramas.
- Radio `2px`: técnico, casi recto. Excepción: botones pill (patrón institucional reconocible).
- Divisores de 1 px en `--color-border` en lugar de sombras.

## Interacción

- Easing único `--ease-out` (cubic-bezier .22,1,.36,1), 300 ms.
- Botón primario navy relleno → contorno en hover; `min-height: 44px` (target táctil).
- Foco visible: contorno rojo 2 px, offset 3 px.
- `prefers-reduced-motion`: transiciones CSS anuladas; canvas renderizan un frame estático.

## Tratamiento de imagen

- Producto real (cuando exista): fondo neutro, sin halftone encima: el producto es protagonista.
- Halftone / partículas: solo en assets generativos, nunca sobre fotografía de producto ni de personas reales.
- Texto nunca sobre trama activa: siempre sobre un panel `--color-surface` sólido.

## Contenido pendiente

Clase `.pending` (contorno rojo discontinuo) para marcar visualmente cualquier placeholder en revisión.
