# Validación del empaquetado

Fecha: 8 de noviembre de 2026. Las comprobaciones se ejecutaron sobre esta copia pública. No hubo importación, activación de workflows ni llamadas a Telegram, WhatsApp, Google o proveedores de IA.

## Repetir las comprobaciones

Desde la raíz del repositorio, con Python 3, Node.js y npm:

```powershell
python -X utf8 scripts/validar_publicacion.py
npm ci --ignore-scripts
npm test
python -X utf8 tests/configuracion-publica.test.py
```

En sistemas que lo requieran, usa `python3` en lugar de `python`. `npm ci` descarga la dependencia declarada del simulador; los tests no conectan servicios del proyecto. En esta preparación se utilizó la dependencia Luxon ya disponible en el entorno local, sin copiar node_modules a la distribución.

## Resultados locales

| Comprobación | Resultado |
|---|---|
| Exports públicos | 8 JSON parseables, desactivados, con nombres/IDs únicos y conexiones existentes |
| Sintaxis Code de n8n | 143 nodos compilan |
| Normalizar Finanzas | 5/5 casos sintéticos |
| Normalizar Asistente, Router y adaptador WhatsApp | 12/12 aserciones sintéticas |
| Tablero y plantilla financiera | 8/8 grupos: sintaxis, esquema, cálculo e inicialización simulada |
| Ejemplo del tablero | Disponible y patrimonio de 88.000 COP, deudas e inversiones cero |
| Inicializador del Asistente | Libro nuevo con siete pestañas y solo encabezados, mediante mock |
| Herramientas de configuración | 5/5 pruebas de sustitución, inventario y patrón de secreto ficticio |
| Privacidad | Revisión independiente y comparación privada de identificadores contra las fuentes, sin remanentes concretos pendientes en el snapshot revisado |

El script `validar_publicacion.py` revisa estructura, sintaxis, patrones de secretos, metadatos y enlaces locales. Sus resultados no certifican la lógica financiera ni la concurrencia de una instalación.

## Chequeo heredado de workflows

Este verificador aplica las convenciones históricas del proyecto. Se conserva con sus hallazgos, sin silenciar defectos de las fuentes:

| Flujo | Errores | Avisos |
|---|---:|---:|
| Finanzas Bot v25 | 0 | 1 |
| Finanzas Programado v7 | 0 | 0 |
| Finanzas Errores v1 | 2 | 1 |
| Asistente Entrada v6.4 | 0 | 12 |
| Asistente Reloj v6.1 | 0 | 8 |
| Asistente Errores v1.1 | 2 | 1 |
| Router v2 | 0 | 1 |
| WhatsApp Entrada v2 | 0 | 0 |

Los cuatro errores pertenecen a los dos nodos `Avisar error`: ausencia de HTML explícito y de escape del texto dinámico. Son defectos heredados que no se corrigieron como parte del empaquetado. Los avisos incluyen triggers desactivados de subflujos, lecturas separadas de Sheets, generación de sellos que el checker no vincula al ID de ejecución, acceso a entorno para cifrado y ausencia de Cancelar en la elección de módulo. Los detalles constan en [Finanzas](finanzas.md) y [Asistente](asistente.md).

Para revisar un export individual:

```powershell
python -X utf8 scripts/check_workflow.py flujos/finanzas/finanzas-bot-v25.json
```

No se usa `--base` contra el export privado: la anonimización cambia deliberadamente identificadores, credenciales y referencias. La coherencia interna se comprueba sobre la copia pública; no se afirma conservación literal de IDs originales.

## Límites y siguientes comprobaciones

No se probaron permisos OAuth, APIs, proveedores y modelos vigentes, activación de subflujos, persistencia de static data, concurrencia, recepción de webhooks, importación en una versión concreta de n8n, publicación Apps Script ni la interfaz visual en un navegador. Las pruebas de inicialización y cálculo usan objetos simulados; no demuestran el comportamiento real de Google Sheets.

La revisión de privacidad no puede sustituir la inspección de futuras aportaciones. No se distribuyen sus mapas privados de comparación ni los datos originales. Las guías de módulos incluyen pruebas manuales con datos inventados para continuar la adaptación.
