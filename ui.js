import { inlineParts } from './program.js?v=20261009-pages';

export function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function appendInline(container, text, axisPage = '') {
  for (const part of inlineParts(text)) {
    if (part.type === 'text') container.append(document.createTextNode(part.text));
    else {
      const node = element(part.type === 'link' ? 'a' : 'strong', '', part.text);
      if (part.type === 'link') {
        node.href = part.href.startsWith('#eje-') ? axisPage + part.href : part.href;
        if (!part.href.startsWith('#')) {
          node.target = '_blank';
          node.rel = 'noopener noreferrer';
        }
      }
      container.append(node);
    }
  }
}

export function appendMarkdown(container, markdown, axisPage = '') {
  let list, table, tableBody;
  for (const line of markdown.split('\n')) {
    if (!line.trim()) {
      list = undefined;
      table = undefined;
      continue;
    }
    if (line.startsWith('#### ') || line.startsWith('### ')) {
      const technical = line.startsWith('#### ');
      container.append(element(technical ? 'h4' : 'h3', technical ? 'technical-heading' : 'chapter-heading', line.slice(technical ? 5 : 4)));
      list = undefined;
      table = undefined;
      continue;
    }
    if (line.startsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
      if (cells.every(cell => /^:?-+:?$/.test(cell))) continue;
      if (!table) {
        const wrapper = element('div', 'table-scroll');
        wrapper.tabIndex = 0;
        table = element('table', 'data-table measure-table');
        const head = element('thead');
        const row = element('tr');
        cells.forEach(cell => {
          const th = element('th');
          th.scope = 'col';
          appendInline(th, cell, axisPage);
          row.append(th);
        });
        head.append(row);
        tableBody = element('tbody');
        table.append(head, tableBody);
        wrapper.append(table);
        container.append(wrapper);
      } else {
        const row = element('tr');
        cells.forEach(cell => {
          const td = element('td');
          appendInline(td, cell, axisPage);
          row.append(td);
        });
        tableBody.append(row);
      }
      continue;
    }
    if (line.startsWith('- ')) {
      if (!list) {
        list = element('ul', 'measure-list');
        container.append(list);
      }
      const item = element('li');
      appendInline(item, line.slice(2), axisPage);
      list.append(item);
    } else {
      list = undefined;
      const paragraph = element('p', 'measure-paragraph');
      appendInline(paragraph, line, axisPage);
      container.append(paragraph);
    }
  }
}

let lastDialogTrigger;
export function openDialog(dialog, trigger) {
  lastDialogTrigger = trigger;
  dialog.showModal();
  document.body.classList.add('dialog-open');
}

export function setupDialogs() {
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      lastDialogTrigger?.focus();
    });
  });
}
