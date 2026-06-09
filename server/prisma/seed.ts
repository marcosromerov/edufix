/**
 * Seed: pobla la base con los usuarios y incidencias de ejemplo
 * que antes vivían en /data/*.ts del cliente.
 *
 * Run: npm run seed
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Role, Department, IncidentStatus, IncidentPriority, IncidentType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("→ Limpiando tablas…");
  await prisma.notification.deleteMany();
  await prisma.scan.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.user.deleteMany();

  console.log("→ Creando usuarios…");
  const passwordHash = await bcrypt.hash("password123", 12);

  const alejandro = await prisma.user.create({
    data: {
      email: "a.moreno@uade.edu",
      passwordHash,
      name: "Alejandro Moreno",
      initials: "AM",
      role: Role.reportador,
      phone: "+54 11 4000 0000",
      legajo: "123456",
    },
  });

  const julian = await prisma.user.create({
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

  const ramiro = await prisma.user.create({
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

  const carlos = await prisma.user.create({
    data: {
      email: "c.mendoza@uade.edu",
      passwordHash,
      name: "Carlos Mendoza",
      initials: "CM",
      role: Role.operario,
      department: Department.mantenimiento,
      jobTitle: "Operario senior",
    },
  });

  const elena = await prisma.user.create({
    data: {
      email: "e.rivas@uade.edu",
      passwordHash,
      name: "Elena Rivas",
      initials: "ER",
      role: Role.operario,
      department: Department.mantenimiento,
      jobTitle: "Técnica eléctrica",
    },
  });

  console.log(`   Usuarios creados (password = "password123" para todos)`);

  console.log("→ Creando incidencias…");
  const incidents = [
    { code: "INC-8821", title: "Falla en el proyector", location: "Aula B-204", building: "Edificio B", type: IncidentType.correctivo, status: IncidentStatus.abierto, priority: IncidentPriority.media, department: Department.mantenimiento, description: "Falla en el proyector, no enciende y falla a la hora de arrancar.", reporterId: alejandro.id, isNew: true },
    { code: "INC-8822", title: "Gotera en el techo", location: "Lab. Química", building: "Edificio C", type: IncidentType.mantenimiento, status: IncidentStatus.en_proceso, priority: IncidentPriority.alta, department: Department.mantenimiento, description: "Gotera persistente sobre la mesada del laboratorio, requiere reparación urgente.", reporterId: alejandro.id, assigneeId: ramiro.id },
    { code: "INC-8810", title: "Silla dañada", location: "Biblioteca", building: "Edificio Central", type: IncidentType.correctivo, status: IncidentStatus.finalizado, priority: IncidentPriority.baja, department: Department.mantenimiento, description: "Silla con respaldo roto en sala de lectura.", reporterId: alejandro.id, assigneeId: ramiro.id, isNew: false },
    { code: "INC-8801", title: "Luminaria LED", location: "Biblioteca", building: "Edificio Central", type: IncidentType.mantenimiento, status: IncidentStatus.finalizado, priority: IncidentPriority.baja, department: Department.mantenimiento, description: "Reemplazo de luminaria LED quemada.", reporterId: alejandro.id, assigneeId: ramiro.id, isNew: false },
    { code: "INC-8830", title: "Climatización", location: "Edificio Central", type: IncidentType.mantenimiento, status: IncidentStatus.en_proceso, priority: IncidentPriority.alta, department: Department.mantenimiento, description: "AC sin enfriar en aulas del piso 4.", reporterId: alejandro.id, assigneeId: ramiro.id, isNew: false },
    { code: "INC-8831", title: "Filtración Lab. B2", location: "Edificio B", type: IncidentType.mantenimiento, status: IncidentStatus.abierto, priority: IncidentPriority.alta, department: Department.mantenimiento, description: "Filtración detectada en el laboratorio B2.", reporterId: alejandro.id, isNew: true },
    { code: "INC-8832", title: "Mesa Rota", location: "Comedor", type: IncidentType.correctivo, status: IncidentStatus.finalizado, priority: IncidentPriority.baja, department: Department.mantenimiento, description: "Mesa rota en el comedor central.", reporterId: alejandro.id, isNew: false },
    { code: "INC-9001", title: "Falla eléctrica Lab. Física", location: "Edificio C", type: IncidentType.mantenimiento, status: IncidentStatus.abierto, priority: IncidentPriority.critica, department: Department.mantenimiento, description: "Corte eléctrico parcial en el laboratorio de física.", reporterId: alejandro.id, isNew: true },
    { code: "INC-9002", title: "Fuga sanitarios", location: "Biblioteca", type: IncidentType.mantenimiento, status: IncidentStatus.abierto, priority: IncidentPriority.alta, department: Department.mantenimiento, description: "Fuga en sanitarios del primer piso.", reporterId: alejandro.id, isNew: true },
    { code: "INC-9003", title: "Reposición luminaria", location: "Edificio A", type: IncidentType.mantenimiento, status: IncidentStatus.abierto, priority: IncidentPriority.baja, department: Department.mantenimiento, description: "Reposición de luminaria en pasillo.", reporterId: alejandro.id, isNew: true },
    { code: "INC-9004", title: "Problemas con el wifi", location: "Aula B-204", type: IncidentType.correctivo, status: IncidentStatus.en_proceso, priority: IncidentPriority.alta, department: Department.it, description: "Conexión wifi intermitente en aula B-204.", reporterId: alejandro.id, assigneeId: ramiro.id, isNew: false },
    { code: "INC-9005", title: "Rotura tubería principal", location: "Fac. Ingeniería", type: IncidentType.mantenimiento, status: IncidentStatus.en_proceso, priority: IncidentPriority.critica, department: Department.mantenimiento, description: "Rotura de tubería principal al norte del edificio.", reporterId: alejandro.id, assigneeId: ramiro.id, isNew: false },
  ];

  for (const inc of incidents) {
    await prisma.incident.create({ data: inc });
  }
  console.log(`   ${incidents.length} incidencias creadas`);

  console.log("→ Notificaciones de muestra…");
  await prisma.notification.createMany({
    data: [
      { userId: alejandro.id, text: 'Tu reporte pasó a "En proceso"', meta: "INC-8821 · Rotura tubería", type: "status", read: false },
      { userId: alejandro.id, text: "Técnico asignado", meta: "R. Mendez está en camino", type: "assignment", read: false },
      { userId: alejandro.id, text: "Tu reporte fue resuelto", meta: "INC-8770 · Ayer", type: "resolved", read: true },
    ],
  });

  console.log("✓ Seed completo");
  console.log("");
  console.log("Cuentas para login:");
  console.log("  - a.moreno@uade.edu  (reportador)");
  console.log("  - j.medina@uade.edu  (jefe)");
  console.log("  - r.mendez@uade.edu  (operario)");
  console.log("  password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
