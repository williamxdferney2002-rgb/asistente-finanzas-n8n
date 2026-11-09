# Modelo de datos y plantilla de finanzas

La base de datos es una hoja de Google Sheets con tablas por pestaña. El bot lee nombres y encabezados exactos; el tablero utiliza las mismas tablas para saldos, inversiones y deudas.

## Contenido público

- [finanzas-esquema.json](../plantillas/finanzas-esquema.json): 22 pestañas con encabezados, sin filas privadas.
- [CrearPlantilla.gs](../plantillas/CrearPlantilla.gs): inicializador manual que crea pestañas y escribe solo encabezados.
- [datos-demo.example.json](../plantillas/datos-demo.example.json): nueve filas totalmente inventadas para una prueba mínima. Las cantidades y fechas no proceden del proyecto original y no son cotizaciones actuales.

Se extrajeron únicamente los nombres de tablas y columnas del esquema histórico disponible. Se añadió **Duración (s)** a **Log Bot** porque lo utiliza el código final del bot v25. No se extrajeron filas, formatos, fórmulas, saldos ni validaciones personales. El esquema no sustituye una prueba de compatibilidad dentro de Google.

## Crear una hoja desde cero

1. Crea un documento vacío de Google Sheets. Configura la zona horaria `America/Bogota`; usa una configuración regional compatible con las fechas y números elegidos.
2. Abre **Extensiones → Apps Script**, crea un archivo de código, pega [CrearPlantilla.gs](../plantillas/CrearPlantilla.gs), guarda y ejecuta `crearPlantillaFinanzas` manualmente.
3. Autoriza el acceso a tu propia hoja. El script añade las tablas y congela la fila de encabezados. No borra la pestaña vacía que crea Google.
4. Si una tabla ya tiene encabezados compatibles, la conserva sin escribir. Si tiene encabezados diferentes, rechaza la operación antes de crear tablas. Usa una hoja nueva para evitar mezclar esquemas.
5. Completa las tablas de configuración con tus propios datos. Para una prueba, copia las filas ficticias de `datos-demo.example.json` por **nombre de encabezado**; los campos que no aparecen quedan vacíos. No pegues el JSON completo como texto dentro de una celda.
6. Selecciona las columnas de ID como texto. Guarda fechas de forma consistente y montos como valores numéricos, sin convertir identificadores en fechas. El bot y el tablero contienen sus propias protecciones al escribir, pero una carga manual depende de la configuración de Sheets.
7. Configura el ID de esta hoja en los flujos de n8n y asigna credenciales propias. El inicializador no crea credenciales ni publica la hoja.

El ejemplo mínimo contiene una cuenta con saldo inicial de 100.000 COP y un gasto posterior de 12.000 COP. El cálculo del tablero debe producir 88.000 COP de disponible, sin deudas ni inversiones, al evaluarlo en una fecha posterior al gasto. No habilites automatizaciones de precios ni avisos hasta completar su configuración.

## Tablas principales

| Tabla | Uso |
|---|---|
| Movimientos | Libro de ingresos, gastos, préstamos, abonos y transferencias |
| Cuentas | Identidad, tipo, saldos iniciales, fecha de anclaje, bolsillos, impuestos y estado |
| Personas, Categorías | Nombres, alias y clasificación de movimientos |
| Cuotas tarjeta | Calendario de las compras diferidas |
| Préstamos, Cuotas préstamo | Contratos de préstamo, capital, interés y pagos |
| Activos, Operaciones inversión | Catálogo y operaciones para calcular posiciones |
| Recurrentes | Servicios, recordatorios y reparto compartido |
| Presupuestos, Metas | Límites por mes y objetivos |
| Historial | Fotografías de indicadores para evolución temporal |
| Por confirmar | Preguntas pendientes, botones, estado y vencimiento |
| Documentos, Extractos, Comercios | Comprobantes, revisión de transacciones y clasificación |
| Log Bot | Registro de acciones, resultado y duración |
| Parámetros | Configuración por clave/valor |
| Reventas | Compras, ventas y existencias para reventa |

**Inversiones** y **Listas** conservan únicamente encabezados como tablas auxiliares opcionales. La primera era una vista calculada; sus fórmulas no están incluidas. Las hojas históricas **Leeme**, **Resumen** y **Vistas** se omiten: eran documentación o vistas con fórmulas cuya reconstrucción no forma parte de esta copia. Los cálculos del tablero proceden de las tablas de operaciones y no dependen de copiar esas vistas históricas.

## Reglas de cálculo y relación

- El saldo se obtiene desde **Saldo inicial** y **Fecha saldo inicial** de cada cuenta. Los movimientos anteriores a ese anclaje conservan historia y no deben volver a alterar el saldo inicial.
- `Cuenta` y `Cuenta destino` se relacionan por ID con **Cuentas**. `Persona` se relaciona por nombre y alias con **Personas**.
- Una transferencia enlaza cuentas propias. Los envíos a terceros requieren clasificar su naturaleza.
- Una deuda suelta se registra en **Movimientos**; un préstamo con cuotas utiliza también **Préstamos** y **Cuotas préstamo**.
- Un sobrante pagado por otra persona puede representar deuda del titular hacia ella. No debe ocultarse como una deuda negativa.
- Los IDs de movimientos, operaciones y claves de origen permiten reconocer duplicados y asociar correcciones. Los IDs `DEMO` del ejemplo son ficticios y no sustituyen el generador de IDs del bot.
- El impuesto sobre movimientos depende del campo **Cobra 4x1000** y de la lógica del bot. El ejemplo lo desactiva; no establece obligaciones fiscales para una cuenta real.
- `usuario_bot` y `url_tablero` son parámetros de la instalación propia. `usdcop_manual` es una referencia configurable usada en inversiones; el valor de ejemplo es ficticio.

## Configuración inicial y límites

Los encabezados vacíos permiten abrir y conectar componentes, pero no configuran el sistema completo. Se necesitan cuentas activas, categorías de gasto/ingreso, personas si se manejarán deudas, parámetros y credenciales. Recurrentes, préstamos e inversiones requieren sus datos propios. Verifica los tipos exactos que acepta la versión de los flujos antes de realizar una carga grande.

La plantilla financiera no incluye fórmulas de Google Finance, formato condicional, listas desplegables, gráficos de Sheets ni un histórico de registros reales. El Asistente tiene su [esquema independiente](../plantillas/asistente-esquema.json) y se configura conforme a [su propia guía](asistente.md).

## Verificación local de la plantilla

Las 20 tablas solicitadas por la lectura única del bot v25 están presentes en el esquema. Todos los campos de las nueve filas sintéticas corresponden a encabezados definidos. El inicializador pasó comprobaciones sobre una hoja simulada: crea 22 tablas vacías, amplía a 27 columnas cuando hace falta, conserva todas las tablas al repetirse y rechaza encabezados incompatibles antes de crear pestañas. No se ejecutó el inicializador contra una hoja real de Google.
