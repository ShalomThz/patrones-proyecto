import { useEffect, useState, useCallback } from "react";
import { UserPlus, Trash2, Mail, Users } from "lucide-react";
import { api } from "../api/client.js";
import { useNotificaciones } from "../context/NotificacionContext.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const inicial = { nombre: "", correo: "" };

export default function AlumnosView() {
  const { agregarToast } = useNotificaciones();
  const [alumnos, setAlumnos] = useState([]);
  const [form, setForm] = useState(inicial);
  const [enviando, setEnviando] = useState(false);

  const cargar = useCallback(async () => {
    setAlumnos(await api.listarAlumnos());
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const crear = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await api.crearAlumno(form);
      setForm(inicial);
      agregarToast("Alumno agregado", "ok");
      cargar();
    } catch (err) {
      agregarToast(err.message, "error");
    } finally {
      setEnviando(false);
    }
  };

  const alternarActivo = async (alumno) => {
    try {
      await api.actualizarAlumno(alumno._id, { activo: !alumno.activo });
      cargar();
    } catch (err) {
      agregarToast(err.message, "error");
    }
  };

  const eliminar = async (id) => {
    try {
      await api.eliminarAlumno(id);
      agregarToast("Alumno eliminado", "ok");
      cargar();
    } catch (err) {
      agregarToast(err.message, "error");
    }
  };

  const activos = alumnos.filter((a) => a.activo).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
      {/* Alta de alumno */}
      <Card className="h-fit">
        <CardContent className="p-5">
          <h3 className="flex items-center gap-2 font-semibold">
            <UserPlus className="size-4" />
            Nuevo alumno
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            A los alumnos activos les llegan las notificaciones por correo y
            mensaje interno.
          </p>
          <form onSubmit={crear} className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                placeholder="Ej. Ana López"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Correo</Label>
              <Input
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                required
                placeholder="ana.lopez@escuela.edu"
              />
            </div>
            <Button type="submit" className="w-full" disabled={enviando}>
              {enviando ? "Agregando…" : "Agregar alumno"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de alumnos */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" />
          {alumnos.length} alumno(s) · {activos} activo(s)
        </div>

        {alumnos.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent">
              <Users className="size-6 text-accent-foreground" />
            </div>
            <div>
              <p className="font-medium">Aún no hay alumnos</p>
              <p className="text-sm text-muted-foreground">
                Agrega destinatarios para que reciban los recordatorios.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y rounded-xl border bg-card">
            {alumnos.map((a) => (
              <div key={a._id} className="flex items-center gap-3 p-4">
                <div className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Mail className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{a.nombre}</p>
                  <p className="truncate text-sm text-muted-foreground">{a.correo}</p>
                </div>
                <button onClick={() => alternarActivo(a)} title="Activar / desactivar">
                  <Badge
                    className={cn(
                      "border-transparent",
                      a.activo
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    {a.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  onClick={() => eliminar(a._id)}
                  title="Eliminar"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
