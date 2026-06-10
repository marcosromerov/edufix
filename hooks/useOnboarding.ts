import { useEffect, useState } from "react";
import { onboarding } from "../lib/onboarding";

/**
 * Lee el flag de onboarding una vez al montar.
 * Devuelve: null = cargando, true/false = ya visto / no visto.
 */
export function useHasSeenOnboarding(): boolean | null {
  const [seen, setSeen] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    onboarding.hasSeen().then((v) => {
      if (active) setSeen(v);
    });
    return () => {
      active = false;
    };
  }, []);
  return seen;
}
