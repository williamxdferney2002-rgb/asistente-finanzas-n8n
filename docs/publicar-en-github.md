# Publicar esta carpeta como un repositorio nuevo

Estos pasos son manuales. La preparación de la copia no creó un repositorio remoto, no hizo commits ni subió archivos.

1. Abre una terminal **dentro de esta carpeta GitHub**. No la abras en la carpeta privada de origen.
2. Ejecuta `python -X utf8 scripts/validar_publicacion.py` y revisa [el informe](validacion.md). Los límites heredados de las funciones siguen documentados aunque la copia pase los controles de privacidad y estructura.
3. Lee el contenido que vas a publicar, elige nombre y descripción y decide la licencia del código propio. No se asignó una licencia por defecto.
4. Crea un repositorio vacío en tu cuenta de GitHub, sin importar el historial del proyecto privado.
5. Ejecuta, desde esta carpeta:

```powershell
git init
git branch -M main
git add .
git diff --cached --stat
git diff --cached
```

6. Comprueba que solo se prepararon los archivos de esta copia. Después:

```powershell
git commit -m "Publicar snapshot anonimizado de automatizaciones"
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

Sustituye la URL por la del repositorio creado. Usa la autenticación normal de Git; no incluyas un token en la URL, en los documentos ni en el mensaje del commit.

No copies la carpeta `.git` del proyecto privado: su historial podría contener valores que ya no aparecen en los archivos actuales. Las versiones antiguas permanecen intactas en sus carpetas originales y están fuera de esta entrega.
