import { useState } from "react";
import { View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Link } from "expo-router";
import { Logo } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { session } from "../../hooks/useSession";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Faltan datos", "Ingresá email y contraseña");
      return;
    }
    setLoading(true);
    try {
      await session.login(email.trim(), password);
      router.replace("/");
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ?? "No se pudo iniciar sesión. Verificá tus datos.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <View className="flex-1 px-6 pt-6 justify-between">
        <View className="gap-6">
          <View className="items-center justify-center pt-10 pb-2">
            <Logo size="lg" />
          </View>

          <Input
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="nombre@universidad.edu"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            label="Contraseña"
            secureTextEntry
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View className="gap-4 pb-4">
          <Button
            title={loading ? "Ingresando…" : "Ingresar"}
            onPress={onLogin}
            disabled={loading}
          />
          {loading && <ActivityIndicator color="#22D3EE" />}
          <Link href="/(auth)/register" asChild>
            <Pressable disabled={loading}>
              <Text className="text-center text-text-muted text-sm">
                ¿No tenés cuenta?{" "}
                <Text className="text-accent font-semibold">Registrate</Text>
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
