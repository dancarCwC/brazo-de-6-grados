/* Inicio: resumen breve y accesos a cada página */
$('#portadaBuscar').onclick = () => abrirBuscador();
$('#atajos').innerHTML = PAGINAS.filter(p => p.id !== 'inicio').map(p => `
  <a class="tarjeta atajo" href="${p.href}"><span class="atajo__ico">${icono(p.ico, 22)}</span>
  <div><h3>${p.nombre}</h3><p>${p.desc}</p></div></a>`).join('');

indiceListo.then(() => {
  const propios = TODOS.filter(a => a.seccion !== 'DOCUMENTACION ANTERIOR');
  const hechos = LABS.filter(l => estadoLab(l.n) === 'hecho').length;
  const cifras = [
    [TODOS.length, 'archivos en el repositorio'],
    [TODOS.filter(a => a.ext === 'pdf').length, 'documentos PDF'],
    [new Set(TODOS.filter(a => a.seccion === 'DOCUMENTACION ANTERIOR').map(a => a.ruta.split('/')[1])).size, 'semestres anteriores archivados'],
    [`${hechos} / ${LABS.length}`, 'laboratorios entregados'],
  ];
  $('#cifras').innerHTML = cifras.map(([n, t]) => `<div class="tarjeta cifra"><b>${n}</b><span>${t}</span></div>`).join('');

  const clave = documentosClave().filter(d => ['Informes', 'Planos', 'Pinaje'].includes(d.cat)).slice(0, 7);
  $('#recientes').innerHTML = clave.map(d => filaArchivo(d.a, { titulo: d.titulo })).join('') ||
    '<p class="vacio">Aún no hay documentos.</p>';

  const lab = LABS.find(l => estadoLab(l.n) === 'curso') || LABS[LABS.length - 1];
  const g = guiaDe(lab.n);
  $('#proximo').innerHTML = `
    <span class="etiqueta etiqueta--curso">En curso · Fase ${lab.fase}</span>
    <h3>Laboratorio ${lab.n}: ${lab.tema}</h3>
    <p>${lab.det}</p>
    <p style="font-size:13px;color:var(--tenue)">${lab.fechas}</p>
    <div class="barra-avance" style="margin:16px 0 6px"><span style="width:${hechos / LABS.length * 100}%"></span></div>
    <small style="color:var(--suave)">${hechos} de ${LABS.length} laboratorios con informe</small>
    <div class="acciones" style="justify-content:flex-start;margin-top:16px">
      ${g ? `<a class="boton boton--primario boton--chico" href="${urlVer(g.ruta)}" data-ver="${escapar(g.ruta)}">${icono('ojo', 16)} Ver la guía</a>` : ''}
      <a class="boton boton--borde boton--chico" href="avance.html">Ver todo el avance ${icono('flecha', 16)}</a>
    </div>`;
  void propios;
}).catch(() => {
  $('#recientes').innerHTML = '<p class="vacio">No se pudo cargar el índice de archivos (archivos.json).</p>';
});
