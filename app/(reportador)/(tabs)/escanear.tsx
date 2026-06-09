import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "../../../components/ui/ScreenHeader";
import { Button } from "../../../components/ui/Button";

export default function Escanear() {
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScreenHeader title="Escanear QR" showBack={false} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 16 }}>
        <Text className="text-text text-xl font-bold text-center mt-2">
          Escaneá el QR del aula
        </Text>
        <Text className="text-text-muted text-sm text-center -mt-3">
          Ubicá el código dentro del marco
        </Text>

        {/* Marco de escaneo */}
        <View className="items-center justify-center my-3">
          <View className="w-64 h-64 bg-bg-card rounded-2xl border border-border/60 items-center justify-center overflow-hidden">
            <View className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-accent rounded-tl-lg" />
            <View className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-accent rounded-tr-lg" />
            <View className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-accent rounded-bl-lg" />
            <View className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-accent rounded-br-lg" />
            <Ionicons name="qr-code-outline" size={64} color="#5C7090" />
          </View>
        </View>

        <Button
          title="Simular escaneo"
          icon="scan"
          onPress={() => router.push("/modals/nuevo-reporte")}
        />

        <View>
          <Text className="text-text-muted text-sm mb-3">Escaneos recientes</Text>
          <Text className="text-text-dim text-xs">
            Sin escaneos recientes
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
