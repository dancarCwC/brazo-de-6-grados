/* =========================================================
   Brazo Robótico 6 GDL — lógica de la página
   ========================================================= */
const REPO = 'dancarCwC/brazo-de-6-grados';
const RAMA = 'main';
const POR_PAGINA = 50;

const codificar = ruta => ruta.split('/').map(encodeURIComponent).join('/');
const urlVer = ruta => `https://github.com/${REPO}/blob/${RAMA}/${codificar(ruta)}`;
const urlDescargar = ruta => `https://github.com/${REPO}/raw/${RAMA}/${codificar(ruta)}`;
const urlCarpeta = ruta => `https://github.com/${REPO}/tree/${RAMA}/${codificar(ruta)}`;
const $ = sel => document.querySelector(sel);
const normalizar = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const escapar = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function tamano(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

/* ---------- Secciones del repositorio ---------- */
const SECCIONES = {
  'DIAGRAMAS P&ID':         { ico: '📐', desc: 'Diagrama P&ID de la planta bajo ANSI/ISA-5.1-2009.' },
  'DIAGRAMAS ELECTRICOS':   { ico: '⚡', desc: 'Planos IEC 60617: placa y drivers, motores y pulsadores.' },
  'PINAJE PIC16F1946':      { ico: '📍', desc: 'Qué llega a cada uno de los 64 pines del PIC (KiCad).' },
  'INFORMES':               { ico: '📝', desc: 'Informes de laboratorio de la gestión II/2026.' },
  'GUIAS DE LABORATORIO':   { ico: '📋', desc: 'Las ocho guías del laboratorio integrado.' },
  'MANUALES':               { ico: '📘', desc: 'Manual XK-JS5B, MPLAB X, PICkit 3 e interfaz USB.' },
  'DATASHEET':              { ico: '📄', desc: 'Hojas de datos de drivers y componentes.' },
  'FOTOS':                  { ico: '🖼️', desc: 'Fotografías de la planta y de la tarjeta de control.' },
  'DOCUMENTACION ANTERIOR': { ico: '🗄️', desc: 'Lo que dejaron los semestres anteriores.' },
};
const infoSeccion = s => SECCIONES[s] || { ico: '📁', desc: 'Otros archivos del repositorio.' };

/* ---------- Tipos de archivo ---------- */
const TIPOS = {
  doc:    { nombre: 'Documento', color: '#1f5fbf', ext: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'md', 'rtf', 'odt'] },
  cad:    { nombre: 'Plano',     color: '#6a3fa0', ext: ['dwg', 'dxf', 'eddx', 'kicad_sch', 'kicad_pcb', 'kicad_pro', 'kicad_sym', 'pdsprj', 'dsn', 'sch', 'brd'] },
  img:    { nombre: 'Imagen',    color: '#2e7d32', ext: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'svg', 'webp'] },
  codigo: { nombre: 'Código',    color: '#d9a21b', ext: ['c', 'h', 'asm', 's', 'inc', 'py', 'm', 'slx', 'mdl', 'ino', 'cpp', 'js', 'sql'] },
  video:  { nombre: 'Video',     color: '#b3261e', ext: ['mp4', 'avi', 'mov', 'mkv', 'wmv', '3gp'] },
};
const EXT_COMPILACION = new Set(['set', 'p1', 'd', 'pre', 'dep', 'lst', 'sdb', 'cof', 'obj', 'o', 'cmf', 'hxl', 'sym',
  'mcs', 'map', 'elf', 'hex', 'mk', 'i', 'r', 'rlf', 'as', 'cmd', 'lnk', 'sdl', 'mcw', 'mcp', 'bkx']);
function tipoDe(a) {
  for (const [clave, t] of Object.entries(TIPOS)) if (t.ext.includes(a.ext)) return clave;
  return 'otro';
}
function esCompilacion(a) {
  return EXT_COMPILACION.has(a.ext) || /\/(nbproject|build|dist|debug)\//i.test('/' + a.ruta);
}

