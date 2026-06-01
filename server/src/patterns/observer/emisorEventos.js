import { EventEmitter } from "events";
import { enviarNotificacion } from "../strategy/estrategiasNotificacion.js";
import { entregar } from "../../services/entregaService.js";

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

// Observador 3: Alumnos -> entrega por los canales configurados en la actividad
// (correo/interno a cada alumno activo, pantalla como aviso general).
async function notificarAlumnos({ actividad }) {
  const canales = actividad.canales?.length ? actividad.canales : ["pantalla"];
  await entregar({
    canales,
    mensaje: `"${actividad.nombre}" ahora esta en estado "${actividad.estado}".`,
    actividad,
  });
}

// Suscripcion de los observadores al evento del sujeto.
emisor.on("estadoCambiado", (payload) => {
  // Se ejecutan de forma independiente; un fallo no detiene a los demas.
  Promise.allSettled([
    notificarDocente(payload),
    registrarBitacora(payload),
    notificarAlumnos(payload),
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
