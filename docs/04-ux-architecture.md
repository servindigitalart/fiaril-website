# 04 — UX Architecture (borrador · Fase 3)

## Navegación

Header: logo · Soluciones · Productos · Servicio técnico · Recursos · Nosotros · **[Contacto institucional]** (botón persistente, patrón OssDsign). "Inicio" vive en el logo. Móvil: `<details>`/dialog nativo, sin librería.
Footer: navegación secundaria · Careers · Privacidad · Avisos legales · Certificaciones [P] · datos confirmados [P].

## Homepage — orden y fuente de cada patrón

| # | Sección | Patrón tomado de | Estado contenido |
|---|---|---|---|
| 01 | Hero Living Matrix + 2 CTAs | F03; doble CTA (Corin: institución vs. quirófano) | Titular: propuestas en 03 |
| 02 | Introducción institucional | Enovis "We're…" | [P] |
| 03 | Soluciones (4 áreas) | Cuadrícula Enovis, sin conteo hasta tener catálogo | Categorías [H] |
| 04 | Productos | Organización anatómica (Bonebridge) | 🔒 sin catálogo |
| 05 | Asistencia técnica | Flujo quirúrgico (Brainlab) + F04 | Alcance [P] |
| 06 | Proceso operativo | Tríada de verbos (Corin) → 5 pasos del brief | Etapas [H] |
| 07 | Fabricantes | — | 🔒 solo marcas autorizadas |
| 08 | Recursos | Repositorio documental (Enovis) | 🔒 |
| 09 | Nosotros | — | [P] |
| 10 | Careers | Candidatura espontánea (Bonebridge) | Si FIARIL lo habilita |
| 11 | Contacto | Formulario directo (Bonebridge) vía Netlify Forms | Datos [P] |

Regla de render: una sección bloqueada no se publica vacía; se oculta o muestra un estado "en preparación" explícito. Nunca "0 productos" (error de Enovis).

## Abierto

- ¿Gate HCP (COFEPRIS) para fichas de producto? Ver `00` §4.
- Idiomas: solo español por ahora (D-009).
