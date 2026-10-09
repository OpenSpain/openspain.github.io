import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { axisMetadata, parseProgram, inlineParts } from '../program.js';
import { observedCharts } from '../charts.js';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const screenshotDir = process.env.SCREENSHOT_DIR || 'test-results';
await mkdir(screenshotDir, { recursive: true });
const browser = await chromium.launch();
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  page.on('pageerror', error => errors.push(error.message));
  const signupProviderRequests = [];
  page.on('request', request => {
    const hostname = new URL(request.url()).hostname;
    if (['tally.so', 'typeform.com'].some(domain => hostname === domain || hostname.endsWith(`.${domain}`))) {
      signupProviderRequests.push(request.url());
    }
  });
  const response = await page.goto(baseURL);
  assert.equal(response.status(), 200);
  await page.waitForSelector('.program-card');
  const slogan = 'Abrir España. Ampliar oportunidades.';
  assert.equal((await page.locator('#hero-title').innerText()).replace(/\s+/g, ' '), slogan);
  assert.equal(await page.title(), `OpenSpain — ${slogan}`);
  assert.match(await page.locator('.hero-description').textContent(), /Menos barreras para vivir y crear/);
  assert.match(await page.locator('.hero-description').textContent(), /cómo se utiliza el dinero público/);
  const satelliteStyle = property => page.locator('.orbit-one').evaluate((node, property) =>
    getComputedStyle(node, '::after')[property], property);
  assert.equal(await satelliteStyle('animationName'), 'satellite-orbit');
  assert.equal(await satelliteStyle('animationDuration'), '18s');
  assert.equal(await satelliteStyle('animationIterationCount'), 'infinite');
  assert.match(await satelliteStyle('offsetPath'), /^ellipse\(/);
  await page.getByRole('button', { name: 'Pausar animación', exact: true }).click();
  assert.equal(await satelliteStyle('animationPlayState'), 'paused');
  const orbitPositions = await page.locator('.hero-art').evaluate(node => {
    const animation = node.getAnimations({ subtree: true }).find(item => item.animationName === 'satellite-orbit');
    const satellite = node.querySelector('.orbit-one');
    animation.currentTime = 0;
    const start = Number.parseFloat(getComputedStyle(satellite, '::after').offsetDistance);
    animation.currentTime = 4500;
    const quarter = Number.parseFloat(getComputedStyle(satellite, '::after').offsetDistance);
    animation.currentTime = 18000;
    const loop = Number.parseFloat(getComputedStyle(satellite, '::after').offsetDistance);
    return { start, quarter, loop };
  });
  assert.equal(orbitPositions.start, 87.5);
  assert.equal(orbitPositions.quarter - orbitPositions.start, 25);
  assert.equal(orbitPositions.loop, orbitPositions.start);
  await page.getByRole('button', { name: 'Reanudar animación', exact: true }).click();
  assert.equal(await satelliteStyle('animationPlayState'), 'running');
  await page.waitForFunction(() =>
    Number.parseFloat(getComputedStyle(document.querySelector('.orbit-one'), '::after').offsetDistance) > 87.5);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await satelliteStyle('animationName'), 'none');
  assert.equal(await satelliteStyle('offsetPath'), 'none');
  assert.equal(await page.locator('#orbit-toggle').isVisible(), false);
  await page.emulateMedia({ reducedMotion: 'no-preference', media: 'print' });
  assert.equal(await page.locator('.hero-art').isVisible(), false);
  await page.emulateMedia({ media: 'screen' });
  assert.equal(await page.getByRole('button', { name: 'Pausar animación', exact: true }).isVisible(), true);
  const staticPage = await browser.newPage({ javaScriptEnabled: false, reducedMotion: 'no-preference' });
  await staticPage.goto(baseURL);
  assert.equal(await staticPage.locator('.orbit-one').evaluate(node =>
    getComputedStyle(node, '::after').animationPlayState), 'paused');
  assert.equal(await staticPage.locator('#orbit-toggle').isVisible(), false);
  await staticPage.close();
  const signupURL = 'https://tally.so/r/D4lvRN';
  const signupLinks = page.getByRole('link', { name: /Hazte simpatizante/ });
  assert.equal(await signupLinks.count(), 2);
  for (const link of await signupLinks.all()) {
    assert.equal(await link.getAttribute('href'), signupURL);
    assert.equal(await link.getAttribute('target'), '_blank');
    assert.equal(await link.getAttribute('rel'), 'noopener noreferrer');
    assert.match(await link.textContent(), /abre Tally en otra pestaña/);
  }
  assert.doesNotMatch(await page.locator('body').textContent(), /Typeform/i);
  assert.equal(await page.locator('a[href*="typeform.com"]').count(), 0);
  assert.match(await page.locator('.signup-note').textContent(), /Formulario externo en Tally/);
  assert.match(await page.locator('#participa').textContent(), /formulario externo en Tally/);
  assert.match(await page.locator('.signup-note').textContent(), /no es una afiliación ni un aval electoral/);
  assert.match(await page.locator('#participa').textContent(), /no es una afiliación, una firma electoral ni un compromiso de avalar/);
  assert.equal(await page.locator('iframe').count(), 0);
  assert.equal(await page.locator('.program-card').count(), axisMetadata.length);
  assert.equal(await page.locator('#citizen-demands-content li').count(), 10);
  assert.equal(await page.locator('#citizen-demands-content').isVisible(), true);
  assert.match(await page.locator('#citizen-demands-content').textContent(), /La verdad ante el Parlamento/);
  const conflictsLink = page.locator('#citizen-demands-content a[href="#eje-23"]');
  assert.equal(await conflictsLink.getAttribute('target'), null);
  await conflictsLink.click();
  assert.equal(new URL(page.url()).hash, '#eje-23');
  assert.equal(await page.locator('#eje-23').isVisible(), true);
  await page.locator('#eje-23').getByRole('button').click();
  assert.match(await page.locator('#measure-content').textContent(), /sistema preventivo de conflictos de interés/);
  assert.match(await page.locator('#measure-content').textContent(), /sustituto sin el mismo conflicto/);
  await page.keyboard.press('Escape');
  const sourceResponse = await page.request.get(`${baseURL}/PROGRAMA.md`);
  assert.equal(sourceResponse.status(), 200);
  const sourceAxes = parseProgram(await sourceResponse.text());
  for (const axis of sourceAxes) {
    await page.locator(`#eje-${axis.id}`).getByRole('button').click();
    const summary = page.locator('#measure-content .citizen-summary');
    const paragraphs = axis.citizenSummary.split('\n\n').filter(text => !text.startsWith('#### '))
      .map(text => inlineParts(text).map(part => part.text).join(''));
    assert.deepEqual(await summary.locator('p').allTextContents(), paragraphs, `Eje ${axis.id}: texto continuo íntegro`);
    assert.equal(await summary.locator('h4').textContent(), 'Plan de actuación');
    assert.doesNotMatch(await summary.textContent(), /Ejemplo cotidiano \(hipotético\):|Intereses que hay que equilibrar:|Qué haremos en el primer año:/);
    assert.equal(await page.locator('#measure-dialog .technical-details').count(), 0);
    assert.equal(await page.locator('#measure-content .technical-content').isVisible(), true);
    assert.doesNotMatch(await page.locator('#measure-content').textContent(), /La propuesta en detalle|proposal-detail/);
    const measures = await page.locator('#measure-content .technical-content li').allTextContents();
    for (const measure of axis.measures) {
      assert.ok(measures.includes(inlineParts(measure).map(part => part.text).join('')),
        `Eje ${axis.id}: propuesta íntegra en el detalle`);
    }
    const expectedParagraphs = axis.technicalBody.split('\n\n').filter(text =>
      !text.startsWith('- ') && !text.startsWith('|'))
      .map(text => inlineParts(text).map(part => part.text).join(''));
    assert.deepEqual(await page.locator('#measure-content .technical-content p').allTextContents(),
      expectedParagraphs, `Eje ${axis.id}: explicación detallada íntegra y en orden`);
    assert.doesNotMatch(await page.locator('#measure-content .technical-content').textContent(),
      /Fundamento y alternativas:|Medición y fuentes:|Problema a estudiar:|Coste y financiación:|Riesgos y garantías:/);
    assert.equal(await page.locator('#measure-content').evaluate(content => {
      const summary = content.querySelector('.citizen-summary');
      const evidence = content.querySelector('.policy-evidence');
      const technical = content.querySelector('.technical-content');
      return Boolean(summary.compareDocumentPosition(evidence) & Node.DOCUMENT_POSITION_FOLLOWING)
        && Boolean(evidence.compareDocumentPosition(technical) & Node.DOCUMENT_POSITION_FOLLOWING);
    }), true, `Eje ${axis.id}: explicación antes de gráficos y detalle`);
    await page.keyboard.press('Escape');
  }
  assert.equal(await page.locator('.coverage-row').count(), 4);
  for (const headline of await page.locator('.program-card h3').allTextContents()) {
    assert.match(headline, /[.?]$/);
  }
  assert.equal(await page.locator('#priorities-content tbody tr').count(), 8);
  assert.match(await page.locator('#eje-19 h3').textContent(), /¿Quién paga a quién\?/);
  assert.match(await page.locator('#priorities-content').textContent(), /Dinero público a medios difícil de seguir/);
  assert.equal(await page.locator('#priorities-content').isVisible(), true);
  assert.match(await page.locator('#priorities-content').textContent(), /Ampliar el parque público y protegido/);
  assert.match(await page.locator('#priorities-content').textContent(), /habilitar suelo residencial/);
  assert.match(await page.locator('#priorities-content').textContent(), /primer ciclo de 90 días/);
  await page.getByRole('button', { name: /Ver medidas: Constitución clara/ }).click();
  assert.match(await page.locator('#measure-content .citizen-summary').textContent(), /12 fichas/);
  assert.match(await page.locator('#measure-content .citizen-summary').textContent(), /40 fichas/);
  assert.match(await page.locator('#measure-content .evidence-label').first().textContent(), /CIFRA NORMATIVA/);
  assert.equal(await page.locator('#measure-content .target-figure').count(), 1);
  assert.match(await page.locator('#measure-content .technical-content').textContent(), /referéndum de ratificación obligatorio/);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Ver medidas: Justicia accesible y ágil/ }).click();
  assert.match(await page.locator('#measure-content .citizen-summary').textContent(), /sin recortar plazos de defensa/);
  assert.match(await page.locator('#measure-content .evidence-label').first().textContent(), /ESTIMACIÓN ESTADÍSTICA/);
  assert.equal(await page.locator('#measure-content .target-figure').count(), 1);
  await page.keyboard.press('Escape');
  await page.locator('#program-guide > summary').click();
  assert.equal(await page.locator('#program-guide-content').isVisible(), true);
  assert.match(await page.locator('#program-guide-content').textContent(), /Qué significa «haremos»/);
  assert.match(await page.locator('#program-guide-content').textContent(), /no una medida ya aprobada/);
  assert.equal(await page.locator('#program-guide-content .technical-heading').count(), 0);
  assert.doesNotMatch(await page.locator('#programa').textContent(), /\bSMART\b/i);
  await page.locator('#program-guide > summary').click();
  await page.getByRole('button', { name: /Ver medidas: Ecosistema de startups/ }).click();
  assert.match(await page.locator('#measure-content .citizen-summary').textContent(), /plan individual con mercado elegido/);
  assert.equal(await page.locator('#measure-content .target-figure').count(), 1);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Ver medidas: Educación y habilidades para la vida/ }).click();
  assert.match(await page.locator('#measure-content .citizen-summary').textContent(), /En inglés, se propone practicar conversación/);
  await page.keyboard.press('Escape');
  await page.getByRole('searchbox').fill('Uber');
  assert.equal(await page.locator('.program-card').count(), 1);
  await page.getByRole('button', { name: /Ver medidas: Trabajo remoto/ }).click();
  assert.match(await page.locator('#measure-content .citizen-summary').textContent(), /En movilidad, si se activa esta actuación/);
  assert.match(await page.locator('#measure-content .policy-evidence').textContent(), /60\.074/);
  assert.match(await page.locator('#measure-content .policy-evidence').textContent(), /27\.107/);
  assert.match(await page.locator('#measure-content .technical-content').textContent(), /Es una impugnación, no una anulación firme/);
  await page.keyboard.press('Escape');
  await page.getByRole('searchbox').fill('economía colaborativa');
  assert.equal(await page.locator('.program-card').count(), 1);
  await page.getByRole('button', { name: /Ver medidas: Burocracia/ }).click();
  assert.match(await page.locator('#measure-content .citizen-summary').textContent(), /no se tratará automáticamente como actividad de bajo riesgo/);
  await page.keyboard.press('Escape');
  await page.getByRole('searchbox').fill('');
  assert.match(await page.locator('#metodo').textContent(), /Menos «y tú más»/);
  await page.getByRole('button', { name: /Ver medidas: Convivencia democrática/ }).click();
  assert.match(await page.locator('#measure-content .citizen-summary').textContent(), /protocolo de diálogo y un registro/);
  assert.match(await page.locator('#measure-content .technical-content').textContent(), /Unir no significa impunidad/);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '2025', exact: true }).click();
  assert.match(await page.locator('#ipc-chart desc').textContent(), /2,9%/);
  await page.getByRole('button', { name: /Ver tabla de datos/ }).click();
  assert.equal(await page.locator('#ipc-table tbody tr').count(), 12);
  await page.getByRole('button', { name: '2026', exact: true }).click();
  assert.match(await page.locator('#ipc-table caption').textContent(), /2026/);
  assert.equal(await page.locator('#ipc-table tbody tr').count(), 8);
  assert.equal(await page.locator('#ipc-chart .chart-value').textContent(), '4,3%');
  assert.match(await page.locator('#donaciones').textContent(), /DONACIONES NO HABILITADAS/);
  assert.match(await page.locator('#registro-donaciones tbody').textContent(), /No hay donaciones registradas/);
  await page.getByRole('button', { name: 'El siguiente salto', exact: true }).click();
  assert.equal(await page.locator('.program-card').count(), axisMetadata.filter(axis => axis[0] === 'future').length);
  await page.getByRole('button', { name: /Ver medidas: Independencia energética/ }).click();
  assert.equal(await page.locator('#measure-dialog').evaluate(node => node.open), true);
  assert.match(await page.locator('#measure-content').textContent(), /certificación/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#measure-dialog').evaluate(node => node.open), false);
  await page.getByRole('button', { name: 'Todo el programa', exact: true }).click();
  await page.getByRole('searchbox').fill('pliegos');
  assert.equal(await page.locator('.program-card').count(), 1);
  await page.getByRole('button', { name: /Ver medidas: Licitaciones/ }).click();
  assert.match(await page.locator('#measure-content').textContent(), /falsos positivos/);
  await page.getByRole('button', { name: 'Cerrar detalle de medidas' }).click();
  await page.getByRole('searchbox').fill('zzzzzzzz');
  assert.equal(await page.locator('#empty-state').isVisible(), true);
  await page.getByRole('button', { name: 'Ver todo el programa' }).click();
  assert.equal(await page.locator('.program-card').count(), axisMetadata.length);
  await page.getByRole('button', { name: /Ver medidas: Democracia, igualdad del voto/ }).click();
  assert.match(await page.locator('#measure-dialog .citizen-summary').textContent(), /En el primer año, proponemos/);
  assert.match(await page.locator('#measure-dialog .citizen-summary').textContent(), /En cuatro años, el objetivo es/);
  assert.match(await page.locator('#measure-dialog .citizen-summary').textContent(), /La ejecución correspondería a/);
  assert.equal(await page.locator('#measure-dialog .technical-content table').isVisible(), true);
  assert.equal(await page.locator('#measure-dialog .technical-content table tbody tr').count(), 4);
  assert.match(await page.locator('#measure-dialog .technical-content table').textContent(), /Voto ponderado/);
  await page.getByRole('button', { name: 'Cerrar detalle de medidas' }).click();
  await page.getByRole('button', { name: 'Prepara tu propuesta' }).click();
  await page.getByLabel('Título de tu propuesta').fill('Energía compartida');
  await page.getByLabel('El problema', { exact: true }).fill('Acceso al autoconsumo sin tejado.');
  await page.getByLabel('La solución', { exact: true }).fill('Estudiar comunidades energéticas.');
  await page.getByLabel('Cómo medir el resultado').fill('Coste y participación.');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descargar mi propuesta .md' }).click();
  const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), 'mi-propuesta-openspain.md');
  await page.getByRole('button', { name: 'Cerrar formulario de propuesta' }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(screenshotDir, 'openspain-desktop.png'), fullPage: true });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.match(await satelliteStyle('offsetPath'), /^ellipse\(/, `Responsive orbit path at ${width}px`);
    assert.equal(await satelliteStyle('animationPlayState'), 'running', `Orbit animation at ${width}px`);
    const prioritiesSpacing = await page.evaluate(() => {
      const donations = document.querySelector('#donaciones');
      const register = donations.querySelector('.donor-register');
      const priorities = document.querySelector('#prioridades');
      return {
        gap: priorities.querySelector('.section-top').getBoundingClientRect().top - register.getBoundingClientRect().bottom,
        expected: Number.parseFloat(getComputedStyle(donations).paddingBottom),
        topPadding: Number.parseFloat(getComputedStyle(priorities).paddingTop),
      };
    });
    assert.equal(prioritiesSpacing.topPadding, 0, `No duplicated section padding at ${width}px`);
    assert.ok(Math.abs(prioritiesSpacing.gap - prioritiesSpacing.expected) <= 1,
      `Priorities gap must use only the preceding section spacing at ${width}px`);
    assert.equal(await page.locator('.hero').getByRole('link', { name: /Hazte simpatizante/ }).isVisible(), true);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Horizontal overflow at ${width}px`);
    assert.ok(await page.locator('.card-description').first().evaluate(node => Number.parseFloat(getComputedStyle(node).fontSize) >= 15));
    await page.evaluate(() => window.scrollTo(0, 1200));
    assert.equal(await page.locator('.site-header').evaluate(node => Math.round(node.getBoundingClientRect().top)), 0);
    assert.equal(await page.locator('.site-header nav').isVisible(), true);
    await page.locator('.site-header a[href="#plan"]').click();
    await page.waitForFunction(() => Math.abs(document.querySelector('#plan').getBoundingClientRect().top - Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)) < 3);
    assert.ok(await page.locator('#plan').evaluate(node => node.getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom));
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: join(screenshotDir, 'openspain-mobile.png'), fullPage: true });
  const reportPage = await browser.newPage();
  await reportPage.goto(`${baseURL}/informe.html`);
  await reportPage.waitForFunction(() => Boolean(document.documentElement.dataset.reportReady));
  assert.equal(await reportPage.getAttribute('html', 'data-report-ready'), 'true');
  assert.equal((await reportPage.locator('.cover h1').innerText()).replace(/\s+/g, ' '), slogan);
  const principlesSection = reportPage.locator('.report-section').filter({
    has: reportPage.getByRole('heading', { name: '1. Propósito y principios', exact: true }),
  });
  assert.equal(await principlesSection.locator('li').filter({ hasText: /^\d+\./ }).count(), 10);
  assert.equal(await principlesSection.locator('a[href="#eje-23"]').getAttribute('target'), null);
  assert.match(await principlesSection.textContent(), /Diez exigencias ciudadanas/);
  assert.match(await reportPage.locator('#report-body').textContent(), /Donaciones y transparencia/);
  assert.equal(await reportPage.locator('#report-body h4').filter({ hasText: /^Plan de actuación$/ }).count(), axisMetadata.length);
  assert.doesNotMatch(await reportPage.locator('#report-body').textContent(), /La propuesta en detalle|proposal-detail/);
  assert.equal(await reportPage.locator('#report-body p').filter({ hasText: /^En un caso hipotético,/ }).count(), axisMetadata.length);
  for (const axis of sourceAxes) {
    const evidence = reportPage.locator(`[data-axis-evidence="${axis.id}"]`);
    assert.equal(await evidence.evaluate((node, expected) => {
      const paragraphs = [];
      let previous = node.previousElementSibling;
      while (previous && !previous.classList.contains('axis-heading')) {
        if (previous.tagName === 'P') paragraphs.unshift(previous.textContent);
        previous = previous.previousElementSibling;
      }
      return JSON.stringify(paragraphs) === JSON.stringify(expected.paragraphs)
        && node.nextElementSibling?.textContent === expected.firstParagraph;
    }, { firstParagraph: inlineParts(axis.technicalBody.split('\n\n')[0]).map(part => part.text).join(''),
      paragraphs: axis.citizenSummary.split('\n\n').filter(text => !text.startsWith('#### '))
      .map(text => inlineParts(text).map(part => part.text).join('')) }),
      true, `Eje ${axis.id}: texto continuo íntegro antes de gráficos y detalle en el informe`);
    assert.deepEqual(await reportPage.locator(`#eje-${axis.id}`).evaluate(heading => {
      const paragraphs = [];
      let node = heading.nextElementSibling;
      let detail = false;
      while (node && node.tagName !== 'H3') {
        if (node.classList.contains('policy-evidence')) detail = true;
        else if (detail && node.tagName === 'P') paragraphs.push(node.textContent);
        node = node.nextElementSibling;
      }
      return paragraphs;
    }), axis.technicalBody.split('\n\n').filter(text => !text.startsWith('- ') && !text.startsWith('|'))
      .map(text => inlineParts(text).map(part => part.text).join('')),
    `Eje ${axis.id}: explicación detallada íntegra en el informe`);
  }
  assert.doesNotMatch(await reportPage.locator('body').textContent(), /\bSMART\b/i);
  assert.match(await reportPage.locator('#report-body').textContent(), /Un seguimiento que no confunda actividad con resultados/);
  assert.match(await reportPage.locator('#report-body').textContent(), /En movilidad, si se activa esta actuación/);
  assert.match(await reportPage.locator('#report-body').textContent(), /Unir esfuerzos, no repartir culpas/);
  assert.match(await reportPage.locator('#report-body').textContent(), /Unir no significa impunidad/);
  assert.match(await reportPage.locator('#eje-30').textContent(), /Constitución clara/);
  assert.equal(await reportPage.locator('[data-axis-evidence="30"] .target-figure').count(), 1);
  assert.match(await reportPage.locator('#eje-31').textContent(), /Justicia accesible y ágil/);
  assert.match(await reportPage.locator('.report-section').last().textContent(), /Problemas principales y primeras acciones/);
  assert.match(await reportPage.locator('.report-section').last().textContent(), /habilitar suelo residencial/);
  assert.match(await reportPage.locator('[data-axis-evidence="25"]').textContent(), /60\.074/);
  assert.equal(await reportPage.locator('#report-ipc rect').count(), 8);
  assert.equal(await reportPage.locator('[data-axis-evidence]').count(), axisMetadata.length);
  assert.equal(await reportPage.locator('.target-figure').count(), axisMetadata.length);
  assert.equal(await reportPage.locator('.evidence-figure:not(.target-figure)').count(), Object.values(observedCharts).flat().length);
  assert.equal(await reportPage.locator('.evidence-gap').count(), axisMetadata.length - Object.keys(observedCharts).length);
  assert.ok(await reportPage.locator('#report-body a[href^="https://"]').count() >= 18);
  assert.ok((await page.locator('#evidence-coverage').textContent()).includes(`${axisMetadata.length} de ${axisMetadata.length}`));
  assert.equal(await page.locator('#axis-data-content > details').count(), axisMetadata.length);
  await page.locator('#diagnostico > summary').click();
  await page.locator('#axis-data-content > details').last().locator(':scope > summary').click();
  assert.match(await page.locator('#axis-data-content > details').last().textContent(), /Duración media estimada de asuntos civiles/);
  assert.equal(await page.locator('#axis-data-content .target-figure').count(), axisMetadata.length);
  await page.locator('#diagnostico > summary').click();
  assert.ok(await page.locator('#sources-content a[href^="https://"]').count() >= 18);
  await reportPage.emulateMedia({ media: 'print' });
  const reportHeading = reportPage.locator('#eje-19');
  const headingStyles = await reportHeading.evaluate(heading => ({
    titleSize: Number.parseFloat(getComputedStyle(heading).fontSize),
    labelSize: Number.parseFloat(getComputedStyle(heading.querySelector('.axis-label')).fontSize),
    labelSpacing: Number.parseFloat(getComputedStyle(heading.querySelector('.axis-label')).letterSpacing),
  }));
  assert.ok(headingStyles.titleSize >= 29, 'Axis titles must be at least 22pt');
  assert.ok(headingStyles.labelSize >= 13, 'Axis labels must be at least 10pt');
  assert.ok(headingStyles.labelSpacing < 1, 'Axis labels must not have widely spaced letters');
  const reportSizes = await reportPage.evaluate(() => ({
    body: Number.parseFloat(getComputedStyle(document.body).fontSize),
    contents: Number.parseFloat(getComputedStyle(document.querySelector('.contents-link')).fontSize),
    table: Number.parseFloat(getComputedStyle(document.querySelector('.report-summary table')).fontSize),
  }));
  assert.ok(reportSizes.body >= 14.6, 'Report body must be at least 11pt');
  assert.ok(reportSizes.contents >= 14.6, 'Contents entries must be at least 11pt');
  assert.ok(reportSizes.table >= 13.3, 'Report summary tables must be at least 10pt');
  for (const [selector, property, expected] of [
    ['.contents-page', 'breakAfter', 'auto'],
    ['.report-summary', 'breakBefore', 'auto'],
    ['.sources-page', 'breakBefore', 'auto'],
    ['.report-body-content p', 'breakInside', 'auto'],
    ['.report-body-content li', 'breakInside', 'auto'],
    ['.evidence-figure', 'breakInside', 'avoid'],
    ['.report-body-content h3', 'breakAfter', 'avoid'],
    ['.report-body-content tr', 'breakInside', 'avoid'],
  ]) {
    assert.equal(await reportPage.locator(selector).first().evaluate((node, property) => getComputedStyle(node)[property], property),
      expected, `${selector} ${property}`);
  }
  for (const selector of ['.report-body-content p', '.report-body-content li', '.report-note p', '.sources-page > p:not(.kicker)']) {
    const typography = await reportPage.locator(selector).first().evaluate(node => ({
      alignment: getComputedStyle(node).textAlign,
      lastLine: getComputedStyle(node).textAlignLast,
    }));
    assert.equal(typography.alignment, 'justify', `${selector} must be justified`);
    assert.equal(typography.lastLine, 'start', `${selector} last line must not be stretched`);
  }
  await reportHeading.screenshot({ path: join(screenshotDir, 'openspain-report-heading.png') });
  const failurePage = await browser.newPage();
  await failurePage.route('**/PROGRAMA.md', route => route.fulfill({ status: 500, body: 'Error' }));
  await failurePage.goto(baseURL);
  await failurePage.locator('#program-error').waitFor({ state: 'visible' });
  await failurePage.unroute('**/PROGRAMA.md');
  await failurePage.getByRole('button', { name: 'Reintentar' }).click();
  await failurePage.waitForSelector('.program-card');
  assert.equal(await failurePage.locator('.program-card').count(), axisMetadata.length);
  await page.getByRole('searchbox').fill('zzzzzzzz');
  await page.evaluate(() => { window.location.hash = '#eje-30'; });
  await page.waitForFunction(() => document.querySelector('#eje-30')?.getBoundingClientRect().top >= 0
    && document.querySelector('#eje-30')?.getBoundingClientRect().top < window.innerHeight);
  assert.equal(await page.getByRole('searchbox').inputValue(), '');
  assert.match(await page.locator('#eje-30 h3').textContent(), /Constitución clara y accesible/);
  assert.ok(await page.locator('#eje-30').evaluate(node => node.getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom));
  const linkedPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await linkedPage.goto(`${baseURL.replace(/\/$/, '')}/#eje-31`);
  await linkedPage.waitForFunction(() => document.querySelector('#eje-31')?.getBoundingClientRect().top >= 0
    && document.querySelector('#eje-31')?.getBoundingClientRect().top < window.innerHeight);
  assert.match(await linkedPage.locator('#eje-31 h3').textContent(), /Justicia accesible y ágil/);
  assert.deepEqual(errors, []);
  assert.deepEqual(signupProviderRequests, [], 'Signup providers must not load before the visitor follows a signup link');
  console.log(`Browser checks passed: ${axisMetadata.length} axes, filters, search, charts, dialogs, download, retry and responsive layouts.`);
} finally {
  await browser.close();
}
