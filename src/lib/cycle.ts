/**
 * « Mon cycle » — version simple : dates des règles saisies par la femme, calcul
 * de la durée moyenne du cycle et des prochaines règles. Tout reste sur
 * l'appareil (localStorage), rien n'est envoyé en ligne.
 *
 * Règles de calcul :
 *  - on apprend des 6 derniers cycles (écart entre deux débuts de règles) ;
 *  - un cycle de plus de 45 jours (ou de moins de 15) est ignoré : oubli de
 *    saisie probable ;
 *  - sans historique : 28 jours ; une durée choisie à la main est prioritaire.
 */
import { useLocalState } from "@/lib/storage";

export interface CycleData {
  /** Jours de règles saisis (AAAA-MM-JJ), triés. */
  days: string[];
  /** Début des règles en cours (jours suivants comptés jusqu'à aujourd'hui). */
  open: string | null;
  /** Durée du cycle choisie à la main (sinon calculée). */
  manual: number | null;
}

export const EMPTY_CYCLE: CycleData = { days: [], open: null, manual: null };
export const MAX_CYCLE = 45;
const MIN_CYCLE = 15;
const DEFAULT_CYCLE = 28;
const DAY = 86400000;

export function useCycle() {
  return useLocalState<CycleData>("cycle:data", EMPTY_CYCLE);
}

export const isoOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Numéro de jour (indépendant de l'heure d'été) pour une date AAAA-MM-JJ. */
export const dayNum = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / DAY);
};
export const isoFromNum = (n: number) => {
  const d = new Date(n * DAY);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
};

/** Tous les jours marqués : saisis + règles en cours jusqu'à aujourd'hui. */
export function markedDays(data: CycleData, todayIso: string): Set<number> {
  const set = new Set(data.days.map(dayNum));
  if (data.open) {
    // Plafonné à 14 jours : si on a oublié de clôturer, on ne marque pas indéfiniment.
    const s = dayNum(data.open);
    const t = Math.min(dayNum(todayIso), s + 13);
    for (let n = s; n <= t; n++) set.add(n);
  }
  return set;
}

export interface Period {
  start: number;
  end: number;
}

export function periodsOf(marked: Set<number>): Period[] {
  const sorted = [...marked].sort((a, b) => a - b);
  const out: Period[] = [];
  for (const n of sorted) {
    const last = out[out.length - 1];
    if (last && n - last.end <= 1) last.end = n;
    else out.push({ start: n, end: n });
  }
  return out;
}

export interface CycleStats {
  periods: Period[];
  cycleLength: number;
  periodLength: number;
  /** Débuts prévus des 3 prochaines règles (numéros de jour). */
  next: number[];
  hasHistory: boolean;
}

export function computeCycle(data: CycleData, todayIso: string): CycleStats {
  const periods = periodsOf(markedDays(data, todayIso));
  const gaps: number[] = [];
  for (let i = 1; i < periods.length; i++) gaps.push(periods[i].start - periods[i - 1].start);
  const valid = gaps.slice(-6).filter((g) => g >= MIN_CYCLE && g <= MAX_CYCLE);
  const cycleLength =
    data.manual ?? (valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : DEFAULT_CYCLE);
  // Durée des règles : périodes terminées seulement (pas celle en cours).
  const openStart = data.open ? dayNum(data.open) : null;
  const done = periods.filter((p) => p.start !== openStart).slice(-6);
  const periodLength = done.length
    ? Math.round(done.reduce((a, p) => a + (p.end - p.start + 1), 0) / done.length)
    : 6;
  const last = periods[periods.length - 1];
  const next = last ? [1, 2, 3].map((i) => last.start + i * cycleLength) : [];
  return { periods, cycleLength, periodLength, next, hasHistory: periods.length > 0 };
}

/** Jour des règles en cours (1 = premier jour), ou 0 si pas en cours. */
export function currentPeriodDay(data: CycleData, todayIso: string): number {
  if (!data.open) return 0;
  return dayNum(todayIso) - dayNum(data.open) + 1;
}
