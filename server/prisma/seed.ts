/**
 * Seed: base limpia con solo dos usuarios staff (jefe + operario).
 * Los reportadores deben registrarse via la app (/auth/register).
 *
 * Run: npm run seed
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Role, Department } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("→ Limpiando tablas…");
  await prisma.notification.deleteMany();
  await prisma.scan.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.user.deleteMany();

  console.log("→ Creando usuarios staff…");
  const passwordHash = await bcrypt.hash("password123", 12);

  await prisma.user.create({
    data: {
      email: "j.medina@uade.edu",
      passwordHash,
      name: "Julián Medina",
      initials: "JM",
      role: Role.jefe,
      department: Department.mantenimiento,
      jobTitle: "Mantenimiento General",
    },
  });

  await prisma.user.create({
    data: {
      email: "r.mendez@uade.edu",
      passwordHash,
      name: "Ramiro Mendez",
      initials: "RM",
      role: Role.operario,
      department: Department.mantenimiento,
      jobTitle: "Operario senior",
    },
  });

  console.log("");
  console.log("✓ Seed completo. Base lista, sin incidencias.");
  console.log("");
  console.log("Cuentas creadas (password = password123):");
  console.log("  - j.medina@uade.edu  (jefe)");
  console.log("  - r.mendez@uade.edu  (operario)");
  console.log("");
  console.log("Los reportadores se registran desde la app.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
