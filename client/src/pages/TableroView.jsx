import { useEffect, useState, useCallback } from "react";
import { Calendar, GripVertical } from "lucide-react";
import { api } from "../api/client.js";
import { useNotificaciones } from "../context/NotificacionContext.jsx";
import { Badge } from "@/components/ui/badge";
import { decorarPorPrioridad } from "../utils/decoradores.jsx";
import { ESTADO_BADGE, PRIORIDAD_DOT, PRIORIDAD_TEXTO, TIPO_ICON } from "@/lib/constantes";
import { cn } from "@/lib/utils";

// Punto de color por estado en la cabecera de cada columna.
const ESTADO_DOT = {
  Pendiente: "bg-amber-400",
  "En progreso": "bg-blue-500",
  Finalizada: "bg-emerald-500",
  Cancelada: "bg-rose-500",
};

// Tarjeta compacta y arrastrable.
function BoardCardBase({ actividad, onDragStart }) {
  const TipoIcon = TIPO_ICON[actividad.tipo];
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, actividad)}
      className="group cursor-grab rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary" className="gap-1.5 font-medium capitalize">
          {TipoIcon && <TipoIcon className="size-3.5" />}
          {actividad.tipo}
        </Badge>
        <GripVertical className="size-4 text-muted-foreground/40 group-hover:text-muted-foreground" />
      </div>
      <p className="mt-2 text-sm font-medium leading-tight">{actividad.nombre}</p>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Calendar className="size-3.5" />
          {new Date(actividad.fecha).toLocaleDateString()}
        </span>
        <span className={cn("inline-flex items-center gap-1.5 font-medium", PRIORIDAD_TEXTO[actividad.prioridad])}>
          <span className={cn("size-2 rounded-full", PRIORIDAD_DOT[actividad.prioridad])} />
          {actividad.prioridad}
        </span>
      </div>
    </div>
  );
}

function BoardCard(props) {
  const Decorada = decorarPorPrioridad(BoardCardBase, props.actividad.prioridad);
  return <Decorada {...props} />;
}

export default function TableroView({ meta }) {
  const { agregarToast, recargarNotificaciones } = useNotificaciones();
  const [actividades, setActividades] = useState([]);
  const [sobreColumna, setSobreColumna] = useState(null);

  const cargar = useCallback(async () => {
    setActividades(await api.listarActividades());
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const onDragStart = (e, actividad) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ id: actividad._id, estado: actividad.estado })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = async (e, estadoDestino) => {
    e.preventDefault();
    setSobreColumna(null);
    let payload;
    try {
      payload = JSON.parse(e.dataTransfer.getData("text/plain"));
    } catch {
      return;
    }
    if (!payload || payload.estado === estadoDestino) return;
    try {
      // El backend valida la transición con el patrón State.
      await api.cambiarEstado(payload.id, estadoDestino);
      agregarToast(`Movida a "${estadoDestino}"`, "ok");
      await cargar();
      recargarNotificaciones();
    } catch (err) {
      agregarToast(err.message, "error");
    }
  };

  const estados = meta.estados || ["Pendiente", "En progreso", "Finalizada", "Cancelada"];

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {estados.map((estado) => {
        const items = actividades.filter((a) => a.estado === estado);
        const activa = sobreColumna === estado;
        return (
          <div
            key={estado}
            onDragOver={(e) => {
              e.preventDefault();
              setSobreColumna(estado);
            }}
            onDragLeave={() => setSobreColumna((prev) => (prev === estado ? null : prev))}
            onDrop={(e) => onDrop(e, estado)}
            className={cn(
              "flex w-72 shrink-0 flex-col rounded-xl border bg-muted/40 transition-colors",
              activa && "border-primary bg-accent/60 ring-2 ring-primary/30"
            )}
          >
            <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <span className={cn("size-2.5 rounded-full", ESTADO_DOT[estado])} />
                <span className="text-sm font-semibold">{estado}</span>
              </div>
              <Badge className={cn("h-5 border-transparent px-2 text-[11px]", ESTADO_BADGE[estado])}>
                {items.length}
              </Badge>
            </div>

            <div className="flex flex-1 flex-col gap-2.5 p-3 min-h-[120px]">
              {items.length === 0 ? (
                <p className="rounded-lg border border-dashed py-6 text-center text-xs text-muted-foreground">
                  Suelta aquí
                </p>
              ) : (
                items.map((a) => <BoardCard key={a._id} actividad={a} onDragStart={onDragStart} />)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
