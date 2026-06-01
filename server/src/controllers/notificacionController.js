import Notificacion from "../models/Notificacion.js";
import { enviarNotificacion, CANALES_DISPONIBLES } from "../patterns/strategy/estrategiasNotificacion.js";

export function canales(req, res) {
  res.json(CANALES_DISPONIBLES);
}

// Listado de notificaciones, opcionalmente filtrado por canal.
export async function listar(req, res, next) {
  try {
    const filtros = {};
    if (req.query.canal) filtros.canal = req.query.canal;
    const notifs = await Notificacion.find(filtros)
      .sort({ createdAt: -1 })
      .limit(Number(req.query.limit) || 100)
      .populate("actividad", "nombre tipo");
    res.json(notifs);
  } catch (err) {
    next(err);
  }
}

// Crear/enviar una notificacion manual usando una estrategia (Strategy).
export async function crear(req, res, next) {
  try {
    const { canal, mensaje, destinatario, actividad } = req.body;
    const notif = await enviarNotificacion(canal, { mensaje, destinatario, actividad });
    res.status(201).json(notif);
  } catch (err) {
    next(err);
  }
}

// Marcar una notificacion como leida (util para toasts en pantalla).
export async function marcarLeida(req, res, next) {
  try {
    const notif = await Notificacion.findByIdAndUpdate(
      req.params.id,
      { leida: true },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    next(err);
  }
}
