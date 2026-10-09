import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/program.js', ['program.js', 'text/javascript; charset=utf-8']],
  ['/charts.js', ['charts.js', 'text/javascript; charset=utf-8']],
  ['/PROGRAMA.md', ['PROGRAMA.md', 'text/plain; charset=utf-8']],
  ['/favicon.svg', ['favicon.svg', 'image/svg+xml']],
  ['/bandera.svg', ['bandera.svg', 'image/svg+xml']],
  ['/openspain-logo.svg', ['openspain-logo.svg', 'image/svg+xml']],
  ['/openspain-logo.png', ['openspain-logo.png', 'image/png']],
  ['/informe.html', ['informe.html', 'text/html; charset=utf-8']],
  ['/informe.css', ['informe.css', 'text/css; charset=utf-8']],
  ['/informe.js', ['informe.js', 'text/javascript; charset=utf-8']],
  ['/OpenSpain-Programa.pdf', ['OpenSpain-Programa.pdf', 'application/pdf']],
  ['/OpenSpain-Presentacion.pdf', ['OpenSpain-Presentacion.pdf', 'application/pdf']],
  ['/video/OpenSpain-Hazte-Simpatizante.mp4', ['video/OpenSpain-Hazte-Simpatizante.mp4', 'video/mp4']],
  ['/video/hazte-simpatizante-portada.jpg', ['video/hazte-simpatizante-portada.jpg', 'image/jpeg']],
  ['/video/hazte-simpatizante-es.vtt', ['video/hazte-simpatizante-es.vtt', 'text/vtt; charset=utf-8']],
]);
const port = Number(process.env.PORT || 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT debe ser un entero entre 1 y 65535.');
}
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const file = files.get(pathname);
  if (!file || !['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Recurso no encontrado.');
    return;
  }
  try {
    const content = await readFile(new URL(file[0], import.meta.url));
    const headers = {
      'Content-Type': file[1],
      'Content-Length': content.length,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
    };
    if (file[1] === 'video/mp4') {
      headers['Accept-Ranges'] = 'bytes';
      if (request.method === 'GET' && request.headers.range) {
        const range = request.headers.range.match(/^bytes=(\d*)-(\d*)$/);
        const start = range?.[1] ? Number(range[1]) : Math.max(0, content.length - Number(range?.[2]));
        const end = range?.[1] && range[2] ? Math.min(Number(range[2]), content.length - 1) : content.length - 1;
        if (!range || (!range[1] && !range[2]) || !Number.isSafeInteger(start)
          || !Number.isSafeInteger(end) || start >= content.length || end < start) {
          response.writeHead(416, { 'Content-Range': `bytes */${content.length}`, 'Content-Length': 0 });
          response.end();
          return;
        }
        const partial = content.subarray(start, end + 1);
        response.writeHead(206, {
          ...headers, 'Content-Length': partial.length, 'Content-Range': `bytes ${start}-${end}/${content.length}`,
        });
        response.end(partial);
        return;
      }
    }
    response.writeHead(200, headers);
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    console.error(`No se pudo servir ${file[0]}:`, error);
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('No se pudo cargar el recurso.');
  }
});
server.on('error', error => {
  console.error('No se pudo iniciar OpenSpain:', error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`OpenSpain · http://127.0.0.1:${port}`);
});