/* ---------- Articulaciones ---------- */
const EJES = [
  { n: 1, nombre: 'Base', mov: 'Giro horizontal de toda la torre', lazo: 101, driver: 'ZY-101 · DM542', motor: 'NEMA 23 (57J1854-828)',
    trans: 'Poleas', sensor: 'ZSH-101 · Hall NJK-5002C', pin: '58 (RD0 · SENSOR1)', mando: 'HS-101A/B · M01/M02 · pines 24/23', rango: '±180°',
    extra: 'Tiene el encoder ZT-101 (MBL3806, 600 PPR). Su fase A llega al pin 48 (RB0/INT), pero el encoder no está cableado: es la razón por la que la planta opera en lazo abierto.' },
  { n: 2, nombre: 'Hombro', mov: 'Giro vertical del brazo grande', lazo: 102, driver: 'ZY-102 · DM542', motor: 'NEMA 23 (57J1854-828)',
    trans: 'Acople directo', sensor: 'ZSH-102 · Hall NJK-5002C', pin: '55 (RD1 · SENSOR2)', mando: 'HS-102A/B · M03/M04 · pines 22/21', rango: '±90°',
    extra: 'Es el eje que carga con todo el peso del brazo: el más propenso a perder pasos por sobreesfuerzo.' },
  { n: 3, nombre: 'Codo', mov: 'Giro vertical del brazo pequeño', lazo: 103, driver: 'ZY-103 · DM542', motor: 'NEMA 23 (57J1854-828)',
    trans: 'Correa síncrona (motor en el eje del hombro)', sensor: 'ZSH-103 · Hall NJK-5002C', pin: '54 (RD2 · SENSOR3)', mando: 'HS-103A/B · M05/M06 · pines 28/27', rango: '±90°',
    extra: 'La correa introduce holgura: aunque el motor no pierda pasos, el codo puede no llegar al ángulo ordenado.' },
  { n: 4, nombre: 'Muñeca', mov: 'Rotación de la pata (antebrazo y muñeca)', lazo: 104, driver: 'ZY-104 · DM542 (por confirmar)', motor: 'NEMA 17 o 23 (por confirmar)',
    trans: 'Transmisión síncrona', sensor: 'ZSH-104 · Hall NJK-5002C', pin: '53 (RD3 · SENSOR4)', mando: 'HS-104A/B · M07/M08 · pines 47/46', rango: '±150°',
    extra: 'La documentación heredada asigna a este eje dos motores distintos; hay que leer la placa antes de energizar.' },
  { n: 5, nombre: 'Giro de muñeca', mov: 'Orientación fina del efector', lazo: 105, driver: 'ZY-105 · 2MA320', motor: 'NEMA 17 (42J1848-604)',
    trans: 'Reductor de velocidad', sensor: 'ZSH-105 · Hall NJK-5002C', pin: '52 (RD4 · SENSOR5)', mando: 'HS-105A/B · M09/M010 · pines 45/44', rango: 'Por medir',
    extra: 'El reductor multiplica el par pero agrega backlash, una zona muerta que el lazo abierto no compensa.' },
  { n: 6, nombre: 'Pinza', mov: 'Apertura y cierre de los dedos', lazo: 106, driver: 'ZY-106 · 2MA320', motor: 'NEMA 17 / 16',
    trans: 'Mecanismo de dedos', sensor: 'ZSH-106 (apertura) · ZSL-106 (cierre) · M102-011', pin: '51 y 50 (RD5, RD6 · SENSOR6/7)', mando: 'HS-106A/B · M011/M012 · pines 43/30', rango: 'Abierta / cerrada',
    extra: 'Tiene un potenciómetro lineal para medir aperturas intermedias, pero su cable negro está roto (discrepancia K-14).' },
];

function pintarEjes() {
  const cont = $('#ejesBotones');
  cont.innerHTML = EJES.map(e => `
    <button class="eje-btn" role="tab" id="tab${e.n}" aria-controls="ejePanel" aria-selected="${e.n === 1}" data-eje="${e.n}">
      <span class="num">${e.n}</span><span><b>${e.nombre}</b><small>Lazo ${e.lazo}</small></span>
    </button>`).join('');
  cont.addEventListener('click', ev => {
    const b = ev.target.closest('.eje-btn'); if (!b) return;
    cont.querySelectorAll('.eje-btn').forEach(x => x.setAttribute('aria-selected', x === b));
    mostrarEje(+b.dataset.eje);
  });
  cont.addEventListener('keydown', ev => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(ev.key)) return;
    const bs = [...cont.querySelectorAll('.eje-btn')];
    const i = bs.indexOf(document.activeElement); if (i < 0) return;
    const j = (i + (ev.key === 'ArrowDown' || ev.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length;
    bs[j].focus(); bs[j].click(); ev.preventDefault();
  });
  mostrarEje(1);
}
function mostrarEje(n) {
  const e = EJES[n - 1];
  $('#ejePanel').innerHTML = `
    <h3>Eje ${e.n} · ${e.nombre}</h3>
    <p class="desc">${e.mov}</p>
    <dl class="datos">
      <div><dt>Lazo ISA</dt><dd>${e.lazo}</dd></div>
      <div><dt>Driver</dt><dd><span class="tag">${e.driver.split(' · ')[0]}</span> ${e.driver.split(' · ').slice(1).join(' · ')}</dd></div>
      <div><dt>Motor</dt><dd>${e.motor}</dd></div>
      <div><dt>Transmisión</dt><dd>${e.trans}</dd></div>
      <div><dt>Sensor de posición</dt><dd>${e.sensor}</dd></div>
      <div><dt>Pin del PIC</dt><dd>${e.pin}</dd></div>
      <div><dt>Mando manual</dt><dd>${e.mando}</dd></div>
      <div><dt>Rango</dt><dd>${e.rango}</dd></div>
    </dl>
    <p class="nota">💡 ${e.extra}</p>`;
}

