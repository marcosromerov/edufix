import { useState, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../../../components/ui/Logo";
import { IncidentCard } from "../../../components/IncidentCard";
import { SegmentedTabs } from "../../../components/ui/SegmentedTabs";
import { useSession } from "../../../hooks/useSession";
import { incidents } from "../../../data/incidents";

const tabs = [
  { key: "todas", label: "Todas" },
  { key: "en_curso", label: "En curso" },
  { key: "resueltas", label: "Resueltas" },
];

export default function MisIncidencias() {
  const { user } = useSession();
  const [filter, setFilter] = useState("todas");

  const filtered = useMemo(() => {
    const mine = incidents.filter((i) => i.reporterId === user?.id);
    if (filter === "en_curso")
      return mine.filter((i) => i.status !== "finalizado");
    if (filter === "resueltas")
      return mine.filter((i) => i.status === "finalizado");
    return mine;
  }, [filter, user]);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="px-4 pt-2 pb-2 items-center">
        <Logo size="sm" />
      </View>

      <View className="px-4 pb-3">
        <Text className="text-text text-xl font-bold mb-3">Mis Incidencias</Text>
        <SegmentedTabs tabs={tabs} value={filter} onChange={setFilter} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 100, gap: 12 }}>
        {filtered.map((i) => (
          <IncidentCard key={i.id} incident={i} compact />
        ))}
        {filtered.length === 0 ? (
          <Text className="text-text-muted text-center mt-12">
            No hay incidencias en esta categoría
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
