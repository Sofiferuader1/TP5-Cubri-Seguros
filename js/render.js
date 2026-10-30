import { solicitud as s, getPath } from './estado.js';
import { reglas, validarPaso, ETIQ } from './validaciones.js';
import { planes, calcularCuota } from './cotizador.js';

const $$ = (q) => document.querySelectorAll(q);
const $ = (id) => document.getElementById(id);
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
export const moneda = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
const cuota = (p) => calcularCuota(s.equipo.valor, p.tasaAnual, s.equipo.antiguedad);
const planActual = () => planes.find((p) => p.id === s.plan);

export function render() {
  $$('[data-paso]').forEach((el) => { el.hidden = Number(el.dataset.paso) !== s.paso; });
  $('checkout').hidden = s.paso < 1 || s.paso > 4;
  rellenar(); renderErrores(); renderStepper(); renderResumen(); renderBinds(); renderBotones();
}

// Los inputs siempre se rellenan desde el estado (así "Volver" no pierde datos).
function rellenar() {
  $$('[data-f]').forEach((el) => {
    const p = el.dataset.f, v = getPath(s, p);
    if (el.type === 'radio') el.checked = el.value === String(v);
    else if (el.type === 'checkbox') el.checked = !!v;
    else if (el !== document.activeElement) el.value = p === 'equipo.valor' ? (v ? v.toLocaleString('es-AR') : '') : v;
  });
}

function renderErrores() {
  $$('[data-f]').forEach((el) => {
    const p = el.dataset.f;
    if (!reglas[p]) return;
    const msg = s.tocados[p] ? reglas[p](getPath(s, p)) : null;
    const f = el.closest('.field'), e = f.querySelector('[data-err]');
    e.id = 'err-' + p;
    e.textContent = msg || ''; e.hidden = !msg;
    f.toggleAttribute('data-invalid', !!msg);
    el.setAttribute('aria-invalid', !!msg);
    el.setAttribute('aria-describedby', e.id);
  });
}

function renderStepper() {
  $('stepper').innerHTML = ['Cotizar', 'Plan', 'Datos', 'Pago'].map((n, i) => {
    const k = i + 1, est = k < s.paso ? 'ok' : k === s.paso ? 'on' : 'off';
    const c = { ok: 'bg-emerald-600 text-white', on: 'bg-indigo-600 text-white', off: 'bg-slate-200 text-slate-500' }[est];
    return `<li class="flex items-center gap-2 ${i ? 'flex-1' : ''}" ${est === 'on' ? 'aria-current="step"' : ''}>
      ${i ? `<span class="h-px flex-1 ${k <= s.paso ? 'bg-emerald-600' : 'bg-slate-200'}"></span>` : ''}
      <span class="grid size-6 place-items-center rounded-full text-xs font-semibold ${c}">${est === 'ok' ? '✓' : k}</span>
      <span class="text-xs font-semibold ${est === 'off' ? 'text-slate-500' : 'text-slate-900'} ${est === 'on' ? '' : 'hidden sm:inline'}">${n}</span></li>`;
  }).join('');
}

// El resumen se genera UNA sola vez: barra fija en mobile, card lateral en desktop.
function renderResumen() {
  const r = $('resumen'), p = planActual();
  r.hidden = s.paso < 2 || s.paso > 4 || !p;
  if (r.hidden) return;
  const det = s.paso === 4 ? 'flex' : 'hidden lg:flex';
  const fila = (a, b) => `<div class="${det} justify-between gap-3 text-sm"><dt class="text-slate-500">${a}</dt><dd class="text-right font-semibold">${esc(b)}</dd></div>`;
  r.innerHTML = `<h3 class="${det} mb-2 font-bold">Resumen</h3><dl class="grid gap-2">
    ${fila('Seguro', 'Celular')}${fila('Equipo', `${s.equipo.marca} ${s.equipo.modelo}`)}${fila('Plan', p.nombre)}
    ${s.titular.nombre ? fila('Titular', `${s.titular.nombre} ${s.titular.apellido}`) : ''}
    <div class="flex items-baseline justify-between"><dt class="text-sm text-slate-500"><span class="lg:hidden">Plan ${p.nombre} · </span>Total mensual</dt>
    <dd class="text-lg font-extrabold text-indigo-800">${moneda(cuota(p))}</dd></div></dl>`;
}

function renderBinds() {
  const p = planActual() || {};
  const m = { 'plan.nombre': p.nombre, total: p.id ? moneda(cuota(p)) : '', 'equipo.desc': `${s.equipo.marca} ${s.equipo.modelo}` };
  $$('[data-bind]').forEach((el) => { const k = el.dataset.bind; el.textContent = m[k] ?? getPath(s, k) ?? ''; });
  $$('[data-cuota]').forEach((el) => { el.textContent = moneda(cuota(planes.find((x) => x.id === el.dataset.cuota))); });
}

// Botón deshabilitado + explicación de qué falta.
function renderBotones() {
  $$('[data-requiere]').forEach((b) => {
    const n = b.dataset.requiere, falta = validarPaso(s, Number(n)), a = document.querySelector(`[data-ayuda="${n}"]`);
    b.disabled = falta.length > 0;
    if (a) { a.hidden = !falta.length; a.textContent = falta.length ? 'Falta completar: ' + falta.map(([p]) => ETIQ[p]).join(', ') : ''; }
  });
}

export function crearPlanes() {
  $('planes').innerHTML = planes.map((p) => `
    <label class="block cursor-pointer"><input type="radio" name="plan" value="${p.id}" data-f="plan" class="peer sr-only">
      <div class="card gap-3 py-4 transition peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:ring-2 peer-checked:ring-indigo-600/30 peer-focus-visible:ring-2">
        <section class="grid gap-2">
          <div class="flex items-center justify-between"><h3 class="font-bold">${p.nombre}</h3>${p.recomendado ? '<span class="badge">Recomendado</span>' : ''}</div>
          <p><span class="text-2xl font-extrabold" data-cuota="${p.id}"></span> <span class="text-sm text-slate-500">/mes</span></p>
          <ul class="grid gap-1 text-sm">${p.coberturas.map((c) => `<li class="text-emerald-600">✓ <span class="text-slate-900">${c}</span></li>`).join('')}</ul>
        </section></div></label>`).join('');
}
