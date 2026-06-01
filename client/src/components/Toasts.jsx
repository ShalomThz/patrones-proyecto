import { Bell, CheckCircle2, XCircle, X } from "lucide-react";
import { useNotificaciones } from "../context/NotificacionContext.jsx";
import { cn } from "@/lib/utils";

const ICONO = { ok: CheckCircle2, error: XCircle, pantalla: Bell, info: Bell };
const ACENTO = {
  ok: "text-emerald-500",
  error: "text-destructive",
  pantalla: "text-primary",
  info: "text-primary",
};

/** Notificación en pantalla (toast/alerta en el navegador). */
export default function Toasts() {
  const { toasts, quitarToast } = useNotificaciones();
  return (
    <div className="fixed bottom-5 right-5 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const Icono = ICONO[t.tipo] || Bell;
        return (
          <div
            key={t.id}
            className="flex animate-toast-in items-start gap-3 rounded-xl border bg-card p-3.5 shadow-lg"
          >
            <Icono className={cn("mt-0.5 size-5 shrink-0", ACENTO[t.tipo])} />
            <p className="flex-1 text-sm leading-snug">{t.mensaje}</p>
            <button
              onClick={() => quitarToast(t.id)}
              className="rounded-md p-0.5 text-muted-foreground hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
