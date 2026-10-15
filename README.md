# OpenSpain

Web informativa de un programa ciudadano independiente. Seis páginas con HTML, CSS y JavaScript nativos, sin fuentes remotas, analítica ni base de datos propia. El registro de simpatizantes enlaza a un formulario externo de Tally, que solo se abre cuando el visitante sigue el enlace.

## Estilo visual Studio

Las seis páginas cargan `studio.css?v=20261015-motion` después de sus estilos base para aplicar una dirección visual oscura: fondo negro suave, superficies de grafito, tipografía blanca y pilares en tarjetas amplias. Un acento lima (`#c6f36b`) resalta palabras clave de los titulares, números de pilares y ejes, navegación activa, filtros seleccionados y estados de foco o interacción. Las frases destacadas con `span` en los títulos principales y de sección siguen el mismo criterio, incluido «Resolver juntos». Los botones principales, incluida la inscripción flotante, usan fondo lima y texto oscuro; los secundarios conservan fondo oscuro y borde, con acento lima al interactuar. El símbolo y la esfera se presentan en blanco y plata, sin cambiar los archivos de marca originales. Esta capa define el estilo de pantalla de la web.

La capa se aplica solo en pantalla: no modifica la impresión de las seis páginas ni el contenido o la música de los vídeos. Los informes y PDF usan sus propias plantillas Studio. Conserva navegación, formularios, fuentes y controles de movimiento. Los gráficos distinguen datos observados y metas mediante tonos, etiquetas y un borde discontinuo en las metas. Para volver al diseño base de la web basta con retirar el enlace a `studio.css` de las seis páginas. El servidor y la lista de archivos públicos incluyen la hoja.

Los dos vídeos de la web y sus portadas comparten el estilo en grafito, blanco y lima, mediante `video/studio.css`. Esta capa de renderizado es independiente de la hoja de pantalla: conserva el guion, las escenas y sus tiempos. El planeta es plateado y el QR mantiene fondo claro y margen para su lectura. Los MP4 copian la pista de audio anterior sin recodificarla; no cambian música, ritmo ni golpes de transición. La serie de Instagram mantiene su diseño anterior.

En Valores y transparencia, el lima también destaca los nombres de los diez valores y seis compromisos, palabras clave de los encabezados, los rótulos de los perfiles y la numeración de los principios de financiación. Las explicaciones y los avisos de donaciones no habilitadas mantienen tonos neutros.

«Cómo los cumplimos» aprovecha todo el ancho de su sección con los seis compromisos en dos columnas por encima de 800 px y una columna en pantallas menores. Cada compromiso conserva el texto blanco, el interlineado y la longitud de línea legible; la impresión no cambia.

El resto de páginas comparte el mismo acento en enlaces de acción, acceso al detalle de propuestas, pasos del método, marcadores de desplegables y títulos de los desplegables abiertos. Participa destaca también el botón secundario para preparar una propuesta. El selector de año distingue la opción activa con lima, sin recolorear las series de datos ni las metas.

La lectura usa texto blanco (`#f5f5f7`) de 18 px en escritorio y 17 px en móvil, con interlineado de 1,75 para párrafos y listas. Los textos largos se limitan a 68 `ch`, sin estrechar las tablas o los gráficos. Los cuatro pasos del método se distribuyen en dos columnas, o una en móvil. Notas y fuentes también son blancas y parten de 14 px; las tablas usan 16 px. La jerarquía se diferencia con tamaño y peso, no con textos grises. Estos cambios solo afectan a la pantalla de la web, no al PDF ni a los vídeos.

Los pasos del método tienen mayor presencia: números lima de 32 px, títulos de 26 px y explicaciones blancas de 20 px. Hasta 560 px usan 28, 24 y 18 px, respectivamente, en una sola columna.

En Plan de acción, el lima también destaca los títulos de los cuatro pasos, «tres frentes» y los subtítulos del método completo y sus fases. Los párrafos, tablas y avisos conservan el texto blanco.

