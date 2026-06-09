import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Incident } from "../data/types";
import { StatusPill, NuevaPill } from "./ui/Pills";
import { timeAgo } from "../lib/time";

interface Props {
  incident: Incident;
  showId?: boolean;
  compact?: boolean;
}

export function IncidentCard({ incident, showId = false, compact = false }: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/incidencia/${incident.id}`)}
      className="bg-bg-card rounded-2xl p-4 border border-border/40 active:opacity-80"
    >
      <View className="flex-row items-start justify-between mb-1.5">
        <View className="flex-1 pr-2">
          {showId ? (
            <Text className="text-text-dim text-xs mb-0.5">#{incident.code}</Text>
          ) : null}
          <Text className="text-text font-semibold text-[15px]" numberOfLines={1}>
            {incident.title}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          {incident.isNew ? <NuevaPill /> : null}
          <StatusPill status={incident.status} />
        </View>
      </View>

      <View className="flex-row items-center gap-1.5">
        <Ionicons name="location-outline" size={13} color="#8FA1BD" />
        <Text className="text-text-muted text-xs flex-1" numberOfLines={1}>
          {incident.location}
          {incident.building ? ` · ${incident.building}` : ""}
          {compact ? "" : ` · ${timeAgo(incident.createdAt)}`}
        </Text>
      </View>
    </Pressable>
  );
}
