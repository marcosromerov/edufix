import { useSyncExternalStore } from "react";
import { Role, User } from "../data/types";
import { users } from "../data/users";

type SessionState = {
  user: User | null;
};

let state: SessionState = { user: null };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const session = {
  login(role: Role) {
    const u = users.find((x) => x.role === role) ?? null;
    state = { user: u };
    emit();
  },
  logout() {
    state = { user: null };
    emit();
  },
  updateUser(patch: Partial<User>) {
    if (!state.user) return;
    state = { user: { ...state.user, ...patch } };
    emit();
  },
  get() {
    return state;
  },
};

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
