import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CANAL_LABEL } from "@/lib/constantes";
import { cn } from "@/lib/utils";

const inicial = {
  tipo: "tarea",
  nombre: "",
  descripcion: "",
  fecha: "",
  prioridad: "media",
  canales: ["pantalla", "interno"],
};

export default function ActividadForm({ meta, onCrear, onListo }) {
  const [form, setForm] = useState(inicial);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  // Alterna un canal en la lista de canales seleccionados de la actividad.
  const alternarCanal = (canal) =>
    setForm((prev) => ({
      ...prev,
      canales: prev.canales.includes(canal)
        ? prev.canales.filter((c) => c !== canal)
        : [...prev.canales, canal],
    }));

  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await onCrear(form);
      setForm(inicial);
      onListo?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={enviar} className="space-y-4">
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Tipo</Label>
          <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
            <SelectTrigger className="capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {meta.tipos?.map((t) => (
                <SelectItem key={t} value={t} className="capitalize">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Prioridad</Label>
          <Select value={form.prioridad} onValueChange={(v) => setForm({ ...form, prioridad: v })}>
            <SelectTrigger className="capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {meta.prioridades?.map((p) => (
                <SelectItem key={p} value={p} className="capitalize">
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Nombre</Label>
        <Input
          value={form.nombre}
          onChange={cambiar("nombre")}
          required
          placeholder="Ej. Tarea de Algoritmos"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Descripción</Label>
        <Textarea
          value={form.descripcion}
          onChange={cambiar("descripcion")}
          placeholder="Detalle breve del contenido o instrucciones"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Fecha límite</Label>
        <Input type="date" value={form.fecha} onChange={cambiar("fecha")} required />
      </div>

      <div className="space-y-1.5">
        <Label>Canales de notificación</Label>
        <div className="flex flex-wrap gap-2">
          {(meta.canales || ["pantalla", "correo", "interno"]).map((canal) => {
            const activo = form.canales.includes(canal);
            return (
              <button
                key={canal}
                type="button"
                onClick={() => alternarCanal(canal)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  activo
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background text-muted-foreground hover:bg-accent"
                )}
              >
                {activo && <Check className="size-3" />}
                {CANAL_LABEL[canal] || canal}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Correo y mensaje interno se envían a cada alumno activo. La bitácora se
          registra siempre de forma automática.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={enviando}>
        {enviando ? "Registrando…" : "Registrar actividad"}
      </Button>
    </form>
  );
}
