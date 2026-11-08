# Sitio web del repositorio

Página estática (HTML + CSS + JS, sin dependencias) publicada con **Cloudflare Pages**.

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura de la página |
| `estilos.css` | Diseño (modo claro y oscuro, adaptable a celular) |
| `app.js` | Explorador de archivos, articulaciones, avance del semestre |
| `generar_indice.py` | Recorre el repositorio y crea `archivos.json` |
| `archivos.json` | Inventario de archivos (lo regenera Cloudflare en cada despliegue) |
| `img/` | Imágenes optimizadas de la página |

## Configuración en Cloudflare Pages
- **Framework preset:** None
- **Build command:** `python3 sitio/generar_indice.py`
- **Build output directory:** `sitio`

## Probar en la computadora
```bash
python3 sitio/generar_indice.py
cd sitio && python3 -m http.server 8000
# abrir http://localhost:8000
```

## Editar contenido
- Datos de las articulaciones: arreglo `EJES` en `app.js`.
- Laboratorios y fechas: arreglo `LABS` en `app.js`.
- Un laboratorio aparece como **Entregado** cuando existe `INFORMES/INFORME_N/*.pdf`.
