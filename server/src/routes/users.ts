import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/db.js";
import { requireAuth } from "../middleware/auth.js";

export const usersRouter = Router();

usersRouter.use(requireAuth);

const listSchema = z.object({
  role: z.enum(["reportador", "jefe", "operario"]).optional(),
});

// GET /users?role=operario -> lista activa (para el picker de asignar operario)
usersRouter.get("/", async (req, res) => {
  const parsed = listSchema.safeParse(req.query);
  const where: Record<string, unknown> = { status: "active" };
  if (parsed.success && parsed.data.role) where.role = parsed.data.role;
  const items = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      initials: true,
      role: true,
      department: true,
      jobTitle: true,
    },
    orderBy: { name: "asc" },
  });
  res.json(items);
});

// GET /users/team -> operarios activos con conteo de incidencias (pantalla "Equipo")
usersRouter.get("/team", async (_req, res) => {
  const operarios = await prisma.user.findMany({
    where: { role: "operario", status: "active" },
    select: {
      id: true,
      name: true,
      initials: true,
      jobTitle: true,
      _count: {
        select: {
          assignedIncidents: {
            where: { status: { in: ["abierto", "en_proceso"] } },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });
  res.json(
    operarios.map((u) => ({
      id: u.id,
      name: u.name,
      initials: u.initials,
      role: u.jobTitle ?? "Operario",
      activeIncidents: u._count.assignedIncidents,
    })),
  );
});

// GET /users/pending -> operarios pendientes de aprobación (solo jefe)
usersRouter.get("/pending", async (req, res) => {
  if (req.role !== "jefe") {
    res.status(403).json({ error: "Solo jefes pueden ver solicitudes pendientes" });
    return;
  }
  const pending = await prisma.user.findMany({
    where: { role: "operario", status: "pending" },
    select: {
      id: true,
      name: true,
      initials: true,
      email: true,
      department: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });
  res.json(pending);
});

// POST /users/:id/approve -> jefe aprueba un operario pendiente
usersRouter.post("/:id/approve", async (req, res) => {
  if (req.role !== "jefe") {
    res.status(403).json({ error: "Solo jefes pueden aprobar operarios" });
    return;
  }
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user || user.role !== "operario" || user.status !== "pending") {
    res.status(404).json({ error: "Solicitud no encontrada" });
    return;
  }
  await prisma.user.update({
    where: { id: req.params.id },
    data: { status: "active" },
  });
  res.json({ ok: true });
});

// DELETE /users/:id/reject -> jefe rechaza y elimina al operario pendiente
usersRouter.delete("/:id/reject", async (req, res) => {
  if (req.role !== "jefe") {
    res.status(403).json({ error: "Solo jefes pueden rechazar operarios" });
    return;
  }
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user || user.role !== "operario" || user.status !== "pending") {
    res.status(404).json({ error: "Solicitud no encontrada" });
    return;
  }
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

const updateMeSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
});

usersRouter.patch("/me", async (req, res) => {
  const userId = req.userId!;
  const parsed = updateMeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const user = await prisma.user.update({
    where: { id: userId },
    data: parsed.data,
  });
  const { passwordHash: _ph, ...safe } = user;
  res.json(safe);
});
