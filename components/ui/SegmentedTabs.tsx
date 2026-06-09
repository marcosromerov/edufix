import { View, Text, Pressable } from "react-native";

interface Props {
  tabs: { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
}

export function SegmentedTabs({ tabs, value, onChange }: Props) {
  return (
    <View className="flex-row bg-bg-input rounded-xl p-1">
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            className={`flex-1 py-2 rounded-lg ${active ? "bg-accent" : ""}`}
          >
            <Text
              className={`text-center text-xs font-semibold ${active ? "text-bg" : "text-text-muted"}`}
            >
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
