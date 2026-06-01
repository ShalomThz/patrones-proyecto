import mongoose from "mongoose";
import { ESTADOS } from "../patterns/state/estados.js";

export const TIPOS_ACTIVIDAD = ["tarea", "examen", "proyecto", "practica"];
export const PRIORIDADES = ["baja", "media", "alta", "critica"];

const actividadSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, default: "", trim: true },
    fecha: { type: Date, required: true },
    tipo: { type: String, enum: TIPOS_ACTIVIDAD, required: true },
    prioridad: { type: String, enum: PRIORIDADES, default: "media" },
    estado: {
      type: String,
      enum: Object.values(ESTADOS),
      default: ESTADOS.PENDIENTE,
    },
  },
  { timestamps: true }
);

const Actividad = mongoose.model("Actividad", actividadSchema);
export default Actividad;
