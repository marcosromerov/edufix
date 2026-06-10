import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useSession } from "../hooks/useSession";
import { useHasSeenOnboarding } from "../hooks/useOnboarding";

export default function Index() {
  const { user, status } = useSession();
  const seenOnboarding = useHasSeenOnboarding();

  if (status === "loading" || status === "idle" || seenOnboarding === null) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator size="large" color="#22D3EE" />
      </View>
    );
  }

  // Primer arranque sin sesión: mostramos el onboarding una vez.
  if (!user && !seenOnboarding) return <Redirect href="/onboarding" />;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (user.role === "reportador") return <Redirect href="/(reportador)/(tabs)/inicio" />;
  if (user.role === "jefe") return <Redirect href="/(jefe)/(tabs)/panel" />;
  return <Redirect href="/(operario)/(tabs)/incidencias" />;
}
