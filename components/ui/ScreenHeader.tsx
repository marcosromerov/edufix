import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";

interface Props {
  title: string;
  right?: React.ReactNode;
  showBack?: boolean;
  subtitle?: string;
}

export function ScreenHeader({ title, right, showBack = true, subtitle }: Props) {
  const router = useRouter();
  const nav = useNavigation();

  const handleBack = () => {
    // Si hay historial, vuelve; si no, intenta ir al inicio del grupo
    if (router.canGoBack()) router.back();
  };

  return (
    <View className="flex-row items-center justify-between px-4 pt-2 pb-3">
      <View className="flex-row items-center gap-2 flex-1">
        {showBack ? (
          <Pressable onPress={handleBack} hitSlop={12} className="-ml-1 p-1">
            <Ionicons name="chevron-back" size={24} color="#E6EDF7" />
          </Pressable>
        ) : null}
        <View className="flex-1">
          <Text className="text-text text-base font-semibold" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-text-muted text-xs">{subtitle}</Text>
          ) : null}
        </View>
      </View>
      {right}
    </View>
  );
}
