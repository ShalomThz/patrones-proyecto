import express from "express";
import cors from "cors";
import conexionDB from "./config/db.js";
import actividadesRouter from "./routes/actividades.js";
import notificacionesRouter from "./routes/notificaciones.js";
import reportesRouter from "./routes/reportes.js";
import alumnosRouter from "./routes/alumnos.js";

// Configuracion de la aplicacion Express (middlewares, rutas, manejo de errores).
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, db: conexionDB.estaConectado() });
});

app.use("/api/actividades", actividadesRouter);
app.use("/api/notificaciones", notificacionesRouter);
app.use("/api/reportes", reportesRouter);
app.use("/api/alumnos", alumnosRouter);

// Ruta no encontrada (responde JSON en lugar del HTML por defecto de Express).
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Middleware central de manejo de errores.
app.use((err, req, res, next) => {
  console.error("[Error]", err.message);
  let status = err.status || 500;
  let mensaje = err.message;
  if (err.name === "CastError") status = 400; // id mal formado
  else if (err.name === "ValidationError") status = 400; // validacion de Mongoose
  else if (err.code === 11000) {
    status = 400; // clave duplicada (p. ej. correo de alumno repetido)
    mensaje = "Ya existe un alumno con ese correo";
  } else if (/no encontrad[ao]/i.test(err.message)) status = 404;
  else if (/no valid|no permitida|requiere/i.test(err.message)) status = 400;
  res.status(status).json({ error: mensaje });
});

export default app;
