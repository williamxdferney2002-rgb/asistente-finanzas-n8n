# Configuración propia

Los archivos `*.example.json` documentan las referencias que hay que cambiar. No contienen tokens ni permiten conectarse al sistema original. El inventario [marcadores.json](marcadores.json) localiza las referencias pendientes dentro de los archivos públicos.

## Tres clases de valores

1. **Credenciales:** crea las tuyas en n8n y selecciónalas en cada nodo correspondiente. No basta con cambiar el nombre de una credencial en el JSON.
2. **Recursos:** crea las hojas, carpetas, calendarios, listas, tablas internas y workflows; sustituye cada `CONFIGURE_*` por su ID propio. El chat numérico `123456789`, cuando aparezca como ejemplo, también debe cambiarse.
3. **Preferencias:** revisa zona horaria, identidad genérica, cuentas, categorías y proveedores de modelos antes de usar el sistema.

Los marcadores presentes en código embebido, condiciones de autorización o URLs también requieren sustitución. Revisa las guías por módulo para saber dónde se utilizan; configurar únicamente el nodo Config puede resultar insuficiente.

## Copia local configurada

Puedes copiar [local.example.json](local.example.json) a `config/local.json` (ignorado por Git) y completar su objeto de sustituciones. Un ejemplo parcial:

```json
{
  "CONFIGURE_FINANCE_SHEET_ID": "ID_DE_TU_HOJA",
  "123456789": "ID_DE_TU_CHAT"
}
```

Los nombres definitivos deben coincidir con [marcadores.json](marcadores.json) y los ejemplos por módulo. No guardes tokens en este archivo; las referencias a credenciales se resuelven en n8n. Conserva los exports personalizados y cualquier prueba con datos propios en `local/` o fuera del repositorio.

Para listar las sustituciones y crear una copia personalizada sin tocar los archivos públicos:

```powershell
python -X utf8 scripts/preparar_copia.py --listar
python -X utf8 scripts/preparar_copia.py --config config/local.json
```

El segundo comando exige completar todos los marcadores, escribe únicamente en `local/` y se detiene si esa carpeta ya existe. No inserta ni crea secretos de credenciales. Para rutas de un canal que no usarás, conserva valores de ejemplo propios y sus disparadores desactivados. Los reemplazos dentro de regex y JavaScript requieren caracteres válidos en ese contexto; valida tu copia local antes de importarla.

El [procedimiento de instalación](../docs/instalacion.md) explica el orden para asignar las referencias entre workflows. Puedes seleccionar los recursos manualmente tras importar en vez de usar el script. Los exports públicos deben seguir desactivados y con marcadores.
