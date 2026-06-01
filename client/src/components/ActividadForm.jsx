import { useState } from "react";
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

const inicial = {
  tipo: "tarea",
  nombre: "",
  descripcion: "",
  fecha: "",
  prioridad: "media",
};

export default function ActividadForm({ meta, onCrear, onListo }) {
  const [form, setForm] = useState(inicial);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

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

      <Button type="submit" className="w-full" disabled={enviando}>
        {enviando ? "Registrando…" : "Registrar actividad"}
      </Button>
    </form>
  );
}
