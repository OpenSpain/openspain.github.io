const palette = { ink: '#101014', white: '#f5f5f7', lime: '#c6f36b', paper: '#eeeee4', grey: '#747c83' };
const { ink, white, lime, paper, grey } = palette;

function bubble(x, y, width, lines, tail = 60) {
  const height = lines.length * 36 + 44;
  const radius = 22;
  return `<g class="bubble" data-box="${x},${y},${width},${height}">
    <path class="ink" fill="${white}" d="M${x + radius} ${y}H${x + width - radius}Q${x + width} ${y} ${x + width} ${y + radius}V${y + height - radius}Q${x + width} ${y + height} ${x + width - radius} ${y + height}H${x + tail + 78}L${x + tail + 18} ${y + height + 37}L${x + tail + 36} ${y + height}H${x + radius}Q${x} ${y + height} ${x} ${y + height - radius}V${y + radius}Q${x} ${y} ${x + radius} ${y}Z"/>
    <text text-anchor="middle">${lines.map((line, index) => `<tspan x="${x + width / 2}" y="${y + 43 + index * 36}">${line}</tspan>`).join('')}</text>
  </g>`;
}

function city() {
  return `<g fill="#d4dbce" stroke="#b5bfb0" stroke-width="4">
    <path d="M0 478V274H92V344H155V218H263V312H336V186H426V336H508V248H624V316H688V194H804V285H884V235H960V660H0Z"/>
    ${[30, 178, 358, 536, 714, 908].map(x => [300, 355, 410].map(y => `<path d="M${x} ${y}h22v24h-22Z"/>`).join('')).join('')}
  </g><path d="M0 583Q470 545 960 583V660H0Z" fill="#d2d6c8"/><path d="M0 623H960" stroke="${ink}" stroke-width="5"/>`;
}

function hero(x, y, scale = 1, pose = 'open') {
  const arm = pose === 'point'
    ? `<path d="M-40 -59Q-89 -101 -133 -78" fill="none" stroke="${ink}" stroke-width="42"/><path d="M-40 -59Q-89 -101 -133 -78" fill="none" stroke="${grey}" stroke-width="27"/><path d="M-144 -77l-24 -8m21 4-21 16" fill="none" stroke="${lime}" stroke-width="18"/>`
    : `<path d="M-42 -56Q-78 -16 -112 -37" fill="none" stroke="${ink}" stroke-width="42"/><path d="M-42 -56Q-78 -16 -112 -37" fill="none" stroke="${grey}" stroke-width="27"/><circle cx="-116" cy="-40" r="21" fill="${lime}" stroke="${ink}" stroke-width="6"/>`;
  return `<g transform="translate(${x} ${y}) scale(${scale})" class="ink">
    <ellipse cx="-8" cy="200" rx="112" ry="15" fill="${ink}" opacity=".12" stroke="none"/>
    <path d="M-33 -70Q-86 -84 -104 -15Q-133 79 -179 119L-112 115L-94 150Q-22 110 43 56L43 -63Z" fill="${lime}"/>
    <path d="M-31 -54Q-59 58 -129 111" fill="none" stroke="${white}" stroke-width="12"/>
    <path d="M-25 68L-42 167L-7 174L17 77" fill="${grey}"/>
    <path d="M22 66L52 162L86 150L58 54" fill="${grey}"/>
    <path d="M-43 151L-9 157L-7 187L-64 187Q-73 175 -43 151Z" fill="${lime}"/>
    <path d="M48 147L78 138L106 175Q108 184 91 186H53Z" fill="${lime}"/>
    ${arm}
    <path d="M47 -59Q80 -31 96 14" fill="none" stroke="${ink}" stroke-width="42"/>
    <path d="M47 -59Q80 -31 96 14" fill="none" stroke="${grey}" stroke-width="27"/>
    <circle cx="98" cy="19" r="21" fill="${lime}"/>
    <path d="M-41 -76Q0 -94 46 -72L58 18L43 80H-31L-49 15Z" fill="${ink}"/>
    <path d="M-40 55H48V77H-35Z" fill="${white}"/>
    <rect x="-9" y="52" width="25" height="28" rx="5" fill="${lime}"/>
    <path d="M-16 -91V-67Q4 -53 23 -71V-99" fill="#cb8e68"/>
    <circle cx="2" cy="-128" r="44" fill="#db9d75"/>
    <path d="M-40 -139Q-42 -181 -1 -178Q40 -181 47 -142L21 -150L6 -145L-14 -153Z" fill="${ink}"/>
    <path d="M-40 -132Q3 -153 44 -130L37 -109Q1 -121 -33 -109Z" fill="${ink}"/>
    <path d="M-21 -130l10 -2m25 0 10 2" fill="none" stroke="${white}" stroke-width="6"/>
    <path d="M-9 -98Q4 -86 18 -99" fill="${white}" stroke-width="4"/>
    <circle cx="1" cy="-17" r="37" fill="${lime}" stroke="none"/>
    <image class="hero-emblem" href="../favicon.svg" x="-32" y="-50" width="66" height="66"/>
  </g>`;
}

