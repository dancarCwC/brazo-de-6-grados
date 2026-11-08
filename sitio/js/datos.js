/* =========================================================
   datos.js — datos compartidos y utilidades de todas las páginas
   ========================================================= */
const REPO = 'dancarCwC/brazo-de-6-grados';
const RAMA = 'main';

const codificar = ruta => ruta.split('/').map(encodeURIComponent).join('/');
const urlVer = ruta => `https://github.com/${REPO}/blob/${RAMA}/${codificar(ruta)}`;
const urlDescargar = ruta => `https://github.com/${REPO}/raw/${RAMA}/${codificar(ruta)}`;
const urlRaw = ruta => `https://raw.githubusercontent.com/${REPO}/${RAMA}/${codificar(ruta)}`;
const urlCarpeta = ruta => `archivos.html?carpeta=${encodeURIComponent(ruta)}`;

const $ = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
const normalizar = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const escapar = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function tamano(b) {
  if (!b && b !== 0) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

/* ---------- Carpetas del repositorio ---------- */
const SECCIONES = {
  'INFORMES':               { ico: 'informe', nombre: 'Informes',            desc: 'Informes de laboratorio de la gestión II/2026.' },
  'DIAGRAMAS P&ID':         { ico: 'plano',   nombre: 'Diagramas P&ID',      desc: 'P&ID de la planta bajo ANSI/ISA-5.1-2009.' },
  'DIAGRAMAS ELECTRICOS':   { ico: 'rayo',    nombre: 'Diagramas eléctricos', desc: 'Planos IEC 60617: placa, motores y pulsadores.' },
  'PINAJE PIC16F1946':      { ico: 'chip',    nombre: 'Pinaje PIC16F1946',   desc: 'Qué llega a cada uno de los 64 pines del PIC.' },
  'GUIAS DE LABORATORIO':   { ico: 'guia',    nombre: 'Guías de laboratorio', desc: 'Las ocho guías del laboratorio integrado.' },
  'MANUALES':               { ico: 'libro',   nombre: 'Manuales',            desc: 'XK-JS5B, MPLAB X, PICkit 3 e interfaz USB.' },
  'DATASHEET':              { ico: 'hoja',    nombre: 'Hojas de datos',      desc: 'Drivers y componentes de la planta.' },
  'FOTOS':                  { ico: 'foto',    nombre: 'Fotos',               desc: 'Imágenes de la planta y de la tarjeta.' },
  'DOCUMENTACION ANTERIOR': { ico: 'archivo', nombre: 'Semestres anteriores', desc: 'Lo que dejaron las escuadras anteriores.' },
};
const infoSeccion = s => SECCIONES[s] || { ico: 'carpeta', nombre: s, desc: '' };

/* ---------- Tipos de archivo ---------- */
const TIPOS = {
  doc:    { nombre: 'Documentos', color: '#2563eb', ext: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'md', 'rtf', 'odt'] },
  cad:    { nombre: 'Planos',     color: '#7c3aed', ext: ['dwg', 'dxf', 'eddx', 'kicad_sch', 'kicad_pcb', 'kicad_pro', 'kicad_sym', 'pdsprj', 'dsn', 'sch', 'brd'] },
  img:    { nombre: 'Imágenes',   color: '#059669', ext: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'svg', 'webp'] },
  codigo: { nombre: 'Código',     color: '#d97706', ext: ['c', 'h', 'asm', 's', 'inc', 'py', 'm', 'slx', 'mdl', 'ino', 'cpp', 'js', 'sql'] },
  video:  { nombre: 'Videos',     color: '#dc2626', ext: ['mp4', 'avi', 'mov', 'mkv', 'wmv', '3gp', 'webm'] },
  otro:   { nombre: 'Otros',      color: '#64748b', ext: [] },
};
const EXT_COMPILACION = new Set(['set', 'p1', 'd', 'pre', 'dep', 'lst', 'sdb', 'cof', 'obj', 'o', 'cmf', 'hxl', 'sym',
  'mcs', 'map', 'elf', 'hex', 'mk', 'i', 'r', 'rlf', 'as', 'cmd', 'lnk', 'sdl', 'mcw', 'mcp', 'bkx']);
const tipoDe = a => Object.keys(TIPOS).find(k => TIPOS[k].ext.includes(a.ext)) || 'otro';
const esCompilacion = a => EXT_COMPILACION.has(a.ext) || /\/(nbproject|build|dist|debug)\//i.test('/' + a.ruta);

/* ---------- Índice de archivos ---------- */
let TODOS = [];
let INDICE_FECHA = null;
const indiceListo = fetch('archivos.json', { cache: 'no-cache' })
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(d => {
    TODOS = d.archivos.map(a => ({ ...a, tipo: tipoDe(a), compilacion: esCompilacion(a), clave: normalizar(a.ruta) }))
      .sort((x, y) => (x.seccion === 'DOCUMENTACION ANTERIOR') - (y.seccion === 'DOCUMENTACION ANTERIOR'));
    INDICE_FECHA = new Date(d.generado);
    document.dispatchEvent(new CustomEvent('indice-listo'));
    return TODOS;
  });
