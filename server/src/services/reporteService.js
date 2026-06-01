import Actividad from "../models/Actividad.js";
import { ESTADOS } from "../patterns/state/estados.js";

// Prioridades ordenadas de mayor a menor importancia.
const PRIORIDADES_ORDEN = ["critica", "alta", "media", "baja"];

/**
 * Generacion de reportes basicos solicitados en el enunciado:
 *  - Actividades pendientes.
 *  - Actividades finalizadas.
 *  - Actividades organizadas por prioridad.
 */

export async function actividadesPendientes() {
  return Actividad.find({ estado: ESTADOS.PENDIENTE }).sort({ fecha: 1 });
}

export async function actividadesFinalizadas() {
  return Actividad.find({ estado: ESTADOS.FINALIZADA }).sort({ updatedAt: -1 });
}

export async function actividadesPorPrioridad() {
  const actividades = await Actividad.find().lean();
  // Ordena de mayor a menor prioridad y agrupa.
  const grupos = { critica: [], alta: [], media: [], baja: [] };
  for (const act of actividades) {
    (grupos[act.prioridad] || grupos.media).push(act);
  }
  return PRIORIDADES_ORDEN.map((p) => ({ prioridad: p, actividades: grupos[p] }));
}

export async function resumen() {
  const actividades = await Actividad.find().lean();
  const porEstado = {};
  for (const estado of Object.values(ESTADOS)) {
    porEstado[estado] = actividades.filter((a) => a.estado === estado).length;
  }
  return {
    total: actividades.length,
    porEstado,
    pendientes: porEstado[ESTADOS.PENDIENTE] || 0,
    finalizadas: porEstado[ESTADOS.FINALIZADA] || 0,
  };
}
