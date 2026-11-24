# Product

<!-- impeccable:product-schema 1 -->

Leyenda: **[C]** confirmado por el equipo FIARIL / dirección del proyecto · **[P]** pendiente de confirmar con FIARIL. Nada marcado [P] se publica como hecho.

## Platform

web

## Users

**Primario: compras institucionales [C].** Personas de compras, abastecimiento y comités de adquisición de instituciones de salud que evalúan proveedores ortopédicos y solicitan cotizaciones. Cuando haya que elegir (jerarquía de mensajes, CTA, orden de secciones), este público tiene prioridad. Su tarea: entender rápido qué suministra FIARIL, comprobar que es un proveedor serio y pedir una cotización con el menor esfuerzo posible.

**Secundario: cirujanos ortopedistas y personal de quirófano [C].** Influyen en la elección del producto y valoran el acompañamiento técnico durante el procedimiento. Su tarea: saber qué especialidades cubre FIARIL y cómo es el soporte técnico.

No hay investigación de usuarios. Tipos de institución (pública o privada), tamaño y regiones atendidas: [P].

## Product Purpose

FIARIL Orthopedics necesita una plataforma digital institucional y comercial que sustituya su sitio actual, una plantilla Odoo con contenido ficticio. El sitio tiene que funcionar como herramienta comercial real, no solo como pieza de marca.

Objetivos comerciales [C]:
1. Presentar con claridad a FIARIL y lo que hace.
2. Explicar sus especialidades y soluciones.
3. Comunicar sus capacidades y diferenciadores (cuando estén verificados).
4. Facilitar el contacto comercial; la conversión principal es **solicitar cotización**.
5. Permitir descubrir productos y categorías.
6. Construir credibilidad ante profesionales, instituciones y organizaciones del sector salud.
7. Crecer: catálogo ampliable e inglés en el futuro.

Éxito: solicitudes de cotización y contactos de instituciones que llegan con la información necesaria para responderlas. Métricas y objetivos numéricos: [P].

## Positioning

FIARIL es una empresa especializada en soluciones ortopédicas: implantes, equipamiento y consumibles quirúrgicos, con **acompañamiento técnico durante los procedimientos quirúrgicos** [C]. Esa combinación de suministro especializado y presencia técnica en el procedimiento es la base de su propuesta de valor.

Propuesta de valor (formulación aprobada): *tecnología ortopédica y conocimiento especializado al servicio de cada procedimiento.*

No es una clínica, un hospital, una tienda de instrumental ni una farmacéutica, y el sitio no debe parecerlo [C].

**Diferenciadores pendientes de validación [P].** Ninguno se publica hasta que FIARIL lo confirme:
- Alcance real del acompañamiento técnico: especialidades, horarios, cobertura y perfil del personal.
- Tiempos de respuesta y capacidad logística.
- Fabricantes y marcas que distribuye, y si tiene autorización para mostrar sus logos.
- Certificaciones y registros sanitarios.
- Trayectoria e historia de la empresa.

## Operating Context

- Venta B2B a instituciones de salud. Se cotiza; no hay precios públicos ni compra en línea [C].
- Mercado: México. Dominio definitivo `fiarilorthopedics.com.mx` [C]. Ciudad, sede y cobertura geográfica: [P].
- Idioma principal: español. Arquitectura preparada para añadir inglés [C].
- Regulación: la publicidad de dispositivos médicos en México (COFEPRIS) puede exigir avisos o restringir contenido a profesionales de la salud. Hay que decidirlo con asesoría legal antes de publicar fichas de producto [P].
- Datos personales de los formularios: aviso de privacidad conforme a la LFPDPPP [C como requisito]. Responsable y domicilio: [P].

## Capabilities and Constraints

- Arquitectura del sitio [C]: Inicio · Especialidades · Acompañamiento técnico · Nosotros · Contacto · Privacidad. *Recursos* permanece oculto hasta que haya documentos reales. El *Lab* (`/lab/`) se conserva con `noindex` y se enlaza desde el footer.
- Contacto por formulario (Netlify Forms) [C]. Teléfono, correo, WhatsApp y dirección: [P].
- El catálogo crece desde Astro Content Collections [C]. Productos, familias y fabricantes reales: [P]. Una familia sin productos nunca se muestra vacía.
- Sitio estático; sin e-commerce, cuentas de usuario ni precios [C].
- `noindex` global hasta el lanzamiento (DECISIONS D-008).
- Los datos corporativos que aparecían en un benchmark de terceros (razón social, ciudad, experiencia en licitaciones) **se descartan**: no se usan ni como hipótesis (DECISIONS D-016).

