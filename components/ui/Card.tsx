import { View, ViewProps } from "react-native";

interface Props extends ViewProps {
  className?: string;
}

export function Card({ children, className = "", ...rest }: Props) {
  return (
    <View
      className={`bg-bg-card rounded-2xl p-4 border border-border/40 ${className}`}
      {...rest}
    >
      {children}
    </View>
  );
}
