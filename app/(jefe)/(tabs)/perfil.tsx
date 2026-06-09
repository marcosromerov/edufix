import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Logo } from "../../../components/ui/Logo";
import { Button } from "../../../components/ui/Button";
import { session, useSession } from "../../../hooks/useSession";
import { incidents } from "../../../data/incidents";
import { teamMembers } from "../../../data/extras";

function RowItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
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

export default function PerfilJefe() {
  const { user } = useSession();
  if (!user) return null;

  const dept = incidents.filter((i) => i.department === user.department);
  const informes = dept.length;
  const enProceso = dept.filter((i) => i.status === "en_proceso").length;
  const operarios = teamMembers.length;

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
          <View className="flex-row items-center gap-2">
            <Text className="text-text text-lg font-bold">{user.name}</Text>
            <View className="bg-accent/15 px-2 py-0.5 rounded-md">
              <Text className="text-accent text-[10px] font-bold uppercase">Supervisor</Text>
            </View>
          </View>
          <Text className="text-text-muted text-sm">{user.email}</Text>
          <Text className="text-text-muted text-xs">{user.jobTitle}</Text>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 bg-bg-card rounded-2xl py-4 items-center border border-border/40">
            <Text className="text-text text-2xl font-bold">{informes}</Text>
            <Text className="text-text-muted text-xs mt-1">Informes</Text>
          </View>
          <View className="flex-1 bg-bg-card rounded-2xl py-4 items-center border border-border/40">
            <Text className="text-status-progress text-2xl font-bold">{enProceso}</Text>
            <Text className="text-text-muted text-xs mt-1">En proceso</Text>
          </View>
          <View className="flex-1 bg-bg-card rounded-2xl py-4 items-center border border-border/40">
            <Text className="text-text text-2xl font-bold">{operarios}</Text>
            <Text className="text-text-muted text-xs mt-1">Operarios</Text>
          </View>
        </View>

        <View className="gap-2">
          <RowItem icon="create-outline" label="Editar perfil" onPress={() => router.push("/modals/editar-perfil")} />
          <RowItem icon="people-outline" label="Mi equipo" onPress={() => router.push("/(jefe)/(tabs)/equipo")} />
          <RowItem icon="settings-outline" label="Configurar departamento" onPress={() => router.push("/modals/configurar-depto")} />
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