/* ---------- Línea de tiempo ---------- */
const LABS = [
  { n: 1, fase: 1, tema: 'Ingeniería inversa y auditoría Kaizen', det: 'Ficha técnica, variables MV/PV/DV, diagrama de bloques y reporte de discrepancias.', fechas: '4 – 18 ago' },
  { n: 2, fase: 1, tema: 'Planos ISA-5.1 e IEC 60617, mockups HMI/ERP', det: 'P&ID V2.0, planos eléctricos, pinaje del PIC y pantallas en Figma.', fechas: '18 ago – 1 sep' },
  { n: 3, fase: 1, tema: 'Git/GitHub y modelo de datos en 3FN', det: 'Repositorio colaborativo, Pull Requests y base de datos relacional. Cierre de la Fase 1.', fechas: '1 – 15 sep' },
  { n: 4, fase: 2, tema: 'Identificación por caja negra y espacio de estados', det: 'Pruebas en escalón y modelado analítico multivariable.', fechas: '15 – 29 sep' },
  { n: 5, fase: 2, tema: 'Gemelo digital y discretización', det: 'Simulación en MATLAB/Simulink y paso al plano Z.', fechas: '29 sep – 27 oct' },
  { n: 6, fase: 3, tema: 'Control discreto en hardware', det: 'Ecuaciones de diferencias ejecutadas con interrupciones de temporizador.', fechas: '10 – 24 nov' },
  { n: 7, fase: 3, tema: 'Control avanzado LQR', det: 'Realimentación de estados para los procesos no lineales de los brazos.', fechas: '24 nov – 8 dic' },
  { n: 8, fase: 3, tema: 'Redes industriales y cierre del proyecto', det: 'Modbus TCP/RTU entre las cuatro plantas y API del ERP.', fechas: '8 – 22 dic' },
];
function pintarLinea(archivos) {
  $('#lineaTiempo').innerHTML = LABS.map(l => {
    const guia = archivos.find(a => a.seccion === 'GUIAS DE LABORATORIO' && new RegExp(`Laboratorio[ _]?${l.n}\\.pdf$`, 'i').test(a.nombre));
    const informe = archivos.find(a => a.ruta.startsWith(`INFORMES/INFORME_${l.n}/`) && a.ext === 'pdf');
    const ok = !!informe;
    return `<li class="hito ${ok ? 'hito--ok' : ''}">
      <span class="hito__punto">${ok ? '✓' : l.n}</span>
      <div class="hito__caja">
        <div class="hito__cab"><b>Laboratorio ${l.n} · ${l.tema}</b>
          <span><span class="fase fase-${l.fase}">Fase ${l.fase}</span> <span class="estado">${ok ? 'Entregado' : l.fechas}</span></span></div>
        <p>${l.det}</p>
        <div class="acciones">
          ${guia ? `<a class="boton boton--borde boton--chico" href="${urlVer(guia.ruta)}" target="_blank" rel="noopener">📋 Guía</a>` : ''}
          ${informe ? `<a class="boton boton--primario boton--chico" href="${urlVer(informe.ruta)}" target="_blank" rel="noopener">📝 Informe</a>` : ''}
        </div>
      </div></li>`;
  }).join('');
}

