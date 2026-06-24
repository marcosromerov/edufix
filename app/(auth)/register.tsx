import { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Logo } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { session } from "../../hooks/useSession";
import type { Role, DepartmentKey } from "../../data/types";

const roleOptions: { value: Role; label: string; description: string }[] = [
  { value: "reportador", label: "Reportador", description: "Alumno o docente que reporta incidencias" },
  { value: "jefe", label: "Jefe de departamento", description: "Gestiona y asigna incidencias" },
  { value: "operario", label: "Operario", description: "Técnico que resuelve incidencias (requiere aprobación)" },
];

const departmentOptions: { value: DepartmentKey; label: string }[] = [
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "it", label: "IT" },
  { value: "seguridad", label: "Seguridad" },
];

export default function Register() {
  const [name, setName] = useState("");
  const [legajo, setLegajo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("reportador");
  const [department, setDepartment] = useState<DepartmentKey>("mantenimiento");
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
      const result = await session.register({
        name,
        email: email.trim(),
        password,
        role,
        department: role === "operario" ? department : undefined,
        legajo: legajo || undefined,
      });

      if (result && "pending" in result && result.pending) {
        Alert.alert(
          "Solicitud enviada",
          "Tu cuenta está pendiente de aprobación. El jefe de departamento revisará tu solicitud y te habilitará el acceso.",
          [{ text: "Entendido", onPress: () => router.replace("/(auth)/login") }],
        );
        return;
      }

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

          <View className="gap-2">
            <Text className="text-text-muted text-sm font-medium">Tipo de cuenta</Text>
            {roleOptions.map((r) => {
              const active = role === r.value;
              return (
                <Pressable
                  key={r.value}
                  onPress={() => setRole(r.value)}
                  className={`rounded-xl px-4 py-3 border ${
                    active ? "border-accent bg-accent/10" : "border-border bg-bg-card"
                  }`}
                >
                  <Text className={`font-semibold ${active ? "text-accent" : "text-text"}`}>
                    {r.label}
                  </Text>
                  <Text className="text-text-muted text-xs mt-0.5">{r.description}</Text>
                </Pressable>
              );
            })}
          </View>

          {role === "operario" && (
            <View className="gap-2">
              <Text className="text-text-muted text-sm font-medium">Departamento</Text>
              <Text className="text-text-dim text-xs -mt-1">
                El jefe de ese departamento aprobará tu acceso
              </Text>
              <View className="flex-row gap-2">
                {departmentOptions.map((d) => {
                  const active = department === d.value;
                  return (
                    <Pressable
                      key={d.value}
                      onPress={() => setDepartment(d.value)}
                      className={`flex-1 rounded-xl px-3 py-3 border ${
                        active ? "border-accent bg-accent/10" : "border-border bg-bg-card"
                      }`}
                    >
                      <Text
                        className={`text-center text-sm font-semibold ${
                          active ? "text-accent" : "text-text"
                        }`}
                      >
                        {d.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
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
