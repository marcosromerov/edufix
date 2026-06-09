import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Logo } from "../../../components/ui/Logo";
import { Card } from "../../../components/ui/Card";
import { useTeam } from "../../../hooks/api/users";
import { useIncidents } from "../../../hooks/api/incidents";
import { LoadingView } from "../../../components/ui/StateViews";

export default function Equipo() {
  const { data: team = [], isLoading: loadingTeam } = useTeam();
  const { data: incidents = [], isLoading: loadingInc } = useIncidents({ scope: "all" });

  const enCurso = incidents.filter((i) => i.status !== "finalizado").length;
  const operarios = team.length;
  const total = incidents.length;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="px-4 pt-2 pb-2 items-center">
        <Logo size="sm" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text className="text-text text-xl font-bold">Mi equipo</Text>
        <Text className="text-text-muted text-xs mt-1 mb-5">
          Mantenimiento · {operarios} miembros
        </Text>

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

        {loadingTeam || loadingInc ? (
          <LoadingView />
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
