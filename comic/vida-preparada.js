const housingSource = {
  autor: 'Banco de España',
  documento: 'Informe Anual 2025, capítulo 2',
  url: 'https://www.bde.es/f/webbe/SES/Secciones/Publicaciones/PublicacionesAnuales/InformesAnuales/25/InfAnual_2025.pdf',
  paginas: [155, 157],
  periodo: '2021–2025',
  consultado: '2026-10-16',
  datos: [
    {
      ambito: 'España',
      indicador: 'Creación neta de hogares menos viviendas residenciales terminadas, acumulada en el período',
      valor: 750000,
      unidad: 'viviendas',
      limite: 'Indicador de flujos: no es un censo de todas las necesidades habitacionales, una meta de obra ni una cifra municipal.',
    },
    {
      ambito: 'Conjunto de las provincias de Madrid, Barcelona, Alicante, València, Murcia y Málaga',
      indicador: 'Proporción del diferencial acumulado nacional',
      valor: 52.5,
      unidad: '%',
      limite: 'No atribuye una cantidad individual a cada provincia ni a sus municipios. No se reparte el total automáticamente.',
    },
  ],
};

const lifeSlides = [
  {
    id: '01-vivienda-un-desfase-documentado',
    chapter: 'CONSTRUIR CON DATOS',
    title: ['0,75 millones:', 'un desfase documentado.'],
    caption: 'España, 2021–2025: hogares creados menos viviendas terminadas. Banco de España, Informe Anual 2025, pp. 155 y 157. No es un plan de obras aprobado.',
    alt: 'Un panel indica 0,75 millones de viviendas como desfase acumulado en España entre 2021 y 2025. Se identifica el Banco de España y se aclara que es la diferencia entre nuevos hogares y viviendas terminadas, no una meta municipal ni un programa de obras aprobado.',
    art: scene(0, `${city()}
      <g class="ink">
        <rect x="43" y="269" width="406" height="295" rx="15" fill="${white}"/>
        <path d="M43 327H449V284Q449 269 434 269H58Q43 269 43 284Z" fill="${lime}"/>
        <text class="small-label" x="246" y="307" text-anchor="middle">ESPAÑA · 2021–2025</text>
        <text x="246" y="426" text-anchor="middle" font-size="78">0,75 M</text>
        <text class="small-label" x="246" y="468" text-anchor="middle">DESFASE ACUMULADO</text>
        <path d="M75 494H418" fill="none" stroke-width="3"/>
        <text x="246" y="530" text-anchor="middle" font-size="18">BDE · INFORME ANUAL 2025</text>
      </g>
      ${citizen(511, 491, .9, 2)}
      ${hero(778, 424, 1, 'point')}
      ${bubble(28, 35, 436, ['¿CUÁNTAS VIVIENDAS', 'FALTAN DE VERDAD?'])}
      ${bubble(501, 48, 429, ['DATOS CLAROS.', 'VIVIENDAS HABITABLES.'], 180)}`, 'Un desfase nacional documentado, no una cifra inventada para una ciudad'),
  },
  {
    id: '02-oferta-donde-hace-falta',
    chapter: 'DÓNDE SE CONCENTRA',
    title: ['Más oferta donde', 'la vida la necesita.'],
    caption: 'Seis provincias concentran el 52,5 % del desfase de 2021–2025 (BDE, IA 2025, p. 155). No son cifras municipales ni cupos de construcción por ciudad.',
    alt: 'Un panel muestra el 52,5 % y enumera seis provincias: Madrid, Barcelona, Alicante, València, Murcia y Málaga. La cifra corresponde a su participación conjunta en el desfase nacional de 2021 a 2025, no a un déficit individual por ciudad.',
    art: scene(1, `
      <g class="ink">
        <rect x="39" y="264" width="424" height="320" rx="15" fill="${white}"/>
        <path d="M39 322H463V279Q463 264 448 264H54Q39 264 39 279Z" fill="${lime}"/>
        <text class="label" x="251" y="303" text-anchor="middle">SEIS PROVINCIAS</text>
        <text x="251" y="412" text-anchor="middle" font-size="76">52,5 %</text>
        ${[['Madrid', 'València'], ['Barcelona', 'Murcia'], ['Alicante', 'Málaga']].map((pair, index) => `
          <text x="70" y="${459 + index * 41}" font-size="23">${pair[0]}</text>
          <text x="284" y="${459 + index * 41}" font-size="23">${pair[1]}</text>
        `).join('')}
      </g>
      ${citizen(516, 493, .89, 1)}
      ${hero(783, 424, 1, 'point')}
      ${bubble(28, 34, 436, ['¿Y CUÁNTAS FALTAN', 'EN CADA CIUDAD?'])}
      ${bubble(501, 47, 429, ['DIAGNÓSTICO LOCAL.', 'MÁS OFERTA DONDE FALTA.'], 180)}`, 'Concentración provincial documentada, sin repartir cifras municipales no disponibles'),
  },
  {
    id: '03-construir-con-servicios',
    chapter: 'DEL PLANO A LA VIVIENDA',
    title: ['Viviendas entregadas.', 'No solo suelo anunciado.'],
    caption: 'Construir, rehabilitar y movilizar oferta donde haga falta, con suelo, licencias, financiación, transporte y servicios. Alquiler asequible mantenido en el tiempo.',
    alt: 'Una grúa, un edificio en construcción y un autobús representan vivienda conectada con servicios. OpenSpain insiste en entregar viviendas habitables y asequibles, no contar anuncios o suelo reclasificado como casas ya disponibles.',
    art: scene(2, `
      <g class="ink">
        <path d="M183 563V264H395M93 286H381M183 264L93 286M183 264L381 286" fill="none" stroke-width="8"/>
        <path d="M335 288V367Q351 374 339 384" fill="none" stroke-width="5"/>
        <rect x="66" y="379" width="217" height="174" fill="${white}"/>
        <path d="M66 379V354H283V379M103 379V554M175 379V554M247 379V554" fill="none" stroke-width="7"/>
        <path d="M67 438H282M67 498H282" fill="none" stroke-width="6"/>
        <path d="M120 454h37v28h-37Zm73 0h37v28h-37Z" fill="${lime}" stroke-width="4"/>
        <rect x="332" y="476" width="108" height="75" rx="15" fill="${lime}"/>
        <path d="M346 491H427V517H346Z" fill="${white}" stroke-width="4"/>
        <circle cx="352" cy="554" r="10" fill="${ink}"/><circle cx="418" cy="554" r="10" fill="${ink}"/>
        <rect x="40" y="576" width="420" height="43" rx="8" fill="${white}"/>
        <text class="small-label" x="250" y="606" text-anchor="middle">ALQUILER ASEQUIBLE + SERVICIOS</text>
      </g>
      ${citizen(515, 494, .88, 0)}
      ${hero(783, 424, 1, 'point')}
      ${bubble(28, 34, 436, ['¿YA HAY CASAS O', 'SOLO OTRO ANUNCIO?'])}
      ${bubble(501, 47, 429, ['CONTEMOS VIVIENDAS', 'HABITABLES Y ENTREGADAS.'], 180)}`, 'Construcción y rehabilitación con servicios y financiación comprobables'),
  },
  {
    id: '04-eficiencia-y-menos-gas',
    chapter: 'MENOS DEPENDENCIA',
    title: ['Menos petróleo y gas.', 'Más eficiencia de verdad.'],
    caption: 'Aislar edificios, autoconsumo y bombas de calor donde sean viables, evaluando inversión y ahorro. Menos exposición al gas, no inmunidad frente a la inflación.',
    alt: 'Una casa muestra aislamiento, paneles solares y un equipo de bomba de calor cerrado. Son ejemplos de medidas que pueden reducir consumo y exposición a combustibles importados, no una promesa de independencia total ni de eliminar toda la inflación.',
    art: scene(3, `
      <g class="ink">
        <path d="M77 553V356L246 273L415 356V553Z" fill="${white}"/>
        <path d="M65 360L246 267L427 360" fill="none" stroke-width="13"/>
        <path d="M89 551V365L246 288L403 365V551" fill="none" stroke="${lime}" stroke-width="10"/>
        <path d="M153 312L228 273L308 315L235 354Z" fill="${grey}" stroke-width="5"/>
        <path d="M178 299L260 340M202 286L284 328M192 333L268 295" fill="none" stroke="${white}" stroke-width="3"/>
        <path d="M125 405h69v65h-69Zm167 0h69v65h-69Z" fill="${lime}" stroke-width="5"/>
        <rect x="212" y="484" width="146" height="88" rx="12" fill="${white}"/>
        <circle cx="255" cy="528" r="27" fill="${lime}" stroke-width="5"/>
        <path d="M255 506V549M233 528H277M297 512H337M297 535H337" fill="none" stroke-width="4"/>
        <rect x="42" y="588" width="420" height="34" rx="7" fill="${white}"/>
        <text x="252" y="612" text-anchor="middle" font-size="18">AISLAR · AUTOCONSUMO · ELECTRIFICAR</text>
      </g>
      ${citizen(517, 495, .87, 1)}
      ${hero(784, 424, 1, 'point')}
      ${bubble(28, 34, 436, ['¿OTRA SUBIDA DEL GAS', 'Y A CRUZAR LOS DEDOS?'])}
      ${bubble(501, 47, 429, ['GASTAR MENOS ENERGÍA.', 'SUSTITUIR DONDE SEA VIABLE.'], 180)}`, 'Eficiencia, autoconsumo y electrificación evaluados por inversión y ahorro'),
  },
  {
    id: '05-redes-respaldo-y-costes',
    chapter: 'SUMINISTRO FIABLE',
    title: ['La energía fiable', 'no sale de una consigna.'],
    caption: 'Redes, almacenamiento y respaldo fiable. Comparar también nuclear por coste total, seguridad y plazos. No retirar capacidad sin alternativa ni prometer precios fijos.',
    alt: 'Un aerogenerador, paneles solares, una batería y conexiones simbolizan un sistema eléctrico completo. El texto incluye comparar nuclear con otras opciones por coste, seguridad y plazos, sin anunciar autorizaciones ni retirar respaldo antes de tener alternativas.',
    art: scene(4, `
      <g class="ink">
        <path d="M137 552V360" fill="none" stroke-width="10"/>
        <path d="M137 360L137 274M137 360L60 411M137 360L216 409" fill="none" stroke-width="12"/>
        <circle cx="137" cy="360" r="15" fill="${lime}"/>
        <rect x="328" y="329" width="106" height="156" rx="12" fill="${white}"/>
        <path d="M356 329V313H405V329" fill="${grey}" stroke-width="5"/>
        <rect x="348" y="353" width="66" height="101" rx="4" fill="${lime}" stroke-width="4"/>
        <path d="M271 405H312M158 485H294V463" fill="none" stroke="${lime}" stroke-width="10"/>
        <path d="M224 501H424L402 551H201Z" fill="${grey}" stroke-width="5"/>
        <path d="M251 501L234 551M301 501L284 551M351 501L334 551M213 526H412" fill="none" stroke="${white}" stroke-width="3"/>
        <rect x="39" y="580" width="424" height="42" rx="8" fill="${white}"/>
        <text x="251" y="609" text-anchor="middle" font-size="18">REDES + ALMACENAMIENTO + RESPALDO</text>
      </g>
      ${citizen(516, 494, .88, 2)}
      ${hero(783, 424, 1, 'point')}
      ${bubble(28, 34, 436, ['¿Y CUANDO NO HAYA SOL', 'O FALLE UN SUMINISTRO?'])}
      ${bubble(501, 47, 429, ['ALTERNATIVAS FIABLES.', 'COSTE TOTAL Y SEGURIDAD.'], 180)}`, 'Planificación de redes, generación, almacenamiento y respaldo sin elegir por consignas'),
  },
  {
    id: '06-un-plan-b-ensayado',
    chapter: 'PREPARARSE SIN ALARMISMO',
    title: ['Si falla el plan A,', 'el B debe funcionar.'],
    caption: 'Guerras o cortes son escenarios, no predicciones. Responsables, proveedores alternativos, reservas mantenidas y simulacros para sostener los servicios esenciales.',
    alt: 'Tres tarjetas de servicios, alternativas y emergencia se enlazan bajo las letras A, B y C. Una etiqueta dice simulacro. El héroe propone ensayar continuidad de servicios y corregir fallos, sin afirmar que una guerra sea inminente ni publicar vulnerabilidades.',
    art: scene(5, `
      <g class="ink">
        ${[['A', 'SERVICIOS'], ['B', 'ALTERNATIVAS'], ['C', 'EMERGENCIA']].map((row, index) => `
          <rect x="53" y="${266 + index * 105}" width="393" height="78" rx="13" fill="${white}"/>
          <circle cx="99" cy="${305 + index * 105}" r="25" fill="${lime}" stroke-width="5"/>
          <text x="99" y="${314 + index * 105}" text-anchor="middle" font-size="27">${row[0]}</text>
          <text class="label" x="151" y="${315 + index * 105}">${row[1]}</text>
          ${index < 2 ? `<path d="M250 ${349 + index * 105}v16m-10 -6 10 10 10 -10" fill="none" stroke-width="5"/>` : ''}
        `).join('')}
        <rect x="94" y="586" width="312" height="35" rx="7" fill="${lime}"/>
        <text x="250" y="612" text-anchor="middle" font-size="18">SIMULACRO · CORREGIR FALLOS</text>
      </g>
      ${citizen(514, 494, .88, 3)}
      ${hero(781, 424, 1, 'point')}
      ${bubble(28, 34, 436, ['¿EL PLAN ES ESPERAR', 'A QUE NO PASE NADA?'])}
      ${bubble(501, 47, 429, ['ENSAYAR ALTERNATIVAS.', 'Y CORREGIR LO QUE FALLE.'], 180)}`, 'Planes de continuidad ensayados para servicios esenciales'),
  },
  {
    id: '07-esfuerzo-y-aprendizaje',
    chapter: 'APRENDER HACIENDO',
    title: ['El esfuerzo cuenta.', 'Aprender exige práctica.'],
    caption: 'Conocimientos básicos, esfuerzo y práctica, con docentes preparados y apoyos según necesidades. Comprender, aplicar y corregir: no solo memorizar.',
    alt: 'Una pizarra conecta comprender, practicar y corregir. Una docente y OpenSpain representan una educación que reconoce esfuerzo y aprendizaje, con apoyos, sin culpar por falta de recursos ni sustituir conocimientos fundamentales por actividades sueltas.',
    art: scene(6, `
      <g class="ink">
        <rect x="43" y="270" width="410" height="281" rx="15" fill="${white}"/>
        <path d="M43 330H453V285Q453 270 438 270H58Q43 270 43 285Z" fill="${lime}"/>
        <text class="label" x="248" y="310" text-anchor="middle">ESFUERZO + APOYO</text>
        ${['COMPRENDER', 'PRACTICAR', 'CORREGIR'].map((text, index) => `
          <text class="label" x="248" y="${382 + index * 67}" text-anchor="middle">${text}</text>
          ${index < 2 ? `<path d="M248 ${393 + index * 67}v15m-9 -5 9 9 9 -9" fill="none" stroke-width="4"/>` : ''}
        `).join('')}
        <path d="M66 571H427V590H66ZM91 591V626M405 591V626" fill="${grey}" stroke-width="5"/>
        <path d="M144 555L182 538L266 553L312 536V574L266 587L182 570L144 580Z" fill="${white}" stroke-width="4"/>
      </g>
      ${citizen(516, 494, .88, 3)}
      ${hero(782, 424, 1, 'point')}
      ${bubble(28, 34, 436, ['ME LO SÉ DE MEMORIA.', '¿SÉ USARLO EN LA VIDA?'])}
      ${bubble(501, 47, 429, ['PRACTICA, COMPRENDE.', 'EQUIVÓCATE Y MEJORA.'], 180)}`, 'Aprender con esfuerzo, práctica, conocimientos y apoyos adecuados'),
  },
  {
    id: '08-finanzas-para-la-vida',
    chapter: 'ENTENDER TU DINERO',
    title: ['Entender tu dinero', 'también se aprende.'],
    caption: 'Presupuesto, ahorro, intereses, impuestos, deuda y detección de estafas. Casos adaptados a la edad, sin publicidad ni promesas de rentabilidad.',
    alt: 'Un cuaderno con ingresos, gastos y ahorro acompaña una calculadora. La escena enseña a comparar intereses y comisiones y a detectar estafas, sin publicitar productos ni inventar una rentabilidad garantizada.',
    art: scene(7, `
      <g class="ink">
        <rect x="43" y="270" width="403" height="285" rx="14" fill="${white}"/>
        <path d="M43 328H446V284Q446 270 432 270H57Q43 270 43 284Z" fill="${lime}"/>
        <text class="label" x="245" y="308" text-anchor="middle">MI PRESUPUESTO</text>
        ${['INGRESOS', 'GASTOS', 'AHORRO'].map((label, index) => `
          <text class="label" x="72" y="${382 + index * 65}">${label}</text>
          <path d="M286 ${371 + index * 65}H414" fill="none" stroke-width="5"/>
        `).join('')}
        <rect x="329" y="491" width="110" height="129" rx="12" fill="${grey}"/>
        <rect x="347" y="505" width="74" height="32" rx="4" fill="${lime}" stroke-width="4"/>
        ${[0, 1, 2].map(row => [0, 1, 2].map(col => `<rect x="${348 + col * 26}" y="${551 + row * 20}" width="14" height="10" rx="2" fill="${white}" stroke-width="2"/>`).join('')).join('')}
      </g>
      ${citizen(516, 494, .88, 4)}
      ${hero(782, 424, 1, 'point')}
      ${bubble(28, 34, 436, ['¿ME SALE A CUENTA', 'PAGARLO TODO A PLAZOS?'])}
      ${bubble(501, 47, 429, ['SUMA INTERESES', 'Y COMISIONES. COMPARA.'], 180)}`, 'Finanzas personales prácticas y sin publicidad'),
  },
  {
    id: '09-cocinar-y-cuidarte',
    chapter: 'HABILIDADES COTIDIANAS',
    title: ['Cocinar, cuidarte,', 'resolver lo cotidiano.'],
    caption: 'Cocinar, planificar compras, higiene y alimentación; primeros auxilios con profesionales y protección digital. Aprender con seguridad, según edad y necesidades.',
    alt: 'Una olla cerrada, alimentos, un cuenco y un plan de compras representan habilidades cotidianas. OpenSpain propone practicar cocina, autocuidado y otras competencias con seguridad y apoyo profesional cuando sea necesario.',
    art: scene(8, `
      <g class="ink">
        <rect x="53" y="273" width="158" height="152" rx="12" fill="${white}"/>
        <path d="M53 328H211M181 297V310M181 353V384" fill="none" stroke-width="5"/>
        <rect x="252" y="273" width="188" height="151" rx="10" fill="${white}"/>
        <text class="label" x="346" y="313" text-anchor="middle">PLANIFICAR</text>
        <text class="small-label" x="276" y="354">COMPRA</text>
        <text class="small-label" x="276" y="391">CUIDADOS</text>
        <path d="M46 473H461V505H46ZM71 506V624M435 506V624" fill="${grey}"/>
        <path d="M92 419H223V465H92Z" fill="${lime}"/>
        <path d="M84 417H231M138 409Q156 386 176 409M92 434H73M223 434H241" fill="none" stroke-width="6"/>
        <path d="M299 440H422Q411 475 362 474Q314 473 299 440Z" fill="${white}" stroke-width="5"/>
        <path d="M334 436Q313 412 336 404Q361 414 350 437M371 437Q363 400 385 407Q398 424 386 440" fill="${lime}" stroke-width="4"/>
      </g>
      ${citizen(518, 493, .88, 0)}
      ${hero(783, 424, 1, 'point')}
      ${bubble(28, 34, 436, ['SÉ HACER UN EXAMEN.', '¿Y PREPARARME LA CENA?'])}
      ${bubble(501, 47, 429, ['HABILIDADES REALES.', 'PRÁCTICA CON SEGURIDAD.'], 180)}`, 'Cocina, autocuidado y autonomía cotidiana aprendidos con seguridad'),
  },
  {
    id: '10-emociones-y-valores',
    chapter: 'CONVIVIR Y SEGUIR APRENDIENDO',
    title: ['Aprender a convivir.', 'Volver a intentarlo.'],
    caption: 'Gestión emocional, respeto, honestidad, generosidad y responsabilidad. Reconocer esfuerzo y reparar errores, sin imponer creencias ni sustituir atención clínica.',
    alt: 'Una pizarra enumera honestidad, generosidad, responsabilidad, empatía y constancia. La escena anima a reparar, aprender y pedir ayuda. Son valores cívicos compartidos, sin etiquetas religiosas ni sustitución de atención clínica.',
    art: scene(9, `
      <g class="ink">
        <rect x="42" y="269" width="419" height="318" rx="15" fill="${white}"/>
        <path d="M42 328H461V284Q461 269 446 269H57Q42 269 42 284Z" fill="${lime}"/>
        <text class="label" x="251" y="308" text-anchor="middle">VALORES COMPARTIDOS</text>
        ${['HONESTIDAD', 'GENEROSIDAD', 'RESPONSABILIDAD', 'EMPATÍA', 'CONSTANCIA'].map((label, index) => `
          <text class="label" x="76" y="${369 + index * 46}">${label}</text>
        `).join('')}
      </g>
      ${citizen(522, 492, .88, 1)}
      ${hero(786, 424, 1, 'point')}
      ${bubble(28, 34, 436, ['ME HE EQUIVOCADO.', '¿Y AHORA QUÉ?'])}
      ${bubble(501, 47, 429, ['REPARAR, APRENDER,', 'Y SABER PEDIR AYUDA.'], 180)}`, 'Gestión emocional y valores cívicos compartidos sin imponer creencias'),
  },
  {
    id: '11-una-vida-con-opciones',
    chapter: 'CONTINUARÁ CONTIGO',
    title: ['Una vida con opciones.', 'Un país que se prepara.'],
    caption: 'Construir con servicios, reducir dependencias y aprender para la vida. Con costes, responsables y garantías. Participa y exige explicaciones.',
    alt: 'OpenSpain se une a cinco ciudadanos ante una ciudad y un cartel de vivienda, energía y educación. El cierre pide planes con recursos y resultados comprobables e invita a participar, no promete que el héroe lo resuelva todo.',
    art: scene(10, `${city()}
      <circle cx="492" cy="365" r="213" fill="${lime}" opacity=".5"/>
      <g class="ink">
        <rect x="34" y="184" width="892" height="72" rx="12" fill="${white}"/>
        <text x="480" y="231" text-anchor="middle" font-size="23">VIVIENDA · ENERGÍA · EDUCACIÓN</text>
      </g>
      ${citizen(126, 495, .9, 0, true)}
      ${citizen(279, 488, .94, 1)}
      ${hero(506, 437, .94)}
      ${citizen(692, 487, .97, 2)}
      ${citizen(834, 503, .85, 3, true)}
      ${citizen(391, 522, .72, 4)}
      ${bubble(28, 35, 436, ['MENOS PROMESAS EN EL AIRE.'])}
      ${bubble(500, 39, 430, ['PLANES CON RECURSOS.', 'RESULTADOS MEDIBLES.'], 90)}`, 'Un proyecto colectivo con vivienda, energía fiable y educación práctica'),
  },
];

