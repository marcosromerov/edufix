import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useSession } from "../hooks/useSession";

export default function Index() {
  const { user, status } = useSession();

  if (status === "loading" || status === "idle") {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator size="large" color="#22D3EE" />
      </View>
    );
  }

  if (!user) return <Redirect href="/(auth)/login" />;
  if (user.role === "reportador") return <Redirect href="/(reportador)/(tabs)/inicio" />;
  if (user.role === "jefe") return <Redirect href="/(jefe)/(tabs)/panel" />;
  return <Redirect href="/(operario)/(tabs)/incidencias" />;
}
