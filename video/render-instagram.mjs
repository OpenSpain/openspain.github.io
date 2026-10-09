import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { synth } from './audio.mjs';
import { getInstagramVideos } from './instagram.mjs';

const dir = dirname(fileURLToPath(import.meta.url));
const output = join(dir, 'instagram');
const videos = getInstagramVideos(await readFile(join(dir, '../PROGRAMA.md'), 'utf8'));
const selectedId = process.argv.indexOf('--only');
const selected = selectedId === -1 ? videos : videos.filter(video => video.id === process.argv[selectedId + 1]);
if (!selected.length) throw new Error('Vídeo desconocido. Usa 00-decalogo o eje-01 a eje-31.');

async function run(command, args) {
  await new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: ['ignore', 'ignore', 'inherit'] });
    process.on('error', reject);
    process.on('close', code => code === 0 ? resolve() : reject(new Error(`${command}: salida ${code}`)));
  });
}

function timestamp(seconds) {
  return `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor(seconds / 60) % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}.000`;
}

await mkdir(output, { recursive: true });
await writeFile(join(output, 'guiones.json'), JSON.stringify(videos, null, 2));
await writeFile(join(output, 'descripciones.txt'), videos.map(video =>
  `=== ${video.id} (${video.duration} segundos) ===\n${video.caption}`).join('\n\n'));
const temporary = await mkdtemp(join(output, '.render-'));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(join(dir, 'instagram.html')).href);
  await page.evaluate(() => window.ready);
  for (const video of selected) {
    console.log(`Renderizando ${video.id}: ${video.duration}s, ${video.scenes.length} escenas`);
    let elapsed = 0;
    const cues = [];
    const segments = [];
    for (const [index, scene] of video.scenes.entries()) {
      await page.evaluate(({ scene, index, total }) => window.showScene(scene, index, total),
        { scene, index, total: video.scenes.length });
      const image = join(temporary, `scene-${index}.png`);
      await page.screenshot({ path: image });
      if (index === 0) await page.screenshot({ path: join(output, `${video.id}-portada.jpg`), type: 'jpeg', quality: 90 });
      const segment = join(temporary, `scene-${index}.mp4`);
      await run('ffmpeg', ['-y', '-loglevel', 'error', '-loop', '1', '-i', image,
        '-t', String(scene.duration), '-vf',
        `fps=30,fade=t=in:st=0:d=0.25,fade=t=out:st=${scene.duration - 0.25}:d=0.25,format=yuv420p`,
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', '-threads', '2', '-an', segment]);
      segments.push(`file 'scene-${index}.mp4'`);
      cues.push(`${timestamp(elapsed)} --> ${timestamp(elapsed + scene.duration)}\n${[scene.label, scene.title, scene.body].filter(Boolean).join('\n')}`);
      elapsed += scene.duration;
    }
    const wav = join(temporary, 'soundtrack.wav');
    const hits = video.scenes.map((_, index) => video.scenes.slice(0, index).reduce((sum, scene) => sum + scene.duration, 0));
    synth({ duration: elapsed, hits, flashes: hits, pace: (elapsed - 8) / 27, out: wav });
    const list = join(temporary, 'segments.txt');
    await writeFile(list, segments.join('\n'));
    const pending = join(temporary, 'finished.mp4');
    await run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list,
      '-i', wav, '-c:v', 'copy', '-af',
      'alimiter=limit=0.5:level=false,loudnorm=I=-14:TP=-2:LRA=11',
      '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', pending]);
    await rename(pending, join(output, `${video.id}.mp4`));
    await writeFile(join(output, `${video.id}.vtt`), `WEBVTT\n\n${cues.join('\n\n')}\n`);
    console.log(`OK ${video.id}`);
  }
} finally {
  await browser.close();
  await rm(temporary, { recursive: true, force: true });
}