En Programa, los acentos destacan «programa», «límites», los encabezados de las diez exigencias y los títulos de los apartados dentro del detalle de cada eje. El acceso a energía, tecnología y espacio usa texto y borde lima, como acción secundaria. No se recolorean los datos observados ni las metas propuestas.

Las secciones situadas fuera de la vista inicial aparecen una sola vez con un desplazamiento de 8 px y una transición de opacidad de 0,75 a 1 durante 300 ms. No se oculta contenido para preparar la animación ni se animan las cabeceras iniciales, los destinos de anclas o secciones con foco. Las flechas de acciones avanzan 2 px al pasar el cursor o recibir foco de teclado; las descargas se desplazan hacia abajo. Se desactiva con `prefers-reduced-motion`, y activar esa preferencia cancela las entradas en curso. Sin JavaScript el contenido permanece visible. Estos efectos no cambian los PDF ni los vídeos.

## Páginas y navegación

`index.html` presenta los ocho pilares prácticos y un vídeo horizontal; `cambios.html` desarrolla sus acciones, límites y primeros pasos; `programa.html` conserva los 31 ejes, buscador, filtros, datos y fuentes; `como.html` explica método y fases; `transparencia.html`, bajo «Valores» en el menú, reúne valores, compromisos de conducta, impulsor, organización y financiación; `participa.html` contiene inscripción, vídeo vertical y propuestas locales.

La portada resume la aspiración de una España abierta donde vivir bien, crear y prosperar. Dos párrafos breves presentan libertad, oportunidades, instituciones al servicio de todos y el carácter ciudadano e independiente del proyecto. Conserva «Abrir España. Ampliar oportunidades.» y enlaza a Participa mediante «Participa». Es una invitación a construir, no una promesa de beneficios universales.

En Cambios, los pilares 4 y 5 desarrollan inversión verificable y atracción e integración de talento con contenido de los ejes 7, 8 y 11. Su extensión se equilibra con los pilares contiguos sin añadir metas ni permisos vigentes. Los textos proceden de `PROGRAMA.md` y también se incorporan al PDF completo.

«Quiero avalar» lleva desde la portada a `participa.html#avales`. El bloque explica que no hay recogida de avales abierta y ofrece recibir información si se decide presentar una candidatura. Su botón abre el mismo formulario externo de novedades en Tally, cuya descripción contempla estos avisos; no guarda una preferencia separada en esta web. No constituye firma, aval ni compromiso de avalar y no anuncia una candidatura. No se incrusta Tally ni se realiza una solicitud a ese servicio antes de seguir el enlace.

La página «Valores y transparencia», abreviada como «Valores» en el menú, conserva la ruta y los enlaces de donaciones anteriores. Muestra primero diez valores cívicos y después seis compromisos concretos, leídos de los apartados 1.4 y 1.5 de `PROGRAMA.md` mediante `getCivicValues` y `getValueCommitments`. Los valores se expresan en positivo: dignidad y libertad, generosidad, confianza, aprendizaje, servicio, mérito y oportunidades, convivencia, reparación, prosperidad y futuro. Mantienen trabajo honesto, libertad para cambiar de opinión, responsabilidad temporal del cargo y remuneración justa, sin referencias religiosas ni exigencia de creencias. Las salvaguardas siguen en los compromisos y el programa. No presenta órganos de control o registros como operativos. El PDF completo incluye estos mismos apartados.

`PROGRAMA.md` sigue siendo la fuente única de acciones, mensajes del vídeo y capítulos. Los apartados 1.1, 1.2 y 1.3 contienen decálogo, acciones y guion; sus lectores en `program.js` delimitan cada apartado sin mezclar listas. `site.js` carga el contenido de cada página; `ui.js` comparte renderizado seguro y diálogos. `app.js` se carga solo en la página del programa. Los estados de carga fallida ofrecen reintento y documento original.

