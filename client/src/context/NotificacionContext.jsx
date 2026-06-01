import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { api } from "../api/client.js";

/**
 * Observer en el frontend (React Context):
 * El contexto actua como "sujeto"; los componentes suscritos se re-renderizan
 * automaticamente cuando cambian los toasts o las notificaciones pendientes.
 *
 * Responsabilidades:
 *  - Mantener la lista de notificaciones (polling al backend cada 3s).
 *  - Exponer las "pendientes" (sin leer) para el bucket de la campana.
 *  - Disparar toasts cuando llegan notificaciones nuevas de canal "pantalla".
 */
const NotificacionContext = createContext(null);

// Canales que se consideran "notificaciones" para el usuario (la bitacora es log).
const CANALES_BUCKET = ["pantalla", "correo", "interno"];

export function NotificacionProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const vistos = useRef(new Set()); // ids ya "toasteados"
  const primeraCarga = useRef(true);

  const agregarToast = useCallback((mensaje, tipo = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  const quitarToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Trae todas las notificaciones y dispara toasts para las nuevas de pantalla.
  const cargar = useCallback(async () => {
    try {
      const data = await api.listarNotificaciones();
      setNotificaciones(data);

      const nuevasPantalla = data.filter((n) => n.canal === "pantalla" && !vistos.current.has(n._id));
      if (primeraCarga.current) {
        // En la primera carga solo registramos el historial, sin toasts masivos.
        data.forEach((n) => vistos.current.add(n._id));
        primeraCarga.current = false;
      } else {
        nuevasPantalla.forEach((n) => {
          vistos.current.add(n._id);
          agregarToast(n.mensaje, "pantalla");
        });
      }
    } catch {
      /* el backend puede no estar arriba todavia */
    }
  }, [agregarToast]);

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 3000);
    return () => clearInterval(intervalo);
  }, [cargar]);

  // Notificaciones pendientes (sin leer) que van al bucket.
  const pendientes = notificaciones.filter(
    (n) => !n.leida && CANALES_BUCKET.includes(n.canal)
  );

  const marcarLeida = useCallback(async (id) => {
    setNotificaciones((prev) => prev.map((n) => (n._id === id ? { ...n, leida: true } : n)));
    try {
      await api.marcarLeida(id);
    } catch {
      /* se revierte en la proxima carga si falla */
    }
  }, []);

  const marcarTodasLeidas = useCallback(async () => {
    const ids = pendientes.map((n) => n._id);
    setNotificaciones((prev) =>
      prev.map((n) => (ids.includes(n._id) ? { ...n, leida: true } : n))
    );
    await Promise.allSettled(ids.map((id) => api.marcarLeida(id)));
  }, [pendientes]);

  return (
    <NotificacionContext.Provider
      value={{
        toasts,
        agregarToast,
        quitarToast,
        notificaciones,
        pendientes,
        contadorPendientes: pendientes.length,
        marcarLeida,
        marcarTodasLeidas,
        recargarNotificaciones: cargar,
      }}
    >
      {children}
    </NotificacionContext.Provider>
  );
}

export function useNotificaciones() {
  const ctx = useContext(NotificacionContext);
  if (!ctx) throw new Error("useNotificaciones debe usarse dentro de NotificacionProvider");
  return ctx;
}
