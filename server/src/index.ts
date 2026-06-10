import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { authRouter } from "./routes/auth.js";
import { incidentsRouter } from "./routes/incidents.js";
import { notificationsRouter } from "./routes/notifications.js";
import { usersRouter } from "./routes/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.use("/auth", authRouter);
app.use("/incidents", incidentsRouter);
app.use("/notifications", notificationsRouter);
app.use("/users", usersRouter);

// Servir el web bundle (Expo web export) si existe.
// En Railway: cwd /app/server, __dirname compilado /app/server/dist,
// asi que el bundle del web esta dos niveles arriba: /app/dist
const webDist = path.resolve(__dirname, "..", "..", "dist");
const webIndex = path.join(webDist, "index.html");
const webBundleExists = fs.existsSync(webIndex);

const apiPrefixes = ["/auth", "/incidents", "/notifications", "/users", "/health"];
function isApiPath(p: string): boolean {
  return apiPrefixes.some(prefix => p === prefix || p.startsWith(prefix + "/"));
}

if (webBundleExists) {
  console.log(`[edufix] serving web bundle from ${webDist}`);
  app.use(express.static(webDist));

  // Catch-all SPA fallback: cualquier ruta que no haya matcheado API ni un asset
  // estatico devuelve index.html para que expo-router maneje la ruta en el cliente.
  app.use((req, res, next) => {
    if (isApiPath(req.path)) return next();
    res.sendFile(webIndex);
  });
} else {
  console.log("[edufix] web bundle not found, running in API-only mode");
}

// 404 final (solo se llega aca si no hay web bundle, o si la ruta es API y no match)
app.use((req, res) => {
  if (isApiPath(req.path) || !webBundleExists) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("[error]", err);
    res.status(500).json({ error: "Internal server error" });
  },
);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`[edufix-api] listening on http://localhost:${port}`);
});
