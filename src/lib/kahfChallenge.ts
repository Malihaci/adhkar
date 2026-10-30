import { useCallback, useEffect, useState } from "react";
import { readJSON, useLocalState, writeJSON } from "@/lib/storage";
import { usePrayerTimings } from "@/lib/prayerTimes";
import { AL_KAHF_PAGE } from "@/lib/reminders";

/** Dernière page de sourate Al-Kahf dans le Mushaf de Médine (604 pages). */
export const AL_KAHF_LAST_PAGE = 304;
const KAHF_PAGES = AL_KAHF_LAST_PAGE - AL_KAHF_PAGE + 1;

const KEY = "adhkar:kahf:v1";
const FALLBACK_MAGHRIB = "18:00";

/** Avancement du défi pour UN vendredi précis (`friday` = date locale AAAA-MM-JJ). */
interface KahfState {
  friday: string;
  /** Page la plus avancée atteinte pendant ce défi (0 = pas commencé). */
  page: number;
  done: boolean;
}

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * Le « vendredi » islamique commence au Maghrib du jeudi : renvoie la date du
 * vendredi concerné tant qu'on est entre le Maghrib de jeudi et celui de
 * vendredi, sinon `null`. L'heure du Maghrib du jour sert aux deux soirs (écart
 * d'une ou deux minutes d'un jour à l'autre).
 */
export function kahfFridayKey(now: Date, maghrib?: string | null): string | null {
  const [h, m] = (maghrib || FALLBACK_MAGHRIB).split(":").map(Number);
  const cut = new Date(now);
  cut.setHours(h || 0, m || 0, 0, 0);
  const day = now.getDay();
  if (day === 4 && now.getTime() >= cut.getTime()) {
    const friday = new Date(now);
    friday.setDate(friday.getDate() + 1);
    return dayKey(friday);
  }
  if (day === 5 && now.getTime() < cut.getTime()) return dayKey(now);
  return null;
}

/** Défi « lire Al-Kahf » : actif de jeudi Maghrib à vendredi Maghrib, terminé
 * dès que la dernière page de la sourate a été atteinte dans le Mushaf. */
export function useKahfChallenge() {
  const { timings } = usePrayerTimings();
  const [stored, , hydrated] = useLocalState<KahfState | null>(KEY, null);
  const [now, setNow] = useState(() => new Date());

  // La pastille apparaît / disparaît d'elle-même, sans rechargement.
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  const friday = hydrated ? kahfFridayKey(now, timings?.Maghrib) : null;
  const current = friday && stored?.friday === friday ? stored : null;

  const record = useCallback(
    (page: number) => {
      if (!friday || page < AL_KAHF_PAGE || page > AL_KAHF_LAST_PAGE) return;
      const saved = readJSON<KahfState | null>(KEY, null);
      const base: KahfState =
        saved?.friday === friday ? saved : { friday, page: 0, done: false };
      const next: KahfState = {
        friday,
        page: Math.max(base.page, page),
        done: base.done || page >= AL_KAHF_LAST_PAGE,
      };
      if (next.page !== base.page || next.done !== base.done || saved?.friday !== friday) {
        writeJSON(KEY, next);
      }
    },
    [friday],
  );

  const reached = current?.page ?? 0;
  return {
    active: !!friday,
    done: !!current?.done,
    /** Page où reprendre : la plus avancée atteinte, sinon le début de la sourate. */
    resumePage: Math.min(AL_KAHF_LAST_PAGE, Math.max(AL_KAHF_PAGE, reached)),
    pagesRead: reached ? reached - AL_KAHF_PAGE + 1 : 0,
    totalPages: KAHF_PAGES,
    record,
  };
}
