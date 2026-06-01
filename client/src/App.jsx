import { useEffect, useState } from "react";
import { api } from "./api/client.js";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import Toasts from "./components/Toasts.jsx";
import ActividadesView from "./pages/ActividadesView.jsx";
import TableroView from "./pages/TableroView.jsx";
import CalendarioView from "./pages/CalendarioView.jsx";
import AlumnosView from "./pages/AlumnosView.jsx";
import ReportesView from "./pages/ReportesView.jsx";
import NotificacionesView from "./pages/NotificacionesView.jsx";

const VISTAS = {
  actividades: {
    titulo: "Actividades",
    subtitulo: "Registra y da seguimiento a tus actividades académicas",
  },
  tablero: {
    titulo: "Tablero",
    subtitulo: "Arrastra las actividades entre columnas para cambiar su estado",
  },
  calendario: {
    titulo: "Calendario",
    subtitulo: "Actividades organizadas por fecha límite",
  },
  alumnos: {
    titulo: "Alumnos",
    subtitulo: "Gestiona los destinatarios de las notificaciones",
  },
  reportes: {
    titulo: "Reportes",
    subtitulo: "Resumen y distribución de actividades",
  },
  bitacora: {
    titulo: "Notificaciones",
    subtitulo: "Bitácora de eventos y mecanismos de envío",
  },
};

export default function App() {
  const [vista, setVista] = useState("actividades");
  const [meta, setMeta] = useState({});

  useEffect(() => {
    api.meta().then(setMeta).catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar vista={vista} setVista={setVista} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar titulo={VISTAS[vista].titulo} subtitulo={VISTAS[vista].subtitulo} />

        <main className="flex-1 p-4 md:p-8">
          {vista === "actividades" && <ActividadesView meta={meta} />}
          {vista === "tablero" && <TableroView meta={meta} />}
          {vista === "calendario" && <CalendarioView />}
          {vista === "alumnos" && <AlumnosView />}
          {vista === "reportes" && <ReportesView />}
          {vista === "bitacora" && <NotificacionesView />}
        </main>
      </div>

      <Toasts />
    </div>
  );
}
