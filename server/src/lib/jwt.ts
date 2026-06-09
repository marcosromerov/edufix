import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error("JWT_SECRET env var is required");

const ACCESS_TTL = "1h";
const REFRESH_TTL_DAYS = 30;

export type JwtPayload = { sub: string; role: string };

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: ACCESS_TTL });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}

export function generateRefreshToken(): { token: string; expiresAt: Date } {
  const token = randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
  return { token, expiresAt };
}
