# Preparación de la copia pública

## Qué se excluyó

No se copian la hoja de cálculo real, capturas, recibos, extractos, mensajes, conversaciones, logs de uso, ejecuciones de n8n, datos fijados de nodos, estado estático de los workflows, archivos de entorno, credenciales, claves de cifrado, cachés de recursos, configuraciones personales del editor ni el historial Git privado.

Los documentos de aprendizaje y estado se redactan de nuevo. No se copian las notas privadas de credenciales ni las bitácoras que contienen identificadores y detalles de personas. La plantilla conserva estructura y encabezados; no conserva las filas originales.

## Qué se sustituyó

Los exports y el tablero usan marcadores o ejemplos ficticios para personas, identidad del propietario, llaves bancarias, chats, remitentes, teléfonos, cuentas de integración, hojas, carpetas, calendarios, listas, tablas internas y referencias entre workflows. Las credenciales se referencian con nombres e IDs de configuración sin sus valores secretos.

Los IDs de nodos y webhooks se regeneran o se retiran cuando procede, manteniendo las conexiones por nombre y la coherencia interna. Todos los workflows se entregan desactivados. Los IDs ficticios y marcadores de configuración no representan recursos disponibles.

Las marcas de productos, categorías contables y nombres de proveedores se mantienen cuando son necesarios para entender la lógica y no identifican una cuenta personal.

## Comprobaciones

La preparación combina revisión humana, búsqueda de formatos de secretos y comparación privada contra identificadores y datos reconocibles de las fuentes. Las listas privadas usadas para comparar no se incorporan a esta carpeta. El informe público registra resultados agregados sin repetir los valores retirados.

El validador público detecta patrones y metadatos prohibidos; no puede reconocer por sí solo todos los datos personales de una futura aportación. Revisa siempre texto libre, ejemplos, imágenes y datos fijados antes de publicar cambios.

## Después de configurar

Guarda los valores propios en `config/local.json` o fuera del repositorio, y las copias configuradas en `local/`. Ambas rutas están ignoradas. Los secretos se crean en el almacén de credenciales de n8n o en el entorno del servidor, nunca en los JSON públicos.

El archivo `.gitignore` reduce incorporaciones accidentales, pero no limpia archivos ya registrados por Git. Antes de subir, inspecciona el contenido preparado con `git diff --cached` y ejecuta de nuevo el validador.
