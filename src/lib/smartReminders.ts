/**
 * Rappels intelligents — Prières + Adhkār + Mon Wird (chantier "Rappels
 * intelligents"). Petit moteur de règles 100% local : aucun LLM, aucun
 * cloud, aucun backend de recommandation, aucun polling permanent — il se
 * contente d'évaluer, à chaque tick du moteur existant (`useReminderEngine`,
 * toutes les 30s, premier plan uniquement — même limite PWA documentée dans
 * reminders.ts), si une notification Adhkār ou Wird est utile MAINTENANT.
 *
 * Les PRIÈRES restent gérées par le mécanisme existant et déjà correct
 * (`ReminderConfig` à `prayerKey`, `checkDueReminders`/`resolveReminderTime`
 * dans reminders.ts) — source temporelle centrale unique (usePrayerTimings),
 * recalculée à chaque tick, donc déjà "reprogrammée" automatiquement dès que
 * mosquée/méthode/localisation changent, sans rien à annuler explicitement.
 * Ce module n'ajoute que ce qui manquait : Adhkār (matin/soir, seulement si
 * non terminés) et Mon Wird (portion du jour, jamais reparti de zéro).
 *
 * Priorité (§3 mission) : prière imminente > Adhkār du moment > Wird. En
 * pratique : on évite de notifier Adhkār/Wird trop près d'une heure de
 * prière (`isNearAnyPrayerTime`), et un délai minimal global entre deux
 * notifications intelligentes évite l'empilement (`MIN_GLOBAL_GAP_MS`).
 */
import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import { readJSON, useLocalState, type DailyProgress } from "@/lib/storage";
import { fetchTodayTimings, getPrayerSettings, type PrayerTimings } from "@/lib/prayerTimes";
import { getWirdResumeTarget, type WirdState } from "@/lib/khatma";

/** Dupliqué à l'identique depuis reminders.ts (pas importé) pour éviter une
 * dépendance circulaire entre les deux moteurs — reminders.ts a besoin des
 * préférences de ce module pour désactiver ses anciens rappels matin/soir/
 * Wird à heure fixe quand le mode intelligent est actif. */
function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export type WirdReminderMode = "after-fajr" | "after-morning-adhkar" | "custom" | "off";

export interface SmartReminderPrefs {
  /** Mode intelligent global (§2 mission) — coupe tout le moteur d'un coup. */
  enabled: boolean;
  prayers: boolean;
  adhkar: boolean;
  wird: boolean;
  /** "Ne pas déranger" — aucune notification intelligente dans cette
   * plage horaire quotidienne (peut chevaucher minuit). */
  quietStart: string;
  quietEnd: string;
  wirdMode: WirdReminderMode;
  /** Utilisée seulement si `wirdMode === "custom"`. */
  wirdCustomTime: string;
}

export const DEFAULT_SMART_PREFS: SmartReminderPrefs = {
  enabled: true,
  prayers: true,
  adhkar: true,
  wird: true,
  quietStart: "23:00",
  quietEnd: "05:00",
  // Recommandé par la mission : le Wird suit le rythme du matin plutôt
  // qu'une heure fixe (jamais 20h30 par défaut).
  wirdMode: "after-morning-adhkar",
  wirdCustomTime: "20:30",
};

const SMART_PREFS_KEY = "adhkar:smart-reminders";

export function useSmartReminderPrefs() {
  return useLocalState<SmartReminderPrefs>(SMART_PREFS_KEY, DEFAULT_SMART_PREFS);
}

/** IDs déterministes (§15 mission) — un seul déclenchement par jour et par
 * élément, jamais un doublon, jamais basés sur un index instable. */
