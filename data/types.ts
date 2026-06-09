export type Role = "reportador" | "jefe" | "operario";

export type IncidentStatus = "abierto" | "en_proceso" | "finalizado";

export type IncidentPriority = "baja" | "media" | "alta" | "critica";

export type IncidentType = "mantenimiento" | "correctivo" | "preventivo";

export type DepartmentKey = "mantenimiento" | "it" | "seguridad";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
  department?: DepartmentKey;
  jobTitle?: string;
  phone?: string;
  legajo?: string;
}

export interface Incident {
  id: string;          // INC-8821
  title: string;
  location: string;    // Aula B-204
  building?: string;   // Edificio Central
  reportedAt: string;  // "Hace 15 min" o "9:30 AM" (string libre para mock)
  type: IncidentType;
  status: IncidentStatus;
  priority: IncidentPriority;
  department: DepartmentKey;
  description: string;
  reporterId: string;
  assigneeId?: string;
  isNew?: boolean;     // “Nueva” badge en panel jefe
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;        // "Operario senior"
  activeIncidents: number;
}

export interface Notification {
  id: string;
  text: string;
  meta: string;        // "INC-8821 - Rotura tubería"
  read: boolean;
  type: "status" | "assignment" | "resolved";
}

export interface Scan {
  id: string;
  location: string;
  detail: string;
  when: string;
}
