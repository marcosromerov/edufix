# EduFix — Cómo correrlo en local para la demo

> El deploy de Railway (`edufix-production.up.railway.app`) está **caído** (timeout).
> Por eso se corre todo local: backend + Postgres + web.

## Requisitos (ya están en esta máquina)
- Node 18+
- PostgreSQL corriendo (acá es `postgresql@14` por Homebrew)

## 1) Base de datos
```bash
createdb edufix   # (ya creada)
```

## 2) Backend (Express + Prisma)
```bash
cd ~/edufix/server
# .env ya configurado: DATABASE_URL local, JWT_SECRET, PORT=4010
npm install
npx prisma migrate deploy   # crea tablas
npm run seed                # crea jefe + operario (password123)
npm run dev                 # http://localhost:4010
```
> Se usa el puerto **4010** porque 3000 y 3001 ya estaban ocupados por otros proyectos tuyos.

## 3) Frontend (Expo Web)
```bash
cd ~/edufix
# app.json -> extra.apiUrl apunta a http://localhost:4010
npm install
npx expo start --web --port 8082
# abrir http://localhost:8082
```

## Cuentas de prueba (password = `password123`)
- **Jefe:** `j.medina@uade.edu` (botón "Jefe" en el login)
- **Operario:** `r.mendez@uade.edu` (botón "Operario" en el login)
- **Reportador:** `a.moreno@uade.edu` (se escribe a mano, o se registra uno nuevo)

## Datos demo cargados
5 incidencias de ejemplo en distintos estados + 1 creada en vivo desde la app
("Ventana rota en Aula 503"). Notificaciones generadas automáticamente.

## Para celular (Expo Go)
`localhost` no funciona desde el teléfono. Cambiar en `app.json` el `apiUrl`
por la IP de la Mac en la red (ej: `http://192.168.0.X:4010`) y correr `npx expo start`.
