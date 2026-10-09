# OpenSpain

Web informativa de un programa ciudadano independiente. Seis páginas con HTML, CSS y JavaScript nativos, sin fuentes remotas, analítica ni base de datos propia. El registro de simpatizantes enlaza a un formulario externo de Tally, que solo se abre cuando el visitante sigue el enlace.

## Páginas y navegación

`index.html` presenta la iniciativa con seis cambios destacados y un vídeo horizontal; `cambios.html` desarrolla las quince acciones y sus límites; `programa.html` conserva los 31 ejes, buscador, filtros, datos y fuentes; `como.html` explica método y fases; `transparencia.html` reúne impulsor, organización y financiación; `participa.html` contiene inscripción, vídeo vertical y propuestas locales.

`PROGRAMA.md` sigue siendo la fuente única de acciones, mensajes del vídeo y capítulos. Los apartados 1.1, 1.2 y 1.3 contienen decálogo, acciones y guion; sus lectores en `program.js` delimitan cada apartado sin mezclar listas. `site.js` carga el contenido de cada página; `ui.js` comparte renderizado seguro y diálogos. `app.js` se carga solo en la página del programa. Los estados de carga fallida ofrecen reintento y documento original.

`routes.js` conserva enlaces publicados a `/#eje-N`, `/#programa`, `/#datos`, `/#exigencias`, `/#diagnostico`, `/#prioridades`, `/#plan`, `/#metodo`, `/#donaciones` y `/#participa`, redirigiéndolos a su página y ancla. Los enlaces nuevos utilizan rutas relativas para permitir publicación en una subcarpeta. La navegación está disponible sin JavaScript y marca la página actual.

Identidad editorial azul noche, azul eléctrico, marfil y acentos dorados, compartida por la web y el PDF. Los textos de lectura y las tarjetas priorizan legibilidad también en móvil; el gráfico se desplaza horizontalmente en pantallas pequeñas para conservar etiquetas legibles.

El lema de portada es «Abrir España. Ampliar oportunidades.», compartido por la web y el programa PDF. «Open» conecta apertura a personas, ideas y propuestas con menos barreras para vivir y crear y transparencia sobre decisiones y dinero público. Al cambiarlo, actualiza también título y descripción de la web y regenera el PDF.

La ilustración de portada anima el punto dorado alrededor de su órbita con CSS, sin mover los textos. Incluye un botón para pausar y reanudar; permanece estática sin JavaScript o con la preferencia de movimiento reducido, y no se imprime.

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

`openspain-logo.png` es el logo horizontal con fondo transparente (2400 × 560 píxeles), listo para usar en formularios externos. `openspain-logo.svg` conserva la versión vectorial editable; el texto usa la familia tipográfica del sitio y puede variar si no está instalada. La web publicada sirve ambos archivos desde su raíz.

`openspain-instagram.png` es la variante de perfil de 1080 × 1080, con el símbolo azul original centrado sobre marfil y margen para recorte circular. `openspain-instagram.svg` conserva la fuente. El PNG puede descargarse desde `/openspain-instagram.png`; no incluye texto pequeño ni datos personales.

## Contenido y datos

