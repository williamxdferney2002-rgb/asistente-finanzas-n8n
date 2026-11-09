# Asistente personal y Router

Instantánea pública de los últimos archivos disponibles al preparar esta copia, el 8 de noviembre de 2026. No certifica qué versión está instalada en un servidor. Los originales se conservaron sin cambios.

| Componente | Archivo | Nodos |
|---|---|---:|
| Entrada | `flujos/asistente/asistente-entrada-v6.4.json` | 164 |
| Reloj | `flujos/asistente/asistente-reloj-v6.1.json` | 61 |
| Errores | `flujos/asistente/asistente-errores-v1.1.json` | 6 |
| Router | `flujos/router/router-v2.json` | 30 |

## Qué hace esta versión

Entrada recibe el mensaje original desde el Router y normaliza texto, voz y botones. Gestiona tareas únicas, tareas repetidas, recordatorios, agenda y claves. Reloj procesa avisos y sincroniza Google Calendar y Google Tasks. Las tareas repetidas conservan las pestañas históricas `Habitos` y `Registro habitos`; no son notas. La función de notas fue retirada en esta línea de versiones.

Router entrega mensajes financieros a Finanzas y mensajes de agenda/tareas al Asistente. Usa reglas de texto, prefijos de botones y una marca invisible U+2063 para respuestas del Asistente. Para mensajes ambiguos puede transcribir voz, clasificar con IA o preguntar el destino. Conserva temporalmente el update en static data al preguntar; ese estado privado de la instalación original no se distribuye.

La copia incluye los nodos de transporte WhatsApp presentes en estas versiones; la entrada de ese canal es opcional y tiene una guía separada en [whatsapp.md](whatsapp.md).

## Configuración propia

[config/asistente.example.json](../config/asistente.example.json) es un inventario de configuración y encabezados, no un archivo que n8n cargue automáticamente. No contiene credenciales reales. Reemplazar los siguientes valores en los JSON de una copia local antes de importarlos, o en todos sus nodos después de importarlos:

| Valor público | Sustitución |
|---|---|
| `123456789` | ID del chat autorizado de Telegram, en todos los componentes; es un dato ficticio y aparece como número y cadena. |
| `CONFIGURE_OWNER_NAME` | Nombre que usará el prompt del asistente. |
| `CONFIGURE_ASSISTANT_SHEET_ID` | ID de una hoja de Google Sheets propia para el Asistente. |
| `CONFIGURE_ASSISTANT_CALENDAR_ID` | ID del calendario propio de recordatorios. Las llamadas con `primary` consultan el calendario principal. |
| `CONFIGURE_ASSISTANT_WORKFLOW_ID` | ID que n8n asigne a Entrada al importarlo. |
| `CONFIGURE_FINANCE_WORKFLOW_ID` | ID que n8n asigne al Bot de Finanzas v25. |
| `CONFIGURE_ROUTER_WORKFLOW_ID` | ID que n8n asigne al Router. |
| `CONFIGURE_ASSISTANT_ERROR_WORKFLOW_ID` | ID del flujo de errores del Asistente importado. |
| `CONFIGURE_FINANCE_ERROR_WORKFLOW_ID` | ID del flujo de errores de Finanzas importado. |
| `CONFIGURE_WHATSAPP_ALLOWED_NUMBER` | Remitente autorizado de WhatsApp; solo si se habilita ese canal. |
| `CONFIGURE_WHATSAPP_PHONE_NUMBER_ID` | ID del número de negocio de WhatsApp; solo si se habilita ese canal. |

Todos los recursos guardados en caché en el export fueron retirados. Las selecciones de pestaña que eran números `gid` privados se expresan por nombre. Revisar sus selectores en el editor de n8n tras importar.

### Credenciales requeridas

Cada referencia `CONFIGURE_<tipo>` debe reasignarse a una credencial propia del tipo indicado en n8n. Nunca escribir su token dentro del JSON:

