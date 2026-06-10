# Edufix - imagen unica que sirve web + API
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Copiar todo el repo
COPY . .

# 1) Instalar deps del cliente Expo y bundlear el web (root package.json)
RUN npm install --legacy-peer-deps --no-audit --no-fund
RUN npm run build:web
RUN ls -la dist/index.html

# 2) Instalar deps del server, generar Prisma Client, compilar TS
WORKDIR /app/server
RUN npm install --no-audit --no-fund
RUN npx prisma generate
RUN npm run build

# --- Runtime ---
FROM node:22-bookworm-slim
WORKDIR /app

# Copiar el bundle del web (necesario para que el server lo sirva)
COPY --from=builder /app/dist ./dist

# Copiar el server compilado y sus deps
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/package.json ./server/package.json
COPY --from=builder /app/server/prisma ./server/prisma

WORKDIR /app/server

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
