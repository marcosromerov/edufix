import { api } from "./client";
import type {
  User,
  Incident,
  Notification,
  TeamMember,
  Role,
  IncidentStatus,
  IncidentPriority,
  IncidentType,
  DepartmentKey,
} from "../../data/types";

// =================== AUTH ===================

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role: Role;
  department?: DepartmentKey;
  jobTitle?: string;
  phone?: string;
  legajo?: string;
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const r = await api.post<AuthResponse>("/auth/login", { email, password });
  return r.data;
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const r = await api.post<AuthResponse>("/auth/register", payload);
  return r.data;
}

export async function meApi(): Promise<User> {
  const r = await api.get<User>("/auth/me");
  return r.data;
}

export async function logoutApi(): Promise<void> {
  await api.post("/auth/logout");
}

// =================== INCIDENTS ===================

export interface IncidentsQuery {
  status?: IncidentStatus;
  department?: DepartmentKey;
  scope?: "mine" | "assigned" | "all";
}

export interface CreateIncidentPayload {
  title: string;
  location: string;
  building?: string;
  type: IncidentType;
  priority: IncidentPriority;
  department: DepartmentKey;
  description: string;
}

export interface UpdateIncidentPayload {
  status?: IncidentStatus;
  priority?: IncidentPriority;
  assigneeId?: string | null;
  isNew?: boolean;
}

export async function listIncidents(q: IncidentsQuery = {}): Promise<Incident[]> {
  const r = await api.get<Incident[]>("/incidents", { params: q });
  return r.data;
}

export async function getIncident(id: string): Promise<Incident> {
  const r = await api.get<Incident>(`/incidents/${id}`);
  return r.data;
}

export async function createIncident(payload: CreateIncidentPayload): Promise<Incident> {
  const r = await api.post<Incident>("/incidents", payload);
  return r.data;
}

export async function updateIncident(
  id: string,
  payload: UpdateIncidentPayload,
): Promise<Incident> {
  const r = await api.patch<Incident>(`/incidents/${id}`, payload);
  return r.data;
}

export async function deleteIncident(id: string): Promise<void> {
  await api.delete(`/incidents/${id}`);
}

// =================== NOTIFICATIONS ===================

export async function listNotifications(): Promise<Notification[]> {
  const r = await api.get<Notification[]>("/notifications");
  return r.data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post("/notifications/read-all");
}

// =================== USERS ===================

export async function listUsers(role?: Role): Promise<User[]> {
  const r = await api.get<User[]>("/users", { params: role ? { role } : {} });
  return r.data;
}

export async function listTeam(): Promise<TeamMember[]> {
  const r = await api.get<TeamMember[]>("/users/team");
  return r.data;
}

export async function updateMe(payload: {
  name?: string;
  phone?: string;
  jobTitle?: string;
}): Promise<User> {
  const r = await api.patch<User>("/users/me", payload);
  return r.data;
}
