# Lecciones aprendidas

Síntesis técnica del trabajo acumulado. Los casos se expresan de forma general para evitar reproducir conversaciones, personas o importes del uso original.

| Problema observado | Aprendizaje aplicable |
|---|---|
| Mensajes rechazados por Telegram al contener caracteres de formato | Elegir explícitamente el formato y escapar el texto dinámico antes de enviarlo. |
| El bot dejó de recibir mensajes al reemplazar un workflow | Un bot tiene un webhook de entrada; retirar la versión anterior antes de activar la nueva y comprobar qué flujo es dueño de la entrada. |
| Cuotas de Sheets agotadas por lecturas repetidas | Leer las tablas juntas y evitar que cada nodo vuelva a consultar la hoja. |
| Doble toque y reentregas provocaron registros repetidos | Usar una clave de origen estable, validación de confirmaciones e idempotencia antes de escribir. |
| La IA heredó una persona de la conversación anterior | La persona debe venir del mensaje actual o del registro respondido; preguntar cuando no sea explícita. |
| Una consulta fue interpretada como un pago | Separar preguntas de instrucciones y pedir confirmación ante ambigüedad antes de modificar dinero. |
| La corrección sumó el registro viejo y el nuevo | Calcular la propuesta excluyendo primero la operación reemplazada. |
| Deshacer eliminó una operación más amplia de lo esperado | Registrar exactamente qué filas creó cada mensaje y preservar cargas iniciales e importaciones. |
| Deshacer un cobro no restauró el estado de las cuotas | Una reversión debe restaurar todos los efectos relacionados, no solo borrar el movimiento principal. |
| Un recurrente compartido funcionó desde el aviso pero no desde texto libre | La regla de reparto debe ser equivalente en el recorrido manual y en el programado. |
| Responder con texto a una pregunta con botones produjo otra acción | Resolver primero las confirmaciones pendientes antes de enviar el mensaje a la IA. |
| Un importe ausente se convirtió en cero | Validar presencia y tipo antes de convertir; cero no significa dato faltante. |
| Una obligación se confundió con una salida inmediata de dinero | Separar reconocimiento de deuda y movimiento de caja. |
| Un abono histórico alteró deudas actuales | Conservar la procedencia y la fecha de corte de la carga inicial al interpretar importaciones. |
| El modelo devolvió una acción anidada como objeto | Normalizar la estructura de respuesta y validar el conjunto permitido de acciones. |
| Un audio de otro canal se trató con una extensión fija | Preservar el MIME y el formato del binario real durante la adaptación de canales. |
| Una tarea creada externamente se importó más de una vez | Conservar IDs de origen y probar varios ciclos de sincronización, no solo el primero. |
| Las pruebas locales parecían suficientes pero no cubrían el servicio | Distinguir sintaxis, simulación y prueba real: cada nivel demuestra cosas diferentes. |
| Los documentos de estado siguieron mostrando versiones anteriores | Mantener un inventario único con procedencia, configuración y límites del snapshot. |
| Un servidor con poca memoria se saturó durante mantenimiento | Planificar recursos, copias de seguridad y una ventana de mantenimiento antes de actualizar. |

La copia pública no aplica mejoras pendientes a raíz de estas lecciones. Consulta las guías de cada módulo para saber qué mecanismo existe en los archivos incluidos y qué continúa abierto.
