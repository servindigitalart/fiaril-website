# 06 — Assets & Licensing

| Asset | Origen | Licencia | Publicado | Notas |
|---|---|---|---|---|
| `src/assets/logo-fiaril.jpeg` | FIARIL (`logo/`) | Propiedad de FIARIL | Sí (WebP 120 px) | Copia sin modificar. Pedir SVG |
| Manrope Variable | Fontsource / Google Fonts | SIL OFL 1.1 | Sí (woff2 local) | |
| Geometría F03 (rodilla) | Procedural, propia | — | Sí (generada en cliente) | Abstracción, no clínica |
| `references/pinterest images/*` | Pinterest (terceros) | Desconocida / derechos reservados | **No** | Solo estudio. Ignorado por Git |
| `references/sites/enovis-surgical.com/*` | Captura de Enovis | © Enovis | **No** | Solo análisis. Ignorado por Git |

## Creative Direction V2 (2026-11-24)

| Asset | Origen | Licencia | Publicado | Notas |
|---|---|---|---|---|
| `src/assets/renders/{hip,instrument,consumables}.png` | Propio: render de `src/three/models.ts` | Propiedad del proyecto | Sí (AVIF/WebP) | «Visualización conceptual». Geometría genérica, sin dimensiones reales |
| `src/assets/imaging/knee-lateral.jpg` | [Wikimedia Commons: Postoperative X-ray of normal knee prosthesis, lateral view](https://commons.wikimedia.org/w/index.php?curid=79909105), Mikael Häggström, M.D. | **CC0** (verificado en la API de Commons) | Sí (WebP) | Recortada. Consentimiento informado del paciente documentado por el autor. «Imagen ilustrativa» |
| `src/assets/imaging/hip-ap.jpg` | [Wikimedia Commons: X-ray of pelvis with total arthroplasty](https://commons.wikimedia.org/w/index.php?curid=80622115), Mikael Häggström, M.D. | **CC0** (verificado en la API de Commons) | Sí (WebP) | Recortada al lado de la prótesis, sin la zona central. Consentimiento documentado. «Imagen ilustrativa» |
| Three.js 0.187.0 | npm `three` | MIT | Sí (chunk diferido) | Dependencia de runtime |

**Descartadas:** «Tweezers made of martensitic stainless steel» y «Medical instrument Scalpel 01» (CC0) llevan marcas de fabricante grabadas. «Postoperative X-ray of normal knee prosthesis, AP view» (CC0): al quitar la regla y las marcas el recorte partía el implante. Unsplash y Pexels requieren credenciales de API y no se usaron.

## Candidatos evaluables (no incorporados)

| Fuente | Licencia típica | Implicación |
|---|---|---|
| BodyParts3D (DBCLS) | CC BY-SA 2.1 JP | Atribución visible + el modelo derivado hereda BY-SA |
| NIH 3D | Varía por modelo (muchos CC BY / CC0) | Verificar modelo a modelo |
| Z-Anatomy | CC BY-SA 4.0 | Igual que BodyParts3D (deriva de él) |
| Sketchfab | Varía; muchas NC | Descartar NC (uso comercial) |

Regla: ningún asset entra en `src/` sin una fila en esta tabla.
