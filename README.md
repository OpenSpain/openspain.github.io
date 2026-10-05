# OpenSpain

Web informativa de un programa ciudadano independiente. HTML, CSS y JavaScript nativos, sin fuentes remotas, analítica ni base de datos propia. El registro de simpatizantes enlaza a un formulario externo de Typeform, que solo se abre cuando el visitante sigue el enlace.

Identidad editorial azul noche, azul eléctrico, marfil y acentos dorados, compartida por la web y el PDF. Los textos de lectura y las tarjetas priorizan legibilidad también en móvil; el gráfico se desplaza horizontalmente en pantallas pequeñas para conservar etiquetas legibles.

## Abrir la web

Requiere Node.js 18 o posterior.

```sh
npm start
```

Abre <http://127.0.0.1:4173>. El servidor escucha solo en la máquina local. Puedes elegir otro puerto con `PORT=4174 npm start`.

No es necesario instalar dependencias para ejecutar la web. También puede publicarse como sitio estático, conservando todos los archivos públicos. Las rutas relativas permiten servirla desde la raíz del dominio o una subcarpeta de GitHub Pages. Abrir `index.html` con `file://` no permite cargar el programa mediante `fetch`.

## Publicar en GitHub Pages

Repositorio: <https://github.com/OpenSpain/openspain.github.io>.

Web pública: <https://openspain.github.io/>.

En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions** como origen. El workflow `.github/workflows/pages.yml` comprueba el programa y publica automáticamente cada cambio en `main`; también puede ejecutarse manualmente desde **Actions → Deploy GitHub Pages → Run workflow**.

El despliegue copia únicamente los archivos públicos a un artefacto de Pages. El repositorio conserva las fuentes y las pruebas, pero la web no sirve dependencias, pruebas ni herramientas de desarrollo.

GitHub Pages sirve los archivos; no ejecuta `npm start` ni genera el PDF. Regenera y sube el PDF cuando cambie el programa. La disponibilidad de Pages en repositorios privados depende del plan de GitHub.

## Logo para formularios

`openspain-logo.png` es el logo horizontal con fondo transparente (2400 × 560 píxeles), listo para subir a Typeform. `openspain-logo.svg` conserva la versión vectorial editable; el texto usa la familia tipográfica del sitio y puede variar si no está instalada. La web publicada sirve ambos archivos desde su raíz.

## Contenido y datos

