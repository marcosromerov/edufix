import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ReportadorTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1A2740",
          borderTopColor: "#2A3A5C",
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: "#22D3EE",
        tabBarInactiveTintColor: "#8FA1BD",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "500" },
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="incidencias"
        options={{
          title: "Incidencias",
          tabBarIcon: ({ color, size }) => <Ionicons name="file-tray-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="escanear"
        options={{
          title: "Reportar",
          tabBarIcon: ({ color, size }) => <Ionicons name="scan-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notificaciones"
        options={{
          title: "Avisos",
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
