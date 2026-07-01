import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Opciones comunes para las barras de tabs de los 3 roles.
 *
 * La etiqueta se renderiza con nuestro propio <Text> vía `tabBarLabel`
 * porque el label por defecto de react-navigation, en web, colapsa a ~4px
 * de alto y recorta el texto. Además contemplamos el área segura inferior
 * (home indicator) del celu.
 */
export function useTabScreenOptions() {
  const insets = useSafeAreaInsets();
  return {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: "#1A2740",
      borderTopColor: "#2A3A5C",
      height: 66 + insets.bottom,
      paddingTop: 6,
      paddingBottom: 6 + insets.bottom,
    },
    tabBarActiveTintColor: "#22D3EE",
    tabBarInactiveTintColor: "#8FA1BD",
    tabBarLabel: ({ color, children }: { color: string; children: string }) => (
      <Text
        numberOfLines={1}
        style={{ fontSize: 11, fontWeight: "500", color, lineHeight: 16, textAlign: "center" }}
      >
        {children}
      </Text>
    ),
  };
}
