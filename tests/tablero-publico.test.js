/**
 * Pruebas del empaque público, sin Google, red ni paquetes instalados.
 * Ejecutar desde cualquier carpeta: node tests/tablero-publico.test.js
 * No prueba las escrituras financieras, la interfaz visual ni servicios reales.
 */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = filename => fs.readFileSync(path.join(root, filename), 'utf8');
const json = filename => JSON.parse(read(filename));
const plain = value => JSON.parse(JSON.stringify(value));
const schema = json('plantillas/finanzas-esquema.json').hojas;
const demo = json('plantillas/datos-demo.example.json');
const dashboardSource = read('apps-script/tablero/Codigo.gs');
const initializerSource = read('plantillas/CrearPlantilla.gs');
let groups = 0;

function check(name, run) {
  run();
  groups++;
  console.log('PASS ' + name);
}

check('sintaxis del tablero, sus scripts HTML y el inicializador', () => {
  new vm.Script(dashboardSource, { filename: 'Codigo.gs' });
  new vm.Script(initializerSource, { filename: 'CrearPlantilla.gs' });
  const blocks = [...read('apps-script/tablero/Index.html').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1]).filter(script => script.trim());
  assert.equal(blocks.length, 2, 'Los dos bloques JavaScript de la interfaz están presentes');
  blocks.forEach((script, index) => new vm.Script(script, { filename: 'Index.html:script-' + index }));
});

check('esquema de 22 tablas y campos de las nueve filas ficticias', () => {
  assert.equal(Object.keys(schema).length, 22);
  for (const [name, columns] of Object.entries(schema)) {
    assert(columns.length > 0, 'Encabezados no vacíos: ' + name);
    assert.equal(new Set(columns).size, columns.length, 'Encabezados únicos: ' + name);
    assert(columns.every(column => typeof column === 'string' && column.trim()), 'Encabezados válidos: ' + name);
  }
  let rows = 0;
  for (const [name, records] of Object.entries(demo.hojas)) {
    assert(schema[name], 'Tabla de ejemplo definida: ' + name);
    for (const record of records) {
      rows++;
      for (const field of Object.keys(record)) {
        assert(schema[name].includes(field), 'Campo del ejemplo definido: ' + name + '.' + field);
      }
    }
  }
  assert.equal(rows, 9);
  assert(schema['Log Bot'].includes('Duración (s)'), 'Columna utilizada por las versiones finales');
});

check('las 20 tablas leídas por Finanzas v25 existen en la plantilla', () => {
  const flow = json('flujos/finanzas/finanzas-bot-v25.json');
  const reader = flow.nodes.find(node => node.name === 'Leer hoja');
  assert(reader, 'Nodo Leer hoja presente');
  const ranges = new URL(reader.parameters.url).searchParams.getAll('ranges');
  assert.equal(ranges.length, 20);
  const tables = ranges.map(range => range.split('!')[0].replace(/^'|'$/g, ''));
  assert.equal(new Set(tables).size, 20);
  tables.forEach(name => assert(schema[name], 'Tabla de lectura disponible: ' + name));
});

check('calcular produce 88.000 COP con los datos sintéticos públicos', () => {
  const sandbox = { module: { exports: {} }, Date };
  vm.createContext(sandbox);
  vm.runInContext(dashboardSource, sandbox, { filename: 'Codigo.gs' });
  const sheetNames = plain(vm.runInContext('HOJAS', sandbox));
  const tables = {};
  for (const [key, name] of Object.entries(sheetNames)) {
    assert(schema[name], 'Tabla del tablero disponible: ' + name);
    tables[key] = plain(demo.hojas[name] || []);
  }
  const result = sandbox.module.exports.calcular(tables, new Date('2026-01-03T17:00:00.000Z'));
  assert.equal(result.kpis.disponible, 88000);
  assert.equal(result.kpis.patrimonio, 88000);
  for (const name of ['cdt', 'inversiones', 'meDeben', 'deudaTarjetas', 'yoDebo']) {
    assert.equal(result.kpis[name], 0, 'Indicador sin saldo en el ejemplo: ' + name);
  }
  assert.equal(result.cuentas.length, 1);
  assert.equal(result.cuentas[0].saldo, 88000);
  assert.equal(result.movimientos.length, 1);
  assert.equal(result.movimientos[0].m, 12000);
});