Las mejoras prácticas incorporan un catálogo inicial de seis recorridos en el eje 6, sin ampliar los 10 procedimientos de 3 administraciones previstos, y tres ejemplos económicos didácticos en el eje 16, conectados con apertura de negocios y cotización del 14 y 15. Sus importes son ficticios, no liquidaciones vigentes ni rebajas propuestas. El apartado 3.1 desarrolla seguridad ciudadana con prevención, víctimas, recursos e investigación con garantías: aparece en `programa.html#seguridad-ciudadana`, junto a los ámbitos pendientes del capítulo 3. Conserva los 31 ejes y no añade metas, presupuesto ni un cuarto frente inicial. El PDF completo recoge el mismo contenido.

Los ejes 6, 9, 13, 21, 22, 23 y 31 aclaran el cauce de sus alternativas institucionales; el 30 contiene un mapa de reformas constitucionales y los artículos 167 y 168. Se distingue coordinación, ley, estatuto y Constitución, sin adoptar supresiones por compararlas. La elección de los 12 vocales judiciales puede reformarse mediante LOPJ; cambiar las reglas constitucionales del CGPJ es distinto. El capítulo 4 exige identificar artículos, mayorías y referéndum cuando proceda.

`routes.js` conserva enlaces publicados a `/#eje-N`, `/#programa`, `/#datos`, `/#exigencias`, `/#diagnostico`, `/#prioridades`, `/#plan`, `/#metodo`, `/#donaciones` y `/#participa`, redirigiéndolos a su página y ancla. Los enlaces nuevos utilizan rutas relativas para permitir publicación en una subcarpeta. La navegación está disponible sin JavaScript y marca la página actual.

`brand.css` y `styles.css` conservan la base de marca azul y clara; `studio.css` aplica la identidad actual en grafito, blanco y lima a la pantalla de la web. Los vídeos, el informe y los dos PDF tienen sus propias plantillas con la misma identidad. Las barras de datos observados son blancas; las metas se distinguen con barras grises, borde discontinuo y la etiqueta «META PROPUESTA · NO PREVISIÓN». La fuente variable Manrope se sirve localmente desde `fonts/manrope-variable.ttf`, con licencia SIL OFL en `fonts/OFL.txt`; no se consulta ningún proveedor externo. Los textos de lectura y las tarjetas priorizan legibilidad también en móvil; el gráfico se desplaza horizontalmente en pantallas pequeñas para conservar etiquetas legibles.

Todas las páginas cierran con un enlace accesible a Instagram, `https://www.instagram.com/openspainorg/`, sin incrustar contenido ni cargar rastreadores de esa red. «Problemas y primeras acciones» aparece abierto por defecto en la página de cambios. El aviso de errores no reserva una sección vacía; el espacio entre acciones y prioridades se mantiene compacto.

El método completo y el plan de 90 días en `como.html` también se muestran abiertos por defecto. La separación entre secciones consecutivas evita sumar dos márgenes verticales amplios, manteniendo lectura clara sin huecos vacíos.

El vídeo de los ocho pilares se presenta en Inicio, sin duplicarlo en `cambios.html`. La página de cambios utiliza una cabecera compacta y muestra directamente los pilares y sus primeras acciones.

Inicio incluye cuatro preguntas frecuentes en `index.html#preguntas-frecuentes`, con desplegables nativos disponibles sin JavaScript. Explican la posible evolución a partido sin anunciar una decisión o candidatura, la colaboración abierta, los acuerdos sin unanimidad y el apoyo voluntario. Distinguen la colaboración actual de futuras aportaciones económicas: las donaciones siguen sin habilitar y no se afirman ayudas o subvenciones concedidas.

La cabecera de `programa.html` también es compacta, con el título sin salto de línea forzado y las dos descargas visibles antes de explorar los ejes.

Plan de acción y Transparencia comparten esa cabecera compacta, sin reducir el contenido del método, las fases ni los compromisos de transparencia.

