import { Image } from "react-native";

const logoSource = require("../../assets/images/logo.png");

// Native aspect ratio of logo.png is 865:203 (~4.26:1)
const ASPECT = 865 / 203;

const heights = {
  sm: 32,
  md: 52,
  lg: 76,
} as const;

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const height = heights[size];
  return (
    <Image
      source={logoSource}
      style={{ height, width: height * ASPECT }}
      resizeMode="contain"
      accessibilityLabel="Edu Fix"
    />
  );
}
