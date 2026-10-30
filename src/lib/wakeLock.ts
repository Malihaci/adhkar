import { useEffect } from "react";

/**
 * Garde l'écran allumé tant que `enabled` est vrai (API Screen Wake Lock :
 * Chrome/Edge/Android, Safari iOS 16.4+). Le navigateur relâche le verrou
 * quand l'onglet passe en arrière-plan ou que l'écran est éteint à la main :
 * on le redemande au retour. Sans support ou refus (économie d'énergie), rien
 * ne se passe — jamais d'erreur visible.
 */
export function useWakeLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof navigator === "undefined" || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;

    const acquire = async () => {
      if (cancelled || lock || document.visibilityState !== "visible") return;
      try {
        const next = await navigator.wakeLock.request("screen");
        if (cancelled) {
          void next.release();
          return;
        }
        lock = next;
        next.addEventListener("release", () => {
          if (lock === next) lock = null;
        });
      } catch {
        /* refusé (batterie faible, mode économie d'énergie…) */
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") void acquire();
    };

    document.addEventListener("visibilitychange", onVisible);
    void acquire();
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      void lock?.release();
      lock = null;
    };
  }, [enabled]);
}
