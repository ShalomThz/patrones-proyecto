import { useMemo } from "react";
import { Calendar, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { decorarPorPrioridad } from "../utils/decoradores.jsx";
import { ESTADO_BADGE, PRIORIDAD_DOT, PRIORIDAD_TEXTO, TIPO_ICON } from "@/lib/constantes";
import { cn } from "@/lib/utils";

// Componente base sin decorar.
function TarjetaBase({ actividad, transiciones, onCambiarEstado, onRecordar, onEliminar }) {
  const siguientes = transiciones?.[actividad.estado] || [];
  const TipoIcon = TIPO_ICON[actividad.tipo];
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary" className="gap-1.5 font-medium capitalize">
            {TipoIcon && <TipoIcon className="size-3.5" />}
            {actividad.tipo}
          </Badge>
          <Badge className={cn("border-transparent", ESTADO_BADGE[actividad.estado])}>
            {actividad.estado}
          </Badge>
        </div>

        <h3 className="mt-3 font-semibold leading-tight">{actividad.nombre}</h3>
        {actividad.descripcion && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{actividad.descripcion}</p>
        )}

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" />
            {new Date(actividad.fecha).toLocaleDateString()}
          </span>
          <span className={cn("inline-flex items-center gap-1.5 font-medium", PRIORIDAD_TEXTO[actividad.prioridad])}>
            <span className={cn("size-2 rounded-full", PRIORIDAD_DOT[actividad.prioridad])} />
            {actividad.prioridad}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {siguientes.length > 0 ? (
            <Select value="" onValueChange={(v) => onCambiarEstado(actividad._id, v)}>
              <SelectTrigger className="h-8 flex-1 text-xs">
                <SelectValue placeholder="Cambiar estado…" />
              </SelectTrigger>
              <SelectContent>
                {siguientes.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="flex-1 text-xs text-muted-foreground">Estado final</span>
          )}

          <Select value="" onValueChange={(v) => onRecordar(actividad._id, v)}>
            <SelectTrigger className="h-8 flex-1 text-xs">
              <SelectValue placeholder="Recordar por…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pantalla">Pantalla (toast)</SelectItem>
              <SelectItem value="correo">Correo simulado</SelectItem>
              <SelectItem value="interno">Mensaje interno</SelectItem>
              <SelectItem value="bitacora">Bitácora</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={() => onEliminar(actividad._id)}
            title="Eliminar"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Aplica el patron Decorator segun la prioridad de la actividad.
export default function ActividadCard(props) {
  const Decorada = useMemo(
    () => decorarPorPrioridad(TarjetaBase, props.actividad.prioridad),
    [props.actividad.prioridad]
  );
  return <Decorada {...props} />;
}
