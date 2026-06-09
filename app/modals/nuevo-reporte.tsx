import { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useCreateIncident } from "../../hooks/api/incidents";
import {
  DepartmentKey,
  IncidentPriority,
  IncidentType,
} from "../../data/types";

const departamentos: { value: DepartmentKey; label: string }[] = [
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "it", label: "IT" },
  { value: "seguridad", label: "Seguridad" },
];

const tipos: { value: IncidentType; label: string }[] = [
  { value: "correctivo", label: "Correctivo" },
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "preventivo", label: "Preventivo" },
];

const prioridades: { value: IncidentPriority; label: string }[] = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
  { value: "critica", label: "Crítica" },
];

const ubicaciones = [
  "Piso 5 · UADE Labs · Aula 503",
  "Piso 6 · UADE Labs · Aula 665",
  "Aula B-204",
];

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-3 py-2 rounded-lg border ${active ? "border-accent bg-accent/15" : "border-border bg-bg-input"}`}
    >
      <Text
        className={`text-xs font-medium ${active ? "text-accent" : "text-text-muted"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function NuevoReporte() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState<string>(ubicaciones[0]!);
  const [department, setDepartment] = useState<DepartmentKey>("mantenimiento");
  const [type, setType] = useState<IncidentType>("correctivo");
  const [priority, setPriority] = useState<IncidentPriority>("media");
  const [description, setDescription] = useState("");

  const create = useCreateIncident();

  const enviar = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Faltan datos", "Asunto y descripción son obligatorios");
      return;
    }
    create.mutate(
      { title, location, department, type, priority, description },
      {
        onSuccess: (inc) => {
          Alert.alert(
            "Reporte enviado",
            `Se creó la incidencia ${inc.code}`,
            [{ text: "OK", onPress: () => router.back() }],
          );
        },
        onError: (e: any) => {
          Alert.alert(
            "Error",
            e?.response?.data?.error ?? "No se pudo crear el reporte",
          );
        },
      },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <ScreenHeader title="Nuevo reporte" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 18 }}>
        <Input
          label="Asunto"
          placeholder="Ej: Falla eléctrica aula 402"
          value={title}
          onChangeText={setTitle}
        />

        <View className="gap-2">
          <Text className="text-text-muted text-sm font-medium">Ubicación</Text>
          <View className="flex-row flex-wrap gap-2">
            {ubicaciones.map((u) => (
              <Chip
                key={u}
                label={u.split(" · ").slice(-1)[0]!}
                active={u === location}
                onPress={() => setLocation(u)}
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
                key={d.value}
                label={d.label}
                active={d.value === department}
                onPress={() => setDepartment(d.value)}
              />
            ))}
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-text-muted text-sm font-medium">Tipo</Text>
          <View className="flex-row gap-2">
            {tipos.map((t) => (
              <Chip
                key={t.value}
                label={t.label}
                active={t.value === type}
                onPress={() => setType(t.value)}
              />
            ))}
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-text-muted text-sm font-medium">Prioridad</Text>
          <View className="flex-row gap-2">
            {prioridades.map((p) => (
              <Chip
                key={p.value}
                label={p.label}
                active={p.value === priority}
                onPress={() => setPriority(p.value)}
              />
            ))}
          </View>
        </View>

        <Input
          label="Descripción"
          placeholder="Contá qué pasó…"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{ minHeight: 90, textAlignVertical: "top" }}
        />

        <Pressable className="flex-row items-center justify-center gap-2 bg-bg-card border border-border rounded-xl py-3 active:opacity-70">
          <Ionicons name="image-outline" size={18} color="#8FA1BD" />
          <Text className="text-text-muted text-sm font-medium">
            Adjuntar imagen
          </Text>
        </Pressable>

        <Button
          title={create.isPending ? "Enviando…" : "Enviar reporte"}
          icon="send-outline"
          onPress={enviar}
          disabled={create.isPending}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
