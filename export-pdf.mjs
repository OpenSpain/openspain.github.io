import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const port = '4175';
const baseURL = process.env.BASE_URL || `http://127.0.0.1:${port}`;
let server;
let browser;
try {
  if (!process.env.BASE_URL) {
    server = spawn(process.execPath, ['server.mjs'], {
      cwd: fileURLToPath(new URL('.', import.meta.url)),
      env: { ...process.env, PORT: port },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    await new Promise((resolve, reject) => {
      server.stdout.once('data', resolve);
      server.stderr.once('data', data => reject(new Error(String(data))));
      server.once('error', reject);
      server.once('exit', code => reject(new Error(`El servidor terminó con código ${code}.`)));
    });
  }
  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(`${baseURL}/informe.html`);
  if (!response?.ok()) throw new Error('No se pudo abrir la página del informe.');
  await page.waitForFunction(() => Boolean(document.documentElement.dataset.reportReady));
  if (await page.getAttribute('html', 'data-report-ready') !== 'true') {
    throw new Error(await page.locator('#report-error').textContent());
  }
  if (errors.length) throw new Error(errors.join('\n'));
  await page.evaluate(() => document.fonts.ready);
  const count = await page.locator('.axis-heading').count();
  const measures = await page.locator('#report-body li').count();
  const path = fileURLToPath(new URL('OpenSpain-Programa.pdf', import.meta.url));
  await page.pdf({
    path, format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-family:Arial,sans-serif;font-size:9px;color:#394b66;width:100%;margin:0 68px;display:flex;justify-content:space-between;border-top:1px solid #d6dae2;padding-top:8px"><span>OPENSPAIN / PROGRAMA CIUDADANO / BORRADOR 0.1</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
  });
  console.log(`PDF generado: ${path} · ${count} ejes · ${measures} elementos de lista del documento completo.`);
} finally {
  if (browser) await browser.close();
  if (server && server.exitCode === null) server.kill('SIGTERM');
}
