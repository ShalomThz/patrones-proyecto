import * as service from "../services/alumnoService.js";

export async function listar(req, res, next) {
  try {
    res.json(await service.listarAlumnos());
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    res.status(201).json(await service.crearAlumno(req.body));
  } catch (err) {
    next(err);
  }
}

export async function actualizar(req, res, next) {
  try {
    res.json(await service.actualizarAlumno(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
}

export async function eliminar(req, res, next) {
  try {
    res.json(await service.eliminarAlumno(req.params.id));
  } catch (err) {
    next(err);
  }
}