- `telegramApi`: el mismo bot para Router, Entrada, Reloj, Errores y Finanzas en la instalación compartida.
- `googleSheetsOAuth2Api`: acceso a la hoja propia.
- `googleCalendarOAuth2Api`: acceso al calendario principal y al calendario del Asistente.
- `googleTasksOAuth2Api`: acceso a las tareas propias. Se mantiene `@default` para tareas sueltas; el flujo busca o crea listas para tareas repetidas.
- `googlePalmApi`: modelo de IA seleccionado en los nodos Gemini. Los identificadores de modelo conservan el export; revisar su disponibilidad al instalar.
- `httpHeaderAuth`: autorización para el endpoint de transcripción configurado en los nodos Groq.
- `whatsAppApi` y `whatsAppTriggerApi`: únicamente para el canal WhatsApp.

### Hoja del Asistente

Crear una hoja vacía separada de Finanzas. El esquema público está en [plantillas/asistente-esquema.json](../plantillas/asistente-esquema.json). Para generar un libro nuevo, pegar [CrearPlantillaAsistente.gs](../plantillas/CrearPlantillaAsistente.gs) en un proyecto Apps Script propio, ejecutar `crearPlantillaAsistente` y copiar la URL que registra. El script crea un libro nuevo, sin modificar los existentes. Contiene exactamente siete pestañas, con sus encabezados en la fila 1: `Operaciones`, `Por confirmar`, `Pendientes`, `Recordatorios`, `Claves`, `Habitos` y `Registro habitos`. No cargar ninguna fila del proyecto original. Los encabezados se obtuvieron de los esquemas de escritura y de la lógica de tareas repetidas de los exports; comprobar la creación en una instalación de prueba.

`Habitos` requiere `Hasta` para guardar la fecha final de una repetición. Los nombres de las pestañas y encabezados forman parte del contrato del código y deben conservarse aunque las funciones visibles tengan otros nombres.

### Claves cifradas

Los nodos `Preparar clave` y `Buscar clave` leen `ASISTENTE_LLAVE` en el entorno del servidor y usan `require('crypto')`. La fuente requiere una llave de 32 bytes, representada en base64 o hexadecimal. Generar una llave propia, por ejemplo con `openssl rand -base64 32`, y guardarla fuera de Git. La configuración original requería permitir `crypto` y acceso a esa variable desde los nodos Code; comprobar el mecanismo de permisos y runners de la versión de n8n que se instale.

La llave no se incluye en este proyecto. El código conserva lectura de claves antiguas sin cifrar con una advertencia. Probar esta función únicamente con datos ficticios. La distribución no incluye claves, filas cifradas ni un almacén personal.

## Orden de instalación de un bot compartido

1. Crear credenciales propias, las dos hojas y los calendarios necesarios. Configurar los identificadores públicos anteriores y los encabezados.
2. Importar todos los flujos apagados. Los archivos públicos llevan `active: false`, sin IDs de workflow de la instalación original; n8n asignará IDs nuevos.
3. Seleccionar el flujo de errores propio en los ajustes de Entrada, Reloj, Router y Finanzas. Revisar todas las credenciales importadas.
4. En Router, revisar `Llamar Finanzas` y `Llamar Asistente`. Sus destinos deben ser los IDs nuevos, con sus nodos `Desde Router` conectados a `Normalizar`. La versión de Finanzas incluida para esta integración es v25, no la v23 anterior.
5. Mantener apagados los Telegram Trigger de Entrada y Finanzas. Router debe ser el único receptor de Telegram para ese bot. Comprobar el permiso `workflowsFromSameOwner` y la invocación de cada subflujo con el usuario propietario de la nueva instalación.
6. Si se reemplaza una instalación existente, exportar sus respaldos y desactivar sus receptores anteriores antes de activar el Router. No activar varios Telegram Trigger con el mismo token.
7. Probar los subflujos con datos ficticios y luego activar Reloj. Activar Router de último. Las llamadas de subflujo deben comprobarse en la versión concreta de n8n instalada.
8. Incorporar WhatsApp solo después de comprobar Telegram y Finanzas. Seguir [whatsapp.md](whatsapp.md).

