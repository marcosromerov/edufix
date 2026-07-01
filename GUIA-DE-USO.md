# EduFix · Guía de uso

App para **gestionar incidencias edilicias** de la universidad (algo roto, un proyector que no anda, una pérdida de agua, etc.). Cada persona entra con un **rol** y ve una versión distinta de la app según lo que le toca hacer.

---

## Índice
1. [Los 3 roles](#los-3-roles)
2. [Ingresar y crear cuenta](#ingresar-y-crear-cuenta)
3. [Cuentas de prueba](#cuentas-de-prueba)
4. [Guía para el Reportador](#guía-para-el-reportador)
5. [Guía para el Jefe de departamento](#guía-para-el-jefe-de-departamento)
6. [Guía para el Operario](#guía-para-el-operario)
7. [Los estados de una incidencia](#los-estados-de-una-incidencia)
8. [Notificaciones](#notificaciones)
9. [Preguntas frecuentes](#preguntas-frecuentes)

---

## Los 3 roles

| Rol | Quién es | Qué hace |
|---|---|---|
| **Reportador** | Alumno o docente | Reporta problemas y sigue su estado |
| **Jefe de departamento** | Coordinador del área | Ve todo, prioriza y asigna a los operarios |
| **Operario** | Técnico | Resuelve las incidencias que le asignan |

**El circuito completo:**
> El **reportador** crea una incidencia → el **jefe** la ve y se la **asigna** a un **operario** → el operario la **resuelve** → el reportador recibe **avisos** en cada paso.

---

## Ingresar y crear cuenta

### Iniciar sesión
1. Abrí la app.
2. Ingresá tu **email** y **contraseña**.
3. Tocá **Ingresar**. La app te lleva directo a tu pantalla según tu rol.

### Crear una cuenta nueva (solo reportadores)
El registro desde la app es **solo para reportadores** (alumnos y docentes).
1. En la pantalla de login, tocá **"¿No tenés cuenta? Registrate"**.
2. Completá nombre, número de legajo (opcional), email y contraseña (mínimo 6 caracteres).
3. Tocá **Crear cuenta**. Entrás directo como reportador.

> **Cuentas de jefe y operario:** no se crean desde la app. Las da de alta el **administrador directamente en la base de datos**. Si necesitás una, pedísela al administrador.

> **Cerrar sesión:** Perfil → **Cerrar sesión**.

---

## Cuentas de prueba

Para probar la app hay cuentas ya creadas. **Todas usan la contraseña `password123`.**

| Rol | Email |
|---|---|
| Reportador | `reportador@edufix.com` |
| Jefe | `jefe@edufix.com` |
| Operario | `operario@edufix.com` |

> Para ver las 3 vistas distintas: entrá con una, mirá, cerrá sesión y entrá con otra.

---

## Guía para el Reportador

Tu app tiene 5 secciones abajo: **Inicio · Incidencias · Reportar · Avisos · Perfil**.

### Reportar un problema
Tenés dos formas:

**Opción A — Escaneando el QR del aula (recomendado)**
1. Andá a la pestaña **Reportar** (ícono de escáner).
2. La primera vez te pide permiso de **cámara** → aceptá.
3. Apuntá al **código QR** pegado en el aula.
4. La app reconoce el edificio y el piso → elegí la **zona exacta** (ej: "Aula 237").
5. Se abre el formulario con la **ubicación ya cargada**.

**Opción B — A mano**
1. En **Inicio** tocá **Nuevo reporte**.
2. Escribí la **ubicación**.

**Después (en ambos casos):**
3. Elegí el **tipo de incidencia** del catálogo (filtrá por departamento: Mantenimiento / IT / Seguridad). Cada tipo ya trae su prioridad.
4. Agregá **notas** si querés dar más detalle.
5. **Foto (opcional):** tocá **Adjuntar imagen** → elegí **Tomar foto** (cámara) o **Elegir de galería**.
6. Tocá **Enviar reporte**. Queda en estado **Abierto** y te lleva al detalle.

### Seguir tus reportes
- En **Incidencias** ves todos tus reportes con su estado.
- Tocá cualquiera para ver el detalle. Si tiene foto, tocá la imagen para **verla en grande**.

### Avisos
En **Avisos** te llega una notificación cada vez que tu reporte avanza (asignado, en proceso, resuelto).

---

## Guía para el Jefe de departamento

Tu app tiene: **Panel · Incidencias · Equipo · Perfil**.

### Panel
Resumen del departamento: cuántas incidencias hay **Nuevas**, **En proceso** y **Resueltas**, más las pendientes de asignar.

### Gestionar una incidencia
1. En **Incidencias** (o desde el Panel) tocá una incidencia.
2. Desde el detalle podés:
   - **Asignar operario** → elegí un técnico de la lista y tocá **Guardar cambios**. El operario recibe un aviso.
   - **Gestionar incidencia** → cambiar la **prioridad**.
   - **Rechazar** → elimina la incidencia (se le avisa al reportador).

### Equipo
En **Equipo** ves a tus operarios y cuántas incidencias activas tiene cada uno, para repartir mejor el trabajo.

---

## Guía para el Operario

Tu app tiene: **Incidencias · Avisos · Perfil**.

### Resolver una incidencia
1. En **Incidencias** ves **solo las que te asignaron**.
2. Tocá una para abrir el detalle.
3. Avanzá el estado con el botón de acción:
   - **Avanzar a "En proceso"** → cuando empezás a trabajarla.
   - **Marcar como "Finalizado"** → cuando la resolviste.
4. Si no corresponde, podés **Rechazar** la incidencia.

### Avisos
En **Avisos** te llegan las notificaciones, por ejemplo **"Te asignaron una incidencia"**.

---

## Los estados de una incidencia

| Estado | Qué significa |
|---|---|
| 🟠 **Abierto** | Recién reportada, sin resolver |
| 🔵 **En proceso** | Un operario ya está trabajando en ella |
| 🟢 **Finalizado** | Resuelta |

El estado avanza siempre en ese orden: **Abierto → En proceso → Finalizado**.

---

## Notificaciones

Se generan automáticamente:

| Cuándo | Quién la recibe | Ejemplo |
|---|---|---|
| Se asigna un operario | El **reportador** | "Técnico asignado" |
| Se asigna un operario | El **operario** | "Te asignaron una incidencia" |
| Cambia el estado | El **reportador** | "Tu reporte pasó a en proceso" |
| Se resuelve | El **reportador** | "Tu reporte fue resuelto" |

En la pestaña **Avisos** podés filtrar por **Todas** / **No leídas** y tocar **Marcar todas** para marcarlas como leídas.

---

## Preguntas frecuentes

**¿Cómo consigo una cuenta de jefe u operario?**
Esas cuentas **no se registran desde la app**: las crea el **administrador en la base de datos**. Pedísela y te la dan con tu email y contraseña.

**No me deja usar la cámara.**
La app pide permiso la primera vez. Si lo rechazaste, habilitá la cámara desde los ajustes del teléfono. Para el escáner QR hay además un modo **"Simular QR"** para demos sin cámara.

**Reporté algo y no aparece.**
Bajá a refrescar o cambiá de pestaña y volvé. Cada reporte queda asociado a tu cuenta; solo vos (y el jefe/operario correspondiente) lo ven.

**¿Puedo editar mis datos?**
Sí: **Perfil → Editar perfil** (nombre y teléfono).

---

*EduFix — App de gestión de incidencias edilicias.*
