import Actividad from "../models/Actividad.js";
import { crearActividad } from "../patterns/factory/actividadFactory.js";
import { validarTransicion } from "../patterns/state/estados.js";
import { emitirCambioEstado } from "../patterns/observer/emisorEventos.js";
import { enviarNotificacion } from "../patterns/strategy/estrategiasNotificacion.js";

/**
 * Capa de servicios: orquesta los patrones de diseno.
 *  - Factory Method para construir la actividad segun su tipo.
 *  - State para validar las transiciones de estado.
 *  - Observer para notificar los cambios de estado.
 *  - Strategy (indirectamente) para el envio de recordatorios.
 */

export async function listarActividades(filtros = {}) {
  return Actividad.find(filtros).sort({ fecha: 1 });
}

export async function obtenerActividad(id) {
  const actividad = await Actividad.findById(id);
  if (!actividad) throw new Error("Actividad no encontrada");
  return actividad;
}

export async function registrarActividad(datos) {
  // Factory Method: valida el tipo y normaliza los datos antes de persistir.
  const actividadDominio = crearActividad(datos.tipo, datos);
  const creada = await Actividad.create(actividadDominio.aDocumento());

  // Recordatorio inicial usando el mensaje propio del tipo (Factory + Strategy).
  await enviarNotificacion("pantalla", {
    mensaje: actividadDominio.mensajeRecordatorio(),
    destinatario: "alumno",
    actividad: creada._id,
  });
  return creada;
}

export async function actualizarActividad(id, cambios) {
  const actividad = await obtenerActividad(id);

  // Si cambia el estado, se valida con el patron State y se notifica (Observer).
  if (cambios.estado && cambios.estado !== actividad.estado) {
    validarTransicion(actividad.estado, cambios.estado);
    const estadoAnterior = actividad.estado;
    actividad.estado = cambios.estado;
    await actividad.save();
    emitirCambioEstado(actividad, estadoAnterior);
  }

  // Otros campos editables.
  const camposEditables = ["nombre", "descripcion", "fecha", "prioridad", "tipo"];
  let cambioOtros = false;
  for (const campo of camposEditables) {
    if (cambios[campo] !== undefined) {
      actividad[campo] = cambios[campo];
      cambioOtros = true;
    }
  }
  if (cambioOtros) await actividad.save();

  return actividad;
}

export async function cambiarEstado(id, nuevoEstado) {
  return actualizarActividad(id, { estado: nuevoEstado });
}

export async function eliminarActividad(id) {
  const actividad = await obtenerActividad(id);
  await actividad.deleteOne();
  return actividad;
}

/** Dispara manualmente un recordatorio por el canal indicado (Strategy). */
export async function enviarRecordatorio(id, canal) {
  const actividad = await obtenerActividad(id);
  const mensaje = `Recordatorio: "${actividad.nombre}" (${actividad.tipo}) vence el ${new Date(
    actividad.fecha
  ).toLocaleDateString()}.`;
  return enviarNotificacion(canal, {
    mensaje,
    destinatario: "alumno",
    actividad: actividad._id,
  });
}
