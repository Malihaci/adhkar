/**
 * Mon Wird / Ma Khatma — répartition déterministe des 604 pages du Mushaf
 * sur N jours. Aucune invention religieuse : c'est un outil d'organisation
 * personnelle (voir §3/§6 du chantier), jamais présenté comme une Sunnah.
 * Les rappels/objectifs/horaires restent du ressort de l'utilisateur.
 */

export const TOTAL_MUSHAF_PAGES = 604;

export interface WirdDay {
  day: number; // 1-based
  startPage: number;
  endPage: number;
}

/**
 * Répartit [fromPage, toPage] sur `days` jours, sans trou ni doublon :
 * chaque page appartient à exactement un jour, dans l'ordre. Les premiers
 * jours reçoivent une page de plus quand la division n'est pas exacte.
 */
export function buildKhatmaSchedule(
  days: number,
  fromPage = 1,
  toPage = TOTAL_MUSHAF_PAGES,
): WirdDay[] {
  const totalPages = toPage - fromPage + 1;
  const n = Math.max(1, Math.floor(days));
  const base = Math.floor(totalPages / n);
  const remainder = totalPages % n;
  const schedule: WirdDay[] = [];
  let cursor = fromPage;
  for (let day = 1; day <= n; day++) {
    const count = base + (day <= remainder ? 1 : 0);
    if (count <= 0) break; // plus de jours que de pages restantes
    const startPage = cursor;
    const endPage = cursor + count - 1;
    schedule.push({ day, startPage, endPage });
    cursor = endPage + 1;
  }
  return schedule;
}

export function isValidPageRange(startPage: number, endPage: number): boolean {
  return (
    Number.isInteger(startPage) &&
    Number.isInteger(endPage) &&
    startPage >= 1 &&
    endPage <= TOTAL_MUSHAF_PAGES &&
    startPage <= endPage
  );
}

/** Jours de calendrier écoulés depuis le début (0 le jour du démarrage). */
export function daysElapsedSince(startDateISO: string): number {
  const start = new Date(startDateISO + "T00:00:00");
  const now = new Date();
  const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((nowMidnight.getTime() - startMidnight.getTime()) / 86400000));
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export interface WirdState {
  id: string;
  name?: string; // présent pour une Khatma de groupe
  durationDays: number;
  startDateISO: string;
  /** Dernier jour marqué comme terminé (0 = aucun). */
  lastCompletedDay: number;
  createdAt: string;
  isGroup?: boolean;
  /** Renseigné uniquement si l'utilisateur a choisi "Répartir les pages
   * restantes" après un retard — jamais modifié automatiquement. */
  redistributedFrom?: { fromDay: number; fromPage: number };
}

export function createWirdState(durationDays: number, name?: string): WirdState {
  return {
    id: `wird-${Date.now()}`,
    name,
    durationDays,
    startDateISO: todayISO(),
    lastCompletedDay: 0,
    createdAt: new Date().toISOString(),
    isGroup: !!name,
  };
}

/** Reconstruit le planning courant — recalcule sur les pages restantes si
 * l'utilisateur a choisi de répartir après un retard (stocké dans le state). */
export function getSchedule(
  state: WirdState,
  remaining?: { fromDay: number; fromPage: number },
): WirdDay[] {
  if (!remaining) return buildKhatmaSchedule(state.durationDays);
  const base = buildKhatmaSchedule(state.durationDays);
  const before = base.filter((d) => d.day < remaining.fromDay);
  const remainingDays = state.durationDays - remaining.fromDay + 1;
  const after = buildKhatmaSchedule(remainingDays, remaining.fromPage, TOTAL_MUSHAF_PAGES).map(
    (d) => ({
      ...d,
      day: d.day + remaining.fromDay - 1,
    }),
  );
  return [...before, ...after];
}

/** Planning effectif d'un Wird, tenant compte d'une éventuelle
 * redistribution déjà choisie par l'utilisateur (jamais automatique). */
export function effectiveSchedule(state: WirdState): WirdDay[] {
  return getSchedule(state, state.redistributedFrom);
}

// --- Partage (Khatma de groupe) — aucune donnée sensible, aucun backend :
// le lien encode juste nom + durée + date de départ ; le planning est
// recalculé de façon déterministe (buildKhatmaSchedule) sur chaque appareil.
export function encodeKhatmaShare(
  state: Pick<WirdState, "name" | "durationDays" | "startDateISO">,
): string {
  const payload = `${state.name ?? ""}|${state.durationDays}|${state.startDateISO}`;
  return btoa(unescape(encodeURIComponent(payload)));
}

export function decodeKhatmaShare(
  code: string,
): { name?: string; durationDays: number; startDateISO: string } | null {
  try {
    const payload = decodeURIComponent(escape(atob(code)));
    const [name, durationDaysStr, startDateISO] = payload.split("|");
    const durationDays = Number(durationDaysStr);
    if (!Number.isFinite(durationDays) || durationDays <= 0 || !startDateISO) return null;
    return { name: name || undefined, durationDays, startDateISO };
  } catch {
    return null;
  }
}
