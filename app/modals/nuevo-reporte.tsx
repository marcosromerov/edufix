import { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const departamentos = ["Mantenimiento", "IT", "Seguridad"];
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
  const [asunto, setAsunto] = useState("Ej: Falla eléctrica aula 402");
  const [ubicacion, setUbicacion] = useState(ubicaciones[0]);
  const [depto, setDepto] = useState("Mantenimiento");
  const [descripcion, setDescripcion] = useState("");

  const enviar = () => {
    Alert.alert("Reporte enviado", "Tu reporte fue registrado con éxito.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <ScreenHeader title="Nuevo reporte" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 18 }}>
        <View className="bg-status-progress/10 border border-status-progress/30 rounded-xl p-3 flex-row items-center gap-2">
          <Ionicons name="qr-code" size={18} color="#22D3EE" />
          <View>
            <Text className="text-text text-xs font-medium">
              Ubicación cargada por QR
            </Text>
            <Text className="text-text-muted text-xs">
              UADE-6-665 · Piso 6 · Aula 665
            </Text>
          </View>
        </View>

        <Input
          label="Asunto"
          value={asunto}
          onChangeText={setAsunto}
        />

        <View className="gap-2">
          <Text className="text-text-muted text-sm font-medium">Ubicación</Text>
          <View className="flex-row flex-wrap gap-2">
            {ubicaciones.map((u) => (
              <Chip
                key={u}
                label={u.split(" · ").slice(-1)[0]}
                active={u === ubicacion}
                onPress={() => setUbicacion(u)}
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
                key={d}
                label={d}
                active={d === depto}
                onPress={() => setDepto(d)}
              />
            ))}
          </View>
        </View>

        <Input
          label="Descripción"
          placeholder="Contá qué pasó…"
          value={descripcion}
          onChangeText={setDescripcion}
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

        <Button title="Enviar reporte" icon="send-outline" onPress={enviar} />
      </ScrollView>
    </SafeAreaView>
  );
}
