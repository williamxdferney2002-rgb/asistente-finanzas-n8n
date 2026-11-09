/** Crea un libro NUEVO de Asistente con encabezados y sin datos. No modifica libros existentes. */
function crearPlantillaAsistente() {
  const esquema = {
  "Operaciones": [
    "ID",
    "Clave origen",
    "Creado",
    "Actualizado",
    "Tipo entrada",
    "Acción",
    "Estado",
    "Execution ID",
    "Mensaje",
    "Respuesta",
    "Error"
  ],
  "Por confirmar": [
    "ID",
    "Creado",
    "Acción",
    "Datos",
    "Pregunta",
    "Estado",
    "Respuesta",
    "Fecha respuesta",
    "Expira"
  ],
  "Pendientes": [
    "ID",
    "Pendiente",
    "Estado",
    "Fecha límite",
    "ID Task",
    "ID Calendar",
    "Creado",
    "Completado",
    "Sync",
    "Modificado"
  ],
  "Recordatorios": [
    "ID",
    "Mensaje",
    "Fecha evento",
    "Repetir",
    "Antelación (min)",
    "Próximo aviso",
    "Estado",
    "ID pendiente",
    "ID Calendar",
    "Creado",
    "Sync",
    "ID mensaje aviso",
    "Modificado"
  ],
  "Claves": [
    "ID",
    "Servicio",
    "Usuario o correo",
    "Contraseña",
    "Notas",
    "Actualizado"
  ],
  "Habitos": [
    "ID",
    "Hábito",
    "Emoji",
    "Días",
    "Alias",
    "Estado",
    "Creado",
    "Modificado",
    "Hasta"
  ],
  "Registro habitos": [
    "ID",
    "ID hábito",
    "Hábito",
    "Fecha",
    "Estado",
    "Origen",
    "Registrado",
    "Modificado",
    "ID Task",
    "ID lista"
  ]
};
  const libro = SpreadsheetApp.create('Plantilla Asistente');
  libro.setSpreadsheetTimeZone('America/Bogota');
  Object.entries(esquema).forEach(([nombre, columnas], indice) => {
    const hoja = indice === 0 ? libro.getSheets()[0].setName(nombre) : libro.insertSheet(nombre);
    hoja.getRange(1, 1, 1, columnas.length).setValues([columnas]).setFontWeight('bold');
    hoja.setFrozenRows(1);
  });
  Logger.log(libro.getUrl());
  return libro.getUrl();
}
