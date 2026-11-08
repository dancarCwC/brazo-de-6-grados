/* Semestres anteriores */
const BASE = 'DOCUMENTACION ANTERIOR';
const ordenSem = s => { const m = s.match(/^(I{1,2})\s+(\d{4})$/); return m ? +m[2] * 10 + m[1].length : 0; };
indiceListo.then(() => {
  const sem = {};
  for (const a of TODOS.filter(a => a.seccion === BASE)) {
    const s = a.ruta.split('/')[1]; if (!s || s === a.nombre) continue;
    (sem[s] ||= { total: 0, tipos: {} }).total++;
    sem[s].tipos[a.tipo] = (sem[s].tipos[a.tipo] || 0) + 1;
  }
  const lista = Object.keys(sem).sort((x, y) => ordenSem(y) - ordenSem(x));
  $('#semestres').innerHTML = lista.map(s => {
    const t = sem[s].tipos;
    const barras = Object.keys(TIPOS).filter(k => t[k]).map(k => `<span style="flex:${t[k]};background:${TIPOS[k].color}" title="${TIPOS[k].nombre}: ${t[k]}"></span>`).join('');
    return `<a class="tarjeta semestre" href="${urlCarpeta(BASE + '/' + s)}">
      <span class="etiqueta">${icono('archivo', 14)} Gestión</span>
      <b>Semestre ${escapar(s)}</b>
      <small>${t.doc || 0} documentos · ${t.codigo || 0} de código · ${t.cad || 0} planos · ${t.img || 0} imágenes</small>
      <div class="mini-barras">${barras}</div>
      <small style="color:var(--acento-txt);font-weight:600;margin-top:6px">${sem[s].total} archivos — abrir carpeta →</small></a>`;
  }).join('') || '<p class="vacio">Todavía no hay material archivado.</p>';
  $('#leyendaTipos').innerHTML = Object.keys(TIPOS).map(k => `<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${TIPOS[k].color};margin-right:6px"></span>${TIPOS[k].nombre}</span>`).join('');
  const docs = TODOS.filter(a => a.seccion === BASE && a.ext === 'pdf' && !a.compilacion).slice(0, 8);
  $('#pdfsAnteriores').innerHTML = docs.map(a => filaArchivo(a)).join('');
}).catch(() => { $('#semestres').innerHTML = '<p class="vacio">No se pudo cargar el índice de archivos.</p>'; });
