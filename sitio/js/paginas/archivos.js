/* Explorador de archivos: carpetas, migas de pan y búsqueda */
const est = { carpeta: '', q: '', tipo: 'todos', orden: 'nombre', comp: false, soloAqui: false, limite: 80 };
let visibles = [];

function leerUrl() {
  const p = new URLSearchParams(location.search);
  est.carpeta = (p.get('carpeta') || '').replace(/^\/+|\/+$/g, '');
  est.q = p.get('q') || '';
  est.limite = 80;
  $('#textoBusqueda').value = est.q;
  // en el material anterior conviene ver también los archivos de compilación
  if (est.carpeta.startsWith('DOCUMENTACION ANTERIOR')) { est.comp = true; $('#verComp').checked = true; }
}
function irA(carpeta, q = '') {
  const p = new URLSearchParams();
  if (carpeta) p.set('carpeta', carpeta);
  if (q) p.set('q', q);
  history.pushState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
  leerUrl(); pintar(); window.scrollTo({ top: 0 });
}

const dentro = (a, c) => !c || a.ruta.startsWith(c + '/');
const pasaFiltros = a => (est.comp || !a.compilacion) && (est.tipo === 'todos' || a.tipo === est.tipo);
function ordenar(lista) {
  const f = { nombre: (x, y) => x.nombre.localeCompare(y.nombre, 'es', { numeric: true }),
              tamano: (x, y) => y.bytes - x.bytes,
              tipo: (x, y) => x.ext.localeCompare(y.ext) || x.nombre.localeCompare(y.nombre) }[est.orden];
  return lista.sort(f);
}

function pintarArbol() {
  const secciones = [...new Set(TODOS.map(a => a.ruta.includes('/') ? a.ruta.split('/')[0] : ''))].filter(Boolean)
    .sort((x, y) => (x === 'DOCUMENTACION ANTERIOR') - (y === 'DOCUMENTACION ANTERIOR') || infoSeccion(x).nombre.localeCompare(infoSeccion(y).nombre, 'es'));
  const raiz = est.carpeta.split('/')[0];
  $('#arbol').innerHTML = `<h3>Carpetas</h3>
    <a href="archivos.html" data-ir="" class="${!est.carpeta && !est.q ? 'activo' : ''}">${icono('casa', 17)}<span>Todo el repositorio</span><em>${TODOS.filter(pasaFiltros).length}</em></a>` +
    secciones.map(s => `<a href="${urlCarpeta(s)}" data-ir="${escapar(s)}" class="${raiz === s ? 'activo' : ''}">
      ${icono(infoSeccion(s).ico, 17)}<span>${escapar(infoSeccion(s).nombre)}</span><em>${TODOS.filter(a => dentro(a, s) && pasaFiltros(a)).length}</em></a>`).join('');
}
function pintarMigas() {
  const partes = est.carpeta ? est.carpeta.split('/') : [];
  $('#migas').innerHTML = `<a href="archivos.html" data-ir="">Repositorio</a>` + partes.map((p, i) => {
    const r = partes.slice(0, i + 1).join('/');
    return ` <span>›</span> <a href="${urlCarpeta(r)}" data-ir="${escapar(r)}">${escapar(i === 0 ? infoSeccion(p).nombre : p)}</a>`;
  }).join('');
}

