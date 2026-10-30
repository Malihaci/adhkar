import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useKahfChallenge } from "@/lib/kahfChallenge";

/** Pastille d'accueil « Défi du vendredi : lire Sourate Al-Kahf ». Visible du
 * Maghrib de jeudi au Maghrib de vendredi ; ouvre directement le Mushaf à la
 * page où reprendre ; disparaît dès que la sourate est terminée. */
export function KahfChallengeCard() {
  const { active, done, resumePage, pagesRead, totalPages } = useKahfChallenge();
  if (!active || done) return null;

  return (
    <Link
      to="/quran/page/$page"
      params={{ page: String(resumePage) }}
      className="relative flex min-h-16 items-center gap-3 rounded-2xl border border-gold/50 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/5 px-4 py-3 shadow-[0_6px_18px_-10px_var(--gold)] transition hover:-translate-y-0.5"
    >
      <span aria-hidden className="absolute right-3 top-2.5 flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-gold/70" /><span className="relative inline-flex size-2 rounded-full bg-gold" /></span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          Défi du vendredi · Sourate Al-Kahf 🌿
        </p>
        <p className="text-xs tabular-nums text-muted-foreground">
          {pagesRead > 0
            ? `${pagesRead} / ${totalPages} pages · reprendre à la page ${resumePage}`
            : "À lire aujourd'hui — touchez pour commencer"}
        </p>
      </div>
      <span className="flex items-center gap-1 text-sm font-semibold text-primary">
        {pagesRead > 0 ? "Continuer" : "Lire"} <ChevronRight className="size-4" />
      </span>
    </Link>
  );
}
