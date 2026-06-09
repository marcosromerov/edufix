import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Logo } from "../../../components/ui/Logo";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { StatBlock } from "../../../components/ui/StatBlock";
import { session, useSession } from "../../../hooks/useSession";
import { incidents } from "../../../data/incidents";

interface RowItemProps {
  icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}
function RowItem({ icon, label, onPress }: RowItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between bg-bg-card border border-border/40 rounded-xl px-4 py-3.5 active:opacity-70"
    >
      <View className="flex-row items-center gap-3">
        <Ionicons name={icon} size={18} color="#8FA1BD" />
        <Text className="text-text font-medium">{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#5C7090" />
    </Pressable>
  );
}

export default function Perfil() {
  const { user } = useSession();
  if (!user) return null;

  const mine = incidents.filter((i) => i.reporterId === user.id);
  const reportes = mine.length;
  const resueltas = mine.filter((i) => i.status === "finalizado").length;
  const activas = mine.filter((i) => i.status !== "finalizado").length;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="px-4 pt-2 pb-2 items-center">
        <Logo size="sm" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 100 }}>
        <View className="items-center gap-2 pt-2">
          <View className="w-20 h-20 rounded-full bg-bg-input items-center justify-center border-2 border-accent/30">
            <Text className="text-text text-2xl font-bold">{user.initials}</Text>
          </View>
          <Text className="text-text text-lg font-bold">{user.name}</Text>
          <Text className="text-text-muted text-sm">{user.email}</Text>
        </View>

        <View className="flex-row gap-3">
          <StatBlock value={reportes} label="Reportes" />
          <StatBlock value={resueltas} label="Resueltas" tone="done" />
          <StatBlock value={activas} label="Activas" tone="progress" />
        </View>

        <View className="gap-2">
          <RowItem
            icon="create-outline"
            label="Editar perfil"
            onPress={() => router.push("/modals/editar-perfil")}
          />
          <RowItem icon="notifications-outline" label="Notificaciones" />
          <RowItem icon="lock-closed-outline" label="Seguridad" />
          <RowItem icon="help-circle-outline" label="Soporte" />
        </View>

        <Button
          title="Cerrar sesión"
          variant="danger"
          icon="log-out-outline"
          onPress={() => {
            session.logout();
            router.replace("/(auth)/login");
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
