import { useEffect, useState, useCallback } from "react";
import type { DhikrCategory } from "@/data/adhkar";

const isBrowser = typeof window !== "undefined";

export function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("adhkar-storage", { detail: { key } }));
  } catch {
    /* ignore */
  }
}

export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(readJSON<T>(key, initial));
    setHydrated(true);
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key?: string } | undefined;
      if (!detail || detail.key === key) {
        setValue(readJSON<T>(key, initial));
      }
    };
    window.addEventListener("adhkar-storage", onChange);
    return () => window.removeEventListener("adhkar-storage", onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const nextVal = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        writeJSON(key, nextVal);
        return nextVal;
      });
    },
    [key],
  );

  return [value, update, hydrated] as const;
}

// ---- Adhkar-specific helpers -------------------------------------------------

const todayKey = () => new Date().toISOString().slice(0, 10);

export interface DailyProgress {
  date: string;
  counts: Record<string, number>;
}

export function useDailyProgress() {
  const [progress, setProgress, hydrated] = useLocalState<DailyProgress>("adhkar:progress", {
    date: todayKey(),
    counts: {},
  });

  // Reset when the day changes (after hydration, on focus, visibility, and every minute)
  useEffect(() => {
    if (!hydrated) return;
    const check = () => {
      const today = todayKey();
      setProgress((p) => (p.date !== today ? { date: today, counts: {} } : p));
    };
    check();
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    const id = window.setInterval(check, 60_000);
    return () => {
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const increment = useCallback(
    (id: string, max: number) => {
      setProgress((p) => {
        const current = p.counts[id] ?? 0;
        if (current >= max) return p;
        return { ...p, counts: { ...p.counts, [id]: current + 1 } };
      });
    },
    [setProgress],
  );

  const decrement = useCallback(
    (id: string) => {
      setProgress((p) => {
        const current = p.counts[id] ?? 0;
        if (current <= 0) return p;
        return { ...p, counts: { ...p.counts, [id]: current - 1 } };
      });
    },
    [setProgress],
  );

  const reset = useCallback(
    (id: string) => {
      setProgress((p) => ({ ...p, counts: { ...p.counts, [id]: 0 } }));
    },
    [setProgress],
  );

  const setLastRead = useCallback((id: string, category: DhikrCategory, index?: number) => {
    writeJSON("adhkar:last-read", { id, category, index, at: Date.now() });
  }, []);

  return { progress, increment, decrement, reset, setLastRead };
}

export interface LastRead {
  id?: string;
  category?: DhikrCategory;
  index?: number;
  at?: number;
}

export function getLastReadIndex(category: DhikrCategory): number | null {
  const raw = readJSON<LastRead | null>("adhkar:last-read", null);
  if (!raw || raw.category !== category) return null;
  return typeof raw.index === "number" ? raw.index : null;
}

export type FavoriteType = "dhikr" | "ayah";

export interface FavoriteEntry {
  type: FavoriteType;
  id: string;
}

/**
 * Favoris universels (§ favoris transversaux) : un dhikr (ID stable, quelle
 * que soit sa catégorie) ou une ayah (verseKey "sourate:ayah"), jamais une
 * position dans une liste. Migration idempotente depuis l'ancien format
 * (tableau d'IDs de dhikr uniquement) : aucune perte, aucun doublon — un
 * ancien favori "morning-1" redevient { type: "dhikr", id: "morning-1" }.
 */
function normalizeFavorite(item: unknown): FavoriteEntry | null {
  if (typeof item === "string") return { type: "dhikr", id: item };
  if (item && typeof item === "object" && "id" in item && "type" in item) {
    const t = (item as { type: unknown }).type;
    const id = (item as { id: unknown }).id;
    if ((t === "dhikr" || t === "ayah") && typeof id === "string") return { type: t, id };
  }
  return null;
}

export function useFavorites() {
  const [raw, setRaw, hydrated] = useLocalState<unknown[]>("adhkar:favorites", []);
  const favorites = raw
    .map(normalizeFavorite)
    .filter((f): f is FavoriteEntry => f !== null);

  const toggle = useCallback(
    (type: FavoriteType, id: string) => {
      setRaw((prev) => {
        const list = prev.map(normalizeFavorite).filter((f): f is FavoriteEntry => f !== null);
        const exists = list.some((f) => f.type === type && f.id === id);
        return exists
          ? list.filter((f) => !(f.type === type && f.id === id))
          : [...list, { type, id }];
      });
    },
    [setRaw],
  );

  return {
    favorites,
    toggle,
    hydrated,
    isFavorite: (type: FavoriteType, id: string) =>
      favorites.some((f) => f.type === type && f.id === id),
  };
}

export interface ActionProgress {
  completed: boolean;
  completedAt: number;
}

/**
 * Cases « Je l'ai mise en pratique » (Agir). Ne représente jamais un score
 * ou un niveau — seulement le fait qu'une action a été réalisée.
 */
export function useActionsProgress() {
  const [progress, setProgress, hydrated] = useLocalState<Record<string, ActionProgress>>(
    "adhkar:actions",
    {},
  );
  const toggle = useCallback(
    (actionId: string) => {
      setProgress((prev) => {
        const isDone = !!prev[actionId]?.completed;
        if (isDone) {
          const next = { ...prev };
          delete next[actionId];
          return next;
        }
        return { ...prev, [actionId]: { completed: true, completedAt: Date.now() } };
      });
    },
    [setProgress],
  );
  return {
    isCompleted: (actionId: string) => !!progress[actionId]?.completed,
    toggle,
    hydrated,
  };
}

export type ThemeMode = "auto" | "light" | "dark";

/**
 * "Automatique" (préférence système) est le mode par défaut — §6 de la
 * mission. `resolvedTheme` est ce qui est réellement appliqué (jamais
 * "auto"), à utiliser pour l'affichage d'une icône ou d'un libellé.
 */
export function useTheme() {
  const [mode, setMode] = useLocalState<ThemeMode>("adhkar:theme", "auto");
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    if (!isBrowser) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme: "light" | "dark" =
    mode === "auto" ? (systemDark ? "dark" : "light") : mode;

  useEffect(() => {
    if (!isBrowser) return;
    const root = document.documentElement;
    if (resolvedTheme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [resolvedTheme]);

  return {
    mode,
    setMode,
    theme: resolvedTheme,
    toggle: () => setMode(resolvedTheme === "dark" ? "light" : "dark"),
  };
}
