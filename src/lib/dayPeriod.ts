import { useEffect, useState } from "react";
import type { PrayerTimings } from "@/lib/prayerTimes";

/** Dhikr à proposer selon le moment de la journée (horaires de prière réels). */
export type AdhkarMoment = "morning" | "evening" | "sleep" | null;

export interface DayPeriod {
  /** Fajr → Maghrib : soleil, ciel clair ; sinon lune, ciel de nuit. */
  isDay: boolean;
  /** Fajr → Dhuhr : matin · ʿAsr → ʿIshāʾ : soir · ʿIshāʾ → minuit : avant de dormir. */
  adhkar: AdhkarMoment;
}

const FALLBACK = { Fajr: "05:30", Dhuhr: "13:00", Asr: "16:30", Maghrib: "19:00", Isha: "20:30" };

function minutesOf(hhmm: string | undefined, fallback: string): number {
  const m = (hhmm ?? "").match(/(\d{1,2}):(\d{2})/) ?? fallback.match(/(\d{1,2}):(\d{2})/)!;
  return Number(m[1]) * 60 + Number(m[2]);
}

export function getDayPeriod(now: Date, timings: PrayerTimings | null): DayPeriod {
  const t = now.getHours() * 60 + now.getMinutes();
  const fajr = minutesOf(timings?.Fajr, FALLBACK.Fajr);
  const dhuhr = minutesOf(timings?.Dhuhr, FALLBACK.Dhuhr);
  const asr = minutesOf(timings?.Asr, FALLBACK.Asr);
  const maghrib = minutesOf(timings?.Maghrib, FALLBACK.Maghrib);
  const isha = minutesOf(timings?.Isha, FALLBACK.Isha);
  const adhkar: AdhkarMoment =
    t >= fajr && t < dhuhr ? "morning" : t >= asr && t < isha ? "evening" : t >= isha ? "sleep" : null;
  return { isDay: t >= fajr && t < maghrib, adhkar };
}

/** Moment courant, recalculé chaque minute (la carte apparaît/disparaît seule). */
export function useDayPeriod(timings: PrayerTimings | null): DayPeriod & { now: Date } {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return { ...getDayPeriod(now, timings), now };
}
