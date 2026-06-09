import { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { MapPlaceholder } from "../../components/MapPlaceholder";
import { StatusPill, PriorityPill } from "../../components/ui/Pills";
import { findIncident } from "../../data/incidents";
import { IncidentPriority, DepartmentKey } from "../../data/types";

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
];

const departamentos: { key: DepartmentKey; label: string }[] = [
  { key: "mantenimiento", label: "Mantenimiento" },
  { key: "it", label: "IT" },
  { key: "seguridad", label: "Seguridad" },
];

export default function GestionarIncidencia() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const incident = findIncident(id);

  const [priority, setPriority] = useState<IncidentPriority>(
    incident?.priority ?? "media",
  );
  const [depto, setDepto] = useState<DepartmentKey>(
    incident?.department ?? "mantenimiento",
  );
  const [assigneeText, setAssigneeText] = useState("");
  const [rechazando, setRechazando] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");

  if (!incident) return null;

  const guardar = () => {
    Alert.alert("Cambios guardados", "", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const rechazar = () => {
    Alert.alert("Incidencia rechazada", "", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <ScreenHeader title="Gestionar incidencia" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 16 }}>
        <View>
          <View className="flex-row items-center gap-2 mb-1.5">
            <StatusPill status={incident.status} />
            <PriorityPill priority={priority} />
          </View>
          <Text className="text-text text-lg font-bold">{incident.title}</Text>
          <Text className="text-text-muted text-xs mt-0.5">
            {incident.location}
            {incident.building ? ` · ${incident.building}` : ""}
          </Text>
        </View>

        <MapPlaceholder />

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
                    active={priority === p.key}
                    onPress={() => setPriority(p.key)}
                  />
                ))}
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-text-muted text-sm font-medium">
                Departamento
              </Text>
              <View className="flex-row gap-2">
                {departamentos.map((d) => (
                  <Chip
                    key={d.key}
                    label={d.label}
                    active={depto === d.key}
                    onPress={() => setDepto(d.key)}
                  />
                ))}
              </View>
            </View>

            <Input
              label="Asignar operario"
              placeholder="Buscar por nombre o rol"
              value={assigneeText}
              onChangeText={setAssigneeText}
            />

            <Button title="Guardar cambios" onPress={guardar} />
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

            <View className="gap-2">
              <Text className="text-text-muted text-sm font-medium">
                Asignar a otro departamento
              </Text>
              <View className="flex-row gap-2">
                {departamentos.map((d) => (
                  <Chip
                    key={d.key}
                    label={d.label}
                    active={depto === d.key}
                    onPress={() => setDepto(d.key)}
                  />
                ))}
              </View>
            </View>

            <Button title="Confirmar rechazo" variant="danger" onPress={rechazar} />
            <Pressable onPress={() => setRechazando(false)} className="py-2">
              <Text className="text-text-muted text-center text-sm">Cancelar</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
