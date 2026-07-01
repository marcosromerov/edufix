import { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { StatusPill, PriorityPill } from "../../components/ui/Pills";
import { LoadingView } from "../../components/ui/StateViews";
import { alertThen } from "../../lib/ui/alert";
import {
  useIncident,
  useUpdateIncident,
  useDeleteIncident,
} from "../../hooks/api/incidents";
import { IncidentPriority } from "../../data/types";

function Chip({
  label,
  active,
  onPress,
  tone = "default",
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  tone?: "default" | "danger";
}) {
  const activeClass =
    tone === "danger"
      ? "border-danger bg-danger/15"
      : "border-accent bg-accent/15";
  const activeText = tone === "danger" ? "text-danger" : "text-accent";
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 py-2.5 rounded-lg border items-center ${
        active ? activeClass : "border-border bg-bg-input"
      }`}
    >
      <Text
        className={`text-xs font-semibold ${active ? activeText : "text-text-muted"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const priorities: { key: IncidentPriority; label: string }[] = [
  { key: "baja", label: "Baja" },
  { key: "media", label: "Media" },
  { key: "alta", label: "Alta" },
  { key: "critica", label: "Crítica" },
];

export default function GestionarIncidencia() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: incident, isLoading } = useIncident(id);
  const update = useUpdateIncident();
  const remove = useDeleteIncident();

  const [priority, setPriority] = useState<IncidentPriority | null>(null);
  const [rechazando, setRechazando] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
        <ScreenHeader title="Gestionar incidencia" />
        <LoadingView />
      </SafeAreaView>
    );
  }
  if (!incident) return null;

  const currentPriority = priority ?? incident.priority;

  const guardar = () => {
    if (priority === null || priority === incident.priority) {
      router.back();
      return;
    }
    update.mutate(
      { id: incident.id, payload: { priority } },
      {
        onSuccess: () => {
          alertThen("Cambios guardados", "", () => router.back());
        },
        onError: (e: any) => {
          Alert.alert(
            "Error",
            e?.response?.data?.error ?? "No se pudo guardar",
          );
        },
      },
    );
  };

  const rechazar = () => {
    remove.mutate(incident.id, {
      onSuccess: () => {
        alertThen("Incidencia rechazada", "Se notificó al reportador.", () => {
          // Cerrar modal + detalle de incidencia (ya no existe)
          router.back();
          setTimeout(() => router.back(), 50);
        });
      },
      onError: (e: any) => {
        Alert.alert(
          "Error",
          e?.response?.data?.error ?? "No se pudo rechazar la incidencia",
        );
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <ScreenHeader title="Gestionar incidencia" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 16 }}>
        <View>
          <View className="flex-row items-center gap-2 mb-1.5">
            <StatusPill status={incident.status} />
            <PriorityPill priority={currentPriority} />
          </View>
          <Text className="text-text text-lg font-bold">{incident.title}</Text>
          <Text className="text-text-muted text-xs mt-0.5">
            {incident.location}
            {incident.building ? ` · ${incident.building}` : ""}
          </Text>
        </View>

        {!rechazando ? (
          <>
            <Pressable
              onPress={() => setRechazando(true)}
              className="bg-danger/15 border border-danger/40 rounded-xl py-3 active:opacity-70"
            >
              <Text className="text-danger text-center font-semibold">
                Rechazar incidencia
              </Text>
            </Pressable>

            <View className="gap-2">
              <Text className="text-text-muted text-sm font-medium">Prioridad</Text>
              <View className="flex-row gap-2">
                {priorities.map((p) => (
                  <Chip
                    key={p.key}
                    label={p.label}
                    active={currentPriority === p.key}
                    onPress={() => setPriority(p.key)}
                  />
                ))}
              </View>
            </View>

            <Button
              title={update.isPending ? "Guardando…" : "Guardar cambios"}
              onPress={guardar}
              disabled={update.isPending}
            />
          </>
        ) : (
          <>
            <View className="gap-2">
              <Text className="text-text-muted text-sm font-medium">
                Motivo de rechazo
              </Text>
              <Input
                placeholder="Indicá el motivo…"
                value={motivoRechazo}
                onChangeText={setMotivoRechazo}
                multiline
                numberOfLines={4}
                style={{ minHeight: 90, textAlignVertical: "top" }}
              />
            </View>

            <Button
              title={remove.isPending ? "Rechazando…" : "Confirmar rechazo"}
              variant="danger"
              onPress={rechazar}
              disabled={remove.isPending}
            />
            <Pressable onPress={() => setRechazando(false)} className="py-2" disabled={remove.isPending}>
              <Text className="text-text-muted text-center text-sm">Cancelar</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
