import { Redirect } from "expo-router";
import { useSession } from "../hooks/useSession";

export default function Index() {
  const { user } = useSession();
  if (!user) return <Redirect href="/(auth)/login" />;
  if (user.role === "reportador") return <Redirect href="/(reportador)/(tabs)/inicio" />;
  if (user.role === "jefe") return <Redirect href="/(jefe)/(tabs)/panel" />;
  return <Redirect href="/(operario)/(tabs)/incidencias" />;
}
