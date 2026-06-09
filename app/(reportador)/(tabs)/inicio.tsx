import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { Logo } from "../../../components/ui/Logo";
import { Button } from "../../../components/ui/Button";
import { IncidentCard } from "../../../components/IncidentCard";
import { useSession } from "../../../hooks/useSession";
import { useIncidents } from "../../../hooks/api/incidents";
import { LoadingView, EmptyView } from "../../../components/ui/StateViews";

export default function Inicio() {
  const { user } = useSession();
  const router = useRouter();
  const { data: mine, isLoading } = useIncidents({ scope: "mine" });

  const active = mine?.filter((i) => i.status !== "finalizado").length ?? 0;
  const resolved = mine?.filter((i) => i.status === "finalizado").length ?? 0;
  const top = mine?.slice(0, 3) ?? [];

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="px-4 pt-2 pb-2 flex-row items-center justify-between">
        <Logo size="sm" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text className="text-text text-2xl font-bold">
          Hola, {user?.name.split(" ")[0]}
        </Text>
        <Text className="text-text-muted text-sm mt-1 mb-5">
          {active} activas · {resolved} resueltas
        </Text>

        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-text font-semibold text-base">Mis Incidencias</Text>
          <Link href="/(reportador)/(tabs)/incidencias" asChild>
            <Pressable>
              <Text className="text-accent text-sm">Ver todas</Text>
            </Pressable>
          </Link>
        </View>

        {isLoading ? (
          <LoadingView />
        ) : top.length === 0 ? (
          <EmptyView
            title="Sin incidencias aún"
            subtitle="Reportá la primera con el botón de abajo"
          />
        ) : (
          <View className="gap-3">
            {top.map((i) => (
              <IncidentCard key={i.id} incident={i} />
            ))}
          </View>
        )}

        <View className="mt-6">
          <Button
            title="Nuevo reporte"
            icon="add-circle-outline"
            onPress={() => router.push("/modals/nuevo-reporte")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
