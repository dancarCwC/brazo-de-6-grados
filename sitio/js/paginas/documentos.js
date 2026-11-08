/* Documentos clave: tarjetas filtrables */
const ICO_CAT = { 'Informes': 'informe', 'Planos': 'plano', 'Pinaje': 'chip', 'Manuales': 'libro', 'Hojas de datos': 'hoja', 'Guías': 'guia' };
const COLOR_CAT = { 'Informes': '#2563eb', 'Planos': '#7c3aed', 'Pinaje': '#0891b2', 'Manuales': '#059669', 'Hojas de datos': '#475569', 'Guías': '#d97706' };
let docs = [], cat = new URLSearchParams(location.search).get('cat') || 'Todos';

function pintar() {
  const q = normalizar($('#filtroDocs').value.trim());
  const vis = docs.filter(d => (cat === 'Todos' || d.cat === cat) && (!q || normalizar(d.titulo + ' ' + d.a.ruta).includes(q)));
  $('#pildoras').innerHTML = ['Todos', ...Object.keys(ICO_CAT)].map(c => {
    const n = c === 'Todos' ? docs.length : docs.filter(d => d.cat === c).length;
    return n ? `<button class="pildora ${c === cat ? 'activa' : ''}" data-cat="${c}">${c}<b>${n}</b></button>` : '';
  }).join('');
  $('#rejillaDocs').innerHTML = vis.map(d => `
    <article class="tarjeta doc">
      <button class="doc__portada" style="--c:${COLOR_CAT[d.cat]}" data-ver="${escapar(d.a.ruta)}" aria-label="Vista previa de ${escapar(d.titulo)}">
        <span class="chip">${escapar(d.a.ext.toUpperCase())}</span>${icono(ICO_CAT[d.cat], 40)}<span class="ver">${icono('ojo', 20)}&nbsp; Vista previa</span></button>
      <div class="doc__cuerpo">
        <span class="doc__cat">${d.cat}</span>
        <h3>${escapar(d.titulo)}</h3>
        <small>${escapar(d.a.nombre)} · ${tamano(d.a.bytes)}</small>
        <div class="doc__acc">
          <a class="boton boton--borde boton--chico" href="${urlVer(d.a.ruta)}" data-ver="${escapar(d.a.ruta)}">${icono('ojo', 16)} Ver</a>
          <a class="boton boton--primario boton--chico" href="${urlDescargar(d.a.ruta)}" data-descargar="${escapar(d.a.ruta)}">${icono('descargar', 16)} Descargar</a>
        </div>
      </div>
    </article>`).join('') || '<p class="vacio">Ningún documento coincide. Prueba el buscador global (Ctrl K) para buscar en todo el repositorio.</p>';
}
$('#pildoras').onclick = ev => {
  const b = ev.target.closest('[data-cat]'); if (!b) return;
  cat = b.dataset.cat; pintar();
  history.replaceState(null, '', cat === 'Todos' ? location.pathname : `?cat=${encodeURIComponent(cat)}`);
};
$('#filtroDocs').oninput = pintar;
indiceListo.then(() => { docs = documentosClave(); pintar(); })
  .catch(() => { $('#rejillaDocs').innerHTML = '<p class="vacio">No se pudo cargar el índice de archivos.</p>'; });
