import { useState } from "react";
import { View, Text, ScrollView, Alert, Image, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { InfoRow } from "../../components/ui/InfoRow";
import { StatusPill, PriorityPill } from "../../components/ui/Pills";
import { LoadingView } from "../../components/ui/StateViews";
import { useSession } from "../../hooks/useSession";
import {
  useIncident,
  useUpdateIncident,
  useDeleteIncident,
} from "../../hooks/api/incidents";
import { IncidentStatus } from "../../data/types";
import { timeAgo } from "../../lib/time";

const labelType = {
  mantenimiento: "Mantenimiento",
  correctivo: "Correctivo",
  preventivo: "Preventivo",
} as const;

const labelDept = {
  mantenimiento: "Mantenimiento",
  it: "IT",
  seguridad: "Seguridad",
} as const;

const nextStatus: Record<IncidentStatus, IncidentStatus | null> = {
  abierto: "en_proceso",
  en_proceso: "finalizado",
  finalizado: null,
};

const nextStatusLabel: Record<IncidentStatus, string> = {
  abierto: 'Avanzar a "En proceso"',
  en_proceso: 'Marcar como "Finalizado"',
  finalizado: "Finalizado",
};

export default function IncidenciaDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useSession();
  const [imageOpen, setImageOpen] = useState(false);
  const { data: incident, isLoading } = useIncident(id);
  const update = useUpdateIncident();
  const remove = useDeleteIncident();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
        <ScreenHeader title="Incidencia" />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!incident || !user) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
        <ScreenHeader title="Incidencia" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-muted">Incidencia no encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isOperarioAssigned =
    user.role === "operario" && incident.assigneeId === user.id;
  const isJefe = user.role === "jefe";
  const isReportador = user.role === "reportador";

  const advance = () => {
    const next = nextStatus[incident.status];
    if (!next) return;
    update.mutate(
      { id: incident.id, payload: { status: next } },
      {
        onSuccess: () => {
          const msg =
            next === "finalizado"
              ? "Incidencia marcada como finalizada."
              : "Estado actualizado a En proceso.";
          Alert.alert("Cambio guardado", msg);
        },
        onError: (e: any) => {
          Alert.alert(
            "Error",
            e?.response?.data?.error ?? "No se pudo actualizar la incidencia",
          );
        },
      },
    );
  };

  const reject = () => {
    const doDelete = () => {
      remove.mutate(incident.id, {
        onSuccess: () => {
          router.back();
        },
        onError: (e: any) => {
          Alert.alert(
            "Error",
            e?.response?.data?.error ?? "No se pudo rechazar la incidencia",
          );
        },
      });
    };
    // Confirmacion: Alert.alert con botones no funciona en web,
    // usamos window.confirm si esta disponible.
    if (typeof window !== "undefined" && typeof window.confirm === "function") {
      if (window.confirm("¿Rechazar esta incidencia? Se eliminará permanentemente.")) {
        doDelete();
      }
    } else {
      Alert.alert(
        "Rechazar incidencia",
        "Se va a eliminar permanentemente. ¿Continuar?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Rechazar", style: "destructive", onPress: doDelete },
        ],
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScreenHeader title={`#${incident.code}`} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 16 }}>
        <View>
          <View className="flex-row items-center gap-2 mb-1.5">
            <StatusPill status={incident.status} />
            {incident.priority === "critica" ? (
              <PriorityPill priority="critica" />
            ) : null}
          </View>
          <Text className="text-text text-xl font-bold">{incident.title}</Text>
          <Text className="text-text-muted text-sm mt-1">
            {incident.location}
            {incident.building ? ` · ${incident.building}` : ""}
          </Text>
        </View>

        <Card>
          <InfoRow label="Ubicación" value={incident.location} />
          <InfoRow label="Reportada" value={timeAgo(incident.createdAt)} />
          <InfoRow label="Tipo" value={labelType[incident.type]} />
          <InfoRow
            label="Departamento"
            value={labelDept[incident.department]}
          />
          <View className="flex-row justify-between py-2.5">
            <Text className="text-text-muted text-sm">Operario</Text>
            <Text className="text-text text-sm font-medium">
              {incident.assignee?.name ?? "Sin asignar"}
            </Text>
          </View>
        </Card>

        <Card>
          <Text className="text-text-muted text-sm mb-1.5">Descripción</Text>
          <Text className="text-text text-sm leading-5">
            {incident.description}
          </Text>
        </Card>

        {incident.imageBase64 ? (
          <Pressable onPress={() => setImageOpen(true)} className="active:opacity-80">
            <Card className="p-0 overflow-hidden">
              <Image
                source={{ uri: `data:image/jpeg;base64,${incident.imageBase64}` }}
                style={{ width: "100%", height: 220 }}
                resizeMode="cover"
              />
              <View className="absolute bottom-2 right-2 flex-row items-center gap-1 bg-black/60 rounded-lg px-2 py-1">
                <Ionicons name="expand-outline" size={13} color="#fff" />
                <Text className="text-white text-xs font-medium">Ampliar</Text>
              </View>
            </Card>
          </Pressable>
        ) : null}

        {/* Acciones por rol */}
        {isOperarioAssigned && incident.status !== "finalizado" ? (
          <View className="gap-2">
            <Button
              title={update.isPending ? "Actualizando…" : nextStatusLabel[incident.status]}
              icon="arrow-forward-circle-outline"
              onPress={advance}
              disabled={update.isPending || remove.isPending}
            />
            <Button
              title={remove.isPending ? "Rechazando…" : "Rechazar incidencia"}
              icon="close-circle-outline"
              variant="danger"
              onPress={reject}
              disabled={update.isPending || remove.isPending}
            />
          </View>
        ) : null}

        {isJefe && incident.status !== "finalizado" ? (
          <View className="gap-2">
            <Button
              title="Gestionar incidencia"
              icon="settings-outline"
              onPress={() => router.push(`/modals/gestionar-incidencia?id=${incident.id}`)}
            />
            <Button
              title="Asignar operario"
              icon="person-add-outline"
              variant="secondary"
              onPress={() => router.push(`/modals/asignar-operario?id=${incident.id}`)}
            />
          </View>
        ) : null}

        {isReportador && incident.status === "finalizado" ? (
          <Card className="items-center">
            <Text className="text-status-done text-sm font-medium">
              ✓ Incidencia resuelta
            </Text>
          </Card>
        ) : null}
      </ScrollView>

      {/* Visor de imagen a pantalla completa */}
      <Modal
        visible={imageOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setImageOpen(false)}
      >
        <Pressable
          onPress={() => setImageOpen(false)}
          className="flex-1 bg-black/95 items-center justify-center"
        >
          {incident.imageBase64 ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${incident.imageBase64}` }}
              style={{ width: "100%", height: "80%" }}
              resizeMode="contain"
            />
          ) : null}
          <Pressable
            onPress={() => setImageOpen(false)}
            className="absolute top-14 right-5 bg-white/15 rounded-full p-2 active:opacity-70"
          >
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
