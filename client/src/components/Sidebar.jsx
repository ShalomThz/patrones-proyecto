import { LayoutDashboard, Columns3, CalendarDays, BarChart3, ScrollText, GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "actividades", label: "Actividades", icon: LayoutDashboard },
  { id: "tablero", label: "Tablero", icon: Columns3 },
  { id: "calendario", label: "Calendario", icon: CalendarDays },
  { id: "alumnos", label: "Alumnos", icon: Users },
  { id: "reportes", label: "Reportes", icon: BarChart3 },
  { id: "bitacora", label: "Notificaciones", icon: ScrollText },
];

const PATRONES = ["Singleton", "Factory Method", "State", "Observer", "Strategy", "Decorator"];

export default function Sidebar({ vista, setVista }) {
  return (
    <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-sidebar-border">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Académico</p>
          <p className="text-[11px] text-sidebar-foreground/70">Gestor de notificaciones</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setVista(id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              vista === id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-sidebar-border">
        <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50 mb-2">
          Patrones GoF
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PATRONES.map((p) => (
            <span
              key={p}
              className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-sidebar-foreground/80"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
