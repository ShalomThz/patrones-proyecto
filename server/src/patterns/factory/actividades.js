import { ESTADOS } from "../state/estados.js";

/**
 * Clases concretas de actividad usadas por el Factory Method.
 * Cada tipo puede definir comportamiento propio (etiqueta, mensaje de
 * recordatorio, dias de anticipacion para avisar, etc.).
 */
class Actividad {
  constructor({ nombre, descripcion = "", fecha, prioridad = "media", estado = ESTADOS.PENDIENTE }) {
    if (!nombre) throw new Error("La actividad requiere un nombre");
    if (!fecha) throw new Error("La actividad requiere una fecha");
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.fecha = new Date(fecha);
    this.prioridad = prioridad;
    this.estado = estado;
  }

  get tipo() {
    throw new Error("Actividad abstracta: implementar 'tipo'");
  }

  // Mensaje de recordatorio personalizado por tipo de actividad.
  mensajeRecordatorio() {
    return `Recordatorio: ${this.nombre} (${this.fecha.toLocaleDateString()})`;
  }

  // Representacion lista para persistir en Mongoose.
  aDocumento() {
    return {
      nombre: this.nombre,
      descripcion: this.descripcion,
      fecha: this.fecha,
      tipo: this.tipo,
      prioridad: this.prioridad,
      estado: this.estado,
    };
  }
}

export class Tarea extends Actividad {
  get tipo() {
    return "tarea";
  }
  mensajeRecordatorio() {
    return `Tienes una tarea pendiente: "${this.nombre}" para el ${this.fecha.toLocaleDateString()}.`;
  }
}

export class Examen extends Actividad {
  get tipo() {
    return "examen";
  }
  mensajeRecordatorio() {
    return `Examen proximo: "${this.nombre}". Prepara tu estudio para el ${this.fecha.toLocaleDateString()}.`;
  }
}

export class Proyecto extends Actividad {
  get tipo() {
    return "proyecto";
  }
  mensajeRecordatorio() {
    return `Proyecto "${this.nombre}": revisa los avances. Entrega el ${this.fecha.toLocaleDateString()}.`;
  }
}

export class Practica extends Actividad {
  get tipo() {
    return "practica";
  }
  mensajeRecordatorio() {
    return `Practica de laboratorio "${this.nombre}" programada para el ${this.fecha.toLocaleDateString()}.`;
  }
}
