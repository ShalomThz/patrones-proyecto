import mongoose from "mongoose";

// Destinatario de las notificaciones. El docente gestiona su lista de alumnos
// y a los que esten "activos" les llegan los recordatorios por correo/interno.
const alumnoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, trim: true, lowercase: true, unique: true },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Alumno = mongoose.model("Alumno", alumnoSchema);
export default Alumno;
