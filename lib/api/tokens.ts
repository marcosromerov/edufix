import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "edufix.accessToken";
const REFRESH_KEY = "edufix.refreshToken";

const isWeb = Platform.OS === "web";

// expo-secure-store no soporta web - usamos localStorage como fallback.
// En nativo (iOS/Android) usamos el Keychain/Keystore real via SecureStore.
async function get(key: string): Promise<string | null> {
  try {
    if (isWeb) {
      if (typeof window === "undefined" || !window.localStorage) return null;
      return window.localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function set(key: string, value: string): Promise<void> {
  try {
    if (isWeb) {
      if (typeof window === "undefined" || !window.localStorage) return;
      window.localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch {
    /* no-op */
  }
}

async function del(key: string): Promise<void> {
  try {
    if (isWeb) {
      if (typeof window === "undefined" || !window.localStorage) return;
      window.localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch {
    /* no-op */
  }
}

export const tokens = {
  getAccess: () => get(ACCESS_KEY),
  getRefresh: () => get(REFRESH_KEY),
  async set(access: string, refresh: string): Promise<void> {
    await set(ACCESS_KEY, access);
    await set(REFRESH_KEY, refresh);
  },
  setAccess: (access: string) => set(ACCESS_KEY, access),
  async clear(): Promise<void> {
    await del(ACCESS_KEY);
    await del(REFRESH_KEY);
  },
};
