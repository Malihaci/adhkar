import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, X } from "lucide-react";
import { useLocalState } from "@/lib/storage";
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import { effectiveSchedule, type WirdState } from "@/lib/khatma";
import { AL_KAHF_PAGE } from "@/lib/reminders";

/**
 * Une seule suggestion contextuelle prioritaire — jamais un tableau de
 * bord. Toujours ignorable. Ordre de priorité : Wird en cours → vendredi
 * (Al-Kahf) → Adhkâr du moment → reprendre la lecture.
 *
 * `lastPage`/`counts` sont reçus en props (déjà chargés par la page
 * d'accueil) plutôt que re-souscrits ici : deux instances indépendantes de
 * `useLocalState`/`useDailyProgress` pour les mêmes clés déclenchaient un
 * avertissement React ("setState pendant le rendu d'un autre composant").
 */
export function HomeSuggestion({
  lastPage,
  counts,
}: {
  lastPage: number;
  counts: Record<string, number>;
}) {
  const [dismissed, setDismissed] = useState(false);
  const [wird] = useLocalState<WirdState | null>("adhkar:wird", null);

  if (dismissed) return null;

  const suggestion = computeSuggestion(wird, lastPage, counts);
  if (!suggestion) return null;

  return (
    <div className="surface-card flex items-center gap-3 rounded-2xl border-primary/20 bg-primary/5 px-4 py-3">
      <Link
        to={suggestion.to}
        params={suggestion.params}
        className="flex min-w-0 flex-1 items-center gap-2"
      >
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {suggestion.label}
        </span>
        <ChevronRight className="size-4 shrink-0 text-primary" />
      </Link>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Ignorer la suggestion"
        className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

function computeSuggestion(
  wird: WirdState | null,
  lastPage: number,
  counts: Record<string, number>,
): {
  label: string;
  to: "/wird" | "/quran/page/$page" | "/matin" | "/soir";
  params?: Record<string, string>;
} | null {
  if (wird) {
    const schedule = effectiveSchedule(wird);
    const total = schedule.length;
    if (wird.lastCompletedDay < total) {
      const day = schedule.find((d) => d.day === wird.lastCompletedDay + 1);
      if (day) {
        return {
          label: `Continuer mon Wird — pages ${day.startPage}–${day.endPage}`,
          to: "/wird",
        };
      }
    }
  }

  const now = new Date();
  if (now.getDay() === 5) {
    return {
      label: "Vendredi — lire sourate Al-Kahf",
      to: "/quran/page/$page",
      params: { page: String(AL_KAHF_PAGE) },
    };
  }

  const hour = now.getHours();
  const morningDone = morningAdhkar.every((d) => (counts[d.id] ?? 0) >= d.repetitions);
  const eveningDone = eveningAdhkar.every((d) => (counts[d.id] ?? 0) >= d.repetitions);
  if (hour >= 4 && hour < 12 && !morningDone) {
    return { label: "Adhkâr du matin", to: "/matin" };
  }
  if (hour >= 16 && hour < 24 && !eveningDone) {
    return { label: "Adhkâr du soir", to: "/soir" };
  }

  if (lastPage > 1) {
    return {
      label: `Reprendre la lecture — page ${lastPage}`,
      to: "/quran/page/$page",
      params: { page: String(lastPage) },
    };
  }

  return null;
}
