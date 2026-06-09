import { User } from "./types";

export const users: User[] = [
  {
    id: "u-alejandro",
    name: "Alejandro Moreno",
    email: "a.moreno@uade.edu",
    role: "reportador",
    initials: "AM",
    phone: "+54 11 4000 0000",
    legajo: "123456",
  },
  {
    id: "u-julian",
    name: "Julián Medina",
    email: "j.medina@uade.edu",
    role: "jefe",
    initials: "JM",
    department: "mantenimiento",
    jobTitle: "Mantenimiento General",
  },
  {
    id: "u-ramiro",
    name: "Ramiro Mendez",
    email: "r.mendez@uade.edu",
    role: "operario",
    initials: "RM",
    department: "mantenimiento",
    jobTitle: "Mantenimiento General",
  },
];

export const findUserById = (id: string) => users.find((u) => u.id === id);
