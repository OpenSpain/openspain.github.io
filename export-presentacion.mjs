import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const response = await page.goto(new URL('presentacion.html', import.meta.url).href);
  if (!response?.ok()) throw new Error('No se pudo abrir la hoja de presentación.');
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  const fits = await page.locator('.sheet').evaluate(sheet => {
    const printableHeight = (297 - 16 - 18) * 96 / 25.4;
    return sheet.getBoundingClientRect().height <= printableHeight
      && sheet.scrollWidth <= sheet.clientWidth
      && [...sheet.querySelectorAll('img')].every(image => image.complete && image.naturalWidth > 0);
  });
  if (!fits) throw new Error('La presentación no cabe en una página A4 o contiene una imagen sin cargar.');
  const path = fileURLToPath(new URL('OpenSpain-Presentacion.pdf', import.meta.url));
  await page.pdf({ path, format: 'A4', preferCSSPageSize: true, printBackground: true });
  console.log(`Hoja de presentación generada: ${path}`);
} finally {
  await browser.close();
}
