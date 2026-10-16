export const pages = [
  ['index.html', 'Inicio'],
  ['cambios.html', 'Cambios'],
  ['programa.html', 'Programa'],
  ['como.html', 'Cómo lo impulsamos'],
  ['transparencia.html', 'Valores'],
  ['participa.html', 'Participa'],
];

export function publicPath(filename) {
  return filename === 'index.html' ? '' : filename.replace(/\.html$/, '');
}

export function legacyTarget(hash) {
  if (/^#eje-(?:[1-9]|[12]\d|3[01])$/.test(hash)) return `programa${hash}`;
  const destinations = {
    '#programa': 'programa#programa', '#datos': 'programa#datos',
    '#exigencias': 'programa#exigencias', '#diagnostico': 'programa#diagnostico',
    '#prioridades': 'cambios#prioridades', '#metodo': 'como#metodo',
    '#plan': 'como#plan', '#donaciones': 'transparencia#donaciones',
    '#registro-donaciones': 'transparencia#registro-donaciones',
    '#participa': 'participa#participa',
  };
  return destinations[hash];
}
