import { solicitud as s, irAPaso, reiniciar, setPath } from './estado.js';
import { validarPaso } from './validaciones.js';
import { cargarPlanes } from './cotizador.js';
import { simularPago, generarPoliza } from './pago.js';
import { render, crearPlanes } from './render.js';

// Cada evento modifica el estado y después llama a render().
document.addEventListener('input', (e) => {
  const el = e.target.closest('[data-f]');
  if (!el) return;
  const p = el.dataset.f;
  let v = el.type === 'checkbox' ? el.checked : el.value;
  if (p === 'equipo.valor') v = Number(v.replace(/\D/g, '')); // "600.000" -> 600000
  if (p === 'pago.tarjeta') v = el.value = v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  if (p === 'pago.vencimiento') { const d = v.replace(/\D/g, '').slice(0, 4); v = el.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; }
  if (p === 'pago.cvv') v = el.value = v.replace(/\D/g, '').slice(0, 3);
  setPath(s, p, v);
  if (el.type === 'radio' || el.type === 'checkbox' || el.tagName === 'SELECT') s.tocados[p] = true;
  render();
});

// Error en línea al salir del campo (blur).
document.addEventListener('focusout', (e) => {
  const el = e.target.closest?.('[data-f]');
  if (el) { s.tocados[el.dataset.f] = true; setTimeout(render); }
});

document.addEventListener('submit', (e) => e.preventDefault());

// Revalida todo el paso; si hay errores los muestra y lleva el foco al primero.
function intentar(n) {
  const f = validarPaso(s, n);
  if (!f.length) return true;
  f.forEach(([p]) => { s.tocados[p] = true; });
  render();
  document.querySelector(`[data-f="${f[0][0]}"]`)?.focus();
  return false;
}

async function pagar(b) {
  if (!intentar(4)) return;
  b.disabled = true; b.textContent = 'Procesando…'; // evita el doble click
  const r = await simularPago(s.pago.tarjeta);
  b.disabled = false; b.textContent = 'Pagar y contratar';
  if (r.ok) { s.poliza = generarPoliza(); irAPaso(5); }
  else { s.errorPago = r.motivo; irAPaso(6); }
}

document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-accion],[data-ir]');
  if (!b) return;
  if (b.dataset.ir) return irAPaso(Number(b.dataset.ir));
  switch (b.dataset.accion) {
    case 'ver-planes':
      if (!intentar(1)) return;
      try { await cargarPlanes(); document.getElementById('falla').hidden = true; }
      catch { document.getElementById('falla').hidden = false; return; }
      crearPlanes(); irAPaso(2); break;
    case 'a-datos': irAPaso(3); break;
    case 'a-pago': if (intentar(3)) irAPaso(4); break;
    case 'pagar': await pagar(b); break;
    case 'cambiar-medio': s.pago.metodo = s.pago.metodo === 'credito' ? 'debito' : 'credito'; irAPaso(4); break;
    case 'imprimir': window.print(); break;
    case 'inicio': reiniciar(); break;
  }
});

render();
