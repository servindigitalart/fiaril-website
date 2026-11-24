# 06 — Assets & Licensing

| Asset | Origen | Licencia | Publicado | Notas |
|---|---|---|---|---|
| `src/assets/logo-fiaril.jpeg` | FIARIL (`logo/`) | Propiedad de FIARIL | Sí (WebP 120 px) | Copia sin modificar. Pedir SVG |
| Manrope Variable | Fontsource / Google Fonts | SIL OFL 1.1 | Sí (woff2 local) | |
| Geometría F03 (rodilla) | Procedural, propia | — | Sí (generada en cliente) | Abstracción, no clínica |
| `references/pinterest images/*` | Pinterest (terceros) | Desconocida / derechos reservados | **No** | Solo estudio. Ignorado por Git |
| `references/sites/enovis-surgical.com/*` | Captura de Enovis | © Enovis | **No** | Solo análisis. Ignorado por Git |

## Candidatos evaluables (no incorporados)

| Fuente | Licencia típica | Implicación |
|---|---|---|
| BodyParts3D (DBCLS) | CC BY-SA 2.1 JP | Atribución visible + el modelo derivado hereda BY-SA |
| NIH 3D | Varía por modelo (muchos CC BY / CC0) | Verificar modelo a modelo |
| Z-Anatomy | CC BY-SA 4.0 | Igual que BodyParts3D (deriva de él) |
| Sketchfab | Varía; muchas NC | Descartar NC (uso comercial) |

Regla: ningún asset entra en `src/` sin una fila en esta tabla.
