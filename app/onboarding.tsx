import { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  FlatList,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Logo } from "../components/ui/Logo";
import { Button } from "../components/ui/Button";
import { onboarding } from "../lib/onboarding";

type Slide = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
};

const SLIDES: Slide[] = [
  {
    key: "welcome",
    icon: "business",
    title: "Bienvenido a EduFix",
    desc: "Reportá y resolvé las incidencias edilicias de tu universidad desde un solo lugar.",
  },
  {
    key: "report",
    icon: "camera",
    title: "Reportá en segundos",
    desc: "Describí el problema, elegí la ubicación y enviá. El equipo de mantenimiento se entera al instante.",
  },
  {
    key: "track",
    icon: "notifications",
    title: "Seguí el estado en vivo",
    desc: "Mirá si tu reporte está abierto, en proceso o resuelto, y recibí un aviso cada vez que avanza.",
  },
  {
    key: "roles",
    icon: "people",
    title: "Cada rol, su vista",
    desc: "Reportadores, jefes de departamento y operarios: cada uno ve y gestiona lo que le corresponde.",
  },
];

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const [containerW, setContainerW] = useState(width);
  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef<FlatList<Slide>>(null);

  const isLast = index === SLIDES.length - 1;

  const finish = useCallback(async () => {
    await onboarding.markSeen();
    router.replace("/(auth)/login");
  }, []);

  const goNext = () => {
    if (isLast) {
      void finish();
      return;
    }
    const next = index + 1;
    setIndex(next);
    listRef.current?.scrollToOffset({
      offset: containerW * next,
      animated: true,
    });
  };

  // Mantenemos el índice sincronizado leyendo el scroll. No alcanza con
  // onMomentumScrollEnd porque en web no dispara con scroll programático.
  const syncIndex = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (containerW <= 0) return;
    const i = Math.round(e.nativeEvent.contentOffset.x / containerW);
    setIndex((prev) => (prev !== i ? i : prev));
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false, listener: syncIndex },
  );

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      {/* Barra superior: logo + saltar */}
      <View className="flex-row items-center justify-between px-6 pt-2">
        <Logo size="sm" />
        <Pressable onPress={() => void finish()} hitSlop={12}>
          <Text className="text-text-muted text-sm font-medium">Saltar</Text>
        </Pressable>
      </View>

      {/* Slides deslizables */}
      <View
        className="flex-1"
        onLayout={(e) => setContainerW(e.nativeEvent.layout.width)}
      >
        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(s) => s.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View
              style={{ width: containerW }}
              className="items-center justify-center px-10"
            >
              <View className="w-44 h-44 rounded-full items-center justify-center bg-bg-card border border-border mb-12">
                <Ionicons name={item.icon} size={72} color="#22D3EE" />
              </View>
              <Text className="text-text text-2xl font-bold text-center mb-3">
                {item.title}
              </Text>
              <Text className="text-text-muted text-base text-center leading-6">
                {item.desc}
              </Text>
            </View>
          )}
        />
      </View>

      {/* Indicadores (dots) */}
      <View className="flex-row items-center justify-center mb-6" style={{ gap: 8 }}>
        {SLIDES.map((_, i) => {
          const inputRange = [
            (i - 1) * containerW,
            i * containerW,
            (i + 1) * containerW,
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={i}
              style={{
                width: dotWidth,
                opacity,
                height: 8,
                borderRadius: 999,
                backgroundColor: "#22D3EE",
              }}
            />
          );
        })}
      </View>

      {/* Acción */}
      <View className="px-6 pb-4">
        <Button
          title={isLast ? "Empezar" : "Siguiente"}
          onPress={goNext}
          icon={isLast ? "checkmark" : undefined}
        />
      </View>
    </SafeAreaView>
  );
}
