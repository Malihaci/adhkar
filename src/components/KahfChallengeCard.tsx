import { BookOpen } from "lucide-react";
import { useKahfChallenge } from "@/lib/kahfChallenge";
import { ACTION_COLORS, ActionCard } from "@/components/ActionCard";

/** Carte d'accueil « Défi du vendredi : lire Sourate Al-Kahf ». Visible du
 * Maghrib de jeudi au Maghrib de vendredi ; ouvre directement le Mushaf à la
 * page où reprendre ; disparaît dès que la sourate est terminée. */
export function KahfChallengeCard() {
  const { active, done, resumePage, pagesRead, totalPages } = useKahfChallenge();
  if (!active || done) return null;

  return (
    <ActionCard
      to="/quran/page/$page"
      params={{ page: String(resumePage) }}
      color={ACTION_COLORS.doux}
      icon={<BookOpen />}
      title="Défi du vendredi · Sourate Al-Kahf"
      sub={
        pagesRead > 0
          ? `${pagesRead} sur ${totalPages} pages · reprendre page ${resumePage}`
          : "À lire aujourd'hui"
      }
      cta={pagesRead > 0 ? "Continuer" : "Lire"}
      pct={pagesRead > 0 ? Math.min(100, (pagesRead / totalPages) * 100) : undefined}
    />
  );
}
