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
  ['/informe.html', ['informe.html', 'text/html; charset=utf-8']],
  ['/informe.css', ['informe.css', 'text/css; charset=utf-8']],
  ['/informe.js', ['informe.js', 'text/javascript; charset=utf-8']],
  ['/OpenSpain-Programa.pdf', ['OpenSpain-Programa.pdf', 'application/pdf']],
  ['/OpenSpain-Presentacion.pdf', ['OpenSpain-Presentacion.pdf', 'application/pdf']],
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
    response.writeHead(200, {
      'Content-Type': file[1],
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
    });
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
