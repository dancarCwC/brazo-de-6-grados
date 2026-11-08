# Sitio web del repositorio

Sitio estático de varias páginas (HTML + CSS + JS, sin dependencias) publicado con **Cloudflare Workers** (assets estáticos).

## Páginas
| Página | Contenido |
|---|---|
| `index.html` | Inicio: buscador, cifras, accesos a cada sección, documentos más usados y laboratorio actual |
| `planta.html` | La planta, con pestañas: articulaciones (esquema clicable), flujo de señales, hardware y tarjeta |
| `documentos.html` | Documentos clave (informes, planos, pinaje, manuales, hojas de datos, guías) con filtros |
| `archivos.html` | Explorador: árbol de carpetas, migas de pan, búsqueda, filtros por tipo y orden. Acepta `?carpeta=` y `?q=` |
| `avance.html` | Los 8 laboratorios por fase y su estado |
| `historico.html` | Material de semestres anteriores |
| `equipo.html` | Escuadra, docente y auxiliares |
| `404.html` | Página de error |

## Estructura
| Ruta | Para qué sirve |
|---|---|
| `css/app.css` | Diseño (tema claro y oscuro, adaptable a celular) |
| `js/datos.js` | Datos compartidos: carpetas, tipos, `EJES`, `LABS`, documentos destacados |
| `js/layout.js` | Menú lateral, barra superior, tema y buscador global (**Ctrl K** o **/**) |
| `js/visor.js` | Vista previa integrada y descarga directa |
| `js/paginas/*.js` | Lógica propia de cada página |
| `vendor/pdfjs/` | PDF.js 3.11.174 (Apache 2.0) para ver PDF en celulares |
| `generar_indice.py` | Recorre el repositorio y crea `archivos.json` |

## Cloudflare (Workers)
- **Build command:** `python3 sitio/generar_indice.py`
- **Deploy command:** `npx wrangler deploy`
- `wrangler.jsonc` en la raíz del repositorio apunta a `./sitio` con `"not_found_handling": "404-page"`.

## Probar en la computadora
```bash
python3 sitio/generar_indice.py
cd sitio && python3 -m http.server 8000   # abrir http://localhost:8000
```

## Editar contenido
- Articulaciones: `EJES` en `js/datos.js`. Laboratorios y fechas: `LABS` en `js/datos.js`.
- Un laboratorio aparece como **Entregado** cuando existe `INFORMES/INFORME_N/*.pdf`.
- Agregar una página: crear el HTML con `<body data-pagina="id">` y sumarla al arreglo `PAGINAS` de `js/layout.js`.

## Atajos
**Ctrl K** o **/** abre el buscador desde cualquier página · **← →** recorren archivos en el visor · **Esc** cierra.
Enlace directo a un archivo: `pagina.html#ver=RUTA/DEL/ARCHIVO.pdf`.