Transparencia presenta los retratos facilitados en `alejandro-acosta.jpg` y `fabio-franco.jpg`, a 480 × 612 píxeles, optimizados y servidos localmente, sin servicios externos de imágenes. El de Fabio utiliza la última imagen aportada, recortada al formato del perfil. El de Alejandro aclara suavemente las sombras, sobre todo a la izquierda, conservando encuadre y facciones. Sus URLs llevan una versión para renovar la caché.

Fabio Franco aparece como coimpulsor de OpenSpain con la fotografía y presentación facilitadas: español, Policía Municipal de Madrid y geólogo. Se destaca su perspectiva sobre seguridad cotidiana, convivencia, territorio y problemas ciudadanos, sin añadir credenciales ni atribuir respaldo a su institución. El capítulo 6 del programa y el PDF recogen la misma presentación; Alejandro conserva su condición de impulsor.

Los mensajes junto a ambos perfiles usan títulos de la misma jerarquía, tamaño y peso. Alejandro se presenta con «Escuchar. Proponer. Construir.» y Fabio con «Conocer la calle. Escuchar al ciudadano.», sin saltos de línea forzados. Las aclaraciones sobre el liderazgo inicial y las credenciales de Alejandro se conservan en el capítulo de organización, no en su mensaje de presentación.

Las seis páginas incluyen un enlace flotante «Hazte simpatizante» a `participa.html#participa`. Aparece tras desplazarse 160 píxeles y se oculta mientras son visibles la inscripción, un vídeo o el pie, y cuando hay un diálogo abierto. Respeta las zonas seguras del móvil y no aparece al imprimir. No abre servicios externos ni carga rastreadores; las donaciones siguen sin habilitar.

En móvil y tablet, un botón «Menú» despliega los seis enlaces sin desplazamiento horizontal, con estado accesible y cierre mediante Escape. Sin JavaScript se conserva la navegación visible. Las flechas de enlaces y botones se muestran como SVG monocromos, no como caracteres que puedan convertirse en emojis del sistema.

La cabecera combina el símbolo circular azul, de trazo grueso y redondeado, con «openspain.» en Manrope de peso 800, sin bandera. Comparte el símbolo de `favicon.svg`: mide 40 píxeles en escritorio y 32 en móvil; el nombre pasa de 34 a 24–32 píxeles para dejar espacio al menú. La navegación utiliza 16 píxeles y estado activo en cápsula; «Plan de acción» enlaza a `como.html`. Los pilares y ejes destacan números grandes en azul, con filtros de la misma marca. «Participa» es la acción principal: azul sobre claro y blanco sobre azul; los botones secundarios usan borde. El cierre azul contrasta con el pie oscuro, manteniendo una composición compacta.

El lema de portada es «Abrir España. Ampliar oportunidades.», compartido por la web y el programa PDF. «Open» conecta apertura a personas, ideas y propuestas con menos barreras para vivir y crear y transparencia sobre decisiones y dinero público. Al cambiarlo, actualiza también título y descripción de la web y regenera el PDF.

La ilustración de portada conserva la esfera, las órbitas y el horizonte. Anima un punto claro alrededor de su órbita con CSS, sin mover los textos. La propia ilustración permite pausar y reanudar mediante un botón transparente que cubre su superficie, con nombre accesible y foco visible para el teclado, sin un rótulo sobre el dibujo. Permanece estática sin JavaScript o con la preferencia de movimiento reducido, y no se imprime. Las transiciones de botones, enlaces y filtros son breves y se desactivan con la preferencia de movimiento reducido.

Inicio combina una portada azul, pilares en filas numeradas sobre blanco, vídeo sobre gris, un bloque editorial de actualizaciones y un cierre azul. Los pilares reutilizan los títulos breves y frases del apartado 1.3 del programa; los costes, condiciones y garantías completos permanecen en «Cambios». Los valores utilizan filas abiertas en dos columnas (una en móvil), sin cajas individuales. Las tarjetas se mantienen donde facilitan explorar contenido, como los 31 ejes.

