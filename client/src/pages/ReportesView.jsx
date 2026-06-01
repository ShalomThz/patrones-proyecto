import { useEffect, useState } from "react";
import { ListChecks, Clock, CheckCircle2, Ban } from "lucide-react";
import { api } from "../api/client.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRIORIDAD_DOT } from "@/lib/constantes";
import { cn } from "@/lib/utils";

const METRICAS = [
  { key: "total", label: "Total", icon: ListChecks, color: "text-primary", bg: "bg-accent" },
  { key: "Pendiente", label: "Pendientes", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  { key: "Finalizada", label: "Finalizadas", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "Cancelada", label: "Canceladas", icon: Ban, color: "text-rose-600", bg: "bg-rose-50" },
];

export default function ReportesView() {
  const [resumen, setResumen] = useState(null);
  const [porPrioridad, setPorPrioridad] = useState([]);

  useEffect(() => {
    api.reporte("resumen").then(setResumen).catch(() => {});
    api.reporte("prioridad").then(setPorPrioridad).catch(() => {});
  }, []);

  const valor = (key) => {
    if (!resumen) return "—";
    if (key === "total") return resumen.total;
    return resumen.porEstado?.[key] ?? 0;
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRICAS.map(({ key, label, icon: Icon, color, bg }) => (
          <Card key={key}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={cn("flex size-11 items-center justify-center rounded-lg", bg)}>
                <Icon className={cn("size-5", color)} />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">{valor(key)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actividades por prioridad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {porPrioridad.map((grupo) => (
            <div key={grupo.prioridad} className="flex items-start gap-3">
              <div className="flex w-24 shrink-0 items-center gap-2">
                <span className={cn("size-2.5 rounded-full", PRIORIDAD_DOT[grupo.prioridad])} />
                <span className="text-sm font-medium capitalize">{grupo.prioridad}</span>
                <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[11px]">
                  {grupo.actividades.length}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {grupo.actividades.length === 0 ? (
                  <span className="text-sm text-muted-foreground">—</span>
                ) : (
                  grupo.actividades.map((a) => (
                    <Badge key={a._id} variant="outline" className="font-normal">
                      {a.nombre}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
