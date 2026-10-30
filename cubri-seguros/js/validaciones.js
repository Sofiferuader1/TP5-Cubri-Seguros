// Funciones puras: reciben un valor y devuelven un mensaje de error o null.
import { getPath } from './estado.js';

const txt = (v) => String(v ?? '').trim();
const soloDig = (v) => String(v ?? '').replace(/[\s-]/g, '');
// Exige al menos dos letras; admite espacios, tildes, apóstrofes y guiones en nombres reales.
const nombreValido = (v) => /^[\p{L}\s'’-]+$/u.test(txt(v)) && (txt(v).match(/\p{L}/gu) || []).length >= 2;
const esMayor = (v) => {
  const n = new Date(v), lim = new Date();
  lim.setFullYear(lim.getFullYear() - 18);
  return !!v && !isNaN(n) && n <= lim;
};
const vencimientoOk = (v) => {
  const m = /^(\d{2})\/(\d{2})$/.exec(txt(v));
  if (!m || +m[1] < 1 || +m[1] > 12) return false;
  return new Date(2000 + +m[2], +m[1], 1) > new Date(); // vence a fin de mes
};

export const reglas = {
  'equipo.marca': (v) => (v ? null : 'Elegí una marca'),
  'equipo.modelo': (v) => (txt(v).length >= 2 && txt(v).length <= 40 ? null : 'Ingresá el modelo del equipo'),
  'equipo.valor': (v) => (v >= 100000 && v <= 2500000 ? null : 'El valor debe estar entre $100.000 y $2.500.000'),
  'equipo.antiguedad': (v) => (v ? null : 'Indicá la antigüedad'),
  'titular.nombre': (v) => (nombreValido(v) ? null : 'Ingresá tu nombre'),
  'titular.apellido': (v) => (nombreValido(v) ? null : 'Ingresá tu apellido'),
  'titular.dni': (v) => (/^\d{7,8}$/.test(txt(v)) ? null : 'El DNI debe tener 7 u 8 números'),
  'titular.nacimiento': (v) => (esMayor(v) ? null : 'Tenés que ser mayor de edad'),
  'titular.email': (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(txt(v)) ? null : 'Ingresá un email válido'),
  'titular.celular': (v) => (/^\d{10}$/.test(soloDig(v)) && !/^(0|15)/.test(soloDig(v)) ? null : 'Ej.: 11 5555-1234'),
  'titular.terminos': (v) => (v ? null : 'Tenés que aceptar los términos'),
  'pago.tarjeta': (v) => (/^\d{16}$/.test(String(v).replace(/\s/g, '')) ? null : 'Número de tarjeta inválido'),
  'pago.vencimiento': (v) => (vencimientoOk(v) ? null : 'Vencimiento inválido'),
  'pago.cvv': (v) => (/^\d{3}$/.test(txt(v)) ? null : 'CVV inválido'),
  'pago.titular': (v) => (txt(v) ? null : 'Ingresá el nombre del titular'),
};

const PASOS = {
  1: ['equipo.marca', 'equipo.modelo', 'equipo.valor', 'equipo.antiguedad'],
  3: ['titular.nombre', 'titular.apellido', 'titular.dni', 'titular.nacimiento', 'titular.email', 'titular.celular', 'titular.terminos'],
  4: ['pago.tarjeta', 'pago.vencimiento', 'pago.cvv', 'pago.titular'],
};
export const ETIQ = {
  'equipo.marca': 'marca', 'equipo.modelo': 'modelo', 'equipo.valor': 'valor del equipo', 'equipo.antiguedad': 'antigüedad',
  'titular.nombre': 'nombre', 'titular.apellido': 'apellido', 'titular.dni': 'DNI', 'titular.nacimiento': 'fecha de nacimiento',
  'titular.email': 'email', 'titular.celular': 'celular', 'titular.terminos': 'términos',
};

/** Devuelve [[campo, mensaje], ...] con los errores del paso (vacío = válido). */
export const validarPaso = (s, n) =>
  (PASOS[n] || []).map((p) => [p, reglas[p](getPath(s, p))]).filter(([, m]) => m);
