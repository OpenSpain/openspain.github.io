import { categories, parseProgram, filterAxes, ipc, months, getChapter, getCitizenDemands } from './program.js?v=20261009-pages';
import { createPolicyEvidence, observedCharts } from './charts.js?v=20261009-pages';
import { element, appendMarkdown, openDialog } from './ui.js?v=20261009-pages';

const $ = selector => document.querySelector(selector);
let axes = [];
let currentCategory = 'all';
let chartYear = '2026';
const number = value => value.toLocaleString('es-ES', { maximumFractionDigits: 2 });

function renderFilters() {
  $('#filters').replaceChildren(...categories.map(category => {
    const button = element('button', 'filter-button', category.label);
    button.type = 'button';
    button.dataset.category = category.id;
    button.setAttribute('aria-pressed', String(category.id === currentCategory));
    button.addEventListener('click', () => {
      currentCategory = category.id;
      renderFilters();
      renderCards();
      $('#filters').querySelector(`[data-category="${category.id}"]`).focus();
    });
    return button;
  }));
}

function renderCards() {
  const filtered = filterAxes(axes, currentCategory, $('#search').value);
  $('#program-grid').replaceChildren(...filtered.map(axis => {
    const card = element('article', `program-card category-${axis.category}`);
    card.id = `eje-${axis.id}`;
    const top = element('div', 'card-top');
    const icon = element('span', 'card-icon', axis.icon);
    icon.setAttribute('aria-hidden', 'true');
    top.append(icon, element('span', 'card-index', String(axis.id).padStart(2, '0')));
    card.append(top, element('p', 'card-category', categories.find(item => item.id === axis.category).short),
      element('h3', '', axis.headline), element('p', 'card-description', axis.description));
    const bottom = element('div', 'card-bottom');
    bottom.append(element('span', '', `${axis.measures.length} propuestas`));
    const button = element('button', 'card-link', 'Ver medidas ↗');
    button.type = 'button';
    button.setAttribute('aria-label', `Ver medidas: ${axis.title}`);
    button.addEventListener('click', () => openMeasure(axis, button));
    bottom.append(button);
    card.append(bottom);
    return card;
  }));
  $('#results-count').textContent = `${filtered.length} de ${axes.length} ejes · ${filtered.reduce((sum, axis) => sum + axis.measures.length, 0)} propuestas`;
  $('#empty-state').hidden = filtered.length > 0;
}

function revealLinkedAxis() {
  const axis = axes.find(item => window.location.hash === `#eje-${item.id}`);
  if (!axis) return;
  currentCategory = 'all';
  $('#search').value = '';
  renderFilters();
  renderCards();
  $(`#eje-${axis.id}`).scrollIntoView({ behavior: 'instant', block: 'start' });
}

function openMeasure(axis, trigger) {
  $('#measure-category').textContent = `EJE ${String(axis.id).padStart(2, '0')} / PROPUESTAS PARA DEBATIR`;
  const content = $('#measure-content');
  const heading = element('h2', '', axis.title);
  heading.id = 'measure-title';
  content.replaceChildren(heading);
  const summary = element('div', 'citizen-summary');
  appendMarkdown(summary, axis.citizenSummary);
  const technical = element('div', 'technical-content');
  appendMarkdown(technical, axis.technicalBody);
  content.append(summary, createPolicyEvidence(axis.id), technical);
  openDialog($('#measure-dialog'), trigger);
}

function svgNode(tag, attributes = {}) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, String(value)));
  return node;
}

function renderChart() {
  const values = ipc[chartYear];
  const svg = svgNode('svg', { viewBox: '0 0 680 260', role: 'img', 'aria-labelledby': 'chart-title chart-desc' });
  const title = svgNode('title', { id: 'chart-title' });
  title.textContent = `Variación anual del IPC, ${chartYear}`;
  const description = svgNode('desc', { id: 'chart-desc' });
  description.textContent = values.map((value, index) => `${months[index]}: ${number(value)}%`).join('; ');
  svg.append(title, description);
  const x = index => 44 + index * 594 / (values.length - 1);
  const y = value => 218 - value / 7 * 190;
  for (let tick = 0; tick <= 6; tick += 2) {
    svg.append(svgNode('line', { x1: 44, y1: y(tick), x2: 638, y2: y(tick), class: 'chart-gridline' }));
    const label = svgNode('text', { x: 10, y: y(tick) + 4, class: 'chart-axis' });
    label.textContent = `${tick}%`;
    svg.append(label);
  }
  const points = values.map((value, index) => `${x(index)},${y(value)}`).join(' ');
  svg.append(svgNode('polygon', { points: `44,218 ${points} 638,218`, class: 'chart-area' }),
    svgNode('polyline', { points, class: 'chart-line' }));
  values.forEach((value, index) => {
    const circle = svgNode('circle', { cx: x(index), cy: y(value), r: 4, class: 'chart-point' });
    const tooltip = svgNode('title');
    tooltip.textContent = `${months[index]} ${chartYear}: ${number(value)}%`;
    circle.append(tooltip);
    svg.append(circle);
    const label = svgNode('text', { x: x(index), y: 245, 'text-anchor': 'middle', class: 'chart-axis' });
    label.textContent = months[index];
    svg.append(label);
  });
  const finalLabel = svgNode('text', { x: x(values.length - 1), y: y(values.at(-1)) - 16, 'text-anchor': 'end', class: 'chart-value' });
  finalLabel.textContent = `${number(values.at(-1))}%`;
  svg.append(finalLabel);
  $('#ipc-chart').replaceChildren(svg);
  const table = element('table', 'data-table');
  const caption = element('caption', '', `IPC ${chartYear} · variación anual (%) · fuente: INE`);
  const head = element('thead');
  const headRow = element('tr');
  headRow.append(element('th', '', 'Mes'), element('th', '', 'Variación anual'));
  head.append(headRow);
  const body = element('tbody');
  values.forEach((value, index) => {
    const row = element('tr');
    const month = element('th', '', months[index]);
    month.scope = 'row';
    row.append(month, element('td', '', `${number(value)}%`));
    body.append(row);
  });
  table.append(caption, head, body);
  $('#ipc-table').replaceChildren(table);
}

