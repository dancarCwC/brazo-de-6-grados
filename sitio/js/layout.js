/* =========================================================
   layout.js — menú lateral, barra superior, tema y buscador global
   ========================================================= */
const ICONOS = {
  casa: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  brazo: '<path d="M3 21h9"/><path d="M7 21v-3"/><circle cx="7" cy="16" r="2"/><path d="M8.5 14.5L13 8"/><circle cx="14" cy="7" r="2"/><path d="M15.8 7.8L20 10"/><path d="M20 10l1 3M20 10l2-1"/>',
  informe: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h4"/>',
  carpeta: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  avance: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 15l4-4 3 3 5-6"/>',
  archivo: '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11h14V8"/><path d="M10 12h4"/>',
  equipo: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16 5a3 3 0 0 1 0 6"/><path d="M18 14.5c2 .6 3 2.5 3 5.5"/>',
  plano: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  rayo: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  guia: '<path d="M4 4h11a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M8 9h7M8 13h5"/>',
  libro: '<path d="M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"/><path d="M8 7h8"/>',
  hoja: '<path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5"/>',
  foto: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="15.5" cy="9" r="1"/>',
  buscar: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  luna: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
  descargar: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/>',
  ojo: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  flecha: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
  externo: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
};
const icono = (n, t = 20) => `<svg class="ico" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[n] || ICONOS.carpeta}</svg>`;
const ICONO_GITHUB = '<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';

const PAGINAS = [
  { id: 'inicio',     href: 'index.html',      nombre: 'Inicio',      ico: 'casa',    desc: 'Resumen y accesos rápidos' },
  { id: 'planta',     href: 'planta.html',     nombre: 'La planta',   ico: 'brazo',   desc: 'Articulaciones, señales y hardware' },
  { id: 'documentos', href: 'documentos.html', nombre: 'Documentos',  ico: 'informe', desc: 'Informes, planos y manuales clave' },
  { id: 'archivos',   href: 'archivos.html',   nombre: 'Explorador',  ico: 'carpeta', desc: 'Todas las carpetas del repositorio' },
  { id: 'avance',     href: 'avance.html',     nombre: 'Avance',      ico: 'avance',  desc: 'Los 8 laboratorios del semestre' },
  { id: 'historico',  href: 'historico.html',  nombre: 'Histórico',   ico: 'archivo', desc: 'Material de semestres anteriores' },
  { id: 'equipo',     href: 'equipo.html',     nombre: 'Equipo',      ico: 'equipo',  desc: 'Escuadra, docente y auxiliares' },
];

