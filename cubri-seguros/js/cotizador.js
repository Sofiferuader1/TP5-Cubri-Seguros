const FACTOR = { 'menos-1': 1, '1-2': 1.1, 'mas-2': 1.25 };
export let planes = [];

export async function cargarPlanes() {
  if (!planes.length) {
    const r = await fetch('data/planes.json');
    if (!r.ok) throw new Error('No se pudo cargar planes.json');
    planes = await r.json();
  }
  return planes;
}

// Única función de cálculo: la usan la pantalla de planes y el resumen.
export const calcularCuota = (valor, tasaAnual, antiguedad) =>
  Math.round(valor * tasaAnual / 12 * (FACTOR[antiguedad] ?? 1));
