// Renders video.html frame by frame with Playwright and encodes an MP4 with ffmpeg.
// Usage: node video/render.mjs [--changes] [--keep-audio | --audio-only | --preview 1,4.6,13.9,...]
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, mkdirSync, rmSync, readFileSync, renameSync } from 'node:fs';
import { synth } from './audio.mjs';
import { getChangeVideoMessages } from '../program.js';

const dir = dirname(fileURLToPath(import.meta.url));
const FPS = 30;
const changes = process.argv.includes('--changes');
const audioOnly = process.argv.includes('--audio-only');
const keepAudio = process.argv.includes('--keep-audio');
const previewArg = process.argv.indexOf('--preview');
const preview = previewArg > -1 ? process.argv[previewArg + 1].split(',').map(Number) : null;
if (audioOnly && keepAudio) throw new Error('--audio-only y --keep-audio no se pueden combinar.');
const out = join(dir, changes ? 'OpenSpain-Cambios.mp4' : 'OpenSpain-Hazte-Simpatizante.mp4');
if (keepAudio && !preview && !existsSync(out)) throw new Error(`No existe el MP4 cuyo audio se debe conservar: ${out}`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: changes ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(join(dir, changes ? 'cambios.html' : 'video.html')).href);
if (changes) {
  const messages = getChangeVideoMessages(readFileSync(join(dir, '../PROGRAMA.md'), 'utf8'));
  await page.evaluate(messages => window.initialize(messages), messages);
  for (const time of [1, 7, 13, 19, 25, 31, 37, 43, 49, 56]) {
    await page.evaluate(time => window.render(time), time);
    const overflow = await page.evaluate(() => [...document.querySelectorAll('#copy > *, .footer, .logo')]
      .some(node => {
        const rect = node.getBoundingClientRect();
        const limit = node.parentElement.id === 'copy' ? 900 : 1080;
        return rect.left < 0 || rect.right > 1920 || rect.bottom > limit || node.scrollWidth > node.clientWidth + 1;
      }));
    if (overflow) throw new Error(`Texto fuera de encuadre en el segundo ${time}.`);
  }
} else {
  await page.evaluate(() => window.ready);
}
const duration = await page.evaluate(() => window.DURATION);
const soundtrack = await page.evaluate(() => ({ hits: window.HITS, flashes: window.FLASHES, pace: window.PACE }));
if (!changes) {
  const times = await page.evaluate(() => [...document.querySelectorAll('.scene')].map(scene =>
    Math.min(window.DURATION - 0.1, (Number(scene.dataset.out) - 0.1) * window.PACE)));
  for (const time of times) {
    await page.evaluate(time => window.render(time), time);
    const overflow = await page.evaluate(() => [...document.querySelectorAll('.scene.on .el.on, .logo')]
      .filter(node => node.textContent.trim())
      .some(node => {
        const rect = node.getBoundingClientRect();
        return rect.left < 0 || rect.right > 1080 || rect.top < 0 || rect.bottom > 1820
          || node.scrollWidth > node.clientWidth + 1;
      }));
    if (overflow) throw new Error(`Texto fuera de encuadre en el segundo ${time}.`);
  }
}

if (preview) {
  mkdirSync(join(dir, 'preview'), { recursive: true });
  for (const t of preview) {
    await page.evaluate(t => window.render(t), t);
    await page.screenshot({ path: join(dir, 'preview', `t${t.toFixed(2)}.png`) });
  }
  await browser.close();
  process.exit(0);
}

const wav = join(dir, changes ? 'cambios-soundtrack.wav' : 'soundtrack.wav');
if (!keepAudio) synth({ duration, ...soundtrack, out: wav });
process.on('exit', () => rmSync(wav, { force: true }));

const pending = join(dir, changes ? '.OpenSpain-Cambios.pending.mp4' : '.OpenSpain-Hazte-Simpatizante.pending.mp4');
process.on('exit', () => rmSync(pending, { force: true }));
const videoArgs = audioOnly
  ? ['-i', out, '-i', wav, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy']
  : ['-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', '-i', keepAudio ? out : wav,
    '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'libx264', '-preset', 'fast', '-threads', '2', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
    '-vf', 'scale=out_color_matrix=bt709', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709'];
const audioArgs = keepAudio ? ['-c:a', 'copy'] : [
  '-af', 'alimiter=limit=0.5:attack=5:release=40:level=false,loudnorm=I=-14:TP=-4:LRA=11',
  '-ar', '48000', '-c:a', 'aac', '-b:a', '192k',
];
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', ...videoArgs,
  ...audioArgs, '-shortest', '-movflags', '+faststart', pending],
{ stdio: [audioOnly ? 'ignore' : 'pipe', 'inherit', 'inherit'] });
const encoded = new Promise((resolve, reject) => {
  ff.once('error', reject);
  ff.once('close', code => code === 0 ? resolve() : reject(new Error('ffmpeg ' + code)));
});

const frames = Math.round(duration * FPS);
for (let i = 0; !audioOnly && i < frames; i++) {
  await page.evaluate(t => window.render(t), i / FPS);
  const png = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 60 === 0) process.stdout.write(`\r${i}/${frames}`);
}
if (!audioOnly) ff.stdin.end();
await encoded;
renameSync(pending, out);
await browser.close();
console.log(`\nOK ${out}`);
