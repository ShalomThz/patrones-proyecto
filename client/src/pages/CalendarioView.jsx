import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../api/client.js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ESTADO_BADGE } from "@/lib/constantes";
import { cn } from "@/lib/utils";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const pad = (n) => String(n).padStart(2, "0");
const claveDia = (anio, mes, dia) => `${anio}-${pad(mes + 1)}-${pad(dia)}`;
const hoyClave = claveDia(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

export default function CalendarioView() {
  const [ref, setRef] = useState(() => new Date());
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    api.listarActividades().then(setActividades).catch(() => {});
  }, []);

  const anio = ref.getFullYear();
  const mes = ref.getMonth();

  // Agrupa actividades por día (usa la fecha ISO directa para evitar desfases de zona horaria).
  const porDia = useMemo(() => {
    const mapa = {};
    for (const a of actividades) {
      const clave = String(a.fecha).slice(0, 10);
      (mapa[clave] ||= []).push(a);
    }
    return mapa;
  }, [actividades]);

  // Construye las celdas del mes (con relleno inicial para alinear el día de la semana).
  const celdas = useMemo(() => {
    const primerDiaSemana = new Date(anio, mes, 1).getDay();
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < primerDiaSemana; i++) arr.push(null);
    for (let d = 1; d <= diasEnMes; d++) arr.push(d);
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [anio, mes]);

  const cambiarMes = (delta) => setRef(new Date(anio, mes + delta, 1));

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b px-5 py-4">
        <h2 className="text-base font-semibold">
          {MESES[mes]} {anio}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setRef(new Date())}>
            Hoy
          </Button>
          <Button variant="outline" size="icon" className="size-8" onClick={() => cambiarMes(-1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" className="size-8" onClick={() => cambiarMes(1)}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b bg-muted/40 text-center">
        {DIAS.map((d) => (
          <div key={d} className="py-2 text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {celdas.map((dia, i) => {
          if (dia === null) return <div key={i} className="min-h-[104px] border-b border-r bg-muted/20" />;
          const clave = claveDia(anio, mes, dia);
          const items = porDia[clave] || [];
          const esHoy = clave === hoyClave;
          return (
            <div key={i} className="min-h-[104px] border-b border-r p-1.5 align-top">
              <div className="mb-1 flex justify-end">
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs",
                    esHoy ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  {dia}
                </span>
              </div>
              <div className="space-y-1">
                {items.slice(0, 3).map((a) => (
                  <div
                    key={a._id}
                    title={`${a.nombre} · ${a.estado}`}
                    className={cn(
                      "truncate rounded px-1.5 py-0.5 text-[11px] font-medium",
                      ESTADO_BADGE[a.estado]
                    )}
                  >
                    {a.nombre}
                  </div>
                ))}
                {items.length > 3 && (
                  <div className="px-1.5 text-[11px] text-muted-foreground">+{items.length - 3} más</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
