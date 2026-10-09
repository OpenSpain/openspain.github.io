export const pages = [
  ['index.html', 'Inicio'],
  ['cambios.html', 'Cambios'],
  ['programa.html', 'Programa'],
  ['como.html', 'Cómo lo impulsamos'],
  ['transparencia.html', 'Transparencia'],
  ['participa.html', 'Participa'],
];

export function legacyTarget(hash) {
  if (/^#eje-(?:[1-9]|[12]\d|3[01])$/.test(hash)) return `programa.html${hash}`;
  const destinations = {
    '#programa': 'programa.html#programa', '#datos': 'programa.html#datos',
    '#exigencias': 'programa.html#exigencias', '#diagnostico': 'programa.html#diagnostico',
    '#prioridades': 'cambios.html#prioridades', '#metodo': 'como.html#metodo',
    '#plan': 'como.html#plan', '#donaciones': 'transparencia.html#donaciones',
    '#registro-donaciones': 'transparencia.html#registro-donaciones',
    '#participa': 'participa.html#participa',
  };
  return destinations[hash];
}
