/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#1E3046",
          card: "#1A2740",
          input: "#243352",
          muted: "#2C3E5C",
        },
        accent: {
          DEFAULT: "#22D3EE",
          dark: "#06B6D4",
        },
        status: {
          open: "#F59E0B",
          progress: "#22D3EE",
          done: "#10B981",
          critical: "#EF4444",
        },
        danger: "#F43F5E",
        text: {
          DEFAULT: "#E6EDF7",
          muted: "#8FA1BD",
          dim: "#5C7090",
        },
        border: "#2A3A5C",
      },
    },
  },
  plugins: [],
};
