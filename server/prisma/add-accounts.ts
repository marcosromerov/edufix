/**
 * Agrega cuentas extra sin borrar nada (idempotente via upsert).
 * Run: npx tsx prisma/add-accounts.ts
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Role, Department } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const accounts = [
    {
      email: "reportador@edufix.com",
      name: "Reportador Demo",
      initials: "RD",
      role: Role.reportador,
      department: null,
      jobTitle: "Estudiante",
    },
    {
      email: "jefe@edufix.com",
      name: "Jefe Demo",
      initials: "JD",
      role: Role.jefe,
      department: Department.mantenimiento,
      jobTitle: "Jefe de Mantenimiento",
    },
    {
      email: "operario@edufix.com",
      name: "Operario Demo",
      initials: "OD",
      role: Role.operario,
      department: Department.mantenimiento,
      jobTitle: "Operario",
    },
  ];

  for (const a of accounts) {
    await prisma.user.upsert({
      where: { email: a.email },
      update: { name: a.name, role: a.role, department: a.department, jobTitle: a.jobTitle },
      create: { ...a, passwordHash },
    });
    console.log(`✓ ${a.email}  (${a.role})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