function citizen(x, y, scale = 1, variant = 0, raised = false) {
  const skin = ['#a96949', '#e4b18d', '#ca8b62', '#f0c8a8', '#82573f'][variant % 5];
  const shirt = [white, lime, '#aeb6c5', white, lime][variant % 5];
  return `<g transform="translate(${x} ${y}) scale(${scale})" class="ink">
    <ellipse cx="0" cy="139" rx="68" ry="10" fill="${ink}" stroke="none" opacity=".12"/>
    <path d="M-24 44L-30 116H-4L7 49M9 45L19 116H44L34 42" fill="${grey}"/>
    <path d="M-31 108H-4V131H-45Q-48 120 -31 108ZM18 108H43L57 127Q60 132 47 132H18Z" fill="${ink}"/>
    <path d="${raised ? 'M-27 -34L-64 -73L-60 -108' : 'M-28 -31L-49 29'}" fill="none" stroke="${ink}" stroke-width="23"/>
    <path d="${raised ? 'M-27 -34L-64 -73L-60 -108' : 'M-28 -31L-49 29'}" fill="none" stroke="${skin}" stroke-width="12"/>
    <path d="M29 -30L50 25" fill="none" stroke="${ink}" stroke-width="23"/>
    <path d="M29 -30L50 25" fill="none" stroke="${skin}" stroke-width="12"/>
    <path d="M-25 -43Q0 -55 28 -41L37 52H-34Z" fill="${shirt}"/>
    <path d="M-10 -61V-42Q2 -31 13 -43V-64" fill="${skin}"/>
    ${variant % 2 ? `<circle cx="20" cy="-111" r="20" fill="${ink}"/>` : ''}
    <ellipse cx="1" cy="-83" rx="31" ry="37" fill="${skin}"/>
    <path d="M-29 -87Q-43 -129 4 -125Q37 -124 33 -91L14 -107L-4 -100L-21 -105Z" fill="${variant === 3 ? '#d8dadb' : ink}"/>
    <path d="M-13 -81h2m24 0h2" stroke="${ink}" stroke-width="6"/>
    <path d="M-10 -63Q1 -53 13 -63" fill="none" stroke-width="4"/>
    ${variant === 2 ? '<path d="M-23 -88h20v17h-20Zm27 0h20v17H4Zm-7 6h7" fill="none" stroke-width="4"/>' : ''}
  </g>`;
}

function papers(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" class="ink">
    <path d="M-14 15H170V210H-14Z" fill="#b9c1ae"/>
    <path d="M4 2H187V198H4Z" fill="${white}"/>
    <path d="M24 -12H157L201 32V181H24Z" fill="${white}"/>
    <path d="M157 -12V32H201M49 66H171M49 95H154M49 124H168M49 153H128" fill="none" stroke-width="5"/>
  </g>`;
}

function scene(index, body, title = ['Un héroe ciudadano llega a una ciudad llena de barreras', 'Una ciudadana y OpenSpain se enfrentan a trámites duplicados', 'Un equipo prepara vivienda conectada con servicios', 'Una puerta abierta conecta ideas y oportunidades', 'La ciudadanía examina cuentas y contratos públicos', 'OpenSpain se une a un equipo ciudadano plural'][index]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 660" role="img" aria-labelledby="scene-${index}">
    <title id="scene-${index}">${title}</title>
    <defs><pattern id="dots-${index}" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2" fill="${ink}" opacity=".08"/></pattern></defs>
    <rect width="960" height="660" fill="${paper}"/>
    <rect width="960" height="660" fill="url(#dots-${index})"/>
    ${body}
  </svg>`;
}