«Un proyecto. En movimiento.» muestra cambios ya publicados con fechas y enlaces comprobables, sin cifras de apoyos o resultados inventadas. La fecha de actualización es editorial: debe cambiar solo al actualizar el contenido, junto con el historial pertinente; no se recalcula al visitar la página.

Los títulos de sección usan peso 700 y los encabezados desplegables 800, sin aumentar su tamaño; los párrafos mantienen un peso normal para distinguir contenido y navegación.

Las seis páginas distinguen titular, subtítulo explicativo de peso 600 y texto de lectura. Plan de acción presenta «Qué haremos, en qué plazo y cómo rendiremos cuentas»; el cierre de Inicio destaca «Menos “y tú más”. Más responsabilidad» y enlaza al plan, sin anunciar resultados o poderes institucionales.

## Abrir la web

Requiere Node.js 18 o posterior.

```sh
npm start
```

Abre <http://127.0.0.1:4173>. El servidor escucha solo en la máquina local. Puedes elegir otro puerto con `PORT=4174 npm start`.

No es necesario instalar dependencias para ejecutar la web. También puede publicarse como sitio estático, conservando todos los archivos públicos. Las rutas relativas permiten servirla desde la raíz del dominio o una subcarpeta de GitHub Pages. Abrir `index.html` con `file://` no permite cargar el programa mediante `fetch`.

## Publicar en GitHub Pages

Repositorio: <https://github.com/OpenSpain/openspain.github.io>.

Web pública: <https://openspain.org/>. La dirección de GitHub Pages conserva compatibilidad.

En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions** como origen. El workflow `.github/workflows/pages.yml` comprueba el programa y publica automáticamente cada cambio en `main`; también puede ejecutarse manualmente desde **Actions → Deploy GitHub Pages → Run workflow**.

El despliegue copia únicamente los archivos públicos a un artefacto de Pages. El repositorio conserva las fuentes y las pruebas, pero la web no sirve dependencias, pruebas ni herramientas de desarrollo.

GitHub Pages sirve los archivos; no ejecuta `npm start` ni genera el PDF. Regenera y sube el PDF cuando cambie el programa. La disponibilidad de Pages en repositorios privados depende del plan de GitHub.

## Logo para formularios

`openspain-logo.png` es el logo horizontal anterior con fondo transparente (2400 × 560 píxeles) y bandera, disponible para formularios externos. `openspain-logo.svg` conserva su versión vectorial editable. Estos archivos y `openspain-logo-light.svg` conservan la identidad anterior; los dos vídeos de la web utilizan ahora el símbolo de `favicon.svg` en blanco y el nombre en Manrope 800, sin bandera. La web publicada conserva los archivos anteriores para compatibilidad.

`openspain-instagram.png` es la variante de perfil de 1080 × 1080, con el nuevo símbolo azul `#3159dc` sobre blanco y margen para recorte circular. `openspain-instagram.svg` conserva la fuente, con la misma geometría que el favicon y la cabecera. El PNG puede descargarse desde `/openspain-instagram.png`; no incluye texto pequeño ni datos personales.

## Contenido y datos

