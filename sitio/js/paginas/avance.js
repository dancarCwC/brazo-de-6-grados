/* Avance del semestre */
indiceListo.then(() => {
  const hechos = LABS.filter(l => estadoLab(l.n) === 'hecho').length;
  const pct = Math.round(hechos / LABS.length * 100);
  $('#resumen').innerHTML = `
    <div class="anillo" style="--p:${pct}"><span>${pct}%</span></div>
    <div><h2>${hechos} de ${LABS.length} laboratorios entregados</h2>
      <p>Un laboratorio cuenta como entregado cuando su informe en PDF está en la carpeta <code>INFORMES/INFORME_N</code> del repositorio.</p>
      <div class="leyenda"><span><span class="etiqueta etiqueta--ok">Entregado</span></span><span><span class="etiqueta etiqueta--curso">En curso</span></span><span><span class="etiqueta">Pendiente</span></span></div>
    </div>`;
  $('#fases').innerHTML = Object.entries(FASES).map(([f, nombre]) => `
    <section class="fase" data-grupo>
      <h3><span>FASE ${f}</span>${nombre}</h3>
      ${LABS.filter(l => l.fase === +f).map(l => {
        const est = estadoLab(l.n), g = guiaDe(l.n), inf = informeDe(l.n);
        const etq = { hecho: '<span class="etiqueta etiqueta--ok">Entregado</span>', curso: '<span class="etiqueta etiqueta--curso">En curso</span>', pendiente: '<span class="etiqueta">Pendiente</span>' }[est];
        return `<article class="tarjeta lab ${est}">
          <div class="lab__cab"><b>LAB ${l.n}</b>${etq}</div>
          <h4>${l.tema}</h4><p>${l.det}</p>
          <div class="lab__pie"><small>${l.fechas}</small>
            ${g ? `<a class="boton boton--borde boton--chico" href="${urlVer(g.ruta)}" data-ver="${escapar(g.ruta)}">Guía</a>` : ''}
            ${inf ? `<a class="boton boton--primario boton--chico" href="${urlVer(inf.ruta)}" data-ver="${escapar(inf.ruta)}">Informe</a>` : ''}
          </div></article>`;
      }).join('')}
    </section>`).join('');
}).catch(() => { $('#fases').innerHTML = '<p class="vacio">No se pudo cargar el índice de archivos.</p>'; });