const slides = [
  {
    id: '01-un-heroe-distinto',
    chapter: 'ORIGEN',
    title: ['Un héroe distinto.', 'Un reto compartido.'],
    caption: 'Su poder no es mandar: es quitar barreras para que la gente pueda avanzar.',
    alt: 'Un superhéroe original de OpenSpain, con traje grafito, capa lima y monograma OS, llega junto a dos ciudadanos. Ella protesta porque no avanza ni un papel; él propone abrir caminos. Una ciudad dibujada ocupa el fondo.',
    art: scene(0, `${city()}
      <path d="M457 348L485 200L559 297L639 171L663 310L821 244L747 375L899 391L751 454L820 552L676 518L647 624L572 522L453 573L486 458L364 415Z" fill="${lime}" opacity=".65"/>
      ${papers(45, 452, .67)}
      ${citizen(237, 465, 1.1, 1, true)}
      ${citizen(391, 485, .92, 3)}
      ${hero(675, 420, 1)}
      ${bubble(38, 43, 380, ['AQUÍ NO AVANZA', 'NI UN PAPEL.'])}
      ${bubble(485, 56, 428, ['PUES TOCA', 'ABRIR CAMINOS.'], 160)}`),
  },
  {
    id: '02-menos-burocracia',
    chapter: 'EL LABERINTO',
    title: ['La burocracia', 'no es invencible.'],
    caption: 'Menos trámites duplicados. Requisitos claros y garantías que se mantienen.',
    alt: 'Pilas de formularios y flechas que vuelven al mismo sitio rodean a una ciudadana. OpenSpain señala una salida marcada como requisitos claros. El diálogo propone entregar la información una sola vez y conservar las garantías.',
    art: scene(1, `
      <g class="ink" fill="none" stroke="#b8c1ac" stroke-width="27">
        <path d="M44 355H173V268H338V357H466V270H610V359H924M46 482H172V394H338V486H466V398H614V483H924"/>
      </g>
      <path d="M0 594H960V660H0Z" fill="#d2d6c8"/>
      ${papers(44, 405, .82)}${papers(279, 451, .64)}
      <path d="M431 565H595V526L678 584L595 640V604H431Z" fill="${lime}" stroke="${ink}" stroke-width="6"/>
      <g class="ink"><rect x="420" y="266" width="270" height="62" rx="12" fill="${lime}"/><text class="small-label" x="555" y="306" text-anchor="middle">REQUISITOS CLAROS</text></g>
      ${citizen(302, 464, 1.13, 0, true)}
      ${hero(756, 424, 1, 'point')}
      ${bubble(35, 45, 420, ['ME PIDEN EL PAPEL', 'DEL PAPEL.'])}
      ${bubble(496, 58, 424, ['UNA SOLA VEZ.', 'Y CON GARANTÍAS.'], 180)}`),
  },
  {
    id: '03-vivienda-con-servicios',
    chapter: 'LA VIDA REAL',
    title: ['El alquiler no', 'se paga con épica.'],
    caption: 'Más vivienda social en suelo público, con servicios y sin crear barrios aislados.',
    alt: 'OpenSpain y una ciudadana consultan un plano de vivienda, junto a un barrio dibujado con casas, colegio, transporte y un árbol. Ella habla de llegar a fin de mes y él insiste en vivienda con servicios, no en promesas voladoras.',
    art: scene(2, `
      <g class="ink" stroke-width="5">
        <path d="M55 480V335L149 268L241 335V480Z" fill="${white}"/>
        <path d="M34 343L149 257L263 343" fill="none"/>
        <path d="M91 379H128V416H91ZM164 379H201V416H164Z" fill="${lime}"/>
        <path d="M132 480V434H172V480" fill="${grey}"/>
        <rect x="307" y="321" width="158" height="158" rx="9" fill="${white}"/>
        <path d="M300 321H471V300H300Z" fill="${lime}"/>
        <text class="small-label" x="386" y="358" text-anchor="middle">COLEGIO</text>
        <path d="M334 384h29v31h-29Zm55 0h29v31h-29Z" fill="${lime}"/>
        <rect x="810" y="361" width="95" height="102" rx="18" fill="${lime}"/>
        <path d="M824 381H891V414H824Z" fill="${white}"/>
        <circle cx="833" cy="466" r="10" fill="${ink}"/><circle cx="883" cy="466" r="10" fill="${ink}"/>
        <path d="M58 581H912" stroke="#a5b393"/>
        <path d="M64 560V502" fill="none"/><circle cx="65" cy="474" r="36" fill="${lime}"/>
      </g>
      ${citizen(289, 472, 1.08, 1)}
      ${hero(667, 424, 1)}
      <g class="ink" transform="translate(340 441) rotate(-8)">
        <path d="M0 0H235V155H0Z" fill="${white}"/>
        <path d="M24 33h76v43H24Zm99 0h83v92h-83ZM24 99h76v26H24Z" fill="${lime}" stroke-width="4"/>
      </g>
      ${bubble(30, 38, 437, ['MI SUPERPODER ES', 'LLEGAR A FIN DE MES.'])}
      ${bubble(492, 53, 438, ['VIVIENDA CON SERVICIOS.', 'NO PROMESAS VOLADORAS.'], 150)}`),
  },
  {
    id: '04-abrir-oportunidades',
    chapter: 'LAS IDEAS',
    title: ['Las buenas ideas', 'necesitan una puerta.'],
    caption: 'Investigar, emprender y crecer: menos barreras, apoyos evaluados y talento conectado.',
    alt: 'Dos personas con una idea y un pequeño prototipo encuentran una puerta abierta. OpenSpain señala el acceso a un taller. La escena representa quitar barreras y evaluar los apoyos, sin asegurar que todos los proyectos tengan éxito.',
    art: scene(3, `
      <g class="ink">
        <path d="M541 581V245H893V581" fill="#c7d2bd"/>
        <path d="M572 580V272H861V580" fill="${white}"/>
        <path d="M572 272L735 319V611L572 580Z" fill="${lime}"/>
        <circle cx="702" cy="446" r="8" fill="${ink}"/>
        <path d="M777 361h49m-66 35h66m-49 35h49" fill="none" stroke-width="5"/>
        <path d="M0 617H960" fill="none" stroke-width="5"/>
        <path d="M65 514H398V545H65ZM94 546V616M364 546V616" fill="${grey}"/>
        <path d="M131 501L145 451H207L226 501Z" fill="${lime}"/>
        <rect x="148" y="422" width="59" height="41" rx="9" fill="${white}"/>
        <path d="M156 439h4m25 0h4M174 421v-20" fill="none" stroke-width="5"/>
        <circle cx="174" cy="394" r="9" fill="${lime}"/>
      </g>
      ${citizen(294, 465, 1.12, 2, true)}
      ${citizen(441, 493, .91, 4)}
      ${hero(781, 420, 1, 'point')}
      <g class="ink" transform="translate(377 299)">
        <path d="M-30 0Q-36 -48 0 -51Q38 -48 30 0L14 23H-14Z" fill="${lime}"/>
        <path d="M-13 25H13M-9 37H9M0 -71V-89M-48 -47L-63 -58M48 -47L63 -58" fill="none" stroke-width="5"/>
      </g>
      ${bubble(34, 39, 416, ['TENGO UNA IDEA.', '¿POR DÓNDE EMPIEZO?'])}
      ${bubble(494, 51, 426, ['QUITANDO BARRERAS.', 'Y EVALUANDO LOS APOYOS.'], 180)}`),
  },
  {
    id: '05-cuentas-claras',
    chapter: 'LA LUPA',
    title: ['Las cuentas claras.', 'Los poderes, limitados.'],
    caption: 'Dinero público trazable, conflictos de interés controlados y decisiones explicadas.',
    alt: 'Una ciudadana con una lupa revisa un panel de cuentas, contratos y resultados, mientras OpenSpain lo señala. El diálogo exige publicar, explicar y comprobar. El héroe no queda por encima del control ciudadano.',
    art: scene(4, `
      <g class="ink">
        <path d="M0 616H960" stroke-width="5"/>
        <rect x="53" y="272" width="478" height="306" rx="16" fill="${white}"/>
        <path d="M53 328H531V288Q531 272 515 272H69Q53 272 53 288Z" fill="${lime}"/>
        <text class="label" x="292" y="309" text-anchor="middle">DINERO PÚBLICO</text>
        ${['CUENTAS', 'CONTRATOS', 'RESULTADOS'].map((label, index) => `<text class="label" x="90" y="${380 + index * 72}">${label}</text><path d="M424 ${363 + index * 72}l13 14 26 -28" fill="none" stroke-width="8"/>`).join('')}
        <path d="M76 593H509" fill="none" stroke-width="4"/>
      </g>
      ${hero(756, 422, 1, 'point')}
      ${citizen(364, 486, .96, 3)}
      <g class="ink"><path d="M481 443L511 480" fill="none" stroke-width="21"/><circle cx="452" cy="410" r="49" fill="${white}" fill-opacity=".75"/><path d="M431 385Q445 372 466 385" fill="none" stroke="${white}" stroke-width="7"/></g>
      ${bubble(33, 29, 409, ['¿DÓNDE VA', 'NUESTRO DINERO?'])}
      ${bubble(493, 28, 428, ['SE PUBLICA.', 'SE EXPLICA.', 'SE COMPRUEBA.'], 165)}`),
  },
  {
    id: '06-el-poder-de-participar',
    chapter: 'CONTINUARÁ CONTIGO',
    title: ['El verdadero poder:', 'participar.'],
    caption: 'Una España abierta se construye entre todos. Aporta una idea, contrasta el programa o participa.',
    alt: 'OpenSpain posa como uno más junto a cinco ciudadanos de distintas apariencias. Un cartel dice escuchar, proponer y construir. El grupo recuerda que no hace falta capa ni pensar todos igual para participar.',
    art: scene(5, `${city()}
      <circle cx="492" cy="365" r="213" fill="${lime}" opacity=".5"/>
      <g class="ink">
        <rect x="44" y="184" width="872" height="72" rx="12" fill="${white}"/>
        <text class="label" x="480" y="232" text-anchor="middle">ESCUCHAR · PROPONER · CONSTRUIR</text>
      </g>
      ${citizen(126, 495, .9, 0, true)}
      ${citizen(279, 488, .94, 1)}
      ${hero(506, 437, .94)}
      ${citizen(692, 487, .97, 2)}
      ${citizen(834, 503, .85, 3, true)}
      ${citizen(391, 522, .72, 4)}
      ${bubble(37, 38, 413, ['NO HACE FALTA CAPA.'])}
      ${bubble(490, 42, 428, ['NI PENSAR TODOS IGUAL.'], 90)}`),
  },
];

