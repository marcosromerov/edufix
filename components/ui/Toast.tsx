import { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useToast, type ToastKind } from "../../lib/ui/toast";

const CONF: Record<ToastKind, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  success: { icon: "checkmark-circle", color: "#10B981" },
  info: { icon: "information-circle", color: "#22D3EE" },
  error: { icon: "alert-circle", color: "#F43F5E" },
};

export function Toast() {
  const { message, kind, token } = useToast();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (token === 0) return;
    setVisible(true);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8 }),
    ]).start();
    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
      ]).start(() => setVisible(false));
    }, 2600);
    return () => clearTimeout(t);
  }, [token]);

  if (!visible) return null;
  const conf = CONF[kind];

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: insets.top + 10,
        left: 16,
        right: 16,
        opacity,
        transform: [{ translateY }],
        zIndex: 9999,
      }}
    >
      <View className="flex-row items-center gap-2.5 bg-bg-card border border-border rounded-2xl px-4 py-3 shadow-lg">
        <Ionicons name={conf.icon} size={20} color={conf.color} />
        <Text className="text-text text-sm font-medium flex-1">{message}</Text>
      </View>
    </Animated.View>
  );
}
