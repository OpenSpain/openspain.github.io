import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const icon = await readFile(new URL('favicon.svg', import.meta.url), 'utf8');
const monogram = icon.match(/<g id="os-monogram">([\s\S]*?)<\/g>/)?.[1];
if (!monogram) throw new Error('No se encuentra el monograma OS en favicon.svg.');
const font = await readFile(new URL('fonts/manrope-variable.ttf', import.meta.url));
const mark = color => monogram.replaceAll('class="os-symbol"', `color="${color}"`);
const wordmark = color => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="280" viewBox="0 0 1200 280" role="img" aria-labelledby="title">
  <title id="title">OpenSpain: monograma OS y nombre</title>
  <style>@font-face { font-family: Manrope; src: url(data:font/ttf;base64,${font.toString('base64')}) format('truetype'); font-weight: 200 800; }</style>
  <g transform="translate(32 36) scale(3.25)">${mark(color)}</g>
  <text x="272" y="185" fill="${color}" font-family="Manrope, sans-serif" font-size="144" font-weight="800" letter-spacing="-7">OpenSpain.</text>
</svg>\n`;
const assets = [
  ['openspain-logo.svg', wordmark('#101014'), 'openspain-logo.png'],
  ['openspain-logo-light.svg', wordmark('#f5f5f7')],
  ['openspain-instagram.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" role="img" aria-labelledby="title">
  <title id="title">OpenSpain: monograma OS para perfil de Instagram</title>
  <rect width="1080" height="1080" fill="#101014"/>
  <g transform="translate(156 156) scale(12)">${mark('#c6f36b')}</g>
</svg>\n`, 'openspain-instagram.png'],
];
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const [filename, svg, png] of assets) {
    await writeFile(new URL(filename, import.meta.url), svg);
    if (!png) continue;
    await page.goto(new URL(filename, import.meta.url).href);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('svg').screenshot({
      path: fileURLToPath(new URL(png, import.meta.url)),
      omitBackground: true,
    });
    console.log(`Generados ${filename} y ${png}.`);
  }
} finally {
  await browser.close();
}
