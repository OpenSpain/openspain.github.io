// Renders video.html frame by frame with Playwright and encodes an MP4 with ffmpeg.
// Usage: node video/render.mjs [--preview 1,4.6,13.9,...]   (preview writes PNG stills only)
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync, rmSync } from 'node:fs';
import { synth } from './audio.mjs';

const dir = dirname(fileURLToPath(import.meta.url));
const FPS = 30;
const previewArg = process.argv.indexOf('--preview');
const preview = previewArg > -1 ? process.argv[previewArg + 1].split(',').map(Number) : null;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(join(dir, 'video.html')).href);
await page.evaluate(() => window.ready);
const { duration, hits, flashes, pace } = await page.evaluate(() => ({ duration: window.DURATION, hits: window.HITS, flashes: window.FLASHES, pace: window.PACE }));

if (preview) {
  mkdirSync(join(dir, 'preview'), { recursive: true });
  for (const t of preview) {
    await page.evaluate(t => window.render(t), t);
    await page.screenshot({ path: join(dir, 'preview', `t${t.toFixed(2)}.png`) });
  }
  await browser.close();
  process.exit(0);
}

const wav = join(dir, 'soundtrack.wav');
synth({ duration, hits, flashes, pace, out: wav });
process.on('exit', () => rmSync(wav, { force: true }));

const out = join(dir, 'OpenSpain-Hazte-Simpatizante.mp4');
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
  '-i', wav,
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
  '-af', 'alimiter=limit=0.5:attack=0.5:release=40:level=false,loudnorm=I=-14:TP=-2:LRA=11,alimiter=limit=0.79:attack=0.5:release=30:level=false', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });

const frames = Math.round(duration * FPS);
for (let i = 0; i < frames; i++) {
  await page.evaluate(t => window.render(t), i / FPS);
  const png = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 60 === 0) process.stdout.write(`\r${i}/${frames}`);
}
ff.stdin.end();
await new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg ' + c)))));
await browser.close();
console.log(`\nOK ${out}`);
