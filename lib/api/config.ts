import Constants from "expo-constants";

const fromConfig = Constants.expoConfig?.extra?.apiUrl as string | undefined;

export const API_URL =
  fromConfig ?? "https://edufix-production.up.railway.app";
