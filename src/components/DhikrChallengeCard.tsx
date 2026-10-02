import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
  SALAT_DHIKR_ID,
  isChallengeEnded,
  isFriday,
  todayKey,
  useDhikrLog,
  useFridayChallenge,
  useLocalChallenges,
} from "@/lib/dhikrCounter";

/** Petite carte contextuelle d'accueil : seulement s'il existe un défi
 * pertinent maintenant (défi partagé actif non atteint, ou vendredi) —
 * sinon rien n'est rendu. Lecture locale uniquement, aucun appel réseau. */
export function DhikrChallengeCard() {
  const [challenges] = useLocalChallenges();
  const [friday] = useFridayChallenge();
  const [log] = useDhikrLog();

  const active = challenges.find((c) => {
    if (isChallengeEnded(c)) return false;
    return c.type === "individual" ? c.myCount < c.target : (c.lastKnownTotal ?? 0) < c.target;
  });

  if (active) {
    const collective = active.type === "collective";
    const value = collective ? (active.lastKnownTotal ?? active.myCount) : active.myCount;
    return (
      <Link
        to="/challenge/$id"
        params={{ id: active.id }}
        className="surface-card flex min-h-16 items-center gap-3 rounded-2xl px-4 py-3 transition hover:-translate-y-0.5"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{active.title}</p>
          <p className="text-xs tabular-nums text-muted-foreground">
            {value.toLocaleString("fr-FR")} / {active.target.toLocaleString("fr-FR")}
          </p>
        </div>
        <span className="flex items-center gap-1 text-sm font-semibold text-primary">
          Continuer <ChevronRight className="size-4" />
        </span>
      </Link>
    );
  }

  if (isFriday()) {
    const count = log[todayKey()]?.[SALAT_DHIKR_ID] ?? 0;
    if (count >= friday.goal) return null;
    return (
      <Link
        to="/compteur/$dhikrId"
        params={{ dhikrId: SALAT_DHIKR_ID }}
        className="surface-card flex min-h-16 items-center gap-3 rounded-2xl px-4 py-3 transition hover:-translate-y-0.5"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">Défi du vendredi 🌿</p>
          <p className="text-xs tabular-nums text-muted-foreground">
            {count} / {friday.goal} · objectif personnel
          </p>
        </div>
        <span className="flex items-center gap-1 text-sm font-semibold text-primary">
          Continuer <ChevronRight className="size-4" />
        </span>
      </Link>
    );
  }

  return null;
}
