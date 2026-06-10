import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const KEY = "edufix.onboardingSeen";
const isWeb = Platform.OS === "web";

// Mismo patrón que lib/api/tokens.ts: SecureStore en nativo, localStorage en web.
async function get(): Promise<string | null> {
  try {
    if (isWeb) {
      if (typeof window === "undefined" || !window.localStorage) return null;
      return window.localStorage.getItem(KEY);
    }
    return await SecureStore.getItemAsync(KEY);
  } catch {
    return null;
  }
}

async function set(value: string): Promise<void> {
  try {
    if (isWeb) {
      if (typeof window === "undefined" || !window.localStorage) return;
      window.localStorage.setItem(KEY, value);
      return;
    }
    await SecureStore.setItemAsync(KEY, value);
  } catch {
    /* no-op */
  }
}

export const onboarding = {
  /** true si el usuario ya pasó por el onboarding alguna vez. */
  async hasSeen(): Promise<boolean> {
    return (await get()) === "1";
  },
  /** Marca el onboarding como visto (no vuelve a aparecer al abrir la app). */
  async markSeen(): Promise<void> {
    await set("1");
  },
  /** Borra el flag — útil para volver a mostrar el onboarding (demo / testing). */
  async reset(): Promise<void> {
    try {
      if (isWeb) {
        window.localStorage?.removeItem(KEY);
        return;
      }
      await SecureStore.deleteItemAsync(KEY);
    } catch {
      /* no-op */
    }
  },
};
