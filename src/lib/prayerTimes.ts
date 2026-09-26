/**
 * Horaires de prière — Al Adhan API (Islamic Network), documentée
 * publiquement sur https://aladhan.com/prayer-times-api. Aucun calcul
 * arbitraire, aucun scraping : uniquement cette API publique officielle.
 *
 * Deux endpoints utilisés :
 * - /v1/timings (latitude/longitude) — localisation automatique.
 * - /v1/timingsByCity (ville/pays) — saisie manuelle.
 * Vérifié en direct (26/09/2026) : les deux renvoient la même forme de
 * réponse `{ data: { timings: {...}, meta: {...} } }`.
 */

import { readJSON, writeJSON } from "@/lib/storage";

const API = "https://api.aladhan.com/v1";

export type PrayerKey = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
export const PRAYER_KEYS: PrayerKey[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
export const PRAYER_LABELS: Record<PrayerKey, string> = {
  Fajr: "Fajr",
  Sunrise: "Lever du soleil",
  Dhuhr: "Dhuhr",
  Asr: "ʿAsr",
  Maghrib: "Maghrib",
  Isha: "ʿIshāʾ",
};

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

/** Méthodes de calcul réellement supportées par l'API (liste officielle /v1/methods). */
export const CALC_METHODS = [
  { id: 3, name: "Muslim World League" },
  { id: 2, name: "Islamic Society of North America (ISNA)" },
  { id: 5, name: "Égypte (Egyptian General Authority)" },
  { id: 4, name: "Umm al-Qura (Makkah)" },
  { id: 12, name: "Union des Organisations Islamiques de France (UOIF)" },
  { id: 1, name: "Karachi (University of Islamic Sciences)" },
] as const;

export type LocationMode = "auto" | "manual";

export interface PrayerSettings {
  mode: LocationMode;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  methodId: number;
  /** École ʿAsr — 0 = Shafi'i/Maliki/Hanbali (défaut API), 1 = Hanafi. */
  school: 0 | 1;
}

const SETTINGS_KEY = "adhkar:prayer-settings";

export const DEFAULT_PRAYER_SETTINGS: PrayerSettings = {
  mode: "manual",
  city: "Paris",
  country: "France",
  methodId: 12,
  school: 0,
};

export function getPrayerSettings(): PrayerSettings {
  return readJSON<PrayerSettings>(SETTINGS_KEY, DEFAULT_PRAYER_SETTINGS);
}

export function setPrayerSettings(s: PrayerSettings) {
  writeJSON(SETTINGS_KEY, s);
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface CachedTimings {
  dateISO: string;
  settingsKey: string;
  timings: PrayerTimings;
  timezone: string;
}

const CACHE_KEY = "adhkar:prayer-timings-cache";

function settingsCacheKey(s: PrayerSettings): string {
  return s.mode === "auto"
    ? `auto:${s.latitude?.toFixed(2)}:${s.longitude?.toFixed(2)}:${s.methodId}:${s.school}`
    : `manual:${s.city}:${s.country}:${s.methodId}:${s.school}`;
}

/**
 * Horaires du jour, avec cache localStorage (une seule requête par jour et
 * par réglage — §27 performance). Retourne `null` si l'API est injoignable
 * ou si aucune localisation n'est configurée : jamais d'horaire inventé.
 */
export async function fetchTodayTimings(settings: PrayerSettings): Promise<PrayerTimings | null> {
  const key = settingsCacheKey(settings);
  const cached = readJSON<CachedTimings | null>(CACHE_KEY, null);
  if (cached && cached.dateISO === todayISO() && cached.settingsKey === key) {
    return cached.timings;
  }
  try {
    const params = new URLSearchParams({
      method: String(settings.methodId),
      school: String(settings.school),
    });
    let url: string;
    if (settings.mode === "auto" && settings.latitude != null && settings.longitude != null) {
      params.set("latitude", String(settings.latitude));
      params.set("longitude", String(settings.longitude));
      url = `${API}/timings?${params.toString()}`;
    } else if (settings.mode === "manual" && settings.city && settings.country) {
      params.set("city", settings.city);
      params.set("country", settings.country);
      url = `${API}/timingsByCity?${params.toString()}`;
    } else {
      return null;
    }
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.code !== 200 || !json.data?.timings) return null;
    const t = json.data.timings as Record<string, string>;
    const timings: PrayerTimings = {
      Fajr: t.Fajr,
      Sunrise: t.Sunrise,
      Dhuhr: t.Dhuhr,
      Asr: t.Asr,
      Maghrib: t.Maghrib,
      Isha: t.Isha,
    };
    writeJSON<CachedTimings>(CACHE_KEY, {
      dateISO: todayISO(),
      settingsKey: key,
      timings,
      timezone: json.data.meta?.timezone ?? "",
    });
    return timings;
  } catch {
    return null;
  }
}

/** "16:52" -> Date d'aujourd'hui à cette heure locale. */
function timeToday(hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export interface NextPrayer {
  key: PrayerKey;
  time: Date;
}

/** Prochaine prière à venir (boucle sur le lendemain si toutes sont passées). */
export function getNextPrayer(timings: PrayerTimings, now = new Date()): NextPrayer | null {
  for (const key of PRAYER_KEYS) {
    const t = timeToday(timings[key]);
    if (t.getTime() > now.getTime()) return { key, time: t };
  }
  const first = timeToday(timings.Fajr);
  first.setDate(first.getDate() + 1);
  return { key: "Fajr", time: first };
}

/** Heure d'ʿAsr du jour sous forme de Date, ou `null` si horaires indisponibles. */
export function getAsrDateFromTimings(timings: PrayerTimings | null): Date | null {
  if (!timings?.Asr) return null;
  return timeToday(timings.Asr);
}
