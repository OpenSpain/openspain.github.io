import { getChapter, getInitiativeActions, getInitiativeActionItems, getChangeVideoMessages } from './program.js?v=20261009-pages';
import { element, appendMarkdown, openDialog, setupDialogs } from './ui.js?v=20261009-pages';
import { legacyTarget } from './routes.js?v=20261009-pages';

const $ = selector => document.querySelector(selector);
if (document.body.dataset.page === 'home') {
  const redirect = () => {
    const target = legacyTarget(location.hash);
    if (target) location.replace(new URL(target, location.href));
  };
  redirect();
  window.addEventListener('hashchange', redirect);
}

const orbitToggle = $('#orbit-toggle');
if (orbitToggle) {
  const heroArt = $('.hero-art');
  heroArt.dataset.orbitMotion = 'running';
  orbitToggle.textContent = 'Pausar animación';
  orbitToggle.hidden = false;
  orbitToggle.addEventListener('click', () => {
    const paused = heroArt.dataset.orbitMotion === 'running';
    heroArt.dataset.orbitMotion = paused ? 'paused' : 'running';
    orbitToggle.textContent = paused ? 'Reanudar animación' : 'Pausar animación';
  });
}

document.querySelectorAll('video').forEach(video => {
  const status = video.closest('figure').querySelector('[data-video-error]');
  const showError = () => {
    console.error('No se pudo cargar o reproducir el vídeo.', video.error);
    status.hidden = false;
  };
  video.addEventListener('error', showError);
  video.querySelectorAll('source').forEach(source => source.addEventListener('error', showError));
  video.addEventListener('loadeddata', () => { status.hidden = true; });
});

setupDialogs();
const form = $('#contribution-form');
if (form) {
  $('#open-contribution').addEventListener('click', event => openDialog($('#contribution-dialog'), event.currentTarget));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    if (['title', 'problem', 'solution', 'evaluation'].some(key => !String(fields.get(key)).trim())) {
      $('#download-status').textContent = 'Completa todos los campos con contenido, no solo espacios.';
      return;
    }
    const text = `# ${String(fields.get('title')).trim()}\n\n> Aportación ciudadana. No enviada ni aprobada por OpenSpain.\n\n## Problema\n\n${String(fields.get('problem')).trim()}\n\n## Propuesta\n\n${String(fields.get('solution')).trim()}\n\n## Evaluación\n\n${String(fields.get('evaluation')).trim()}\n`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
    const link = element('a');
    link.href = url;
    link.download = 'mi-propuesta-openspain.md';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('#download-status').textContent = 'Descarga preparada. Tu propuesta no se ha enviado a ningún servidor.';
  });
}

async function loadPageContent() {
  const containers = [...document.querySelectorAll('[data-program-content]')];
  if (!containers.length) return;
  $('#page-content-error').hidden = true;
  $('#retry-content').disabled = true;
  try {
    const response = await fetch('./PROGRAMA.md', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();
    for (const container of containers) {
      const section = container.dataset.programContent;
      container.replaceChildren();
      if (section === 'highlights') {
        const actions = getInitiativeActionItems(markdown);
        container.append(...[1, 2, 6, 8, 11, 13].map(id => {
          const action = actions.find(item => item.id === id);
          const link = element('a', 'change-preview');
          link.href = `./cambios.html#cambio-${id}`;
          link.append(element('span', 'eyebrow', `CAMBIO ${String(id).padStart(2, '0')}`),
            element('h3', '', action.title), element('span', 'text-link', 'Ver propuesta y garantías ↗'));
          return link;
        }));
      } else if (section === 'video-transcript') {
        for (const message of getChangeVideoMessages(markdown)) {
          const paragraph = element('p');
          paragraph.append(element('strong', '', message.title), document.createTextNode(` ${message.description}`));
          container.append(paragraph);
        }
      } else {
        const content = section === 'actions' ? getInitiativeActions(markdown) : getChapter(markdown, Number(section));
        appendMarkdown(container, content, './programa.html');
        if (section === 'actions') {
          container.querySelectorAll('li').forEach((item, index) => { item.id = `cambio-${index + 1}`; });
        }
      }
    }
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
  } catch (error) {
    console.error('No se pudo cargar el contenido del programa:', error);
    $('#page-content-error p').textContent = `No se pudo cargar el contenido. Reintenta o consulta el documento original. Detalle: ${error instanceof Error ? error.message : String(error)}`;
    $('#page-content-error').hidden = false;
  } finally {
    $('#retry-content').disabled = false;
  }
}
$('#retry-content')?.addEventListener('click', loadPageContent);
loadPageContent();
