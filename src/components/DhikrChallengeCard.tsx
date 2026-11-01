import { Target } from "lucide-react";
import {
  SALAT_DHIKR_ID,
  isChallengeEnded,
  isFriday,
  todayKey,
  useDhikrLog,
  useFridayChallenge,
  useLocalChallenges,
} from "@/lib/dhikrCounter";
import { ACTION_COLORS, ActionCard } from "@/components/ActionCard";

/** Carte contextuelle d'accueil : seulement s'il existe un défi pertinent
 * maintenant (défi actif non atteint, ou vendredi) — sinon rien n'est rendu.
 * Lecture locale uniquement, aucun appel réseau. */
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
      <ActionCard
        to="/challenge/$id"
        params={{ id: active.id }}
        color={ACTION_COLORS.doux}
        icon={<Target />}
        title={active.title}
        sub={`${value.toLocaleString("fr-FR")} sur ${active.target.toLocaleString("fr-FR")}`}
        cta="Continuer"
        pct={Math.min(100, (value / active.target) * 100)}
      />
    );
  }

  if (isFriday()) {
    const count = log[todayKey()]?.[SALAT_DHIKR_ID] ?? 0;
    if (count >= friday.goal) return null;
    return (
      <ActionCard
        to="/compteur/$dhikrId"
        params={{ dhikrId: SALAT_DHIKR_ID }}
        color={ACTION_COLORS.doux}
        icon={<Target />}
        title="La prière sur le Prophète ﷺ"
        sub={`${count} sur ${friday.goal} · défi du vendredi`}
        cta={count > 0 ? "Continuer" : "Commencer"}
        pct={Math.min(100, (count / friday.goal) * 100)}
      />
    );
  }

  return null;
}
