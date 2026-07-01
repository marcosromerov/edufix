import { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Logo } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { session } from "../../hooks/useSession";

export default function Register() {
  const [name, setName] = useState("");
  const [legajo, setLegajo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert("Faltan datos", "Nombre, email y contraseña son obligatorios");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Contraseña muy corta", "Mínimo 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      await session.register({
        name,
        email: email.trim(),
        password,
        role: "reportador",
        legajo: legajo || undefined,
      });
      router.replace("/");
    } catch (e: any) {
      const msg = e?.response?.data?.error ?? "No se pudo crear la cuenta";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <ScreenHeader title="Crear cuenta" />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, flexGrow: 1 }}
      >
        <View className="items-center mt-2 mb-8">
          <Logo size="md" />
        </View>

        <Text className="text-text-muted text-sm mb-4">
          Registrate para reportar incidencias en el campus.
        </Text>

        <View className="gap-4">
          <Input
            label="Nombre completo"
            placeholder="Ej: Marcos Romero"
            value={name}
            onChangeText={setName}
          />
          <Input
            label="Número de legajo (opcional)"
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
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View className="flex-1" />

        <View className="gap-3 mt-8">
          <Button
            title={loading ? "Creando…" : "Crear cuenta"}
            onPress={onSubmit}
            disabled={loading}
          />
          <Pressable onPress={() => router.back()} disabled={loading}>
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
