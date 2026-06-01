# 1. Análisis: problema, requerimientos y alcance

## 1.1 Descripción del problema
Un docente necesita una aplicación web sencilla para gestionar actividades
académicas (tareas, exámenes, proyectos y prácticas) y enviar recordatorios a
los estudiantes. Hoy las actividades se registran manualmente, lo que dificulta
el seguimiento y la notificación oportuna.

## 1.2 Requerimientos funcionales (enunciados)

| ID | Requerimiento | Cómo se cumple |
|----|---------------|----------------|
| RF1 | Registrar actividades académicas | Formulario + `POST /api/actividades` (Factory Method) |
| RF2 | Clasificar las actividades por tipo | Tipos: `tarea`, `examen`, `proyecto`, `practica` (Factory Method) |
| RF3 | Cambiar el estado de una actividad | `PATCH /api/actividades/:id/estado` (State valida la transición) |
| RF4 | Generar notificaciones | Observer emite eventos al cambiar de estado |
| RF5 | Aplicar distintos mecanismos de envío | Strategy: pantalla, correo, bitácora, mensaje interno |
| RF6 | Generar reportes básicos | `GET /api/reportes/*` (pendientes, finalizadas, por prioridad) |

### Datos mínimos de una actividad
- **Nombre**: identificador de la actividad.
- **Descripción**: detalle breve.
- **Fecha**: fecha límite o de realización.
- **Prioridad**: `baja`, `media`, `alta`, `critica`.
- **Estado**: `Pendiente`, `En progreso`, `Finalizada`, `Cancelada`.

### Mecanismos de notificación (simulados)
- Notificación en pantalla (toast en el navegador).
- Correo electrónico simulado (registro visual).
- Bitácora de eventos (log visible).
- Mensaje interno (sección de mensajes).

### Reportes
- Actividades pendientes.
- Actividades finalizadas.
- Actividades organizadas por prioridad.

## 1.3 Requerimientos no funcionales
- **RNF1 – Mantenibilidad:** uso de patrones de diseño GoF que aíslan la
  creación de objetos, los algoritmos de notificación y las reglas de estado.
- **RNF2 – Reutilización:** componentes React reutilizables y HOC (Decorator).
- **RNF3 – Separación de capas:** cliente (React) y servidor (Express) separados;
  el servidor separa modelos, rutas, servicios y patrones.
- **RNF4 – Persistencia:** MongoDB mediante Mongoose, con una única conexión
  (Singleton).
- **RNF5 – Portabilidad:** API REST consumible por cualquier cliente.

## 1.4 Alcance
Aplicación full-stack MERN con una única entidad principal (Actividad) y una
entidad de apoyo (Notificación). Los envíos (correo, etc.) son **simulados** y
se registran/visualizan en la interfaz. No incluye autenticación de usuarios ni
envío real de correos, por estar fuera del alcance del proyecto integrador.

## 1.5 Actores
- **Docente:** registra actividades, cambia estados y consulta reportes.
- **Alumno (observador):** destinatario de las notificaciones simuladas.
- **Sistema/Bitácora (observador):** registra todos los eventos.
