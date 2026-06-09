import { TeamMember, Notification, Scan } from "./types";

export const teamMembers: TeamMember[] = [
  {
    id: "u-ramiro",
    name: "Ramiro Mendez",
    initials: "RM",
    role: "Operario senior",
    activeIncidents: 3,
  },
  {
    id: "tm-2",
    name: "Carlos Mendoza",
    initials: "CM",
    role: "Operario senior · 3 en curso",
    activeIncidents: 3,
  },
  {
    id: "tm-3",
    name: "Elena Rivas",
    initials: "ER",
    role: "Técnica eléctrica · 2 en curso",
    activeIncidents: 2,
  },
];

export const notifications: Notification[] = [
  {
    id: "n-1",
    text: 'Tu reporte pasó a "En proceso"',
    meta: "INC-8821 · Rotura tubería",
    read: false,
    type: "status",
  },
  {
    id: "n-2",
    text: "Técnico asignado",
    meta: "R. Mendez está en camino",
    read: false,
    type: "assignment",
  },
  {
    id: "n-3",
    text: "Tu reporte fue resuelto",
    meta: "INC-8770 · Ayer",
    read: true,
    type: "resolved",
  },
];

export const recentScans: Scan[] = [
  {
    id: "s-1",
    location: "Piso 6 · Aula 665 · UADE Labs",
    detail: "UADE-6-665 · Hace 2d",
    when: "Hace 2d",
  },
];