function todayISO(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface SmartFireLog {
  /** id -> date (YYYY-MM-DD) où il a déjà sonné aujourd'hui. */
  fired: Record<string, string>;
  /** Horodatage (ms) de la dernière notification intelligente, toutes
   * catégories confondues — anti-empilement (§3/§13/§15 mission). */
  lastFiredAt?: number;
}

const FIRELOG_KEY = "adhkar:smart-firelog";

function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Plage "Ne pas déranger" — gère le passage de minuit (ex. 23:00 → 05:00). */
export function inQuietHours(now: Date, start: string, end: string): boolean {
  const mins = now.getHours() * 60 + now.getMinutes();
  const s = hhmmToMinutes(start);
  const e = hhmmToMinutes(end);
  if (s === e) return false;
  return s < e ? mins >= s && mins < e : mins >= s || mins < e;
}

/** Évite de faire sonner Adhkār/Wird juste avant/après une heure de prière
 * (§3 mission — priorité prière). Fenêtre volontairement courte : ne bloque
 * jamais longtemps une notification réellement utile. */
function isNearAnyPrayerTime(now: Date, timings: PrayerTimings | null, bufferMin = 10): boolean {
  if (!timings) return false;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (const hhmm of Object.values(timings)) {
    const t = hhmmToMinutes(hhmm as string);
    if (Math.abs(nowMin - t) <= bufferMin) return true;
  }
  return false;
}

function adhkarProgress(list: { id: string; repetitions: number }[], counts: Record<string, number>) {
  const total = list.reduce((n, d) => n + d.repetitions, 0);
  const completed = list.reduce((n, d) => n + Math.min(counts[d.id] ?? 0, d.repetitions), 0);
  return { total, completed, done: total > 0 && completed >= total };
}

export interface SmartCandidate {
  id: string;
  title: string;
  body: string;
  deepLink: string;
  /** 1 = le plus prioritaire (prière), 3 = le moins (Wird). */
  priority: 1 | 2 | 3;
}

/** Un délai minimal après l'heure de bascule (Fajr/ʿAsr) — évite de coller
 * la notification Adhkār immédiatement après celle de la prière (§5/§13). */
const MIN_DELAY_AFTER_WINDOW_MIN = 5;

function adhkarCandidate(
  category: "morning" | "evening",
  now: Date,
  timings: PrayerTimings | null,
  counts: Record<string, number>,
): SmartCandidate | null {
  const list = category === "morning" ? morningAdhkar : eveningAdhkar;
  const windowStart = category === "morning" ? timings?.Fajr : timings?.Asr;
  if (!windowStart) return null; // jamais d'heure inventée si l'horaire est indisponible
  const [h, m] = windowStart.split(":").map(Number);
  const start = new Date(now);
  start.setHours(h, m + MIN_DELAY_AFTER_WINDOW_MIN, 0, 0);
  if (now.getTime() < start.getTime()) return null;
  const { total, completed, done } = adhkarProgress(list, counts);
  if (done) return null;
  return {
    id: `adhkar-${category}-${todayISO(now)}`,
    title: category === "morning" ? "Adhkār du matin" : "Adhkār du soir",
    body:
      category === "morning"
        ? `Continuer ${completed}/${total}`
        : "Prenez quelques instants pour votre dhikr",
    deepLink: category === "morning" ? "/matin" : "/soir",
    priority: 2,
  };
}

function wirdCandidate(
  now: Date,
  wird: WirdState | null,
  morningDone: boolean,
  timings: PrayerTimings | null,
  lastMushafPage: number | null,
  prefs: SmartReminderPrefs,
): SmartCandidate | null {
  if (!wird || prefs.wirdMode === "off") return null;
  const target = getWirdResumeTarget(wird, lastMushafPage);
  if (!target) return null;

  if (prefs.wirdMode === "after-fajr") {
    if (!timings?.Fajr) return null;
    const [h, m] = timings.Fajr.split(":").map(Number);
    const start = new Date(now);
    start.setHours(h, m, 0, 0);
    if (now.getTime() < start.getTime()) return null;
  } else if (prefs.wirdMode === "after-morning-adhkar") {
    // §7/§12 mission : condition de PROGRESSION, jamais une heure fixe —
    // tant que les Adhkār du matin ne sont pas finis, le Wird attend.
    if (!morningDone) return null;
  } else if (prefs.wirdMode === "custom") {
    const [h, m] = prefs.wirdCustomTime.split(":").map(Number);
    const start = new Date(now);
    start.setHours(h, m, 0, 0);
    if (now.getTime() < start.getTime()) return null;
  }

  return {
    id: `wird-${todayISO(now)}`,
    title: target.notStarted ? "Mon Wird" : "Continuer mon Wird",
    body: target.notStarted
      ? `Pages ${target.startPage}–${target.endPage}`
      : `Pages ${target.resumePage}–${target.endPage} restantes`,
    // Réutilise exactement le routing déjà construit pour le partage Wird
    // (§"Partage Mon Wird") — aucune nouvelle route.
    deepLink: `/quran/page/${target.resumePage}?end=${target.endPage}&shared=wird`,
    priority: 3,
  };
}

const MIN_GLOBAL_GAP_MS = 5 * 60_000;

/**
 * Moteur unique (§1 mission) — à monter une seule fois à la racine, comme
 * `useReminderEngine`. Ne fait rien si le mode intelligent est désactivé ou
 * si les notifications ne sont pas autorisées.
 */
export function useSmartReminderEngine() {
  const [prefs] = useSmartReminderPrefs();
  const [fireLog, setFireLog] = useLocalState<SmartFireLog>(FIRELOG_KEY, { fired: {} });
  const [wird] = useLocalState<WirdState | null>("adhkar:wird", null);

  const settings = getPrayerSettings();
  const needsTimings = prefs.enabled && (prefs.adhkar || prefs.wird);
  const { data: timings } = useQuery({
    queryKey: ["prayer-timings", settings],
    queryFn: () => fetchTodayTimings(settings),
    staleTime: 30 * 60_000,
    enabled: needsTimings,
  });

  const tick = useCallback(() => {
    if (!prefs.enabled || !notificationsSupported() || Notification.permission !== "granted") return;
    const now = new Date();
    if (inQuietHours(now, prefs.quietStart, prefs.quietEnd)) return;

    const today = todayISO(now);
    const progress = readJSON<DailyProgress>("adhkar:progress", { date: today, counts: {} });
    const counts = progress.date === today ? progress.counts : {};
    const morningDone = adhkarProgress(morningAdhkar, counts).done;
    const lastMushafPage = readJSON<number | null>("quran-last-page", null);

    const candidates: SmartCandidate[] = [];
    if (prefs.adhkar) {
      const m = adhkarCandidate("morning", now, timings ?? null, counts);
      if (m) candidates.push(m);
      const e = adhkarCandidate("evening", now, timings ?? null, counts);
      if (e) candidates.push(e);
    }
    if (prefs.wird) {
      const w = wirdCandidate(now, wird, morningDone, timings ?? null, lastMushafPage, prefs);
      if (w) candidates.push(w);
    }
    if (!candidates.length) return;

    // Priorité prière (§3/§15) : on n'émet rien de nous-mêmes trop près
    // d'une heure de prière, même si l'utilisateur n'a pas activé cette
    // prière précise — la fenêtre reste courte pour ne jamais bloquer
    // durablement une notification utile.
    if (isNearAnyPrayerTime(now, timings ?? null)) return;

    setFireLog((log) => {
      // Ne garde que les entrées du jour courant — évite une clé qui
      // grossirait indéfiniment, jamais lue comme "déjà sonné" par erreur.
      // Ne renvoie JAMAIS un nouvel objet si rien ne change réellement
      // (même bug que checkDueReminders dans reminders.ts sinon : une
      // nouvelle référence à chaque tick, même sans notification, suffirait
      // à déclencher un rendu inutile à chaque intervalle).
      const staleIds = Object.keys(log.fired ?? {}).filter((id) => log.fired[id] !== today);

      // Anti-empilement global (§3/§13/§15) : un délai minimal depuis la
      // dernière notification intelligente, quelle que soit sa catégorie.
      if (log.lastFiredAt && now.getTime() - log.lastFiredAt < MIN_GLOBAL_GAP_MS) {
        if (!staleIds.length) return log;
        const fresh = { ...log.fired };
        for (const id of staleIds) delete fresh[id];
        return { ...log, fired: fresh };
      }

      candidates.sort((a, b) => a.priority - b.priority);
      const chosen = candidates.find((c) => log.fired[c.id] !== today);
      if (!chosen) {
        if (!staleIds.length) return log;
        const fresh = { ...log.fired };
        for (const id of staleIds) delete fresh[id];
        return { ...log, fired: fresh };
      }

      const n = new Notification(chosen.title, { body: chosen.body, tag: chosen.id });
      n.onclick = () => {
        window.focus();
        window.location.href = chosen.deepLink;
      };
      const fresh = { ...log.fired };
      for (const id of staleIds) delete fresh[id];
      fresh[chosen.id] = today;
      return { fired: fresh, lastFiredAt: now.getTime() };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs, timings, wird]);

  useEffect(() => {
    if (!prefs.enabled) return;
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [tick, prefs.enabled]);
}
