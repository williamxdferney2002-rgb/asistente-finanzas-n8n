# Estado de esta copia

Fecha de preparación: 8 de noviembre de 2026. Se empacaron los últimos exports disponibles de los módulos relacionados; no se consultó ni se modificó una instalación remota.

## Alcance

El objetivo es compartir el trabajo para estudio y adaptación. Los JSON están desactivados y contienen referencias de ejemplo. No se deben activar hasta crear los recursos propios, asignar credenciales, configurar IDs y ejecutar las pruebas manuales. Se preservaron funciones y defectos de las fuentes; las sustituciones de anonimización no se presentan como nuevas capacidades.

## Limitaciones conocidas de Finanzas

- El flujo de errores v1 conserva problemas de formato y escape en el aviso de Telegram. El chequeo heredado los detecta. La v2 descrita en el proyecto no estaba disponible y no se construyó en esta copia.
- Desde el log al final de la ejecución, un fallo intermedio puede no dejar fila en Log Bot; el flujo de errores todavía no cubre todos esos casos.
- Hay recorridos que borran filas físicamente. La anulación con historial y el deshacer completo de préstamos formales, reventas e inversiones continúan pendientes.
- El candado del tablero no es un bloqueo compartido con el bot. Las escrituras simultáneas requieren cuidado y pruebas.
- El tratamiento especial de sobrantes voluntarios de grupos sigue pendiente.
- Las cuotas estimadas de tarjetas no sustituyen la información de un extracto confirmado.

## Reproducibilidad

El flujo de errores del Asistente v1.1 también conserva defectos de formato HTML y escape detectados por el verificador heredado. Se incluyen ambos manejadores para conservar el trabajo disponible, con sus límites explícitos; pasar la revisión de publicación no significa que estos avisos estén corregidos.

- Se incluyen esquemas de datos vacíos y guías, sin la base de datos usada durante el desarrollo.
- Las vistas antiguas de la hoja y sus fórmulas no se reconstruyen si no estaban disponibles como código. Se distingue la plantilla operativa de las vistas históricas.
- No hay una versión exacta de la imagen de n8n ni un archivo de despliegue original completo en esta entrega. Se conservan los typeVersion de los nodos y las dependencias observables; la compatibilidad debe comprobarse al importar.
- Los modelos de IA y APIs pueden cambiar. Los nombres de los exports describen el snapshot y no garantizan disponibilidad, cuota gratuita ni precio.
- Las tablas internas de n8n, las hojas, las listas de Tasks, los calendarios y las carpetas de Drive deben crearse en la cuenta de quien instala.
- WhatsApp es opcional. No es necesario configurar este canal para revisar el código o preparar una instalación de Telegram.

Consulta [Asistente](asistente.md) para requisitos de cifrado y sincronización, y [validación](validacion.md) para las comprobaciones realizadas durante el empaquetado.
