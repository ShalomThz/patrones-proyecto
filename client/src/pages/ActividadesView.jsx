import { useEffect, useState, useCallback } from "react";
import { Plus, Inbox } from "lucide-react";
import { api } from "../api/client.js";
import { useNotificaciones } from "../context/NotificacionContext.jsx";
import ActividadForm from "../components/ActividadForm.jsx";
import ActividadCard from "../components/ActividadCard.jsx";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ActividadesView({ meta }) {
  const { agregarToast, recargarNotificaciones } = useNotificaciones();
  const [actividades, setActividades] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [dialogo, setDialogo] = useState(false);

  const cargar = useCallback(async () => {
    const query = filtroEstado ? `?estado=${encodeURIComponent(filtroEstado)}` : "";
    setActividades(await api.listarActividades(query));
  }, [filtroEstado]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const crear = async (datos) => {
    await api.crearActividad(datos);
    agregarToast("Actividad registrada", "ok");
    cargar();
    recargarNotificaciones();
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await api.cambiarEstado(id, estado);
      agregarToast(`Estado actualizado a "${estado}"`, "ok");
      cargar();
      recargarNotificaciones();
    } catch (err) {
      agregarToast(err.message, "error");
    }
  };

  const recordar = async (id, canal) => {
    try {
      await api.recordar(id, canal);
      agregarToast(`Recordatorio enviado por ${canal}`, "ok");
      recargarNotificaciones();
    } catch (err) {
      agregarToast(err.message, "error");
    }
  };

  const eliminar = async (id) => {
    await api.eliminarActividad(id);
    agregarToast("Actividad eliminada", "ok");
    cargar();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select
          value={filtroEstado || "todos"}
          onValueChange={(v) => setFiltroEstado(v === "todos" ? "" : v)}
        >
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            {meta.estados?.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={dialogo} onOpenChange={setDialogo}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Nueva actividad
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar actividad</DialogTitle>
              <DialogDescription>
                Crea una tarea, examen, proyecto o práctica académica.
              </DialogDescription>
            </DialogHeader>
            <ActividadForm meta={meta} onCrear={crear} onListo={() => setDialogo(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {actividades.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-accent">
            <Inbox className="size-6 text-accent-foreground" />
          </div>
          <div>
            <p className="font-medium">No hay actividades</p>
            <p className="text-sm text-muted-foreground">
              Registra tu primera actividad para empezar.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {actividades.map((a) => (
            <ActividadCard
              key={a._id}
              actividad={a}
              transiciones={meta.transiciones}
              onCambiarEstado={cambiarEstado}
              onRecordar={recordar}
              onEliminar={eliminar}
            />
          ))}
        </div>
      )}
    </div>
  );
}
