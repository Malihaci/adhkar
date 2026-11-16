/**
 * Série de jours : un jour est « validé » quand les adhkār du matin ET du soir
 * sont terminés. Tout reste sur l'appareil (jamais partagé, aucun classement).
 * La série compte les jours validés consécutifs ; aujourd'hui, tant qu'il n'est
 * pas validé, ne casse pas la série (elle compte jusqu'à hier).
 */
import { useEffect } from "react";
import { todayKey } from "@/lib/dhikrCounter";
import { useLocalState } from "@/lib/storage";

const KEY = "adhkar:streak-days";
const SEEN_KEY = "adhkar:streak-seen";
/** Paliers courts au début, plus longs ensuite. */
export const STREAK_STEPS = [3, 10, 21, 40] as const;

function addDays(key: string, delta: number): string {
  const [y, m, d] = key.split("-").map(Number);
  return todayKey(new Date(y, m - 1, d + delta));
}

export function computeStreak(days: string[], today = todayKey()): number {
  const set = new Set(days);
  let cursor = set.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (set.has(cursor)) {
    n += 1;
    cursor = addDays(cursor, -1);
  }
  return n;
}

/** Les 7 derniers jours (le plus ancien d'abord) : validé ou non. */
export function lastSevenDays(days: string[], today = todayKey()): { key: string; done: boolean }[] {
  const set = new Set(days);
  return Array.from({ length: 7 }, (_, i) => {
    const key = addDays(today, i - 6);
    return { key, done: set.has(key) };
  });
}

/** Suit la série ; `bothDone` = matin et soir terminés aujourd'hui. */
export function useStreak(bothDone: boolean) {
  const [days, setDays, hydrated] = useLocalState<string[]>(KEY, []);
  const [seen, setSeen] = useLocalState<number>(SEEN_KEY, 0);
  const today = todayKey();

  useEffect(() => {
    if (!hydrated || !bothDone) return;
    setDays((d) => (d.includes(today) ? d : [...d, today].slice(-120)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, bothDone, today]);

  const streak = computeStreak(days, today);
  const week = lastSevenDays(days, today);
  const reached = [...STREAK_STEPS].reverse().find((s) => streak >= s) ?? 0;
  const celebrate = hydrated && reached > seen ? reached : 0;
  const dismissCelebration = () => setSeen(reached);

  return { streak, week, celebrate, dismissCelebration, hydrated };
}