## Brand Commitments

- **Nombre:** FIARIL Orthopedics [C].
- **Logo principal:** `logo/new-logo.png`. **Favicon:** `logo/favicon.png`. `logo/logo-fiaril.jpeg` queda como referencia histórica. No se reconstruye, vectoriza, retraza ni reinterpreta el logo; solo se presentan los archivos existentes en otros tamaños o formatos sin alterar el dibujo [C]. Reglas de uso en DESIGN.md.
- **Firma de marca:** *Ortopedia en movimiento.*, traducción de la línea del logo «Ortopedi i rörelse» [C].
- **Concepto rector:** *Precisión en movimiento* [C].
- **Copy aprobado del hero [C]:** titular «La precisión lo cambia todo.» · apoyo «Tecnología ortopédica y conocimiento especializado al servicio de cada procedimiento.» · CTA «Solicitar cotización» / «Explorar especialidades».
- **Paleta e identidad tipográfica:** fijadas en DESIGN.md (paleta de marca de seis colores; Manrope).

### Personalidad

Precisa, especializada, segura, contemporánea. Tiene criterio técnico y no necesita levantar la voz. Es más instrumento de precisión que folleto corporativo.

### Voz y tono

- **Tratamiento:** impersonal siempre que se pueda («Solicitar cotización», «Explorar especialidades»); cuando haga falta dirigirse al lector, *usted* [C].
- **Registro:** editorial, profesional, conciso, seguro y con personalidad. Frases cortas con verbos concretos.
- **Específico antes que grandilocuente:** se nombra lo que FIARIL hace, no adjetivos sobre lo bien que lo hace.
- **Fórmulas prohibidas [C]:** «soluciones integrales», «comprometidos con la excelencia», «líderes en el sector» y cualquier equivalente que podría firmar cualquier proveedor.
- **Errores y estados vacíos:** dicen qué pasó y qué hacer a continuación, sin disculpas ni vaguedad.
- **Términos clínicos:** solo los que FIARIL confirme; nunca se atribuyen resultados médicos.

## Evidence on Hand

- Logos: `logo/new-logo.png` (4096², RGBA), `logo/favicon.png` (512², RGBA), `logo/logo-fiaril.jpeg` (histórico).
- Copy aprobado del hero y firma de marca (ver arriba).
- Creative Lab F01–F04 (`/lab/`): experimentos generativos propios, sin assets de terceros.
- **Ausencias que nunca se rellenan con invenciones:** fabricantes, certificaciones, distribuciones o representaciones, catálogo, teléfonos, correos, ubicaciones, cobertura geográfica, capacidades clínicas, experiencia quirúrgica, alianzas comerciales, testimonios, clientes y cifras.

## Product Principles

1. **Claridad comercial en segundos.** Quien llega desde compras entiende qué suministra FIARIL y cómo pedir una cotización sin esperar a ninguna animación.
2. **Solo lo verificable.** Todo dato no confirmado se marca como pendiente y no se publica como hecho.
3. **La precisión se demuestra, no se declara.** La exactitud de la interfaz, el rendimiento y los detalles es el argumento; los superlativos no.
4. **Lo vivo tiene que ganarse su sitio.** El movimiento comunica (estructura, actividad, respuesta) y siempre existe una alternativa estática equivalente.
5. **Preparado para crecer.** Catálogo, idiomas y secciones se añaden sin rediseñar.

## Accessibility & Inclusion

- Objetivo: WCAG 2.2 AA [C].
- Navegación completa por teclado y foco visible.
- Ninguna interacción depende solo del cursor; el táctil tiene su propio diseño.
- `prefers-reduced-motion` respetado; toda animación autónoma de más de 5 s tiene control de pausa (WCAG 2.2.2).
- Si Canvas o WebGL fallan, la página sigue siendo funcional y coherente; el contenido nunca vive solo en un canvas.
