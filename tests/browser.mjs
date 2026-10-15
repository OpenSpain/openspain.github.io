import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { parseProgram, inlineParts, getInitiativeActionItems, getChangeVideoMessages } from '../program.js';
import { pages, legacyTarget } from '../routes.js';
import { observedCharts } from '../charts.js';

const baseURL = (process.env.BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const screenshotDir = process.env.SCREENSHOT_DIR || 'test-results';
await mkdir(screenshotDir, { recursive: true });
const markdown = await readFile(new URL('../PROGRAMA.md', import.meta.url), 'utf8');
const axes = parseProgram(markdown);
const plain = text => inlineParts(text).map(part => part.text).join('');
async function assertReadableText(locator) {
  const measurements = await locator.evaluateAll(nodes => nodes.filter(node => node.getBoundingClientRect().width > 0).map(node => {
    const style = getComputedStyle(node);
    const context = document.createElement('canvas').getContext('2d');
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    return {
      text: node.textContent.slice(0, 80),
      fontSize: parseFloat(style.fontSize),
      lineHeight: parseFloat(style.lineHeight),
      color: style.color,
      width: node.getBoundingClientRect().width,
      readingWidth: context.measureText('0').width * 68,
    };
  }));
  assert.ok(measurements.length > 0, 'The page must expose readable body text');
  for (const measurement of measurements) {
    assert.ok(measurement.fontSize >= 17, `${measurement.text}: body text must be at least 17px`);
    assert.ok(measurement.lineHeight >= measurement.fontSize * 1.7, `${measurement.text}: body text needs comfortable line spacing`);
    assert.equal(measurement.color, 'rgb(245, 245, 247)', `${measurement.text}: body text must be white, not grey`);
    assert.ok(measurement.width <= measurement.readingWidth + 1, `${measurement.text}: reading line exceeds 68ch`);
  }
}

async function assertTextContrast(locator, minimum = 4.5) {
  const ratio = await locator.evaluate(node => {
    const channels = color => color.match(/[\d.]+/g).map(Number);
    const composite = (foreground, background) => {
      const alpha = foreground[3] ?? 1;
      return foreground.slice(0, 3).map((value, index) => value * alpha + background[index] * (1 - alpha));
    };
    const ancestors = [];
    for (let current = node; current; current = current.parentElement) ancestors.unshift(current);
    let background = [255, 255, 255];
    for (const ancestor of ancestors) background = composite(channels(getComputedStyle(ancestor).backgroundColor), background);
    const foreground = composite(channels(getComputedStyle(node).color), background);
    const luminance = color => color.map(value => {
      const channel = value / 255;
      return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
    }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (values[0] + .05) / (values[1] + .05);
  });
  assert.ok(ratio >= minimum, `${await locator.textContent()}: text contrast ${ratio.toFixed(2)} must be at least ${minimum}`);
}
const browser = await chromium.launch();
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const videoRequests = [];
  const signupRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', request => {
    if (request.url().includes('.mp4')) videoRequests.push(request.url());
    if (new URL(request.url()).hostname === 'tally.so') signupRequests.push(request.url());
  });
  await page.goto(baseURL);
  await page.waitForSelector('.change-preview');
  assert.equal(await page.title(), 'OpenSpain — Abrir España. Ampliar oportunidades.');
  assert.equal(await page.locator('.change-preview').count(), 8);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.evaluate(() => document.fonts.check('800 24px Manrope')), true);
  assert.equal(await page.evaluate(() => [...document.fonts].find(font => font.family === 'Manrope')?.status), 'loaded');
  assert.match(await page.locator('body').evaluate(node => getComputedStyle(node).fontFamily), /Manrope/);
  assert.equal(await page.locator('.hero').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(24, 24, 30)');
  assert.equal(await page.locator('body').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(16, 16, 20)');
  assert.equal(await page.locator('.manifesto').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(32, 32, 38)');
  assert.equal(await page.locator('footer').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(9, 9, 12)');
  assert.equal(await page.locator('.highlights-section').evaluate(node => getComputedStyle(node).backgroundColor), 'rgba(0, 0, 0, 0)');
  assert.equal(await page.locator('.home-video-section').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(24, 24, 30)');
  assert.equal(await page.locator('.change-preview').first().evaluate(node => getComputedStyle(node).borderRadius), '12px');
  assert.equal(await page.locator('html').evaluate(node => getComputedStyle(node).colorScheme), 'dark');
  for (const selector of ['.hero .button-dark', '.site-header .nav-action', '.manifesto > .button', '.floating-signup']) {
    assert.equal(await page.locator(selector).first().evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(198, 243, 107)');
    await assertTextContrast(page.locator(selector).first());
  }
  for (const selector of ['.hero h1 > span', '.pillar-preview-number', 'nav a[aria-current="page"]']) {
    assert.equal(await page.locator(selector).first().evaluate(node => getComputedStyle(node).color), 'rgb(198, 243, 107)');
    await assertTextContrast(page.locator(selector).first());
  }
  assert.equal(await page.locator('.change-previews').evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length), 4);
  for (const selector of ['.hero-description', '.hero h1 > span', '.hero .eyebrow', '.hero .button-dark', '.hero .button-accent',
    '.preview-description', '.change-preview h3', '.preview-copy > .text-link', '.footer-bottom', '.site-header .nav-action',
    '.manifesto h2 > span', '.manifesto > .button', '.manifesto .eyebrow', '.manifesto-copy > p:not(.eyebrow)']) {
    await assertTextContrast(page.locator(selector).first());
  }
  for (const [index, message] of getChangeVideoMessages(markdown).entries()) {
    const preview = page.locator('.change-preview').nth(index);
    assert.equal(await preview.locator('h3').textContent(), message.title);
    assert.equal(await preview.locator('.preview-description').textContent(), message.description);
    assert.equal(await preview.getAttribute('href'), `./cambios.html#cambio-${message.id}`);
    assert.equal(await preview.locator('.pillar-number').textContent(), String(message.id).padStart(2, '0'));
  }
  assert.equal(await page.locator('.hero-brand-symbol').count(), 0);
  assert.equal(await page.locator('.hero-art .sun, .hero-art .orbit').count(), 3);
  assert.equal(await page.locator('#actualizaciones .update-list > li').count(), 2);
  assert.equal(await page.locator('.update-stamp time').getAttribute('datetime'), '2026-10-11');
  assert.equal(await page.locator('#actualizaciones a').first().getAttribute('href'), './transparencia.html#valores');
  assert.match(await page.locator('.manifesto h2').textContent(), /Menos «y tú más».*Más responsabilidad/);
  assert.equal(await page.locator('.manifesto h2 br').count(), 0);
  assert.ok(await page.locator('.manifesto h2').evaluate(node =>
    node.getBoundingClientRect().height <= parseFloat(getComputedStyle(node).lineHeight) + 1));
  assert.equal(await page.locator('.manifesto > a').getAttribute('href'), './como.html');
  assert.ok(await page.locator('.manifesto').evaluate(node => node.getBoundingClientRect().height) <= 300);
  assert.ok(await page.locator('footer').evaluate(node => node.getBoundingClientRect().height) <= 240);
  assert.equal(await page.locator('.program-card').count(), 0, 'The homepage must not contain the full programme');
  const faqs = page.locator('#preguntas-frecuentes details');
  assert.equal(await faqs.count(), 4);
  for (const faq of await faqs.all()) {
    assert.equal(await faq.evaluate(node => node.open), false);
    await faq.locator('summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await faq.evaluate(node => node.open), true);
    assert.equal(await faq.locator('p').first().isVisible(), true);
    await page.keyboard.press('Enter');
    assert.equal(await faq.evaluate(node => node.open), false);
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const satelliteStyle = property => page.locator('.orbit-one').evaluate((node, key) =>
    getComputedStyle(node, '::after')[key], property);
  assert.equal(await satelliteStyle('animationName'), 'satellite-orbit');
  assert.equal(await page.locator('#orbit-toggle').textContent(), '');
  assert.equal(await page.locator('#orbit-toggle').evaluate(node => getComputedStyle(node).backgroundColor), 'rgba(0, 0, 0, 0)');
  await page.getByRole('button', { name: 'Pausar animación', exact: true }).click();
  assert.equal(await satelliteStyle('animationPlayState'), 'paused');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.locator('#orbit-toggle').evaluate(node => node === document.activeElement), true);
  assert.equal(await page.locator('#orbit-toggle').evaluate(node => getComputedStyle(node).outlineStyle), 'solid');
  await page.keyboard.press('Enter');
  assert.equal(await satelliteStyle('animationPlayState'), 'running');
  await page.locator('.hero .button').first().focus();
  assert.equal(await page.locator('.hero .button').first().evaluate(node => getComputedStyle(node).outlineStyle), 'solid');
  await page.locator('.change-preview').first().hover();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.change-preview')).borderTopColor === 'rgb(198, 243, 107)');
  assert.equal(await page.locator('.change-preview').first().evaluate(node => getComputedStyle(node).borderTopColor), 'rgb(198, 243, 107)');
  assert.equal(await page.locator('.change-preview h3').first().evaluate(node => getComputedStyle(node).color), 'rgb(245, 245, 247)');
  await page.mouse.move(0, 0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.change-preview').first().evaluate(node => getComputedStyle(node).transitionDuration), '0s');
  assert.equal(await satelliteStyle('animationName'), 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  assert.deepEqual(videoRequests, []);
  await page.screenshot({ path: join(screenshotDir, 'openspain-desktop.png'), fullPage: true });
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('body').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(255, 255, 255)');
  assert.equal(await page.locator('body').evaluate(node => getComputedStyle(node).color), 'rgb(17, 19, 24)');
  await page.emulateMedia({ media: 'screen' });

  await page.goto(`${baseURL}/cambios.html`);
  await page.waitForSelector('#cambio-8');
  assert.equal(await page.locator('.actions-content li').count(), 8);
  assert.equal(await page.locator('video').count(), 0, 'Changes should not duplicate the homepage video');
  assert.ok(await page.locator('.changes-intro').evaluate(node => node.getBoundingClientRect().height) <= 300);
  const introToPillarsGap = await page.evaluate(() => document.querySelector('.actions-content').getBoundingClientRect().top
    - document.querySelector('.changes-intro').getBoundingClientRect().bottom);
  assert.ok(introToPillarsGap >= 0 && introToPillarsGap <= 40, `Gap before pillars: ${introToPillarsGap}px`);
  assert.equal(await page.locator('#prioridades details').getAttribute('open'), '');
  assert.equal(await page.locator('#priorities-title').evaluate(node => getComputedStyle(node).fontWeight), '700');
  assert.equal(await page.locator('#prioridades summary').evaluate(node => getComputedStyle(node).fontWeight), '800');
  assert.equal(await page.locator('#priorities-content').isVisible(), true);
  assert.equal(await page.locator('.content-error').evaluate(node => node.getBoundingClientRect().height), 0);
  const prioritiesGap = await page.evaluate(() => document.querySelector('#priorities-title').getBoundingClientRect().top
    - document.querySelector('.actions-content').getBoundingClientRect().bottom);
  assert.ok(prioritiesGap >= 0 && prioritiesGap <= 96, `Gap before priorities: ${prioritiesGap}px`);
  for (const action of getInitiativeActionItems(markdown)) {
    const card = page.locator(`#cambio-${action.id}`);
    assert.equal(await card.locator('.pillar-number').textContent(), String(action.id).padStart(2, '0'));
    assert.equal(await card.locator('.pillar-title').textContent(), action.title);
    assert.equal(await card.locator('.pillar-body').textContent(), plain(action.description));
  }
  assert.match(await page.locator('#cambio-6').textContent(), /no se adopta una abolición general/);
  assert.equal(await page.locator('#priorities-content tbody tr').count(), 8);
  assert.match(await page.locator('#priorities-content').textContent(), /Por dónde empezar/);
  assert.match(await page.locator('#priorities-content').textContent(), /qué hemos hecho, qué nos ha frenado y cuánto hemos gastado/);
  assert.doesNotMatch(await page.locator('#priorities-content').textContent(), /fichas y entregas verificadas|criterio de aceptación/);
  assert.equal(await page.locator('#cambio-1 a').first().getAttribute('href'), './programa.html#eje-1');
  assert.equal(await page.locator('#cambio-1 a').first().getAttribute('target'), null);

  async function checkVideo(selector, expectedDuration, ratio) {
    const video = page.locator(selector);
    assert.equal(await video.getAttribute('preload'), 'none');
    assert.equal(await video.getAttribute('autoplay'), null);
    assert.equal(await video.getAttribute('loop'), null);
    assert.equal(await video.getAttribute('controls'), '');
    assert.equal(await video.getAttribute('playsinline'), '');
    assert.equal(await video.evaluate(node => node.paused), true);
    const poster = await page.request.get(new URL(await video.getAttribute('poster'), page.url()).href);
    assert.equal(poster.status(), 200);
    assert.match(poster.headers()['content-type'], /image\/jpeg/);
    assert.equal(await video.locator('track').count(), 0);
    const videoURL = new URL(await video.locator('source').getAttribute('src'), page.url()).href;
    const head = await page.request.head(videoURL);
    assert.equal(head.status(), 200);
    assert.equal(head.headers()['accept-ranges'], 'bytes');
    const range = await page.request.get(videoURL, { headers: { Range: 'bytes=0-15' } });
    assert.equal(range.status(), 206);
    assert.match(range.headers()['content-range'], /^bytes 0-15\/\d+$/);
    assert.equal((await range.body()).length, 16);
    assert.equal((await range.body()).subarray(4, 8).toString(), 'ftyp');
    const invalid = await page.request.get(videoURL, { headers: { Range: 'bytes=999999999999-' } });
    assert.equal(invalid.status(), 416);
    await video.scrollIntoViewIfNeeded();
    await video.evaluate(node => node.play());
    await page.waitForFunction(selector => document.querySelector(selector).currentTime > 0.2, selector);
    assert.equal(await video.evaluate(node => node.textTracks.length), 0);
    assert.ok(Math.abs(await video.evaluate(node => node.duration) - expectedDuration) < 0.1);
    assert.ok(Math.abs(await video.evaluate(node => node.videoWidth / node.videoHeight) - ratio) < 0.01);
    await video.evaluate(node => new Promise(resolve => {
      node.pause();
      node.requestVideoFrameCallback(() => resolve());
      node.currentTime = 25;
    }));
    await page.waitForFunction(selector => {
      const node = document.querySelector(selector);
      return !node.seeking && node.readyState >= 2 && Math.abs(node.currentTime - 25) < 0.1;
    }, selector);
    const pixels = await video.evaluate(node => {
      const canvas = document.createElement('canvas');
      canvas.width = node.videoWidth;
      canvas.height = node.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(node, 0, 0);
      return [context.getImageData(1, 1, 1, 1).data.slice(0, 3),
        context.getImageData(1, node.videoHeight - 2, 1, 1).data.slice(0, 3)].map(pixel => [...pixel]);
    });
    for (const [index, expected] of [[16, 16, 20], [198, 243, 107]].entries()) {
      assert.ok(pixels[index].every((value, channel) => Math.abs(value - expected[channel]) <= 8),
        `${selector}: encoded video must have the dark background and lime progress bar`);
    }
    assert.equal(await video.locator('xpath=..').locator('[data-video-error]').isVisible(), false);
  }
  assert.deepEqual(videoRequests, [], 'No MP4 should load before voluntary playback');
  await page.goto(baseURL);
  await checkVideo('#changes-video', 60, 16 / 9);
  await page.getByText('Leer el contenido del vídeo', { exact: true }).click();
  assert.equal(await page.locator('[data-program-content="video-transcript"] p').count(), 8);
  for (const message of getChangeVideoMessages(markdown)) {
    assert.ok((await page.locator('.video-transcript').textContent()).includes(`${message.title} ${message.description}`));
  }

  await page.goto(`${baseURL}/programa.html`);
  await page.waitForSelector('.program-card');
  assert.ok(await page.locator('.compact-intro').evaluate(node => node.getBoundingClientRect().height) <= 320);
  assert.equal(await page.locator('.compact-intro a[download]').count(), 2);
  assert.equal(await page.locator('.program-card').count(), axes.length);
  assert.ok(await page.locator('.card-index').first().evaluate(node => parseFloat(getComputedStyle(node).fontSize)) >= 52);
  assert.equal(await page.locator('.filter-button[aria-pressed="true"]').evaluate(node => getComputedStyle(node).backgroundColor),
    await page.locator('.card-index').first().evaluate(node => getComputedStyle(node).color));
  await assertTextContrast(page.locator('.filter-button[aria-pressed="true"]'));
  await assertTextContrast(page.locator('.filter-button[aria-pressed="false"]').first());
  assert.equal(await page.locator('.card-index').first().evaluate(node => getComputedStyle(node).color), 'rgb(198, 243, 107)');
  await assertTextContrast(page.locator('.card-index').first());
  assert.equal(await page.locator('#citizen-demands-content li').count(), 10);
  assert.equal(await page.locator('#program-title > span').textContent(), 'programa.');
  assert.equal(await page.locator('#evidence-title > span').textContent(), 'límites.');
  await page.locator('#exigencias > summary').click();
  const demandHeadings = page.locator('#citizen-demands-content .measure-list > li > strong:first-child');
  assert.equal(await demandHeadings.count(), 10);
  for (const heading of await demandHeadings.all()) {
    assert.equal(await heading.evaluate(node => getComputedStyle(node).color), 'rgb(198, 243, 107)');
    await assertTextContrast(heading);
  }
  await page.locator('#exigencias > summary').click();
  await page.locator('#seguridad-ciudadana > summary').click();
  assert.equal(await page.locator('#development-content li').count(), 7);
  assert.match(await page.locator('#development-content').textContent(), /ni activa un cuarto frente inicial/);
  assert.match(await page.locator('#development-content').textContent(), /No hay aumento de plantilla, presupuesto ni despliegue aprobados/);
  assert.match(await page.locator('#development-content').textContent(), /presunción de inocencia/);
  await page.locator('#seguridad-ciudadana > summary').click();
  for (const axis of axes) {
    await page.locator(`#eje-${axis.id}`).getByRole('button').click();
    const summary = page.locator('#measure-content .citizen-summary');
    assert.deepEqual(await summary.locator('p').allTextContents(), axis.citizenSummary.split('\n\n')
      .filter(text => !text.startsWith('#### ')).map(plain));
    assert.equal(await summary.locator('h4').textContent(), 'Plan de actuación');
    for (const heading of await page.locator('#measure-content .technical-heading').all()) {
      assert.equal(await heading.evaluate(node => getComputedStyle(node).color), 'rgb(198, 243, 107)');
      await assertTextContrast(heading);
    }
    assert.deepEqual(await page.locator('#measure-content .technical-content p').allTextContents(),
      axis.technicalBody.split('\n\n').filter(text => !text.startsWith('- ') && !text.startsWith('|') && !text.startsWith('#### ')).map(plain));
    assert.deepEqual(await page.locator('#measure-content .technical-content h4').allTextContents(),
      axis.technicalBody.split('\n\n').filter(text => text.startsWith('#### ')).map(text => plain(text.slice(5))));
    if ([6, 16, 30].includes(axis.id)) {
      assert.equal(await page.locator('#measure-content .technical-content table tbody tr').count(), { 6: 6, 16: 3, 30: 11 }[axis.id]);
      await page.setViewportSize({ width: 320, height: 900 });
      await assertReadableText(page.locator('#measure-content .measure-paragraph, #measure-content .measure-list > li'));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.ok(await page.locator('#measure-dialog').evaluate(node => node.scrollWidth <= node.clientWidth));
      await page.setViewportSize({ width: 1440, height: 1000 });
    }
    const measures = await page.locator('#measure-content .technical-content li').allTextContents();
    for (const measure of axis.measures) assert.ok(measures.includes(plain(measure)));
    assert.equal(await page.locator('#measure-content .target-figure').count(), 1);
    assert.equal(await page.locator('#measure-content .target-bar').first().evaluate(node => getComputedStyle(node).fill), 'rgb(143, 149, 163)');
    assert.equal(await page.locator('#measure-content .target-figure').evaluate(node => getComputedStyle(node).borderLeftStyle), 'dashed');
    if (axis.id === 1) {
      for (const selector of ['#measure-title', '.citizen-summary .measure-paragraph', '.evidence-label', '.target-figure .evidence-label',
        '.technical-content .measure-paragraph', '.close-dialog']) await assertTextContrast(page.locator(selector).first());
    }
    assert.equal(await page.locator('#measure-content').evaluate(content => {
      const summary = content.querySelector('.citizen-summary');
      const evidence = content.querySelector('.policy-evidence');
      const technical = content.querySelector('.technical-content');
      return Boolean(summary.compareDocumentPosition(evidence) & Node.DOCUMENT_POSITION_FOLLOWING)
        && Boolean(evidence.compareDocumentPosition(technical) & Node.DOCUMENT_POSITION_FOLLOWING);
    }), true);
    await page.keyboard.press('Escape');
  }
  await page.getByRole('searchbox').fill('mentira deliberada');
  assert.equal(await page.locator('#eje-1').count(), 1);
  await page.getByRole('searchbox').fill('zzzzzzzz');
  assert.equal(await page.locator('#empty-state').isVisible(), true);
  await page.getByRole('button', { name: 'Ver todo el programa', exact: true }).click();
  await page.getByRole('button', { name: 'El siguiente salto', exact: true }).click();
  assert.ok(await page.locator('.program-card').count() < axes.length);
  await page.getByRole('button', { name: 'Todo el programa', exact: true }).click();
  await page.locator('[data-year="2025"]').click();
  assert.equal(await page.locator('#ipc-table tbody tr').count(), 12);
  await page.locator('[data-year="2026"]').click();
  assert.equal(await page.locator('#ipc-table tbody tr').count(), 8);
  await page.locator('#toggle-data').click();
  assert.equal(await page.locator('#ipc-table').isVisible(), true);
  assert.equal(await page.locator('.coverage-row').count(), 4);
  assert.equal(await page.locator('#axis-data-content > details').count(), axes.length);
  assert.ok(await page.locator('#sources-content a[href^="https://"]').count() >= 18);

  await page.goto(`${baseURL}/como.html`);
  await page.waitForFunction(() => document.querySelector('#plan-content')?.textContent.includes('H04'));
  assert.match(await page.locator('#plan-content').textContent(), /Si solo cabe uno/);
  assert.match(await page.locator('#method-content').textContent(), /Un seguimiento que no confunda actividad con resultados/);
  assert.match(await page.locator('#method-content').textContent(), /cauce 167 o 168, mayorías y referéndum/);
  await page.goto(`${baseURL}/transparencia.html`);
  await page.waitForFunction(() => document.querySelector('[data-program-content="6"]')?.textContent.includes('Alejandro'));
  assert.equal(await page.title(), 'Valores y transparencia — OpenSpain');
  assert.equal(await page.locator('#valores .measure-list > li').count(), 10);
  assert.equal(await page.locator('#compromisos .measure-list > li').count(), 6);
  const transparencyAccents = page.locator('#values-title > span, #commitments-title > span, .values-content .measure-list > li > strong:first-child, #compromisos .measure-list > li > strong:first-child, .founder-identity .eyebrow, .donation-principles article > span, #compromisos > .text-link');
  assert.equal(await transparencyAccents.count(), 24);
  for (const accent of await transparencyAccents.all()) {
    assert.equal(await accent.evaluate(node => getComputedStyle(node).color), 'rgb(198, 243, 107)');
    await assertTextContrast(accent);
  }
  assert.match(await page.locator('#valores').textContent(), /comprender las causas/);
  assert.match(await page.locator('#valores').textContent(), /remuneración justa/);
  assert.match(await page.locator('#valores').textContent(), /éxito económico legítimo y el trabajo honesto/);
  assert.match(await page.locator('#valores').textContent(), /Cuidado y generosidad/);
  assert.match(await page.locator('#valores').textContent(), /libertad de cambiar de opinión/);
  assert.match(await page.locator('#valores').textContent(), /preparar relevos: servir es una responsabilidad temporal/);
  assert.match(await page.locator('#compromisos').textContent(), /Decidir con atención y actuar con constancia/);
  assert.match(await page.locator('#valores').textContent(), /Pensar distinto\. Trabajar juntos\./);
  assert.match(await page.locator('#compromisos').textContent(), /No afirmamos que existan ya registros/);
  assert.ok(await page.locator('#valores').evaluate(node => node.compareDocumentPosition(document.querySelector('#compromisos')) & Node.DOCUMENT_POSITION_FOLLOWING));
  assert.ok(await page.locator('#compromisos').evaluate(node => node.compareDocumentPosition(document.querySelector('#transparencia')) & Node.DOCUMENT_POSITION_FOLLOWING));
  assert.match(await page.locator('#registro-donaciones').textContent(), /no está habilitado|No es un servicio de pagos/);
  assert.equal(await page.locator('a[href*="paypal"], a[href*="stripe"]').count(), 0);
  assert.match(await page.locator('#fabio-franco').textContent(), /COIMPULSOR DE OPENSPAIN.*Fabio Franco.*Español · Policía Municipal de Madrid · Geólogo/);
  assert.equal(await page.locator('#fabio-franco img').count(), 1);
  assert.match(await page.locator('.founder-section').textContent(), /Conocer la calle\. Escuchar al ciudadano\./);
  const profileHeadings = page.locator('.founder-message > h3');
  assert.equal(await profileHeadings.count(), 2);
  assert.equal(await profileHeadings.first().textContent(), 'Escuchar. Proponer. Construir.');
  const headingStyle = node => {
    const style = getComputedStyle(node);
    return [style.fontSize, style.fontWeight, style.lineHeight, style.letterSpacing];
  };
  assert.deepEqual(await profileHeadings.first().evaluate(headingStyle), await profileHeadings.last().evaluate(headingStyle));
  assert.equal(await profileHeadings.first().evaluate(node => getComputedStyle(node).fontWeight), '800');
  assert.equal(await page.locator('.founder-message h2, .founder-message h3 br').count(), 0);
  assert.doesNotMatch(await page.locator('.founder-message').first().textContent(), /No se afirma respaldo institucional|liderazgo inicial/);
  assert.match(await page.locator('[data-program-content="6"]').textContent(), /no implica respaldo institucional|liderazgo inicial/);
  assert.match(await page.locator('[data-program-content="6"]').textContent(), /Fabio Franco/);

  await page.goto(`${baseURL}/participa.html`);
  const signup = page.getByRole('link', { name: /Hazte simpatizante/ });
  assert.equal(await signup.getAttribute('href'), 'https://tally.so/r/D4lvRN');
  assert.equal(await signup.getAttribute('target'), '_blank');
  assert.equal(await signup.getAttribute('rel'), 'noopener noreferrer');
  const endorsement = page.locator('#avales a');
  assert.equal(await endorsement.getAttribute('href'), 'https://tally.so/r/D4lvRN');
  assert.equal(await endorsement.getAttribute('target'), '_blank');
  assert.equal(await endorsement.getAttribute('rel'), 'noopener noreferrer');
  assert.match(await endorsement.getAttribute('aria-describedby'), /endorsement-disclaimer/);
  assert.match(await page.locator('#avales').textContent(), /Aún no hay una recogida de avales abierta/);
  assert.match(await page.locator('#endorsement-disclaimer').textContent(), /No estás firmando un aval ni comprometiéndote a avalar/);
  await assertTextContrast(endorsement);
  assert.match(await page.locator('#participa').textContent(), /no es una afiliación/);
  await checkVideo('#sympathizer-video', 44.8, 9 / 16);
  await page.getByRole('button', { name: /Prepara tu propuesta/ }).click();
  for (const [name, value] of Object.entries({ title: 'Prueba ciudadana', problem: 'Un problema concreto', solution: 'Una solución revisable', evaluation: 'Indicador verificable' })) {
    await page.locator(`[name="${name}"]`).fill(value);
  }
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Descargar mi propuesta/ }).click();
  assert.equal((await downloadPromise).suggestedFilename(), 'mi-propuesta-openspain.md');
  await page.getByRole('button', { name: 'Cerrar formulario de propuesta' }).click();

  for (const [path] of pages) {
    await page.goto(`${baseURL}/${path}`);
    if (path === 'como.html') {
      assert.equal(await page.locator('#metodo details[open], #plan details[open]').count(), 2);
      await page.waitForSelector('#method-content > p');
      await page.waitForSelector('#plan-content > .chapter-heading');
      assert.equal(await page.locator('#plan-title > span').textContent(), 'tres frentes.');
      const methodAccents = page.locator('.method-grid h3, #method-content > .chapter-heading, #plan-content > .chapter-heading');
      assert.ok(await methodAccents.count() > 4, 'Method steps and source headings must expose lime accents');
      for (const heading of await methodAccents.all()) {
        assert.equal(await heading.evaluate(node => getComputedStyle(node).color), 'rgb(198, 243, 107)');
        await assertTextContrast(heading);
      }
      const methodToPlanGap = await page.evaluate(() => document.querySelector('#plan-title').getBoundingClientRect().top
        - document.querySelector('#method-content').getBoundingClientRect().bottom);
      assert.ok(methodToPlanGap >= 0 && methodToPlanGap <= 96, `Gap before plan: ${methodToPlanGap}px`);
    }
    const instagram = page.locator('footer .footer-socials a');
    assert.equal(await page.locator('.site-header nav a[href="./transparencia.html"]').textContent(), 'Valores');
    assert.equal(await page.locator('.site-header > .brand').textContent(), 'openspain.');
    assert.equal(await page.locator('.site-header > .brand img').count(), 1);
    assert.equal(await page.locator('.site-header .brand-symbol').getAttribute('src'), './favicon.svg?v=20261011-wordmark');
    assert.equal(await page.locator('.site-header .brand-symbol').getAttribute('alt'), '');
    assert.equal(await page.locator('.site-header > .brand').getAttribute('aria-label'), 'OpenSpain, inicio');
    const subtitle = page.locator('main .section-subtitle, main .section-heading > p').first();
    assert.equal(await subtitle.evaluate(node => getComputedStyle(node).fontWeight), '600');
    await assertTextContrast(subtitle);
    await assertTextContrast(page.locator('.site-header .nav-action'));
    for (const emphasis of await page.locator('main h2 > span').all()) {
      assert.equal(await emphasis.evaluate(node => getComputedStyle(node).color), 'rgb(198, 243, 107)');
      await assertTextContrast(emphasis);
    }
    for (const action of await page.locator('main .text-link, .card-link, .quiet-button, .method-grid article > span, #open-contribution, #frontier-action').all()) {
      assert.equal(await action.evaluate(node => getComputedStyle(node).color), 'rgb(198, 243, 107)');
      await assertTextContrast(action);
    }
    assert.equal(await instagram.count(), 1);
    assert.equal(await instagram.getAttribute('href'), 'https://www.instagram.com/openspainorg/');
    assert.equal(await instagram.getAttribute('target'), '_blank');
    assert.equal(await instagram.getAttribute('rel'), 'noopener noreferrer');
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await assertReadableText(page.locator('main .hero-description, main .page-lead, main .section-subtitle, main .section-heading > p, main .preview-description, main .card-description, main .measure-paragraph, main .measure-list > li, main .method-grid p, main .donation-principles p, main .founder-message > p, main .founder-identity p:not(.eyebrow), main .participate p:not(.eyebrow), main .update-list p, main .manifesto-copy > p:not(.eyebrow), main .video-transcript > p'));
      if (path === 'como.html') {
        const steps = await page.locator('.method-grid article').evaluateAll(articles => articles.map(article => ({
          number: parseFloat(getComputedStyle(article.querySelector('span')).fontSize),
          title: parseFloat(getComputedStyle(article.querySelector('h3')).fontSize),
          body: parseFloat(getComputedStyle(article.querySelector('p')).fontSize),
        })));
        assert.equal(steps.length, 4);
        for (const step of steps) assert.deepEqual(step, width <= 560
          ? { number: 28, title: 24, body: 18 }
          : { number: 32, title: 26, body: 20 });
        assert.equal(await page.locator('.method-grid').evaluate(grid =>
          getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length), width <= 560 ? 1 : 2);
      }
      if (path === 'transparencia.html') {
        const valuesGap = await page.evaluate(() => document.querySelector('#valores').getBoundingClientRect().top
          - document.querySelector('.page-intro').getBoundingClientRect().bottom);
        assert.ok(valuesGap >= 24 && valuesGap <= 32, `Gap before values at ${width}px: ${valuesGap}px`);
        const commitments = await page.locator('#compromisos .measure-list').evaluate(list => {
          const bounds = list.getBoundingClientRect();
          const first = list.firstElementChild.getBoundingClientRect();
          const second = list.children[1].getBoundingClientRect();
          const last = list.lastElementChild.getBoundingClientRect();
          return {
            columns: getComputedStyle(list).gridTemplateColumns.trim().split(/\s+/).length,
            width: bounds.width,
            availableWidth: list.parentElement.getBoundingClientRect().width,
            firstTop: first.top,
            secondTop: second.top,
            rightGap: bounds.right - last.right,
          };
        });
        assert.equal(commitments.columns, width > 800 ? 2 : 1, `Commitment columns at ${width}px`);
        assert.ok(Math.abs(commitments.width - commitments.availableWidth) < 1, 'Commitments must use the available width');
        assert.ok(Math.abs(commitments.rightGap) < 1, 'The last commitment must fill the right column');
        if (width > 800) assert.ok(Math.abs(commitments.firstTop - commitments.secondTop) < 1, 'Desktop commitments must start side by side');
      }
      assert.equal(await page.locator('.site-header nav a').count(), 6);
      const menu = page.locator('.menu-toggle');
      if (width <= 1200) {
        await menu.waitFor({ state: 'visible' });
        const brandBounds = await page.locator('.site-header > .brand').boundingBox();
        const menuBounds = await menu.boundingBox();
        assert.ok(brandBounds.x + brandBounds.width < menuBounds.x, 'Logo and menu must fit on the same row');
        assert.ok(Math.abs(brandBounds.y + brandBounds.height / 2 - menuBounds.y - menuBounds.height / 2) <= 1);
        assert.equal(await menu.getAttribute('aria-expanded'), 'false');
        assert.equal(await page.locator('.site-header nav').isVisible(), false);
        await menu.click();
        assert.equal(await menu.getAttribute('aria-expanded'), 'true');
      } else {
        assert.equal(await menu.isVisible(), false);
      }
      for (const link of await page.locator('.site-header nav a').all()) assert.equal(await link.isVisible(), true);
      assert.equal(await page.locator('.site-header .nav-action svg.direction-icon').count(), 1);
      assert.doesNotMatch(await page.locator('.site-header nav').textContent(), /↗/);
      if (width <= 1200) {
        await page.keyboard.press('Escape');
        assert.equal(await menu.getAttribute('aria-expanded'), 'false');
        assert.equal(await page.locator('.site-header nav').isVisible(), false);
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path}: overflow at ${width}px`);
      const video = page.locator('video');
      if (await video.count()) {
        const expected = path === 'participa.html' ? 9 / 16 : 16 / 9;
        assert.ok(await video.evaluate((node, expected) => {
          const rect = node.getBoundingClientRect();
          return Math.abs(rect.width / rect.height - expected) < 0.01;
        }, expected), `${path}: video ratio at ${width}px`);
      }
    }
    assert.equal(await page.locator('[aria-current="page"]').count(), 1);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL);
  await page.waitForSelector('.change-preview');
  assert.equal(await page.locator('.change-previews').evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length), 1);
  await page.screenshot({ path: join(screenshotDir, 'openspain-mobile.png'), fullPage: true });
  for (const hash of ['#eje-31', '#programa', '#datos', '#exigencias', '#diagnostico', '#prioridades', '#plan', '#metodo', '#donaciones', '#participa']) {
    await page.goto(`${baseURL}/${hash}`);
    await page.waitForURL(`**/${legacyTarget(hash)}`);
    if (hash === '#eje-31') {
      await page.waitForSelector('#eje-31');
      assert.equal(await page.locator('.program-card').count(), axes.length);
    }
  }

  const failurePage = await browser.newPage();
  await failurePage.route('**/PROGRAMA.md', route => route.fulfill({ status: 500, body: 'Error' }));
  await failurePage.goto(`${baseURL}/programa.html`);
  await failurePage.locator('#program-error').waitFor({ state: 'visible' });
  assert.match(await failurePage.locator('#program-error').textContent(), /Detalle: HTTP 500/);
  await failurePage.unroute('**/PROGRAMA.md');
  await failurePage.locator('#retry-program').click();
  await failurePage.waitForSelector('.program-card');
  await failurePage.route('**/PROGRAMA.md', route => route.fulfill({ status: 500, body: 'Error' }));
  await failurePage.goto(`${baseURL}/cambios.html`);
  await failurePage.locator('#page-content-error').waitFor({ state: 'visible' });
  await failurePage.unroute('**/PROGRAMA.md');
  await failurePage.locator('#retry-content').click();
  await failurePage.waitForSelector('#cambio-8');
  assert.equal(await failurePage.locator('#cambio-8').isVisible(), true);
  await failurePage.route('**/video/OpenSpain-Cambios.mp4*', route => route.fulfill({ status: 404, body: 'No encontrado' }));
  await failurePage.goto(baseURL);
  await failurePage.locator('video').evaluate(node => node.load());
  await failurePage.locator('[data-video-error]').waitFor({ state: 'visible' });
  assert.equal(await failurePage.locator('.change-preview').count(), 8);
  await failurePage.close();

  const signupPage = await browser.newPage();
  for (const width of [390, 1440]) {
    await signupPage.setViewportSize({ width, height: 900 });
    for (const [path] of pages) {
      await signupPage.goto(`${baseURL}/${path}`);
      const floating = signupPage.locator('.floating-signup');
      assert.equal(await floating.count(), 1);
      assert.equal(await floating.getAttribute('href'), './participa.html#participa');
      assert.equal(await floating.isVisible(), false);
      if (path !== 'participa.html') {
        await signupPage.evaluate(() => window.scrollTo({ top: 180, behavior: 'instant' }));
        await floating.waitFor({ state: 'visible' });
        assert.equal(await floating.evaluate(node => {
          const rect = node.getBoundingClientRect();
          return rect.left >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight;
        }), true);
      }
      await signupPage.locator('footer').scrollIntoViewIfNeeded();
      await floating.waitFor({ state: 'hidden' });
    }
  }
  await signupPage.goto(`${baseURL}/participa.html`);
  for (const signupLink of await signupPage.locator('main a[href^="https://tally.so/"]').all()) {
    await signupLink.scrollIntoViewIfNeeded();
    assert.equal(await signupPage.locator('.floating-signup').isVisible(), false);
  }
  await signupPage.goto(baseURL);
  await signupPage.locator('#changes-video').scrollIntoViewIfNeeded();
  await signupPage.locator('.floating-signup').waitFor({ state: 'hidden' });
  await signupPage.close();

  await page.goto(`${baseURL}/transparencia.html`);
  assert.equal(await page.locator('.founder-photo').count(), 2);
  for (const [filename, alt] of [
    ['alejandro-acosta.jpg', 'Retrato de Alejandro Acosta, impulsor de OpenSpain'],
    ['fabio-franco.jpg', 'Retrato de Fabio Franco, coimpulsor de OpenSpain'],
  ]) {
    const photo = page.locator(`.founder-photo[src^="./${filename}"]`);
    await photo.waitFor();
    assert.equal(await photo.evaluate(image => image.complete && image.naturalWidth === 480 && image.naturalHeight === 612), true);
    assert.equal(await photo.getAttribute('alt'), alt);
  }

  const report = await browser.newPage();
  await report.goto(`${baseURL}/informe.html`);
  await report.waitForFunction(() => document.documentElement.dataset.reportReady === 'true');
  assert.equal(await report.locator('.axis-heading').count(), axes.length);
  assert.equal(await report.locator('.target-figure').count(), axes.length);
  assert.equal(await report.locator('.evidence-figure:not(.target-figure)').count(), Object.values(observedCharts).flat().length);
  assert.match(await report.locator('#report-body').textContent(), /Cambios que impulsamos/);
  assert.match(await report.locator('#report-body').textContent(), /no se adopta una abolición general/);
  assert.match(await report.locator('#report-body').textContent(), /Tres ejemplos para entender las cuentas/);
  assert.match(await report.locator('#report-body').textContent(), /Seguridad ciudadana: prevención, víctimas y respuesta efectiva/);
  assert.match(await report.locator('#report-body').textContent(), /Qué propuestas requieren cambiar la Constitución/);
  assert.match(await report.locator('#report-body').textContent(), /Fabio Franco/);
  for (const media of ['screen', 'print']) {
    await report.emulateMedia({ media });
    await report.evaluate(() => document.fonts.ready);
    assert.equal(await report.locator('body').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(16, 16, 20)');
    assert.match(await report.locator('body').evaluate(node => getComputedStyle(node).fontFamily), /Manrope/);
    for (const selector of ['.cover-description', '.lead', '.report-body-content p', '.report-stats small', 'td']) {
      const text = report.locator(selector).first();
      assert.equal(await text.evaluate(node => getComputedStyle(node).color), 'rgb(245, 245, 247)');
      await assertTextContrast(text);
    }
    for (const selector of ['.cover h1 em', '.axis-heading', '.technical-heading']) {
      const text = report.locator(selector).first();
      assert.equal(await text.evaluate(node => getComputedStyle(node).color), 'rgb(198, 243, 107)');
      await assertTextContrast(text);
    }
    assert.equal(await report.locator('.observed-bar').first().evaluate(node => getComputedStyle(node).fill), 'rgb(245, 245, 247)');
    assert.equal(await report.locator('.target-bar').first().evaluate(node => getComputedStyle(node).fill), 'rgb(143, 149, 163)');
    assert.equal(await report.locator('.target-figure').first().evaluate(node => getComputedStyle(node).borderLeftStyle), 'dashed');
  }
  await report.close();

  const proxy = createServer(async (request, response) => {
    try {
      const remote = await fetch(`${baseURL}${request.url.replace(/^\/preview/, '')}`, {
        method: request.method, headers: request.headers.range ? { Range: request.headers.range } : {},
      });
      response.writeHead(remote.status, Object.fromEntries(remote.headers));
      response.end(Buffer.from(await remote.arrayBuffer()));
    } catch (error) {
      console.error(error);
      response.writeHead(500);
      response.end('Error de prueba');
    }
  });
  await new Promise(resolve => proxy.listen(0, '127.0.0.1', resolve));
  try {
    const prefixPage = await browser.newPage();
    const prefixURL = `http://127.0.0.1:${proxy.address().port}/preview/`;
    await prefixPage.goto(`${prefixURL}#eje-23`);
    await prefixPage.waitForURL('**/preview/programa.html#eje-23');
    await prefixPage.waitForSelector('#eje-23');
    assert.equal(await prefixPage.locator('.program-card').count(), axes.length);
    await prefixPage.goto(`${prefixURL}cambios.html`);
    await prefixPage.waitForSelector('#cambio-8');
    await prefixPage.close();
  } finally {
    await new Promise(resolve => proxy.close(resolve));
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(signupRequests, [], 'Tally must not load before a signup click');
  console.log('Browser checks passed: six pages, 31 axes, eight pillars, both videos, transcripts, downloads, legacy links, subpath deployment, retry and mobile navigation.');
} finally {
  await browser.close();
}
