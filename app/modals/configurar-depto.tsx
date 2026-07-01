import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { showToast } from "../../lib/ui/toast";

export default function ConfigurarDepto() {
  const [nombre, setNombre] = useState("Mantenimiento General");
  const [codigo] = useState("MNT-001");
  const [email, setEmail] = useState("mantenimiento@uade.edu");

  const guardar = () => {
    router.back();
    showToast("Configuración guardada");
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <ScreenHeader title="Configurar depto." />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 16 }}>
        <Card className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-xl bg-accent/15 items-center justify-center">
            <Ionicons name="construct-outline" size={22} color="#22D3EE" />
          </View>
          <View className="flex-1">
            <Text className="text-text font-semibold">Mantenimiento General</Text>
            <Text className="text-text-muted text-xs">Código MNT-001 · 6 miembros</Text>
          </View>
        </Card>

        <Text className="text-text-muted text-sm font-medium">
          Información general
        </Text>

        <Input label="Nombre" value={nombre} onChangeText={setNombre} />
        <Input label="Código" value={codigo} editable={false} />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Button title="Guardar configuración" onPress={guardar} />
      </ScrollView>
    </SafeAreaView>
  );
}
