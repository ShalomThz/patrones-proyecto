import mongoose from "mongoose";

// Canales/mecanismos de envio soportados (todos simulados en la interfaz web).
export const CANALES = ["pantalla", "correo", "bitacora", "interno"];

// Canales que el docente puede elegir por actividad. La "bitacora" se omite
// porque es un registro automatico del sistema (no se configura).
export const CANALES_NOTIFICABLES = ["pantalla", "correo", "interno"];

const notificacionSchema = new mongoose.Schema(
  {
    mensaje: { type: String, required: true },
    canal: { type: String, enum: CANALES, required: true },
    destinatario: { type: String, default: "general" },
    actividad: { type: mongoose.Schema.Types.ObjectId, ref: "Actividad" },
    leida: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notificacion = mongoose.model("Notificacion", notificacionSchema);
export default Notificacion;
