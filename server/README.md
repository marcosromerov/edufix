# Edufix API

Backend Express + Prisma + PostgreSQL para la app Edufix.

## Setup local

```bash
cd server
npm install
cp .env.example .env
# Editar .env y poner DATABASE_URL real (de Railway) + JWT_SECRET
npm run prisma:migrate   # crea las tablas
npm run seed             # carga datos de ejemplo
npm run dev              # http://localhost:3000
```

## Railway: paso a paso

1. **Abrí Railway** → https://railway.app → tu dashboard.
2. **New Project** → **Empty Project** (no uses template).
3. Dentro del proyecto, **+ Create** → **Database** → **Add PostgreSQL**.
   - Railway crea automáticamente el servicio Postgres y expone `DATABASE_URL` como variable.
4. **+ Create** → **GitHub Repo** (o "Deploy from Local Directory" si no usás GitHub):
   - Conectá el repo `edufix`.
   - En **Settings** → **Root Directory**, poné: `server`
   - En **Settings** → **Build Command**: `npm install && npx prisma generate && npm run build`
   - En **Settings** → **Start Command**: `npx prisma migrate deploy && npm start`
5. En el servicio del API, **Variables** → **Reference** → seleccionar el plugin Postgres → `DATABASE_URL` queda linkeado automáticamente.
6. Agregar variable manual: `JWT_SECRET` = un string random largo (ej: `openssl rand -base64 32`).
7. **Networking** → **Generate Domain** → vas a obtener una URL pública tipo `https://edufix-api.up.railway.app`.

## Endpoints

### Auth (público)
- `POST /auth/register` — crea usuario, devuelve `{ user, accessToken, refreshToken }`
- `POST /auth/login` — `{ email, password }` → `{ user, accessToken, refreshToken }`
- `POST /auth/refresh` — `{ refreshToken }` → `{ accessToken }`
- `POST /auth/logout` — invalida refresh tokens (requiere auth)
- `GET /auth/me` — devuelve el user actual (requiere auth)

### Incidents (auth)
- `GET /incidents?status=&department=&scope=mine|assigned|all`
- `GET /incidents/:id`
- `POST /incidents` — body: `{ title, location, building?, type, priority, department, description }`
- `PATCH /incidents/:id` — body parcial: `{ status?, priority?, assigneeId?, isNew? }`

### Notifications (auth)
- `GET /notifications`
- `PATCH /notifications/:id/read`
- `POST /notifications/read-all`

### Users (auth)
- `GET /users?role=operario`
- `GET /users/team` — operarios con conteo de incidencias activas
- `PATCH /users/me` — body parcial: `{ name?, phone?, jobTitle? }`

## Roles y permisos

- **reportador**: ve solo sus incidencias, puede crear nuevas. No puede modificar.
- **operario**: ve las incidencias asignadas, puede cambiar status de las propias.
- **jefe**: ve todas, puede asignar operario y cambiar prioridad/status.

## Cuentas de seed

Todas con password `password123`:
- `a.moreno@uade.edu` (reportador)
- `j.medina@uade.edu` (jefe)
- `r.mendez@uade.edu` (operario)
- `c.mendoza@uade.edu` (operario)
- `e.rivas@uade.edu` (operario)
