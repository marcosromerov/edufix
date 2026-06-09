import { Router } from "express";
import { prisma } from "../lib/db.js";
import { requireAuth } from "../middleware/auth.js";

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get("/", async (req, res) => {
  const userId = req.userId!;
  const items = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json(items);
});

notificationsRouter.patch("/:id/read", async (req, res) => {
  const userId = req.userId!;
  const updated = await prisma.notification.updateMany({
    where: { id: req.params.id, userId },
    data: { read: true },
  });
  if (updated.count === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ ok: true });
});

notificationsRouter.post("/read-all", async (req, res) => {
  const userId = req.userId!;
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
  res.json({ ok: true });
});
