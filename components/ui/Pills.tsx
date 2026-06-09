import { View, Text } from "react-native";
import { IncidentStatus, IncidentPriority } from "../../data/types";

const statusColor: Record<IncidentStatus, { dot: string; text: string; bg: string }> = {
  abierto:    { dot: "bg-status-open",     text: "text-status-open",     bg: "bg-status-open/15" },
  en_proceso: { dot: "bg-status-progress", text: "text-status-progress", bg: "bg-status-progress/15" },
  finalizado: { dot: "bg-status-done",     text: "text-status-done",     bg: "bg-status-done/15" },
};

const statusLabel: Record<IncidentStatus, string> = {
  abierto: "Abierto",
  en_proceso: "En proceso",
  finalizado: "Finalizado",
};

const priorityColor: Record<IncidentPriority, { text: string; bg: string }> = {
  baja: { text: "text-text-muted", bg: "bg-bg-input" },
  media: { text: "text-status-progress", bg: "bg-status-progress/15" },
  alta: { text: "text-status-open", bg: "bg-status-open/15" },
  critica: { text: "text-status-critical", bg: "bg-status-critical/20" },
};

const priorityLabel: Record<IncidentPriority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  critica: "Crítica",
};

export function StatusPill({ status }: { status: IncidentStatus }) {
  const c = statusColor[status];
  return (
    <View className={`flex-row items-center gap-1.5 ${c.bg} px-2.5 py-1 rounded-full self-start`}>
      <View className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      <Text className={`text-xs font-medium ${c.text}`}>{statusLabel[status]}</Text>
    </View>
  );
}

export function PriorityPill({ priority }: { priority: IncidentPriority }) {
  const c = priorityColor[priority];
  return (
    <View className={`${c.bg} px-2.5 py-1 rounded-full self-start`}>
      <Text className={`text-xs font-semibold ${c.text}`}>{priorityLabel[priority]}</Text>
    </View>
  );
}

export function NuevaPill() {
  return (
    <View className="bg-accent px-2 py-0.5 rounded-md self-start">
      <Text className="text-bg text-[10px] font-bold uppercase tracking-wide">Nueva</Text>
    </View>
  );
}
