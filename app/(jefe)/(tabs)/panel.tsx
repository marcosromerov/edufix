import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Logo } from "../../../components/ui/Logo";
import { IncidentCard } from "../../../components/IncidentCard";
import { incidents } from "../../../data/incidents";

export default function Panel() {
  const today = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const nuevas = incidents.filter((i) => i.isNew).length;
  const enProceso = incidents.filter((i) => i.status === "en_proceso").length;
  const resueltas = incidents.filter((i) => i.status === "finalizado").length;

  const pendientes = incidents.filter((i) => i.isNew);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="px-4 pt-2 pb-2 items-center">
        <Logo size="sm" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text className="text-text text-2xl font-bold">Panel de control</Text>
        <Text className="text-text-muted text-sm capitalize mt-1 mb-5">{today}</Text>

        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-bg-card rounded-2xl py-4 px-3 items-center border border-border/40">
            <Text className="text-status-open text-3xl font-bold">{nuevas}</Text>
            <Text className="text-text-muted text-xs mt-1">Nuevas</Text>
          </View>
          <View className="flex-1 bg-bg-card rounded-2xl py-4 px-3 items-center border border-border/40">
            <Text className="text-status-progress text-3xl font-bold">{enProceso}</Text>
            <Text className="text-text-muted text-xs mt-1">En proceso</Text>
          </View>
          <View className="flex-1 bg-bg-card rounded-2xl py-4 px-3 items-center border border-border/40">
            <Text className="text-status-done text-3xl font-bold">{resueltas}</Text>
            <Text className="text-text-muted text-xs mt-1">Resueltas</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-text font-semibold text-base">Pendientes de asignar</Text>
          <Link href="/(jefe)/(tabs)/incidencias" asChild>
            <Pressable>
              <Text className="text-accent text-sm">Ver todas</Text>
            </Pressable>
          </Link>
        </View>

        <View className="gap-3">
          {pendientes.map((i) => (
            <IncidentCard key={i.id} incident={i} showId />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