const buscarArchivo = ruta => TODOS.find(a => a.ruta === ruta);

/* ---------- Articulaciones ---------- */
const EJES = [
  { n: 1, nombre: 'Base', mov: 'Gira toda la torre en el plano horizontal.', lazo: 101, driver: 'DM542', tagDriver: 'ZY-101',
    motor: 'NEMA 23 · 57J1854-828', trans: 'Poleas', sensor: 'ZSH-101 · Hall NJK-5002C', pin: '58 · RD0 · SENSOR1',
    mando: 'M01 / M02 · pines 24 y 23', rango: '±180°',
    nota: 'Tiene el encoder ZT-101 (600 PPR). Su fase A llega al pin 48 (RB0/INT), pero no está cableado: por eso la planta trabaja en lazo abierto.' },
  { n: 2, nombre: 'Hombro', mov: 'Sube y baja el brazo grande.', lazo: 102, driver: 'DM542', tagDriver: 'ZY-102',
    motor: 'NEMA 23 · 57J1854-828', trans: 'Acople directo', sensor: 'ZSH-102 · Hall NJK-5002C', pin: '55 · RD1 · SENSOR2',
    mando: 'M03 / M04 · pines 22 y 21', rango: '±90°',
    nota: 'Carga con el peso de todo el brazo: es el eje más propenso a perder pasos.' },
  { n: 3, nombre: 'Codo', mov: 'Sube y baja el brazo pequeño.', lazo: 103, driver: 'DM542', tagDriver: 'ZY-103',
    motor: 'NEMA 23 · 57J1854-828', trans: 'Correa síncrona', sensor: 'ZSH-103 · Hall NJK-5002C', pin: '54 · RD2 · SENSOR3',
    mando: 'M05 / M06 · pines 28 y 27', rango: '±90°',
    nota: 'Su motor está en el eje del hombro; la correa introduce holgura.' },
  { n: 4, nombre: 'Muñeca', mov: 'Hace rotar la pata (antebrazo y muñeca).', lazo: 104, driver: 'DM542 (por confirmar)', tagDriver: 'ZY-104',
    motor: 'NEMA 17 o 23 (por confirmar)', trans: 'Transmisión síncrona', sensor: 'ZSH-104 · Hall NJK-5002C', pin: '53 · RD3 · SENSOR4',
    mando: 'M07 / M08 · pines 47 y 46', rango: '±150°',
    nota: 'La documentación heredada le asigna dos motores distintos: hay que leer la placa antes de energizar.' },
  { n: 5, nombre: 'Giro de muñeca', mov: 'Orienta el efector final.', lazo: 105, driver: '2MA320', tagDriver: 'ZY-105',
    motor: 'NEMA 17 · 42J1848-604', trans: 'Reductor', sensor: 'ZSH-105 · Hall NJK-5002C', pin: '52 · RD4 · SENSOR5',
    mando: 'M09 / M010 · pines 45 y 44', rango: 'Por medir',
    nota: 'El reductor multiplica el par, pero agrega una zona muerta (backlash).' },
  { n: 6, nombre: 'Pinza', mov: 'Abre y cierra los dedos.', lazo: 106, driver: '2MA320', tagDriver: 'ZY-106',
    motor: 'NEMA 17 / 16', trans: 'Mecanismo de dedos', sensor: 'ZSH-106 / ZSL-106 · M102-011', pin: '51 y 50 · RD5, RD6',
    mando: 'M011 / M012 · pines 43 y 30', rango: 'Abierta / cerrada',
    nota: 'Su potenciómetro lineal mediría aperturas intermedias, pero tiene un cable roto.' },
];

/* ---------- Laboratorios ---------- */
const LABS = [
  { n: 1, fase: 1, tema: 'Ingeniería inversa y auditoría Kaizen', det: 'Ficha técnica, variables MV/PV/DV, diagrama de bloques y discrepancias.', fechas: '4 – 18 ago' },
  { n: 2, fase: 1, tema: 'Planos ISA/IEC y mockups', det: 'P&ID V2.0, planos eléctricos, pinaje del PIC y pantallas HMI/ERP.', fechas: '18 ago – 1 sep' },
  { n: 3, fase: 1, tema: 'Git/GitHub y modelo de datos', det: 'Repositorio colaborativo, Pull Requests y base de datos en 3FN.', fechas: '1 – 15 sep' },
  { n: 4, fase: 2, tema: 'Identificación y espacio de estados', det: 'Pruebas en escalón y modelado analítico multivariable.', fechas: '15 – 29 sep' },
  { n: 5, fase: 2, tema: 'Gemelo digital y discretización', det: 'Simulación en MATLAB/Simulink y paso al plano Z.', fechas: '29 sep – 27 oct' },
  { n: 6, fase: 3, tema: 'Control discreto en hardware', det: 'Ecuaciones de diferencias con interrupciones de temporizador.', fechas: '10 – 24 nov' },
  { n: 7, fase: 3, tema: 'Control avanzado LQR', det: 'Realimentación de estados para procesos no lineales.', fechas: '24 nov – 8 dic' },
  { n: 8, fase: 3, tema: 'Redes industriales y cierre', det: 'Modbus TCP/RTU entre las cuatro plantas y API del ERP.', fechas: '8 – 22 dic' },
];
const FASES = { 1: 'Ingeniería inversa y documentación', 2: 'Modelado y simulación', 3: 'Implementación y redes' };
const guiaDe = n => TODOS.find(a => a.seccion === 'GUIAS DE LABORATORIO' && new RegExp(`Laboratorio[ _]?${n}\\.pdf$`, 'i').test(a.nombre));
const informeDe = n => TODOS.find(a => a.ruta.startsWith(`INFORMES/INFORME_${n}/`) && a.ext === 'pdf');

