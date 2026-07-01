import { useSyncExternalStore } from "react";

export type ToastKind = "success" | "info" | "error";
type ToastState = { message: string; kind: ToastKind; token: number };

let state: ToastState = { message: "", kind: "success", token: 0 };
const listeners = new Set<() => void>();

/** Muestra un aviso in-app (toast branded). Funciona en web y mobile. */
export function showToast(message: string, kind: ToastKind = "success"): void {
  state = { message, kind, token: state.token + 1 };
  listeners.forEach((l) => l());
}

export function useToast(): ToastState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}
