import Notificacion from "../../models/Notificacion.js";
import { enviarCorreoReal } from "../../config/resend.js";

/**
 * PATRON 3: STRATEGY (Comportamiento)
 * -----------------------------------
 * Define una familia de algoritmos de envio de notificaciones intercambiables
 * en tiempo de ejecucion. Cada estrategia sabe como "enviar" por su canal
 * (todos simulados) y persiste la notificacion para que la interfaz la muestre.
 *
 * Para agregar un nuevo mecanismo de envio solo se registra una estrategia mas;
 * el codigo que las usa (enviarNotificacion) no cambia.
 */

async function persistir({ mensaje, canal, destinatario = "general", actividad = null }) {
  const doc = await Notificacion.create({ mensaje, canal, destinatario, actividad });
  return doc;
}

const estrategias = {
  // Notificacion en pantalla (toast/alerta en el navegador).
  pantalla: async (payload) => {
    console.log("[PANTALLA]", payload.mensaje);
    return persistir({ ...payload, canal: "pantalla" });
  },

  // Correo electronico: envio real con Resend cuando el destinatario es un
  // correo valido; en caso contrario queda como registro simulado.
  correo: async (payload) => {
    console.log(`[CORREO -> ${payload.destinatario || "general"}]`, payload.mensaje);
    await enviarCorreoReal({
      destinatario: payload.destinatario,
      mensaje: payload.mensaje,
      asunto: payload.asunto,
    });
    return persistir({ ...payload, canal: "correo" });
  },

  // Bitacora de eventos (log visible en la aplicacion).
  bitacora: async (payload) => {
    console.log("[BITACORA]", payload.mensaje);
    return persistir({ ...payload, canal: "bitacora" });
  },

  // Mensaje interno (seccion de mensajes dentro del sistema).
  interno: async (payload) => {
    console.log("[MENSAJE INTERNO]", payload.mensaje);
    return persistir({ ...payload, canal: "interno" });
  },
};

/**
 * Selecciona y ejecuta la estrategia de notificacion segun el canal indicado.
 */
export async function enviarNotificacion(canal, payload) {
  const estrategia = estrategias[canal];
  if (!estrategia) {
    throw new Error(
      `Canal de notificacion no valido: "${canal}". Canales validos: ${Object.keys(estrategias).join(", ")}`
    );
  }
  return estrategia(payload);
}

export const CANALES_DISPONIBLES = Object.keys(estrategias);
