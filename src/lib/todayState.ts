/**
 * État « à faire aujourd'hui » partagé par l'accueil (HomeToday) et le moteur
 * de notifications (smartReminders) : mêmes données, mêmes règles — l'accueil
 * ne peut jamais dire « terminé » pendant qu'une notification dit le contraire.
 */
export interface AdhkarStatus {
  total: number;
  completed: number;
  done: boolean;
  pct: number;
  /** Index du premier dhikr non terminé (0 si rien n'est commencé), ou null si tout est fait. */
  firstUndoneIndex: number | null;
}

export function adhkarStatus(
  list: { id: string; repetitions: number }[],
  counts: Record<string, number>,
): AdhkarStatus {
  const total = list.reduce((n, d) => n + d.repetitions, 0);
  const completed = list.reduce((n, d) => n + Math.min(counts[d.id] ?? 0, d.repetitions), 0);
  const idx = list.findIndex((d) => (counts[d.id] ?? 0) < d.repetitions);
  const done = total > 0 && idx === -1;
  return {
    total,
    completed,
    done,
    pct: total ? Math.round((completed / total) * 100) : 0,
    firstUndoneIndex: done ? null : Math.max(idx, 0),
  };
}

/** Nombre de pages restantes dans la portion du jour (reprise → fin incluse). */
export function pagesLeft(target: { resumePage: number; endPage: number }): number {
  return Math.max(1, target.endPage - target.resumePage + 1);
}
