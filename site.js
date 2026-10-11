import { getChapter, getInitiativeActions, getInitiativeActionItems, getChangeVideoMessages } from './program.js?v=20261011-pillars';
import { element, appendMarkdown, openDialog, setupDialogs, replaceArrowIcons } from './ui.js?v=20261011-mobile';
import { legacyTarget } from './routes.js?v=20261011-pillars';

const $ = selector => document.querySelector(selector);
document.querySelectorAll('a, button, .note-icon').forEach(replaceArrowIcons);
const header = $('.site-header');
const navigation = header.querySelector('nav');
navigation.id = 'site-navigation';
const menuToggle = element('button', 'menu-toggle');
menuToggle.type = 'button';
menuToggle.setAttribute('aria-controls', navigation.id);
const menuIcon = element('span', 'menu-toggle-icon');
menuIcon.setAttribute('aria-hidden', 'true');
menuToggle.append(menuIcon, document.createTextNode('Menú'));
function setMenuOpen(open) {
  header.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
setMenuOpen(false);
header.insertBefore(menuToggle, navigation);
header.classList.add('menu-ready');
menuToggle.addEventListener('click', () => setMenuOpen(!header.classList.contains('menu-open')));
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) setMenuOpen(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && header.classList.contains('menu-open')) {
    setMenuOpen(false);
    menuToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) setMenuOpen(false);
});
window.matchMedia('(max-width: 1200px)').addEventListener('change', () => setMenuOpen(false));

const floatingSignup = element('a', 'floating-signup');
floatingSignup.href = './participa.html#participa';
floatingSignup.append(document.createTextNode('Hazte simpatizante'),
  element('span', '', '↗'));
floatingSignup.lastElementChild.setAttribute('aria-hidden', 'true');
floatingSignup.hidden = true;
document.body.append(floatingSignup);
const signupObstacles = [...document.querySelectorAll('main a[href^="https://tally.so/"], video, footer')];
function updateFloatingSignup() {
  const obstructed = signupObstacles.some(node => {
    const rect = node.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0 && rect.height > 0;
  });
  floatingSignup.hidden = window.scrollY < 160 || obstructed || document.body.classList.contains('dialog-open')
    || header.classList.contains('menu-open');
}
const signupObserver = new IntersectionObserver(updateFloatingSignup);
signupObstacles.forEach(node => signupObserver.observe(node));
window.addEventListener('scroll', updateFloatingSignup, { passive: true });
window.addEventListener('resize', updateFloatingSignup);
new MutationObserver(updateFloatingSignup).observe(document.body, { attributes: true, attributeFilter: ['class'] });
new MutationObserver(updateFloatingSignup).observe(header, { attributes: true, attributeFilter: ['class'] });
updateFloatingSignup();

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
        container.append(...actions.map(action => {
          const link = element('a', 'change-preview');
          link.href = `./cambios.html#cambio-${action.id}`;
          link.append(element('span', 'pillar-number pillar-preview-number', String(action.id).padStart(2, '0')),
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
          const list = element('ol', 'pillar-grid');
          for (const action of getInitiativeActionItems(markdown)) {
            const item = element('li', 'pillar-card');
            item.id = `cambio-${action.id}`;
            const heading = element('div', 'pillar-heading');
            heading.append(element('span', 'pillar-number', String(action.id).padStart(2, '0')),
              element('h3', 'pillar-title', action.title));
            const body = element('div', 'pillar-body');
            appendMarkdown(body, action.description, './programa.html');
            item.append(heading, body);
            list.append(item);
          }
          container.querySelector('.measure-list').replaceWith(list);
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
