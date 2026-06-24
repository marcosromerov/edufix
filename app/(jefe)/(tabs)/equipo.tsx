import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Logo } from "../../../components/ui/Logo";
import { Card } from "../../../components/ui/Card";
import { useTeam, usePendingOperarios, useApproveOperario, useRejectOperario } from "../../../hooks/api/users";
import { useIncidents } from "../../../hooks/api/incidents";
import { LoadingView } from "../../../components/ui/StateViews";

const deptLabel: Record<string, string> = {
  mantenimiento: "Mantenimiento",
  it: "IT",
  seguridad: "Seguridad",
};

export default function Equipo() {
  const { data: team = [], isLoading: loadingTeam } = useTeam();
  const { data: pending = [], isLoading: loadingPending } = usePendingOperarios();
  const { data: incidents = [], isLoading: loadingInc } = useIncidents({ scope: "all" });
  const approve = useApproveOperario();
  const reject = useRejectOperario();

  const enCurso = incidents.filter((i) => i.status !== "finalizado").length;
  const operarios = team.length;
  const total = incidents.length;

  const onApprove = (id: string, name: string) => {
    approve.mutate(id, {
      onSuccess: () => {
        Alert.alert("Operario aprobado", `${name} ya puede acceder al sistema.`);
      },
      onError: () => {
        Alert.alert("Error", "No se pudo aprobar al operario.");
      },
    });
  };

  const doReject = (id: string, name: string) => {
    reject.mutate(id, {
      onSuccess: () => {
        Alert.alert("Solicitud rechazada", `Se eliminó la solicitud de ${name}.`);
      },
      onError: () => {
        Alert.alert("Error", "No se pudo rechazar la solicitud.");
      },
    });
  };

  const onReject = (id: string, name: string) => {
    if (typeof window !== "undefined" && typeof window.confirm === "function") {
      if (window.confirm(`¿Rechazar la solicitud de ${name}?`)) doReject(id, name);
    } else {
      Alert.alert("Rechazar solicitud", `¿Eliminar la solicitud de ${name}?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Rechazar", style: "destructive", onPress: () => doReject(id, name) },
      ]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="px-4 pt-2 pb-2 items-center">
        <Logo size="sm" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text className="text-text text-xl font-bold">Mi equipo</Text>
        <Text className="text-text-muted text-xs mt-1 mb-5">
          {operarios} miembros activos
          {pending.length > 0 ? ` · ${pending.length} solicitud${pending.length > 1 ? "es" : ""} pendiente${pending.length > 1 ? "s" : ""}` : ""}
        </Text>

        {/* Stats */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-bg-card rounded-2xl py-4 px-3 items-center border border-border/40">
            <Text className="text-text text-3xl font-bold">{operarios}</Text>
            <Text className="text-text-muted text-xs mt-1">Operarios</Text>
          </View>
          <View className="flex-1 bg-bg-card rounded-2xl py-4 px-3 items-center border border-border/40">
            <Text className="text-status-progress text-3xl font-bold">{enCurso}</Text>
            <Text className="text-text-muted text-xs mt-1">En curso</Text>
          </View>
          <View className="flex-1 bg-bg-card rounded-2xl py-4 px-3 items-center border border-border/40">
            <Text className="text-text text-3xl font-bold">{total}</Text>
            <Text className="text-text-muted text-xs mt-1">Total</Text>
          </View>
        </View>

        {/* Pendientes de aprobación */}
        {loadingPending ? null : pending.length > 0 ? (
          <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-3">
              <View className="w-2 h-2 rounded-full bg-yellow-400" />
              <Text className="text-text font-semibold">
                Solicitudes pendientes ({pending.length})
              </Text>
            </View>
            <View className="gap-2">
              {pending.map((p) => (
                <Card key={p.id} className="gap-3">
                  <View className="flex-row items-center gap-3">
                    <View className="w-11 h-11 rounded-full bg-yellow-400/15 border border-yellow-400/30 items-center justify-center">
                      <Text className="text-yellow-400 font-bold text-sm">{p.initials}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-text font-semibold">{p.name}</Text>
                      <Text className="text-text-muted text-xs mt-0.5">
                        {p.email}
                        {p.department ? ` · ${deptLabel[p.department] ?? p.department}` : ""}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => onApprove(p.id, p.name)}
                      disabled={approve.isPending || reject.isPending}
                      className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl bg-accent/15 border border-accent/30 active:opacity-70"
                    >
                      <Ionicons name="checkmark-circle-outline" size={16} color="#22D3EE" />
                      <Text className="text-accent text-sm font-semibold">Aprobar</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => onReject(p.id, p.name)}
                      disabled={approve.isPending || reject.isPending}
                      className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 active:opacity-70"
                    >
                      <Ionicons name="close-circle-outline" size={16} color="#F87171" />
                      <Text className="text-red-400 text-sm font-semibold">Rechazar</Text>
                    </Pressable>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        ) : null}

        {/* Equipo activo */}
        <Text className="text-text font-semibold mb-3">Equipo activo</Text>

        {loadingTeam || loadingInc ? (
          <LoadingView />
        ) : team.length === 0 ? (
          <Text className="text-text-dim text-sm">Sin operarios asignados</Text>
        ) : (
          <View className="gap-3">
            {team.map((m) => (
              <Card key={m.id} className="flex-row items-center gap-3">
                <View className="w-11 h-11 rounded-full bg-bg-input items-center justify-center">
                  <Text className="text-text font-bold text-sm">{m.initials}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-text font-semibold">{m.name}</Text>
                  <Text className="text-text-muted text-xs mt-0.5">
                    {m.role} · {m.activeIncidents} en curso
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#5C7090" />
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
