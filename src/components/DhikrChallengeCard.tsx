import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
  SALAT_DHIKR_ID,
  SALAT_FORMULA,
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
        className="relative flex min-h-16 items-center gap-3 rounded-2xl border border-gold/50 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/5 px-4 py-3 shadow-[0_6px_18px_-10px_var(--gold)] transition hover:-translate-y-0.5"
      >
        <span aria-hidden className="absolute right-3 top-2.5 flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-gold/70" /><span className="relative inline-flex size-2 rounded-full bg-gold" /></span>
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
        className="relative block rounded-2xl border border-gold/50 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/5 px-4 py-3 shadow-[0_6px_18px_-10px_var(--gold)] transition hover:-translate-y-0.5"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">La prière sur le Prophète ﷺ</p>
          <span className="flex shrink-0 items-center gap-0.5 text-[13px] font-semibold tabular-nums text-primary">
            {count} / {friday.goal} <ChevronRight className="size-4" />
          </span>
        </div>
        {/* La formule, une ligne sous l'autre comme dans les livres */}
        <div className="mt-1 space-y-0.5 text-center">
          <p lang="ar" dir="rtl" className="font-arabic text-[1.1rem] leading-[1.9] text-foreground">
            {SALAT_FORMULA.arabic}
          </p>
          <p className="text-xs italic leading-snug text-muted-foreground">{SALAT_FORMULA.phonetic}</p>
          <p className="text-xs leading-snug text-muted-foreground">{SALAT_FORMULA.french}</p>
        </div>
      </Link>
    );
  }

  return null;
}
