import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useCreateIncident } from "../../hooks/api/incidents";
import {
  incidentCatalog,
  deptLabel,
  priorityLabel,
  priorityColor,
  type CatalogItem,
} from "../../data/incidentCatalog";
import type { DepartmentKey } from "../../data/types";

const deptFilters: { value: DepartmentKey; label: string }[] = [
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "it", label: "IT" },
  { value: "seguridad", label: "Seguridad" },
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
      className={`px-3 py-2 rounded-lg border ${
        active ? "border-accent bg-accent/15" : "border-border bg-bg-input"
      }`}
    >
      <Text className={`text-xs font-medium ${active ? "text-accent" : "text-text-muted"}`}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function NuevoReporte() {
  const { location: locationParam } = useLocalSearchParams<{ location?: string }>();

  const [location, setLocation] = useState(locationParam ?? "");
  const [deptFilter, setDeptFilter] = useState<DepartmentKey>("mantenimiento");
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const [description, setDescription] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const create = useCreateIncident();

  const filteredCatalog = incidentCatalog.filter((i) => i.department === deptFilter);

  const pickerOptions: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.4,
    base64: true,
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Sin permiso",
        "Necesitamos acceso a la cámara para tomar la foto.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync(pickerOptions);
    if (!result.canceled && result.assets[0]) {
      setImageBase64(result.assets[0].base64 ?? null);
    }
  };

  const pickFromLibrary = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sin permiso",
          "Necesitamos acceso a tu galería para adjuntar imágenes.",
        );
        return;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    if (!result.canceled && result.assets[0]) {
      setImageBase64(result.assets[0].base64 ?? null);
    }
  };

  const pickImage = () => {
    // En web no hay cámara nativa: vamos directo a la galería / selector de archivos.
    if (Platform.OS === "web") {
      pickFromLibrary();
      return;
    }
    Alert.alert("Adjuntar imagen", "¿De dónde querés sacar la foto?", [
      { text: "Tomar foto", onPress: takePhoto },
      { text: "Elegir de galería", onPress: pickFromLibrary },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const enviar = () => {
    if (!selected) {
      Alert.alert("Faltan datos", "Seleccioná el tipo de incidencia");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Faltan datos", "Indicá la ubicación (usá el escáner QR o escribila)");
      return;
    }

    create.mutate(
      {
        title: selected.title,
        location: location.trim(),
        department: selected.department,
        type: selected.type,
        priority: selected.priority,
        description: description.trim() || selected.hint,
        imageBase64: imageBase64 ?? undefined,
      },
      {
        onSuccess: (inc) => {
          router.back();
          // Navegar al detalle después de cerrar el modal
          setTimeout(() => {
            router.push(`/incidencia/${inc.id}`);
          }, 300);
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

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 20 }}>

        {/* Ubicación */}
        <View className="gap-2">
          <Text className="text-text-muted text-sm font-medium">Ubicación</Text>
          {locationParam ? (
            <View className="flex-row items-center gap-2 px-4 py-3 rounded-xl bg-bg-card border border-accent/30">
              <Ionicons name="location" size={16} color="#22D3EE" />
              <Text className="text-text flex-1 text-sm font-medium">{location}</Text>
              <View className="flex-row items-center gap-1">
                <Ionicons name="qr-code" size={12} color="#22D3EE" />
                <Text className="text-accent text-xs font-medium">QR</Text>
              </View>
            </View>
          ) : (
            <Input
              placeholder="Ej: Piso 2 · Aula 237  (o usá el escáner QR)"
              value={location}
              onChangeText={setLocation}
            />
          )}
        </View>

        {/* Catálogo de incidencias */}
        <View className="gap-3">
          <Text className="text-text-muted text-sm font-medium">Tipo de incidencia</Text>

          {/* Filtro por departamento */}
          <View className="flex-row gap-2">
            {deptFilters.map((d) => (
              <Chip
                key={d.value}
                label={d.label}
                active={deptFilter === d.value}
                onPress={() => {
                  setDeptFilter(d.value);
                  if (selected?.department !== d.value) setSelected(null);
                }}
              />
            ))}
          </View>

          {/* Ítems del catálogo */}
          <View className="gap-2">
            {filteredCatalog.map((item) => {
              const isActive = selected?.id === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setSelected(item)}
                  className={`px-4 py-3 rounded-xl border flex-row items-center justify-between ${
                    isActive
                      ? "border-accent bg-accent/10"
                      : "border-border bg-bg-card"
                  }`}
                >
                  <View className="flex-1">
                    <Text
                      className={`text-sm font-semibold ${
                        isActive ? "text-accent" : "text-text"
                      }`}
                    >
                      {item.title}
                    </Text>
                    <Text className="text-text-muted text-xs mt-0.5">{item.hint}</Text>
                  </View>
                  <View
                    style={{ backgroundColor: `${priorityColor[item.priority]}20` }}
                    className="ml-3 px-2 py-1 rounded-md"
                  >
                    <Text
                      style={{ color: priorityColor[item.priority] }}
                      className="text-xs font-semibold"
                    >
                      {priorityLabel[item.priority]}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Info de la selección */}
          {selected && (
            <View className="flex-row gap-2 flex-wrap px-1">
              <View className="flex-row items-center gap-1 bg-bg-card border border-border/60 rounded-lg px-2.5 py-1.5">
                <Ionicons name="business-outline" size={12} color="#8FA1BD" />
                <Text className="text-text-muted text-xs">{deptLabel[selected.department]}</Text>
              </View>
              <View className="flex-row items-center gap-1 bg-bg-card border border-border/60 rounded-lg px-2.5 py-1.5">
                <Ionicons name="construct-outline" size={12} color="#8FA1BD" />
                <Text className="text-text-muted text-xs capitalize">{selected.type}</Text>
              </View>
              <View
                style={{ borderColor: `${priorityColor[selected.priority]}40` }}
                className="flex-row items-center gap-1 bg-bg-card rounded-lg px-2.5 py-1.5 border"
              >
                <Ionicons name="alert-circle-outline" size={12} color={priorityColor[selected.priority]} />
                <Text style={{ color: priorityColor[selected.priority] }} className="text-xs font-medium">
                  Prioridad {priorityLabel[selected.priority]}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Descripción / notas */}
        <Input
          label={`Notas adicionales${selected ? ` (${selected.hint})` : ""}`}
          placeholder="Agregá detalles relevantes…"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={{ minHeight: 80, textAlignVertical: "top" }}
        />

        {/* Adjuntar imagen */}
        <View className="gap-2">
          <Text className="text-text-muted text-sm font-medium">Imagen (opcional)</Text>
          {imageBase64 ? (
            <View className="gap-2">
              <Image
                source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
                style={{ width: "100%", height: 180, borderRadius: 12 }}
                resizeMode="cover"
              />
              <Pressable
                onPress={() => setImageBase64(null)}
                className="flex-row items-center justify-center gap-2 py-2 active:opacity-60"
              >
                <Ionicons name="trash-outline" size={15} color="#8FA1BD" />
                <Text className="text-text-muted text-sm">Quitar imagen</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={pickImage}
              className="flex-row items-center justify-center gap-2 bg-bg-card border border-border rounded-xl py-3.5 active:opacity-70"
            >
              <Ionicons name="image-outline" size={18} color="#8FA1BD" />
              <Text className="text-text-muted text-sm font-medium">Adjuntar imagen</Text>
            </Pressable>
          )}
        </View>

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
