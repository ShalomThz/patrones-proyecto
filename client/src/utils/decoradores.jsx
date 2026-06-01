/**
 * PATRON 6: DECORATOR (Estructural)
 * ---------------------------------
 * Componentes React de orden superior (HOC) que envuelven una tarjeta de
 * actividad para anadirle, de forma dinamica, un realce visual segun su
 * prioridad, sin modificar el componente original.
 */

export const conPrioridadUrgente = (Componente) => (props) =>
  (
    <div className="relative rounded-xl ring-2 ring-orange-400/70 ring-offset-2 ring-offset-background">
      <span className="absolute -top-2 right-3 z-10 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white shadow">
        URGENTE
      </span>
      <Componente {...props} />
    </div>
  );

export const conPrioridadCritica = (Componente) => (props) =>
  (
    <div className="relative rounded-xl ring-2 ring-rose-500/80 ring-offset-2 ring-offset-background">
      <span className="absolute -top-2 right-3 z-10 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white shadow">
        CRÍTICA
      </span>
      <Componente {...props} />
    </div>
  );

/**
 * Selecciona el decorador adecuado segun la prioridad. Las prioridades bajas
 * no se decoran (se devuelve el componente tal cual).
 */
export function decorarPorPrioridad(Componente, prioridad) {
  if (prioridad === "critica") return conPrioridadCritica(Componente);
  if (prioridad === "alta") return conPrioridadUrgente(Componente);
  return Componente;
}
