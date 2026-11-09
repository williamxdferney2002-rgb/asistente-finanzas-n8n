# Infraestructura y operación

Las fuentes corresponden a una instalación autoalojada de n8n con Docker y un proxy HTTPS. No se conserva aquí el servidor, su dominio, IP, usuario SSH, certificados, volúmenes ni configuración real. Tampoco hay una imagen exacta de n8n fijada que permita certificar la reproducción del entorno original.

## Preparar un entorno propio

Usa una instalación de n8n administrada por ti, con almacenamiento persistente, copias de seguridad y una URL HTTPS accesible por los servicios que entreguen webhooks. Configura su zona horaria y la de los workflows de forma consistente. En las fuentes se utiliza `America/Bogota`; los despliegues con Docker empleaban `GENERIC_TIMEZONE` y `TZ` para esa zona.

Antes de conectar datos, importa los exports desactivados y comprueba compatibilidad de todos los tipos y versiones de nodos. El inventario [SNAPSHOT.json](../SNAPSHOT.json) y los propios JSON permiten identificar lo utilizado. Esta copia no elige una versión nueva de n8n ni actualiza los nodos.

El Asistente utiliza `require('crypto')` y lee `ASISTENTE_LLAVE` para las funciones cifradas. La fuente documentaba `NODE_FUNCTION_ALLOW_BUILTIN=crypto` y `N8N_BLOCK_ENV_ACCESS_IN_NODE=false`. El mecanismo concreto puede depender de los runners y de la versión instalada; consulta las opciones de tu instalación antes de habilitar estas funciones. La llave debe generarse para esa instalación y conservarse en privado, junto con su respaldo.

## Operar y recuperar

- Respaldar por separado la base de n8n, su configuración de cifrado, los workflows y las hojas de datos propias.
- Conservar una única entrada de Telegram activa para cada bot. Un cambio de webhook puede interrumpir la recepción aunque los subflujos estén correctos.
- Probar el arranque completo y los workflows programados después de un reinicio.
- Vigilar memoria, espacio, logs y cuotas de APIs. Las cifras de uso del servidor de origen no se usan como dimensionamiento universal.
- Preparar una ventana de mantenimiento para actualizaciones en máquinas pequeñas, con posibilidad de volver a la versión anterior.
- Revisar retención de ejecuciones y logs: pueden contener mensajes y datos financieros. Los exports no equivalen a una política completa de privacidad de una instalación.

El Programado incluye respaldo y retención de archivos en una carpeta Drive. Esa carpeta debe ser exclusiva de la nueva instalación, porque el recorrido puede eliminar respaldos antiguos. El empaquetado público no ejecutó tareas de infraestructura ni conectó recursos remotos.
