import Alumno from "../models/Alumno.js";

// Capa de servicios para la gestion de destinatarios (alumnos).
export async function listarAlumnos() {
  return Alumno.find().sort({ nombre: 1 });
}

export async function crearAlumno({ nombre, correo, activo = true }) {
  return Alumno.create({ nombre, correo, activo });
}

export async function actualizarAlumno(id, cambios) {
  const alumno = await Alumno.findById(id);
  if (!alumno) throw new Error("Alumno no encontrado");
  for (const campo of ["nombre", "correo", "activo"]) {
    if (cambios[campo] !== undefined) alumno[campo] = cambios[campo];
  }
  await alumno.save();
  return alumno;
}

export async function eliminarAlumno(id) {
  const alumno = await Alumno.findById(id);
  if (!alumno) throw new Error("Alumno no encontrado");
  await alumno.deleteOne();
  return alumno;
}
