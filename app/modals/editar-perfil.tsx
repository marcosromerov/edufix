import { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useSession } from "../../hooks/useSession";
import { useUpdateMe } from "../../hooks/api/users";

export default function EditarPerfil() {
  const { user } = useSession();
  const updateMe = useUpdateMe();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  if (!user) return null;

  const guardar = () => {
    updateMe.mutate(
      { name, phone },
      {
        onSuccess: () => {
          Alert.alert("Listo", "Cambios guardados.", [
            { text: "OK", onPress: () => router.back() },
          ]);
        },
        onError: (e: any) => {
          Alert.alert(
            "Error",
            e?.response?.data?.error ?? "No se pudo guardar el perfil",
          );
        },
      },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <ScreenHeader title="Editar perfil" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 16 }}>
        <View className="items-center gap-3 pt-2">
          <View className="w-24 h-24 rounded-full bg-bg-input items-center justify-center border-2 border-accent/30">
            <Text className="text-text text-3xl font-bold">{user.initials}</Text>
          </View>
          <Pressable className="flex-row items-center gap-1.5 bg-bg-input px-3 py-1.5 rounded-lg">
            <Ionicons name="camera-outline" size={14} color="#22D3EE" />
            <Text className="text-accent text-xs font-medium">Cambiar foto</Text>
          </Pressable>
        </View>

        <Input label="Nombre y apellido" value={name} onChangeText={setName} />
        <Input
          label="Email"
          value={user.email}
          editable={false}
          helperText="No puede modificarse"
        />
        <Input
          label="Teléfono"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Input
          label="Legajo"
          value={user.legajo ?? ""}
          editable={false}
          helperText="No puede modificarse"
        />

        <Button
          title={updateMe.isPending ? "Guardando…" : "Guardar cambios"}
          onPress={guardar}
          disabled={updateMe.isPending}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
