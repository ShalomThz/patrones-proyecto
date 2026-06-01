import axios from "axios";

// URL base de la API. Se toma de la variable de entorno VITE_API_URL; si no
// está definida, usa "/api" (en desarrollo Vite hace proxy de /api al backend).
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const http = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Normaliza los errores: usa el mensaje { error } que envía el backend.
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const mensaje =
      err.response?.data?.error || err.message || "Error de red";
    return Promise.reject(new Error(mensaje));
  }
);

export const api = {
  // Actividades
  meta: () => http.get("/actividades/meta").then((r) => r.data),
  listarActividades: (query = "") => http.get(`/actividades${query}`).then((r) => r.data),
  crearActividad: (datos) => http.post("/actividades", datos).then((r) => r.data),
  actualizarActividad: (id, datos) => http.put(`/actividades/${id}`, datos).then((r) => r.data),
  cambiarEstado: (id, estado) =>
    http.patch(`/actividades/${id}/estado`, { estado }).then((r) => r.data),
  recordar: (id, canal) =>
    http.post(`/actividades/${id}/recordar`, { canal }).then((r) => r.data),
  eliminarActividad: (id) => http.delete(`/actividades/${id}`).then((r) => r.data),

  // Notificaciones
  listarNotificaciones: (canal) =>
    http
      .get("/notificaciones", { params: canal ? { canal } : {} })
      .then((r) => r.data),
  marcarLeida: (id) => http.patch(`/notificaciones/${id}/leida`).then((r) => r.data),

  // Reportes
  reporte: (nombre) => http.get(`/reportes/${nombre}`).then((r) => r.data),

  // Alumnos (destinatarios)
  listarAlumnos: () => http.get("/alumnos").then((r) => r.data),
  crearAlumno: (datos) => http.post("/alumnos", datos).then((r) => r.data),
  actualizarAlumno: (id, datos) => http.put(`/alumnos/${id}`, datos).then((r) => r.data),
  eliminarAlumno: (id) => http.delete(`/alumnos/${id}`).then((r) => r.data),
};
