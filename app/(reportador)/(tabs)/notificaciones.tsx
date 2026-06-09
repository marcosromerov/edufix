import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Logo } from "../../../components/ui/Logo";
import { SegmentedTabs } from "../../../components/ui/SegmentedTabs";
import { Card } from "../../../components/ui/Card";
import { notifications } from "../../../data/extras";

const tabs = [
  { key: "todas", label: "Todas" },
  { key: "no_leidas", label: "No leídas" },
  { key: "en_gestion", label: "En gestión" },
];

const iconForType = (t: string) =>
  t === "status" ? "sync-circle" : t === "assignment" ? "person-circle" : "checkmark-circle";

const colorForType = (t: string) =>
  t === "status" ? "#22D3EE" : t === "assignment" ? "#F59E0B" : "#10B981";

export default function Notificaciones() {
  const [filter, setFilter] = useState("todas");
  const list =
    filter === "no_leidas"
      ? notifications.filter((n) => !n.read)
      : notifications;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="px-4 pt-2 pb-2 items-center">
        <Logo size="sm" />
      </View>

      <View className="px-4 pb-3">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-text text-xl font-bold">Notificaciones</Text>
          <Text className="text-accent text-xs">Todas</Text>
        </View>
        <SegmentedTabs tabs={tabs} value={filter} onChange={setFilter} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 100 }}>
        {list.map((n) => (
          <Card key={n.id} className="flex-row gap-3 items-start">
            <View className="mt-0.5">
              <Ionicons name={iconForType(n.type) as any} size={22} color={colorForType(n.type)} />
            </View>
            <View className="flex-1">
              <Text className="text-text font-medium">{n.text}</Text>
              <Text className="text-text-muted text-xs mt-0.5">{n.meta}</Text>
            </View>
            {!n.read ? <View className="w-2 h-2 rounded-full bg-accent mt-2" /> : null}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
