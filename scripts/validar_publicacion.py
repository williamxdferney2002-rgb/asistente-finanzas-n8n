#!/usr/bin/env python3
"""Comprueba la copia pública sin ejecutar workflows ni usar la red.

No reemplaza la revisión humana de datos personales. Los hallazgos muestran
categorías y ubicaciones, nunca el valor que pudo coincidir con un secreto.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
TEXT = {'.md', '.json', '.js', '.gs', '.py', '.html', '.yml', '.yaml', '.txt', '.example'}
SKIP = {'.git', 'node_modules', '__pycache__', '.venv', 'local', 'private'}
PATTERNS = {
    'token Telegram': re.compile(r'\b\d{8,12}:[A-Za-z0-9_-]{35,}\b'),
    'clave Google': re.compile(r'AIza[A-Za-z0-9_-]{30,}'),
    'clave Groq': re.compile(r'gsk_[A-Za-z0-9]{20,}'),
    'clave API': re.compile(r'\bsk-[A-Za-z0-9_-]{20,}'),
    'token OAuth': re.compile(r'ya29\.[A-Za-z0-9_-]{20,}'),
    'token Meta': re.compile(r'\bEAA[A-Za-z0-9]{50,}'),
    'clave privada': re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
    'autorizacion literal': re.compile(r'Bearer\s+[A-Za-z0-9_.-]{20,}'),
    'directorio personal Windows': re.compile(r'[A-Za-z]:[\\/]+Users[\\/]+(?!PUBLIC\b)[^\\/\s"\']+', re.I),
    'dominio dinamico privado': re.compile(r'\b[a-z0-9-]+\.duckdns\.org\b', re.I),
}


def files():
    return sorted(p for p in ROOT.rglob('*') if p.is_file() and not (set(p.relative_to(ROOT).parts) & SKIP))


def validate():
    errors, notes, js_nodes = [], [], []
    workflows = 0
    total_files = 0
    for path in files():
        total_files += 1
        rel = path.relative_to(ROOT).as_posix()
        if path.suffix.lower() in {'.xlsx', '.xls', '.pem', '.key', '.p12', '.pfx', '.sqlite', '.db', '.har'}:
            errors.append(f'{rel}: tipo de archivo privado/no previsto')
        if path.name.startswith('.env') and path.name != '.env.example':
            errors.append(f'{rel}: archivo de entorno no permitido')
        if path.suffix.lower() not in TEXT and path.name not in {'.gitignore', '.gitattributes'}:
            continue
        try:
            body = path.read_text(encoding='utf-8-sig')
        except (UnicodeError, OSError):
            errors.append(f'{rel}: texto no legible como UTF-8')
            continue
        for category, pattern in PATTERNS.items():
            if pattern.search(body):
                errors.append(f'{rel}: posible {category}')
        for address in re.findall(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', body):
            domain = address.rsplit('@', 1)[1].lower()
            if domain not in {'example.com', 'example.org', 'example.net'} and not address.startswith('CONFIGURE_'):
                errors.append(f'{rel}: dirección de correo fuera de dominios de ejemplo')
                break
        if path.suffix.lower() == '.json':
            try:
                data = json.loads(body)
            except json.JSONDecodeError as exc:
                errors.append(f'{rel}: JSON inválido en línea {exc.lineno}')
                continue
            if rel.startswith('flujos/'):
                workflows += 1
                if not isinstance(data, dict) or not isinstance(data.get('nodes'), list):
                    errors.append(f'{rel}: export sin lista de nodos')
                    continue
                if data.get('active') is not False:
                    errors.append(f'{rel}: active debe ser false')
                if data.get('pinData'):
                    errors.append(f'{rel}: datos fijados de nodos')
                if data.get('staticData'):
                    errors.append(f'{rel}: estado estático de ejecuciones')
                for key in ('meta', 'shared', 'owner', 'createdAt', 'updatedAt'):
                    if data.get(key):
                        errors.append(f'{rel}: metadatos de instancia ({key})')
                nodes = data['nodes']
                names = [n.get('name') for n in nodes]
                ids = [n.get('id') for n in nodes]
                if len(names) != len(set(names)) or None in names:
                    errors.append(f'{rel}: nombres de nodo inválidos/duplicados')
                if len(ids) != len(set(ids)) or None in ids:
                    errors.append(f'{rel}: IDs de nodo inválidos/duplicados')
                connections = data.get('connections', {})
                for origin, outputs in connections.items():
                    if origin not in names:
                        errors.append(f'{rel}: conexión de origen inexistente')
                    for branches in outputs.values():
                        for branch in branches:
                            for edge in branch:
                                if edge.get('node') not in names:
                                    errors.append(f'{rel}: conexión de destino inexistente')
                for node in nodes:
                    for cred in node.get('credentials', {}).values():
                        if not str(cred.get('id', '')).startswith('CONFIGURE_'):
                            errors.append(f'{rel}: credencial sin marcador ({node["name"]})')
                    code = node.get('parameters', {}).get('jsCode')
                    if code:
                        js_nodes.append((rel + ':' + node['name'], code))
        if path.suffix.lower() == '.md':
            for target in re.findall(r'(?<!!)\[[^\]]*\]\(([^)]+)\)', body):
                target = target.strip('<>')
                if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:', target) or target.startswith('#'):
                    continue
                location = unquote(target.split('#', 1)[0].split('?', 1)[0])
                if location and not (path.parent / location).exists():
                    errors.append(f'{rel}: enlace local roto ({location})')
    node = shutil.which('node')
    if node:
        process = subprocess.run([node, str(ROOT / 'scripts/sintaxis_code.js')],
                                 input=json.dumps(js_nodes), text=True, capture_output=True, encoding='utf-8')
        try:
            syntax_errors = json.loads(process.stdout)
        except json.JSONDecodeError:
            syntax_errors = [{'nodo': 'compilador', 'error': 'no produjo JSON válido'}]
        if process.returncode:
            errors.append('El compilador de nodos Code no pudo ejecutarse')
        for item in syntax_errors:
            errors.append(f'Sintaxis Code: {item["nodo"]}: {item["error"]}')
    else:
        errors.append('Falta Node.js; no se pudo comprobar sintaxis de nodos Code')
    notes.append('Los marcadores de configuración son deliberados; las credenciales se asignan en n8n.')
    notes.append('Los defectos funcionales heredados se documentan y se revisan con check_workflow.py.')
    return {'files': total_files, 'workflows': workflows, 'code_nodes': len(js_nodes),
            'errors': sorted(set(errors)), 'notes': notes}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--json', action='store_true')
    options = parser.parse_args()
    result = validate()
    if options.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f'Archivos: {result["files"]}; workflows: {result["workflows"]}; nodos Code: {result["code_nodes"]}')
        for error in result['errors']:
            print('ERROR: ' + error)
        for note in result['notes']:
            print('NOTA: ' + note)
        print(f'Resultado: {len(result["errors"])} errores de publicación')
    return bool(result['errors'])


if __name__ == '__main__':
    raise SystemExit(main())
