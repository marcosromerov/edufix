import { useSyncExternalStore, useEffect } from "react";
import { User } from "../data/types";
import {
  loginApi,
  registerApi,
  meApi,
  logoutApi,
  type RegisterPayload,
} from "../lib/api/endpoints";
import { tokens } from "../lib/api/tokens";
import { setUnauthorizedHandler } from "../lib/api/client";

type SessionState = {
  user: User | null;
  status: "idle" | "loading" | "ready";
};

let state: SessionState = { user: null, status: "loading" };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

function setState(next: Partial<SessionState>) {
  state = { ...state, ...next };
  emit();
}

export const session = {
  async bootstrap() {
    try {
      const access = await tokens.getAccess();
      if (!access) {
        setState({ status: "ready", user: null });
        return;
      }
      try {
        const user = await meApi();
        setState({ status: "ready", user });
      } catch {
        await tokens.clear();
        setState({ status: "ready", user: null });
      }
    } catch (e) {
      // Cualquier error inesperado (storage roto, etc) -> seguir como logged out
      console.warn("[session] bootstrap fallo, sigo como logged out:", e);
      setState({ status: "ready", user: null });
    }
  },
  async login(email: string, password: string) {
    const { user, accessToken, refreshToken } = await loginApi(email, password);
    await tokens.set(accessToken, refreshToken);
    setState({ user, status: "ready" });
    return user;
  },
  async register(payload: RegisterPayload): Promise<User | { pending: true }> {
    const result = await registerApi(payload);
    if ("pending" in result && result.pending) {
      return { pending: true };
    }
    const { user, accessToken, refreshToken } = result as import("../lib/api/endpoints").AuthResponse;
    await tokens.set(accessToken, refreshToken);
    setState({ user, status: "ready" });
    return user;
  },
  async logout() {
    try {
      await logoutApi();
    } catch {
      /* ignore - igual borramos local */
    }
    await tokens.clear();
    setState({ user: null, status: "ready" });
  },
  updateLocalUser(patch: Partial<User>) {
    if (!state.user) return;
    setState({ user: { ...state.user, ...patch } });
  },
  get() {
    return state;
  },
};

// Cuando el interceptor expulsa por 401 sin refresh, sacamos el user del store
setUnauthorizedHandler(() => {
  state = { user: null, status: "ready" };
  emit();
});

export function useSession() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}

/** Hook que arranca la carga inicial. Llamalo desde el root layout. */
export function useSessionBootstrap() {
  useEffect(() => {
    if (state.status === "loading") {
      void session.bootstrap();
    }
  }, []);
}
