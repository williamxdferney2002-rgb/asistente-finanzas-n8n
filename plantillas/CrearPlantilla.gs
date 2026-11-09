/**
 * Crea SOLO pestañas y encabezados de la plantilla pública.
 * Ejecutar manualmente en Apps Script vinculado a una hoja NUEVA.
 * No crea movimientos, no borra pestañas y no sobrescribe celdas existentes.
 * Fuente del esquema: finanzas-esquema.json. Sin datos personales.
 */
const ESQUEMA_FINANZAS_PUBLICO = {
  "Movimientos": [
    "ID",
    "Operación",
    "Clave origen",
    "Creado",
    "Modificado",
    "Fecha",
    "Hora",
    "Tipo",
    "Monto",
    "Moneda",
    "Cuenta",
    "Cuenta destino",
    "Comercio",
    "Persona",
    "Categoría",
    "Etiquetas",
    "Detalle",
    "Comentarios",
    "Referencia",
    "Cuotas",
    "Tasa",
    "Origen",
    "Link comprobante",
    "ID documento",
    "ID mensaje",
    "Estado revisión",
    "ID extracto"
  ],
  "Cuentas": [
    "ID",
    "Nombre",
    "Entidad",
    "Tipo",
    "Cuenta padre",
    "Moneda",
    "Saldo inicial",
    "Fecha saldo inicial",
    "Cupo",
    "Día de corte",
    "Día de pago",
    "Tasa EA",
    "Paga rendimientos",
    "Cobra 4x1000",
    "Fecha apertura",
    "Fecha vencimiento",
    "Fecha cierre",
    "Alias",
    "Activa",
    "Estado revisión",
    "Creado",
    "Modificado"
  ],
  "Cuotas tarjeta": [
    "ID",
    "ID compra",
    "Cuenta",
    "Comercio",
    "Nº",
    "Total cuotas",
    "Valor cuota",
    "Fecha de pago",
    "Estado",
    "Clave origen",
    "Creado"
  ],
  "Personas": [
    "Nombre",
    "Alias",
    "Relación",
    "Notas",
    "Estado revisión",
    "Creado"
  ],
  "Categorías": [
    "Nombre",
    "Tipo",
    "Qué incluye",
    "Activa"
  ],
  "Presupuestos": [
    "Mes",
    "Categoría",
    "Monto",
    "Notas",
    "Creado",
    "Modificado"
  ],
  "Metas": [
    "ID",
    "Nombre",
    "Cuenta",
    "Monto objetivo",
    "Fecha inicio",
    "Fecha objetivo",
    "Estado",
    "Notas",
    "Creado"
  ],
  "Recurrentes": [
    "ID",
    "Nombre",
    "Tipo",
    "Monto total",
    "Moneda",
    "Cuenta",
    "Categoría",
    "Frecuencia",
    "Día",
    "Mes (si es anual)",
    "Participantes (contándome)",
    "Personas que me pagan",
    "Recordar días antes",
    "Activa",
    "Último registro",
    "Estado revisión",
    "Notas"
  ],
  "Préstamos": [
    "ID",
    "Persona",
    "Fecha préstamo",
    "Cuenta de salida",
    "Monto prestado",
    "Nº cuotas",
    "Valor cuota",
    "Frecuencia",
    "Fecha primera cuota",
    "Cuenta de cobro habitual",
    "Estado",
    "Estado revisión",
    "Notas",
    "Creado"
  ],
  "Cuotas préstamo": [
    "ID",
    "ID préstamo",
    "Persona",
    "Nº",
    "Fecha",
    "Valor cuota",
    "Capital",
    "Interés",
    "Estado",
    "Fecha pago",
    "Valor recibido",
    "Cuenta donde llegó",
    "ID movimiento",
    "Clave origen"
  ],
  "Activos": [
    "Activo",
    "Nombre",
    "Tipo activo",
    "Cuenta",
    "Símbolo GOOGLEFINANCE",
    "Precio manual USD",
    "Fecha precio manual",
    "Activo vigente",
    "Notas"
  ],
  "Operaciones inversión": [
    "ID",
    "Fecha",
    "Cuenta",
    "Activo",
    "Tipo operación",
    "Cantidad",
    "Precio unitario USD",
    "Total USD",
    "Total COP",
    "Comisión COP",
    "Cuenta de pesos",
    "ID movimiento",
    "Estado revisión",
    "Notas",
    "Clave origen",
    "Creado"
  ],
  "Inversiones": [
    "Activo",
    "Tipo activo",
    "Cuenta",
    "Cantidad",
    "Precio USD",
    "Valor USD",
    "Valor COP",
    "Costo neto COP",
    "Ganancia COP",
    "Ganancia %"
  ],
  "Reventas": [
    "ID",
    "Operación",
    "Fecha compra",
    "Artículo",
    "Cantidad",
    "Costo total",
    "Cuenta de pago",
    "Cantidad vendida",
    "Cantidad uso propio",
    "Total vendido",
    "Fecha última venta",
    "Estado",
    "Notas",
    "Clave origen",
    "Creado",
    "Modificado"
  ],
  "Por confirmar": [
    "ID",
    "Creado",
    "Acción pendiente",
    "ID relacionado",
    "Tipo de duda",
    "Datos (JSON)",
    "Pregunta",
    "Opciones",
    "ID mensaje",
    "Estado",
    "Respuesta",
    "Fecha respuesta",
    "Intentos",
    "Expira"
  ],
  "Extractos": [
    "ID",
    "Banco",
    "Cuenta",
    "Periodo",
    "Fecha",
    "Descripción",
    "Monto",
    "Sentido",
    "Categoría sugerida",
    "Estado",
    "ID movimiento",
    "ID documento",
    "Clave origen",
    "Fecha carga",
    "Grupo",
    "Detalle (JSON)"
  ],
  "Comercios": [
    "Patrón",
    "Tipo",
    "Categoría",
    "Persona",
    "Cuenta contraparte",
    "Veces",
    "Actualizado"
  ],
  "Documentos": [
    "ID",
    "Creado",
    "Tipo documento",
    "Fecha del documento",
    "Cuenta",
    "Periodo",
    "Nombre archivo",
    "ID Drive",
    "Link Drive",
    "ID relacionado",
    "Estado procesamiento",
    "Clave origen",
    "Notas"
  ],
  "Historial": [
    "Fecha",
    "Efectivo y cuentas",
    "Inversiones COP",
    "Deuda tarjetas",
    "Cuotas tarjeta futuras",
    "Me deben",
    "Yo debo",
    "Patrimonio neto",
    "Gasto de la semana",
    "Gasto del mes",
    "Rendimientos de la semana"
  ],
  "Log Bot": [
    "FechaHora",
    "Run ID",
    "Origen",
    "ID mensaje",
    "Acción",
    "Tabla",
    "ID registro",
    "Resultado",
    "Error",
    "Datos recibidos",
    "Valor anterior",
    "Valor nuevo",
    "Duración (s)"
  ],
  "Parámetros": [
    "Clave",
    "Valor",
    "Descripción"
  ],
  "Listas": [
    "Tipos de movimiento",
    "Tipos de cuenta",
    "Estado revisión",
    "Estado cuota préstamo",
    "Estado cuota tarjeta",
    "Frecuencias",
    "Tipo recurrente",
    "Tipo activo",
    "Tipo operación inversión",
    "Estado reventa",
    "Estado meta",
    "Estado por confirmar",
    "Acción pendiente",
    "Sí/No",
    "Tipo documento",
    "Estado procesamiento"
  ]
};