renderComic({
  id: 'vida-preparada',
  title: 'Una vida con opciones',
  dense: true,
  slides: lifeSlides,
  sources: [
    housingSource,
    {
      documento: 'Programa de OpenSpain: ejes 2, 9, 17, 24 y 29',
      url: 'https://openspain.org/programa',
      limite: 'Propuestas sujetas a competencias, recursos, evaluación y garantías. Los ejemplos de cocina y vida cotidiana ilustran habilidades prácticas; no son un currículo ya aprobado.',
    },
  ],
  caption: `Una vida con opciones: vivienda, energía, preparación y educación práctica.\n\nVivienda: el Banco de España documenta un desfase acumulado de unas 750.000 viviendas en España entre 2021 y 2025, calculado como creación neta de hogares menos viviendas residenciales terminadas. El 52,5 % se concentra en el conjunto de seis provincias: Madrid, Barcelona, Alicante, València, Murcia y Málaga. Fuente: Informe Anual 2025, pp. 155 y 157. No es una cifra de necesidad total ni un objetivo de obra; no se atribuye un millón a Madrid ni se inventan cupos municipales. La fuente y los límites se adjuntan en fuentes.json.\n\nConstruir y rehabilitar donde exista demanda acreditada, con financiación, servicios y asequibilidad a largo plazo. Medir viviendas entregadas, no anuncios.\n\nEnergía: aislamiento, autoconsumo, electrificación, redes, almacenamiento y alternativas de respaldo, incluyendo la comparación nuclear por coste completo, seguridad y plazos. Reducir exposición a petróleo y gas no elimina toda la inflación.\n\nPreparación: responsables, alternativas de suministro, reservas mantenidas y simulacros. Guerras y cortes se tratan como escenarios, no como predicciones ni emergencias que OpenSpain dirija.\n\nEducación: conocimientos básicos, esfuerzo y práctica, finanzas, gestión emocional, cocina, autocuidado y valores compartidos como honestidad, generosidad y responsabilidad. Con apoyos, docentes preparados y sin imponer creencias.\n\nConsulta condiciones y participa:\nhttps://openspain.org/programa\nhttps://openspain.org/participa\n\nMini cómic de ficción inspirado en propuestas. No representa viviendas construidas, ahorros obtenidos, infraestructuras autorizadas ni un currículo aprobado.\n\n#OpenSpain #AbrirCaminos #Vivienda #Educación\n`,
});