/* ---------- Documentos clave ---------- */
const DESTACADOS = [
  { cat: 'Informes', re: /^INFORMES\/INFORME_(\d+)\/.*\.pdf$/i, titulo: m => `Informe del laboratorio ${m[1]}` },
  { cat: 'Planos',   re: /^DIAGRAMAS P&ID\/.*\.pdf$/i, titulo: () => 'Diagrama P&ID (ISA-5.1)' },
  { cat: 'Planos',   re: /^DIAGRAMAS ELECTRICOS\/PLACA.*\.pdf$/i, titulo: () => 'Plano eléctrico: placa y drivers' },
  { cat: 'Planos',   re: /^DIAGRAMAS ELECTRICOS\/MOTORES.*\.pdf$/i, titulo: () => 'Plano eléctrico: motores' },
  { cat: 'Planos',   re: /^DIAGRAMAS ELECTRICOS\/PULSADORES.*\.pdf$/i, titulo: () => 'Plano eléctrico: pulsadores' },
  { cat: 'Pinaje',   re: /^PINAJE PIC16F1946\/.*\.pdf$/i, titulo: () => 'Pinaje de la tarjeta respecto al PIC16F1946' },
  { cat: 'Manuales', re: /^MANUALES\/.*\.pdf$/i, titulo: (m, a) => a.nombre.replace(/\.pdf$/i, '') },
  { cat: 'Hojas de datos', re: /^DATASHEET\/.*\.pdf$/i, titulo: (m, a) => a.nombre.replace(/\.pdf$/i, '') },
  { cat: 'Guías',    re: /^GUIAS DE LABORATORIO\/.*?(\d+)\.pdf$/i, titulo: m => `Guía del laboratorio ${m[1]}` },
];
function documentosClave() {
  const lista = [];
  for (const d of DESTACADOS) for (const a of TODOS) {
    const m = a.ruta.match(d.re);
    if (m && !lista.some(x => x.a === a)) lista.push({ a, cat: d.cat, titulo: d.titulo(m, a) });
  }
  return lista;
}

/* ---------- Piezas de interfaz compartidas ---------- */
function filaArchivo(a, { titulo, sub, resaltar } = {}) {
  const t = TIPOS[a.tipo] || TIPOS.otro;
  const carpeta = a.ruta.split('/').slice(0, -1).join('/');
  let nombre = escapar(titulo || a.nombre);
  if (resaltar && resaltar.length) {
    const re = new RegExp(`(${resaltar.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    nombre = nombre.replace(re, '<mark>$1</mark>');
  }
  return `<div class="fila">
    <span class="chip-ext" style="--c:${t.color}">${escapar((a.ext || '—').slice(0, 4).toUpperCase())}</span>
    <a class="fila__txt" href="${urlVer(a.ruta)}" data-ver="${escapar(a.ruta)}" style="text-decoration:none">
      <b>${nombre}</b><small>${[escapar(sub ?? (carpeta.split('/').join(' / ') || 'raíz')), tamano(a.bytes)].filter(Boolean).join(' · ')}</small></a>
    <span class="fila__acc">
      <a class="mini" href="${urlVer(a.ruta)}" data-ver="${escapar(a.ruta)}" title="Vista previa" aria-label="Vista previa">${icono('ojo', 17)}</a>
      <a class="mini" href="${urlDescargar(a.ruta)}" data-descargar="${escapar(a.ruta)}" title="Descargar" aria-label="Descargar">${icono('descargar', 17)}</a>
      <a class="mini opc" href="${urlCarpeta(carpeta)}" title="Ir a su carpeta" aria-label="Ir a su carpeta">${icono('carpeta', 17)}</a>
    </span></div>`;
}
const estadoLab = (() => {
  let enCurso = null;
  return n => {
    if (informeDe(n)) return 'hecho';
    if (enCurso === null) enCurso = (LABS.find(l => !informeDe(l.n)) || {}).n || 0;
    return n === enCurso ? 'curso' : 'pendiente';
  };
})();
