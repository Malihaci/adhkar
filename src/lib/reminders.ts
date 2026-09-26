/**
 * Mes rappels — préférences locales + planification "au premier plan"
 * (best-effort). AUCUN backend de notification push : sur le Web/PWA,
 * une alarme fiable hors application nécessite un service de push serveur
 * (hors périmètre de ce chantier, voir rapport final). Ce module sépare
 * volontairement PRÉFÉRENCES / PERMISSIONS / PLANIFICATION / DEEP LINKS
 * pour rester remplaçable par une vraie notification native (Capacitor)
 * sans retoucher l'UI de réglage.
 */

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTodayTimings, getPrayerSettings, type PrayerKey, type PrayerTimings } from "@/lib/prayerTimes";
import { useLocalState } from "@/lib/storage";

export interface ReminderConfig {
  id: string;
  label: string;
  time: string; // "HH:MM" — ignoré si `prayerKey` est présent (voir resolveReminderTime)
  enabled: boolean;
  deepLink: string;
  /** Ne se déclenche que ce jour de la semaine (0=dimanche..6=samedi), sinon tous les jours. */
  weekday?: number;
  /**
   * Rappel lié à une prière réelle (§16-21/§24 mission) : l'heure effective
   * est recalculée chaque jour à partir des horaires Al Adhan, jamais figée.
   * Si les horaires sont indisponibles, ce rappel ne se déclenche pas —
   * jamais d'heure de repli inventée pour une prière.
   */
  prayerKey?: PrayerKey;
  /** Minutes avant l'heure de la prière (0 = à l'heure exacte). */
  offsetMinutes?: number;
}

export const PRAYER_REMINDER_IDS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

/** Heure effective "HH:MM" d'un rappel pour aujourd'hui — résout `prayerKey` via les horaires réels. */
export function resolveReminderTime(r: ReminderConfig, timings: PrayerTimings | null): string | null {
  if (!r.prayerKey) return r.time;
  if (!timings) return null; // jamais d'heure inventée si l'API est indisponible
  const base = timings[r.prayerKey];
  if (!base) return null;
  const offset = r.offsetMinutes ?? 0;
  if (!offset) return base;
  const [h, m] = base.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m - offset, 0, 0);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** Page Mushaf où commence sourate Al-Kahf (18) dans le Mushaf de Médine standard à 604 pages. */
export const AL_KAHF_PAGE = 293;

export const DEFAULT_REMINDERS: ReminderConfig[] = [
  { id: "matin", label: "Adhkār matin", time: "07:00", enabled: true, deepLink: "/matin" },
  { id: "soir", label: "Adhkār soir", time: "18:00", enabled: true, deepLink: "/soir" },
  { id: "reveil", label: "Réveil", time: "06:00", enabled: false, deepLink: "/reveil" },
  { id: "coucher", label: "Coucher", time: "22:30", enabled: false, deepLink: "/coucher" },
  { id: "wird", label: "Mon Wird", time: "20:00", enabled: false, deepLink: "/wird" },
  {
    id: "kahf",
    label: "Al-Kahf (vendredi)",
    time: "10:00",
    enabled: false,
    deepLink: `/quran/page/${AL_KAHF_PAGE}`,
    weekday: 5,
  },
  { id: "fajr", label: "Fajr", time: "", enabled: false, deepLink: "/horaires", prayerKey: "Fajr" },
  { id: "dhuhr", label: "Dhuhr", time: "", enabled: false, deepLink: "/horaires", prayerKey: "Dhuhr" },
  { id: "asr", label: "ʿAsr", time: "", enabled: false, deepLink: "/horaires", prayerKey: "Asr" },
  {
    id: "maghrib",
    label: "Maghrib",
    time: "",
    enabled: false,
    deepLink: "/horaires",
    prayerKey: "Maghrib",
  },
  { id: "isha", label: "ʿIshāʾ", time: "", enabled: false, deepLink: "/horaires", prayerKey: "Isha" },
];

export interface ReminderFireLog {
  [id: string]: string; // dernière date (YYYY-MM-DD) où le rappel a déjà sonné
}

/** Support réel de l'API Notification (absente en SSR, sur certains navigateurs iOS hors PWA installée). */
export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) return "denied";
  if (Notification.permission !== "default") return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Vérifie les rappels actifs et déclenche une notification (si permission
 * accordée et onglet ouvert) pour ceux dont l'heure vient de passer
 * aujourd'hui et n'ont pas encore sonné. Best-effort uniquement — ne
 * fonctionne que tant que l'application est ouverte (pas d'alarme
 * en arrière-plan sur le Web sans service de push serveur).
 */
export function checkDueReminders(
  reminders: ReminderConfig[],
  fireLog: ReminderFireLog,
  onFire: (r: ReminderConfig) => void,
  timings: PrayerTimings | null = null,
): ReminderFireLog {
  if (!notificationsSupported() || Notification.permission !== "granted") return fireLog;
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const today = todayKey();
  const next = { ...fireLog };
  for (const r of reminders) {
    if (!r.enabled) continue;
    if (typeof r.weekday === "number" && now.getDay() !== r.weekday) continue;
    const effectiveTime = resolveReminderTime(r, timings);
    if (effectiveTime === null || effectiveTime !== hhmm) continue;
    if (fireLog[r.id] === today) continue;
    onFire(r);
    next[r.id] = today;
  }
  return next;
}

/**
 * Moteur de rappels UNIQUE (§24 mission) — à monter une seule fois, au
 * niveau racine de l'app, pas dans la page /rappels. Avant ce correctif, la
 * vérification tournait uniquement pendant que l'utilisateur regardait
 * l'écran "Mes rappels" : dès qu'il changeait d'écran, plus aucun rappel ne
 * pouvait se déclencher — cause probable du symptôme "aucune notification
 * n'arrive" alors même que la permission était accordée. Ce hook la fait
 * tourner tant que l'onglet/l'app est ouvert(e), quel que soit l'écran
 * affiché — toujours strictement au premier plan : voir la limite PWA
 * documentée en tête de fichier.
 */
export function useReminderEngine() {
  const [reminders] = useLocalState<ReminderConfig[]>("adhkar:reminders", DEFAULT_REMINDERS);
  const [fireLog, setFireLog] = useLocalState<ReminderFireLog>("adhkar:reminders-firelog", {});
  const needsTimings = reminders.some((r) => r.enabled && r.prayerKey);
  const { data: timings } = useQuery({
    queryKey: ["prayer-timings", getPrayerSettings()],
    queryFn: () => fetchTodayTimings(getPrayerSettings()),
    staleTime: 30 * 60_000,
    enabled: needsTimings,
  });

  useEffect(() => {
    if (!notificationsSupported()) return;
    const tick = () => {
      setFireLog((log) =>
        checkDueReminders(
          reminders,
          log,
          (r) => {
            const n = new Notification(r.label, { body: "Toucher pour ouvrir", tag: r.id });
            n.onclick = () => {
              window.focus();
              window.location.href = r.deepLink;
            };
          },
          timings ?? null,
        ),
      );
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reminders, timings]);
}
