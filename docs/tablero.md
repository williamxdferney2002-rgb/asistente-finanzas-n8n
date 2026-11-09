# Tablero de finanzas

Aplicación web de Google Apps Script vinculada a una hoja de cálculo. Esta copia conserva el código local final del tablero (interfaz v8, con temas Sticker y Aurora), incluidos pagos, correcciones, pérdidas y deshacer. No se ha confirmado qué versión está desplegada en una cuenta de Google.

## Archivos

- [Codigo.gs](../apps-script/tablero/Codigo.gs): lectura, cálculo y escrituras.
- [Index.html](../apps-script/tablero/Index.html): interfaz, gráficas SVG y temas.
- [appsscript.json](../apps-script/tablero/appsscript.json): manifiesto V8, permisos y zona horaria.
- [Modelo y plantilla](modelo-datos.md): pestañas, encabezados y creación de la hoja vacía.

## Qué muestra y permite

| Sección | Contenido |
|---|---|
| Inicio | Patrimonio, disponible, inversiones, deudas, próximos pagos y evolución |
| Gastos | Totales por mes, categorías y presupuestos |
| Ingresos | Ingresos por mes y categoría, otras entradas y comparación con gastos |
| Movimientos | Búsqueda, filtros, detalle y corrección de categoría o descripción |
| Deudas | Deudas sueltas y con cuotas, pagos, pérdidas y deshacer |
| Cuentas | Saldos, bolsillos y posiciones de inversión |

El botón de diseño alterna Sticker y Aurora; la preferencia se guarda en el navegador. Los datos se actualizan al abrir, al volver a la pestaña y cada cinco minutos. Google Fonts es el recurso externo de la interfaz; las gráficas no necesitan una biblioteca remota.

## Instalación en una cuenta propia

1. Crea una hoja de Google Sheets, configura su zona horaria como `America/Bogota` y prepara las tablas siguiendo [modelo-datos.md](modelo-datos.md).
2. Desde la hoja abre **Extensiones → Apps Script**. Pega `Codigo.gs` en el archivo de código y crea un archivo HTML llamado `Index` con el contenido de `Index.html`.
3. En la configuración del proyecto activa la visualización del manifiesto y pega `appsscript.json`.
4. Configura el usuario de tu bot: agrega en **Parámetros** una fila con `Clave = usuario_bot` y `Valor = tu_usuario_bot`, sin `@`. También puedes sustituir el ejemplo `TU_BOT_TELEGRAM_bot` en `Codigo.gs` y en el enlace inicial de `Index.html`. El enlace inicial es una presentación provisional; al recibir los datos, la interfaz usa el valor de Parámetros.
5. Guarda y ejecuta manualmente `getDatos` para revisar las tablas y autorizar el acceso a tu hoja. No es necesario publicar la hoja.
6. Selecciona **Implementar → Nueva implementación → App web**, ejecuta como tu usuario y restringe el acceso a **Solo yo**. Abre la URL `/exec` con la cuenta autorizada.
7. Si instalas también el bot de finanzas, envíale `/tablero TU_URL_EXEC` para guardar el enlace en su configuración.

No se incluyen credenciales de Google, tokens, saldos, contactos, capturas ni extractos del proyecto de origen.

## Actualización

Pega los archivos de la versión elegida, guarda y crea una **nueva versión** desde Administrar implementaciones. Mantener la implementación conserva su URL. Cambios en permisos pueden solicitar una nueva autorización.

## Escrituras y compatibilidad con el bot

`corregirMovimiento` modifica categoría y detalle. `registrarPago` crea abonos o cobros de cuotas, separando capital e interés. `marcarPerdida` registra el saldo incobrable de una deuda suelta mediante dos movimientos sin cuenta, conservando pagos previos. `deshacerCambio` revierte las operaciones que admite el tablero.

Los registros comparten con el bot los IDs `MOV-…` y `OP-…`, el origen `Tablero` y los comentarios `Cuotas préstamo: ID=valor`. El bot puede reconocer estos registros para su mecanismo de deshacer, dentro de sus limitaciones. Si se cambia la lógica de deudas o cuotas, se debe revisar tanto el cálculo del bot como `calcular()` y las escrituras del tablero.

## Límites de esta entrega

- `LockService` coordina escrituras del propio Apps Script; no proporciona un candado compartido con n8n.
- Algunas operaciones de deshacer aún borran filas físicamente. No se ha implementado anulación con bitácora como parte de la preparación pública.
- El tablero lee como máximo los movimientos definidos en `MAX_MOVIMIENTOS` para su respuesta, y la historia configurada en `MESES_HISTORIA`.
- La zona y la moneda de referencia son Colombia/COP. Adaptarlas exige revisar fechas, tipos de cuenta e impuestos, además de cambiar el manifiesto.
- Los nombres de pestañas y encabezados son parte del contrato de los flujos; no deben traducirse o renombrarse de forma aislada.
- No se ejecutó esta copia pública dentro de Google: quedan por comprobar autorización, publicación, fechas de Sheets, `LockService` y llamadas reales de la interfaz.

## Comprobación sugerida en una hoja de prueba

Carga únicamente los datos ficticios de la plantilla, abre las seis secciones, alterna ambos temas y revisa el saldo esperado del ejemplo. Después prueba una corrección y su deshacer; un pago pequeño sobre una deuda ficticia; una pérdida parcial; y un doble toque. Confirma en cada caso las filas y el log. Una categoría inexistente o un importe mayor que la deuda deben mostrar un error sin registrar el pago.

## Verificación local de esta copia

Se comprobó la sintaxis de `Codigo.gs` y de los dos bloques JavaScript de `Index.html`. `calcular()` se ejecutó con las nueve filas ficticias y produjo disponible y patrimonio de **88.000 COP**, con deudas e inversiones en cero. Estas comprobaciones no sustituyen las pruebas visuales o dentro de Google indicadas arriba. Los resultados históricos que dependían de datos privados no se publican.
