import { Redirect } from "expo-router";

export default function Index() {
  // Demo mode: la pantalla raiz siempre redirige al onboarding.
  // El onboarding se encarga del flujo: "Empezar" -> /login -> dashboard.
  return <Redirect href="/onboarding" />;
}
