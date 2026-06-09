import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Link } from "expo-router";
import { Logo } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { session } from "../../hooks/useSession";
import { Role } from "../../data/types";

const roleOptions: { value: Role; label: string; help: string }[] = [
  { value: "reportador", label: "Reportador", help: "Alumno / docente" },
  { value: "jefe", label: "Jefe de depto.", help: "Gestiona el equipo" },
  { value: "operario", label: "Operario", help: "Resuelve incidencias" },
];

export default function Login() {
  const [role, setRole] = useState<Role>("reportador");
  const [email, setEmail] = useState("nombre@universidad.edu");
  const [password, setPassword] = useState("········");

  const onLogin = () => {
    session.login(role);
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <View className="flex-1 px-6 pt-6 justify-between">
        <View className="gap-6">
          <View className="items-center justify-center pt-10 pb-2">
            <Logo size="lg" />
          </View>

          <View className="gap-1">
            <Input
              label="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Input
            label="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View className="gap-2">
            <Text className="text-text-muted text-sm font-medium">
              Ingresar como (demo)
            </Text>
            <View className="gap-2">
              {roleOptions.map((r) => {
                const active = role === r.value;
                return (
                  <Pressable
                    key={r.value}
                    onPress={() => setRole(r.value)}
                    className={`flex-row items-center justify-between rounded-xl px-4 py-3 border ${
                      active
                        ? "border-accent bg-accent/10"
                        : "border-border bg-bg-card"
                    }`}
                  >
                    <View>
                      <Text className="text-text font-semibold">{r.label}</Text>
                      <Text className="text-text-muted text-xs">{r.help}</Text>
                    </View>
                    <View
                      className={`w-5 h-5 rounded-full border-2 ${
                        active ? "border-accent bg-accent" : "border-text-dim"
                      }`}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View className="gap-4 pb-4">
          <Button title="Ingresar" onPress={onLogin} />
          <Link href="/(auth)/register" asChild>
            <Pressable>
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
