import { View, Text, ActivityIndicator } from "react-native";

export function LoadingView({ label }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <ActivityIndicator size="large" color="#22D3EE" />
      {label ? (
        <Text className="text-text-muted mt-3 text-sm">{label}</Text>
      ) : null}
    </View>
  );
}

export function EmptyView({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="items-center py-10">
      <Text className="text-text font-semibold text-base">{title}</Text>
      {subtitle ? (
        <Text className="text-text-muted text-sm mt-1 text-center">{subtitle}</Text>
      ) : null}
    </View>
  );
}

export function ErrorView({ message }: { message?: string }) {
  return (
    <View className="items-center py-10">
      <Text className="text-danger font-semibold text-base">Algo salió mal</Text>
      {message ? (
        <Text className="text-text-muted text-sm mt-1 text-center px-6">
          {message}
        </Text>
      ) : null}
    </View>
  );
}
