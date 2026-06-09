import { View, Text } from "react-native";

interface Props {
  value: number | string;
  label: string;
  tone?: "default" | "open" | "progress" | "done";
}

export function StatBlock({ value, label, tone = "default" }: Props) {
  const valueColor =
    tone === "open"
      ? "text-status-open"
      : tone === "progress"
        ? "text-status-progress"
        : tone === "done"
          ? "text-status-done"
          : "text-text";

  return (
    <View className="flex-1 items-center bg-bg-card rounded-2xl py-4 border border-border/40">
      <Text className={`text-3xl font-bold ${valueColor}`}>{value}</Text>
      <Text className="text-text-muted text-xs mt-1">{label}</Text>
    </View>
  );
}
