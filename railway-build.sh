#!/bin/bash
# Build script para Railway: compila el web del cliente y el server.
# Usa caches npm aisladas por step para evitar "Tracker idealTree already exists"
# que se dispara cuando npm comparte estado entre invocaciones consecutivas.

set -e

echo "==> Limpiando node_modules raiz (puede tener estado stale del install step)"
rm -rf /app/node_modules

echo "==> Instalando deps del cliente Expo"
cd /app
NPM_CONFIG_CACHE=/tmp/npm-cache-root npm install --legacy-peer-deps --no-audit --no-fund

echo "==> Bundleando el web (expo export)"
npm run build:web

echo "==> Verificando que /app/dist/index.html existe"
ls -la /app/dist/index.html

echo "==> Re-instalando deps del server (su node_modules quedo intacto pero por las dudas)"
cd /app/server
NPM_CONFIG_CACHE=/tmp/npm-cache-server npm install --no-audit --no-fund

echo "==> Generando Prisma Client"
npx prisma generate

echo "==> Compilando server (tsc)"
npm run build

echo "==> Build completo"