/* ---------- Documentos destacados ---------- */
const DESTACADOS = [
  { re: /^INFORMES\/INFORME_(\d+)\/.*\.pdf$/i, titulo: m => `Informe de laboratorio ${m[1]}`, ico: '📝' },
  { re: /^DIAGRAMAS P&ID\/.*\.pdf$/i, titulo: () => 'Diagrama P&ID (ISA-5.1)', ico: '📐' },
  { re: /^DIAGRAMAS ELECTRICOS\/PLACA.*\.pdf$/i, titulo: () => 'Plano eléctrico: placa y drivers', ico: '⚡' },
  { re: /^DIAGRAMAS ELECTRICOS\/MOTORES.*\.pdf$/i, titulo: () => 'Plano eléctrico: motores', ico: '⚡' },
  { re: /^DIAGRAMAS ELECTRICOS\/PULSADORES.*\.pdf$/i, titulo: () => 'Plano eléctrico: pulsadores (mando)', ico: '⚡' },
  { re: /^PINAJE PIC16F1946\/.*\.pdf$/i, titulo: () => 'Pinaje de la tarjeta respecto al PIC16F1946', ico: '📍' },
  { re: /^MANUALES\/XK-JS5B.*\.pdf$/i, titulo: () => 'Manual del fabricante XK-JS5B', ico: '📘' },
  { re: /^DATASHEET\/2DM542.*\.pdf$/i, titulo: () => 'Manual del driver 2DM542', ico: '📄' },
];
function pintarDestacados(archivos) {
  const items = [];
  for (const d of DESTACADOS) for (const a of archivos) {
    const m = a.ruta.match(d.re);
    if (m) items.push({ a, titulo: d.titulo(m), ico: d.ico });
  }
  $('#destacados').innerHTML = items.map(({ a, titulo, ico }) => `
    <article class="doc">
      <div class="doc__ico">${ico}</div>
      <div><b>${escapar(titulo)}</b><small>${escapar(a.nombre)} · ${tamano(a.bytes)}</small>
        <div class="acciones">
          <a class="boton boton--primario boton--chico" href="${urlVer(a.ruta)}" target="_blank" rel="noopener">Ver</a>
          <a class="boton boton--borde boton--chico" href="${urlDescargar(a.ruta)}">Descargar</a>
        </div></div>
    </article>`).join('') || '<p class="vacio">Todavía no hay documentos destacados.</p>';
}

/* ---------- Explorador ---------- */
const estado = { texto: '', tipo: '', seccion: '', prefijo: '', compilacion: false, mostrados: POR_PAGINA };
let TODOS = [];

