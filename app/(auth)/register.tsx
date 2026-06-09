import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Logo } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ScreenHeader } from "../../components/ui/ScreenHeader";

export default function Register() {
  const [legajo, setLegajo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <ScreenHeader title="Crear cuenta" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, flexGrow: 1 }}>
        <View className="items-center mt-2 mb-8">
          <Logo size="md" />
        </View>

        <Text className="text-text-muted text-sm mb-4">
          Accedé al sistema de gestión
        </Text>

        <View className="gap-4">
          <Input
            label="Número de legajo"
            placeholder="Ej: 123456"
            value={legajo}
            onChangeText={setLegajo}
            keyboardType="number-pad"
          />
          <Input
            label="Email institucional"
            placeholder="nombre@universidad.edu"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            label="Contraseña"
            placeholder="Mínimo 8 caracteres"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View className="flex-1" />

        <View className="gap-3 mt-8">
          <Button title="Crear cuenta" onPress={() => router.replace("/(auth)/login")} />
          <Pressable onPress={() => router.back()}>
            <Text className="text-center text-text-muted text-sm">
              Ya tenés cuenta?{" "}
              <Text className="text-accent font-semibold">Ingresar</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
