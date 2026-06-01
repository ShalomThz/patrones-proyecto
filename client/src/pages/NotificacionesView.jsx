import { useState } from "react";
import { MonitorSmartphone, Mail, MessageSquare, ScrollText, Inbox } from "lucide-react";
import { useNotificaciones } from "../context/NotificacionContext.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CANAL_LABEL } from "@/lib/constantes";
import { cn } from "@/lib/utils";

const ICONO_CANAL = {
  pantalla: MonitorSmartphone,
  correo: Mail,
  interno: MessageSquare,
  bitacora: ScrollText,
};

const FILTROS = [
  { id: "", label: "Todas" },
  { id: "pantalla", label: "Pantalla" },
  { id: "correo", label: "Correo" },
  { id: "interno", label: "Internas" },
  { id: "bitacora", label: "Bitácora" },
];

export default function NotificacionesView() {
  const { notificaciones } = useNotificaciones();
  const [canal, setCanal] = useState("");

  const lista = canal ? notificaciones.filter((n) => n.canal === canal) : notificaciones;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <Button
            key={f.id}
            variant={canal === f.id ? "default" : "outline"}
            size="sm"
            onClick={() => setCanal(f.id)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {lista.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-accent">
                <Inbox className="size-6 text-accent-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No hay notificaciones en este canal.</p>
            </div>
          ) : (
            <ul className="divide-y">
              {lista.map((n) => {
                const Icono = ICONO_CANAL[n.canal] || ScrollText;
                return (
                  <li key={n._id} className="flex items-start gap-3 px-5 py-3.5">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Icono className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug">{n.mensaje}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-normal">
                          {CANAL_LABEL[n.canal] || n.canal}
                        </Badge>
                        {n.actividad?.nombre && (
                          <span className="text-xs text-muted-foreground">{n.actividad.nombre}</span>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                    {!n.leida && n.canal !== "bitacora" && (
                      <span className={cn("mt-1.5 size-2 shrink-0 rounded-full bg-primary")} />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