function filtrar() {
  const palabras = normalizar(estado.texto).split(/\s+/).filter(Boolean);
  return TODOS.filter(a => {
    if (!estado.compilacion && a.compilacion) return false;
    if (estado.seccion && a.seccion !== estado.seccion) return false;
    if (estado.prefijo && !a.ruta.startsWith(estado.prefijo)) return false;
    if (estado.tipo && a.tipo !== estado.tipo) return false;
    return palabras.every(p => a.clave.includes(p));
  });
}
function resaltar(texto) {
  const palabras = normalizar(estado.texto).split(/\s+/).filter(Boolean);
  let html = escapar(texto);
  if (!palabras.length) return html;
  const norm = normalizar(texto);
  const marcas = new Array(texto.length).fill(false);
  for (const p of palabras) { let i = norm.indexOf(p); while (i >= 0) { for (let k = i; k < i + p.length; k++) marcas[k] = true; i = norm.indexOf(p, i + 1); } }
  html = ''; let abierto = false;
  for (let i = 0; i < texto.length; i++) {
    if (marcas[i] && !abierto) { html += '<mark>'; abierto = true; }
    if (!marcas[i] && abierto) { html += '</mark>'; abierto = false; }
    html += escapar(texto[i]);
  }
  return html + (abierto ? '</mark>' : '');
}
function pintarLista() {
  const res = filtrar();
  const vis = res.slice(0, estado.mostrados);
  const filtrosActivos = [estado.seccion, estado.prefijo && `carpeta “${estado.prefijo.replace(/\/$/, '').split('/').pop()}”`, estado.tipo && TIPOS[estado.tipo]?.nombre, estado.texto && `“${estado.texto}”`].filter(Boolean);
  $('#resumenResultados').innerHTML = `${res.length} archivo${res.length === 1 ? '' : 's'}${filtrosActivos.length ? ' · ' + escapar(filtrosActivos.join(' · ')) : ''}
    ${estado.prefijo ? ' <button class="chip" id="quitarPrefijo">Quitar filtro de carpeta ✕</button>' : ''}`;
  $('#listaArchivos').innerHTML = vis.map(a => {
    const t = TIPOS[a.tipo] || { color: '#7a8599' };
    return `<li class="archivo">
      <span class="archivo__ico" style="background:${t.color}" aria-hidden="true">${escapar(a.ext.slice(0, 4).toUpperCase() || '—')}</span>
      <div><div class="archivo__nombre">${resaltar(a.nombre)}</div>
        <div class="archivo__ruta">${resaltar(a.seccion + (a.subcarpeta ? ' / ' + a.subcarpeta.replace(/\//g, ' / ') : ''))} · ${tamano(a.bytes)}</div></div>
      <div class="archivo__acc">
        <a class="boton boton--borde boton--chico" href="${urlVer(a.ruta)}" target="_blank" rel="noopener" aria-label="Ver ${escapar(a.nombre)} en GitHub">Ver</a>
        <a class="boton boton--borde boton--chico" href="${urlDescargar(a.ruta)}" aria-label="Descargar ${escapar(a.nombre)}">⬇</a>
      </div></li>`;
  }).join('') || '<li class="vacio">No hay archivos con esos filtros. Prueba con otra palabra o activa “Mostrar archivos de compilación”.</li>';
  $('#btnMas').hidden = res.length <= estado.mostrados;
  $('#btnMas').textContent = `Ver más (${res.length - estado.mostrados} restantes)`;
  const q = $('#quitarPrefijo'); if (q) q.onclick = () => { estado.prefijo = ''; reiniciar(); };
}
function pintarChips() {
  const conteo = {};
  TODOS.filter(a => estado.compilacion || !a.compilacion).forEach(a => conteo[a.seccion] = (conteo[a.seccion] || 0) + 1);
  const secciones = Object.keys(conteo).sort((x, y) => (x === 'DOCUMENTACION ANTERIOR') - (y === 'DOCUMENTACION ANTERIOR') || x.localeCompare(y));
  $('#chipsSecciones').innerHTML = [`<button class="chip" data-sec="" aria-pressed="${!estado.seccion}">Todo</button>`]
    .concat(secciones.map(s => `<button class="chip" data-sec="${escapar(s)}" aria-pressed="${estado.seccion === s}">${infoSeccion(s).ico} ${escapar(s)}<span class="n">${conteo[s]}</span></button>`)).join('');
}
function reiniciar() { estado.mostrados = POR_PAGINA; pintarChips(); pintarLista(); }
function irAlExplorador(seccion, prefijo = '') {
  estado.seccion = seccion; estado.prefijo = prefijo; estado.texto = ''; $('#busqueda').value = '';
  reiniciar(); $('#archivos').scrollIntoView();
}

function pintarTarjetas() {
  const conteo = {};
  TODOS.filter(a => !a.compilacion).forEach(a => conteo[a.seccion] = (conteo[a.seccion] || 0) + 1);
  const orden = Object.keys(SECCIONES).filter(s => conteo[s]).concat(Object.keys(conteo).filter(s => !SECCIONES[s] && s !== '(raíz)'));
  $('#tarjetasSecciones').innerHTML = orden.map(s => `
    <button class="tarjeta" data-sec="${escapar(s)}">
      <span class="tarjeta__ico">${infoSeccion(s).ico}</span><b>${escapar(s)}</b><p>${escapar(infoSeccion(s).desc)}</p>
      <span class="cuenta">${conteo[s]} archivo${conteo[s] === 1 ? '' : 's'} →</span>
    </button>`).join('');
  $('#tarjetasSecciones').onclick = ev => { const b = ev.target.closest('.tarjeta'); if (b) irAlExplorador(b.dataset.sec); };

  // Semestres anteriores
  const base = 'DOCUMENTACION ANTERIOR/';
  const sem = {};
  TODOS.filter(a => a.ruta.startsWith(base)).forEach(a => {
    const s = a.ruta.slice(base.length).split('/')[0];
    sem[s] ??= { total: 0, docs: 0, codigo: 0, planos: 0 };
    sem[s].total++;
    if (a.tipo === 'doc') sem[s].docs++;
    if (a.tipo === 'codigo') sem[s].codigo++;
    if (a.tipo === 'cad') sem[s].planos++;
  });
  const clave = s => { const m = s.match(/^(I{1,2})\s*(\d{4})/); return m ? +m[2] * 10 + m[1].length : 0; };
  const sems = Object.keys(sem).sort((a, b) => clave(b) - clave(a));
  $('#cifraSemestres').textContent = sems.length;
  $('#tarjetasHistorico').innerHTML = sems.map(s => `
    <button class="tarjeta" data-pref="${escapar(base + s + '/')}">
      <span class="tarjeta__ico">📦</span><b>Semestre ${escapar(s)}</b>
      <p>${sem[s].docs} documentos · ${sem[s].codigo} archivos de código · ${sem[s].planos} planos</p>
      <span class="cuenta">${sem[s].total} archivos en total →</span>
    </button>`).join('');
  $('#tarjetasHistorico').onclick = ev => { const b = ev.target.closest('.tarjeta'); if (b) { estado.compilacion = true; $('#verCompilacion').checked = true; irAlExplorador('DOCUMENTACION ANTERIOR', b.dataset.pref); } };
}