// Mocks limitados a las operaciones usadas por el inicializador de encabezados.
function makeBook(seed = {}) {
  const sheets = new Map();
  const stats = { inserts: 0, writes: 0, expansions: 0, freezes: 0 };
  function makeSheet(name, initialRows = []) {
    const sheet = {
      name,
      rows: plain(initialRows),
      maxColumns: Math.max(26, ...initialRows.map(row => row.length)),
      frozen: 0,
      getLastRow() { return this.rows.length; },
      getLastColumn() { return Math.max(0, ...this.rows.map(row => row.length)); },
      getMaxColumns() { return this.maxColumns; },
      insertColumnsAfter(after, amount) {
        assert.equal(after, this.maxColumns);
        assert(amount > 0);
        this.maxColumns += amount;
        stats.expansions++;
      },
      setFrozenRows(amount) { this.frozen = amount; stats.freezes++; },
      getRange(row, column, height, width) {
        assert.equal(row, 1);
        assert.equal(column, 1);
        assert.equal(height, 1);
        return {
          getValues() {
            return [Array.from({ length: width }, (_, i) => sheet.rows[0]?.[i] ?? '')];
          },
          setValues(values) {
            assert.equal(values.length, 1);
            assert.equal(values[0].length, width);
            assert.equal(sheet.rows.length, 0, 'El inicializador no debe sobrescribir contenido existente');
            sheet.rows = plain(values);
            stats.writes++;
          },
        };
      },
    };
    return sheet;
  }
  for (const [name, rows] of Object.entries(seed)) sheets.set(name, makeSheet(name, rows));
  const book = {
    sheets, stats,
    getSheetByName(name) { return sheets.get(name) || null; },
    insertSheet(name) {
      assert(!sheets.has(name), 'No debe recrear una tabla existente');
      const sheet = makeSheet(name);
      sheets.set(name, sheet);
      stats.inserts++;
      return sheet;
    },
  };
  book.snapshot = () => plain({
    stats,
    sheets: [...sheets].map(([name, sheet]) => ({ name, rows: sheet.rows, maxColumns: sheet.maxColumns, frozen: sheet.frozen })),
  });
  return book;
}

function initializer(book) {
  const sandbox = {
    SpreadsheetApp: { getActiveSpreadsheet: () => book },
    console: { log() {} },
  };
  vm.createContext(sandbox);
  vm.runInContext(initializerSource, sandbox, { filename: 'CrearPlantilla.gs' });
  assert.deepEqual(plain(vm.runInContext('ESQUEMA_FINANZAS_PUBLICO', sandbox)), schema,
    'El esquema embebido del inicializador coincide con el JSON público');
  return sandbox.crearPlantillaFinanzas;
}

check('inicializador crea solo encabezados, amplía columnas y conserva la hoja ajena', () => {
  const book = makeBook({ 'Hoja vacía de ejemplo': [] });
  const result = initializer(book)();
  assert.equal(result.creadas.length, 22);
  assert.equal(result.conservadas.length, 0);
  assert.equal(book.stats.inserts, 22);
  assert.equal(book.stats.writes, 22);
  assert.equal(book.sheets.size, 23);
  assert.equal(book.getSheetByName('Movimientos').maxColumns, 27);
  assert.equal(book.stats.expansions, 1);
  assert.deepEqual(book.getSheetByName('Hoja vacía de ejemplo').rows, []);
  for (const [name, columns] of Object.entries(schema)) {
    const sheet = book.getSheetByName(name);
    assert.deepEqual(sheet.rows, [columns], 'Solo encabezados: ' + name);
    assert.equal(sheet.frozen, 1);
  }
});

check('repetir el inicializador no escribe ni cambia los datos existentes', () => {
  const book = makeBook();
  const run = initializer(book);
  run();
  // Dato sintético de control para detectar una sobrescritura al repetir.
  book.getSheetByName('Movimientos').rows.push(['DEMO-CONSERVAR']);
  const before = book.snapshot();
  const result = run();
  assert.equal(result.creadas.length, 0);
  assert.equal(result.conservadas.length, 22);
  assert.deepEqual(book.snapshot(), before);
});

check('encabezados incompatibles se rechazan antes de crear o sobrescribir tablas', () => {
  const book = makeBook({
    'Hoja existente de ejemplo': [['Dato sintético que debe conservarse']],
    'Parámetros': [['Encabezado incompatible'], ['DEMO-CONSERVAR']],
  });
  const before = book.snapshot();
  assert.throws(() => initializer(book)(), /encabezados diferentes/);
  assert.deepEqual(book.snapshot(), before, 'No debe haber creaciones ni cambios parciales');
});

check('sin hoja activa se rechaza la inicialización', () => {
  assert.throws(() => initializer(null)(), /Abre Apps Script desde una hoja/);
});

console.log(`PASS: ${groups}/${groups} grupos de comprobaciones del tablero y la plantilla.`);
console.log('Sin red ni servicios: no prueba Google, n8n, permisos, escrituras financieras ni presentación visual.');
