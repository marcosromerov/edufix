import "../global.css";
import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSessionBootstrap } from "../hooks/useSession";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  useSessionBootstrap();
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <View className="flex-1 bg-bg">
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#1E3046" },
              animation: "fade",
            }}
          />
        </View>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
