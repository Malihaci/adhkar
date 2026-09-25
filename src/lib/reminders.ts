/**
 * Mes rappels — préférences locales + planification "au premier plan"
 * (best-effort). AUCUN backend de notification push : sur le Web/PWA,
 * une alarme fiable hors application nécessite un service de push serveur
 * (hors périmètre de ce chantier, voir rapport final). Ce module sépare
 * volontairement PRÉFÉRENCES / PERMISSIONS / PLANIFICATION / DEEP LINKS
 * pour rester remplaçable par une vraie notification native (Capacitor)
 * sans retoucher l'UI de réglage.
 */

export interface ReminderConfig {
  id: string;
  label: string;
  time: string; // "HH:MM"
  enabled: boolean;
  deepLink: string;
  /** Ne se déclenche que ce jour de la semaine (0=dimanche..6=samedi), sinon tous les jours. */
  weekday?: number;
}

/** Page Mushaf où commence sourate Al-Kahf (18) dans le Mushaf de Médine standard à 604 pages. */
export const AL_KAHF_PAGE = 293;

export const DEFAULT_REMINDERS: ReminderConfig[] = [
  { id: "matin", label: "Adhkār matin", time: "07:00", enabled: true, deepLink: "/matin" },
  { id: "soir", label: "Adhkār soir", time: "18:00", enabled: true, deepLink: "/soir" },
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
): ReminderFireLog {
  if (!notificationsSupported() || Notification.permission !== "granted") return fireLog;
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const today = todayKey();
  const next = { ...fireLog };
  for (const r of reminders) {
    if (!r.enabled) continue;
    if (typeof r.weekday === "number" && now.getDay() !== r.weekday) continue;
    if (r.time !== hhmm) continue;
    if (fireLog[r.id] === today) continue;
    onFire(r);
    next[r.id] = today;
  }
  return next;
}
