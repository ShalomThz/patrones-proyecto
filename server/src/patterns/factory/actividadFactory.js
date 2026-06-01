import { Tarea, Examen, Proyecto, Practica } from "./actividades.js";

/**
 * PATRON 2: FACTORY METHOD (Creacional)
 * -------------------------------------
 * Delega la creacion de objetos a una funcion especializada, evitando que el
 * resto del codigo dependa de las clases concretas (Tarea, Examen, ...).
 * Para agregar un nuevo tipo de actividad basta con registrar su clase aqui.
 */
const REGISTRO_TIPOS = {
  tarea: Tarea,
  examen: Examen,
  proyecto: Proyecto,
  practica: Practica,
};

export function crearActividad(tipo, datos) {
  const Clase = REGISTRO_TIPOS[tipo];
  if (!Clase) {
    throw new Error(
      `Tipo de actividad no valido: "${tipo}". Tipos validos: ${Object.keys(REGISTRO_TIPOS).join(", ")}`
    );
  }
  return new Clase(datos);
}

export const TIPOS_DISPONIBLES = Object.keys(REGISTRO_TIPOS);