function renderComic(collection) {
  document.title = `OpenSpain · ${collection.title} · Mini cómic`;
  document.querySelector('#comic').setAttribute('aria-label', `${collection.title}: ${collection.slides.length} viñetas`);
  document.querySelector('#comic').innerHTML = collection.slides.map((slide, index) => `
  <article class="slide${collection.dense ? ' slide-dense' : ''}" id="${slide.id}" aria-labelledby="title-${index}">
    <header class="brand-row">
      <img src="../openspain-logo-light.svg" alt="OpenSpain" width="1200" height="280">
      <span class="page-number">${String(index + 1).padStart(2, '0')} / ${String(collection.slides.length).padStart(2, '0')}</span>
    </header>
    <div class="heading">
      <p class="eyebrow">ABRIR CAMINOS · ${slide.chapter}</p>
      <h1 id="title-${index}">${slide.title.map(line => `<span>${line}</span>`).join('')}</h1>
    </div>
    <div class="art" role="img" aria-label="${slide.alt}">${slide.art}</div>
    <p class="caption">${slide.caption}</p>
    <footer class="slide-footer">
      <span>Ficción · Propuestas, no resultados.</span>
      <a href="https://openspain.org/participa">openspain.org${index === collection.slides.length - 1 ? '/participa' : ''} ↗</a>
    </footer>
  </article>
  `).join('');
  window.comicSlides = collection.slides.map(({ art, ...slide }) => slide);
  window.comicCollection = { id: collection.id, title: collection.title, caption: collection.caption, sources: collection.sources };
}

if (!document.querySelector('#comic').dataset.collection) {
  renderComic({
    id: 'original',
    title: 'Abrir caminos',
    slides,
    caption: `¿Y si OpenSpain fuera un superhéroe?\n\nNo arreglaría España con un chasquido. Su misión sería abrir caminos: menos burocracia duplicada, vivienda con servicios, oportunidades para las buenas ideas y cuentas públicas que se puedan comprobar.\n\nPero ningún héroe sustituye a los ciudadanos. No hace falta capa ni pensar todos igual: hace falta escuchar, proponer y construir.\n\nConoce el programa y participa: https://openspain.org/participa\n\nMini cómic de ficción inspirado en propuestas de OpenSpain. No representa medidas aprobadas ni resultados obtenidos. Las medidas completas, sus costes, condiciones y garantías están en el programa.\n\n#OpenSpain #AbrirCaminos #ParticipaciónCiudadana\n`,
  });
}
