# Pruebas públicas

Los casos usan identificadores ficticios y texto inventado. No contienen filas ni conversaciones de la instalación original.

`finanzas-normalizar.casos.json` cubre un mensaje de texto, un botón, una nota de voz, una actualización no admitida y la repetición de una actualización. El último caso verifica la estabilidad de la clave; no demuestra por sí solo que Sheets o Telegram eviten duplicados.

Desde la raíz de esta carpeta pública:

```powershell
npm ci --ignore-scripts
npm test
```

El simulador ejecuta un nodo Code con contexto simulado, sin llamadas externas. Sus limitaciones están en los comentarios de `scripts/simular_code.js`: el emparejamiento de items es simplificado, no se descargan binarios y las llamadas HTTP fallan intencionalmente.

`npm test` también ejecuta `asistente-publico.test.js` (12 aserciones sintéticas y el inicializador del Asistente) y `tablero-publico.test.js` (ocho grupos sobre esquema, cálculo e inicialización). Ambos runners pueden ejecutarse directamente con Node y no requieren Luxon.

La configuración y los patrones del verificador tienen cinco pruebas adicionales, sin escribir archivos:

```powershell
python -X utf8 tests/configuracion-publica.test.py
```

`plantillas/datos-demo.example.json` es un conjunto independiente, inventado, para ilustrar el cálculo financiero del tablero. No es un respaldo ni una copia de los datos del proyecto.
