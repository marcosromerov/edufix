import { View, Text } from "react-native";

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2.5 border-b border-border/40">
      <Text className="text-text-muted text-sm">{label}</Text>
      <Text className="text-text text-sm font-medium">{value}</Text>
    </View>
  );
}
