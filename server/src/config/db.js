import mongoose from "mongoose";

/**
 * PATRON 1: SINGLETON (Creacional)
 * ---------------------------------
 * Garantiza una unica instancia de conexion a MongoDB durante todo el ciclo
 * de vida de la aplicacion. Si ya existe una conexion activa, se reutiliza en
 * lugar de abrir una nueva, evitando fugas de conexiones.
 */
class ConexionDB {
  constructor() {
    if (ConexionDB.instancia) {
      return ConexionDB.instancia;
    }
    this.conexion = null;
    ConexionDB.instancia = this;
  }

  async conectar() {
    if (this.conexion) {
      // Ya existe una conexion activa: se reutiliza (comportamiento Singleton).
      return this.conexion;
    }
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gestion_notificaciones";
    this.conexion = await mongoose.connect(uri);
    console.log(`[Singleton] Conexion a MongoDB establecida: ${uri}`);
    return this.conexion;
  }

  estaConectado() {
    return mongoose.connection.readyState === 1;
  }
}

// Se exporta SIEMPRE la misma instancia.
const conexionDB = new ConexionDB();
export default conexionDB;