/* ---------- Carga del índice ---------- */
async function cargar() {
  try {
    const r = await fetch('archivos.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error(r.status);
    const datos = await r.json();
    TODOS = datos.archivos.map(a => ({ ...a, tipo: tipoDe(a), compilacion: esCompilacion(a), clave: normalizar(a.ruta) }));
    // Primero la documentación vigente; el material de semestres anteriores al final
    TODOS.sort((x, y) => (x.seccion === 'DOCUMENTACION ANTERIOR') - (y.seccion === 'DOCUMENTACION ANTERIOR'));
    $('#cifraArchivos').textContent = TODOS.filter(a => !a.compilacion).length;
    const f = new Date(datos.generado);
    $('#fechaIndice').textContent = `Índice de archivos actualizado el ${f.toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' })}.`;
    pintarTarjetas(); pintarDestacados(TODOS); pintarLinea(TODOS); reiniciar();
  } catch (e) {
    const msg = `<p class="vacio">No se pudo cargar el índice de archivos. Si estás abriendo el archivo directamente desde la computadora,
      usa un servidor local (por ejemplo <code>python3 -m http.server</code>) o visita la página publicada.<br>
      Mientras tanto, puedes <a href="https://github.com/${REPO}" target="_blank" rel="noopener">ver el repositorio en GitHub</a>.</p>`;
    $('#listaArchivos').innerHTML = `<li>${msg}</li>`;
    $('#destacados').innerHTML = msg; $('#tarjetasSecciones').innerHTML = msg;
    pintarLinea([]);
  }
}

/* ---------- Eventos generales ---------- */
let temporizador;
$('#busqueda').addEventListener('input', ev => { clearTimeout(temporizador); temporizador = setTimeout(() => { estado.texto = ev.target.value.trim(); reiniciar(); }, 150); });
$('#filtroTipo').addEventListener('change', ev => { estado.tipo = ev.target.value; reiniciar(); });
$('#verCompilacion').addEventListener('change', ev => { estado.compilacion = ev.target.checked; reiniciar(); });
$('#chipsSecciones').addEventListener('click', ev => { const c = ev.target.closest('.chip'); if (!c) return; estado.seccion = c.dataset.sec; estado.prefijo = ''; reiniciar(); });
$('#btnMas').addEventListener('click', () => { estado.mostrados += POR_PAGINA; pintarLista(); });

$('#btnTema').addEventListener('click', () => {
  const raiz = document.documentElement;
  const oscuroAhora = raiz.dataset.tema ? raiz.dataset.tema === 'oscuro' : matchMedia('(prefers-color-scheme: dark)').matches;
  raiz.dataset.tema = oscuroAhora ? 'claro' : 'oscuro';
  try { localStorage.setItem('tema', raiz.dataset.tema); } catch (e) {}
});
$('#btnMenu').addEventListener('click', () => $('#menu').classList.toggle('abierto'));
$('#menu').addEventListener('click', ev => { if (ev.target.tagName === 'A') $('#menu').classList.remove('abierto'); });

const btnArriba = $('#btnArriba');
addEventListener('scroll', () => { btnArriba.hidden = scrollY < 600; }, { passive: true });
btnArriba.addEventListener('click', () => scrollTo({ top: 0 }));

// Resalta en el menú la sección visible
const enlaces = [...document.querySelectorAll('.nav__enlaces a')];
const observador = new IntersectionObserver(entradas => {
  entradas.forEach(e => {
    if (e.isIntersecting) enlaces.forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => observador.observe(s));

pintarEjes();
cargar();
