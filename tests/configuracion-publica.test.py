"""Pruebas del empaquetado: sustituciones y detección de secretos, sin escribir."""
import importlib.util
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.dont_write_bytecode = True


def module(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / 'scripts' / (name + '.py'))
    value = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(value)
    return value


prepare = module('preparar_copia')
validate = module('validar_publicacion')


class Packaging(unittest.TestCase):
    def test_json_replacement_preserves_types_and_input(self):
        original = {'chat': 123456789, 'text': 'CONFIGURE_OWNER_NAME / CONFIGURE_OWNER_NAME'}
        result = prepare.replace_value(original, {'123456789': '987654321', 'CONFIGURE_OWNER_NAME': 'Demo "A"'})
        self.assertEqual(result['chat'], 987654321)
        self.assertEqual(result['text'], 'Demo "A" / Demo "A"')
        self.assertEqual(original['chat'], 123456789)
        json.loads(json.dumps(result))

    def test_numeric_identifier_rejects_text(self):
        with self.assertRaises(ValueError):
            prepare.replace_value(123456789, {'123456789': 'invalid'})

    def test_missing_mapping_keeps_marker(self):
        self.assertEqual(prepare.replace_value('CONFIGURE_OWNER_NAME', {}), 'CONFIGURE_OWNER_NAME')

    def test_inventory_covers_all_components(self):
        inventory = prepare.markers()
        self.assertIn('123456789', inventory)
        self.assertIn('CONFIGURE_FINANCE_SHEET_ID', inventory)
        self.assertIn('CONFIGURE_ASSISTANT_SHEET_ID', inventory)
        self.assertIn('CONFIGURE_EXTRACTS_FOLDER_ID', inventory)
        self.assertIn('TU_BOT_TELEGRAM_bot', inventory)
        for paths in inventory.values():
            for relative in paths:
                self.assertTrue((ROOT / relative).is_file())

    def test_secret_patterns_detect_synthetic_key(self):
        # Construida como texto ficticio; no es una credencial ni una llamada API.
        fake = 'sk-' + 'a' * 28
        self.assertTrue(validate.PATTERNS['clave API'].search(fake))
        self.assertFalse(validate.PATTERNS['clave API'].search('CONFIGURE_googlePalmApi'))


if __name__ == '__main__':
    unittest.main(verbosity=2)
