import { chromium } from '@playwright/test';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const collections = {
  original: { page: 'comic.html', output: 'exports/', archive: 'OpenSpain-Comic.zip', count: 6 },
  'bolsillo-seguridad': {
    page: 'bolsillo-seguridad.html', output: 'exports-bolsillo-seguridad/',
    archive: 'OpenSpain-Comic-Bolsillo-Seguridad.zip', count: 9,
  },
  'vida-preparada': {
    page: 'vida-preparada.html', output: 'exports-vida-preparada/',
    archive: 'OpenSpain-Comic-Vivienda-Energia-Educacion.zip', count: 11,
  },
};
const args = process.argv.slice(2);
const name = args[0] ?? 'original';
if (args.length > 1 || !Object.hasOwn(collections, name)) {
  throw new Error('Uso: node comic/render.mjs [original|bolsillo-seguridad|vida-preparada]');
}
const config = collections[name];
const output = new URL(config.output, import.meta.url);
const source = new URL(config.page, import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1450 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(source.href);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => image.decode()));
    await Promise.all([...document.querySelectorAll('svg image')].map(node => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = () => reject(new Error(`No se pudo cargar ${node.getAttribute('href')}.`));
      image.src = node.getAttribute('href');
    })));
  });
  if (errors.length) throw new Error(errors.join('\n'));
  const slides = await page.evaluate(() => window.comicSlides);
  const collection = await page.evaluate(() => window.comicCollection);
  if (slides.length !== config.count || new Set(slides.map(slide => slide.id)).size !== config.count) {
    throw new Error(`El carrusel debe contener ${config.count} viñetas con identificadores únicos.`);
  }
  if (collection.id !== name || !collection.caption?.trim()) {
    throw new Error('La colección no coincide con la solicitada o falta su pie de publicación.');
  }
  if (collection.caption.length > 2200) {
    throw new Error('El pie de publicación supera los 2200 caracteres de Instagram.');
  }
  const overflow = await page.evaluate(() => [...document.querySelectorAll('.slide')].flatMap(slide => {
    const issues = [];
    const art = slide.querySelector('.art').getBoundingClientRect();
    const heading = slide.querySelector('.heading').getBoundingClientRect();
    const caption = slide.querySelector('.caption').getBoundingClientRect();
    const footer = slide.querySelector('.slide-footer').getBoundingClientRect();
    if (heading.bottom > art.top - 18) issues.push(`${slide.id}: título sobre la ilustración`);
    if (caption.bottom > footer.top - 18) issues.push(`${slide.id}: texto sobre el pie`);
    for (const node of slide.querySelectorAll('h1 span, .caption, .eyebrow')) {
      if (node.scrollWidth > node.clientWidth + 1) issues.push(`${slide.id}: texto desbordado`);
    }
    for (const bubble of slide.querySelectorAll('.bubble')) {
      const [x, y, width, height] = bubble.dataset.box.split(',').map(Number);
      for (const line of bubble.querySelectorAll('tspan')) {
        const bounds = line.getBBox();
        if (bounds.x < x + 16 || bounds.x + bounds.width > x + width - 16
          || bounds.y < y + 10 || bounds.y + bounds.height > y + height - 10) {
          issues.push(`${slide.id}: bocadillo desbordado: ${line.textContent}`);
        }
      }
    }
    return issues;
  }));
  if (overflow.length) throw new Error(overflow.join('\n'));
  const files = [];
  for (const slide of slides) {
    const filename = `${slide.id}.png`;
    await page.locator(`[id="${slide.id}"]`).screenshot({ path: fileURLToPath(new URL(filename, output)) });
    files.push(filename);
  }
  await writeFile(new URL('pie-de-publicacion.txt', output), collection.caption);
  await writeFile(new URL('textos-alternativos.json', output), `${JSON.stringify(slides.map(slide => ({
    archivo: `${slide.id}.png`, titulo: slide.title.join(' '), textoAlternativo: slide.alt,
  })), null, 2)}\n`);
  const metadata = ['pie-de-publicacion.txt', 'textos-alternativos.json'];
  if (collection.sources?.length) {
    await writeFile(new URL('fuentes.json', output), `${JSON.stringify(collection.sources, null, 2)}\n`);
    metadata.push('fuentes.json');
  }
  const rows = Math.ceil(slides.length / 3);
  const height = Math.max(1020, Math.ceil((rows * 1350 + (rows - 1) * 32) * .36) + 24);
  const preview = await browser.newPage({ viewport: { width: 1200, height }, deviceScaleFactor: 1 });
  await preview.goto(source.href);
  await preview.evaluate(() => document.fonts.ready);
  await preview.addStyleTag({ content: 'body { background:#34343e; } #comic { grid-template-columns:repeat(3,1080px); gap:32px; margin:0; transform:scale(.36); transform-origin:top left; }' });
  await preview.screenshot({ path: fileURLToPath(new URL('vista-general.png', output)) });
  const archive = new URL(config.archive, import.meta.url);
  await rm(archive, { force: true });
  const zipped = spawnSync('zip', ['-q', '-j', fileURLToPath(archive),
    ...[...files, ...metadata].map(file => fileURLToPath(new URL(file, output)))],
  { encoding: 'utf8' });
  if (zipped.error) throw zipped.error;
  if (zipped.status !== 0) throw new Error(zipped.stderr || 'No se pudo crear el ZIP.');
  console.log(`Carrusel generado: ${slides.length} PNG de 1080 × 1350, vista general, descripción y textos alternativos.\n${fileURLToPath(archive)}`);
} finally {
  await browser.close();
}
