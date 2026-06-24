export type Role = "reportador" | "jefe" | "operario";

export type IncidentStatus = "abierto" | "en_proceso" | "finalizado";

export type IncidentPriority = "baja" | "media" | "alta" | "critica";

export type IncidentType = "mantenimiento" | "correctivo" | "preventivo";

export type DepartmentKey = "mantenimiento" | "it" | "seguridad";

export type UserStatus = "active" | "pending";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status?: UserStatus;
  initials: string;
  department?: DepartmentKey | null;
  jobTitle?: string | null;
  phone?: string | null;
  legajo?: string | null;
}

export interface PendingOperario {
  id: string;
  name: string;
  initials: string;
  email: string;
  department?: DepartmentKey | null;
  createdAt: string;
}

export interface UserMini {
  id: string;
  name: string;
  initials: string;
  email?: string;
}

export interface Incident {
  id: string;          // cuid
  code: string;        // "INC-8821" - human-readable
  title: string;
  location: string;
  building?: string | null;
  type: IncidentType;
  status: IncidentStatus;
  priority: IncidentPriority;
  department: DepartmentKey;
  description: string;
  isNew: boolean;
  imageBase64?: string | null;
  createdAt: string;   // ISO timestamp
  updatedAt: string;
  reporterId: string;
  reporter: UserMini;
  assigneeId?: string | null;
  assignee?: UserMini | null;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  activeIncidents: number;
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  meta: string;
  read: boolean;
  type: "status" | "assignment" | "resolved";
  createdAt: string;
}

export interface Scan {
  id: string;
  location: string;
  detail: string;
  when: string;
}
