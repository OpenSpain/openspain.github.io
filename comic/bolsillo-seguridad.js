const pocketSlides = [
  {
    id: '01-tu-nomina-irpf',
    chapter: 'TU NÓMINA',
    title: ['Que tu esfuerzo', 'se note en tu bolsillo.'],
    caption: 'Proponer rebajas sostenibles del IRPF para mejorar la renta disponible, con coste y financiación explicados. No implica subir el sueldo bruto.',
    alt: 'Una ciudadana observa una nómina dibujada con las palabras bruto, IRPF y neto, sin cantidades inventadas. OpenSpain propone menos IRPF con cuentas que cuadren. La explicación distingue dinero disponible y sueldo bruto.',
    art: scene(0, `${city()}
      <g class="ink">
        <rect x="51" y="271" width="354" height="289" rx="15" fill="${white}"/>
        <path d="M51 327H405V287Q405 271 389 271H67Q51 271 51 287Z" fill="${lime}"/>
        <text class="label" x="228" y="309" text-anchor="middle">NÓMINA</text>
        <text class="label" x="83" y="376">BRUTO</text>
        <text class="label" x="83" y="443">IRPF</text>
        <text class="label" x="83" y="510">NETO</text>
        <path d="M245 365H368M245 432H368M245 499H368" fill="none" stroke-width="6"/>
        <path d="M77 469H380" fill="none" stroke-width="3"/>
      </g>
      ${citizen(475, 488, .94, 1)}
      ${hero(756, 424, 1, 'point')}
      ${bubble(29, 36, 434, ['TRABAJO. ¿Y LO QUE', 'ME QUEDA A FIN DE MES?'])}
      ${bubble(501, 49, 428, ['MENOS IRPF, CON', 'CUENTAS QUE CUADREN.'], 180)}`, 'Una nómina sin cifras y una propuesta de alivio fiscal financiado'),
  },
  {
    id: '02-iva-y-precio-final',
    chapter: 'TU COMPRA',
    title: ['El ahorro debe', 'llegar a tu compra.'],
    caption: 'Evaluar rebajas del IVA y comprobar que lleguen al precio final, dentro del marco europeo y con financiación. Sin prometer una bajada automática.',
    alt: 'Una compradora y OpenSpain están junto a una cesta y un cartel que distingue IVA y precio final. La viñeta pregunta si baja el coste real o solo cambia el cartel, sin inventar porcentajes ni asegurar que toda rebaja se traslade al consumidor.',
    art: scene(1, `
      <g class="ink">
        <path d="M49 306H447V336H49ZM67 335V600M430 335V600" fill="${grey}"/>
        <rect x="81" y="253" width="336" height="74" rx="12" fill="${lime}"/>
        <text class="label" x="249" y="300" text-anchor="middle">PRECIO FINAL</text>
        <rect x="91" y="378" width="130" height="115" rx="9" fill="${white}"/>
        <text class="label" x="156" y="426" text-anchor="middle">IVA</text>
        <path d="M129 449H181" fill="none" stroke-width="5"/>
        <path d="M257 387H385V500H257Z" fill="${white}"/>
        <path d="M278 416H366M278 447H351M278 477H364" fill="none" stroke-width="5"/>
        <path d="M81 535H427" fill="none" stroke-width="5"/>
        <path d="M320 513L348 607H478L503 513Z" fill="${lime}"/>
        <path d="M357 513Q355 465 384 464Q415 464 423 513" fill="none"/>
        <path d="M362 544V580M396 544V580M430 544V580" fill="none" stroke-width="5"/>
      </g>
      ${citizen(258, 484, .96, 0)}
      ${hero(759, 425, 1, 'point')}
      ${bubble(29, 37, 435, ['¿BAJA EL IVA O', 'SOLO CAMBIA EL CARTEL?'])}
      ${bubble(500, 49, 430, ['EL AHORRO DEBE', 'LLEGAR A TU COMPRA.'], 180)}`, 'Una rebaja del impuesto debe comprobarse en el precio de la compra'),
  },
  {
    id: '03-duplicidades-autonomicas',
    chapter: 'EL GASTO PÚBLICO',
    title: ['Menos duplicidades.', 'No menos servicios.'],
    caption: 'Reducir organismos y funciones autonómicas duplicadas, con ahorro neto comprobado y sin recortar servicios. No supone eliminar las CCAA.',
    alt: 'Dos oficinas autonómicas ficticias realizan la misma función y una flecha las conecta con un servicio compartido. OpenSpain y un ciudadano proponen reducir duplicidades acreditadas, no eliminar comunidades autónomas ni recortar la atención.',
    art: scene(2, `
      <g class="ink">
        <rect x="43" y="251" width="401" height="61" rx="10" fill="${lime}"/>
        <text class="small-label" x="243" y="290" text-anchor="middle">ESTRUCTURAS AUTONÓMICAS</text>
        ${[49, 269].map(x => `
          <path d="M${x} 350L${x + 78} 322L${x + 157} 350V510H${x}Z" fill="${white}"/>
          <text class="small-label" x="${x + 79}" y="389" text-anchor="middle">MISMA</text>
          <text class="small-label" x="${x + 79}" y="418" text-anchor="middle">FUNCIÓN</text>
          <path d="M${x + 34} 452h32v58h-32Zm58 0h32v58h-32Z" fill="${grey}" stroke-width="5"/>
        `).join('')}
        <path d="M216 424H256" fill="none" stroke-width="7" stroke-dasharray="8 10"/>
        <path d="M220 496V538H194L241 568L289 538H262V496" fill="${lime}" stroke-width="5"/>
        <rect x="43" y="565" width="403" height="52" rx="9" fill="${white}"/>
        <text class="small-label" x="245" y="600" text-anchor="middle">SERVICIO COMPARTIDO</text>
      </g>
      ${citizen(501, 492, .9, 2)}
      ${hero(775, 424, 1, 'point')}
      ${bubble(28, 34, 436, ['¿DOS ORGANISMOS', 'PARA LA MISMA FUNCIÓN?'])}
      ${bubble(500, 48, 430, ['MENOS DUPLICIDADES.', 'NO MENOS SERVICIOS.'], 180)}`, 'Dos organismos redundantes y una propuesta de compartir servicios'),
  },
  {
    id: '04-corrupcion-con-consecuencias',
    chapter: 'EL DINERO DE TODOS',
    title: ['Lo público no es', 'un botín privado.'],
    caption: 'Revisar penas e inhabilitaciones insuficientes y recuperar lo robado. Más controles, proporcionalidad, pruebas y defensa.',
    alt: 'Una caja de dinero público y una flecha de devolución representan recuperar lo robado. No aparecen políticos reales ni acusaciones contra personas. OpenSpain propone reforzar penas insuficientes e inhabilitaciones con proporcionalidad y garantías.',
    art: scene(3, `
      <g class="ink">
        <rect x="51" y="291" width="330" height="237" rx="18" fill="${grey}"/>
        <rect x="75" y="314" width="282" height="190" rx="11" fill="${white}"/>
        <text class="small-label" x="216" y="351" text-anchor="middle">DINERO PÚBLICO</text>
        <circle cx="216" cy="422" r="42" fill="${lime}"/>
        <path d="M216 393V451M187 422H245" fill="none" stroke-width="6"/>
        <path d="M336 422H434V389L489 442L434 489V460H336Z" fill="${lime}" transform="translate(825 0) scale(-1 1)" stroke-width="5"/>
        <path d="M373 416Q383 386 412 396L428 425Q458 469 438 502H374Q351 471 373 416Z" fill="${lime}"/>
        <path d="M373 416H427" fill="none" stroke-width="5"/>
        <text x="404" y="479" text-anchor="middle" font-size="43">€</text>
        <rect x="43" y="563" width="437" height="53" rx="9" fill="${white}"/>
        <text class="small-label" x="261" y="598" text-anchor="middle">PENAS E INHABILITACIÓN</text>
      </g>
      ${citizen(517, 495, .87, 3)}
      ${hero(778, 424, 1, 'point')}
      ${bubble(27, 34, 437, ['¿ROBAR LO PÚBLICO', 'Y SEGUIR COMO SI NADA?'])}
      ${bubble(500, 47, 430, ['PENAS MÁS DURAS,', 'SI SON INSUFICIENTES.'], 180)}`, 'Recuperación del dinero público y revisión proporcionada de las penas'),
  },
  {
    id: '05-justicia-mas-agil',
    chapter: 'LOS TIEMPOS DE LA JUSTICIA',
    title: ['Justicia más ágil.', 'No menos garantías.'],
    caption: 'Más medios y mejor organización para reducir esperas, sin recortar defensa ni recursos. Jueces independientes: ninguna sentencia por orden del héroe.',
    alt: 'Un edificio de justicia, un reloj y una ciudadana representan las esperas judiciales. OpenSpain propone más medios y mejor organización, no sentencias dictadas por el héroe ni recortes de defensa o recursos.',
    art: scene(4, `
      <g class="ink">
        <path d="M49 349L234 271L419 349Z" fill="${lime}"/>
        <text class="label" x="234" y="331" text-anchor="middle">JUSTICIA</text>
        <path d="M64 354H403V383H64Z" fill="${white}"/>
        ${[89, 183, 277, 371].map(x => `<path d="M${x} 384V517H${x + 20}V384Z" fill="${white}" stroke-width="5"/>`).join('')}
        <path d="M57 522H416V549H57Z" fill="${grey}"/>
        <circle cx="416" cy="308" r="56" fill="${white}"/>
        <path d="M416 269V308L441 322" fill="none" stroke-width="6"/>
        <rect x="43" y="567" width="418" height="49" rx="9" fill="${white}"/>
        <text class="small-label" x="252" y="600" text-anchor="middle">TIEMPO PARA DEFENDERSE</text>
      </g>
      ${citizen(509, 495, .87, 1)}
      ${hero(777, 424, 1, 'point')}
      ${bubble(28, 33, 436, ['MI EXPEDIENTE NO', 'NECESITA OTRA TELARAÑA.'])}
      ${bubble(501, 31, 429, ['MÁS MEDIOS.', 'MENOS ESPERA.', 'SIN QUITAR DEFENSA.'], 180)}`, 'Una justicia independiente con menos esperas y defensa efectiva'),
  },
  {
    id: '06-mentira-acreditada-dimision',
    chapter: 'LA RESPONSABILIDAD POLÍTICA',
    title: ['Si mientes a sabiendas,', 'toca responder.'],
    caption: 'Mentira deliberada acreditada: exigir dimisión con pruebas, audiencia y revisión independiente. No castigar opiniones ni errores de buena fe.',
    alt: 'Un panel de hechos, pruebas y audiencia acompaña una silla vacía. Una ciudadana pregunta por un cargo que miente a sabiendas. OpenSpain exige dimisión solo ante una mentira deliberada acreditada, no por opiniones, errores o discrepancias.',
    art: scene(5, `
      <g class="ink">
        <rect x="43" y="280" width="354" height="272" rx="15" fill="${white}"/>
        <path d="M43 337H397V295Q397 280 382 280H58Q43 280 43 295Z" fill="${lime}"/>
        <text class="label" x="220" y="319" text-anchor="middle">HECHOS Y GARANTÍAS</text>
        <text class="small-label" x="70" y="385">AFIRMACIÓN CONCRETA</text>
        <text class="small-label" x="70" y="446">PRUEBAS</text>
        <text class="small-label" x="70" y="508">AUDIENCIA</text>
        <path d="M70 400H364M70 462H364" fill="none" stroke-width="3"/>
        <rect x="302" y="493" width="88" height="74" rx="8" fill="${grey}"/>
        <path d="M295 570H401V591H295ZM310 592V627M386 592V627" fill="${grey}" stroke-width="5"/>
        <path d="M299 509L387 515L379 550L304 544Z" fill="${white}" stroke-width="4"/>
        <text x="343" y="535" text-anchor="middle" font-size="14">DIMISIÓN</text>
      </g>
      ${citizen(491, 491, .9, 3)}
      ${hero(775, 424, 1, 'point')}
      ${bubble(28, 34, 436, ['¿Y SI UN CARGO PÚBLICO', 'MIENTE A SABIENDAS?'])}
      ${bubble(500, 48, 430, ['SI SE ACREDITA:', 'EXIGIR SU DIMISIÓN.'], 180)}`, 'Pruebas y revisión independiente antes de exigir dimisión por una mentira deliberada'),
  },
  {
    id: '07-fronteras-y-vias-legales',
    chapter: 'ORDEN Y VÍAS LEGALES',
    title: ['Fronteras seguras.', 'Vías legales claras.'],
    caption: 'Control fronterizo y contratación legal según necesidades reales. Sin contratos ficticios: trabajar exige la autorización aplicable. Asilo protegido.',
    alt: 'Una trabajadora consulta dos documentos separados, contrato y permiso, bajo el rótulo vía legal. OpenSpain propone fronteras seguras, contratación verificada y protección frente a trata y explotación. Un contrato no se presenta como autorización automática.',
    art: scene(6, `
      <g class="ink">
        <path d="M53 546V288H429V546" fill="none" stroke-width="18"/>
        <rect x="52" y="253" width="378" height="67" rx="11" fill="${lime}"/>
        <text class="label" x="241" y="297" text-anchor="middle">VÍA LEGAL</text>
        <rect x="77" y="352" width="146" height="176" rx="9" fill="${white}"/>
        <text class="small-label" x="150" y="388" text-anchor="middle">CONTRATO</text>
        <path d="M102 417H199M102 446H185M102 475H199" fill="none" stroke-width="5"/>
        <rect x="259" y="352" width="146" height="176" rx="9" fill="${white}"/>
        <text class="small-label" x="332" y="388" text-anchor="middle">PERMISO</text>
        <circle cx="332" cy="453" r="34" fill="${lime}"/>
        <text x="332" y="470" text-anchor="middle" font-size="47">?</text>
        <rect x="39" y="565" width="420" height="51" rx="9" fill="${white}"/>
        <text x="249" y="599" text-anchor="middle" font-size="18">NO A LA TRATA NI A LA EXPLOTACIÓN</text>
      </g>
      ${citizen(502, 491, .91, 1)}
      ${hero(777, 424, 1, 'point')}
      ${bubble(28, 35, 436, ['QUIERO VENIR A TRABAJAR.', '¿QUÉ VÍA LEGAL ME TOCA?'])}
      ${bubble(501, 48, 429, ['FRONTERAS SEGURAS.', 'VÍAS LEGALES CLARAS.'], 180)}`, 'Vías laborales legales con requisitos verificados y protección del asilo'),
  },
  {
    id: '08-condena-y-expulsion-legal',
    chapter: 'DELITOS Y GARANTÍAS',
    title: ['Delitos con condena.', 'Decisiones individuales.'],
    caption: 'Para extranjeros condenados, expulsión cuando proceda por ley, con decisión individual, recursos y no devolución a situaciones de riesgo.',
    alt: 'Un expediente muestra condena, aplicación legal y recurso, junto a una maleta sin identificar a ninguna persona o nacionalidad. OpenSpain explica que una expulsión solo procede legalmente mediante decisión individual y garantías, sin atribuir delincuencia a un origen.',
    art: scene(7, `
      <g class="ink">
        <rect x="43" y="273" width="382" height="292" rx="15" fill="${white}"/>
        <path d="M43 332H425V288Q425 273 410 273H58Q43 273 43 288Z" fill="${lime}"/>
        <text class="small-label" x="234" y="313" text-anchor="middle">DECISIÓN INDIVIDUAL</text>
        <text class="small-label" x="71" y="384">CONDENA</text>
        <text class="small-label" x="71" y="445">APLICACIÓN LEGAL</text>
        <text class="small-label" x="71" y="507">RECURSO</text>
        <path d="M71 402H394M71 464H394" fill="none" stroke-width="3"/>
        <rect x="87" y="521" width="143" height="90" rx="13" fill="${grey}"/>
        <path d="M124 521V503H193V521" fill="none" stroke-width="6"/>
        <path d="M112 538V592M207 538V592" fill="none" stroke-width="5"/>
        <circle cx="111" cy="616" r="8" fill="${ink}"/><circle cx="207" cy="616" r="8" fill="${ink}"/>
      </g>
      ${citizen(505, 493, .9, 2)}
      ${hero(777, 424, 1, 'point')}
      ${bubble(28, 35, 436, ['¿EXPULSIÓN TRAS', 'UNA CONDENA?'])}
      ${bubble(501, 47, 429, ['SI PROCEDE POR LEY.', 'CON DECISIÓN INDIVIDUAL.'], 180)}`, 'Aplicación individual de expulsiones legalmente procedentes, con recursos y no devolución a riesgo'),
  },
  {
    id: '09-el-estado-debe-responder',
    chapter: 'CONTINUARÁ CONTIGO',
    title: ['Tu bolsillo y tu seguridad', 'merecen respuestas.'],
    caption: 'Menos cargas y despilfarro, más seguridad y responsabilidad. Contrasta los costes, límites y garantías del programa y aporta tu propuesta.',
    alt: 'El héroe de OpenSpain y cinco ciudadanos forman un equipo bajo un cartel de bolsillo, responsabilidad y seguridad. El cierre invita a exigir explicaciones y a participar, sin prometer ahorros calculados ni medidas ya aprobadas.',
    art: scene(8, `${city()}
      <circle cx="492" cy="365" r="213" fill="${lime}" opacity=".5"/>
      <g class="ink">
        <rect x="34" y="184" width="892" height="72" rx="12" fill="${white}"/>
        <text x="480" y="231" text-anchor="middle" font-size="23">BOLSILLO · RESPONSABILIDAD · SEGURIDAD</text>
      </g>
      ${citizen(126, 495, .9, 0, true)}
      ${citizen(279, 488, .94, 1)}
      ${hero(506, 437, .94)}
      ${citizen(692, 487, .97, 2)}
      ${citizen(834, 503, .85, 3, true)}
      ${citizen(391, 522, .72, 4)}
      ${bubble(28, 37, 436, ['QUE EL ESTADO RESPONDA.'])}
      ${bubble(500, 42, 430, ['Y TÚ PUEDAS EXIGIRLO.'], 90)}`, 'Un equipo ciudadano exige cuentas claras y participa en propuestas con garantías'),
  },
];

