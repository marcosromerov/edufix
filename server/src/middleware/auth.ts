import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt.js";

export interface AuthedRequest extends Request {
  userId: string;
  role: string;
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing token" });
    return;
  }
  const token = header.slice(7);
  try {
    const payload = verifyAccessToken(token);
    (req as AuthedRequest).userId = payload.sub;
    (req as AuthedRequest).role = payload.role;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const r = (req as AuthedRequest).role;
    if (!roles.includes(r)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}
