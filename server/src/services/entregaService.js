import Alumno from "../models/Alumno.js";
import { enviarNotificacion } from "../patterns/strategy/estrategiasNotificacion.js";

/**
 * Capa de entrega: decide A QUIEN llega cada canal y delega el COMO al Strategy.
 *  - correo / interno  -> una notificacion por cada alumno activo (a su correo).
 *  - pantalla / bitacora -> un unico registro general (para el tablero del docente).
 */
const CANALES_POR_ALUMNO = new Set(["correo", "interno"]);

export async function entregar({ canales = [], mensaje, actividad }) {
  const actividadId = actividad?._id ?? actividad ?? null;
  const enviados = [];

  for (const canal of canales) {
    if (CANALES_POR_ALUMNO.has(canal)) {
      const alumnos = await Alumno.find({ activo: true });
      for (const alumno of alumnos) {
        enviados.push(
          await enviarNotificacion(canal, {
            mensaje,
            destinatario: alumno.correo,
            actividad: actividadId,
          })
        );
      }
    } else {
      enviados.push(
        await enviarNotificacion(canal, {
          mensaje,
          destinatario: "general",
          actividad: actividadId,
        })
      );
    }
  }

  return enviados;
}
