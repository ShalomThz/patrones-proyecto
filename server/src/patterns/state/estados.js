/**
 * PATRON 5: STATE (Comportamiento)
 * --------------------------------
 * Cada estado de una actividad se modela como una clase que conoce:
 *   - su nombre,
 *   - hacia que estados puede transicionar,
 *   - si es un estado terminal.
 *
 * Asi, el comportamiento (que transiciones son validas) cambia segun el
 * estado interno del objeto, sin necesidad de cadenas de if/switch dispersas.
 */

export const ESTADOS = {
  PENDIENTE: "Pendiente",
  EN_PROGRESO: "En progreso",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
};

class EstadoActividad {
  get nombre() {
    throw new Error("Estado abstracto: implementar 'nombre'");
  }
  // Estados a los que se puede transicionar desde este estado.
  transicionesPermitidas() {
    return [];
  }
  esTerminal() {
    return this.transicionesPermitidas().length === 0;
  }
  puedeTransicionarA(nombreEstado) {
    return this.transicionesPermitidas().includes(nombreEstado);
  }
}

class EstadoPendiente extends EstadoActividad {
  get nombre() {
    return ESTADOS.PENDIENTE;
  }
  transicionesPermitidas() {
    return [ESTADOS.EN_PROGRESO, ESTADOS.CANCELADA];
  }
}

class EstadoEnProgreso extends EstadoActividad {
  get nombre() {
    return ESTADOS.EN_PROGRESO;
  }
  transicionesPermitidas() {
    return [ESTADOS.FINALIZADA, ESTADOS.CANCELADA, ESTADOS.PENDIENTE];
  }
}

class EstadoFinalizada extends EstadoActividad {
  get nombre() {
    return ESTADOS.FINALIZADA;
  }
  transicionesPermitidas() {
    return []; // Estado terminal.
  }
}

class EstadoCancelada extends EstadoActividad {
  get nombre() {
    return ESTADOS.CANCELADA;
  }
  transicionesPermitidas() {
    return []; // Estado terminal.
  }
}

const REGISTRO_ESTADOS = {
  [ESTADOS.PENDIENTE]: EstadoPendiente,
  [ESTADOS.EN_PROGRESO]: EstadoEnProgreso,
  [ESTADOS.FINALIZADA]: EstadoFinalizada,
  [ESTADOS.CANCELADA]: EstadoCancelada,
};

/**
 * Devuelve la instancia de estado correspondiente a un nombre.
 * (Pequena fabrica interna del patron State.)
 */
export function obtenerEstado(nombreEstado) {
  const Clase = REGISTRO_ESTADOS[nombreEstado];
  if (!Clase) {
    throw new Error(`Estado no valido: ${nombreEstado}`);
  }
  return new Clase();
}

/**
 * Valida una transicion entre dos estados segun las reglas del patron State.
 * Lanza un error con mensaje claro si la transicion no esta permitida.
 */
export function validarTransicion(estadoActual, estadoNuevo) {
  if (estadoActual === estadoNuevo) return true;
  const estado = obtenerEstado(estadoActual);
  if (!estado.puedeTransicionarA(estadoNuevo)) {
    throw new Error(
      `Transicion no permitida: "${estadoActual}" -> "${estadoNuevo}". ` +
        `Transiciones validas: ${estado.transicionesPermitidas().join(", ") || "(estado terminal)"}`
    );
  }
  return true;
}
