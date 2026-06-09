import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/db.js";
import {
  signAccessToken,
  generateRefreshToken,
} from "../lib/jwt.js";
import { initialsFromName } from "../lib/codes.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(["reportador", "jefe", "operario"]),
  department: z.enum(["mantenimiento", "it", "seguridad"]).optional(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
  legajo: z.string().optional(),
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const { email, password, name, role, ...rest } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      initials: initialsFromName(name),
      role,
      ...rest,
    },
  });

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const { token: refreshToken, expiresAt } = generateRefreshToken();
  await prisma.refreshToken.create({
    data: { userId: user.id, token: refreshToken, expiresAt },
  });

  const { passwordHash: _ph, ...safe } = user;
  res.json({ user: safe, accessToken, refreshToken });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const { token: refreshToken, expiresAt } = generateRefreshToken();
  await prisma.refreshToken.create({
    data: { userId: user.id, token: refreshToken, expiresAt },
  });

  const { passwordHash: _ph, ...safe } = user;
  res.json({ user: safe, accessToken, refreshToken });
});

const refreshSchema = z.object({ refreshToken: z.string() });

authRouter.post("/refresh", async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const stored = await prisma.refreshToken.findUnique({
    where: { token: parsed.data.refreshToken },
    include: { user: true },
  });
  if (!stored || stored.expiresAt < new Date()) {
    res.status(401).json({ error: "Invalid or expired refresh token" });
    return;
  }
  const accessToken = signAccessToken({
    sub: stored.user.id,
    role: stored.user.role,
  });
  res.json({ accessToken });
});

authRouter.post("/logout", requireAuth, async (req, res) => {
  const userId = req.userId!;
  await prisma.refreshToken.deleteMany({ where: { userId } });
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const userId = req.userId!;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const { passwordHash: _ph, ...safe } = user;
  res.json(safe);
});
