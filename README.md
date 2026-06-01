# Gestión de Notificaciones y Recordatorios Académicos

Aplicación web **full-stack (MERN)** para que un docente registre actividades
académicas (tareas, exámenes, proyectos y prácticas), gestione su estado y
genere recordatorios por distintos mecanismos. El proyecto aplica **6 patrones
de diseño GoF** para mejorar la reutilización, organización y mantenibilidad.

> Proyecto Integrador · Patrones de Diseño · Stack MERN (MongoDB, Express, React, Node).

---

## Tabla de contenidos
- [Stack tecnológico](#stack-tecnológico)
- [Patrones de diseño implementados](#patrones-de-diseño-implementados)
- [Arquitectura y estructura de carpetas](#arquitectura-y-estructura-de-carpetas)
- [Interfaz de usuario](#interfaz-de-usuario)
- [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
- [API REST](#api-rest)
- [Documentación adicional](#documentación-adicional)

---

## Stack tecnológico

| Capa | Tecnología | Descripción |
|------|-----------|-------------|
| Frontend | React.js (Vite) | Interfaz con componentes reutilizables |
| UI / Estilos | Tailwind CSS + shadcn/ui (Radix UI) | Componentes accesibles y diseño responsivo |
| Iconografía | lucide-react | Íconos vectoriales (sin emojis) |
| Cliente HTTP | axios | Consumo de la API REST |
| Backend | Node.js + Express.js | API REST para lógica y datos |
| Base de datos | MongoDB (Mongoose) | Almacenamiento de actividades y notificaciones |
| Control de versiones | Git + GitHub | Historial del proyecto |

---

## Patrones de diseño implementados

| # | Patrón | Tipo | Dónde | Archivo |
|---|--------|------|-------|---------|
| 1 | **Singleton** | Creacional | Conexión única a MongoDB | `server/src/config/db.js` |
| 2 | **Factory Method** | Creacional | Creación de actividades según su tipo | `server/src/patterns/factory/actividadFactory.js` |
| 3 | **State** | Comportamiento | Transiciones válidas de estado de la actividad | `server/src/patterns/state/estados.js` |
| 4 | **Observer** | Comportamiento | Notificar a Docente, Bitácora y Alumno al cambiar de estado | `server/src/patterns/observer/emisorEventos.js` |
| 5 | **Strategy** | Comportamiento | Mecanismo de envío de notificación (pantalla, correo, bitácora, interno) | `server/src/patterns/strategy/estrategiasNotificacion.js` |
| 6 | **Decorator** | Estructural | HOC de React que realza la tarjeta según prioridad | `client/src/utils/decoradores.jsx` |

Cada patrón está comentado en su archivo con la cabecera `PATRON N: ...`.

### Cómo colaboran los patrones
Al **cambiar el estado** de una actividad (`PATCH /api/actividades/:id/estado`):
1. **State** valida que la transición sea permitida (p. ej. `Finalizada` es terminal).
2. **Observer** emite el evento `estadoCambiado` y notifica a 3 observadores.
3. Cada observador usa **Strategy** para enviar por su canal (correo / bitácora / interno / pantalla).
4. El frontend muestra los toasts (Observer vía React Context) y la **Decorator** realza las tarjetas de alta prioridad.

---

## Arquitectura y estructura de carpetas

```
proyecto-patrones/
├── client/                     # Frontend React (Vite + Tailwind + shadcn/ui)
│   └── src/
│       ├── components/
│       │   ├── ui/             # Primitivos shadcn (button, card, select, dialog, popover…)
│       │   ├── Sidebar.jsx     # Navegación lateral
│       │   ├── Topbar.jsx      # Barra superior
│       │   ├── NotificacionesBucket.jsx  # Campana + panel de pendientes
│       │   ├── ActividadForm.jsx · ActividadCard.jsx · Toasts.jsx
│       ├── pages/              # Vistas: Actividades, Tablero, Calendario, Reportes, Notificaciones
│       ├── context/            # NotificacionContext (Observer / estado global)
│       ├── utils/              # decoradores.jsx (Decorator HOC)
│       ├── lib/                # utils (cn) + constantes de presentación
│       └── api/                # cliente axios de la API
│
└── server/                     # Backend Node.js + Express
    ├── src/
    │   ├── config/db.js        # Singleton (conexión MongoDB)
    │   ├── models/             # Modelos Mongoose (Actividad, Notificacion)
    │   ├── routes/             # Endpoints REST (wiring)
    │   ├── controllers/        # Manejan req/res y delegan a services
    │   ├── services/           # Lógica de negocio + reportes (orquesta patrones)
    │   ├── patterns/
    │   │   ├── factory/        # Factory Method + clases concretas
    │   │   ├── state/          # Patrón State (estados y transiciones)
    │   │   ├── observer/       # EventEmitter (Observer)
    │   │   └── strategy/       # Estrategias de notificación
    │   └── app.js              # Configuración de Express
    ├── seed.js                 # Datos de ejemplo
    └── server.js               # Punto de entrada (arranque)
```

---

## Interfaz de usuario

Dashboard con **sidebar** de navegación, **topbar** y un **bucket de notificaciones**
(campana con contador de pendientes que abre un panel para marcarlas como leídas).
Incluye cinco vistas:

| Vista | Descripción |
|-------|-------------|
| **Actividades** | Tarjetas con filtro por estado y alta mediante un modal (*Nueva actividad*) |
| **Tablero** | Kanban con columnas por estado y **arrastrar-y-soltar** para cambiar de estado (valida la transición con el patrón State) |
| **Calendario** | Cuadrícula mensual que ubica cada actividad en su fecha límite |
| **Reportes** | Métricas (total, pendientes, finalizadas, canceladas) y desglose por prioridad |
| **Notificaciones** | Bitácora de eventos filtrable por canal de envío |

La UI usa **shadcn/ui** (componentes sobre Radix UI) en `client/src/components/ui/` e
íconos de **lucide-react**.

---

## Cómo ejecutar el proyecto

### Inicio rápido (TL;DR)
```bash
# 1. Clonar e instalar
git clone <url-del-repo> && cd proyecto-patrones
npm run install:all

# 2. Configurar el backend
cd server && cp .env.example .env && cd ..

# 3. (Opcional) Datos de ejemplo
npm run seed

# 4. Levantar API y UI (en dos terminales)
npm run server     # Terminal 1 → http://localhost:4000
npm run client     # Terminal 2 → http://localhost:5173
```
Luego abre **http://localhost:5173** en el navegador.

### Requisitos
- Node.js 18+
- MongoDB en ejecución local (`mongodb://127.0.0.1:27017`) o una URI propia.
  Arráncalo con `sudo systemctl start mongod` (Linux), la app *MongoDB* (macOS/Windows)
  o `docker run -d -p 27017:27017 mongo`.

### 1. Instalar dependencias
```bash
npm run install:all
# o por separado:
#   cd server && npm install
#   cd client && npm install
```

### 2. Configurar variables de entorno
```bash
# Backend
cd server && cp .env.example .env      # ajusta MONGO_URI / PORT si es necesario

# Frontend (opcional)
cd client && cp .env.example .env      # define VITE_API_URL solo si NO usas el proxy
```

| Variable | Dónde | Descripción |
|----------|-------|-------------|
| `MONGO_URI` | `server/.env` | Cadena de conexión a MongoDB |
| `PORT` | `server/.env` | Puerto del backend (por defecto `4000`) |
| `VITE_API_URL` | `client/.env` | URL base de la API. Vacía → usa `/api` (proxy de Vite). En producción apunta al backend, p. ej. `https://mi-dominio.com/api` |

### 3. (Opcional) Cargar datos de ejemplo
```bash
npm run seed            # desde la raíz
```

### 4. Levantar la aplicación
Asegúrate de que **MongoDB esté corriendo** y, en dos terminales, ejecuta:
```bash
npm run server          # Terminal 1 → API en http://localhost:4000
npm run client          # Terminal 2 → UI  en http://localhost:5173
```
El frontend hace *proxy* de `/api` hacia el backend, así que basta con abrir
**http://localhost:5173**.

Para comprobar que la API responde:
```bash
curl http://localhost:4000/api/health    # → {"ok":true,"db":true}
```

### Scripts disponibles (desde la raíz)
| Comando | Acción |
|---------|--------|
| `npm run install:all` | Instala dependencias de `server/` y `client/` |
| `npm run server` | Inicia el backend (Express) |
| `npm run client` | Inicia el frontend (Vite) |
| `npm run seed` | Carga actividades de ejemplo en la base de datos |

> En Windows, si `npm run dev` (que usa `&`) no funciona, abre dos terminales y
> ejecuta `npm run server` y `npm run client` por separado.

---

## API REST

Base: `http://localhost:4000/api`

Todas las respuestas son JSON. Las rutas devuelven `GET /api/health` →
`{ "ok": true, "db": true }` para verificar el estado del servicio.

### Actividades
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/actividades/meta` | Tipos, estados, prioridades y transiciones válidas |
| GET | `/actividades?estado=&tipo=&prioridad=` | Listar (con filtros) |
| GET | `/actividades/:id` | Obtener una |
| POST | `/actividades` | Registrar (usa Factory Method) |
| PUT | `/actividades/:id` | Actualizar campos |
| PATCH | `/actividades/:id/estado` | Cambiar estado (State + Observer) |
| POST | `/actividades/:id/recordar` | Enviar recordatorio por un canal (Strategy) |
| DELETE | `/actividades/:id` | Eliminar |

### Notificaciones
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/notificaciones?canal=` | Listar (bitácora, correo, pantalla, interno) |
| POST | `/notificaciones` | Enviar una notificación (Strategy) |
| PATCH | `/notificaciones/:id/leida` | Marcar como leída |

### Reportes
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/reportes/pendientes` | Actividades pendientes |
| GET | `/reportes/finalizadas` | Actividades finalizadas |
| GET | `/reportes/prioridad` | Actividades agrupadas por prioridad |
| GET | `/reportes/resumen` | Conteos por estado |

### Manejo de errores
Los errores se devuelven como JSON `{ "error": "mensaje" }` con el código HTTP adecuado:

| Código | Caso |
|--------|------|
| `400` | Datos inválidos, `id` mal formado o transición de estado no permitida (patrón State) |
| `404` | Recurso o ruta no encontrada |
| `500` | Error interno del servidor |

---

## Documentación adicional
Sigue los pasos planteados originalmente para el proyecto:

1. **Leer el documento del proyecto** → requisitos extraídos del PDF.
2. **Hacer enunciados (requerimientos)** → [`docs/01-analisis.md`](docs/01-analisis.md)
3. **Diagramas de flujo** → [`docs/02-diseno-uml.md`](docs/02-diseno-uml.md)
4. **Modelar** → diagrama de clases y modelo de datos en `docs/02-diseno-uml.md`
5. **Programar** → código en `client/` y `server/`