function crearPlantillaFinanzas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Abre Apps Script desde una hoja de cálculo.');
  // Revisar TODO antes de escribir: evita dejar una creación parcial por headers incompatibles.
  for (const [nombre, columnas] of Object.entries(ESQUEMA_FINANZAS_PUBLICO)) {
    const sh = ss.getSheetByName(nombre);
    if (!sh || sh.getLastRow() === 0) continue;
    const existentes = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), columnas.length)).getValues()[0];
    const iguales = columnas.every((c, i) => String(existentes[i] || '') === c);
    if (!iguales) throw new Error('La pestaña "' + nombre + '" ya tiene encabezados diferentes. No se cambió ninguna pestaña. Usa una hoja nueva.');
  }
  const creadas = [], existentes = [];
  for (const [nombre, columnas] of Object.entries(ESQUEMA_FINANZAS_PUBLICO)) {
    let sh = ss.getSheetByName(nombre);
    if (!sh) sh = ss.insertSheet(nombre);
    if (sh.getLastRow() !== 0) { existentes.push(nombre); continue; }
    if (sh.getMaxColumns() < columnas.length) sh.insertColumnsAfter(sh.getMaxColumns(), columnas.length - sh.getMaxColumns());
    sh.getRange(1, 1, 1, columnas.length).setValues([columnas]);
    sh.setFrozenRows(1);
    creadas.push(nombre);
  }
  const resultado = { creadas, conservadas: existentes };
  console.log(JSON.stringify(resultado));
  return resultado;
}
