/**
 * État « à faire aujourd'hui » partagé par l'accueil (HomeToday) et le moteur
 * de notifications (smartReminders) : mêmes données, mêmes règles — l'accueil
 * ne peut jamais dire « terminé » pendant qu'une notification dit le contraire.
 */
export interface AdhkarStatus {
  /** Nombre de dhikr de la liste. */
  total: number;
  /** Nombre de dhikr terminés (un dhikr à 100 répétitions compte pour UN, comme les autres). */
  completed: number;
  /** Au moins une récitation déjà comptée aujourd'hui. */
  started: boolean;
  done: boolean;
  pct: number;
  /** Index du premier dhikr non terminé (0 si rien n'est commencé), ou null si tout est fait. */
  firstUndoneIndex: number | null;
}

export function adhkarStatus(
  list: { id: string; repetitions: number }[],
  counts: Record<string, number>,
): AdhkarStatus {
  const total = list.length;
  const completed = list.filter((d) => (counts[d.id] ?? 0) >= d.repetitions).length;
  const started = list.some((d) => (counts[d.id] ?? 0) > 0);
  const idx = list.findIndex((d) => (counts[d.id] ?? 0) < d.repetitions);
  const done = total > 0 && idx === -1;
  return {
    total,
    completed,
    started,
    done,
    pct: total ? Math.round((completed / total) * 100) : 0,
    firstUndoneIndex: done ? null : Math.max(idx, 0),
  };
}

/** Nombre de pages restantes dans la portion du jour (reprise → fin incluse). */
export function pagesLeft(target: { resumePage: number; endPage: number }): number {
  return Math.max(1, target.endPage - target.resumePage + 1);
}
