import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/db.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const usersRouter = Router();

usersRouter.use(requireAuth);

const listSchema = z.object({
  role: z.enum(["reportador", "jefe", "operario"]).optional(),
});

// GET /users?role=operario -> lista (para el picker de asignar operario en panel jefe)
usersRouter.get("/", async (req, res) => {
  const parsed = listSchema.safeParse(req.query);
  const items = await prisma.user.findMany({
    where: parsed.success && parsed.data.role ? { role: parsed.data.role } : {},
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

// GET /users/team -> operarios con conteo de incidencias activas (para pantalla "Equipo" del jefe)
usersRouter.get("/team", async (_req, res) => {
  const operarios = await prisma.user.findMany({
    where: { role: "operario" },
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

const updateMeSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
});

usersRouter.patch("/me", async (req, res) => {
  const { userId } = req as AuthedRequest;
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
