import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ScreenHeader } from "../../../components/ui/ScreenHeader";
import { Button } from "../../../components/ui/Button";

interface QRLocation {
  building: string;
  floor: number;
  zones: string[];
}

const DEMO_QR: QRLocation = {
  building: "CHILE 1",
  floor: 2,
  zones: ["Zona Baños", "AULAS", "Aula 239", "Aula 237", "Aula 238", "Aula 236"],
};

export default function Escanear() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState<QRLocation | null>(null);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    try {
      const parsed = JSON.parse(data) as QRLocation;
      if (parsed.building && parsed.floor && Array.isArray(parsed.zones)) {
        setQrData(parsed);
      } else {
        alert("QR inválido: el código no contiene información de ubicación.");
        setScanned(false);
      }
    } catch {
      alert("No se pudo leer el código QR. Intentá de nuevo.");
      setScanned(false);
    }
  };

  const selectZone = (zone: string) => {
    if (!qrData) return;
    const location = `${qrData.building} · Piso ${qrData.floor} · ${zone}`;
    router.push({ pathname: "/modals/nuevo-reporte", params: { location } });
    setTimeout(() => {
      setScanned(false);
      setQrData(null);
    }, 800);
  };

  const resetScan = () => {
    setScanned(false);
    setQrData(null);
  };

  // Zona picker: aparece luego del escaneo exitoso
  if (qrData) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
        <ScreenHeader title="Escanear QR" showBack={false} />
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100, gap: 14 }}>
          <View className="flex-row items-center gap-2 mb-2">
            <View className="w-8 h-8 rounded-full bg-accent/20 items-center justify-center">
              <Ionicons name="checkmark" size={18} color="#22D3EE" />
            </View>
            <View>
              <Text className="text-text font-bold text-base">
                {qrData.building} · Piso {qrData.floor}
              </Text>
              <Text className="text-text-muted text-xs">QR escaneado correctamente</Text>
            </View>
          </View>

          <Text className="text-text-muted text-sm font-medium">
            Seleccioná la ubicación exacta:
          </Text>

          <View className="gap-2">
            {qrData.zones.map((zone) => (
              <Pressable
                key={zone}
                onPress={() => selectZone(zone)}
                className="flex-row items-center gap-3 px-4 py-3.5 rounded-2xl border border-border bg-bg-card active:opacity-70"
              >
                <Ionicons name="location-outline" size={20} color="#8FA1BD" />
                <Text className="text-text font-medium flex-1">{zone}</Text>
                <Ionicons name="chevron-forward" size={16} color="#5C7090" />
              </Pressable>
            ))}
          </View>

          <Button
            title="Volver a escanear"
            icon="refresh-outline"
            variant="secondary"
            onPress={resetScan}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Sin permisos
  if (!permission?.granted) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
        <ScreenHeader title="Escanear QR" showBack={false} />
        <View className="flex-1 items-center justify-center p-6 gap-5">
          <View className="w-20 h-20 rounded-full bg-bg-card border border-border items-center justify-center">
            <Ionicons name="camera-outline" size={36} color="#5C7090" />
          </View>
          <View className="items-center gap-2">
            <Text className="text-text text-lg font-bold text-center">
              Acceso a cámara requerido
            </Text>
            <Text className="text-text-muted text-sm text-center leading-5">
              Necesitamos la cámara para escanear los códigos QR de las aulas y pre-cargar la ubicación automáticamente.
            </Text>
          </View>
          <Button title="Permitir cámara" onPress={requestPermission} />

          <View className="w-full border-t border-border/40 pt-4">
            <Text className="text-text-muted text-xs text-center mb-3">
              ¿Sin cámara disponible? Usá el modo demo:
            </Text>
            <Button
              title="Simular QR — CHILE 1 · Piso 2"
              icon="qr-code-outline"
              variant="secondary"
              onPress={() => setQrData(DEMO_QR)}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Cámara activa
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScreenHeader title="Escanear QR" showBack={false} />

      <View className="items-center justify-center my-5">
        <Text className="text-text text-xl font-bold text-center mb-1">
          Escaneá el QR del aula
        </Text>
        <Text className="text-text-muted text-sm text-center mb-4">
          Ubicá el código dentro del marco
        </Text>

        <View className="w-72 h-72 rounded-2xl overflow-hidden border border-border/60">
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={handleBarcodeScanned}
          >
            <View style={StyleSheet.absoluteFillObject}>
              <View className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-accent rounded-tl-lg" />
              <View className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-accent rounded-tr-lg" />
              <View className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-accent rounded-bl-lg" />
              <View className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-accent rounded-br-lg" />
            </View>
          </CameraView>
        </View>
      </View>

      <View className="px-6">
        <View className="border-t border-border/40 pt-4">
          <Text className="text-text-muted text-xs text-center mb-3">
            ¿Código QR no disponible?
          </Text>
          <Button
            title="Simular QR — CHILE 1 · Piso 2"
            icon="qr-code-outline"
            variant="secondary"
            onPress={() => setQrData(DEMO_QR)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
