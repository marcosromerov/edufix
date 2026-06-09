import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Rect, Path, Circle, G } from "react-native-svg";

export function MapPlaceholder({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl overflow-hidden border border-border/40 bg-bg-input"
    >
      <View className="h-36 w-full bg-[#9CB8A8] relative">
        <Svg width="100%" height="100%" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice">
          {/* manzanas estilo mapa */}
          <Rect x="0" y="0" width="400" height="160" fill="#A8C5B5" />
          <Rect x="20" y="20" width="100" height="50" fill="#C9DCC9" />
          <Rect x="140" y="20" width="120" height="50" fill="#C9DCC9" />
          <Rect x="280" y="20" width="100" height="50" fill="#C9DCC9" />
          <Rect x="20" y="90" width="100" height="55" fill="#C9DCC9" />
          <Rect x="140" y="90" width="120" height="55" fill="#C9DCC9" />
          <Rect x="280" y="90" width="100" height="55" fill="#C9DCC9" />
          {/* calles */}
          <Rect x="125" y="0" width="10" height="160" fill="#E9EFE3" />
          <Rect x="265" y="0" width="10" height="160" fill="#E9EFE3" />
          <Rect x="0" y="75" width="400" height="10" fill="#E9EFE3" />
          {/* pin */}
          <G>
            <Circle cx="200" cy="80" r="18" fill="#22D3EE" opacity="0.25" />
            <Circle cx="200" cy="80" r="9" fill="#22D3EE" />
            <Circle cx="200" cy="80" r="3" fill="#0F1B2D" />
          </G>
        </Svg>
        <View className="absolute bottom-2 right-2 bg-bg/80 px-2 py-1 rounded-md flex-row items-center gap-1">
          <Ionicons name="map" size={12} color="#22D3EE" />
          <Text className="text-text text-xs">Ver Mapa</Text>
        </View>
      </View>
    </Pressable>
  );
}
