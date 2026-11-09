# Instalación por módulos

La copia necesita configuración propia. No se importa ni se activa nada automáticamente. Lee primero [estado y limitaciones](estado-y-limitaciones.md) y las guías específicas; esta página establece el orden general.

## Requisitos observables

- Una instalación de n8n que admita los tipos y typeVersion presentes en los exports. No se dispone de una imagen exacta fijada del servidor original.
- Una cuenta de Google con Sheets, Drive y Apps Script; Calendar y Tasks para el asistente.
- Un bot propio de Telegram y el identificador del chat autorizado.
- Credenciales propias para los modelos y la transcripción que decidas conservar.
- Para las comprobaciones locales: Python 3, Node.js y npm. Luxon se instala desde el package-lock incluido; no hace falta una instalación local de n8n para esas comprobaciones.
- Para WhatsApp: recursos y credenciales propios de Meta y tablas internas de n8n, según la guía del Asistente. Es un módulo opcional.

La [guía de infraestructura](infraestructura.md) resume el entorno observable y los requisitos que deben reproducirse en un servidor propio, sin datos de la instalación de origen.

## Orden recomendado

1. Crea las hojas vacías usando [plantillas](../plantillas/) y [modelo de datos](modelo-datos.md). Configura las cuentas, categorías, parámetros y demás catálogos propios; una estructura vacía no contiene todavía tu configuración financiera.
2. Crea las credenciales de Google, Telegram y proveedores de IA en n8n. Activa y autoriza las APIs necesarias en tu proyecto de Google.
3. Importa los flujos de errores y conserva sus IDs asignados por tu instalación. El flujo de errores de Finanzas se incluye con sus defectos originales documentados; revisa su guía antes de depender de sus avisos.
4. Importa Finanzas Bot, Asistente Entrada, Reloj y Programado, manteniéndolos desactivados. Reasigna todas las credenciales y recursos, no solo las referencias visibles en Config.
5. Configura los requisitos de servidor del Asistente y su cifrado según [su guía](asistente.md). Usa una llave nueva y mantenla fuera del repositorio.
6. Importa el Router y selecciona los IDs locales de Finanzas y Asistente en los nodos que llaman subflujos. Los receptores deben conservar sus disparadores de subworkflow.
7. Si usas WhatsApp, crea sus tablas y configura el adaptador, los recursos de Meta y los nodos WA antes de habilitar ese canal.
8. Sigue [la guía del tablero](tablero.md) para instalar Apps Script sobre la hoja financiera. Limita inicialmente el acceso a tu cuenta.
9. Ejecuta las verificaciones locales y después las pruebas manuales de cada módulo con datos inventados.
10. Activa la entrada Router de último para Telegram; mantén deshabilitados los Telegram Trigger de los subflujos que comparten ese bot. Activa los programados solo cuando las pruebas y sus recursos estén configurados.

Un solo bot de Telegram debe tener una única entrada activa. Si reemplazas una instalación previa, respáldala y desactiva su entrada antes de publicar la nueva para no retirar después el webhook recién configurado.

## Pruebas manuales mínimas

Con una hoja de pruebas: registra un gasto ficticio, consulta saldos y deshazlo; prueba un importe inválido y dos toques rápidos en una confirmación. Comprueba que el pago registrado desde el tablero se vea igual en el bot. Prueba agenda, recordatorio y hábito del Asistente y observa dos ciclos de sincronización para detectar duplicados. Si habilitas WhatsApp, prueba el recorrido de texto, voz, selección de módulo y el bloqueo de funciones privadas descrito en su guía.

Los resultados históricos del proyecto no certifican una instalación nueva. No se ejecutaron estas pruebas remotas durante el empaquetado.