- `PROGRAMA.md` es la fuente de las medidas. La web lee el documento y calcula los recuentos, evitando mantener dos versiones del programa.
- El apartado 1.1 reúne diez exigencias ciudadanas al Gobierno y representantes. La web las muestra en un desplegable en `programa.html#exigencias`, antes de los filtros, y el PDF después de los principios. `getCitizenDemands` lee ese apartado; conserva su numeración. Los enlaces internos llevan al eje correspondiente sin abrir otra pestaña. El decálogo no se cuenta como medidas adicionales ni activa pilotos.
- El apartado 1.2 resume ocho pilares: respuesta penal a corrupción y delitos graves, rebajas fiscales sostenibles, innovación y emprendimiento, inversión extranjera, talento y nómadas digitales, reducción de gasto innecesario, inmigración laboral con contratos reales y vivienda social con servicios. El tercer pilar conecta investigación con productos y servicios en startups, empresas existentes, industria y servicios públicos, con apoyos evaluados y sin garantizar éxito. `cambios.html` muestra su texto íntegro y la portada enlaza a los ocho. El apartado 1.3 aporta ocho mensajes del vídeo horizontal. No se adopta una abolición autonómica general, no se garantizan salarios mayores por bajar impuestos y un contrato no concede automáticamente permiso de trabajo. Ninguno altera metas, atribuciones o financiación ni crea pilotos.
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
- Simplificación normativa: el sexto pilar combina menos burocracia y gasto innecesario. El eje 6 propone revisar requisitos por finalidad y coste, eliminar duplicidades por la vía legal y mantener protecciones esenciales; mide tiempo, coste y documentación repetida, no solo leyes derogadas.
- Turismo: alojamiento legal asequible, competencia y seguimiento de precio final sin rebajas prometidas sin base. Talento: atracción, integración y continuidad de permisos; el visado remoto vigente es de hasta un año, la residencia de hasta tres y sus renovaciones de dos. Las ampliaciones se comparan como reforma, no como derechos ya aprobados.
- Economía colaborativa: el eje 14 incorpora servicios, herramientas y espacios para ingresos complementarios; el 15, obligaciones, comisiones, clasificación laboral e ingreso neto por hora total; el 24, pruebas voluntarias antes de endeudarse; el 25, competencia entre taxi, VTC, cooperativas y plataformas. Compartir gastos no equivale a transporte comercial autorizado. La CNMC recurrió determinadas reglas baleares en julio de 2026; no se presenta el recurso como anulación. El eje 12 exige transparencia de influencia de todos los operadores, sin presumir corrupción.
- La figura de taxi/VTC usa la tabla estatal de 1 de septiembre de 2026: 60.074 VT-N y 27.107 VTC-N. No son conductores ni todas las licencias municipales, y el ámbito nacional no acredita cualquier servicio urbano. El enlace del Ministerio es actualizable; la figura mantiene su fecha. No se inventa ingreso esperado de conductores ni reducción de precios.
- El eje 29 incorpora planes A/B/C, funciones esenciales, dependencias, activación, ejercicios y correcciones ante guerras, crisis energéticas, desastres y otros incidentes. La orientación europea de 72 horas no es una certificación de capacidad nacional. El cierre de Hormuz es un escenario de estrés, no un evento confirmado aquí; no se publica información sensible de operadores.
- El eje 30 propone una Constitución clara y accesible: explicación no normativa, diagnóstico de ambigüedades evitables y reformas de redacción justificadas, sin recortar derechos ni imponer una lectura única. Metas documentales: 12 fichas probadas con 200 participantes el primer año y 40 con 600 participantes acumulados en cuatro años, sujetas a recursos; no son reformas aprobadas ni una muestra representativa. La fuente F35 y el gráfico de estructura son normativos, no una medida de complejidad. Se distinguen los procedimientos de los artículos 166–169, incluido el referéndum obligatorio del 168; el eje no activa un cuarto frente inicial.
- El eje 31 conecta justicia accesible y ágil con integridad y vivienda, preservando defensa, asistencia jurídica, protección de víctimas e independencia. Propone reducir esperas de actuaciones de gestión seleccionadas un 15 % en el primer año y un 25 % en cuatro años, en 3 y 10 unidades adheridas respectivamente; no son plazos de juicio ni resultados garantizados. F36 documenta las estimaciones civiles del CGPJ de 2025 (15,5 meses en ordinarios y 11,1 en «Demás verbales»), no duraciones individuales ni prueba de corrupción; F37 documenta asistencia jurídica gratuita sin prometer acceso universal.
- Las tarjetas tienen títulos con puntuación final y enlaces directos como <https://openspain.org/programa.html#eje-19>, <https://openspain.org/programa.html#eje-30> y <https://openspain.org/programa.html#eje-31>. Al abrir uno, se muestran todos los ejes, se limpia la búsqueda y se desplaza la tarjeta correspondiente bajo la cabecera.
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

