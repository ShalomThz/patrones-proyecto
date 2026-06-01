import NotificacionesBucket from "./NotificacionesBucket.jsx";

export default function Topbar({ titulo, subtitulo, children }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-8">
      <div>
        <h1 className="text-lg font-semibold leading-tight">{titulo}</h1>
        {subtitulo && <p className="text-xs text-muted-foreground">{subtitulo}</p>}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <NotificacionesBucket />
      </div>
    </header>
  );
}
