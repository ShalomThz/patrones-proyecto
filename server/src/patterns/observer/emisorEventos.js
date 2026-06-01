import { EventEmitter } from "events";
import { enviarNotificacion } from "../strategy/estrategiasNotificacion.js";

/**
 * PATRON 4: OBSERVER (Comportamiento)
 * -----------------------------------
 * Define una dependencia uno-a-muchos: cuando una actividad cambia de estado,
 * todos los observadores suscritos son notificados automaticamente.
 *
 * Aqui el "sujeto" es un EventEmitter de Node.js y los "observadores" son los
 * manejadores suscritos al evento "estadoCambiado": Docente, Bitacora y Alumno.
 * Cada observador reutiliza el patron Strategy para enviar por su canal.
 */
export const emisor = new EventEmitter();

// Observador 1: Docente -> recibe un correo simulado.
async function notificarDocente({ actividad, estadoAnterior }) {
  await enviarNotificacion("correo", {
    mensaje: `[Docente] La actividad "${actividad.nombre}" cambio de "${estadoAnterior}" a "${actividad.estado}".`,
    destinatario: "docente",
    actividad: actividad._id,
  });
}

// Observador 2: Bitacora -> registra el evento en el log del sistema.
async function registrarBitacora({ actividad, estadoAnterior }) {
  await enviarNotificacion("bitacora", {
    mensaje: `Cambio de estado: "${actividad.nombre}" ${estadoAnterior} -> ${actividad.estado}.`,
    destinatario: "sistema",
    actividad: actividad._id,
  });
}

// Observador 3: Alumno -> recibe un mensaje interno + un toast en pantalla.
async function notificarAlumno({ actividad, estadoAnterior }) {
  await enviarNotificacion("interno", {
    mensaje: `[Alumno] "${actividad.nombre}" ahora esta en estado "${actividad.estado}".`,
    destinatario: "alumno",
    actividad: actividad._id,
  });
  await enviarNotificacion("pantalla", {
    mensaje: `"${actividad.nombre}" -> ${actividad.estado}`,
    destinatario: "alumno",
    actividad: actividad._id,
  });
}

// Suscripcion de los observadores al evento del sujeto.
emisor.on("estadoCambiado", (payload) => {
  // Se ejecutan de forma independiente; un fallo no detiene a los demas.
  Promise.allSettled([
    notificarDocente(payload),
    registrarBitacora(payload),
    notificarAlumno(payload),
  ]).then((resultados) => {
    resultados
      .filter((r) => r.status === "rejected")
      .forEach((r) => console.error("[Observer] Error en observador:", r.reason));
  });
});

/** Notifica a todos los observadores que una actividad cambio de estado. */
export function emitirCambioEstado(actividad, estadoAnterior) {
  emisor.emit("estadoCambiado", { actividad, estadoAnterior });
}
