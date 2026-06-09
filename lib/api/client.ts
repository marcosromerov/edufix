import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_URL } from "./config";
import { tokens } from "./tokens";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Adjuntar Authorization en cada request
api.interceptors.request.use(async (config) => {
  const token = await tokens.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Hook para que la sesion (useSession) sepa cuando el server expulsa
type UnauthorizedHandler = () => void | Promise<void>;
let onUnauthorized: UnauthorizedHandler | null = null;
export function setUnauthorizedHandler(fn: UnauthorizedHandler | null): void {
  onUnauthorized = fn;
}

// Auto-refresh on 401
let refreshing: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  if (refreshing) return refreshing;
  refreshing = (async () => {
    try {
      const refreshToken = await tokens.getRefresh();
      if (!refreshToken) return null;
      const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
      const access = res.data.accessToken as string;
      await tokens.setAccess(access);
      return access;
    } catch {
      return null;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/auth/")
    ) {
      original._retry = true;
      const newAccess = await tryRefresh();
      if (newAccess) {
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api.request(original);
      }
      // Refresh fallido -> kickeo de sesion
      await tokens.clear();
      if (onUnauthorized) await onUnauthorized();
    }
    return Promise.reject(error);
  },
);
