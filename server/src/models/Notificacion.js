import mongoose from "mongoose";

// Canales/mecanismos de envio soportados (todos simulados en la interfaz web).
export const CANALES = ["pantalla", "correo", "bitacora", "interno"];

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
