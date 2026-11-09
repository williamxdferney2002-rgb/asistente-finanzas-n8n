// Ejecuta las pruebas locales incluidas; nunca llama a servicios del proyecto.
'use strict';
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const cases = [
  ['scripts/simular_code.js', 'flujos/finanzas/finanzas-bot-v25.json', 'Normalizar', 'tests/finanzas-normalizar.casos.json'],
  ['tests/asistente-publico.test.js'],
  ['tests/tablero-publico.test.js'],
];
for (const args of cases) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}
console.log('PASS: todas las pruebas locales incluidas. No se ejecutaron servicios reales.');
