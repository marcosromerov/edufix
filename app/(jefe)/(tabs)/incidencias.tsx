import { useState, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../../../components/ui/Logo";
import { IncidentCard } from "../../../components/IncidentCard";
import { SegmentedTabs } from "../../../components/ui/SegmentedTabs";
import { useSession } from "../../../hooks/useSession";
import { useIncidents } from "../../../hooks/api/incidents";
import { LoadingView } from "../../../components/ui/StateViews";

const tabs = [
  { key: "todas", label: "Todas" },
  { key: "abiertas", label: "Abiertas" },
  { key: "en_proceso", label: "En proceso" },
  { key: "finalizadas", label: "Finalizadas" },
];

export default function IncidenciasJefe() {
  const { user } = useSession();
  const [filter, setFilter] = useState("todas");
  const { data: incidents = [], isLoading } = useIncidents({ scope: "all" });

  const filtered = useMemo(() => {
    const dept = user?.department
      ? incidents.filter((i) => i.department === user.department)
      : incidents;
    if (filter === "abiertas") return dept.filter((i) => i.status === "abierto");
    if (filter === "en_proceso") return dept.filter((i) => i.status === "en_proceso");
    if (filter === "finalizadas") return dept.filter((i) => i.status === "finalizado");
    return dept;
  }, [filter, incidents, user]);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="px-4 pt-2 pb-2 items-center">
        <Logo size="sm" />
      </View>

      <View className="px-4 pb-3">
        <Text className="text-text text-xl font-bold">Incidencias</Text>
        <Text className="text-text-muted text-xs mb-3">
          {filtered.length} reportes del depto.
        </Text>
        <SegmentedTabs tabs={tabs} value={filter} onChange={setFilter} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 100, gap: 12 }}>
        {isLoading ? (
          <LoadingView />
        ) : (
          filtered.map((i) => (
            <IncidentCard key={i.id} incident={i} showId />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
