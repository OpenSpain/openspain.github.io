import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseProgram, filterAxes, categories, axisMetadata, ipc, getChapter, getCitizenDemands, getInitiativeActions, getInitiativeActionItems, getChangeVideoMessages, getCivicValues, getValueCommitments, inlineParts, detailMarker } from '../program.js';
import { pages, legacyTarget } from '../routes.js';
import { observedCharts, targetCharts } from '../charts.js';
import { getInstagramVideos, participationMessage } from '../video/instagram.mjs';
import { synth, percussionSchedule } from '../video/audio.mjs';

const markdown = await readFile(new URL('../PROGRAMA.md', import.meta.url), 'utf8');
const axes = parseProgram(markdown);

test('both PDF templates use the dark Manrope identity and version their public downloads', async () => {
  const report = await readFile(new URL('../informe.html', import.meta.url), 'utf8');
  const reportStyles = await readFile(new URL('../informe.css', import.meta.url), 'utf8');
  const presentation = await readFile(new URL('../presentacion.html', import.meta.url), 'utf8');
  for (const styles of [reportStyles, presentation]) {
    assert.match(styles, /font-family: Manrope/);
    assert.match(styles, /color-scheme: dark/);
    assert.match(styles, /--ink: #f5f5f7/);
    assert.match(styles, /--accent: #c6f36b/);
    assert.match(styles, /--surface: #101014/);
    assert.match(styles, /print-color-adjust: exact/);
    assert.match(styles, /@page \{[^}]*background: #101014/);
  }
  for (const html of [report, presentation]) {
    assert.match(html, /src="\.\/favicon\.svg/);
    assert.doesNotMatch(html, /bandera\.svg/);
  }
  assert.match(report, /barras blancas identifican observaciones/);
  assert.match(report, /barras grises y borde discontinuo/);
  for (const path of ['programa.html', 'cambios.html']) {
    const html = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(html, /OpenSpain-Programa\.pdf\?v=20261015-studio/);
    if (path === 'programa.html') assert.match(html, /OpenSpain-Presentacion\.pdf\?v=20261015-studio/);
  }
});

test('Instagram series covers the decalogue and every axis without inventing measures or results', () => {
  const videos = getInstagramVideos(markdown);
  assert.equal(videos.length, 32);
  assert.equal(videos[0].scenes.filter(scene => scene.label.startsWith('EXIGENCIA')).length, 10);
  for (const [index, video] of videos.entries()) {
    assert.equal(video.duration, video.scenes.reduce((sum, scene) => sum + scene.duration, 0));
    assert.equal(video.scenes.at(-1).body, participationMessage);
    assert.match(video.caption, /no medidas aprobadas ni resultados obtenidos/);
    assert.match(video.url, /^https:\/\/openspain\.org\/programa\.html#/);
    for (const scene of video.scenes) {
      assert.ok(scene.duration >= 6);
      assert.ok(`${scene.title} ${scene.body}`.trim().split(/\s+/).length / scene.duration <= 2.5);
      assert.doesNotMatch(scene.body, /caso hipotético|\*\*|\[F\d+\]/);
    }
    if (index) {
      assert.equal(video.title, axes[index - 1].title);
      assert.ok(video.scenes.some(scene => scene.label === 'COSTES Y GARANTÍAS'));
      assert.ok(video.scenes.some(scene => scene.label === 'CÓMO COMPROBARLO'));
    }
  }
  assert.deepEqual(getInstagramVideos(markdown.replaceAll('\n', '\r\n')), videos);
  assert.throws(() => getInstagramVideos(markdown.replace('### 2.31.', '### 3.31.')));
});

test('presentation video and transcript use the public domain and current identity', async () => {
  for (const path of ['video/video.html', 'video/cambios.html', 'participa.html']) {
    const content = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(content, /openspain\.org/);
    assert.doesNotMatch(content, /openspain\.github\.io/);
  }
  const html = await readFile(new URL('../participa.html', import.meta.url), 'utf8');
  for (const filename of ['OpenSpain-Hazte-Simpatizante.mp4', 'hazte-simpatizante-portada.jpg']) {
    assert.ok(html.includes(`${filename}?v=20261015-studio-lima`));
  }
  for (const path of ['video/video.html', 'video/cambios.html']) {
    const template = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(template, /src="\.\.\/favicon\.svg"/);
    assert.match(template, />openspain\.</);
    assert.doesNotMatch(template, /openspain-logo-light|clipPath id="flag"|logoSvg/);
  }
  assert.match(html, /libertad, generosidad y responsabilidad/);
});

test('actions and video messages are separate summaries without adopting evaluated alternatives', () => {
  const actions = getInitiativeActionItems(markdown);
  assert.equal(actions.length, 8);
  assert.equal(getChangeVideoMessages(markdown).length, 8);
  for (const message of getChangeVideoMessages(markdown)) {
    assert.ok(`${message.title} ${message.description}`.split(/\s+/).length <= 15);
  }
  assert.equal((getCitizenDemands(markdown).match(/^- /gm) || []).length, 10);
  assert.equal((getInitiativeActions(markdown).match(/^- /gm) || []).length, 8);
  assert.match(actions[0].description, /proporcionalidad, pruebas, defensa y control judicial/);
  assert.match(actions[1].description, /no garantiza por sí sola subir el salario bruto/);
  assert.equal(actions[2].title, 'Innovar, emprender y crecer desde España.');
  assert.match(actions[2].description, /empresas existentes, industria y servicios públicos/);
  assert.match(actions[2].description, /criterios transparentes, hitos verificables y evaluación/);
  assert.match(actions[2].description, /\[innovación\]\(#eje-5\)/);
  assert.match(getChangeVideoMessages(markdown)[2].title, /Innovar/);
  assert.match(actions[5].description, /no se adopta una abolición general de comunidades autónomas/);
  assert.match(actions[5].title, /Menos burocracia/);
  assert.match(actions[5].description, /requisitos obsoletos, duplicados o sin utilidad acreditada/);
  assert.match(actions[5].description, /Mantener seguridad, derechos laborales, protección ambiental y controles contra el fraude/);
  assert.match(actions[5].description, /tiempo y coste por trámite/);
  assert.match(axes.find(axis => axis.id === 6).technicalBody, /cauce legal correspondiente/);
  assert.match(actions[6].description, /Un contrato no autoriza por sí solo a trabajar/);
  assert.match(actions[7].description, /evitar segregación y barrios sin servicios/);
  assert.match(getInitiativeActions(markdown), /no modifica sus metas ni activa nuevos frentes/);
  for (const action of actions) {
    for (const link of inlineParts(action.description).filter(part => part.type === 'link')) {
      assert.ok(axes.some(axis => link.href === `#eje-${axis.id}`));
    }
  }
});

test('text-led website videos retain readable transcripts without duplicate caption tracks', async () => {
  for (const path of ['index.html', 'participa.html']) {
    const html = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.doesNotMatch(html, /<track|\.vtt|con música y subtítulos/);
    assert.match(html, /Leer el contenido del vídeo/);
    assert.match(html, /\.jpg\?v=20261015-studio-lima/);
    assert.match(html, /\.mp4\?v=20261015-studio-lima/);
  }
  const workflow = await readFile(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8');
  const server = await readFile(new URL('../server.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(workflow + server, /cambios-es\.vtt|hazte-simpatizante-es\.vtt/);
});

test('homepage introduces an open country as an aspiration and invites people to build it together', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /Una España abierta donde vivir bien, crear y prosperar/);
  assert.match(html, /Un país en el que quieras quedarte, al que puedas volver y donde empezar una nueva etapa/);
  assert.match(html, /Un proyecto ciudadano independiente para construirlo juntos/);
  assert.match(html, /href="\.\/participa\.html">Construyamos juntos ↗<\/a>/);
  assert.equal((html.match(/class="hero-description"/g) || []).length, 2);
  assert.doesNotMatch(html, /todos ganan/i);
});

test('homepage FAQs explain open participation and funding without claiming a constituted party or active donations', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const faq = html.match(/<section[^>]*id="preguntas-frecuentes"[\s\S]*?<\/section>/)?.[0];
  assert.ok(faq);
  assert.equal((faq.match(/<details /g) || []).length, 4);
  for (const question of ['¿Es un partido político?', '¿Quién puede colaborar?', '¿Tengo que estar de acuerdo con todo?', '¿Cómo se financia?']) {
    assert.ok(faq.includes(`<summary>${question}</summary>`));
  }
  assert.match(faq, /no es una decisión tomada ni hay una candidatura anunciada/);
  assert.match(faq, /Todo el mundo/);
  assert.match(faq, /buscamos acuerdos útiles, no unanimidad/);
  assert.match(faq, /donaciones económicas todavía no están habilitadas/);
  assert.match(faq, /No presentamos ayudas o subvenciones como concedidas/);
  assert.match(faq, /href="\.\/transparencia\.html#donaciones"/);
});

test('future endorsement notifications use the existing signup form without collecting an electoral endorsement', async () => {
  const home = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const participation = await readFile(new URL('../participa.html', import.meta.url), 'utf8');
  assert.match(home, /href="\.\/participa\.html#avales">Quiero avalar/);
  assert.match(participation, /id="avales" aria-labelledby="endorsement-title"/);
  assert.match(participation, /Aún no hay una recogida de avales abierta/);
  assert.match(participation, /si OpenSpain decide presentar una candidatura/);
  assert.match(participation, /href="https:\/\/tally\.so\/r\/D4lvRN" target="_blank" rel="noopener noreferrer" aria-describedby="endorsement-disclaimer">Quiero avalar/);
  assert.match(participation, /Abre el mismo formulario de novedades/);
  assert.match(participation, /No estás firmando un aval ni comprometiéndote a avalar/);
});

test('website soundtracks accent topic transitions but not individual text entrances', async () => {
  for (const path of ['video/cambios.html', 'video/video.html']) {
    const template = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(template, /window\.HITS = \[\];/);
    assert.match(template, /window\.FLASHES = (?:\[0, 4, 10, 16, 22, 28, 34, 40, 46, 52\]|scenes\.map\(scene => scene\._in\));/);
  }
});

test('transition accents move between beats without removing or changing rhythm percussion', () => {
  const baseline = percussionSchedule({ duration: 7 }).beats;
  for (const offset of [-0.12, -0.05, 0, 0.05, 0.12]) {
    const transition = 4.5 + offset;
    const schedule = percussionSchedule({ duration: 7, hits: [transition], flashes: [transition, transition] });
    assert.deepEqual(schedule.impacts, [4.625]);
    assert.deepEqual(schedule.accents, []);
    assert.deepEqual(schedule.beats, baseline);
    assert.ok(Math.abs(schedule.impacts[0] - transition) <= 0.25);
  }
  assert.deepEqual(percussionSchedule({ duration: 7, flashes: [4.63] }).impacts, [4.63]);
  for (const pace of [1.4, 52 / 27]) {
    const transitions = [0, 4, 10, 16, 22, 28, 34, 40, 46, 27 * pace].sort((a, b) => a - b);
    const schedule = percussionSchedule({ duration: 60, pace, flashes: transitions });
    assert.deepEqual(schedule.beats, percussionSchedule({ duration: 60, pace }).beats);
    assert.equal(schedule.impacts.length, transitions.length);
    assert.equal(schedule.impacts[0], 0);
    assert.ok(schedule.impacts.includes(27 * pace));
    for (const [index, time] of schedule.impacts.entries()) {
      assert.ok(Math.abs(time - transitions[index]) <= 0.25 * pace + 1e-9);
      assert.ok(schedule.beats.every(beat => Math.abs(beat.time - time) >= 0.125 * pace - 1e-9));
    }
  }
});

test('restored soundtrack retains its original bass and produces unclipped stereo audio', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'openspain-audio-'));
  try {
    const out = join(directory, 'test.wav');
    synth({ duration: 4, out });
    const wav = await readFile(out);
    assert.equal(wav.toString('ascii', 0, 4), 'RIFF');
    assert.equal(wav.readUInt16LE(22), 2);
    assert.equal(wav.readUInt32LE(24), 48000);
    assert.equal(wav.length, 44 + 4 * 48000 * 4);
    let peak = 0, middle = 0, entrance = 0, exit = 0;
    for (let i = 0; i < 4 * 48000; i++) {
      const sample = wav.readInt16LE(44 + i * 4);
      peak = Math.max(peak, Math.abs(sample));
      if (i < 4800) entrance += sample ** 2;
      if (i >= 48000 && i < 52800) middle += sample ** 2;
      if (i >= 4 * 48000 - 4800) exit += sample ** 2;
    }
    assert.ok(peak > 1000 && peak < 32767);
    assert.ok(entrance < middle / 10 && exit < middle / 10);
    const energyAt = frequency => {
      let real = 0, imaginary = 0;
      for (let i = 48000; i < 96000; i++) {
        const sample = wav.readInt16LE(44 + i * 4);
        const phase = 2 * Math.PI * frequency * i / 48000;
        real += sample * Math.cos(phase);
        imaginary += sample * Math.sin(phase);
      }
      return real ** 2 + imaginary ** 2;
    };
    assert.ok(energyAt(55) > energyAt(130.81) * 10, 'Retain the original bass rather than the replacement ambient chords');
    assert.throws(() => synth({ duration: 0, out }), /duración/);
    assert.throws(() => synth({ duration: 4, pace: 0, out }), /ritmo/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('all six pages preserve relative navigation and old public anchors', async () => {
  assert.equal(pages.length, 6);
  for (const [path] of pages) {
    const html = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    for (const [destination] of pages) assert.ok(html.includes(`href="./${destination}"`), `${path} → ${destination}`);
    assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
    assert.ok(html.includes('site.js?v=20261011-editorial'));
    assert.ok(html.includes(`styles.css?v=${path === 'transparencia.html' ? '20261012-profiles' : '20261011-editorial'}`));
    assert.ok(html.includes('>Valores</a>'));
    assert.match(html, /class="footer-socials"><a href="https:\/\/www\.instagram\.com\/openspainorg\/" target="_blank" rel="noopener noreferrer"/);
    assert.doesNotMatch(html, /autoplay/);
  }
  for (const axis of axes) assert.equal(legacyTarget(`#eje-${axis.id}`), `programa.html#eje-${axis.id}`);
  assert.equal(legacyTarget('#plan'), 'como.html#plan');
  assert.equal(legacyTarget('#participa'), 'participa.html#participa');
  assert.equal(legacyTarget('#donaciones'), 'transparencia.html#donaciones');
  assert.equal(legacyTarget('#eje-32'), undefined);
  assert.equal(legacyTarget('#vision'), undefined);
  const changes = await readFile(new URL('../cambios.html', import.meta.url), 'utf8');
  assert.doesNotMatch(changes, /class="section content-error"/);
  assert.match(changes, /<details class="program-chapter" open><summary>Prioridades/);
  const implementation = await readFile(new URL('../como.html', import.meta.url), 'utf8');
  assert.equal((implementation.match(/<details class="program-chapter" open>/g) || []).length, 2);
  const avatar = await readFile(new URL('../openspain-instagram.png', import.meta.url));
  assert.equal(avatar.subarray(1, 4).toString(), 'PNG');
  assert.equal(avatar.readUInt32BE(16), 1080);
  assert.equal(avatar.readUInt32BE(20), 1080);
});

test('the screen preview is wired across all pages without changing the base brand', async () => {
  for (const [path] of pages) {
    const html = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(html, /href="\.\/studio\.css\?v=20261015-preview"/);
    assert.ok(html.indexOf('studio.css') > html.indexOf('styles.css'));
  }
  const studio = await readFile(new URL('../studio.css', import.meta.url), 'utf8');
  assert.match(studio, /^@media screen \{/);
  assert.match(studio, /color-scheme: dark/);
  assert.match(studio, /--surface: #101014/);
  assert.match(studio, /--muted: #f5f5f7/);
  assert.match(studio, /--reading-color: #f5f5f7/);
  assert.match(studio, /--reading-width: 68ch/);
  assert.doesNotMatch(studio, /https?:|url\(/);
  const brand = await readFile(new URL('../brand.css', import.meta.url), 'utf8');
  assert.match(brand, /--brand-blue: #3159dc/);
  for (const path of ['server.mjs', '.github/workflows/pages.yml']) {
    assert.ok((await readFile(new URL(`../${path}`, import.meta.url), 'utf8')).includes('studio.css'));
  }
});

test('both website videos share the dark and lime render theme without changing their soundtrack schedule', async () => {
  const theme = await readFile(new URL('../video/studio.css', import.meta.url), 'utf8');
  assert.match(theme, /--brand-blue: #101014/);
  assert.match(theme, /--brand-gold: #c6f36b/);
  assert.match(theme, /#cta \.qr img \{ background: white; padding: 24px; \}/);
  for (const path of ['video/video.html', 'video/cambios.html']) {
    const template = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(template, /href="\.\/studio\.css"/);
    assert.ok(template.indexOf('./studio.css') > template.indexOf('</style>'));
    assert.match(template, /window\.HITS = \[\]/);
  }
  const renderer = await readFile(new URL('../video/render.mjs', import.meta.url), 'utf8');
  assert.match(renderer, /keepAudio \? \['-c:a', 'copy'\]/);
});

test('civic values and commitments are distinct source sections with explicit safeguards', () => {
  const values = getCivicValues(markdown);
  const commitments = getValueCommitments(markdown);
  assert.equal((values.match(/^- /gm) || []).length, 10);
  assert.equal((commitments.match(/^- /gm) || []).length, 6);
  assert.match(values, /segundas oportunidades junto a una rendición de cuentas efectiva/);
  assert.match(values, /personas con ideas y convicciones distintas/);
  assert.match(values, /remuneración justa/);
  assert.match(values, /Prosperidad y bien común/);
  assert.match(values, /Celebrar el éxito económico legítimo y el trabajo honesto/);
  assert.match(values, /comprender las causas/);
  assert.match(values, /servicio de toda la ciudadanía/);
  assert.match(values, /Favorecer la reconciliación/);
  assert.match(values, /crear valor con respeto a las personas/);
  assert.match(values, /Cuidado y generosidad/);
  assert.match(values, /por el valor de ayudar/);
  assert.match(values, /Emprender, invertir/);
  assert.match(values, /libertad de cambiar de opinión.*una propuesta propia/);
  assert.match(values, /preparar relevos: servir es una responsabilidad temporal/);
  assert.match(values, /actuar con serenidad y alzar la voz ante las injusticias/);
  assert.match(values, /Dignidad y libertad/);
  assert.match(values, /reconocer el esfuerzo y el mérito/);
  assert.doesNotMatch(values, /No ser indiferentes|No mentir|Nadie debe|no implica/);
  assert.doesNotMatch(values + commitments, /cristianismo|budismo|óctuple|religión/i);
  assert.doesNotMatch(values, /Evitar el lujo|vía de enriquecimiento/);
  assert.doesNotMatch(values, /Decir la verdad y rectificar|Mapa de problemas/);
  assert.match(commitments, /No afirmamos que existan ya registros/);
  assert.match(commitments, /sin divulgar datos privados/);
  assert.match(commitments, /con medidas proporcionadas y garantías/);
  assert.match(commitments, /Decidir con atención y actuar con constancia/);
  assert.match(commitments, /también cuando dejan de ocupar titulares/);
  assert.match(commitments, /No decidir por impulso, miedo o revancha/);
  assert.match(commitments, /aunque sea una propuesta propia/);
  assert.doesNotMatch(commitments, /Mapa de problemas/);
  assert.equal(getCivicValues(markdown.replaceAll('\n', '\r\n')), values);
  assert.equal(getValueCommitments(markdown.replaceAll('\n', '\r\n')), commitments);
  assert.throws(() => getCivicValues(markdown.replace('### 1.4.', '### 1.9.')), /Falta el apartado 1.4/);
  assert.throws(() => getValueCommitments(markdown.replace('### 1.5.', '### 1.9.')), /Falta el apartado 1.5/);
});

test('Fabio is an individual co-promoter with the supplied portrait and no institutional endorsement', async () => {
  const html = await readFile(new URL('../transparencia.html', import.meta.url), 'utf8');
  const profile = html.match(/<article[^>]*id="fabio-franco">([\s\S]+?)<\/article>/)?.[1];
  assert.ok(profile);
  assert.match(profile, /COIMPULSOR DE OPENSPAIN/);
  assert.match(profile, /Fabio Franco/);
  assert.match(profile, /Español · Policía Municipal de Madrid · Geólogo/);
  assert.match(profile, /src="\.\/fabio-franco\.jpg\?v=20261012-coimpulsor"/);
  assert.match(profile, /alt="Retrato de Fabio Franco, coimpulsor de OpenSpain"/);
  assert.doesNotMatch(profile, /QUIÉN IMPULSA/);
  const portrait = await readFile(new URL('../fabio-franco.jpg', import.meta.url));
  assert.equal(portrait.readUInt16BE(0), 0xffd8);
  const server = await readFile(new URL('../server.mjs', import.meta.url), 'utf8');
  const workflow = await readFile(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8');
  assert.match(server, /fabio-franco\.jpg/);
  assert.match(workflow, /fabio-franco\.jpg/);
  const participation = getChapter(markdown, 6);
  assert.match(participation, /Fabio Franco.*español, Policía Municipal de Madrid y geólogo/);
  assert.match(participation, /es coimpulsor de OpenSpain/);
  assert.match(participation, /seguridad cotidiana, la convivencia/);
  assert.match(participation, /título personal; no se atribuye respaldo/);
  assert.match(participation, /Alejandro Acosta.*impulsa esta iniciativa/);
});

test('citizen demands contain exactly ten commitments and link to existing axes', () => {
  const demands = getCitizenDemands(markdown);
  const items = demands.split('\n').filter(line => line.startsWith('- '));
  assert.equal(items.length, 10);
  assert.deepEqual(items.map(item => Number(item.match(/^- \*\*(\d+)\./)[1])),
    Array.from({ length: 10 }, (_, index) => index + 1));
  const links = inlineParts(demands).filter(part => part.type === 'link');
  assert.ok(links.length >= 10);
  for (const link of links) {
    assert.ok(axes.some(axis => link.href === `#eje-${axis.id}`), link.href);
  }
  assert.equal(getCitizenDemands(markdown.replaceAll('\n', '\r\n')), demands);
  assert.throws(() => getCitizenDemands('## 1. Principios\n\nSin decálogo.\n\n## 2. Ejes'),
    /Falta el decálogo/);
  assert.match(demands, /no activa nuevos pilotos ni modifica las metas/);
  assert.match(demands, /no se incorporan como hechos verificados/);
  assert.deepEqual(inlineParts('[Conflictos](#eje-23)'), [
    { type: 'link', text: 'Conflictos', href: '#eje-23' },
  ]);
  assert.ok(inlineParts('[no](javascript:alert(1))').every(part => part.type === 'text'));
});

test('integrity and preventive conflicts retain due process and existing pilot scope', () => {
  const integrity = axes.find(axis => axis.id === 1);
  const conflicts = axes.find(axis => axis.id === 23);
  const democracy = axes.find(axis => axis.id === 22);
  assert.ok(integrity.measures.some(measure => /currículum profesional.*retribución/.test(measure)));
  assert.ok(integrity.measures.some(measure => /código ético público/.test(measure)));
  assert.match(integrity.technicalBody, /pruebas de falsedad y de conocimiento de esa falsedad/);
  assert.match(integrity.technicalBody, /no equivale a que una comisión pueda retirar su escaño/);
  assert.match(conflicts.technicalBody, /conflictos reales, potenciales y aparentes/);
  assert.match(conflicts.technicalBody, /sustituto sin el mismo conflicto/);
  assert.match(conflicts.technicalBody, /ni trato de favor ni exclusión automática por parentesco/);
  assert.match(conflicts.technicalBody, /más conflictos declarados puede significar mejor detección/i);
  assert.match(conflicts.technicalBody, /sin activar otro piloto ni autorizar nuevas compatibilidades/);
  assert.match(conflicts.citizenSummary, /2 pilotos/);
  assert.match(conflicts.citizenSummary, /como máximo a 10 equipos/);
  assert.match(democracy.technicalBody, /encuentros abiertos al menos trimestrales/);
  assert.match(democracy.technicalBody, /plazo propuesto de 30 días/);
  assert.match(democracy.technicalBody, /no confundir crítica política contundente con insulto/);
  assert.ok(filterAxes(axes, 'institutions', 'mentira deliberada').some(axis => axis.id === 1));
  assert.ok(filterAxes(axes, 'institutions', 'sistema preventivo').some(axis => axis.id === 23));
});

test('all configured axes and every proposal are read from the source document', () => {
  assert.equal(axes.length, axisMetadata.length);
  assert.deepEqual(axes.map(axis => axis.id), Array.from({ length: axisMetadata.length }, (_, index) => index + 1));
  const programSection = markdown.split('## 2. Mapa de problemas y propuestas')[1].split('## 3.')[0];
  const detailBlocks = programSection.split(detailMarker).slice(1);
  const count = detailBlocks.reduce((sum, block) => sum + (block.match(/^- .+(?:\n- .+)*/m)?.[0].split('\n').length ?? 0), 0);
  assert.equal(detailBlocks.length, axes.length);
  assert.equal(axes.reduce((sum, axis) => sum + axis.measures.length, 0), count);
  assert.ok(axes.every(axis => categories.some(category => category.id === axis.category)));
  assert.ok(axes[11].measures.some(measure => measure.includes('IA')));
  assert.ok(axes[16].measures.some(measure => measure.includes('aviación')));
  assert.ok(axes[16].measures.some(measure => measure.includes('gas natural')));
  assert.ok(axes[16].measures.some(measure => measure.includes('generación eléctrica con gas')));
  assert.ok(axes[17].measures.some(measure => measure.includes('ESA')));
  assert.ok(axes.find(axis => axis.id === 22).body.includes('Voto ponderado por estudios o exámenes'));
  assert.ok(filterAxes(axes, 'institutions', 'sufragio').some(axis => axis.id === 22));
  assert.ok(filterAxes(axes, 'life', 'pequeños propietarios').some(axis => axis.id === 2));
  assert.ok(filterAxes(axes, 'economy', 'venture capital').some(axis => axis.id === 11));
  assert.ok(filterAxes(axes, 'institutions', 'bono desempeño').some(axis => axis.id === 23));
  assert.ok(axes.every(axis => axis.citizenSummary.includes('#### Plan de actuación')
    && axis.technicalBody.includes('El coste y su financiación están pendientes de estimación.')
    && !/^\*\*[^*]+:\*\*/m.test(axis.technicalBody)));
  assert.ok(filterAxes(axes, 'future', 'satélite').some(axis => axis.id === 25));
  assert.ok(filterAxes(axes, 'future', 'Tesla').some(axis => axis.id === 26));
});

test('search is accent insensitive and includes all proposal text', () => {
  assert.ok(filterAxes(axes, 'all', 'licitacion').some(axis => axis.id === 12));
  assert.ok(filterAxes(axes, 'all', 'HIDROGENO').some(axis => axis.id === 17));
  assert.ok(filterAxes(axes, 'all', 'cotizacion ingresos').some(axis => axis.id === 15));
  assert.equal(filterAxes(axes, 'life', 'hidrogeno').length, 0);
  assert.equal(filterAxes(axes, 'future', '').length, axisMetadata.filter(axis => axis[0] === 'future').length);
  assert.equal(filterAxes(axes, 'all', 'zzzzzzz').length, 0);
});

test('media transparency follows documented payments without inventing dependence or activating another front', () => {
  const media = axes.find(axis => axis.id === 19);
  assert.equal(media.headline, '¿Quién paga a quién?');
  assert.match(media.citizenSummary, /5 entidades públicas anunciantes/);
  assert.match(media.citizenSummary, /20 entidades/);
  assert.match(media.citizenSummary, /100 % de su publicidad institucional no reservada/);
  assert.match(media.citizenSummary, /90 % de las reclamaciones dentro de 60 días/);
  assert.match(media.citizenSummary, /hasta 10 expedientes.*todos si hay menos/);
  assert.match(media.citizenSummary, /no añade un cuarto frente/);
  assert.match(media.technicalBody, /porcentaje de gasto con destinatario final verificable/);
  assert.match(media.technicalBody, /no puede calcularse cobertura/);
  assert.match(media.technicalBody, /Sin ingresos comparables.*no un porcentaje de dependencia/);
  assert.match(media.technicalBody, /no sumar el contrato de una agencia con su distribución/);
  assert.match(media.technicalBody, /no prueba autocensura/);
  assert.ok(media.measures.some(measure => measure.includes('RTVE') && measure.includes('renovaciones pendientes')));
  assert.ok(media.measures.some(measure => measure.includes('código abierto') && measure.includes('metodología reproducible')));
  assert.deepEqual(targetCharts[media.id - 1].slice(1, 4), [null, 5, 20]);
  assert.match(getChapter(markdown, 5), /C01 y C02 se aplicarán a «¿Quién paga a quién\?»/);
  assert.match(getChapter(markdown, 5), /registro parcial no cumple por sí solo la meta anual/);
  assert.match(getChapter(markdown, 7), /19\. Medios libres.*¿Quién paga a quién/);
  for (const query of ['quien paga a quien', 'agencia intermediaria', 'patrocinios', 'RTVE']) {
    assert.ok(filterAxes(axes, 'institutions', query).some(axis => axis.id === 19));
  }
});

test('electoral integrity protects access and secrecy without treating suspicions as proven fraud', () => {
  const democracy = axes.find(axis => axis.id === 22);
  assert.match(democracy.citizenSummary, /voto presencial, por correo y desde el extranjero/);
  assert.ok(democracy.measures.some(measure => /sin vincular identidad con opción votada/.test(measure)));
  assert.ok(democracy.measures.some(measure => /CERA.*ERTA/.test(measure)));
  assert.match(democracy.technicalBody, /no demuestra por sí sola fraude/);
  assert.match(democracy.technicalBody, /ni afirmar que todo voto exterior exige acudir presencialmente al consulado/);
  assert.match(democracy.technicalBody, /Más denuncias no significa automáticamente más fraude/);
  assert.match(democracy.technicalBody, /no modifica las metas de deliberación ni activa un nuevo piloto electoral/);
  assert.match(democracy.citizenSummary, /completar 3 deliberaciones/);
  assert.match(democracy.citizenSummary, /completar 12 deliberaciones/);
  assert.match(axes.find(axis => axis.id === 1).technicalBody, /controles de integridad electoral del eje 22/);
  assert.match(axes.find(axis => axis.id === 31).technicalBody, /sin sustituir reclamaciones electorales ni sus plazos/);
  assert.match(getChapter(markdown, 7), /22\. Democracia informada.*garantías del voto presencial/);
  assert.equal((getChapter(markdown, 8).match(/\*\*\[F42\]/g) || []).length, 1);
  for (const query of ['voto por correo', 'suplantaciones', 'CERA', 'ERTA']) {
    assert.ok(filterAxes(axes, 'institutions', query).some(axis => axis.id === 22), query);
  }
});

test('institutional maps preserve evidence, identities and independence safeguards', () => {
  const byId = id => axes.find(axis => axis.id === id);
  assert.match(byId(1).technicalBody, /fuente, fecha y tipo de relación/);
  assert.match(byId(1).technicalBody, /evitar confundir homónimos/);
  assert.match(byId(1).technicalBody, /no recopilaremos familiares por defecto/);
  assert.match(byId(12).technicalBody, /separando lotes y contratos para evitar duplicidades/);
  assert.match(byId(23).technicalBody, /No tratar una declaración como conflicto acreditado/);
  assert.match(byId(31).technicalBody, /mapa de mecanismos de independencia institucional para CGPJ y Fiscalía/);
  assert.match(byId(31).technicalBody, /sin etiquetar jueces o fiscales/);
});

test('all 31 detailed proposals explain the problem before measures and evaluate them without field labels', () => {
  assert.equal(markdown.split(detailMarker).length - 1, 31);
  assert.doesNotMatch(markdown, /La propuesta en detalle/);
  assert.doesNotMatch(markdown, /Ficha técnica/);
  for (const axis of axes) {
    const paragraphs = axis.technicalBody.split('\n\n');
    for (const paragraph of paragraphs.slice(0, 2)) {
      assert.ok(paragraph.endsWith('.'), `Eje ${axis.id}: explicación inicial en frases completas`);
      assert.ok(paragraph.split(/\s+/).length <= 110, `Eje ${axis.id}: párrafo inicial demasiado largo`);
    }
    assert.doesNotMatch(axis.technicalBody, /^\*\*[^*]+:\*\*/m, `Eje ${axis.id}: sin etiquetas de formulario`);
    const measureIndex = paragraphs.findIndex(paragraph => paragraph.startsWith('- '));
    assert.ok(measureIndex >= 3, `Eje ${axis.id}: problema y alternativas antes de medidas`);
    assert.equal(paragraphs[measureIndex - 1], 'Para abordar estos problemas, proponemos las siguientes medidas:');
    assert.ok(paragraphs[measureIndex + 1] && !paragraphs[measureIndex + 1].startsWith('- '),
      `Eje ${axis.id}: evaluación explicada después de medidas`);
    assert.match(axis.technicalBody, /El diagnóstico deberá revisar /);
    assert.match(axis.technicalBody, /El coste y su financiación están pendientes de estimación/);
  }
  assert.match(axes[1].technicalBody, /mediana —el plazo que divide los expedientes en dos mitades—/);
  assert.match(axes[1].technicalBody, /percentil 90 —el plazo dentro del que se resuelve el 90 %—/);
});

test('all 31 axes integrate hypothetical examples and interests in prose without repeated labels', () => {
  for (const axis of axes) {
    const paragraphs = axis.citizenSummary.split('\n\n#### Plan de actuación\n\n')[0].split('\n\n');
    assert.equal(paragraphs.length, 4, `Eje ${axis.id}: párrafos de primera lectura`);
    assert.match(paragraphs[0], /^Queremos .+ Para ello, proponemos /);
    assert.match(paragraphs[1], /^En un caso hipotético, /);
    assert.match(paragraphs[3], /^Para saber si funciona, proponemos /);
    assert.doesNotMatch(axis.citizenSummary, /^\*\*.+?:\*\*/m, `Eje ${axis.id}: etiquetas repetidas`);
    const wordCount = paragraph => paragraph.trim().split(/\s+/).length;
    assert.ok(wordCount(paragraphs[0]) <= 100,
      `Eje ${axis.id}: explicación inicial demasiado larga`);
    for (const paragraph of paragraphs.slice(1, 3)) {
      assert.ok(wordCount(paragraph) >= 20 && wordCount(paragraph) <= 80,
        `Eje ${axis.id}: ejemplo o equilibrio sin explicación suficiente o demasiado largo`);
    }
    assert.match(axis.technicalBody, /Para abordar estos problemas, proponemos las siguientes medidas:/);
  }
  const guide = getChapter(markdown, 2).split(/^### /m)[0];
  assert.match(guide, /situaciones hipotéticas/);
  assert.match(guide, /no son casos documentados, resultados obtenidos ni derechos nuevos/);
  assert.match(guide, /beneficios posibles, costes y límites/);
  assert.match(guide, /«línea base»/);
});

test('private activity reform remains distinct from existing law and public performance incentives', () => {
  const axis = axes.find(axis => axis.id === 23);
  assert.match(axis.citizenSummary, /reforma que permita mantener inversiones/);
  assert.match(axis.citizenSummary, /antes de M12/);
  assert.match(axis.technicalBody, /presidente del Gobierno/);
  assert.match(axis.technicalBody, /propuesta de reforma, no una autorización vigente/);
  assert.match(axis.technicalBody, /Ser propietario no equivale a dirigir el negocio/);
  assert.match(axis.technicalBody, /deberá elegirse entre la actividad afectada y el cargo/);
  assert.match(axis.technicalBody, /un bono no sustituye responsabilidad política o jurídica/);
  assert.ok(axis.measures.some(measure => measure.includes('compatibilidad condicionada')));
  assert.ok(filterAxes(axes, 'institutions', 'gestión activa').some(item => item.id === 23));
});

test('every axis exposes one- and four-year objectives, execution and measurement before technical detail', () => {
  assert.doesNotMatch(markdown, /\bSMART\b/i);
  for (const axis of axes) {
    assert.equal(axis.citizenSummary.split('#### Plan de actuación').length - 1, 1);
    const plan = axis.citizenSummary.split('#### Plan de actuación')[1].split('\n\n').filter(Boolean);
    assert.match(plan.find(paragraph => paragraph.startsWith('En el primer año,')), /\d/);
    assert.match(plan.find(paragraph => paragraph.startsWith('En cuatro años,')), /\d|anualmente|todas/);
    assert.match(plan.find(paragraph => paragraph.startsWith('La ejecución correspondería a ')), /M1–M3|M1–M6/);
    assert.ok(axis.technicalBody.indexOf('- ') < axis.technicalBody.indexOf('El coste y su financiación'));
  }
  assert.match(markdown, /M12 = 3 de octubre de 2027/);
  assert.match(markdown, /M48 = 3 de octubre de 2030/);
  assert.match(markdown, /Lo que OpenSpain puede hacer sin gobernar/);
  assert.match(markdown, /costes unitarios/);
  assert.match(markdown, /no demuestra por sí sola causalidad/);
  assert.match(markdown, /máximo de un hito en curso por frente/);
  assert.match(markdown, /H04 · Balance y siguiente ciclo/);
  assert.match(markdown, /pendientes de activación y validación/);
  assert.match(markdown, /Si solo cabe uno, publicar el resto en espera/);
  assert.match(getChapter(markdown, 2), /Qué significa «haremos»/);
  assert.match(getChapter(markdown, 2), /no una medida ya aprobada/);
  assert.match(getChapter(markdown, 4), /Un seguimiento que no confunda actividad con resultados/);
  assert.match(getChapter(markdown, 4), /presupuesto, financiación confirmada y gasto ejecutado por separado/);
  assert.match(getChapter(markdown, 5), /Preparación ante crisis.*29:/);
});

test('parser supports CRLF and fails explicitly on invalid source', () => {
  assert.equal(parseProgram(markdown.replaceAll('\n', '\r\n')).length, axisMetadata.length);
  assert.throws(() => parseProgram('# vacío'), /ejes/);
  assert.deepEqual(parseProgram(markdown.replaceAll('\n', '\r\n')).map(axis => axis.measures), axes.map(axis => axis.measures));
  assert.throws(() => parseProgram(`### 2.1. Prueba\n\nResumen.\n\n${detailMarker}\n\nSin medidas.`), /propuestas/);
  assert.throws(() => parseProgram('### 2.1. Prueba\n\n- Sin separador.'), /no distingue/);
  const sample = parseProgram(`### 2.1. Prueba\n\nResumen.\n\n- No es una medida del detalle.\n\n${detailMarker}\n\nExplicación.\n\n- Primera medida.\n- Segunda medida.\n\nOtra explicación.\n\n- Ampliación, no nueva medida.`);
  assert.deepEqual(sample[0].measures, ['Primera medida.', 'Segunda medida.']);
});

test('IPC distinguishes the complete 2025 series from definitive January–August 2026', () => {
  assert.equal(ipc[2025].length, 12);
  assert.equal(ipc[2026].length, 8);
  assert.equal(ipc[2025][0], 2.9);
  assert.equal(ipc[2026].at(-1), 4.3);
  assert.ok(Object.values(ipc).flat().every(Number.isFinite));
});

test('donation commitments explicitly distinguish preparation, consent and verified payments', () => {
  assert.ok(markdown.includes('las donaciones no están habilitadas'));
  assert.ok(markdown.includes('consentimiento expreso e informado'));
  assert.ok(markdown.includes('Una promesa de donar no se contará como dinero recibido'));
});

test('chapters and safe inline source links preserve the source content', () => {
  assert.match(getChapter(markdown, 5), /H04/);
  assert.match(getChapter(markdown.replaceAll('\n', '\r\n'), 8), /\[F18\]/);
  assert.throws(() => getChapter(markdown, 99), /Falta el capítulo/);
  assert.deepEqual(inlineParts('**Dato** [INE](https://www.ine.es/)'), [
    { type: 'strong', text: 'Dato' }, { type: 'text', text: ' ' },
    { type: 'link', text: 'INE', href: 'https://www.ine.es/' },
  ]);
  assert.ok(inlineParts('[no](javascript:alert(1)) <script>').every(part => part.type === 'text'));
});

test('observed charts retain exact values and targets do not invent baseline observations', () => {
  assert.deepEqual(observedCharts[1][0].values, [56, 55]);
  assert.deepEqual(observedCharts[2][0].values, [26623708, 18536616, 3837328]);
  assert.equal(observedCharts[2][1].values.reduce((a, b) => a + b), 3837328);
  assert.deepEqual(observedCharts[2][3].values, [15289, 16426, 14875]);
  assert.deepEqual(observedCharts[16][0].values, ipc[2026]);
  assert.equal(targetCharts.length, axes.length);
  for (const series of Object.values(observedCharts).flat()) {
    assert.equal(series.labels.length, series.values.length);
    assert.ok(series.values.every(Number.isFinite));
    assert.match(series.url, /^https:\/\//);
    assert.ok(series.note);
  }
  for (const [title, initial, yearOne, yearFour, unit, note] of targetCharts) {
    assert.ok(title && unit && note);
    assert.ok(initial === null || Number.isFinite(initial));
    assert.ok((yearOne === null || Number.isFinite(yearOne)) && Number.isFinite(yearFour));
    if (unit === 'índice') {
      assert.equal(initial, 100);
      assert.match(note, /no .*observado|Referencia matemática/);
    }
  }
  assert.equal(targetCharts[0][1], null);
  assert.match(axes[8].body, /Revisar currículo/);
  assert.match(axes[8].body, /seis meses/);
  assert.match(axes[26].title, /Pensiones/i);
  assert.match(axes[27].title, /Renta básica/i);
});

test('startup ecosystem connects international markets, English and measurable small milestones', () => {
  const international = axes.find(axis => axis.id === 8);
  const education = axes.find(axis => axis.id === 9);
  const startups = axes.find(axis => axis.id === 11);
  assert.match(startups.title, /Ecosistema de startups/);
  assert.match(startups.body, /S01 \(semanas 1–2\)/);
  assert.match(startups.body, /no añaden un cuarto frente/);
  assert.match(startups.citizenSummary, /plan individual con mercado elegido/);
  assert.match(startups.body, /ingresos mundiales.*no equivalen a ingreso fiscal español/);
  assert.match(international.body, /dos itinerarios comerciales prioritarios, Unión Europea y Estados Unidos/);
  assert.match(international.body, /una empresa una sola vez/);
  assert.match(education.citizenSummary, /Marco Común Europeo de Referencia/);
  assert.match(education.body, /inglés profesional/);
  assert.ok(filterAxes(axes, 'economy', 'startups').some(axis => axis.id === 11));
});

test('every axis has source figures without confusing context, law, announcements and targets', () => {
  assert.deepEqual(Object.keys(observedCharts).map(Number), axes.map(axis => axis.id));
  assert.equal(observedCharts[9][0].values[1], 12.8);
  assert.deepEqual(observedCharts[12][0].values, [41.93, 58.07]);
  assert.deepEqual(observedCharts[13][0].values, [121, 64, 77, 172, 269]);
  assert.deepEqual(observedCharts[17][0].values, [75.034, 67.892, 69.38, 74.202, 68.261, 68.871]);
  assert.deepEqual(observedCharts[20][0].values, [6.3, 6.3, 6.3, 6.2, 6.2]);
  assert.equal(observedCharts[22][0].values.reduce((a, b) => a + b), 37469458);
  assert.equal(Math.round(observedCharts[19][0].values.reduce((a, b) => a + b)), 70430604);
  assert.equal(observedCharts[18][0].kind, 'announced');
  assert.equal(observedCharts[21][0].kind, 'normative');
  assert.equal(observedCharts[23][0].kind, 'normative');
  assert.deepEqual(observedCharts[3].at(-1).values, [120.3, 277.5, 126.0, 93.9]);
  assert.match(observedCharts[3].at(-1).note, /Diciembre no es media anual/);
  assert.match(observedCharts[16].at(-1).note, /excluye cotizaciones sociales/);
  for (const series of Object.values(observedCharts).flat()) {
    assert.ok(series.source && series.note && series.title);
    assert.ok(series.values.every(value => Number.isFinite(value) && value >= 0));
    if (series.ceiling !== undefined) assert.ok(series.values.every(value => value <= series.ceiling));
  }
});

test('tourism, international talent and longer permits preserve legal and housing safeguards', () => {
  const tourism = axes.find(axis => axis.id === 3);
  const migration = axes.find(axis => axis.id === 7);
  const remote = axes.find(axis => axis.id === 25);
  assert.match(tourism.citizenSummary, /alojamiento turístico legal, diverso y a precios accesibles/);
  assert.match(tourism.technicalBody, /cesta fija de estancias/);
  assert.match(tourism.citizenSummary, /No comprometer una rebaja porcentual/);
  assert.match(tourism.body, /No reservar el mercado a grandes cadenas/);
  assert.match(migration.citizenSummary, /hasta un año.*hasta tres años.*períodos de dos años/);
  assert.match(migration.citizenSummary, /como escenario de reforma.*hasta dos años.*hasta cinco/);
  assert.match(migration.citizenSummary, /no son permisos vigentes/);
  assert.match(migration.body, /un turista no obtiene derecho a trabajar/);
  assert.match(remote.body, /capacidad real de vivienda y servicios/);
  assert.match(getChapter(markdown, 8), /\[F19\]/);
});

test('contingency planning has measurable exercises and does not invent current war events', () => {
  const resilience = axes.find(axis => axis.id === 29);
  assert.match(resilience.title, /Resiliencia/);
  assert.match(resilience.citizenSummary, /10 entidades/);
  assert.match(resilience.citizenSummary, /30 entidades/);
  assert.match(resilience.body, /2 ejercicios al año/);
  assert.match(resilience.body, /90 % de las correcciones/);
  assert.match(resilience.body, /no como un hecho confirmado/);
  assert.match(resilience.body, /Rusia–Ucrania/);
  assert.match(resilience.body, /72 horas no sustituye servicios públicos/);
  assert.match(resilience.body, /no dirigir una emergencia/);
  assert.match(resilience.body, /riesgo residual/);
  assert.match(getChapter(markdown, 8), /\[F31\]/);
  assert.match(getChapter(markdown, 4), /Un dato nacional no sustituye/);
});

test('collaborative economy opens income routes without bypassing transport or labour guarantees', () => {
  const business = axes.find(axis => axis.id === 14);
  const selfEmployment = axes.find(axis => axis.id === 15);
  const initiative = axes.find(axis => axis.id === 24);
  const mobility = axes.find(axis => axis.id === 25);
  const influence = axes.find(axis => axis.id === 12);
  assert.match(business.citizenSummary, /economía colaborativa/);
  assert.match(business.citizenSummary, /no se tratará automáticamente como actividad de bajo riesgo/);
  assert.match(business.body, /no añade un cuarto frente inicial/);
  assert.match(business.body, /sin inventar una exención fiscal o de alta/);
  assert.match(selfEmployment.body, /La flexibilidad horaria no decide por sí sola/);
  assert.match(selfEmployment.body, /hora total dedicada, incluyendo espera/);
  assert.match(initiative.body, /antes de comprobar requisitos, demanda y viabilidad/);
  assert.match(mobility.citizenSummary, /la autoridad competente decide y autoriza/);
  assert.match(mobility.body, /compartir los costes.*transporte remunerado/);
  assert.match(mobility.body, /no destinatarios preferentes/);
  assert.match(mobility.body, /Es una impugnación, no una anulación firme/);
  assert.match(mobility.body, /No es un recuento de conductores/);
  assert.match(mobility.body, /No se promete una rebaja nacional del precio ni un sueldo para los conductores/);
  assert.match(influence.body, /ninguna asociación o empresa tendrá un veto privilegiado/);
  assert.deepEqual(observedCharts[25].at(-1).values, [60074, 27107]);
  assert.match(observedCharts[25].at(-1).note, /No son conductores/);
  for (const ref of [32, 33, 34]) assert.ok(getChapter(markdown, 8).includes(`[F${ref}]`));
  assert.ok(filterAxes(axes, 'all', 'Uber').some(axis => axis.id === 25));
  assert.ok(filterAxes(axes, 'economy', 'economia colaborativa').some(axis => axis.id === 14));
});

test('outreach sheet reflects confirmed experience, programme scope and conditional collaboration', async () => {
  const sheet = await readFile(new URL('../presentacion.html', import.meta.url), 'utf8');
  assert.match(sheet, /diez años en Silicon Valley/);
  assert.match(sheet, /empresas tecnológicas de alcance mundial/);
  assert.ok(sheet.includes(`${axes.length} ámbitos de actuación`));
  assert.equal((sheet.match(/<p><strong>[123]\./g) || []).length, 3);
  assert.match(sheet, /hasta el 15 de octubre de 2026/);
  assert.match(sheet, /reunión de 20 minutos/);
  assert.match(sheet, /no hay medidas ni financiación institucional aprobadas/);
  assert.match(sheet, /cualquier prueba requiere acuerdos y recursos/);
  assert.match(sheet, /sin el «y tú más»/);
  assert.match(sheet, /sin silenciar críticas ni responsabilidades/);
  assert.doesNotMatch(sheet, /\bSMART\b|127\.0\.0\.1|Estimado equipo/);
});

test('cooperation rejects blame-shifting without demanding conformity or weakening accountability', () => {
  const cohesion = axes.find(axis => axis.id === 20);
  assert.match(getChapter(markdown, 1), /Unir esfuerzos, no repartir culpas/);
  assert.match(cohesion.citizenSummary, /10 proyectos.*20 municipios.*5 comunidades/);
  assert.match(cohesion.citizenSummary, /alcanzar 40 proyectos.*60 %/);
  assert.match(cohesion.citizenSummary, /protocolo de diálogo y un registro/);
  assert.match(cohesion.body, /no exime de explicar la responsabilidad actual/);
  assert.match(cohesion.body, /ofrecer revisión|Ofrecer revisión/);
  assert.match(cohesion.body, /Unir no significa impunidad/);
  assert.match(cohesion.body, /no prueban una reducción nacional de polarización/);
  assert.match(getChapter(markdown, 6), /una irregularidad no deja de investigarse/);
  assert.ok(filterAxes(axes, 'institutions', 'tu mas').some(axis => axis.id === 20));
  assert.deepEqual(targetCharts[19].slice(1, 4), [null, 10, 40]);
});

test('constitutional clarity distinguishes accessible explanations from safeguarded legal reform', () => {
  const constitution = axes.find(axis => axis.id === 30);
  assert.equal(axes.length, 31);
  assert.equal(constitution.category, 'institutions');
  assert.match(constitution.title, /Constitución clara/);
  assert.match(constitution.citizenSummary, /12 fichas.*200 personas/);
  assert.match(constitution.citizenSummary, /40 fichas.*600 participantes/);
  assert.match(constitution.technicalBody, /no se promete eliminarla ni imponer una lectura política única/);
  assert.match(constitution.technicalBody, /no generalizar|sin generalizar una muestra voluntaria/);
  assert.match(constitution.technicalBody, /sin atribuir valor normativo a la guía/);
  assert.match(constitution.technicalBody, /tres quintos de cada Cámara/);
  assert.match(constitution.technicalBody, /mayoría absoluta del Senado.*dos tercios/);
  assert.match(constitution.technicalBody, /15 días.*una décima parte/);
  assert.match(constitution.technicalBody, /disolución inmediata.*referéndum de ratificación obligatorio/);
  assert.match(constitution.technicalBody, /no hay iniciativa legislativa popular directa/);
  assert.match(constitution.technicalBody, /No puede iniciarse en tiempo de guerra/);
  assert.match(constitution.technicalBody, /sin añadir automáticamente un cuarto frente/);
  assert.match(getChapter(markdown, 5), /Claridad constitucional.*30:/);
  assert.match(getChapter(markdown, 7), /30\. Constitución clara y accesible/);
  assert.match(getChapter(markdown, 8), /\[F35\].*no una medición de dificultad/);
  assert.deepEqual(observedCharts[30][0].values, [169, 4, 9, 1, 1]);
  assert.equal(observedCharts[30][0].kind, 'normative');
  assert.match(observedCharts[30][0].note, /no sumar como índice de complejidad/);
  assert.deepEqual(targetCharts[29].slice(1, 4), [null, 12, 40]);
  assert.match(targetCharts[29][5], /no artículos reformados/);
  assert.ok(filterAxes(axes, 'institutions', 'constitucion clara').some(axis => axis.id === 30));
});

test('justice strengthens defence and integrity without treating delay as corruption', () => {
  const justice = axes.find(axis => axis.id === 31);
  assert.equal(justice.category, 'institutions');
  assert.match(justice.title, /Justicia accesible y ágil/);
  assert.match(justice.citizenSummary, /3 unidades.*15 %/);
  assert.match(justice.citizenSummary, /10 unidades.*25 %/);
  assert.match(justice.citizenSummary, /sin recortar plazos de defensa/);
  assert.match(justice.citizenSummary, /sin identificar automáticamente lentitud con corrupción/);
  assert.match(justice.citizenSummary, /no dirigir expedientes ni ofrecer defensa profesional/);
  assert.match(justice.technicalBody, /no sustituye la notificación oficial ni modifica un plazo procesal/);
  assert.match(justice.technicalBody, /No prometer abogado gratuito universal/);
  assert.match(justice.technicalBody, /una queja no sustituye el recurso ni suspende su plazo/);
  assert.match(justice.technicalBody, /No añade automáticamente un cuarto frente inicial/);
  assert.match(getChapter(markdown, 5), /Justicia y defensa.*31:/);
  assert.match(getChapter(markdown, 7), /31\. Justicia accesible y ágil/);
  for (const ref of [36, 37]) assert.ok(getChapter(markdown, 8).includes(`[F${ref}]`));
  assert.deepEqual(observedCharts[31][0].values, [15.5, 11.1]);
  assert.equal(observedCharts[31][0].kind, 'estimated');
  assert.match(observedCharts[31][0].note, /No es una medición directa/);
  assert.match(observedCharts[31][0].note, /No prueba corrupción/);
  assert.deepEqual(targetCharts[30].slice(1, 4), [100, 85, 75]);
  assert.ok(filterAxes(axes, 'institutions', 'asistencia juridica').some(axis => axis.id === 31));
});

test('legal routes distinguish constitutional reform from legislative and administrative changes', () => {
  const byId = id => axes.find(axis => axis.id === id).technicalBody;
  assert.match(byId(6), /Suprimir el Senado.*artículo 167/);
  assert.match(byId(6), /derecho a la autonomía del artículo 2 requiere el artículo 168/);
  assert.match(byId(9), /No exigen por sí mismos cambiar la Constitución/);
  assert.match(byId(9), /168 si afecta al artículo 27/);
  assert.match(byId(13), /listas de espera no exige por sí solo reforma constitucional/);
  assert.match(byId(21), /artículo 1\.3.*exige el artículo 168/);
  assert.match(byId(22), /circunscripción provincial del Congreso exige reformar el artículo 68\.2 por el artículo 167/);
  assert.match(byId(23), /artículos 101, 113 o 114.*artículo 167/);
  assert.match(byId(31), /12 vocales judiciales puede articularse mediante reforma de la LOPJ/);
  assert.match(byId(31), /8 juristas sí requiere reforma constitucional/);
  assert.match(byId(30), /Qué propuestas requieren cambiar la Constitución/);
  assert.match(byId(30), /no requieren automáticamente reforma constitucional/);
  assert.match(getChapter(markdown, 2), /Comparar una alternativa no significa adoptarla/);
  assert.match(getChapter(markdown, 4), /cauce 167 o 168, mayorías y referéndum/);
});

test('closing priorities reuse programme measures and preserve feasibility and guarantees', () => {
  const closing = getChapter(markdown, 9);
  const rows = closing.split('\n').filter(line => line.startsWith('|') && !line.includes('---'));
  assert.equal(rows.length, 9);
  assert.match(closing, /Ampliar el parque público y protegido de alquiler/);
  assert.match(closing, /habilitar suelo residencial donde haya demanda, servicios financiados y garantías/);
  assert.match(axes[1].technicalBody, /revisar restricciones urbanísticas innecesarias/);
  assert.match(closing, /Una alerta o denuncia no es una condena/);
  assert.match(closing, /No confundir demora con corrupción/);
  assert.match(closing, /hasta 3 frentes/);
  assert.match(closing, /Si solo hay capacidad para uno/);
  assert.match(closing, /primer ciclo de 90 días/);
  assert.match(closing, /Por dónde empezar/);
  assert.match(closing, /cómo comprobar el resultado/);
  assert.match(closing, /qué hemos hecho, qué nos ha frenado y cuánto hemos gastado/);
  assert.match(closing, /no equivale a entregar viviendas/);
  assert.doesNotMatch(closing, /La acción importante para empezar|fichas y entregas verificadas|criterio de aceptación/);
  for (const [, headline] of axisMetadata) assert.match(headline, /[.?]$/);
});

test('citizen contributions cover all agreed topics without unconditional abolition or loss of rights', () => {
  const byId = id => axes.find(axis => axis.id === id);
  for (const [id, topic] of [
    [1, /financiación de sindicatos/],
    [1, /reducirlas o sustituirlas por recursos propios/],
    [4, /crédito horario y las liberaciones sindicales/],
    [6, /Senado actual.*supresión mediante reforma constitucional/],
    [6, /propuestas de centralización y supresión de niveles autonómicos/],
    [9, /coordinación curricular y centralización de funciones concretas/],
    [13, /centralización de funciones concretas.*continuidad asistencial/],
    [16, /exenciones de IBI.*Iglesia Católica/],
    [17, /extensión de operación.*construcción de nuevas instalaciones/],
    [22, /compromisos electorales.*presidente y su Gobierno/],
    [22, /comparar proporcionalidad, circunscripciones y representación territorial/],
    [23, /limitación temporal de ventajas personales indefinidas/],
    [31, /12 vocales del turno judicial por jueces y magistrados/],
  ]) {
    assert.ok(byId(id).measures.some(measure => topic.test(measure)), `Eje ${id}: ${topic}`);
  }
  assert.match(byId(1).body, /recibir financiación pública no demuestra por sí solo obediencia política/);
  assert.match(byId(1).body, /sin presumir cómo votan las personas beneficiarias/);
  assert.match(byId(4).body, /sin vigilancia de afiliación, represalias ni supresión general/);
  assert.match(byId(6).body, /artículo 168.*referéndum obligatorio/);
  assert.match(byId(16).body, /identificar leyes y acuerdos internacionales/);
  assert.match(byId(17).body, /Consejo de Seguridad Nuclear.*residuos y desmantelamiento/);
  assert.match(byId(17).body, /no anunciar obras, extensiones ni cierres como ya autorizados/);
  assert.match(byId(22).body, /no retirar el voto.*recibir ayudas/);
  assert.match(byId(23).body, /sin convertir al presidente en un empleado sujeto a despido/);
  assert.match(byId(23).body, /pensiones ordinarias/);
  assert.match(byId(31).body, /no el tribunal que dicta todas las sentencias/);
  assert.match(byId(31).body, /no si las sentencias benefician a un partido/);
  for (const reference of [38, 39, 40, 41]) {
    assert.equal((getChapter(markdown, 8).match(new RegExp(`\\*\\*\\[F${reference}\\]`, 'g')) || []).length, 1);
  }
  for (const [id, query] of [[1, 'sindicatos'], [4, 'liberaciones sindicales'], [6, 'senado'],
    [16, 'iglesia ibi'], [17, 'nuclear'], [22, 'compromisos electorales'], [31, 'elección cgpj']]) {
    assert.ok(filterAxes(axes, 'all', query).some(axis => axis.id === id), query);
  }
});

test('economic examples distinguish illustrative arithmetic from tax rules and proposed savings', () => {
  const fiscal = axes.find(axis => axis.id === 16);
  assert.match(fiscal.technicalBody, /casos didácticos con cantidades ficticias/);
  assert.match(fiscal.technicalBody, /no cálculos de impuestos vigentes, previsiones ni rebajas propuestas/);
  const rows = fiscal.technicalBody.split('\n').filter(line => /^\| (Persona asalariada|Autónomo con ingresos variables|Pequeño negocio) \|/.test(line));
  assert.equal(rows.length, 3);
  assert.match(rows[0], /30\.000.*6\.000.*24\.000/);
  assert.match(rows[1], /24\.000.*8\.000.*16\.000/);
  assert.match(rows[2], /120\.000.*100\.000.*20\.000/);
  assert.match(fiscal.technicalBody, /Las retenciones no se sumarán otra vez a la cuota definitiva/);
  assert.match(fiscal.technicalBody, /pendiente de cálculo y no anunciará un ahorro individual/);
  assert.match(fiscal.citizenSummary, /10 perfiles comparables/);
  assert.match(axes.find(axis => axis.id === 15).technicalBody, /meses de poca actividad/);
});

test('simplification catalogue is prioritised without expanding pilots or dropping safeguards', () => {
  const administration = axes.find(axis => axis.id === 6);
  assert.equal((administration.technicalBody.match(/^\| [1-6] \|/gm) || []).length, 6);
  assert.match(administration.technicalBody, /no se activan todos los recorridos de la tabla ni se amplía el piloto/);
  assert.match(administration.technicalBody, /lo inventariado, lo aprobado, lo realmente eliminado y lo bloqueado/);
  assert.match(administration.technicalBody, /Mantendremos atención asistida, privacidad y los controles necesarios/);
  assert.match(administration.citizenSummary, /10 procedimientos de 3 administraciones/);
  assert.match(axes.find(axis => axis.id === 14).technicalBody, /ni ampliar automáticamente las 5 actividades iniciales/);
  assert.ok(filterAxes(axes, 'institutions', 'catálogo inicial').some(axis => axis.id === 6));
});

test('citizen security has visible initial proposals, measurement limits and individual guarantees', () => {
  const development = getChapter(markdown, 3);
  assert.equal(axes.length, 31);
  assert.match(development, /Seguridad ciudadana: prevención, víctimas y respuesta efectiva/);
  assert.match(development, /ni activa un cuarto frente inicial/);
  assert.match(development, /Una mayor denuncia puede reflejar mejor acceso y no más delitos/);
  assert.match(development, /no utilizar origen o nacionalidad como indicador individual de peligrosidad/);
  assert.match(development, /sin identificar víctimas, expedientes ni operativos sensibles/);
  assert.match(development, /No hay aumento de plantilla, presupuesto ni despliegue aprobados/);
  assert.match(development, /presunción de inocencia, la defensa, la privacidad/);
  assert.match(getChapter(markdown, 7), /apartado 3.1 desarrolla seguridad ciudadana/);
});
