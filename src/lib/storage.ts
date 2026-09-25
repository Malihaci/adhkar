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

export function useFavorites() {
  const [favorites, setFavorites, hydrated] = useLocalState<string[]>("adhkar:favorites", []);
  const toggle = useCallback(
    (id: string) => {
      setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    },
    [setFavorites],
  );
  return {
    favorites,
    toggle,
    hydrated,
    isFavorite: (id: string) => favorites.includes(id),
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

export function useTheme() {
  const [theme, setTheme] = useLocalState<"light" | "dark">("adhkar:theme", "light");
  useEffect(() => {
    if (!isBrowser) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);
  return { theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}
