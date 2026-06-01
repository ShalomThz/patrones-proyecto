import * as service from "../services/actividadService.js";
import { PRIORIDADES } from "../models/Actividad.js";
import { TIPOS_DISPONIBLES } from "../patterns/factory/actividadFactory.js";
import { obtenerEstado, ESTADOS } from "../patterns/state/estados.js";

// Metadatos utiles para el frontend (tipos, estados, transiciones).
export function meta(req, res) {
  const transiciones = {};
  for (const estado of Object.values(ESTADOS)) {
    transiciones[estado] = obtenerEstado(estado).transicionesPermitidas();
  }
  res.json({
    tipos: TIPOS_DISPONIBLES,
    estados: Object.values(ESTADOS),
    prioridades: PRIORIDADES,
    transiciones,
  });
}

export async function listar(req, res, next) {
  try {
    const { estado, tipo, prioridad } = req.query;
    const filtros = {};
    if (estado) filtros.estado = estado;
    if (tipo) filtros.tipo = tipo;
    if (prioridad) filtros.prioridad = prioridad;
    res.json(await service.listarActividades(filtros));
  } catch (err) {
    next(err);
  }
}

export async function obtener(req, res, next) {
  try {
    res.json(await service.obtenerActividad(req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const creada = await service.registrarActividad(req.body);
    res.status(201).json(creada);
  } catch (err) {
    next(err);
  }
}

export async function actualizar(req, res, next) {
  try {
    res.json(await service.actualizarActividad(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
}

// Cambio de estado (valida la transicion con el patron State).
export async function cambiarEstado(req, res, next) {
  try {
    res.json(await service.cambiarEstado(req.params.id, req.body.estado));
  } catch (err) {
    next(err);
  }
}

// Disparar un recordatorio manual por un canal (patron Strategy).
export async function recordar(req, res, next) {
  try {
    const notif = await service.enviarRecordatorio(req.params.id, req.body.canal);
    res.status(201).json(notif);
  } catch (err) {
    next(err);
  }
}

export async function eliminar(req, res, next) {
  try {
    res.json(await service.eliminarActividad(req.params.id));
  } catch (err) {
    next(err);
  }
}