function renderCoverage() {
  const groups = categories.filter(category => category.id !== 'all').map(category => ({
    ...category,
    count: axes.filter(axis => axis.category === category.id).reduce((sum, axis) => sum + axis.measures.length, 0),
  }));
  const max = Math.max(...groups.map(group => group.count));
  $('#coverage-chart').replaceChildren(...groups.map(group => {
    const row = element('div', 'coverage-row');
    const header = element('div', 'coverage-label');
    header.append(element('span', '', group.short), element('strong', '', `${group.count}`));
    const bar = element('div', `coverage-track category-${group.id}`);
    const svg = svgNode('svg', { viewBox: '0 0 100 8', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
    svg.append(svgNode('rect', { width: group.count / max * 100, height: 8, rx: 4 }));
    bar.append(svg);
    row.append(header, bar);
    return row;
  }));
}

async function loadProgram() {
  $('#program-error').hidden = true;
  $('#results-count').textContent = 'Cargando el programa…';
  $('#retry-program').disabled = true;
  try {
    const response = await fetch('./PROGRAMA.md', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();
    axes = parseProgram(markdown);
    const guide = $('#program-guide-content');
    guide.replaceChildren();
    appendMarkdown(guide, getChapter(markdown, 2).split(/^### /m)[0].trim());
    const demands = $('#citizen-demands-content');
    if (demands) {
      demands.replaceChildren();
      appendMarkdown(demands, getCitizenDemands(markdown));
    } else {
      console.warn('La página conserva una versión anterior sin el decálogo. Recarga para ver el contenido nuevo.');
    }
    $('#axis-count').replaceChildren(document.createTextNode(String(axes.length)), element('span', '', 'ejes'));
    renderFilters();
    renderCards();
    renderCoverage();
    for (const [selector, chapter] of [['#sources-content', 8]]) {
      const container = $(selector);
      container.replaceChildren();
      appendMarkdown(container, getChapter(markdown, chapter));
    }
    const figureCount = Object.values(observedCharts).reduce((sum, series) => sum + series.length, 0);
    $('#evidence-coverage').textContent = `${figureCount} gráficos de fuente en ${Object.keys(observedCharts).length} de ${axes.length} ejes, además de ${axes.length} gráficos de metas propuestas. Los datos de contexto y cifras normativas no sustituyen líneas base de los pilotos ni prueban efectos. Costes y parte del diagnóstico específico siguen pendientes.`;
    $('#axis-data-content').replaceChildren(...axes.map(axis => {
      const disclosure = element('details', 'program-chapter');
      disclosure.append(element('summary', '', `${String(axis.id).padStart(2, '0')} · ${axis.title}`),
        createPolicyEvidence(axis.id));
      return disclosure;
    }));
    revealLinkedAxis();
  } catch (error) {
    console.error('Error al cargar el programa:', error);
    const guidance = window.location.protocol === 'file:'
      ? 'Abre la web mediante npm start o usa su dirección pública.'
      : 'Reintenta la carga o recarga la página para obtener la versión actual.';
    $('#program-error p').textContent = `No se pudo cargar el programa. ${guidance} Detalle: ${error instanceof Error ? error.message : String(error)}`;
    $('#program-error').hidden = false;
    $('#results-count').textContent = 'Programa no disponible';
    $('#coverage-chart').replaceChildren(element('p', '', 'No se pudo calcular el mapa. Reintenta la carga del programa.'));
  } finally {
    $('#retry-program').disabled = false;
  }
}

$('#search').addEventListener('input', renderCards);
window.addEventListener('hashchange', revealLinkedAxis);
$('#retry-program').addEventListener('click', loadProgram);
$('#reset-filters').addEventListener('click', () => {
  currentCategory = 'all';
  $('#search').value = '';
  renderFilters();
  renderCards();
});
$('#frontier-action').addEventListener('click', () => {
  currentCategory = 'future';
  $('#search').value = '';
  renderFilters();
  renderCards();
});
document.querySelectorAll('[data-year]').forEach(button => button.addEventListener('click', () => {
  chartYear = button.dataset.year;
  document.querySelectorAll('[data-year]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  renderChart();
}));
$('#toggle-data').addEventListener('click', () => {
  const expanded = $('#ipc-table').hidden;
  $('#ipc-table').hidden = !expanded;
  $('#toggle-data').setAttribute('aria-expanded', String(expanded));
  $('#toggle-data').textContent = expanded ? 'Ocultar tabla −' : 'Ver tabla de datos +';
});
renderChart();
loadProgram();
