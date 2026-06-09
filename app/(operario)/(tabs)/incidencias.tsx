import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../../../components/ui/Logo";
import { IncidentCard } from "../../../components/IncidentCard";
import { useSession } from "../../../hooks/useSession";
import { incidents } from "../../../data/incidents";

export default function IncidenciasOperario() {
  const { user } = useSession();
  const mine = incidents.filter((i) => i.assigneeId === user?.id);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="px-4 pt-2 pb-2 items-center">
        <Logo size="sm" />
      </View>

      <View className="px-4 pb-3">
        <Text className="text-text text-xl font-bold">Incidencias a resolver</Text>
        <Text className="text-text-muted text-xs mt-1">{user?.name}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 100, gap: 12 }}>
        {mine.map((i) => (
          <IncidentCard key={i.id} incident={i} showId />
        ))}
        {mine.length === 0 ? (
          <Text className="text-text-muted text-center mt-12">
            No tenés incidencias asignadas
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
