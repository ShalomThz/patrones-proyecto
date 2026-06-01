import { ClipboardList, GraduationCap, FolderKanban, FlaskConical } from "lucide-react";

// Mapeos de presentación reutilizados por los componentes.

export const ESTADO_BADGE = {
  Pendiente: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  "En progreso": "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Finalizada: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Cancelada: "bg-rose-100 text-rose-700 hover:bg-rose-100",
};

export const PRIORIDAD_DOT = {
  baja: "bg-slate-400",
  media: "bg-amber-400",
  alta: "bg-orange-500",
  critica: "bg-rose-600",
};

export const PRIORIDAD_TEXTO = {
  baja: "text-slate-500",
  media: "text-amber-600",
  alta: "text-orange-600",
  critica: "text-rose-600",
};

// Ícono (componente lucide) por tipo de actividad.
export const TIPO_ICON = {
  tarea: ClipboardList,
  examen: GraduationCap,
  proyecto: FolderKanban,
  practica: FlaskConical,
};

export const CANAL_LABEL = {
  pantalla: "Pantalla",
  correo: "Correo",
  interno: "Mensaje interno",
  bitacora: "Bitácora",
};