(function construirLayout() {
  const actual = document.body.dataset.pagina;
  const pag = PAGINAS.find(p => p.id === actual) || PAGINAS[0];
  const main = $('main');

  const lateral = `
    <aside class="lateral" id="lateral">
      <a class="lateral__marca" href="index.html">
        <img src="img/umsa.png" alt="" width="34" height="34">
        <span><b>Brazo 6 GDL</b><small>XK-JS5B · UMSA</small></span>
      </a>
      <nav class="lateral__nav" aria-label="Secciones">
        ${PAGINAS.map(p => `<a href="${p.href}" class="${p.id === actual ? 'activo' : ''}" ${p.id === actual ? 'aria-current="page"' : ''}>
          ${icono(p.ico)}<span>${p.nombre}</span></a>`).join('')}
      </nav>
      <div class="lateral__pie">
        <a class="lateral__git" href="https://github.com/${REPO}" target="_blank" rel="noopener">${ICONO_GITHUB}<span>Ver en GitHub</span>${icono('externo', 14)}</a>
        <small>ETN-902 · ETN-1034 · ETN-1000<br>Gestión II/2026</small>
      </div>
    </aside>
    <div class="velo" id="velo"></div>`;

  const barra = `
    <header class="barra">
      <button class="boton-ico solo-movil" id="btnMenu" aria-label="Abrir menú">${icono('menu')}</button>
      <div class="barra__titulo">
        <span class="barra__ico">${icono(pag.ico, 18)}</span>
        <div><h1>${pag.nombre}</h1><small>${pag.desc}</small></div>
      </div>
      <button class="buscador-btn" id="btnBuscar" aria-label="Buscar archivos (Ctrl+K)">
        ${icono('buscar', 18)}<span>Buscar archivos…</span><kbd>Ctrl K</kbd>
      </button>
      <button class="boton-ico" id="btnTema" aria-label="Cambiar entre tema claro y oscuro">${icono('luna')}</button>
    </header>`;

  const pie = `<footer class="pie"><span>Carrera de Ingeniería Electrónica · Facultad de Ingeniería · UMSA · La Paz, Bolivia</span>
    <span id="pieFecha"></span></footer>`;

  main.classList.add('contenido');
  const envoltura = document.createElement('div');
  envoltura.className = 'app';
  envoltura.innerHTML = lateral + `<div class="principal">${barra}</div>`;
  document.body.prepend(envoltura);
  $('.principal').append(main);
  $('.principal').insertAdjacentHTML('beforeend', pie);
  document.title = `${pag.nombre} · Brazo Robótico 6 GDL`;

  /* Menú móvil */
  const abrirMenu = v => { $('#lateral').classList.toggle('abierto', v); $('#velo').classList.toggle('visible', v); };
  $('#btnMenu').onclick = () => abrirMenu(true);
  $('#velo').onclick = () => abrirMenu(false);

  /* Tema */
  $('#btnTema').onclick = () => {
    const r = document.documentElement;
    const oscuro = r.dataset.tema ? r.dataset.tema === 'oscuro' : matchMedia('(prefers-color-scheme: dark)').matches;
    r.dataset.tema = oscuro ? 'claro' : 'oscuro';
    try { localStorage.setItem('tema', r.dataset.tema); } catch (e) {}
  };

  indiceListo.then(() => {
    $('#pieFecha').textContent = `Índice actualizado el ${INDICE_FECHA.toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' })} · ${TODOS.length} archivos`;
  }).catch(() => {
    $('#pieFecha').textContent = 'No se pudo cargar el índice de archivos.';
  });
})();

/* =========================================================
   Buscador global (Ctrl+K o "/")
   ========================================================= */
