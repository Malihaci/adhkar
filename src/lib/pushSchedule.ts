/**
 * Planning des rappels pour le serveur de push (notifications app fermée).
 *
 * Le client reste le « cerveau » : il applique les mêmes règles que les moteurs
 * en page (reminders.ts / smartReminders.ts) pour les 3 prochains jours et
 * envoie des instants absolus au serveur, qui ne fait que les délivrer à l'heure.
 * Dès que l'état change (Adhkār terminés, réglages modifiés), le planning est
 * recalculé et renvoyé — un rappel déjà accompli ne part donc plus.
 */
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import { readJSON, type DailyProgress } from "@/lib/storage";
import { getPrayerSettings, fetchTimingsForDate, type PrayerTimings } from "@/lib/prayerTimes";
import {
  DEFAULT_REMINDERS,
  reminderNeedsTimings,
  resolveReminderTimeOn,
  type ReminderConfig,
} from "@/lib/reminders";
import { DEFAULT_SMART_PREFS, inQuietHours, type SmartReminderPrefs } from "@/lib/smartReminders";
import { getWirdResumeTarget, type WirdState } from "@/lib/khatma";
import { adhkarStatus, pagesLeft } from "@/lib/todayState";

export interface PushItem {
  at: number;
  title: string;
  body: string;
  url: string;
  tag: string;
  intent?: string;
  cta?: string;
}

interface Planned extends PushItem {
  /** Réglé automatiquement (peut être décalé) vs heure précise choisie (jamais décalée). */
  flex: boolean;
}

const DAYS_AHEAD = 3;
const MIN_GAP_MS = 30 * 60_000;
const PRAYER_BUFFER_MS = 10 * 60_000;
const WIRD_AFTER_ADHKAR_MS = 15 * 60_000;

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function atOn(date: Date, hhmm: string, plusMin = 0): number {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m + plusMin, 0, 0);
  return d.getTime();
}

function prayerInstants(date: Date, t: PrayerTimings | null): number[] {
  if (!t) return [];
  return [t.Fajr, t.Dhuhr, t.Asr, t.Maghrib, t.Isha].filter(Boolean).map((x) => atOn(date, x));
}