renderComic({
  id: 'bolsillo-seguridad',
  title: 'Tu bolsillo, tus derechos, tu seguridad',
  dense: true,
  slides: pocketSlides,
  caption: `OpenSpain vuelve: tu bolsillo, tus derechos, tu seguridad.\n\nNueve viñetas sobre rebajas sostenibles del IRPF, el efecto real del IVA en los precios, duplicidades autonómicas, corrupción, justicia ágil, dimisión por mentira deliberada acreditada, fronteras y vías legales, y expulsión de extranjeros condenados cuando proceda legalmente.\n\nMenos organismos redundantes no significa eliminar las CCAA ni recortar servicios. Una rebaja fiscal necesita financiación y no garantiza subir el sueldo bruto ni bajar automáticamente los precios. Las penas y las expulsiones exigen proporcionalidad, resolución individual y garantías; se preservan el asilo y la no devolución a riesgo. Una opinión o un error de buena fe no equivalen a una mentira deliberada.\n\nNo hace falta capa: revisa las condiciones del programa y participa.\nhttps://openspain.org/programa\nhttps://openspain.org/participa\n\nMini cómic de ficción inspirado en propuestas. No representa medidas aprobadas, ahorros calculados ni resultados obtenidos.\n\n#OpenSpain #AbrirCaminos #ParticipaciónCiudadana\n`,
});
