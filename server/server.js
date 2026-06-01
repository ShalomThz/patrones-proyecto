import "dotenv/config";
import app from "./src/app.js";
import conexionDB from "./src/config/db.js";

const PORT = process.env.PORT || 4000;

async function iniciar() {
  try {
    await conexionDB.conectar(); // Patron Singleton.
    const servidor = app.listen(PORT, () =>
      console.log(`[Servidor] API escuchando en http://localhost:${PORT}`)
    );
    servidor.on("error", (err) => {
      const detalle = err.code === "EADDRINUSE" ? `El puerto ${PORT} ya esta en uso` : err.message;
      console.error("[Servidor] No se pudo iniciar:", detalle);
      process.exit(1);
    });
  } catch (err) {
    console.error("[Servidor] No se pudo iniciar:", err.message);
    process.exit(1);
  }
}

iniciar();
