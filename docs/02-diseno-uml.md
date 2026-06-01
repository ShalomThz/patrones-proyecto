# 2. Diseño: diagramas UML y justificación de patrones

> Los diagramas usan sintaxis **Mermaid**; se renderizan en GitHub y en la
> mayoría de editores Markdown.

## 2.1 Diagrama de clases (dominio + patrones)

```mermaid
classDiagram
    %% ---- Factory Method ----
    class Actividad {
        <<abstract>>
        +nombre: string
        +descripcion: string
        +fecha: Date
        +prioridad: string
        +estado: string
        +tipo() string
        +mensajeRecordatorio() string
        +aDocumento() object
    }
    class Tarea
    class Examen
    class Proyecto
    class Practica
    class ActividadFactory {
        +crearActividad(tipo, datos) Actividad
    }
    Actividad <|-- Tarea
    Actividad <|-- Examen
    Actividad <|-- Proyecto
    Actividad <|-- Practica
    ActividadFactory ..> Actividad : crea

    %% ---- State ----
    class EstadoActividad {
        <<abstract>>
        +nombre() string
        +transicionesPermitidas() string[]
        +puedeTransicionarA(e) bool
        +esTerminal() bool
    }
    class EstadoPendiente
    class EstadoEnProgreso
    class EstadoFinalizada
    class EstadoCancelada
    EstadoActividad <|-- EstadoPendiente
    EstadoActividad <|-- EstadoEnProgreso
    EstadoActividad <|-- EstadoFinalizada
    EstadoActividad <|-- EstadoCancelada

    %% ---- Strategy ----
    class EstrategiasNotificacion {
        +pantalla(payload)
        +correo(payload)
        +bitacora(payload)
        +interno(payload)
        +enviarNotificacion(canal, payload)
    }

    %% ---- Observer ----
    class EmisorEventos {
        +emitirCambioEstado(actividad, anterior)
    }
    class Observadores {
        +notificarDocente()
        +registrarBitacora()
        +notificarAlumno()
    }
    EmisorEventos ..> Observadores : notifica
    Observadores ..> EstrategiasNotificacion : usa

    %% ---- Singleton ----
    class ConexionDB {
        -instancia: ConexionDB
        +conectar() Connection
        +estaConectado() bool
    }

    %% ---- Servicio que orquesta ----
    class ActividadService {
        +registrarActividad(datos)
        +cambiarEstado(id, estado)
    }
    ActividadService ..> ActividadFactory
    ActividadService ..> EstadoActividad : valida transicion
    ActividadService ..> EmisorEventos
```

## 2.2 Diagrama de secuencia — Cambio de estado (State + Observer + Strategy)

```mermaid
sequenceDiagram
    actor Docente
    participant UI as React (Dashboard)
    participant API as Express Route
    participant SVC as ActividadService
    participant ST as State (estados.js)
    participant OBS as Observer (emisor)
    participant STR as Strategy (estrategias)
    participant DB as MongoDB

    Docente->>UI: Selecciona "→ Finalizada"
    UI->>API: PATCH /actividades/:id/estado
    API->>SVC: cambiarEstado(id, "Finalizada")
    SVC->>ST: validarTransicion(actual, "Finalizada")
    alt Transición inválida
        ST-->>SVC: throw Error
        SVC-->>API: 400 error
        API-->>UI: muestra toast de error
    else Transición válida
        ST-->>SVC: ok
        SVC->>DB: save(estado)
        SVC->>OBS: emitirCambioEstado(actividad, anterior)
        OBS->>STR: correo / bitacora / interno / pantalla
        STR->>DB: persiste notificaciones
        SVC-->>API: actividad actualizada
        API-->>UI: 200 OK + refresca bitácora/toasts
    end
```

## 2.3 Diagrama de flujo — Registrar actividad (Factory Method)

```mermaid
flowchart TD
    A([Inicio]) --> B[Docente llena el formulario]
    B --> C{tipo válido?}
    C -- No --> E[Error: tipo no válido]
    C -- Sí --> D[crearActividad: Factory construye Tarea/Examen/Proyecto/Practica]
    D --> F[Guardar en MongoDB]
    F --> G[Strategy: enviar recordatorio en pantalla]
    G --> H[Actualizar lista y reportes]
    H --> I([Fin])
    E --> I
```

## 2.4 Diagrama de estados — Ciclo de vida de la actividad (patrón State)

```mermaid
stateDiagram-v2
    [*] --> Pendiente
    Pendiente --> EnProgreso: iniciar
    Pendiente --> Cancelada: cancelar
    EnProgreso --> Finalizada: completar
    EnProgreso --> Pendiente: regresar
    EnProgreso --> Cancelada: cancelar
    Finalizada --> [*]
    Cancelada --> [*]
    note right of Finalizada : estado terminal
    note right of Cancelada : estado terminal
```

## 2.5 Diagrama de componentes (arquitectura MERN)

```mermaid
flowchart LR
    subgraph Cliente [client/ · React]
        UI[Dashboard + Componentes]
        CTX[NotificacionContext\nObserver]
        DEC[decoradores.jsx\nDecorator HOC]
        UI --- CTX
        UI --- DEC
    end
    subgraph Servidor [server/ · Express]
        R[Rutas REST]
        S[Services]
        F[Factory]
        STT[State]
        O[Observer]
        STR[Strategy]
        R --> S --> F
        S --> STT
        S --> O --> STR
    end
    DB[(MongoDB)]
    UI -- HTTP /api --> R
    STR --> DB
    S --> DB
    Servidor -. Singleton ConexionDB .- DB
```

## 2.6 Justificación de los patrones

| Patrón | Problema que resuelve | Beneficio |
|--------|----------------------|-----------|
| **Singleton** | Evitar múltiples conexiones a MongoDB | Una sola conexión reutilizable; menos consumo de recursos |
| **Factory Method** | Crear distintos tipos de actividad sin acoplar el código a las clases concretas | Agregar un tipo nuevo = registrar una clase; el resto no cambia |
| **State** | Reglas de transición de estado dispersas en `if/switch` | Cada estado encapsula sus transiciones; reglas claras y extensibles |
| **Observer** | Notificar a varios interesados al cambiar el estado | Desacopla el "qué cambió" del "quién se entera"; se agregan observadores sin tocar el emisor |
| **Strategy** | Elegir el mecanismo de envío en tiempo de ejecución | Canales intercambiables; nuevo canal = nueva estrategia |
| **Decorator** | Añadir realce visual por prioridad sin modificar la tarjeta | Composición de componentes; responsabilidad añadida dinámicamente |