- `PROGRAMA.md` es la fuente de las medidas. La web lee el documento y calcula los recuentos, evitando mantener dos versiones del programa.
- El apartado 1.1 reúne diez exigencias ciudadanas al Gobierno y representantes. La web las muestra en un desplegable en `programa.html#exigencias`, antes de los filtros, y el PDF después de los principios. `getCitizenDemands` lee ese apartado; conserva su numeración. Los enlaces internos llevan al eje correspondiente sin abrir otra pestaña. El decálogo no se cuenta como medidas adicionales ni activa pilotos.
- El apartado 1.2 resume quince acciones sin tratar las alternativas territoriales como abolición decidida ni todos los beneficios tras el cese como salarios vitalicios. `cambios.html` muestra el texto íntegro y la portada enlaza a seis de sus acciones. El apartado 1.3 aporta los seis mensajes del vídeo horizontal. Ninguno altera metas, atribuciones o financiación ni crea pilotos.
- Integridad incorpora veracidad parlamentaria, código ético, publicación de asesores y auditorías de mérito; el eje 22 desarrolla encuentros trimestrales y disciplina frente a insultos con garantías. El eje 23 propone prevención de conflictos desde la toma de posesión, revisión independiente, abstención efectiva, sustitución, registro proporcionado y alertas. Distingue responsabilidad política de delito, errores de mentira deliberada y renuncia de pérdida automática del escaño. La transcripción aportada inspira propuestas, no verifica acusaciones ni implica respaldo de España Mejor. Se mantienen metas, garantías y financiación pendiente.
- Cada eje empieza con párrafos continuos que integran problema, propuesta, ejemplo hipotético, intereses y criterios generales de evaluación, sin etiquetas repetidas. Los 31 ejemplos son ilustrativos, no casos reales, logros ni prestaciones aprobadas; muestran costes y límites sin etiquetas partidistas. La guía incluye un pequeño glosario. El único separador visible es `#### Plan de actuación`; el marcador invisible `<!-- proposal-detail -->` indica dónde insertar los gráficos antes de la explicación ampliada. La web y el PDF muestran todo el texto directamente, sin título adicional ni desplegable para el detalle. Conserva este marcador al editar.
- Los 31 detalles empiezan por el problema y las alternativas, conservan las medidas en una lista y explican evaluación, fuentes, responsables, costes y garantías en párrafos sin etiquetas repetidas. Los indicadores se reúnen para evitar duplicidades; los términos estadísticos se explican donde hacen falta. El lector toma la primera lista de cada detalle como medidas del eje; las listas o tablas posteriores amplían el análisis y no se cuentan como medidas nuevas.
- Los 31 planes conservan cantidades, objetivos del primer año y de cuatro años, calendario y responsables en texto seguido. Después de los gráficos, el texto desarrolla argumentos, alternativas, indicadores detallados y fuentes, sin eliminar las medidas, costes o garantías originales. El calendario de referencia es octubre de 2026–2030; los capítulos 4 y 5 definen validación de recursos, línea base, dependencias y fases anuales. Son metas de pilotos delimitados, no datos observados, compromisos financiados ni previsiones nacionales.
- La guía desplegable del programa se carga desde la introducción del capítulo 2 de `PROGRAMA.md`. Explica qué significa «haremos», los plazos y la diferencia entre impulsar una propuesta y autorizar o ejecutar una política. El capítulo 4 propone un registro de acciones, estados, acuerdos, recursos, resultados y decisiones; no es un seguimiento operativo ni un registro de logros ya obtenidos.
- `charts.js` comparte gráficos entre web y PDF: datos de fuente en todos los ejes y uno de metas en cada eje. Hay estadísticas, cifras normativas históricas y contribuciones comunicadas, etiquetadas con alcance distinto. N/D no se transforma en cero; índice 100 significa normalización propuesta, no línea base medida. Los datos nacionales no sustituyen líneas base locales ni prueban impacto; los objetivos gráficos deben actualizarse junto con los planes de cada eje.
- Las cifras ampliadas proceden de tablas verificadas del INE, Eurostat, Sanidad, OIReScon, Moncloa, BOE y Ciencia, con fechas y unidades por figura. La revisión de gráficos es del 4 de octubre de 2026 sin reiniciar T0. El capítulo 8 documenta fuentes, cálculos derivados, universos y limitaciones. La web tiene un explorador desplegable por eje además de sus diálogos.
- Los capítulos de método, financiación, ejecución y fuentes se muestran en desplegables de la web desde el mismo Markdown. Los enlaces HTTP(S) se crean con nodos DOM, sin interpretar HTML. El menú superior permanece visible también en móvil.
- Los recursos de interfaz llevan una versión en su URL para renovar la caché al publicar cambios coordinados; actualiza el mismo identificador en HTML e imports de módulos cuando cambie su contrato. El Markdown se solicita con `cache: 'no-store'`. Un HTML anterior sin el contenedor del decálogo conserva la carga de los ejes y registra un aviso para recargar; los errores de carga muestran el detalle real sin atribuir automáticamente el fallo al alojamiento.
- Educación incorpora habilidades cotidianas y revisión de contenidos obsoletos, con evaluación práctica y seguimiento a seis meses. Los ejes de pensiones y renta básica comparan alternativas y financiación; no anuncian prestaciones aprobadas.
- Las aportaciones ciudadanas se integran sin crear ejes nuevos: financiación sindical y control de ayudas (1), crédito horario con garantías (4), alternativas de Senado y organización territorial (6), coordinación educativa y sanitaria (9 y 13), exenciones de entidades religiosas y sin ánimo de lucro (16), nuclear existente y nueva frente a alternativas (17), proporcionalidad y seguimiento de compromisos sin retirar el voto por recibir ayudas (22), responsabilidad del presidente y beneficios tras el cese (23), cauces constitucionales (30) y elección y nombramientos del CGPJ (31). F38–F41 documentan el marco jurídico, no impactos observados. Se conservan los planes y metas existentes: son ampliaciones pendientes de diagnóstico, autorización y financiación, no nuevos pilotos activados.
- Integridad electoral: el eje 22 incorpora identificación, prevención de suplantaciones y duplicidades, custodia y trazabilidad del voto presencial, postal y exterior, sin comprometer secreto ni acceso. Distingue CERA y ERTA, explica censo, plazos y reclamaciones según convocatoria y propone información agregada y controles independientes competentes. Los ejes 1 y 31 conectan denuncias e investigación con garantías. F42 documenta el marco electoral, no acredita fraude; no se incorporan acusaciones partidistas sin prueba ni se activa otro piloto o se cambian las metas de deliberación.
- Startups: el eje 11 conecta talento, financiación y clientes con un itinerario de pequeñas etapas; el 8 desarrolla acceso europeo y estadounidense y el 9, inglés práctico. Se distingue inversión anunciada de desembolsada, venta de reunión comercial y facturación empresarial de ingreso fiscal español.
- Turismo: alojamiento legal asequible, competencia y seguimiento de precio final sin rebajas prometidas sin base. Talento: atracción, integración y continuidad de permisos; el visado remoto vigente es de hasta un año, la residencia de hasta tres y sus renovaciones de dos. Las ampliaciones se comparan como reforma, no como derechos ya aprobados.
- Economía colaborativa: el eje 14 incorpora servicios, herramientas y espacios para ingresos complementarios; el 15, obligaciones, comisiones, clasificación laboral e ingreso neto por hora total; el 24, pruebas voluntarias antes de endeudarse; el 25, competencia entre taxi, VTC, cooperativas y plataformas. Compartir gastos no equivale a transporte comercial autorizado. La CNMC recurrió determinadas reglas baleares en julio de 2026; no se presenta el recurso como anulación. El eje 12 exige transparencia de influencia de todos los operadores, sin presumir corrupción.
- La figura de taxi/VTC usa la tabla estatal de 1 de septiembre de 2026: 60.074 VT-N y 27.107 VTC-N. No son conductores ni todas las licencias municipales, y el ámbito nacional no acredita cualquier servicio urbano. El enlace del Ministerio es actualizable; la figura mantiene su fecha. No se inventa ingreso esperado de conductores ni reducción de precios.
- El eje 29 incorpora planes A/B/C, funciones esenciales, dependencias, activación, ejercicios y correcciones ante guerras, crisis energéticas, desastres y otros incidentes. La orientación europea de 72 horas no es una certificación de capacidad nacional. El cierre de Hormuz es un escenario de estrés, no un evento confirmado aquí; no se publica información sensible de operadores.
- El eje 30 propone una Constitución clara y accesible: explicación no normativa, diagnóstico de ambigüedades evitables y reformas de redacción justificadas, sin recortar derechos ni imponer una lectura única. Metas documentales: 12 fichas probadas con 200 participantes el primer año y 40 con 600 participantes acumulados en cuatro años, sujetas a recursos; no son reformas aprobadas ni una muestra representativa. La fuente F35 y el gráfico de estructura son normativos, no una medida de complejidad. Se distinguen los procedimientos de los artículos 166–169, incluido el referéndum obligatorio del 168; el eje no activa un cuarto frente inicial.
- El eje 31 conecta justicia accesible y ágil con integridad y vivienda, preservando defensa, asistencia jurídica, protección de víctimas e independencia. Propone reducir esperas de actuaciones de gestión seleccionadas un 15 % en el primer año y un 25 % en cuatro años, en 3 y 10 unidades adheridas respectivamente; no son plazos de juicio ni resultados garantizados. F36 documenta las estimaciones civiles del CGPJ de 2025 (15,5 meses en ordinarios y 11,1 en «Demás verbales»), no duraciones individuales ni prueba de corrupción; F37 documenta asistencia jurídica gratuita sin prometer acceso universal.
- Las tarjetas tienen títulos con puntuación final y enlaces directos como <https://openspain.github.io/#eje-19>, <https://openspain.github.io/#eje-30> y <https://openspain.github.io/#eje-31>. Al abrir uno, se muestran todos los ejes, se limpia la búsqueda y se desplaza la tarjeta correspondiente bajo la cabecera.
- El capítulo 9 cierra el programa y el PDF con problemas, acciones y primeros pasos. La web muestra el mismo resumen en un desplegable en `cambios.html#prioridades`; el enlace antiguo se conserva mediante redirección. Vivienda incluye habilitar suelo según demanda, servicios, financiación y garantías; el arranque conserva hasta tres frentes y no da por activas todas las medidas.
- El capítulo 5 baja la ejecución a hitos de 2–4 semanas y un arranque de 90 días: hasta tres frentes, responsable confirmado, evidencia y criterio de aceptación. El resto queda pendiente; con menos capacidad se trabaja un solo frente. Un hito documental no se cuenta como impacto de una política.
- Cooperación: los principios y el eje 20 refuerzan unir sin uniformar y evitar el «y tú más», con protocolo de diálogo, respuesta motivada, reconocimiento de aportaciones y compromisos con responsable y fecha. No se equipara cooperación con unanimidad, impunidad o censura; los registros de proyectos no prueban menor polarización nacional. El enfoque también aparece en el método de la web y la presentación de una página.
- Medios: el eje 19 desarrolla «¿Quién paga a quién?», un registro propuesto de pagos públicos a medios con campaña, intermediarios, destinatarios documentados, conceptos separados, datos descargables y metodología reproducible. Conserva las metas de 5 y 20 entidades, sin adhesiones confirmadas; distingue cobertura de contratos y del gasto hasta destinatario final. Sin ingresos comparables no calcula porcentajes de dependencia ni infiere autocensura. El piloto de 1 entidad y 1 ejercicio, hasta 10 expedientes o todos si hay menos, puede sustituir el caso del frente de integridad en C01/C02; no activa un cuarto frente ni es una plataforma operativa. Los ejes 1, 12, 23 y 31 conectan contratos, cargos, intereses declarados y mecanismos institucionales mediante relaciones documentadas, revisión de identidades y protección de datos, sin presumir clientelismo ni afinidad de jueces. La tarjeta, el plan y los resúmenes de los capítulos 7 y 9 muestran el proyecto desde la misma fuente; los cambios no implican colaboración o respaldo externo.
- `program.js` contiene categorías, títulos editoriales y la serie histórica del IPC. Al añadir un eje, incorpora su metadata visual en `axisMetadata`.
- Revisión de indicadores: 3 de octubre de 2026. La EPA del segundo trimestre de 2026 y el IPC adelantado de septiembre de 2026 proceden de notas oficiales del INE enlazadas en la web. El adelanto se identifica como estimación, no dato definitivo ni consulta en tiempo real.
- La serie del IPC general de 2025 y enero–agosto de 2026 procede de la [nota del INE de agosto de 2026](https://www.ine.es/dyngs/Prensa/IPC0826.htm). Se conserva una escala común de 0 a 7 % al alternar años. No se mezclan adelantos, IPCA ni meses todavía no disponibles con la serie definitiva.
- El gráfico de propuestas cuenta medidas; no representa financiación, apoyos ciudadanos ni impactos estimados.
- El formulario de propuestas genera una descarga local. No envía, almacena ni publica aportaciones y no afirma que exista una comunidad de miembros.
- La portada enlaza a `participa.html`; su botón «Hazte simpatizante» abre <https://tally.so/r/D4lvRN> en otra pestaña, sin enviar la URL de origen ni incrustar scripts o formularios externos. La inscripción no constituye afiliación ni aval electoral. La configuración de campos, consentimientos, responsable, conservación y privacidad se gestiona en Tally; el sitio no almacena respuestas ni certifica el cumplimiento legal del formulario.
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

## Vídeo «Hazte simpatizante»

```sh
node video/render.mjs
```

Genera `video/OpenSpain-Hazte-Simpatizante.mp4`: vertical 1080 × 1920, 30 fps, unos 45 s, para Reels, TikTok y Shorts. `video/video.html` define la animación con una línea de tiempo determinista (ábrelo en el navegador para previsualizarla en bucle); `PACE` controla la velocidad general (más alto, más pausado). `video/audio.mjs` sintetiza la banda sonora sincronizada con los golpes, normalizada a unos −14 LUFS. Requiere Playwright con Chromium, ffmpeg y las fuentes Avenir Next de macOS. `node video/render.mjs --preview 5.8,33` guarda fotogramas sueltos en `video/preview/`.

Sigue la identidad de la web: marfil, azul noche con planeta y órbita, azul eléctrico y dorado; Avenir Next con acentos en Georgia cursiva; logo, etiquetas con punto y flechas ↗. Abre con «España no necesita más eslóganes. Necesita datos, responsables y resultados comprobables» y reutiliza textos de la web como «No somos un partido. Somos un punto de partida.»; las entradas de texto se ajustan a una rejilla de medio compás para que coincidan con los golpes de audio. El cierre muestra un QR (`video/qr-simpatizante.svg`) al mismo formulario de simpatizantes que la web, sin nombrar la herramienta, y aclara que la inscripción no es afiliación, firma ni compromiso de aval. Los textos resumen el programa (31 ejes, problemas y tres frentes iniciales) sin presentar medidas como aprobadas. Si cambia el enlace del formulario, regenera el QR y el vídeo.

La página `participa.html` muestra el vídeo vertical con controles nativos, sin reproducción automática ni bucle, `playsinline` y `preload="none"`. Mantiene el botón de inscripción fuera del reproductor, subtítulos españoles (`video/hazte-simpatizante-es.vtt`), transcripción desplegable y enlace de descarga. La portada estática (`video/hazte-simpatizante-portada.jpg`) evita iniciar animaciones al cargar. GitHub Pages y el servidor local publican únicamente los MP4, portadas y subtítulos, no las fuentes de renderizado. El servidor local admite rangos de bytes para avanzar en los vídeos.

Cuando regeneres el vídeo, actualiza subtítulos, transcripción, tamaño de descarga y portada. La portada actual se extrae del segundo 42,5 y se reduce a 540 × 960 píxeles:

```sh
ffmpeg -y -ss 42.5 -i video/OpenSpain-Hazte-Simpatizante.mp4 -frames:v 1 -vf scale=540:960 -q:v 3 video/hazte-simpatizante-portada.jpg
```

### Vídeo horizontal «Qué queremos cambiar»

```sh
node video/render.mjs --changes
```

Genera `video/OpenSpain-Cambios.mp4`: 1920 × 1080, 30 fps, 45 segundos, H.264/AAC. `video/cambios.html` contiene una composición 16:9 real, sin estirar o recortar el vídeo vertical; el renderizador lee los seis mensajes del apartado 1.3 y comprueba sus límites de encuadre antes de codificar. La música reutiliza el sintetizador propio. El inicio y el cierre aclaran propósito, responsables y evaluación.

La portada y `cambios.html` muestran este vídeo a todo el ancho, con subtítulos (`video/cambios-es.vtt`), portada (`video/cambios-portada.jpg`) y acceso al texto del guion. No se descarga el MP4 antes de reproducirlo. Al cambiar el guion, regenera el vídeo y actualiza subtítulos y portada:

```sh
ffmpeg -y -ss 17 -i video/OpenSpain-Cambios.mp4 -frames:v 1 -vf scale=1280:720 -q:v 3 video/cambios-portada.jpg
```

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

Las seis páginas HTML, `styles.css`, `app.js`, `site.js`, `ui.js`, `routes.js`, `program.js`, `charts.js`, iconos, logos y `PROGRAMA.md`, además de los archivos del informe y PDF. Conserva las rutas de los dos vídeos, sus portadas y subtítulos. `.github/workflows/pages.yml` y `server.mjs` mantienen la lista explícita de archivos públicos. No publiques `node_modules`, pruebas ni fuentes de renderizado.
