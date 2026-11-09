# WhatsApp opcional

Se incluye `flujos/whatsapp/whatsapp-entrada-v2.json` (9 nodos), junto con los nodos de transporte ya presentes en Router v2, Entrada del Asistente v6.4 y Finanzas v25. Se conserva la versión exportada sin desarrollar funciones adicionales. Los originales no se modificaron.

## Recorrido

`WhatsApp Trigger → Adaptar WhatsApp → Router → Finanzas o Asistente`.

El adaptador transforma mensajes compatibles en un objeto similar al update de Telegram, conserva metadatos del canal y usa un ID de chat ficticio autorizado. Filtra el remitente y el ID del número de negocio. Reconoce texto, audio, imagen, documentos compatibles e interacciones con los prefijos previstos por el código; no convierte cualquier interacción en una instrucción válida.

## Configuración

1. Completar primero la instalación de [Asistente y Router](asistente.md) con Telegram.
2. Crear credenciales propias `whatsAppTriggerApi` y `whatsAppApi` y reasignarlas en todos los nodos que las usan. Los tokens se guardan en n8n, no en los JSON.
3. Sustituir `CONFIGURE_WHATSAPP_ALLOWED_NUMBER` por el número de remitente autorizado, con el formato de dígitos que entrega la API. Usar el mismo valor en Adaptar WhatsApp, Asistente y Finanzas.
4. Sustituir `CONFIGURE_WHATSAPP_PHONE_NUMBER_ID` por el ID propio del número de negocio, en `WA Config`, Config del Asistente, endpoints de envío del Router y nodos de Finanzas. No es el número de teléfono visible.
5. Sustituir el chat ficticio `123456789` de manera consistente en todos los componentes. El adaptador lo utiliza para pasar por la autorización compartida.
6. En `Llamar Router`, seleccionar el ID nuevo del Router en lugar de `CONFIGURE_ROUTER_WORKFLOW_ID`.
7. Revisar en la cuenta propia los permisos, webhook y suscripciones requeridos por el trigger. Esta copia no contiene la cuenta empresarial, aplicación Meta, secreto de verificación ni credenciales del proyecto original.
8. Probar con mensajes ficticios de un remitente permitido y otro rechazado antes de activar esta entrada.

`config/asistente.example.json` enumera los placeholders y los archivos donde aparecen. No se carga automáticamente en n8n.

## Particularidades que deben probarse

- Descargar audio y documentos con la credencial propia; verificar tipos MIME compatibles y tratamiento de medios no admitidos.
- Enrutamiento de un gasto, una tarea y un mensaje ambiguo. Probar las confirmaciones y la asociación con el mensaje previo.
- Reenviar el mismo `wamid` y tocar dos veces una interacción; comprobar deduplicación en el destino.
- Respuestas, errores y ventanas de conversación según la configuración de la cuenta de WhatsApp instalada.
- La función de claves del Asistente tiene tratamiento específico para este canal. Probar únicamente con claves inventadas y comprobar las ramas del export; no asumir que se puede borrar una clave enviada del chat.

No se realizaron envíos, descargas, registro de webhook ni comprobaciones con Meta o n8n en esta preparación. Los modelos, versión de Graph API y parámetros del trigger se conservan de la fuente y deben revisarse al configurar una nueva instalación.

## Data Tables necesarias

Crear dos tablas vacías dentro del mismo proyecto de n8n siguiendo [plantillas/whatsapp-tablas.json](../plantillas/whatsapp-tablas.json):

| Tabla | Columnas propias, todas string | Placeholder |
|---|---|---|
| `wa_candados` | `clave`, `ejecucion` | `CONFIGURE_WHATSAPP_LOCKS_TABLE_ID` |
| `wa_contexto` | `wamid`, `datos` | `CONFIGURE_WHATSAPP_CONTEXT_TABLE_ID` |

No crear manualmente `id`, `createdAt` ni `updatedAt`: el código trata esos campos como columnas del sistema. Reasignar los selectores Data Table en **todos** los nodos de Finanzas, Asistente y Entrada WhatsApp que usan estos placeholders. Las reservas se insertan y luego se consulta el menor `id`; conservar el Wait de 2 segundos y el orden `id ASC`, límite 1, de los lectores de reserva. El contexto se guarda con upsert por `wamid` y se lee desde la misma tabla.

La fuente documenta un protocolo de commits condicionado al backend de su instancia. Las simulaciones locales no prueban esa condición en otra base de datos, en varios workers ni bajo carga. Verificarlo en la nueva instalación. Las reservas crecen con los mensajes y reintentos y esta instantánea no incluye una limpieza automática; una caída puede dejar una operación parcial. El cambio de workflow no revierte las filas escritas en las hojas o tablas.
