/* =========================================================
   Visor integrado: vista previa y descarga directa
   (PDF, imágenes, video, Office, texto y código)
   ========================================================= */
(() => {
  const PDFJS = 'vendor/pdfjs/';   // PDF.js 3.11.174 incluido en el sitio
  const LIMITE_AUTO = 30 * 1048576;          // por encima de 30 MB se pregunta antes de cargar
  const LIMITE_TEXTO = 2 * 1048576;          // archivos de texto hasta 2 MB
  const EXT = {
    pdf: ['pdf'],
    img: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'],
    video: ['mp4', 'webm', 'mov', 'm4v', 'ogg'],
    office: ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'],
    texto: ['txt', 'md', 'csv', 'c', 'h', 'asm', 's', 'inc', 'py', 'm', 'sql', 'json', 'xml', 'ino', 'cpp', 'js',
            'html', 'css', 'ini', 'cfg', 'bat', 'sh', 'vhd', 'vhdl', 'v', 'tex', 'mk', 'lst', 'map'],
  };
  const MIME = { pdf: 'application/pdf', svg: 'image/svg+xml', mp4: 'video/mp4', m4v: 'video/mp4', webm: 'video/webm',
                 mov: 'video/quicktime', ogg: 'video/ogg' };
  const SIN_VISTA = {
    dwg: 'Los planos de AutoCAD se abren con AutoCAD o con el visor gratuito <a href="https://viewer.autodesk.com" target="_blank" rel="noopener">Autodesk Viewer</a> (arrastra allí el archivo descargado). Busca también el PDF del mismo plano en esta carpeta.',
    kicad_sch: 'Ábrelo con <a href="https://www.kicad.org" target="_blank" rel="noopener">KiCad</a> (gratuito). El PDF del pinaje está en la misma carpeta.',
    kicad_pcb: 'Ábrelo con KiCad.', kicad_pro: 'Es el proyecto de KiCad: descarga la carpeta completa y ábrelo con KiCad.',
    kicad_sym: 'Es una librería de símbolos de KiCad.', eddx: 'Ábrelo con Wondershare EdrawMax.',
    pdsprj: 'Es una simulación de Proteus.', rar: 'Es un archivo comprimido: descárgalo y descomprímelo.',
    zip: 'Es un archivo comprimido: descárgalo y descomprímelo.', hex: 'Es el firmware compilado para grabar en el PIC con el PICkit.',
  };

  const tipoVista = ext => Object.keys(EXT).find(k => EXT[k].includes(ext)) || 'ninguna';
  const cache = new Map();                   // ruta -> Blob (se conservan los últimos 4)
  let lista = [], indice = 0, hashPrevio = '', urlObjeto = null, controlador = null;

  /* ---------- Estructura del modal ---------- */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="visor" id="visor" role="dialog" aria-modal="true" aria-labelledby="visorTitulo" hidden>
      <div class="visor__caja">
        <header class="visor__cab">
          <span class="visor__ico" id="visorIco"></span>
          <div class="visor__info"><b id="visorTitulo"></b><small id="visorRuta"></small></div>
          <div class="visor__acc">
            <button class="boton boton--borde boton--chico" id="visorAnt" aria-label="Archivo anterior">‹</button>
            <span class="visor__pos" id="visorPos"></span>
            <button class="boton boton--borde boton--chico" id="visorSig" aria-label="Archivo siguiente">›</button>
            <button class="boton boton--primario boton--chico" id="visorDesc">${icono('descargar',16)}<span class="txt-ocultable">Descargar</span></button>
            <a class="boton boton--borde boton--chico" id="visorGit" target="_blank" rel="noopener" aria-label="Abrir en GitHub">${ICONO_GITHUB}</a>
            <button class="boton-ico" id="visorCerrar" aria-label="Cerrar vista previa">${icono('cerrar')}</button>
          </div>
        </header>
        <div class="visor__cuerpo" id="visorCuerpo"></div>
      </div>
    </div>`);
  const $v = id => document.getElementById(id);
  const visor = $v('visor'), cuerpo = $v('visorCuerpo');

  /* ---------- Descarga con progreso ---------- */
  async function obtenerBlob(a, alAvanzar) {
    if (cache.has(a.ruta)) return cache.get(a.ruta);
    controlador = new AbortController();
    const r = await fetch(urlRaw(a.ruta), { signal: controlador.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const total = +r.headers.get('content-length') || a.bytes || 0;
    const lector = r.body.getReader();
    const partes = []; let recibido = 0;
    for (;;) {
      const { done, value } = await lector.read();
      if (done) break;
      partes.push(value); recibido += value.length;
      if (alAvanzar && total) alAvanzar(recibido / total);
    }
    const blob = new Blob(partes, { type: MIME[a.ext] || 'application/octet-stream' });
    cache.set(a.ruta, blob);
    if (cache.size > 4) cache.delete(cache.keys().next().value);
    return blob;
  }
  function guardar(blob, nombre) {
    const url = URL.createObjectURL(blob);
    const enlace = Object.assign(document.createElement('a'), { href: url, download: nombre });
    document.body.appendChild(enlace); enlace.click(); enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
  async function descargar(a, boton) {
    const original = boton ? boton.innerHTML : '';
    try {
      if (boton) { boton.disabled = true; boton.textContent = '0 %'; }
      const blob = await obtenerBlob(a, p => { if (boton) boton.textContent = `${Math.round(p * 100)} %`; });
      guardar(blob, a.nombre);
    } catch (e) {
      if (e.name !== 'AbortError') location.href = urlDescargar(a.ruta);   // respaldo: descarga vía GitHub
    } finally {
      if (boton) { boton.disabled = false; boton.innerHTML = original; }
    }
  }

  /* ---------- Vistas ---------- */
  const cargando = (txt = 'Cargando vista previa…') =>
    cuerpo.innerHTML = `<div class="visor__estado"><div class="giro"></div><p id="visorProg">${txt}</p>
      <div class="barra"><span id="visorBarra"></span></div></div>`;
  const avance = p => { const b = $v('visorBarra'), t = $v('visorProg'); if (b) b.style.width = `${p * 100}%`; if (t) t.textContent = `Descargando… ${Math.round(p * 100)} %`; };
  const mensaje = (ico, html, conDescarga = true) => cuerpo.innerHTML = `
    <div class="visor__estado"><div class="visor__grande">${ico}</div><div class="visor__msg">${html}</div>
    ${conDescarga ? `<button class="boton boton--primario" data-accion="descargar">${icono('descargar',18)} Descargar archivo</button>` : ''}</div>`;
  const liberar = () => { if (urlObjeto) { URL.revokeObjectURL(urlObjeto); urlObjeto = null; } };

  async function vistaPdf(a) {
    cargando();
    const blob = await obtenerBlob(a, avance);
    if (navigator.pdfViewerEnabled !== false && !/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      urlObjeto = URL.createObjectURL(blob);
      cuerpo.innerHTML = `<iframe class="visor__marco" src="${urlObjeto}#view=FitH" title="${escapar(a.nombre)}"></iframe>`;
      return;
    }
    // Celulares: se dibuja con PDF.js
    if (!window.pdfjsLib) {
      await new Promise((ok, mal) => { const s = document.createElement('script'); s.src = PDFJS + 'pdf.min.js'; s.onload = ok; s.onerror = () => mal(new Error('no se pudo cargar PDF.js')); document.head.appendChild(s); });
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js';
    }
    const pdf = await pdfjsLib.getDocument({ data: await blob.arrayBuffer() }).promise;
    cuerpo.innerHTML = `<div class="visor__paginas" id="visorPaginas"><p class="visor__nota">${pdf.numPages} página${pdf.numPages > 1 ? 's' : ''}</p></div>`;
    const cont = $v('visorPaginas'), ancho = Math.min(cont.clientWidth - 24, 1100);
    for (let n = 1; n <= pdf.numPages; n++) {
      if (!visor.hidden && cont.isConnected) {
        const pag = await pdf.getPage(n);
        const esc = ancho / pag.getViewport({ scale: 1 }).width, dpr = window.devicePixelRatio || 1;
        const vp = pag.getViewport({ scale: esc * dpr });
        const lienzo = Object.assign(document.createElement('canvas'), { width: vp.width, height: vp.height });
        lienzo.style.width = `${vp.width / dpr}px`;
        cont.appendChild(lienzo);
        await pag.render({ canvasContext: lienzo.getContext('2d'), viewport: vp }).promise;
      }
    }
  }
  async function vistaImagen(a) {
    let src = urlRaw(a.ruta);
    if (a.ext === 'svg') { cargando(); urlObjeto = URL.createObjectURL(await obtenerBlob(a, avance)); src = urlObjeto; }
    cuerpo.innerHTML = `<div class="visor__img"><img src="${src}" alt="${escapar(a.nombre)}" title="Clic para ampliar o reducir"></div>`;
    const img = cuerpo.querySelector('img');
    img.onclick = () => img.classList.toggle('ampliada');
    img.onerror = () => mensaje(icono('foto',40), 'No se pudo mostrar esta imagen en el navegador.');
  }
  async function vistaVideo(a) {
    cargando();
    urlObjeto = URL.createObjectURL(await obtenerBlob(a, avance));
    cuerpo.innerHTML = `<div class="visor__img"><video src="${urlObjeto}" controls playsinline></video></div>`;
  }
  function vistaOffice(a) {
    const src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(urlRaw(a.ruta))}`;
    cuerpo.innerHTML = `<iframe class="visor__marco" src="${src}" title="${escapar(a.nombre)}"></iframe>
      <p class="visor__nota">Vista previa con Microsoft Office Online. Si no aparece (el visor admite archivos de Word y PowerPoint de hasta 10 MB y Excel de hasta 5 MB), descarga el archivo.</p>`;
  }
  async function vistaTexto(a) {
    if (a.bytes > LIMITE_TEXTO) return mensaje(icono('hoja',40), `El archivo de texto pesa ${tamano(a.bytes)}; es demasiado grande para mostrarlo aquí.`);
    cargando();
    const texto = await (await obtenerBlob(a, avance)).text();
    if (a.ext === 'csv') {
      const filas = texto.split(/\r?\n/).filter(Boolean).slice(0, 500).map(f => f.split(/[;,]/));
      cuerpo.innerHTML = `<div class="visor__texto"><table class="tabla">${filas.map((f, i) =>
        `<tr>${f.map(c => i ? `<td>${escapar(c)}</td>` : `<th>${escapar(c)}</th>`).join('')}</tr>`).join('')}</table></div>`;
      return;
    }
    const lineas = texto.split(/\r?\n/);
    cuerpo.innerHTML = `<div class="visor__texto"><pre class="codigo">${lineas.map((l, i) =>
      `<span class="ln">${i + 1}</span>${escapar(l)}`).join('\n')}</pre></div>`;
  }

  async function mostrar() {
    liberar(); if (controlador) controlador.abort();
    const a = lista[indice];
    const t = TIPOS[a.tipo] || { color: '#7a8599' };
    $v('visorIco').textContent = (a.ext || '—').slice(0, 4).toUpperCase();
    $v('visorIco').style.background = t.color;
    $v('visorTitulo').textContent = a.nombre;
    $v('visorRuta').textContent = `${a.ruta.split('/').slice(0, -1).join(' / ') || 'raíz'} · ${tamano(a.bytes)}`;
    $v('visorGit').href = urlVer(a.ruta);
    $v('visorPos').textContent = lista.length > 1 ? `${indice + 1} de ${lista.length}` : '';
    $v('visorAnt').hidden = $v('visorSig').hidden = lista.length < 2;
    history.replaceState(null, '', '#ver=' + encodeURIComponent(a.ruta));

    const tipo = tipoVista(a.ext);
    const necesitaDescarga = ['pdf', 'video', 'texto'].includes(tipo) || a.ext === 'svg';
    if (tipo === 'ninguna') {
      return mensaje(icono('carpeta',40), `<b>No hay vista previa para archivos .${escapar(a.ext || 'sin extensión')}</b><br>${SIN_VISTA[a.ext] || 'Descárgalo para abrirlo con su programa.'}`);
    }
    if (necesitaDescarga && a.bytes > LIMITE_AUTO && !cache.has(a.ruta)) {
      cuerpo.innerHTML = `<div class="visor__estado"><div class="visor__grande">${icono('archivo',40)}</div>
        <div class="visor__msg">Este archivo pesa <b>${tamano(a.bytes)}</b>. La vista previa tardará un poco en cargar.</div>
        <div class="acciones"><button class="boton boton--primario" data-accion="cargar">Cargar vista previa</button>
        <button class="boton boton--borde" data-accion="descargar">${icono('descargar',18)} Sólo descargar</button></div></div>`;
      return;
    }
    await renderizar(a, tipo);
  }
  async function renderizar(a, tipo) {
    const ruta = a.ruta;
    try {
      if (tipo === 'pdf') await vistaPdf(a);
      else if (tipo === 'img') await vistaImagen(a);
      else if (tipo === 'video') await vistaVideo(a);
      else if (tipo === 'office') vistaOffice(a);
      else if (tipo === 'texto') await vistaTexto(a);
    } catch (e) {
      if (e.name === 'AbortError' || lista[indice]?.ruta !== ruta) return;
      mensaje(icono('cerrar',40), `No se pudo cargar la vista previa (${escapar(String(e?.message || e))}). Puedes descargarlo o abrirlo en GitHub.`);
    }
  }

  /* ---------- Abrir y cerrar ---------- */
  function abrir(ruta, rutas) {
    const mapa = new Map(TODOS.map(a => [a.ruta, a]));
    const base = mapa.get(ruta) || { ruta, nombre: ruta.split('/').pop(), ext: (ruta.split('.').pop() || '').toLowerCase(), bytes: 0, tipo: 'otro' };
    lista = (rutas && rutas.length ? rutas : [ruta]).map(r => mapa.get(r)).filter(Boolean);
    if (!lista.length) lista = [base];
    indice = Math.max(0, lista.findIndex(a => a.ruta === ruta));
    if (visor.hidden) { hashPrevio = location.hash.startsWith('#ver=') ? '' : location.hash; }
    visor.hidden = false; document.body.classList.add('sin-scroll');
    mostrar(); $v('visorCerrar').focus();
  }
  function cerrar() {
    if (controlador) controlador.abort();
    liberar(); cuerpo.innerHTML = '';
    visor.hidden = true; document.body.classList.remove('sin-scroll');
    history.replaceState(null, '', location.pathname + location.search + (hashPrevio || ''));
  }
  const mover = d => { if (lista.length > 1) { indice = (indice + d + lista.length) % lista.length; mostrar(); } };

  $v('visorCerrar').onclick = cerrar;
  $v('visorAnt').onclick = () => mover(-1);
  $v('visorSig').onclick = () => mover(1);
  $v('visorDesc').onclick = ev => descargar(lista[indice], ev.currentTarget);
  visor.addEventListener('click', ev => {
    if (ev.target === visor) return cerrar();
    const acc = ev.target.closest('[data-accion]'); if (!acc) return;
    if (acc.dataset.accion === 'descargar') descargar(lista[indice], acc);
    if (acc.dataset.accion === 'cargar') { const a = lista[indice]; renderizar(a, tipoVista(a.ext)); }
  });
  document.addEventListener('keydown', ev => {
    if (visor.hidden) return;
    if (ev.key === 'Escape') cerrar();
    if (ev.key === 'ArrowLeft') mover(-1);
    if (ev.key === 'ArrowRight') mover(1);
  });

  /* ---------- Enlaces "Ver" y "Descargar" de toda la página ---------- */
  document.addEventListener('click', ev => {
    if (ev.button !== 0 || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;   // ctrl+clic: abrir en GitHub
    const ver = ev.target.closest('[data-ver]');
    const desc = ev.target.closest('[data-descargar]');
    if (ver && !visor.contains(ver)) {
      ev.preventDefault();
      // Las flechas recorren los archivos del mismo grupo (o la lista que la página publique)
      const grupo = ver.closest('[data-grupo]');
      const rutas = typeof window.listaVisor === 'function' && ver.closest('#listaArchivos') ? window.listaVisor()
        : [...(grupo || document).querySelectorAll('[data-ver]')].map(e => e.dataset.ver);
      abrir(ver.dataset.ver, [...new Set(rutas)]);
    } else if (desc) {
      ev.preventDefault();
      const a = TODOS.find(x => x.ruta === desc.dataset.descargar);
      if (a) descargar(a, desc);
    }
  });

  // Enlace directo: .../#ver=RUTA abre el visor al cargar la página
  indiceListo.then(() => {
    if (location.hash.startsWith('#ver=')) {
      hashPrevio = '';
      abrir(decodeURIComponent(location.hash.slice(5)));
    }
  }).catch(() => {});
  window.abrirVisor = abrir;
  window.descargarArchivo = (ruta, boton) => { const a = buscarArchivo(ruta); if (a) descargar(a, boton); };
})();
