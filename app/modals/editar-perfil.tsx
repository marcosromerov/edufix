import { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { session, useSession } from "../../hooks/useSession";

export default function EditarPerfil() {
  const { user } = useSession();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [legajo] = useState(user?.legajo ?? "123456");

  if (!user) return null;

  const guardar = () => {
    session.updateUser({ name, email, phone });
    Alert.alert("Listo", "Cambios guardados.", [
      { text: "OK", onPress: () => router.back() },
    ]);
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
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          label="Teléfono"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Input
          label="Legajo"
          value={legajo}
          editable={false}
          helperText="No puede modificarse"
        />

        <Button title="Guardar cambios" onPress={guardar} />
      </ScrollView>
    </SafeAreaView>
  );
}
