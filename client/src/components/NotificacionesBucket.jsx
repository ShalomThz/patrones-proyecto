import { Bell, Mail, MessageSquare, MonitorSmartphone, CheckCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useNotificaciones } from "../context/NotificacionContext.jsx";

const ICONO_CANAL = {
  pantalla: MonitorSmartphone,
  correo: Mail,
  interno: MessageSquare,
};

function tiempoRelativo(fecha) {
  const seg = Math.floor((Date.now() - new Date(fecha).getTime()) / 1000);
  if (seg < 60) return "hace un momento";
  if (seg < 3600) return `hace ${Math.floor(seg / 60)} min`;
  if (seg < 86400) return `hace ${Math.floor(seg / 3600)} h`;
  return new Date(fecha).toLocaleDateString();
}

/** "Bucket" de notificaciones pendientes: campana con contador + panel. */
export default function NotificacionesBucket() {
  const { pendientes, contadorPendientes, marcarLeida, marcarTodasLeidas } = useNotificaciones();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="size-4" />
          {contadorPendientes > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex min-w-5 h-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-bold text-destructive-foreground ring-2 ring-background">
              {contadorPendientes > 99 ? "99+" : contadorPendientes}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Notificaciones</p>
            <p className="text-xs text-muted-foreground">
              {contadorPendientes === 0
                ? "Estás al día"
                : `${contadorPendientes} pendiente${contadorPendientes === 1 ? "" : "s"}`}
            </p>
          </div>
          {contadorPendientes > 0 && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={marcarTodasLeidas}>
              <CheckCheck className="size-3.5" />
              Marcar todas
            </Button>
          )}
        </div>
        <Separator />

        <div className="max-h-[360px] overflow-y-auto">
          {pendientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-accent">
                <Bell className="size-5 text-accent-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No tienes notificaciones pendientes.</p>
            </div>
          ) : (
            <ul className="divide-y">
              {pendientes.map((n) => {
                const Icono = ICONO_CANAL[n.canal] || Bell;
                return (
                  <li key={n._id} className="group flex gap-3 px-4 py-3 hover:bg-muted/50">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Icono className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug">{n.mensaje}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {n.actividad?.nombre ? `${n.actividad.nombre} · ` : ""}
                        {tiempoRelativo(n.createdAt)}
                      </p>
                    </div>
                    <button
                      title="Marcar como leída"
                      onClick={() => marcarLeida(n._id)}
                      className="self-center rounded-md p-1.5 text-muted-foreground opacity-0 transition hover:bg-accent hover:text-accent-foreground group-hover:opacity-100"
                    >
                      <Check className="size-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
