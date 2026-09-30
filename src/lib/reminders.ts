/**
 * Mes rappels — préférences locales + planification "au premier plan"
 * (best-effort). AUCUN backend de notification push : sur le Web/PWA,
 * une alarme fiable hors application nécessite un service de push serveur
 * (hors périmètre de ce chantier, voir rapport final). Ce module sépare
 * volontairement PRÉFÉRENCES / PERMISSIONS / PLANIFICATION / DEEP LINKS
 * pour rester remplaçable par une vraie notification native (Capacitor)
 * sans retoucher l'UI de réglage.
 */

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTodayTimings, getPrayerSettings, type PrayerKey, type PrayerTimings } from "@/lib/prayerTimes";
import { useLocalState } from "@/lib/storage";
import { getAdhanOption, playBeep, type AdhanId } from "@/lib/adhan";
import { getPersonalAudioURL } from "@/lib/personalAudio";
import { useSmartReminderPrefs } from "@/lib/smartReminders";

/**
 * Abstraction PrayerNotificationService (§9 mission) — préparée mais non
 * branchée : la seule implémentation existante aujourd'hui est
 * `useReminderEngine` ci-dessous (Web/PWA, premier plan uniquement, voir
 * limites documentées). Une future implémentation native (Capacitor)
 * respecterait la même forme (permission/planification/déclenchement) sans
 * que l'UI de réglage (rappels.tsx) ait besoin d'être réécrite.
 */
export interface PrayerNotificationService {
  isSupported(): boolean;
  getPermission(): NotificationPermission | "unsupported";
  requestPermission(): Promise<NotificationPermission>;
}

/** Contenu à programmer avant une prière (§4 mission — modèle préparé,
 * AUCUNE interface utilisateur construite pour l'instant). */
export interface PreContentConfig {
  type: "surah" | "ayah" | "hizb" | "juz" | "range" | "personalAudio";
  /** verseKey, numéro de sourate/hizb/juz, ou plage "2:1-2:5" selon `type`. */
  ref?: string;
  reciterId?: string;
  /** Contenu déjà téléchargé pour lecture hors-ligne — non implémenté. */
  offline?: boolean;
}

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
  /** Son joué au déclenchement — uniquement pour les rappels de prière. */
  adhanId?: AdhanId;
  /** Préparé pour une future évolution (§4) — non utilisé par l'UI actuelle. */
  preContent?: PreContentConfig;
}

/** Joue le son choisi pour un rappel — réutilisé par le déclenchement réel
 * ET par les boutons "Tester" (même chemin de code, jamais deux logiques). */
export async function playReminderSound(adhanId: AdhanId | undefined) {
  if (!adhanId || adhanId === "none") return;
  if (adhanId === "beep") {
    playBeep();
    return;
  }
  if (adhanId === "personal") {
    const url = await getPersonalAudioURL();
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch(() => {
      /* autoplay bloqué — voir §7/§8, le tap sur la notification reste le repli */
    });
    return;
  }
  const option = getAdhanOption(adhanId);
  if (!option.audioUrl) return;
  const audio = new Audio(option.audioUrl);
  audio.play().catch(() => {
    /* autoplay bloqué — voir §7/§8 */
  });
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
  {
    id: "fajr",
    label: "Fajr",
    time: "",
    enabled: false,
    deepLink: "/horaires",
    prayerKey: "Fajr",
    adhanId: "none",
  },
  {
    id: "dhuhr",
    label: "Dhuhr",
    time: "",
    enabled: false,
    deepLink: "/horaires",
    prayerKey: "Dhuhr",
    adhanId: "none",
  },
  {
    id: "asr",
    label: "ʿAsr",
    time: "",
    enabled: false,
    deepLink: "/horaires",
    prayerKey: "Asr",
    adhanId: "none",
  },
  {
    id: "maghrib",
    label: "Maghrib",
    time: "",
    enabled: false,
    deepLink: "/horaires",
    prayerKey: "Maghrib",
    adhanId: "none",
  },
  {
    id: "isha",
    label: "ʿIshāʾ",
    time: "",
    enabled: false,
    deepLink: "/horaires",
    prayerKey: "Isha",
    adhanId: "none",
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
  timings: PrayerTimings | null = null,
): ReminderFireLog {
  if (!notificationsSupported() || Notification.permission !== "granted") return fireLog;
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const today = todayKey();
  // Ne jamais renvoyer un nouvel objet quand rien n'a sonné : un appelant
  // qui stocke ce retour dans du state React (setFireLog(checkDueReminders
  // (...))) verrait sinon une référence différente à CHAQUE tick même sans
  // changement réel, déclenchant un rendu (et tout effet qui en dépend) en
  // boucle — c'est exactement ce qui causait la boucle infinie constatée en
  // direct dès que `reminders` changeait aussi de référence à chaque rendu.
  let next: ReminderFireLog | null = null;
  for (const r of reminders) {
    if (!r.enabled) continue;
    if (typeof r.weekday === "number" && now.getDay() !== r.weekday) continue;
    const effectiveTime = resolveReminderTime(r, timings);
    if (effectiveTime === null || effectiveTime !== hhmm) continue;
    if (fireLog[r.id] === today) continue;
    onFire(r);
    if (!next) next = { ...fireLog };
    next[r.id] = today;
  }
  return next ?? fireLog;
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
  const [rawReminders] = useLocalState<ReminderConfig[]>("adhkar:reminders", DEFAULT_REMINDERS);
  const [fireLog, setFireLog] = useLocalState<ReminderFireLog>("adhkar:reminders-firelog", {});
  const [smartPrefs] = useSmartReminderPrefs();
  /** Mode intelligent actif (chantier "Rappels intelligents") : les anciens
   * rappels Adhkār matin/soir et Mon Wird à HEURE FIXE ne doivent plus
   * sonner — le SmartReminderEngine (src/lib/smartReminders.ts) les
   * remplace par une logique contextuelle (progression réelle, vrai Fajr/
   * ʿAsr, priorité vs prière). Les prières et les autres rappels fixes
   * (réveil/coucher/Al-Kahf) restent gérés ici sans changement. */
  // `useMemo` — jamais un simple `.filter()` inline : ce dernier renvoie un
  // NOUVEAU tableau à chaque rendu, ce qui changeait la dépendance de
  // l'effet ci-dessous à chaque tick et provoquait une boucle de rendu
  // infinie ("Maximum update depth exceeded", constatée en direct).
  const reminders = useMemo(
    () =>
      smartPrefs.enabled
        ? rawReminders.filter(
            (r) => !["matin", "soir", "wird"].includes(r.id) && (smartPrefs.prayers || !r.prayerKey),
          )
        : rawReminders,
    [rawReminders, smartPrefs.enabled, smartPrefs.prayers],
  );
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
            const offset = r.offsetMinutes ?? 0;
            const body =
              r.prayerKey && offset > 0
                ? `${r.label} dans ${offset} min`
                : r.prayerKey
                  ? `C'est l'heure de ${r.label}`
                  : "Toucher pour ouvrir";
            const n = new Notification(r.label, { body, tag: r.id });
            // Tentative immédiate (l'app est au premier plan à ce moment) —
            // best-effort seulement, l'autoplay peut être bloqué (§7/§8).
            void playReminderSound(r.adhanId);
            n.onclick = () => {
              window.focus();
              // Le clic est un vrai geste utilisateur : repli garanti si la
              // tentative précédente avait été bloquée par l'autoplay.
              void playReminderSound(r.adhanId);
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
