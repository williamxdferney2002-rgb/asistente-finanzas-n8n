# Arquitectura y decisiones

## Dos dominios y una entrada común

Finanzas mantiene movimientos, cuentas, deudas, cuotas y consultas. Asistente organiza agenda, tareas, recordatorios y hábitos. El Router recibe la conversación y entrega el mensaje al subflujo correspondiente; la entrada de WhatsApp adapta otro canal al mismo recorrido.

El tablero de Apps Script consulta la misma hoja financiera. Puede corregir categoría y detalle, registrar pagos, deshacer determinadas operaciones y marcar deudas sueltas como perdidas. No reemplaza todas las acciones del bot.

## Interpretar, validar y ejecutar

En Finanzas, los nodos Code principales son `Contexto`, `Plan`, `Ejecutar` y `Consultar`. La IA propone una acción estructurada; el plan resuelve referencias, valida datos y pregunta cuando falta información. Ejecutar convierte la acción aceptada en operaciones sobre la hoja. Las consultas tienen un recorrido separado.

Los atajos reducen llamadas al modelo para comandos o frases reconocibles. Voz y documentos añaden descarga, transcripción o extracción antes de la interpretación. La respuesta y los identificadores de origen permiten reconocer duplicados y corregir registros desde el chat.

## Datos y contabilidad

- El saldo de una cuenta parte de su saldo inicial y de los movimientos a partir de la fecha de referencia.
- Una transferencia representa movimiento entre cuentas propias.
- Las deudas sueltas derivan de préstamos dados y abonos recibidos; los préstamos formales tienen cabecera y cuotas.
- Una deuda sin movimiento de dinero usa registros sin cuenta: reconocer una obligación no implica una salida de caja inmediata.
- Un pago de cuota puede separar capital e intereses.
- Corregir una operación exige excluir sus filas anteriores al calcular el resultado propuesto.

Los encabezados y tipos son parte del contrato entre bot, tablero y hoja: no se pueden traducir o renombrar sin adaptar el código. El [modelo de datos](modelo-datos.md) describe la plantilla disponible.

## Eficiencia e idempotencia

Finanzas concentra la lectura de pestañas en una solicitud batchGet y prepara las escrituras en lote cuando el recorrido lo permite. Las claves de origen, el log y las confirmaciones reducen duplicados por reintentos y doble toque. Los identificadores combinan fecha y ejecución para distinguir registros próximos en el tiempo.

Estas medidas no equivalen a una transacción de base de datos. Los recorridos con borrado físico y las escrituras desde dos aplicaciones tienen límites descritos en [estado y limitaciones](estado-y-limitaciones.md).

## Lógica compartida

Saldos, deudas y cuotas se calculan en el bot, los reportes y `calcular()` del tablero. Los pagos del tablero usan el formato de identificadores y comentarios que reconoce el bot. Cualquier futura modificación financiera debe comprobar los tres consumidores para evitar resultados distintos sobre una misma hoja.

## Servicios externos

Las integraciones incluyen Google Sheets y Drive, Calendar y Tasks para el asistente, Telegram, Meta para el canal opcional, proveedores de IA y transcripción y servicios de precios o gráficas. La copia conserva los proveedores y nombres de modelos de los exports; su disponibilidad, cuotas y permisos deben verificarse en la cuenta de quien instala.
