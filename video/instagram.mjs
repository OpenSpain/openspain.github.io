import { getCitizenDemands, inlineParts, parseProgram } from '../program.js';

export const participationMessage = 'Comenta PARTICIPA y te mandamos el enlace para hacerte simpatizante.';

const demandSummaries = [
  'Dimisión por mentira deliberada relevante acreditada, con pruebas, independencia y audiencia. No es pérdida automática del escaño.',
  'Obligaciones públicas, revisión de incumplimientos y consecuencias proporcionadas.',
  'Funciones, experiencia, retribución y necesidad del puesto. Con protección de datos privados.',
  'Selección transparente y auditorías. No exigir títulos para representar a la ciudadanía.',
  'Declaración, revisión independiente y abstención efectiva. El parentesco no demuestra una infracción.',
  'Cuentas, contratos y subvenciones contrastables. Control independiente.',
  'Encuentros abiertos, preguntas ciudadanas y seguimiento público de compromisos.',
  'Disciplina proporcionada con garantías. Discrepar con dureza no equivale a insultar.',
  'Medir viviendas disponibles y esfuerzo económico. Preservar patrimonio público y asequibilidad.',
  'Educación práctica y menos trámites redundantes. Sin eliminar protecciones necesarias.',
];

export function plainText(text) {
  return inlineParts(text).map(part => part.text).join('').replace(/\[F\d+\]/g, '').trim();
}

function readingTime(text) {
  return Math.max(6, Math.ceil(text.split(/\s+/).length / 2.5 + 1));
}

function cards(text, label) {
  const sentences = plainText(text).match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  if (!sentences?.length) throw new Error(`Falta contenido para ${label}.`);
  const groups = [];
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    const last = groups.at(-1);
    if (last && `${last} ${trimmed}`.split(/\s+/).length <= 38) {
      groups[groups.length - 1] = `${last} ${trimmed}`;
    } else {
      groups.push(trimmed);
    }
  }
  return groups.map(body => ({ label, title: '', body, duration: readingTime(body) }));
}

export function getInstagramVideos(markdown) {
  const axes = parseProgram(markdown);
  if (axes.length !== 31 || axes.some((axis, index) => axis.id !== index + 1)) {
    throw new Error('La serie requiere los 31 ejes consecutivos del programa.');
  }
  const demands = [...getCitizenDemands(markdown).matchAll(/^- \*\*(\d+)\. (.+)\*\* (.+)$/gm)];
  if (demands.length !== 10 || demands.some((item, index) => Number(item[1]) !== index + 1)) {
    throw new Error('El vídeo del decálogo requiere diez exigencias consecutivas.');
  }
  const closing = {
    label: 'PARTICIPA EN OPENSPAIN', title: 'Tu voz también cuenta.',
    body: participationMessage, duration: 8,
  };
  const videos = [{
    id: '00-decalogo', title: 'Diez exigencias ciudadanas',
    url: 'https://openspain.org/programa.html#exigencias',
    scenes: [
      { label: 'EL DECÁLOGO', title: 'Diez reglas. Para cualquier gobierno.',
        body: 'También para quienes votamos. Responsabilidad política con pruebas y garantías.', duration: 7 },
      ...demands.map(item => {
        const body = demandSummaries[Number(item[1]) - 1];
        return { label: `EXIGENCIA ${item[1]} / 10`, title: item[2], body,
          sourceDescription: plainText(item[3].split(' Desarrollo:')[0]),
          duration: readingTime(`${item[2]} ${body}`) };
      }),
      closing,
    ],
  }];
  for (const axis of axes) {
    const introduction = axis.citizenSummary.split('\n#### Plan de actuación')[0];
    const paragraphs = introduction.split(/\n\s*\n/).filter(Boolean);
    if (paragraphs.length !== 4 || !/hipotético|hipotética/.test(paragraphs[1])) {
      throw new Error(`Revisa la estructura del resumen del eje ${axis.id} antes de crear su vídeo.`);
    }
    videos.push({
      id: `eje-${String(axis.id).padStart(2, '0')}`, title: axis.title,
      url: `https://openspain.org/programa.html#eje-${axis.id}`,
      scenes: [
        { label: `EJE ${axis.id} / 31`, title: axis.headline, body: axis.description, duration: 6 },
        ...cards(paragraphs[0], 'QUÉ PROPONEMOS'),
        ...cards(paragraphs[2], 'COSTES Y GARANTÍAS'),
        ...cards(paragraphs[3], 'CÓMO COMPROBARLO'),
        closing,
      ],
    });
  }
  return videos.map(video => {
    const scenes = video.scenes.map(scene => ({
      ...scene, duration: Math.max(scene.duration, readingTime(`${scene.title} ${scene.body}`.trim())),
    }));
    return {
    ...video, scenes,
    duration: scenes.reduce((sum, scene) => sum + scene.duration, 0),
    caption: `${video.title}\n\n${video.scenes.filter(scene => scene.label === 'QUÉ PROPONEMOS')
      .map(scene => scene.body).join(' ') || 'Diez exigencias al Gobierno y representantes, sea cual sea su partido.'}\n\nPropuestas de OpenSpain, no medidas aprobadas ni resultados obtenidos. Consulta desarrollo, costes y garantías:\n${video.url}\n\n${participationMessage}\n\n#OpenSpain #ParticipaciónCiudadana #Propuestas #España`,
  };
  });
}