El programa completo y la presentación de una página usan fondo grafito en todas sus páginas, incluidos los márgenes, texto blanco sin grises de lectura y acentos lima. Comparten Manrope, símbolo circular blanco y nombre sin bandera con la web. `informe.css` adapta portada, tablas y gráficos del programa; `presentacion.html` define el mismo estilo en su hoja independiente. Los datos observados siguen siendo distintos de las metas propuestas. La portada del programa recoge la aspiración «Una España abierta donde vivir bien, crear y prosperar»; el texto completo se conserva desde `PROGRAMA.md`. Los enlaces de descarga están versionados para renovar la caché al regenerar cada PDF.

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

Genera `video/OpenSpain-Hazte-Simpatizante.mp4`: vertical 1080 × 1920, 30 fps, unos 45 s, para Reels, TikTok y Shorts. `video/video.html` define la animación con una línea de tiempo determinista (ábrelo en el navegador para previsualizarla en bucle); `PACE` controla la velocidad general (más alto, más pausado). `video/audio.mjs` recupera la música original: mismo bajo, armonía, ritmo y cierre, con bombos y cajas al 55 % de su ganancia original e impactos de ruido al 50 %. Los dos vídeos web vuelven a la normalización anterior, de unos −14 LUFS, con limitadores de pico. Requiere Playwright con Chromium y ffmpeg; Manrope se incluye en el repositorio y no depende de fuentes instaladas en macOS. `node video/render.mjs --preview 5.8,33` guarda fotogramas sueltos en `video/preview/`.

Sigue la prueba visual de la web: fondo grafito, planeta plateado, texto blanco y gris y acentos lima, con Manrope y contraste de pesos; símbolo circular actualizado, nombre sin bandera, etiquetas con punto y flechas ↗. `video/studio.css` adapta las dos plantillas sin modificar `brand.css` ni la serie de Instagram. Abre con «Abrir España. Ampliar oportunidades.» e incorpora libertad, generosidad y responsabilidad y «Pensar distinto. Trabajar juntos». Mantiene las entradas principales suaves. El cierre muestra un QR (`video/qr-simpatizante.svg`) al mismo formulario de simpatizantes que la web, sin nombrar la herramienta, y aclara que la inscripción no es afiliación, firma ni compromiso de aval. Los textos resumen el programa (31 ejes para contrastar, problemas y hasta tres frentes iniciales) sin presentar medidas como aprobadas. Si cambia el enlace del formulario, regenera el QR y el vídeo.

La página `participa.html` muestra el vídeo vertical con controles nativos, sin reproducción automática ni bucle, `playsinline` y `preload="none"`. Mantiene el botón de inscripción fuera del reproductor, transcripción desplegable y enlace de descarga. No incluye una pista de subtítulos que repita el texto ya visible: no hay voz ni información hablada que transcribir. La portada estática (`video/hazte-simpatizante-portada.jpg`) evita iniciar animaciones al cargar. El cierre y la transcripción usan `openspain.org`; las URLs del MP4 y la portada llevan una versión para renovar la caché cuando se regeneran. GitHub Pages y el servidor local publican únicamente los MP4 y portadas, no las fuentes de renderizado. El servidor local admite rangos de bytes para avanzar en los vídeos.

Cuando regeneres el vídeo, actualiza transcripción y portada. El renderizador comprueba el encuadre de ambos formatos y sustituye el MP4 solo al terminar la codificación. La portada actual se extrae del segundo 42,5 y se reduce a 540 × 960 píxeles:

Para cambiar solo el diseño, `node video/render.mjs --keep-audio` (o con `--changes` para el horizontal) vuelve a renderizar la imagen y copia exactamente el audio del MP4 existente, sin sintetizarlo, normalizarlo ni recodificarlo. Requiere un MP4 previo y no se puede combinar con `--audio-only`. Regenera también las portadas y renueva la versión de sus URLs y las de los MP4 en las páginas; esta prueba usa `20261015-studio-lima`.

