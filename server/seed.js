import "dotenv/config";
import conexionDB from "./src/config/db.js";
import Actividad from "./src/models/Actividad.js";
import Notificacion from "./src/models/Notificacion.js";
import Alumno from "./src/models/Alumno.js";
import { registrarActividad } from "./src/services/actividadService.js";

/** Carga datos de ejemplo para probar la aplicacion. */
async function seed() {
  await conexionDB.conectar();
  await Actividad.deleteMany({});
  await Notificacion.deleteMany({});
  await Alumno.deleteMany({});

  // Destinatarios: a los alumnos activos les llegan correo/interno.
  const alumnos = [
    { nombre: "Ana Lopez", correo: "ana.lopez@escuela.edu", activo: true },
    { nombre: "Bruno Diaz", correo: "bruno.diaz@escuela.edu", activo: true },
    { nombre: "Carla Ruiz", correo: "carla.ruiz@escuela.edu", activo: false },
  ];
  await Alumno.insertMany(alumnos);
  console.log(`Alumnos creados: ${alumnos.length}`);

  const ejemplos = [
    { tipo: "tarea", nombre: "Tarea de Algoritmos", descripcion: "Resolver ejercicios 1-10", fecha: "2026-06-10", prioridad: "media" },
    { tipo: "examen", nombre: "Examen Parcial BD", descripcion: "Unidades 1 a 3", fecha: "2026-06-15", prioridad: "alta" },
    { tipo: "proyecto", nombre: "Proyecto Integrador", descripcion: "App con patrones de diseno", fecha: "2026-06-30", prioridad: "critica" },
    { tipo: "practica", nombre: "Practica de Redes", descripcion: "Configuracion de routers", fecha: "2026-06-05", prioridad: "baja" },
  ];

  for (const e of ejemplos) {
    await registrarActividad(e);
    console.log(`Creada: ${e.nombre}`);
  }

  console.log("\nSeed completado.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
