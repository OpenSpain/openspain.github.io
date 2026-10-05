import { categories, parseProgram, ipc, months, inlineParts } from './program.js';
import { createPolicyEvidence } from './charts.js';

function node(tag, text, className) {
  const result = document.createElement(tag);
  if (text !== undefined) result.textContent = text;
  if (className) result.className = className;
  return result;
}

function inline(parent, text) {
  for (const part of inlineParts(text)) {
    if (part.type === 'text') parent.append(document.createTextNode(part.text));
    else {
      const child = node(part.type === 'link' ? 'a' : 'strong', part.text);
      if (part.type === 'link') {
        child.href = part.href;
        child.target = '_blank';
        child.rel = 'noopener noreferrer';
      }
      parent.append(child);
    }
  }
}

function renderMarkdown(markdown) {
  const container = document.querySelector('#report-body');
  let section;
  let content;
  let list;
  let table;
  let tableBody;
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  for (const line of lines) {
    if (!line.trim()) {
      list = undefined;
      table = undefined;
      continue;
    }
    if (line.startsWith('# ')) continue;
    if (line.startsWith('## ')) {
      section = node('section', undefined, line.startsWith('## 7. ') ? 'report-section report-summary' : 'report-section');
      section.append(node('h2', line.slice(3)));
      content = node('div', undefined, 'report-body-content');
      section.append(content);
      container.append(section);
      list = undefined;
      table = undefined;
      continue;
    }
    if (!content) {
      section = node('section', undefined, 'report-section');
      content = node('div', undefined, 'report-body-content');
      section.append(content);
      container.append(section);
    }
    if (line.startsWith('#### ')) {
      content.append(node('h4', line.slice(5), 'technical-heading'));
      list = undefined;
      continue;
    }
    if (line.startsWith('### ')) {
      const title = line.slice(4);
      const heading = node('h3', undefined);
      const match = title.match(/^2\.(\d+)\. (.+)/);
      if (match) {
        heading.className = 'axis-heading';
        heading.id = `eje-${match[1]}`;
        const axis = reportAxes.find(item => item.id === Number(match[1]));
        heading.append(node('span', `Eje ${match[1].padStart(2, '0')} · ${categories.find(category => category.id === axis.category).short}`, 'axis-label'),
          document.createTextNode(match[2]));
      } else {
        heading.textContent = title;
      }
      content.append(heading);
      if (match) content.append(createPolicyEvidence(Number(match[1])));
      list = undefined;
      continue;
    }
    if (line.startsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
      if (cells.every(cell => /^:?-+:?$/.test(cell))) continue;
      if (!table) {
        table = node('table');
        const head = node('thead');
        const row = node('tr');
        cells.forEach(cell => {
          const th = node('th');
          th.scope = 'col';
          inline(th, cell);
          row.append(th);
        });
        head.append(row);
        tableBody = node('tbody');
        table.append(head, tableBody);
        content.append(table);
      } else {
        const row = node('tr');
        cells.forEach(cell => {
          const td = node('td');
          inline(td, cell);
          row.append(td);
        });
        tableBody.append(row);
      }
      continue;
    }
    if (line.startsWith('- ')) {
      if (!list) {
        list = node('ul');
        content.append(list);
      }
      const item = node('li');
      inline(item, line.slice(2));
      list.append(item);
    } else {
      list = undefined;
      const paragraph = node(line.startsWith('> ') ? 'blockquote' : 'p');
      inline(paragraph, line.startsWith('> ') ? line.slice(2) : line);
      if (/^\*\*(Qué queremos mejorar|Qué proponemos|Cómo sabremos si funciona):/.test(line)) {
        paragraph.className = 'citizen-summary-line';
      }
      content.append(paragraph);
    }
  }
}

function renderIPC() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 600 200');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'IPC 2026, datos definitivos de enero a agosto: ' + ipc[2026].map((value, index) => `${months[index]} ${value.toLocaleString('es-ES')} %`).join('; '));
  const make = (tag, attributes, text) => {
    const child = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => child.setAttribute(key, value));
    if (text) child.textContent = text;
    svg.append(child);
    return child;
  };
  for (let tick = 0; tick <= 5; tick++) {
    const y = 162 - tick / 5 * 130;
    make('line', { x1: 35, x2: 580, y1: y, y2: y, stroke: '#d6dae2', 'stroke-dasharray': '3 5' });
    make('text', { x: 2, y: y + 4, fill: '#394b66', 'font-size': 13 }, `${tick}%`);
  }
  const values = ipc[2026];
  const step = 532 / values.length;
  values.forEach((value, index) => {
    const x = 48 + index * step;
    const height = value / 5 * 130;
    make('rect', { x, y: 162 - height, width: 32, height, rx: 3, fill: index === values.length - 1 ? '#2459df' : '#97b5fa' });
    make('text', { x: x + 16, y: 152 - height, fill: '#15243e', 'font-size': 13, 'text-anchor': 'middle' }, value.toLocaleString('es-ES'));
    make('text', { x: x + 16, y: 184, fill: '#394b66', 'font-size': 13, 'text-anchor': 'middle' }, months[index]);
  });
  document.querySelector('#report-ipc').append(svg);
}

let reportAxes = [];
try {
  const response = await fetch('./PROGRAMA.md');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const markdown = await response.text();
  reportAxes = parseProgram(markdown);
  document.querySelector('#report-count').textContent = reportAxes.length;
  const contents = document.querySelector('#report-contents');
  reportAxes.forEach(axis => {
    const link = node('a', undefined, 'contents-link');
    link.href = `#eje-${axis.id}`;
    link.append(node('span', String(axis.id).padStart(2, '0')), document.createTextNode(axis.title));
    contents.append(link);
  });
  renderIPC();
  renderMarkdown(markdown);
  document.documentElement.dataset.reportReady = 'true';
} catch (error) {
  console.error('No se pudo preparar el informe:', error);
  const errorMessage = document.querySelector('#report-error');
  errorMessage.hidden = false;
  errorMessage.textContent = `No se pudo preparar el informe: ${error.message}`;
  document.documentElement.dataset.reportReady = 'error';
}