export async function buildPushSchedule(now = new Date()): Promise<PushItem[]> {
  const reminders = readJSON<ReminderConfig[]>("adhkar:reminders", DEFAULT_REMINDERS);
  const smart: SmartReminderPrefs = { ...DEFAULT_SMART_PREFS, ...readJSON<Partial<SmartReminderPrefs>>("adhkar:smart-reminders", {}) };
  const settings = getPrayerSettings();
  const wird = readJSON<WirdState | null>("adhkar:wird", null);
  const lastPage = readJSON<number | null>("quran-last-page", null);
  const todayStr = iso(now);
  const progress = readJSON<DailyProgress>("adhkar:progress", { date: todayStr, counts: {} });
  const counts = progress.date === todayStr ? progress.counts : {};
  const morning = adhkarStatus(morningAdhkar, counts);
  const evening = adhkarStatus(eveningAdhkar, counts);
  const firelog = readJSON<{ doneAt?: Record<string, number> }>("adhkar:smart-firelog", {});
  const morningDoneAt = firelog.doneAt?.[todayStr] ?? null;

  const active = smart.enabled
    ? reminders.filter((r) => !["matin", "soir", "wird"].includes(r.id) && (smart.prayers || !r.prayerKey))
    : reminders;

  const planned: Planned[] = [];
  const prayerTimes: number[] = [];

  for (let day = 0; day < DAYS_AHEAD; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    const dayStr = iso(date);
    const needsT =
      active.some((r) => r.enabled && reminderNeedsTimings(r)) ||
      (smart.enabled && (smart.adhkar || smart.wird));
    const timings = needsT ? await fetchTimingsForDate(settings, date) : null;
    prayerTimes.push(...prayerInstants(date, timings));

    // 1. Rappels réglés par la personne : prière (± décalage) ou heure précise.
    for (const r of active) {
      if (!r.enabled) continue;
      if (typeof r.weekday === "number" && date.getDay() !== r.weekday) continue;
      const hhmm = resolveReminderTimeOn(r, timings, date);
      if (!hhmm) continue;
      const offset = r.offsetMinutes ?? 0;
      const body =
        r.prayerKey && !r.fixed && offset > 0
          ? `${r.label} dans ${offset} min`
          : r.prayerKey && !r.fixed
            ? `C'est l'heure de ${r.label}`
            : "Toucher pour ouvrir";
      planned.push({ at: atOn(date, hhmm), title: r.label, body, url: r.deepLink, tag: r.id, flex: false });
    }

    if (!smart.enabled) continue;

    // 2. Adhkār du matin / du soir (matin : Fajr+5 min, soir : ʿAsr+5 min, ou heure précise).
    if (smart.adhkar) {
      const specs = [
        { cat: "morning" as const, fixed: smart.morningTime, base: timings?.Fajr, status: morning, path: "/matin" },
        { cat: "evening" as const, fixed: smart.eveningTime, base: timings?.Asr, status: evening, path: "/soir" },
      ];
      for (const sp of specs) {
        if (day === 0 && sp.status.done) continue;
        const at = sp.fixed ? atOn(date, sp.fixed) : sp.base ? atOn(date, sp.base, 5) : null;
        if (at === null) continue;
        if (!sp.fixed && sp.cat === "morning" && timings?.Dhuhr && at >= atOn(date, timings.Dhuhr)) continue;
        const id = `adhkar-${sp.cat}-${dayStr}`;
        planned.push({
          at,
          title: sp.cat === "morning" ? "Adhkār du matin" : "Adhkār du soir",
          body: sp.cat === "morning" ? "Commencez votre journée par le rappel d'Allah." : "Vos Adhkār du soir vous attendent.",
          url: day === 0 && sp.status.firstUndoneIndex !== null ? `${sp.path}?i=${sp.status.firstUndoneIndex}` : sp.path,
          tag: id,
          intent: id,
          cta: sp.cat === "morning" ? "Continuer mes Adhkār" : "Les réciter",
          flex: !sp.fixed,
        });
      }
    }

    // 3. Lecture du jour (Wird).
    if (smart.wird && wird && smart.wirdMode !== "off") {
      const target = getWirdResumeTarget(wird, lastPage);
      if (target) {
        let at: number | null = null;
        let flex = true;
        if (smart.wirdMode === "after-fajr") at = timings?.Fajr ? atOn(date, timings.Fajr) : null;
        else if (smart.wirdMode === "custom") {
          at = atOn(date, smart.wirdCustomTime);
          flex = false;
        } else if (day === 0) {
          // Après les Adhkār du matin : seulement une fois terminés (le planning est renvoyé à ce moment-là).
          at = morning.done ? (morningDoneAt ?? now.getTime()) + WIRD_AFTER_ADHKAR_MS : null;
        } else {
          at = timings?.Fajr ? atOn(date, timings.Fajr, 120) : null;
        }
        if (at !== null) {
          const id = `wird-${dayStr}`;
          planned.push({
            at,
            title: "Lecture du jour",
            body:
              day === 0
                ? pagesLeft(target) > 1
                  ? `Il vous reste ${pagesLeft(target)} pages aujourd'hui.`
                  : "Il vous reste une page aujourd'hui."
                : "Votre lecture du jour vous attend.",
            url: day === 0 ? `/quran/page/${target.resumePage}?end=${target.endPage}&shared=wird` : "/wird",
            tag: id,
            intent: id,
            cta: "Reprendre ma lecture",
            flex,
          });
        }
      }
    }
  }

  // Règles anti-spam, comme en page : jamais dans « Ne pas déranger », jamais collé à une prière,
  // 30 min minimum entre deux notifications (seuls les rappels automatiques sont décalés).
  planned.sort((a, b) => a.at - b.at);
  const out: Planned[] = [];
  for (const p of planned) {
    if (p.flex) {
      if (inQuietHours(new Date(p.at), smart.quietStart, smart.quietEnd)) continue;
      const near = prayerTimes.find((t) => Math.abs(p.at - t) <= PRAYER_BUFFER_MS);
      if (near !== undefined) p.at = near + PRAYER_BUFFER_MS + 60_000;
      const prev = [...out].reverse().find((o) => o.at <= p.at && p.at - o.at < MIN_GAP_MS);
      if (prev) p.at = prev.at + MIN_GAP_MS;
      if (inQuietHours(new Date(p.at), smart.quietStart, smart.quietEnd)) continue;
    }
    out.push(p);
  }

  const horizon = now.getTime() + DAYS_AHEAD * 86_400_000;
  return out
    .filter((p) => p.at > now.getTime() + 15_000 && p.at <= horizon)
    .sort((a, b) => a.at - b.at)
    .slice(0, 100)
    .map(({ flex: _flex, ...item }) => item);
}
