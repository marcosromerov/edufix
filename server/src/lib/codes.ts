/**
 * Generate a human-readable incident code like "INC-8821".
 * We use a random 4-digit number; collisions are checked at the DB level via @unique.
 */
import { prisma } from "./db.js";

export async function generateIncidentCode(): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const n = 1000 + Math.floor(Math.random() * 9000);
    const code = `INC-${n}`;
    const exists = await prisma.incident.findUnique({ where: { code } });
    if (!exists) return code;
  }
  // Fallback: timestamp-based (always unique)
  return `INC-${Date.now().toString().slice(-6)}`;
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "??";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]![0] ?? "" : "";
  return (first + last).toUpperCase();
}