## Pruebas manuales de aceptación

Usar una instalación de prueba y datos inventados:

1. `/agenda` y `recuérdame revisar el presupuesto mañana a las 10` deben ir al Asistente.
2. `pagué 10k de almuerzo` debe ir a Finanzas; comprobar el registro en la hoja de prueba y deshacerlo.
3. Crear una tarea, completarla desde Telegram y comprobar su estado en Google Tasks. Repetir en la dirección contraria.
4. Crear una tarea repetida con fecha final, marcarla y revisar `Registro habitos`.
5. Pulsar dos veces una confirmación y reenviar un update duplicado: no debe aparecer una segunda operación.
6. Enviar `hola`, elegir un destino y volver a pulsar el botón. Revisar también el consumo de pendientes y la persistencia tras reinicio.
7. Probar voz, un adjunto y una respuesta a un mensaje del Asistente. Probar un remitente no autorizado.
8. Solo con claves ficticias: cifrar, recuperar, probar llave ausente e incorrecta, y comprobar la política de eliminación del mensaje.

## Límites de esta copia

No se corrigieron defectos ni se añadieron funciones. Los exports son una instantánea de código para configurar e importar, no una instalación que funcione sin credenciales ni hojas. La revisión local comprueba JSON, conexiones y sintaxis, y simula algunos nodos con entradas ficticias; no ejecuta n8n, OAuth, Telegram, Calendar, Tasks, Sheets, Gemini, Groq ni WhatsApp.

El Router conserva limitaciones de static data: los updates pendientes pueden contener información privada; el borrado por antigüedad ocurre al procesar nuevas entradas. Las pruebas secuenciales del doble toque no demuestran exclusión mutua entre ejecuciones simultáneas. El despacho asíncrono no confirma que un subflujo haya terminado correctamente. Validar persistencia, concurrencia, fallos y recuperación en una instalación nueva antes de usar datos reales.

## Verificaciones de esta preparación

Se comprobaron los cinco JSON de esta guía: nombres e IDs de nodo únicos, conexiones a nodos existentes, ausencia de metadatos privados y sintaxis de sus 91 nodos Code. Se ejecutaron 12 aserciones sintéticas: cuatro de Normalizar, cuatro de Decidir del Router y cuatro de Adaptar WhatsApp, incluidas entradas inválidas, rechazo de remitente y clave estable para el mismo update. No es una prueba integral de duplicados.

El checker histórico de Finanzas reportó en Entrada 0 errores/12 avisos; Reloj 0/8; Router 0/1 y WhatsApp Entrada 0/0. El flujo de Errores del Asistente conserva **2 errores/1 aviso heredados**: el nodo `Avisar error` no fija HTML ni escapa el texto dinámico; además lee Google Sheets por separado. Se distribuye como instantánea del trabajo existente, sin corregirlo ni presentarlo como una entrega funcional nueva.

Los demás avisos señalan lecturas separadas, variables `sello` que el checker no vincula al ID de ejecución, acceso a `$env`, el trigger Telegram desactivado y la pregunta Router sin Cancelar. El trigger desactivado forma parte del uso como subflujo; las demás observaciones requieren evaluación en la instalación. La inicialización de la hoja solo se revisó localmente; no se ejecutó en Google.

## Repetir las pruebas locales

Desde la raíz de la carpeta descargada, con Node.js instalado y sin instalar paquetes:

```sh
node tests/asistente-publico.test.js
```

El runner lee los exports públicos mediante rutas relativas a su propio archivo, compila los 91 nodos Code, verifica conexiones/metadatos y ejecuta las 12 aserciones sintéticas descritas arriba. También prueba `crearPlantillaAsistente` con `SpreadsheetApp` simulado. No abre libros ni realiza conexiones de red. Las aserciones usan los placeholders de la distribución: ejecutarlas antes de personalizar la copia.
