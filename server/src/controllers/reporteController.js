import * as reportes from "../services/reporteService.js";

export async function pendientes(req, res, next) {
  try {
    res.json(await reportes.actividadesPendientes());
  } catch (err) {
    next(err);
  }
}

export async function finalizadas(req, res, next) {
  try {
    res.json(await reportes.actividadesFinalizadas());
  } catch (err) {
    next(err);
  }
}

export async function porPrioridad(req, res, next) {
  try {
    res.json(await reportes.actividadesPorPrioridad());
  } catch (err) {
    next(err);
  }
}

export async function resumen(req, res, next) {
  try {
    res.json(await reportes.resumen());
  } catch (err) {
    next(err);
  }
}
