import type { DepartmentKey, IncidentPriority, IncidentType } from "./types";

export interface CatalogItem {
  id: string;
  title: string;
  hint: string;
  department: DepartmentKey;
  type: IncidentType;
  priority: IncidentPriority;
}

export const incidentCatalog: CatalogItem[] = [
  // Mantenimiento
  { id: "lum", title: "Luminaria fundida", hint: "Indicá qué luminaria está afectada", department: "mantenimiento", type: "correctivo", priority: "baja" },
  { id: "agua", title: "Pérdida de agua", hint: "Describí dónde está la pérdida", department: "mantenimiento", type: "correctivo", priority: "alta" },
  { id: "ac", title: "Aire acondicionado roto", hint: "Indicá si no enfría, no enciende, etc.", department: "mantenimiento", type: "correctivo", priority: "media" },
  { id: "puerta", title: "Puerta dañada", hint: "Describí el daño (cerradura, bisagra, etc.)", department: "mantenimiento", type: "correctivo", priority: "media" },
  { id: "canon", title: "Cañería obstruida", hint: "Indicá la ubicación y el tipo de obstrucción", department: "mantenimiento", type: "correctivo", priority: "alta" },
  { id: "vidrio", title: "Vidrio roto", hint: "Indicá el tamaño y la ubicación", department: "mantenimiento", type: "correctivo", priority: "media" },
  { id: "mobil", title: "Mobiliario dañado", hint: "Describí qué está dañado (silla, mesa, etc.)", department: "mantenimiento", type: "correctivo", priority: "baja" },
  { id: "pizar", title: "Pizarrón en mal estado", hint: "Describí el problema con el pizarrón", department: "mantenimiento", type: "mantenimiento", priority: "baja" },
  // IT
  { id: "pc", title: "PC no enciende", hint: "Describí qué pasa al intentar encender", department: "it", type: "correctivo", priority: "media" },
  { id: "proyector", title: "Proyector no funciona", hint: "Indicá si hay imagen, conecta, etc.", department: "it", type: "correctivo", priority: "alta" },
  { id: "wifi", title: "Red WiFi sin señal", hint: "Indicá si el problema es total o parcial", department: "it", type: "correctivo", priority: "alta" },
  { id: "impre", title: "Impresora no funciona", hint: "Describí el error o comportamiento", department: "it", type: "correctivo", priority: "baja" },
  { id: "cable", title: "Cable de red dañado", hint: "Indicá la ubicación del cable", department: "it", type: "correctivo", priority: "media" },
  // Seguridad
  { id: "cerr", title: "Cerradura dañada", hint: "Indicá si no abre, no cierra, o está rota", department: "seguridad", type: "correctivo", priority: "alta" },
  { id: "camara", title: "Cámara de seguridad sin imagen", hint: "Indicá si es falla de imagen o desconexión", department: "seguridad", type: "correctivo", priority: "media" },
  { id: "exting", title: "Extintor vencido o faltante", hint: "Indicá la ubicación exacta del extintor", department: "seguridad", type: "preventivo", priority: "alta" },
  { id: "sospech", title: "Persona sospechosa", hint: "Describí brevemente la situación", department: "seguridad", type: "correctivo", priority: "critica" },
];

export const deptLabel: Record<DepartmentKey, string> = {
  mantenimiento: "Mantenimiento",
  it: "IT",
  seguridad: "Seguridad",
};

export const priorityLabel: Record<IncidentPriority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  critica: "Crítica",
};

export const priorityColor: Record<IncidentPriority, string> = {
  baja: "#4ADE80",
  media: "#FACC15",
  alta: "#FB923C",
  critica: "#F87171",
};