function pintar() {
  pintarArbol(); pintarMigas();
  const palabras = normalizar(est.q.trim()).split(/\s+/).filter(Boolean);
  let carpetasHtml = '';
  if (palabras.length) {
    const base = est.soloAqui ? TODOS.filter(a => dentro(a, est.carpeta)) : TODOS;
    visibles = base.filter(a => pasaFiltros(a) && palabras.every(w => a.clave.includes(w)));
    visibles = est.orden === 'nombre'
      ? visibles.sort((x, y) => (y.nombre.toLowerCase().includes(palabras[0]) - x.nombre.toLowerCase().includes(palabras[0])) || x.compilacion - y.compilacion)
      : ordenar(visibles);
    $('#expInfo').innerHTML = `<span><b>${visibles.length}</b> resultado${visibles.length === 1 ? '' : 's'} para «${escapar(est.q)}» ${est.soloAqui && est.carpeta ? 'en esta carpeta' : 'en todo el repositorio'}</span>`;
  } else {
    // subcarpetas inmediatas
    const pref = est.carpeta ? est.carpeta + '/' : '';
    const sub = {};
    for (const a of TODOS) {
      if (!a.ruta.startsWith(pref) || !pasaFiltros(a)) continue;
      const resto = a.ruta.slice(pref.length);
      if (resto.includes('/')) { const c = resto.split('/')[0]; (sub[c] ||= { n: 0, b: 0 }).n++; sub[c].b += a.bytes; }
    }
    const nombreDe = c => est.carpeta ? c : infoSeccion(c).nombre;
    const nombres = Object.keys(sub).sort((x, y) => (x === 'DOCUMENTACION ANTERIOR') - (y === 'DOCUMENTACION ANTERIOR') || nombreDe(x).localeCompare(nombreDe(y), 'es', { numeric: true }));
    carpetasHtml = nombres.length ? `<div class="carpetas">${nombres.map(c => {
      const r = pref + c, info = est.carpeta ? { ico: 'carpeta', nombre: c } : infoSeccion(c);
      return `<a class="tarjeta carpeta" href="${urlCarpeta(r)}" data-ir="${escapar(r)}">${icono(info.ico, 24)}
        <div><b>${escapar(info.nombre)}</b><small>${sub[c].n} archivo${sub[c].n === 1 ? '' : 's'} · ${tamano(sub[c].b)}</small></div></a>`;
    }).join('')}</div>` : '';
    visibles = ordenar(TODOS.filter(a => pasaFiltros(a) && a.ruta.startsWith(pref) && !a.ruta.slice(pref.length).includes('/')));
    const ocultos = TODOS.filter(a => a.ruta.startsWith(pref) && a.compilacion).length;
    $('#expInfo').innerHTML = `<span>${nombres.length ? `${nombres.length} carpeta${nombres.length === 1 ? '' : 's'} · ` : ''}${visibles.length} archivo${visibles.length === 1 ? '' : 's'} aquí</span>
      ${!est.comp && ocultos ? `<span>${ocultos} archivos de compilación ocultos</span>` : ''}`;
    if (est.carpeta) {
      const info = SECCIONES[est.carpeta];
      if (info) $('#expInfo').insertAdjacentHTML('afterbegin', `<span style="width:100%;color:var(--suave)">${info.desc}</span>`);
    }
  }
  const muestra = visibles.slice(0, est.limite);
  $('#listaArchivos').innerHTML = carpetasHtml + (muestra.length
    ? `<div class="tarjeta lista-arch">${muestra.map(a => filaArchivo(a, { resaltar: palabras, sub: palabras.length ? undefined : '' })).join('')}</div>`
    : (carpetasHtml ? '' : `<div class="tarjeta vacio">${icono('buscar', 32)}<p>No hay archivos que coincidan.${est.tipo !== 'todos' || !est.comp ? '<br>Prueba quitando el filtro de tipo o mostrando los archivos de compilación.' : ''}</p></div>`))
    + (visibles.length > est.limite ? `<button class="boton boton--borde mas" id="btnMas">Mostrar ${Math.min(80, visibles.length - est.limite)} más (quedan ${visibles.length - est.limite})</button>` : '');
  $('#soloAquiCaja').hidden = !est.carpeta;
}
window.listaVisor = () => visibles.map(a => a.ruta);

/* Eventos */
document.addEventListener('click', ev => {
  const ir = ev.target.closest('[data-ir]');
  if (ir && !ev.ctrlKey && !ev.metaKey) { ev.preventDefault(); irA(ir.dataset.ir); }
  if (ev.target.closest('#btnMas')) { est.limite += 80; pintar(); }
});
let espera;
$('#textoBusqueda').addEventListener('input', ev => {
  clearTimeout(espera);
  espera = setTimeout(() => {
    est.q = ev.target.value; est.limite = 80;
    const p = new URLSearchParams(location.search);
    est.q ? p.set('q', est.q) : p.delete('q');
    history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
    pintar();
  }, 120);
});
$('#textoBusqueda').addEventListener('keydown', ev => {
  if (ev.key === 'Enter' && visibles[0]) abrirVisor(visibles[0].ruta, window.listaVisor());
  if (ev.key === 'Escape') { ev.target.value = ''; ev.target.dispatchEvent(new Event('input')); }
});
$('#filtroTipo').innerHTML = `<option value="todos">Todos los tipos</option>` + Object.entries(TIPOS).map(([k, t]) => `<option value="${k}">${t.nombre}</option>`).join('');
$('#filtroTipo').onchange = ev => { est.tipo = ev.target.value; pintar(); };
$('#orden').onchange = ev => { est.orden = ev.target.value; pintar(); };
$('#verComp').onchange = ev => { est.comp = ev.target.checked; pintar(); };
$('#soloAqui').onchange = ev => { est.soloAqui = ev.target.checked; pintar(); };
window.addEventListener('popstate', () => { leerUrl(); pintar(); });

leerUrl();
indiceListo.then(pintar).catch(() => {
  $('#listaArchivos').innerHTML = `<div class="tarjeta vacio">No se pudo cargar el índice de archivos. Si abriste el archivo directamente desde la computadora,
    usa un servidor local (<code>python3 -m http.server</code>) o visita la página publicada.<br>
    También puedes <a href="https://github.com/${REPO}" target="_blank" rel="noopener">ver el repositorio en GitHub</a>.</div>`;
});
