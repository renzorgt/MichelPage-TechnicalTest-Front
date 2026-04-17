# MichelPage Technical Test — Frontend

Aplicación Angular 17 para gestión de tareas, desarrollada como prueba técnica. Consume una API REST en .NET.

---

## Requisitos Previos

Antes de ejecutar el proyecto asegúrate de tener instalado:

| Herramienta | Versión recomendada |
|---|---|
| Node.js | 18 o superior |
| npm | 9 o superior |
| Angular CLI | 17 (`npm install -g @angular/cli`) |

---

## Configuración de la API

El frontend apunta a la API del backend mediante un archivo de entorno ubicado en:

```
src/environments/environment.ts
src/environments/environment.development.ts
```

Por defecto, la URL base configurada es:

```ts
apiBase: 'https://localhost:7014/api/'
```

> [!IMPORTANT]
> Si el backend corre en un puerto o host diferente, debes actualizar la propiedad `apiBase` en ambos archivos de entorno **antes de levantar el frontend**.

---

## Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el servidor de desarrollo
ng serve -o
```

La aplicación abrirá automáticamente en `http://localhost:4200`.

---

## Funcionalidades Disponibles

### Autenticación
- Iniciar sesión con correo y contraseña (validado contra la base de datos).
- Crear nuevo usuario desde la pantalla de login.

### Gestión de Tareas
- Listar todas las tareas con paginación y ordenamiento.
- Filtrar por **estado** (`Pending`, `InProgress`, `Done`) y por **texto libre**.
- Crear nueva tarea (Título, Usuario Asignado, Prioridad, Fecha Estimada, Descripción).
- Cambiar estado de una tarea: `Pending → InProgress → Done`.
- Eliminar tareas con confirmación (solo si no están en estado `Done`).
- Crear nuevo usuario directamente desde el Task Manager.

---

## Estados de Tarea

| Valor en BD | Descripción |
|---|---|
| `Pending` | Tarea pendiente de iniciar |
| `InProgress` | Tarea en curso |
| `Done` | Tarea completada (no editable ni eliminable) |

---

## Notas Técnicas

- El campo `informacion` de la tarea almacena un JSON con `prioridad`, `fechaEstimada` y `descripcion`.
- Las notificaciones de error y confirmación usan **SweetAlert2**.
- El proyecto es **standalone** (Angular 17+), no usa `NgModule`.