- `PROGRAMA.md` es la fuente de las medidas. La web lee el documento y calcula los recuentos, evitando mantener dos versiones del programa.
- Cada eje empieza con explicaciones breves («Qué queremos mejorar», «Qué proponemos» y «Cómo sabremos si funciona»), un «Ejemplo cotidiano (hipotético)» y los «Intereses que hay que equilibrar». Los 31 ejemplos son ilustrativos, no casos reales, logros ni prestaciones aprobadas; muestran costes y límites sin etiquetas partidistas. La guía incluye un pequeño glosario. Después se conservan argumentos, planes, gráficos y la sección `#### Ficha técnica`, sin alterar sus cifras, fuentes o garantías. La web muestra la ficha en un desplegable; el PDF imprime ambas capas completas. Conserva ese marcador al editar.
- Los 31 resúmenes explican «Qué haremos en el primer año», «Qué queremos conseguir en cuatro años», «Pasos y responsables» y «Cómo comprobaremos los avances», conservando cantidades, plazos, argumentos e indicadores. El calendario de referencia es octubre de 2026–2030; los capítulos 4 y 5 definen validación de recursos, línea base, dependencias y fases anuales. Son metas de pilotos delimitados, no datos observados, compromisos financiados ni previsiones nacionales.
- La guía desplegable del programa se carga desde la introducción del capítulo 2 de `PROGRAMA.md`. Explica qué significa «haremos», los plazos y la diferencia entre impulsar una propuesta y autorizar o ejecutar una política. El capítulo 4 propone un registro de acciones, estados, acuerdos, recursos, resultados y decisiones; no es un seguimiento operativo ni un registro de logros ya obtenidos.
- `charts.js` comparte gráficos entre web y PDF: datos de fuente en todos los ejes y uno de metas en cada eje. Hay estadísticas, cifras normativas históricas y contribuciones comunicadas, etiquetadas con alcance distinto. N/D no se transforma en cero; índice 100 significa normalización propuesta, no línea base medida. Los datos nacionales no sustituyen líneas base locales ni prueban impacto; los objetivos gráficos deben actualizarse junto con los planes de cada eje.
- Las cifras ampliadas proceden de tablas verificadas del INE, Eurostat, Sanidad, OIReScon, Moncloa, BOE y Ciencia, con fechas y unidades por figura. La revisión de gráficos es del 4 de octubre de 2026 sin reiniciar T0. El capítulo 8 documenta fuentes, cálculos derivados, universos y limitaciones. La web tiene un explorador desplegable por eje además de sus diálogos.
- Los capítulos de método, financiación, ejecución y fuentes se muestran en desplegables de la web desde el mismo Markdown. Los enlaces HTTP(S) se crean con nodos DOM, sin interpretar HTML. El menú superior permanece visible también en móvil.
- Educación incorpora habilidades cotidianas y revisión de contenidos obsoletos, con evaluación práctica y seguimiento a seis meses. Los ejes de pensiones y renta básica comparan alternativas y financiación; no anuncian prestaciones aprobadas.
- Startups: el eje 11 conecta talento, financiación y clientes con un itinerario de pequeñas etapas; el 8 desarrolla acceso europeo y estadounidense y el 9, inglés práctico. Se distingue inversión anunciada de desembolsada, venta de reunión comercial y facturación empresarial de ingreso fiscal español.
- Turismo: alojamiento legal asequible, competencia y seguimiento de precio final sin rebajas prometidas sin base. Talento: atracción, integración y continuidad de permisos; el visado remoto vigente es de hasta un año, la residencia de hasta tres y sus renovaciones de dos. Las ampliaciones se comparan como reforma, no como derechos ya aprobados.
- Economía colaborativa: el eje 14 incorpora servicios, herramientas y espacios para ingresos complementarios; el 15, obligaciones, comisiones, clasificación laboral e ingreso neto por hora total; el 24, pruebas voluntarias antes de endeudarse; el 25, competencia entre taxi, VTC, cooperativas y plataformas. Compartir gastos no equivale a transporte comercial autorizado. La CNMC recurrió determinadas reglas baleares en julio de 2026; no se presenta el recurso como anulación. El eje 12 exige transparencia de influencia de todos los operadores, sin presumir corrupción.
- La figura de taxi/VTC usa la tabla estatal de 1 de septiembre de 2026: 60.074 VT-N y 27.107 VTC-N. No son conductores ni todas las licencias municipales, y el ámbito nacional no acredita cualquier servicio urbano. El enlace del Ministerio es actualizable; la figura mantiene su fecha. No se inventa ingreso esperado de conductores ni reducción de precios.
- El eje 29 incorpora planes A/B/C, funciones esenciales, dependencias, activación, ejercicios y correcciones ante guerras, crisis energéticas, desastres y otros incidentes. La orientación europea de 72 horas no es una certificación de capacidad nacional. El cierre de Hormuz es un escenario de estrés, no un evento confirmado aquí; no se publica información sensible de operadores.
- El eje 30 propone una Constitución clara y accesible: explicación no normativa, diagnóstico de ambigüedades evitables y reformas de redacción justificadas, sin recortar derechos ni imponer una lectura única. Metas documentales: 12 fichas probadas con 200 participantes el primer año y 40 con 600 participantes acumulados en cuatro años, sujetas a recursos; no son reformas aprobadas ni una muestra representativa. La fuente F35 y el gráfico de estructura son normativos, no una medida de complejidad. Se distinguen los procedimientos de los artículos 166–169, incluido el referéndum obligatorio del 168; el eje no activa un cuarto frente inicial.
- El eje 31 conecta justicia accesible y ágil con integridad y vivienda, preservando defensa, asistencia jurídica, protección de víctimas e independencia. Propone reducir esperas de actuaciones de gestión seleccionadas un 15 % en el primer año y un 25 % en cuatro años, en 3 y 10 unidades adheridas respectivamente; no son plazos de juicio ni resultados garantizados. F36 documenta las estimaciones civiles del CGPJ de 2025 (15,5 meses en ordinarios y 11,1 en «Demás verbales»), no duraciones individuales ni prueba de corrupción; F37 documenta asistencia jurídica gratuita sin prometer acceso universal.
- Las tarjetas tienen títulos con punto final y enlaces directos como <https://openspain.github.io/#eje-30> y <https://openspain.github.io/#eje-31>. Al abrir uno, se muestran todos los ejes, se limpia la búsqueda y se desplaza la tarjeta correspondiente bajo la cabecera.
- El capítulo 9 cierra el programa y el PDF con problemas, acciones y primeros pasos. La web muestra el mismo resumen, sin desplegable, al final en <https://openspain.github.io/#prioridades>. Vivienda incluye habilitar suelo según demanda, servicios, financiación y garantías; el arranque conserva hasta tres frentes y no da por activas todas las medidas.
- El capítulo 5 baja la ejecución a hitos de 2–4 semanas y un arranque de 90 días: hasta tres frentes, responsable confirmado, evidencia y criterio de aceptación. El resto queda pendiente; con menos capacidad se trabaja un solo frente. Un hito documental no se cuenta como impacto de una política.
- Cooperación: los principios y el eje 20 refuerzan unir sin uniformar y evitar el «y tú más», con protocolo de diálogo, respuesta motivada, reconocimiento de aportaciones y compromisos con responsable y fecha. No se equipara cooperación con unanimidad, impunidad o censura; los registros de proyectos no prueban menor polarización nacional. El enfoque también aparece en el método de la web y la presentación de una página.
- `program.js` contiene categorías, títulos editoriales y la serie histórica del IPC. Al añadir un eje, incorpora su metadata visual en `axisMetadata`.
- Revisión de indicadores: 3 de octubre de 2026. La EPA del segundo trimestre de 2026 y el IPC adelantado de septiembre de 2026 proceden de notas oficiales del INE enlazadas en la web. El adelanto se identifica como estimación, no dato definitivo ni consulta en tiempo real.
- La serie del IPC general de 2025 y enero–agosto de 2026 procede de la [nota del INE de agosto de 2026](https://www.ine.es/dyngs/Prensa/IPC0826.htm). Se conserva una escala común de 0 a 7 % al alternar años. No se mezclan adelantos, IPCA ni meses todavía no disponibles con la serie definitiva.
- El gráfico de propuestas cuenta medidas; no representa financiación, apoyos ciudadanos ni impactos estimados.
- El formulario de propuestas genera una descarga local. No envía, almacena ni publica aportaciones y no afirma que exista una comunidad de miembros.
- Los botones «Hazte simpatizante» del inicio y de «Participa» abren <https://g8rpxrjtmaa.typeform.com/to/thCRjB7o> en otra pestaña, sin enviar la URL de origen ni incrustar scripts o formularios externos. La inscripción no constituye afiliación ni aval electoral. La configuración de campos, consentimientos, responsable, conservación y privacidad se gestiona en Typeform; el sitio no almacena respuestas ni certifica el cumplimiento legal del formulario.
- Las propuestas de IA para contratación son orientaciones del programa. Esta web no estima contratos ni incorpora un sistema de IA operativo.
- Donaciones: sección preparada, sin pagos activos ni receptor publicado. El registro está vacío; no es un servicio de pago ni un sistema contable. Antes de habilitar cobros deben definirse responsable, encaje jurídico y fiscal, condiciones y controles. El capítulo 6 de `PROGRAMA.md` recoge transparencia de ingresos y gastos, y publicación de nombres con consentimiento salvo obligación legal. No publiques datos bancarios o personales privados.

## PDF editorial

Después de instalar las dependencias de desarrollo y Chromium:

```sh
npm run pdf
```

Genera `OpenSpain-Programa.pdf` con portada, índice enlazado, indicadores de 2026, todos los capítulos y medidas de `PROGRAMA.md`, fuentes y páginas numeradas. El índice mantiene texto de 11 puntos con espaciado compacto; el cuerpo continúa sin saltos forzados tras el índice ni antes del resumen o las fuentes. Los encabezados permanecen junto al contenido siguiente, los gráficos y las filas de tabla se mantienen completos y los párrafos largos pueden continuar en otra página con control de líneas viudas y huérfanas. El comando inicia y cierra su propio servidor local en el puerto 4175; `BASE_URL` permite usar otro servidor ya iniciado.

`informe.html`, `informe.css` e `informe.js` componen la versión editorial, junto con `charts.js`. Los párrafos y listas están justificados, con última línea alineada al inicio y separación silábica automática; títulos, tablas y etiquetas conservan su alineación. Regenera el PDF después de modificar el programa; el PDF no se actualiza automáticamente.

### Hoja de presentación para contactos

```sh
npm run pdf:presentacion
```

Genera `OpenSpain-Presentacion.pdf` desde `presentacion.html`, sin iniciar un servidor ni modificar el programa completo. La hoja resume el perfil facilitado por Alejandro Acosta, tres prioridades del programa y una petición de reunión de 20 minutos. No implica adhesión a un partido ni acuerdos aprobados. El exportador comprueba espacio e imágenes antes de imprimir en A4; mantén el documento en una sola página.

La disponibilidad hasta el 15 de octubre de 2026 es temporal: actualízala antes de reutilizar la hoja después de esa fecha. No incorpora correo ni teléfono privados; propone responder al remitente del envío. El PDF se descarga desde la sección del programa en la web. `presentacion.html` es una fuente de exportación local, no una ruta servida por el servidor.

## Comprobaciones

```sh
npm test
npm install
npx playwright install chromium
# Con el servidor ejecutándose en otra terminal:
npm run test:browser
```

Las pruebas de navegador cubren navegación del programa, filtros, búsquedas, gráficos, diálogos, descarga, recuperación tras fallo de carga y ausencia de desbordamiento horizontal. `BASE_URL` permite comprobar otro servidor.

## Archivos públicos

`index.html`, `styles.css`, `app.js`, `program.js`, `charts.js`, `favicon.svg`, `bandera.svg` y `PROGRAMA.md`, además de los archivos del informe, `OpenSpain-Programa.pdf` y `OpenSpain-Presentacion.pdf` si deseas incluirlos. No publiques `node_modules`, pruebas ni archivos de desarrollo.
