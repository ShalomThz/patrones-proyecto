import { Resend } from "resend";

/**
 * Servicio de correo real (Resend) para la estrategia "correo".
 *
 * El cliente se crea de forma perezosa: si no hay RESEND_API_KEY el envio se
 * simula (solo se registra/persiste la notificacion) y la app sigue funcionando.
 * Esto encaja con el patron Strategy: cambiar el "correo simulado" por correos
 * reales no afecta al Observer, los servicios ni la interfaz.
 */
let cliente = null;

function obtenerCliente() {
  if (cliente) return cliente;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  cliente = new Resend(apiKey);
  return cliente;
}

// Remitente verificado en Resend. Por defecto usa el dominio de pruebas.
function remitente() {
  return process.env.RESEND_FROM || "Académico <onboarding@resend.dev>";
}

// Acepta solo destinatarios que parecen un correo real (no "docente"/"general").
function esCorreo(valor) {
  return typeof valor === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

/**
 * Envia un correo con Resend. Devuelve un objeto con el resultado:
 *  - { enviado: true, id }        -> correo real enviado
 *  - { enviado: false, simulado } -> sin api key o destinatario no es correo
 *  - { enviado: false, error }    -> Resend respondio con error
 */
export async function enviarCorreoReal({ destinatario, mensaje, asunto }) {
  const resend = obtenerCliente();
  if (!resend) {
    console.log("[RESEND] Sin RESEND_API_KEY: correo simulado.");
    return { enviado: false, simulado: true };
  }
  if (!esCorreo(destinatario)) {
    // Destinatarios internos (docente/general) no se envian por correo real.
    return { enviado: false, simulado: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: remitente(),
      to: destinatario,
      subject: asunto || "Recordatorio académico",
      text: mensaje,
    });
    if (error) throw new Error(error.message || "Error de Resend");
    console.log(`[RESEND] Correo enviado a ${destinatario} (id: ${data?.id})`);
    return { enviado: true, id: data?.id };
  } catch (err) {
    // Un fallo de correo no debe interrumpir el resto de notificaciones.
    console.error(`[RESEND] Error al enviar a ${destinatario}:`, err.message);
    return { enviado: false, error: err.message };
  }
}
