import { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { Button } from "../../components/ui/Button";
import { StatusPill } from "../../components/ui/Pills";
import { LoadingView } from "../../components/ui/StateViews";
import { useIncident, useUpdateIncident } from "../../hooks/api/incidents";
import { useTeam } from "../../hooks/api/users";
import { alertThen } from "../../lib/ui/alert";

export default function AsignarOperario() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: incident, isLoading: loadingInc } = useIncident(id);
  const { data: team = [], isLoading: loadingTeam } = useTeam();
  const update = useUpdateIncident();
  const [selected, setSelected] = useState<string | null>(null);

  if (loadingInc || loadingTeam) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
        <ScreenHeader title="Asignar a operario" />
        <LoadingView />
      </SafeAreaView>
    );
  }
  if (!incident) return null;

  const guardar = () => {
    if (!selected) return;
    update.mutate(
      { id: incident.id, payload: { assigneeId: selected, isNew: false } },
      {
        onSuccess: () => {
          alertThen("Operario asignado", "", () => router.back());
        },
        onError: (e: any) => {
          Alert.alert(
            "Error",
            e?.response?.data?.error ?? "No se pudo asignar el operario",
          );
        },
      },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <ScreenHeader title="Asignar a operario" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 16 }}>
        <View>
          <View className="flex-row items-center gap-2 mb-1.5">
            <StatusPill status={incident.status} />
          </View>
          <Text className="text-text text-lg font-bold">{incident.title}</Text>
          <Text className="text-text-muted text-xs mt-0.5">
            {incident.location}
            {incident.building ? ` · ${incident.building}` : ""}
          </Text>
        </View>

        <Text className="text-text-muted text-sm font-medium">
          Lista de operarios
        </Text>

        <View className="gap-2">
          {team.map((m) => {
            const active = selected === m.id;
            return (
              <Pressable
                key={m.id}
                onPress={() => setSelected(m.id)}
                className={`flex-row items-center gap-3 rounded-2xl p-3 border ${
                  active ? "border-accent bg-accent/10" : "border-border/40 bg-bg-card"
                }`}
              >
                <View className="w-11 h-11 rounded-full bg-bg-input items-center justify-center">
                  <Text className="text-text font-bold text-sm">{m.initials}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-text font-semibold">{m.name}</Text>
                  <Text className="text-text-muted text-xs mt-0.5">
                    {m.role} · {m.activeIncidents} en curso
                  </Text>
                </View>
                <View
                  className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                    active ? "border-accent bg-accent" : "border-text-dim"
                  }`}
                >
                  {active ? <Ionicons name="checkmark" size={12} color="#0F1B2D" /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Button
          title={update.isPending ? "Guardando…" : "Guardar cambios"}
          onPress={guardar}
          disabled={!selected || update.isPending}
        />
        <Pressable onPress={() => router.back()} className="py-2">
          <Text className="text-text-muted text-center text-sm">
            Cancelar
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
