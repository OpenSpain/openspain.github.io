import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { parseProgram, inlineParts, getInitiativeActionItems } from '../program.js';
import { pages, legacyTarget } from '../routes.js';
import { observedCharts } from '../charts.js';

const baseURL = (process.env.BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const screenshotDir = process.env.SCREENSHOT_DIR || 'test-results';
await mkdir(screenshotDir, { recursive: true });
const markdown = await readFile(new URL('../PROGRAMA.md', import.meta.url), 'utf8');
const axes = parseProgram(markdown);
const plain = text => inlineParts(text).map(part => part.text).join('');
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
  assert.equal(await page.locator('.hero').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(49, 89, 220)');
  assert.equal(await page.locator('body').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(255, 255, 255)');
  assert.equal(await page.locator('.manifesto').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(49, 89, 220)');
  assert.equal(await page.locator('footer').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(17, 19, 24)');
  assert.equal(await page.locator('.highlights-section').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(244, 246, 249)');
  assert.equal(await page.locator('.change-preview').first().evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(255, 255, 255)');
  assert.match(await page.locator('.manifesto h2').textContent(), /Menos «y tú más».*Más responsabilidad/);
  assert.equal(await page.locator('.manifesto > a').getAttribute('href'), './como.html');
  assert.ok(await page.locator('.manifesto').evaluate(node => node.getBoundingClientRect().height) <= 300);
  assert.ok(await page.locator('footer').evaluate(node => node.getBoundingClientRect().height) <= 240);
  assert.equal(await page.locator('.program-card').count(), 0, 'The homepage must not contain the full programme');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const satelliteStyle = property => page.locator('.orbit-one').evaluate((node, key) =>
    getComputedStyle(node, '::after')[key], property);
  assert.equal(await satelliteStyle('animationName'), 'satellite-orbit');
  await page.getByRole('button', { name: 'Pausar animación', exact: true }).click();
  assert.equal(await satelliteStyle('animationPlayState'), 'paused');
  await page.getByRole('button', { name: 'Reanudar animación', exact: true }).click();
  assert.equal(await satelliteStyle('animationPlayState'), 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await satelliteStyle('animationName'), 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  assert.deepEqual(videoRequests, []);
  await page.screenshot({ path: join(screenshotDir, 'openspain-desktop.png'), fullPage: true });

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
  assert.equal(await page.locator('#cambio-1 a').first().getAttribute('href'), './programa.html#eje-1');
  assert.equal(await page.locator('#cambio-1 a').first().getAttribute('target'), null);

  async function checkVideo(selector, expectedDuration, expectedCues, ratio) {
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
    const captions = await page.request.get(new URL(await video.locator('track').getAttribute('src'), page.url()).href);
    assert.equal(captions.status(), 200);
    assert.match(captions.headers()['content-type'], /text\/vtt/);
    assert.match(await captions.text(), /^WEBVTT/);
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
    await page.waitForFunction(selector => document.querySelector(`${selector} track`).readyState === 2, selector);
    assert.equal(await video.evaluate(node => node.textTracks[0].cues.length), expectedCues);
    assert.ok(Math.abs(await video.evaluate(node => node.duration) - expectedDuration) < 0.1);
    assert.ok(Math.abs(await video.evaluate(node => node.videoWidth / node.videoHeight) - ratio) < 0.01);
    await video.evaluate(node => { node.pause(); node.currentTime = 25; });
    await page.waitForFunction(selector => {
      const node = document.querySelector(selector);
      return !node.seeking && node.readyState >= 2 && Math.abs(node.currentTime - 25) < 0.1;
    }, selector);
    assert.equal(await video.locator('xpath=..').locator('[data-video-error]').isVisible(), false);
  }
  assert.deepEqual(videoRequests, [], 'No MP4 should load before voluntary playback');
  await page.goto(baseURL);
  await checkVideo('#changes-video', 60, 10, 16 / 9);
  await page.getByText('Leer el contenido del vídeo', { exact: true }).click();
  assert.equal(await page.locator('[data-program-content="video-transcript"] p').count(), 8);
  assert.match(await page.locator('.video-transcript').textContent(), /sin abolición autonómica general/);

  await page.goto(`${baseURL}/programa.html`);
  await page.waitForSelector('.program-card');
  assert.ok(await page.locator('.compact-intro').evaluate(node => node.getBoundingClientRect().height) <= 320);
  assert.equal(await page.locator('.compact-intro a[download]').count(), 2);
  assert.equal(await page.locator('.program-card').count(), axes.length);
  assert.ok(await page.locator('.card-index').first().evaluate(node => parseFloat(getComputedStyle(node).fontSize)) >= 52);
  assert.equal(await page.locator('.filter-button[aria-pressed="true"]').evaluate(node => getComputedStyle(node).backgroundColor),
    await page.locator('.card-index').first().evaluate(node => getComputedStyle(node).color));
  assert.equal(await page.locator('#citizen-demands-content li').count(), 10);
  for (const axis of axes) {
    await page.locator(`#eje-${axis.id}`).getByRole('button').click();
    const summary = page.locator('#measure-content .citizen-summary');
    assert.deepEqual(await summary.locator('p').allTextContents(), axis.citizenSummary.split('\n\n')
      .filter(text => !text.startsWith('#### ')).map(plain));
    assert.equal(await summary.locator('h4').textContent(), 'Plan de actuación');
    assert.deepEqual(await page.locator('#measure-content .technical-content p').allTextContents(),
      axis.technicalBody.split('\n\n').filter(text => !text.startsWith('- ') && !text.startsWith('|')).map(plain));
    const measures = await page.locator('#measure-content .technical-content li').allTextContents();
    for (const measure of axis.measures) assert.ok(measures.includes(plain(measure)));
    assert.equal(await page.locator('#measure-content .target-figure').count(), 1);
    assert.equal(await page.locator('#measure-content .target-bar').first().evaluate(node => getComputedStyle(node).fill), 'rgb(17, 19, 24)');
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
  await page.goto(`${baseURL}/transparencia.html`);
  await page.waitForFunction(() => document.querySelector('[data-program-content="6"]')?.textContent.includes('Alejandro'));
  assert.match(await page.locator('#registro-donaciones').textContent(), /no está habilitado|No es un servicio de pagos/);
  assert.equal(await page.locator('a[href*="paypal"], a[href*="stripe"]').count(), 0);

  await page.goto(`${baseURL}/participa.html`);
  const signup = page.getByRole('link', { name: /Hazte simpatizante/ });
  assert.equal(await signup.getAttribute('href'), 'https://tally.so/r/D4lvRN');
  assert.equal(await signup.getAttribute('target'), '_blank');
  assert.equal(await signup.getAttribute('rel'), 'noopener noreferrer');
  assert.match(await page.locator('#participa').textContent(), /no es una afiliación/);
  await checkVideo('#sympathizer-video', 44.8, 16, 9 / 16);
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
      const methodToPlanGap = await page.evaluate(() => document.querySelector('#plan-title').getBoundingClientRect().top
        - document.querySelector('#method-content').getBoundingClientRect().bottom);
      assert.ok(methodToPlanGap >= 0 && methodToPlanGap <= 96, `Gap before plan: ${methodToPlanGap}px`);
    }
    const instagram = page.locator('footer .footer-socials a');
    assert.equal(await page.locator('.site-header > .brand').textContent(), 'openspain.');
    assert.equal(await page.locator('.site-header > .brand img').count(), 1);
    assert.equal(await page.locator('.site-header .brand-symbol').getAttribute('src'), './favicon.svg?v=20261011-wordmark');
    assert.equal(await page.locator('.site-header .brand-symbol').getAttribute('alt'), '');
    assert.equal(await page.locator('.site-header > .brand').getAttribute('aria-label'), 'OpenSpain, inicio');
    const subtitle = page.locator('main .section-subtitle, main .section-heading > p').first();
    assert.equal(await subtitle.evaluate(node => getComputedStyle(node).fontWeight), '600');
    assert.equal(await instagram.count(), 1);
    assert.equal(await instagram.getAttribute('href'), 'https://www.instagram.com/openspainorg/');
    assert.equal(await instagram.getAttribute('target'), '_blank');
    assert.equal(await instagram.getAttribute('rel'), 'noopener noreferrer');
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
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
  await signupPage.locator('a[href^="https://tally.so/"]').scrollIntoViewIfNeeded();
  assert.equal(await signupPage.locator('.floating-signup').isVisible(), false);
  await signupPage.goto(baseURL);
  await signupPage.locator('#changes-video').scrollIntoViewIfNeeded();
  await signupPage.locator('.floating-signup').waitFor({ state: 'hidden' });
  await signupPage.close();

  await page.goto(`${baseURL}/transparencia.html`);
  await page.locator('.founder-photo').waitFor();
  assert.equal(await page.locator('.founder-photo').evaluate(image => image.complete && image.naturalWidth === 480), true);
  assert.equal(await page.locator('.founder-photo').getAttribute('alt'), 'Retrato de Alejandro Acosta, impulsor de OpenSpain');

  const report = await browser.newPage();
  await report.goto(`${baseURL}/informe.html`);
  await report.waitForFunction(() => document.documentElement.dataset.reportReady === 'true');
  assert.equal(await report.locator('.axis-heading').count(), axes.length);
  assert.equal(await report.locator('.target-figure').count(), axes.length);
  assert.equal(await report.locator('.evidence-figure:not(.target-figure)').count(), Object.values(observedCharts).flat().length);
  assert.match(await report.locator('#report-body').textContent(), /Cambios que impulsamos/);
  assert.match(await report.locator('#report-body').textContent(), /no se adopta una abolición general/);
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
  console.log('Browser checks passed: six pages, 31 axes, eight pillars, both videos, captions, downloads, legacy links, subpath deployment, retry and mobile navigation.');
} finally {
  await browser.close();
}