Para cambiar solo la música, `node video/render.mjs --audio-only` (o con `--changes` para el horizontal) conserva el flujo de vídeo sin recodificar: no altera diseño, animaciones, textos ni portada. Renueva únicamente la versión de los MP4 en las páginas. Los dos vídeos web acentúan los cambios de tema, no las entradas de cada texto. El sintetizador conserva todos los bombos y cajas del ritmo original. Si el impacto de transición cae demasiado cerca de un beat, desplaza solo ese impacto a un cuarto del intervalo después del beat; no borra ni sustituye percusión. Mantiene el bajo y la melodía.

```sh
ffmpeg -y -ss 42.5 -i video/OpenSpain-Hazte-Simpatizante.mp4 -frames:v 1 -vf scale=540:960 -q:v 3 video/hazte-simpatizante-portada.jpg
```

### Vídeo horizontal «Qué queremos cambiar»

```sh
node video/render.mjs --changes
```

Genera `video/OpenSpain-Cambios.mp4`: 1920 × 1080, 30 fps, 60 segundos, H.264/AAC. `video/cambios.html` contiene una composición 16:9 real, sin estirar o recortar el vídeo vertical; el renderizador lee los ocho mensajes del apartado 1.3 y comprueba sus límites de encuadre antes de codificar. Los mensajes usan lenguaje cotidiano; los costes y garantías completos permanecen en los ocho pilares. La música reutiliza el sintetizador original con golpes atenuados. El inicio presenta el propósito y el cierre invita a aportar.

Inicio muestra este vídeo a todo el ancho, con portada (`video/cambios-portada.jpg`) y acceso al texto del guion, sin subtítulos duplicados. No se descarga el MP4 antes de reproducirlo. Al cambiar el guion, regenera el vídeo y actualiza transcripción y portada:

```sh
ffmpeg -y -ss 25 -i video/OpenSpain-Cambios.mp4 -frames:v 1 -vf scale=1280:720 -q:v 3 video/cambios-portada.jpg
```

## Serie de Instagram

`node video/render-instagram.mjs` genera 32 vídeos verticales 1080 × 1920 a 30 fps: el decálogo completo y una pieza por cada eje. Incluyen texto con entradas y salidas suaves, música original, portada JPG, subtítulos VTT, guiones JSON y descripciones listas para copiar. `--only eje-01` o `--only 00-decalogo` permite regenerar una pieza.

Los guiones leen directamente el programa: cada eje conserva propuesta, costes y garantías y criterios de comprobación; omite el ejemplo hipotético y las metas de pilotos para no confundirlos con resultados. El decálogo utiliza sus títulos y resúmenes editoriales en `video/instagram.mjs`, que deben revisarse si cambian las exigencias; el JSON conserva también sus descripciones originales. La duración se adapta al texto, con un máximo de 2,5 palabras por segundo; no se comprimen garantías para cumplir una duración comercial. Todas las piezas indican que son propuestas, muestran `openspain.org` y terminan invitando a comentar «PARTICIPA». El envío del enlace debe hacerse manualmente: no hay automatización de mensajes.

Los resultados se guardan en `video/instagram/`, excluidos de Git y del despliegue web. Requiere las mismas dependencias, Chromium y ffmpeg que los otros vídeos.

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

Las seis páginas HTML, `styles.css`, `brand.css`, `fonts/manrope-variable.ttf`, `fonts/OFL.txt`, `app.js`, `site.js`, `ui.js`, `routes.js`, `program.js`, `charts.js`, iconos, logos (incluida la variante clara) y `PROGRAMA.md`, además de los archivos del informe y PDF. Conserva las rutas de los dos vídeos y sus portadas. `.github/workflows/pages.yml` y `server.mjs` mantienen la lista explícita de archivos públicos. No publiques `node_modules`, pruebas ni fuentes de renderizado.
