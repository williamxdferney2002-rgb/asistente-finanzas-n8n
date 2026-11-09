/** Pruebas locales con entradas sintéticas. Ejecutar: node tests/asistente-publico.test.js */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const files = [
  'asistente/asistente-entrada-v6.4.json',
  'asistente/asistente-reloj-v6.1.json',
  'asistente/asistente-errores-v1.1.json',
  'router/router-v2.json',
  'whatsapp/whatsapp-entrada-v2.json',
];
const flows = {};
let codeCount = 0;
for (const filename of files) {
  const flow = JSON.parse(fs.readFileSync(path.join(root, 'flujos', filename), 'utf8'));
  flows[filename] = flow;
  const names = new Set(flow.nodes.map(node => node.name));
  assert.equal(names.size, flow.nodes.length, 'Nombres únicos: ' + filename);
  assert.equal(new Set(flow.nodes.map(node => node.id)).size, flow.nodes.length, 'IDs únicos: ' + filename);
  assert.equal(flow.active, false, 'Flujo apagado: ' + filename);
  assert.deepEqual(flow.pinData, {}, 'Sin datos fijados: ' + filename);
  assert(!flow.id && !flow.meta && !flow.staticData, 'Sin metadatos privados: ' + filename);
  for (const [name, types] of Object.entries(flow.connections)) {
    assert(names.has(name), 'Origen existente: ' + name);
    for (const outputs of Object.values(types)) {
      for (const links of outputs) {
        for (const link of links) assert(names.has(link.node), 'Destino existente: ' + link.node);
      }
    }
  }
  for (const node of flow.nodes) {
    if (node.type === 'n8n-nodes-base.code') {
      new AsyncFunction(node.parameters.jsCode);
      codeCount++;
    }
  }
  console.log('PASS estructura: ' + filename);
}

const getCode = (filename, name) => flows[filename].nodes.find(node => node.name === name).parameters.jsCode;
const normalizer = getCode(files[0], 'Normalizar');
const normalize = update => new Function('$input', normalizer)({ first: () => ({ json: update }) })[0].json;
const textUpdate = { update_id: 1, message: { message_id: 1, chat: { id: 123456789 }, from: { id: 123456789 }, text: 'crea una tarea de ejemplo' } };
assert.equal(normalize(textUpdate).chat_id, '123456789');
assert.equal(normalize(textUpdate).clave, normalize(textUpdate).clave);
assert(normalize({ update_id: 2 }).no_admitido);
assert.equal(normalize({ update_id: 3, callback_query: { id: 'cb', from: { id: 123456789 }, data: 'a:pc:demo:si', message: { message_id: 1, text: 'prueba' } } }).callback_data, 'pc:demo:si');
console.log('PASS Normalizar: 4/4 aserciones sintéticas');

const router = getCode(files[3], 'Decidir');
const state = {};
const decide = update => new Function('$input', '$getWorkflowStaticData', '$execution', router)(
  { first: () => ({ json: update }) }, () => state, { id: 'synthetic-test' }
)[0].json;
assert.equal(decide({ update_id: 1, message: { chat: { id: 123456789 }, text: 'pagué 10k de almuerzo' } }).destino, 'finanzas');
assert.equal(decide({ update_id: 2, message: { chat: { id: 123456789 }, text: 'recuérdame estudiar mañana' } }).destino, 'asistente');
assert.equal(decide({ update_id: 3, message: { chat: { id: 999 }, text: '/agenda' } }).destino, 'finanzas');
assert.equal(decide({ update_id: 4, message: { chat: { id: 123456789 }, photo: [{ file_id: 'DEMO' }], caption: 'recuérdame' } }).destino, 'finanzas');
console.log('PASS Decidir Router: 4/4 aserciones sintéticas');

const adapter = getCode(files[4], 'Adaptar WhatsApp');
const adapt = items => new Function('$input', adapter)({ all: () => items.map(json => ({ json })) });
const whatsappInput = {
  waPhoneNumberId: 'CONFIGURE_WHATSAPP_PHONE_NUMBER_ID',
  metadata: { phone_number_id: 'CONFIGURE_WHATSAPP_PHONE_NUMBER_ID' },
  messages: [{ from: 'CONFIGURE_WHATSAPP_ALLOWED_NUMBER', id: 'wamid.DEMO', type: 'text', timestamp: '1', text: { body: 'agenda de prueba' } }],
};
assert.equal(adapt([whatsappInput])[0].json.update.message.chat.id, 123456789);
assert.equal(adapt([whatsappInput])[0].json.update.update_id, adapt([whatsappInput])[0].json.update.update_id);
assert.deepEqual(adapt([{ ...whatsappInput, messages: [{ ...whatsappInput.messages[0], from: 'NOT_ALLOWED' }] }]), []);
assert.deepEqual(adapt([{ ...whatsappInput, messages: [{ ...whatsappInput.messages[0], id: '' }] }]), []);
console.log('PASS Adaptar WhatsApp: 4/4 aserciones sintéticas');

const initializer = fs.readFileSync(path.join(root, 'plantillas', 'CrearPlantillaAsistente.gs'), 'utf8');
new vm.Script(initializer);
let created = 0;
const sheets = [];
function makeSheet() {
  const sheet = {
    name: 'Sheet1', headers: null,
    setName(name) { this.name = name; return this; },
    getRange(row, column, rows, columns) {
      assert.equal(row, 1); assert.equal(column, 1); assert.equal(rows, 1);
      return {
        setValues(values) {
          assert.equal(values[0].length, columns); sheet.headers = values[0];
          return { setFontWeight(value) { assert.equal(value, 'bold'); } };
        },
      };
    },
    setFrozenRows(number) { assert.equal(number, 1); },
  };
  return sheet;
}
sheets.push(makeSheet());
const book = {
  setSpreadsheetTimeZone(zone) { assert.equal(zone, 'America/Bogota'); },
  getSheets() { return sheets; },
  insertSheet(name) { const sheet = makeSheet(); sheet.setName(name); sheets.push(sheet); return sheet; },
  getUrl() { return 'https://example.invalid/synthetic-sheet'; },
};
const sandbox = {
  SpreadsheetApp: { create(name) { created++; assert.equal(name, 'Plantilla Asistente'); return book; } },
  Logger: { log() {} },
};
vm.createContext(sandbox);
vm.runInContext(initializer, sandbox);
assert.equal(sandbox.crearPlantillaAsistente(), 'https://example.invalid/synthetic-sheet');
assert.equal(created, 1);
assert.equal(sheets.length, 7);
assert(sheets.find(sheet => sheet.name === 'Habitos').headers.includes('Hasta'));
assert(sheets.every(sheet => sheet.headers && sheet.headers.length));
console.log('PASS inicializador: libro nuevo, 7 pestañas, únicamente encabezados');
console.log(`PASS: ${codeCount} nodos Code compilan; 12/12 aserciones sintéticas e inicializador correctos.`);
console.log('Sin servicios externos: no prueba n8n, permisos, concurrencia ni persistencia real.');