(function buscadorGlobal() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="paleta" id="paleta" role="dialog" aria-modal="true" aria-label="Buscar en el repositorio" hidden>
      <div class="paleta__caja">
        <label class="paleta__entrada">${icono('buscar')}
          <input id="paletaTexto" type="search" placeholder="Busca un archivo, carpeta o página…" autocomplete="off" spellcheck="false">
          <kbd>Esc</kbd></label>
        <ul class="paleta__lista" id="paletaLista" role="listbox"></ul>
        <div class="paleta__ayuda"><span><kbd>↑</kbd><kbd>↓</kbd> moverse</span><span><kbd>Enter</kbd> abrir</span><span><kbd>Esc</kbd> cerrar</span></div>
      </div>
    </div>`);
  const paleta = $('#paleta'), entrada = $('#paletaTexto'), lista = $('#paletaLista');
  let resultados = [], sel = 0;

  function puntuar(a, palabras) {
    const n = normalizar(a.nombre);
    let p = 0;
    for (const w of palabras) {
      if (!a.clave.includes(w)) return -1;
      p += n.startsWith(w) ? 30 : n.includes(w) ? 15 : 3;
    }
    if (a.compilacion) p -= 25;
    if (a.seccion === 'DOCUMENTACION ANTERIOR') p -= 6;
    if (a.ext === 'pdf') p += 4;
    return p;
  }
  function buscar(q) {
    const palabras = normalizar(q).split(/\s+/).filter(Boolean);
    const paginas = PAGINAS.filter(p => !palabras.length || palabras.every(w => normalizar(p.nombre + ' ' + p.desc).includes(w)))
      .map(p => ({ tipo: 'pagina', p }));
    if (!palabras.length) {
      const sugeridos = documentosClave().slice(0, 6).map(d => ({ tipo: 'archivo', a: d.a, titulo: d.titulo }));
      return [...paginas, ...sugeridos];
    }
    const archivos = TODOS.map(a => ({ a, s: puntuar(a, palabras) })).filter(x => x.s >= 0)
      .sort((x, y) => y.s - x.s || x.a.nombre.localeCompare(y.a.nombre)).slice(0, 40)
      .map(x => ({ tipo: 'archivo', a: x.a }));
    return [...paginas.slice(0, 3), ...archivos];
  }
  function pintar() {
    if (!resultados.length) { lista.innerHTML = `<li class="paleta__vacio">Sin resultados. Prueba con otra palabra.</li>`; return; }
    let encabezado = '';
    lista.innerHTML = resultados.map((r, i) => {
      const grupo = r.tipo === 'pagina' ? 'Páginas' : (entrada.value ? 'Archivos' : 'Documentos sugeridos');
      const cab = grupo !== encabezado ? `<li class="paleta__grupo">${grupo}</li>` : ''; encabezado = grupo;
      if (r.tipo === 'pagina') return `${cab}<li role="option" class="paleta__item ${i === sel ? 'sel' : ''}" data-i="${i}">
        <span class="paleta__ico pag">${icono(r.p.ico, 18)}</span><span class="paleta__txt"><b>${r.p.nombre}</b><small>${r.p.desc}</small></span>${icono('flecha', 16)}</li>`;
      const t = TIPOS[r.a.tipo];
      return `${cab}<li role="option" class="paleta__item ${i === sel ? 'sel' : ''}" data-i="${i}">
        <span class="paleta__ico" style="--c:${t.color}">${escapar(r.a.ext.slice(0, 4).toUpperCase())}</span>
        <span class="paleta__txt"><b>${escapar(r.titulo || r.a.nombre)}</b><small>${escapar(r.a.ruta.split('/').slice(0, -1).join(' / ') || 'raíz')} · ${tamano(r.a.bytes)}</small></span>
        <a class="paleta__carpeta" href="${urlCarpeta(r.a.ruta.split('/').slice(0, -1).join('/'))}" title="Abrir su carpeta" aria-label="Abrir la carpeta">${icono('carpeta', 16)}</a></li>`;
    }).join('');
    const s = lista.querySelector('.sel'); if (s) s.scrollIntoView({ block: 'nearest' });
  }
  function elegir(i) {
    const r = resultados[i]; if (!r) return;
    if (r.tipo === 'pagina') { location.href = r.p.href; return; }
    cerrar(); abrirVisor(r.a.ruta);
  }
  function abrir() {
    paleta.hidden = false; document.body.classList.add('sin-scroll');
    entrada.value = ''; sel = 0;
    indiceListo.then(() => { resultados = buscar(''); pintar(); }).catch(() => { lista.innerHTML = '<li class="paleta__vacio">No se pudo cargar el índice.</li>'; });
    setTimeout(() => entrada.focus(), 10);
  }
  function cerrar() { paleta.hidden = true; document.body.classList.remove('sin-scroll'); }
  window.abrirBuscador = abrir;

  entrada.addEventListener('input', () => { sel = 0; resultados = buscar(entrada.value); pintar(); });
  entrada.addEventListener('keydown', ev => {
    if (ev.key === 'ArrowDown') { sel = Math.min(sel + 1, resultados.length - 1); pintar(); ev.preventDefault(); }
    if (ev.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); pintar(); ev.preventDefault(); }
    if (ev.key === 'Enter') { elegir(sel); ev.preventDefault(); }
  });
  lista.addEventListener('click', ev => {
    if (ev.target.closest('.paleta__carpeta')) return;
    const li = ev.target.closest('[data-i]'); if (li) elegir(+li.dataset.i);
  });
  lista.addEventListener('mousemove', ev => {
    const li = ev.target.closest('[data-i]'); if (li && +li.dataset.i !== sel) { sel = +li.dataset.i; $$('.paleta__item', lista).forEach(x => x.classList.toggle('sel', +x.dataset.i === sel)); }
  });
  paleta.addEventListener('click', ev => { if (ev.target === paleta) cerrar(); });
  $('#btnBuscar').onclick = abrir;
  document.addEventListener('keydown', ev => {
    const escribiendo = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
    if ((ev.key === 'k' && (ev.ctrlKey || ev.metaKey)) || (ev.key === '/' && !escribiendo && paleta.hidden)) { ev.preventDefault(); abrir(); }
    else if (ev.key === 'Escape' && !paleta.hidden) cerrar();
  });
})();
