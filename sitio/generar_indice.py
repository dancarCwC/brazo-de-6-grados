#!/usr/bin/env python3
"""
Genera sitio/archivos.json con el inventario de todo el repositorio.
Cloudflare Pages lo ejecuta en cada despliegue (Build command:
  python3 sitio/generar_indice.py), así la página siempre muestra los
archivos que hay en GitHub sin tener que editar el HTML.
"""
import json
import os
from datetime import datetime, timezone

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SALIDA = os.path.join(os.path.dirname(__file__), "archivos.json")

IGNORAR_CARPETAS = {".git", "sitio", "ErrorReports", ".github", "node_modules", "__pycache__"}
IGNORAR_EXT = {".bak", ".log", ".dwl", ".dwl2", ".kicad_prl", ".pyc"}

archivos = []
for carpeta, subcarpetas, nombres in os.walk(RAIZ):
    subcarpetas[:] = sorted(d for d in subcarpetas if d not in IGNORAR_CARPETAS and not d.startswith("."))
    for nombre in sorted(nombres):
        ext = os.path.splitext(nombre)[1].lower()
        if ext in IGNORAR_EXT or nombre.startswith("."):
            continue
        ruta_abs = os.path.join(carpeta, nombre)
        ruta = os.path.relpath(ruta_abs, RAIZ).replace(os.sep, "/")
        partes = ruta.split("/")
        archivos.append({
            "ruta": ruta,
            "nombre": nombre,
            "seccion": partes[0] if len(partes) > 1 else "(raíz)",
            "subcarpeta": "/".join(partes[1:-1]),
            "ext": ext.lstrip("."),
            "bytes": os.path.getsize(ruta_abs),
        })

with open(SALIDA, "w", encoding="utf-8") as f:
    json.dump({"generado": datetime.now(timezone.utc).isoformat(timespec="seconds"),
               "total": len(archivos), "archivos": archivos}, f, ensure_ascii=False, indent=0)
print(f"archivos.json: {len(archivos)} archivos indexados")
