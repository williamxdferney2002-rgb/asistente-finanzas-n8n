#!/usr/bin/env python3
"""Crea exports personalizados en local/, sin tocar las plantillas públicas.

Usa un JSON de sustituciones locales. No crea credenciales ni llama a servicios.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATTERN = re.compile(r'CONFIGURE_[A-Za-z0-9_]+|TU_BOT_TELEGRAM_bot|123456789')


def templates():
    return sorted(p for folder in ('flujos', 'apps-script') for p in (ROOT / folder).rglob('*')
                  if p.is_file() and p.suffix in {'.json', '.gs', '.html'})


def markers():
    result = {}
    for path in templates():
        for marker in set(PATTERN.findall(path.read_text(encoding='utf-8'))):
            result.setdefault(marker, []).append(path.relative_to(ROOT).as_posix())
    return dict(sorted(result.items()))


def replace_value(value, mapping):
    if isinstance(value, dict):
        return {k: replace_value(v, mapping) for k, v in value.items()}
    if isinstance(value, list):
        return [replace_value(v, mapping) for v in value]
    if isinstance(value, str):
        return PATTERN.sub(lambda match: str(mapping.get(match.group(), match.group())), value)
    if isinstance(value, int) and str(value) in mapping:
        replacement = str(mapping[str(value)])
        if not replacement.isdecimal():
            raise ValueError('Un identificador numérico necesita un reemplazo de dígitos.')
        return int(replacement)
    return value


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--listar', action='store_true', help='Muestra marcadores y archivos, sin escribir')
    parser.add_argument('--config', type=Path, help='JSON local de sustituciones, ignorado por Git')
    options = parser.parse_args()
    inventory = markers()
    if options.listar:
        print(json.dumps(inventory, ensure_ascii=False, indent=2))
        return 0
    if not options.config:
        parser.error('Usa --listar o --config config/local.json')
    mapping = json.loads(options.config.read_text(encoding='utf-8-sig'))
    if not isinstance(mapping, dict) or any(not isinstance(v, (str, int)) or isinstance(v, bool) for v in mapping.values()):
        raise SystemExit('La configuración debe ser un objeto de cadenas o números; no se muestran sus valores.')
    missing = [name for name in inventory if not str(mapping.get(name, '')).strip()]
    if missing:
        print('Faltan sustituciones: ' + ', '.join(missing))
        print('No se crearon archivos. Para configurar solo un canal, usa valores de ejemplo propios en las rutas que mantendrás desactivadas.')
        return 1
    output = ROOT / 'local'
    if output.exists():
        raise SystemExit('local/ ya existe. Usa otra descarga de la copia pública; este script no sobrescribe archivos.')
    prepared = []
    for path in templates():
        body = path.read_text(encoding='utf-8')
        if path.suffix == '.json':
            body = json.dumps(replace_value(json.loads(body), mapping), ensure_ascii=False, indent=2) + '\n'
        else:
            body = PATTERN.sub(lambda match: str(mapping[match.group()]), body)
        if PATTERN.search(body):
            raise SystemExit('Quedan marcadores en ' + path.relative_to(ROOT).as_posix() + '; no se escribieron archivos.')
        prepared.append((path.relative_to(ROOT), body))
    for relative, body in prepared:
        target = output / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(body, encoding='utf-8', newline='\n')
    print(f'Se crearon {len(prepared)} archivos en local/. Los exports públicos permanecen intactos.')
    print('Reasigna y verifica las credenciales en n8n; las referencias entre workflows dependen de los IDs asignados al importar.')
    print('Los valores insertados en regex o JavaScript deben ser válidos en ese contexto; comprueba sintaxis antes de importar.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
