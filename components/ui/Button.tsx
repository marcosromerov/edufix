import { Pressable, Text, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Variant = "primary" | "danger" | "ghost" | "secondary";

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  icon,
  loading,
  disabled,
  className = "",
}: Props) {
  const styles = {
    primary: "bg-accent",
    danger: "bg-danger",
    ghost: "bg-transparent border border-border",
    secondary: "bg-bg-input",
  }[variant];

  const textColor = {
    primary: "text-bg",
    danger: "text-white",
    ghost: "text-text",
    secondary: "text-text",
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${styles} ${disabled || loading ? "opacity-60" : ""} rounded-xl py-3.5 px-4 active:opacity-80 ${className}`}
    >
      <View className="flex-row items-center justify-center gap-2">
        {loading ? (
          <ActivityIndicator color={variant === "primary" ? "#0F1B2D" : "#fff"} />
        ) : icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={variant === "primary" ? "#0F1B2D" : "#fff"}
          />
        ) : null}
        <Text className={`${textColor} font-semibold text-base`}>{title}</Text>
      </View>
    </Pressable>
  );
}
