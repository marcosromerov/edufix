import { View, Text, TextInput, TextInputProps } from "react-native";

interface Props extends TextInputProps {
  label?: string;
  helperText?: string;
}

export function Input({ label, helperText, className, ...rest }: Props) {
  return (
    <View className="gap-1.5">
      {label ? (
        <Text className="text-text-muted text-sm font-medium">{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor="#5C7090"
        className={`bg-bg-input text-text px-3.5 py-3 rounded-xl border border-border/60 ${className ?? ""}`}
        {...rest}
      />
      {helperText ? (
        <Text className="text-text-dim text-xs">{helperText}</Text>
      ) : null}
    </View>
  );
}
