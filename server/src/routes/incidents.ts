import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/db.js";
import { requireAuth } from "../middleware/auth.js";
import { generateIncidentCode } from "../lib/codes.js";

export const incidentsRouter = Router();

const createSchema = z.object({
  title: z.string().min(2),
  location: z.string().min(2),
  building: z.string().optional(),
  type: z.enum(["mantenimiento", "correctivo", "preventivo"]),
  priority: z.enum(["baja", "media", "alta", "critica"]),
  department: z.enum(["mantenimiento", "it", "seguridad"]),
  description: z.string().min(1),
  imageBase64: z.string().optional(),
});

const updateSchema = z.object({
  status: z.enum(["abierto", "en_proceso", "finalizado"]).optional(),
  priority: z.enum(["baja", "media", "alta", "critica"]).optional(),
  assigneeId: z.string().nullable().optional(),
  isNew: z.boolean().optional(),
});

const listQuerySchema = z.object({
  status: z.enum(["abierto", "en_proceso", "finalizado"]).optional(),
  department: z.enum(["mantenimiento", "it", "seguridad"]).optional(),
  scope: z.enum(["mine", "assigned", "all"]).optional(),
});

incidentsRouter.use(requireAuth);

incidentsRouter.get("/", async (req, res) => {
  const userId = req.userId!;
  const role = req.role!;
  const q = listQuerySchema.safeParse(req.query);
  if (!q.success) {
    res.status(400).json({ error: "Invalid query" });
    return;
  }
  const { status, department, scope } = q.data;

  // Role-based default scoping:
  // - reportador: ve solo las propias (reportadas)
  // - operario: ve las asignadas a si mismo
  // - jefe: ve todas las de su departamento
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (department) where.department = department;

  const effectiveScope =
    scope ?? (role === "jefe" ? "all" : role === "operario" ? "assigned" : "mine");

  if (effectiveScope === "mine") where.reporterId = userId;
  else if (effectiveScope === "assigned") where.assigneeId = userId;
  // "all" is for jefe; if non-jefe asks for all, fall back to mine
  if (effectiveScope === "all" && role !== "jefe") where.reporterId = userId;

  const items = await prisma.incident.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, code: true, title: true, location: true, building: true,
      type: true, status: true, priority: true, department: true,
      description: true, isNew: true, createdAt: true, updatedAt: true,
      reporterId: true, assigneeId: true,
      reporter: { select: { id: true, name: true, initials: true } },
      assignee: { select: { id: true, name: true, initials: true } },
    },
  });
  res.json(items);
});

incidentsRouter.get("/:id", async (req, res) => {
  const inc = await prisma.incident.findUnique({
    where: { id: req.params.id },
    include: {
      reporter: { select: { id: true, name: true, initials: true, email: true } },
      assignee: { select: { id: true, name: true, initials: true, email: true } },
    },
  });
  if (!inc) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(inc);
});

incidentsRouter.post("/", async (req, res) => {
  const userId = req.userId!;
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const code = await generateIncidentCode();
  const inc = await prisma.incident.create({
    data: { ...parsed.data, code, reporterId: userId, status: "abierto" },
    include: {
      reporter: { select: { id: true, name: true, initials: true } },
      assignee: { select: { id: true, name: true, initials: true } },
    },
  });
  res.status(201).json(inc);
});

incidentsRouter.delete("/:id", async (req, res) => {
  const role = req.role!;
  const userId = req.userId!;

  const inc = await prisma.incident.findUnique({ where: { id: req.params.id } });
  if (!inc) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  // Solo el operario asignado o un jefe pueden rechazar/borrar
  const isAssignedOperario = role === "operario" && inc.assigneeId === userId;
  const isJefe = role === "jefe";
  if (!isAssignedOperario && !isJefe) {
    res.status(403).json({ error: "No tenés permiso para rechazar esta incidencia" });
    return;
  }

  // Notificar al reportador antes de borrar la incidencia
  await prisma.notification.create({
    data: {
      userId: inc.reporterId,
      text: "Tu incidencia fue rechazada",
      meta: `${inc.code} · ${inc.title}`,
      type: "status",
    },
  });

  await prisma.incident.delete({ where: { id: req.params.id } });
  res.json({ ok: true, deletedId: req.params.id });
});

incidentsRouter.patch("/:id", async (req, res) => {
  const role = req.role!;
  const userId = req.userId!;
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  // Permission: only jefe can reassign / repriotize, operario can change status of his own assignments
  const inc = await prisma.incident.findUnique({ where: { id: req.params.id } });
  if (!inc) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (role === "operario" && inc.assigneeId !== userId) {
    res.status(403).json({ error: "Only assignee can update" });
    return;
  }
  if (role === "reportador") {
    res.status(403).json({ error: "Reportadores no pueden modificar incidencias" });
    return;
  }

  const updated = await prisma.incident.update({
    where: { id: req.params.id },
    data: parsed.data,
    include: {
      reporter: { select: { id: true, name: true, initials: true } },
      assignee: { select: { id: true, name: true, initials: true } },
    },
  });

  // Notify reporter on status change
  if (parsed.data.status && parsed.data.status !== inc.status) {
    const typeMap: Record<string, "status" | "assignment" | "resolved"> = {
      en_proceso: "status",
      finalizado: "resolved",
      abierto: "status",
    };
    await prisma.notification.create({
      data: {
        userId: inc.reporterId,
        text:
          parsed.data.status === "finalizado"
            ? "Tu reporte fue resuelto"
            : `Tu reporte pasó a "${parsed.data.status.replace("_", " ")}"`,
        meta: `${updated.code} · ${updated.title}`,
        type: typeMap[parsed.data.status] ?? "status",
      },
    });
  }
  // Notify reporter on assignment
  if (parsed.data.assigneeId && parsed.data.assigneeId !== inc.assigneeId) {
    const assignee = await prisma.user.findUnique({
      where: { id: parsed.data.assigneeId },
      select: { name: true },
    });
    await prisma.notification.create({
      data: {
        userId: inc.reporterId,
        text: "Técnico asignado",
        meta: `${assignee?.name ?? "Un operario"} está en camino`,
        type: "assignment",
      },
    });
    // Notify the assigned operario
    await prisma.notification.create({
      data: {
        userId: parsed.data.assigneeId,
        text: "Te asignaron una incidencia",
        meta: `${updated.code} · ${updated.title}`,
        type: "assignment",
      },
    });
  }

  res.json(updated);
});
