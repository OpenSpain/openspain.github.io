export const categories = [
  { id: 'all', label: 'Todo el programa' },
  { id: 'life', label: 'Vivir mejor', short: 'Vida y oportunidades' },
  { id: 'economy', label: 'Crear y trabajar', short: 'Economía y empleo' },
  { id: 'institutions', label: 'Instituciones', short: 'Instituciones y garantías' },
  { id: 'future', label: 'El siguiente salto', short: 'Tecnología y futuro' },
];

export const axisMetadata = [
  ['institutions', 'Integridad sin excepciones', 'Que cada euro público tenga explicación.', '◎'],
  ['life', 'Una casa. Un proyecto de vida.', 'Vivienda accesible y garantías para ambas partes.', '⌂'],
  ['life', 'Turismo accesible. Barrios habitables.', 'Alojamiento legal a buen precio y convivencia.', '▦'],
  ['economy', 'Trabajar tiene que compensar', 'Productividad, derechos y mejores ingresos.', '↗'],
  ['future', 'Tecnología con propósito', 'Innovación e IA útil, no una etiqueta.', '✳'],
  ['institutions', 'Un Estado que te lo ponga fácil', 'Responsabilidades claras y desempeño con garantías.', '⇄'],
  ['institutions', 'Talento, vías legales y garantías', 'Atracción internacional, integración y permisos previsibles.', '⊕'],
  ['institutions', 'Un país conectado al mundo', 'Clientes europeos y estadounidenses, cooperación y evidencia.', '↗'],
  ['life', 'Aprender para la vida', 'Habilidades cotidianas, inglés, finanzas y pensamiento crítico.', '✧'],
  ['economy', 'Que el talento tenga futuro', 'Carreras creativas sostenibles y con derechos.', '✺'],
  ['economy', 'Nacer aquí. Crecer en el mundo.', 'Startups, talento, inversión y clientes internacionales.', '↗'],
  ['institutions', 'Contratos sin zonas grises', 'Competencia y transparencia en cada etapa.', '▤'],
  ['life', 'Cuidarse no debe ser un lujo', 'Acceso universal y colaboración evaluable.', '✚'],
  ['economy', 'Más formas de generar ingresos.', 'Emprender, compartir recursos y operar con reglas claras.', '⇢'],
  ['economy', 'Autónomos, no a solas', 'Ingresos variables, plataformas y protección efectiva.', '◈'],
  ['economy', 'Impuestos que se entiendan', 'Menor carga viable. Financiación explícita.', '%'],
  ['future', 'Menos dependencia. Más futuro.', 'Menos petróleo y gas, con energía fiable y asequible.', '☀'],
  ['future', 'La próxima frontera', 'Ciencia y economía espacial con utilidad.', '✦'],
  ['institutions', 'Información, no instrucciones', 'Medios independientes, plurales y transparentes.', '≋'],
  ['institutions', 'Unir esfuerzos. Resolver juntos.', 'Menos «y tú más». Acuerdos con pluralidad y responsabilidad.', '∞'],
  ['institutions', 'Instituciones que se justifican', 'Monarquía y alternativas: utilidad, costes y controles.', '◇'],
  ['institutions', 'Mismo voto. Mejores decisiones.', 'Igualdad política, deliberación y conocimiento experto.', '☷'],
  ['institutions', 'Reconocer el valor. Controlar el poder.', 'Actividad empresarial compatible e incentivos con control independiente.', '◉'],
  ['life', 'Del propósito al primer paso', 'Talentos, cooperación e ingresos complementarios viables.', '↗'],
  ['future', 'Conectados. Con alternativas.', 'Trabajo remoto, taxi, VTC y movilidad compartida con garantías.', '⌁'],
  ['future', 'Diseñar aquí. Fabricar aquí.', 'Vehículos eléctricos, robots e IA con industria viable.', '⚙'],
  ['life', 'Jubilarse con confianza', 'Pensiones suficientes, financiación y equidad entre generaciones.', '◷'],
  ['future', 'Seguridad para elegir. Libertad para crear.', 'Renta básica y transición por IA: opciones, costes y evidencia.', '◇'],
  ['institutions', 'Un país preparado, no improvisado.', 'Planes alternativos ante guerras, fallos y otras crisis.', '◇'],
  ['institutions', 'Una Constitución que se entienda.', 'Lenguaje claro, menos ambigüedad y las mismas garantías.', '▤'],
];

export function getChapter(markdown, number) {
  const headings = [...markdown.matchAll(/^## (\d+)\. .+\r?$/gm)];
  const index = headings.findIndex(heading => Number(heading[1]) === number);
  if (index === -1) throw new Error(`Falta el capítulo ${number} del programa.`);
  const start = headings[index].index + headings[index][0].length;
  return markdown.slice(start, headings[index + 1]?.index ?? markdown.length).trim();
}

export function inlineParts(text) {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g).filter(Boolean).map(part => {
    if (part.startsWith('**')) return { type: 'strong', text: part.slice(2, -2) };
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (link) return { type: 'link', text: link[1], href: link[2] };
    return { type: 'text', text: part };
  });
}

export function parseProgram(markdown) {
  const matches = [...markdown.matchAll(/^### 2\.(\d+)\. (.+)\r?$/gm)];
  if (!matches.length) throw new Error('El documento no contiene ejes reconocibles.');
  return matches.map((match, index) => {
    const id = Number(match[1]);
    const start = match.index + match[0].length;
    const nextSection = markdown.indexOf('\n## ', start);
    const end = matches[index + 1]?.index ?? (nextSection === -1 ? markdown.length : nextSection);
    const body = markdown.slice(start, end).trim();
    const measuresBlock = body.match(/\*\*Propuestas:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/)?.[1];
    const measures = measuresBlock ? [...measuresBlock.matchAll(/^- (.+)$/gm)].map(item => item[1]) : [];
    if (!measures.length) throw new Error(`El eje ${id} no contiene propuestas reconocibles.`);
    const metadata = axisMetadata[id - 1];
    if (!metadata) throw new Error(`Falta información visual para el eje ${id}.`);
    const marker = '\n#### Ficha técnica';
    const split = body.indexOf(marker);
    if (split === -1) throw new Error(`El eje ${id} no distingue resumen ciudadano y ficha técnica.`);
    return {
      id, title: match[2], body, measures,
      citizenSummary: body.slice(0, split).trim(),
      technicalBody: body.slice(split + marker.length).trim(),
      category: metadata[0], headline: metadata[1], description: metadata[2], icon: metadata[3],
      searchText: normalize(`${match[2]} ${body} ${metadata[1]}`),
    };
  });
}

export function normalize(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
}

export function filterAxes(axes, category, query) {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return axes.filter(axis => (category === 'all' || axis.category === category)
    && words.every(word => axis.searchText.includes(word)));
}

export const ipc = {
  2025: [2.9, 3.0, 2.3, 2.2, 2.0, 2.3, 2.7, 2.7, 3.0, 3.1, 3.0, 2.9],
  2026: [2.3, 2.3, 3.4, 3.2, 3.2, 3.2, 3.6, 4.3],
};
export const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
