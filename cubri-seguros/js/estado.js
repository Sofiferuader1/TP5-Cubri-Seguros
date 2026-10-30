import { render } from './render.js';

const inicial = () => ({
  paso: 0, // 0 = inicio, 1..4 = checkout, 5 = éxito, 6 = error
  equipo: { marca: '', modelo: '', valor: 0, antiguedad: '' },
  plan: 'plus',
  titular: { nombre: '', apellido: '', dni: '', nacimiento: '', email: '', celular: '', terminos: false },
  pago: { metodo: 'credito', tarjeta: '', vencimiento: '', cvv: '', titular: '' },
  poliza: null,
  errorPago: '',
  tocados: {}, // campos que ya se tocaron (muestran su error)
});

export const solicitud = inicial();

export function irAPaso(n) {
  solicitud.paso = n;
  render(); // siempre después de cambiar el estado
  window.scrollTo(0, 0);
}
export function reiniciar() { Object.assign(solicitud, inicial()); irAPaso(0); }
export function getPath(o, p) { return p.split('.').reduce((a, k) => a[k], o); }
export function setPath(o, p, v) { const k = p.split('.'), u = k.pop(); k.reduce((a, x) => a[x], o)[u] = v; }
