/* La planta: pestañas internas */
function activarPestana(id) {
  $$('.pestana').forEach(b => { const on = b.dataset.p === id; b.classList.toggle('activa', on); b.setAttribute('aria-selected', on); });
  $$('.panel-pest').forEach(p => p.hidden = p.id !== 'p-' + id);
  history.replaceState(null, '', '#' + id);
}
$$('.pestana').forEach(b => b.onclick = () => activarPestana(b.dataset.p));
activarPestana(['ejes', 'arquitectura', 'hardware', 'tarjeta'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'ejes');

/* Esquema del brazo: puntos de cada articulación */
const PUNTOS = [[150, 330], [150, 250], [265, 150], [345, 205], [380, 260], [395, 315]];
$('#esquemaPuntos').innerHTML = PUNTOS.map(([x, y], i) =>
  `<g class="eje-pt" data-eje="${i + 1}" tabindex="0" role="button" aria-label="Eje ${i + 1}: ${EJES[i].nombre}"><circle cx="${x}" cy="${y}" r="17"/><text x="${x}" y="${y}">${i + 1}</text></g>`).join('');
$('#listaEjes').innerHTML = EJES.map(e => `<button data-eje="${e.n}">${e.n}. ${e.nombre}</button>`).join('');

function elegirEje(n) {
  const e = EJES[n - 1];
  $$('[data-eje]').forEach(x => x.classList.toggle('sel', +x.dataset.eje === n));
  const filas = [
    ['Rango de giro', e.rango], ['Lazo ISA', `<code>Lazo ${e.lazo}</code>`],
    ['Driver', `${e.driver} · <code>${e.tagDriver}</code>`], ['Motor', e.motor], ['Transmisión', e.trans],
    ['Sensor de referencia', `<code>${e.sensor}</code>`], ['Pin del PIC', `<code>${e.pin}</code>`],
    ['Pulsadores manuales', e.mando], ['Señal de mando', 'STEP / DIR por el PIC16F1946'],
    ['Estado del lazo', e.n === 1 ? 'Abierto (encoder sin cablear)' : 'Abierto (sin realimentación)'],
  ];
  $('#detalleEje').innerHTML = `
    <header><span class="num-eje">${e.n}</span><div><h2>${e.nombre}</h2><p>${e.mov}</p></div></header>
    <div class="datos">${filas.map(([k, v]) => `<div class="dato"><small>${k}</small><span>${v}</span></div>`).join('')}</div>
    <div class="nota">${icono('rayo', 18)}<div>${e.nota}</div></div>`;
}
$$('[data-eje]').forEach(x => {
  x.addEventListener('click', () => elegirEje(+x.dataset.eje));
  x.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); elegirEje(+x.dataset.eje); } });
});
elegirEje(1);

/* Fotos ampliables con el visor */
$$('.foto-tarjeta img').forEach(img => img.onclick = () => {
  const r = img.dataset.ruta; if (r) abrirVisor(r);
});
indiceListo.then(() => {
  const foto = TODOS.find(a => a.seccion === 'FOTOS' && /tarjeta|pic|placa/i.test(a.nombre));
  if (foto) $('#imgTarjeta').dataset.ruta = foto.ruta;
  const pin = TODOS.find(a => a.seccion === 'PINAJE PIC16F1946' && a.ext === 'pdf');
  if (pin) $('#verPinaje').innerHTML = `<a class="boton boton--primario boton--chico" href="${urlVer(pin.ruta)}" data-ver="${escapar(pin.ruta)}">${icono('ojo', 16)} Ver el pinaje completo (PDF)</a>`;
}).catch(() => {});
