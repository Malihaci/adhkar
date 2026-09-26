import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Sparkles, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { readJSON, type DailyProgress } from "@/lib/storage";
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import { AdhkarSheet } from "@/components/AdhkarSheet";
import { CoranSheet } from "@/components/CoranSheet";
import { PlusSheet } from "@/components/PlusSheet";

function computeProgress(list: { id: string; repetitions: number }[], counts: Record<string, number>) {
  const total = list.reduce((n, d) => n + d.repetitions, 0);
  const done = list.reduce((n, d) => n + Math.min(counts[d.id] ?? 0, d.repetitions), 0);
  return total ? Math.round((done / total) * 100) : 0;
}

type Sheet = "adhkar" | "coran" | "plus" | null;

/**
 * Accueil | Coran | Adhkār | Plus (§5 mission) — toujours cet ordre.
 *
 * Lit `adhkar:progress` / `quran-last-page` via `readJSON` (lecture ponctuelle,
 * pas d'abonnement réactif) au moment précis où une feuille s'ouvre, plutôt
 * que via `useDailyProgress()`/`useLocalState()`. Cette nav est montée sur
 * TOUTE page (dans AppShell) : un abonnement réactif ici dupliquerait celui
 * déjà actif sur la page courante (ex. l'accueil) pour les mêmes clés — la
 * même cause que le bug déjà corrigé entre HomeSuggestion et Index
 * (avertissement React « setState pendant le rendu d'un autre composant »).
 */
export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [sheet, setSheet] = useState<Sheet>(null);
  const [adhkarPct, setAdhkarPct] = useState({ morning: 0, evening: 0 });
  const [lastPage, setLastPage] = useState(1);

  const openAdhkar = () => {
    const progress = readJSON<DailyProgress>("adhkar:progress", { date: "", counts: {} });
    setAdhkarPct({
      morning: computeProgress(morningAdhkar, progress.counts),
      evening: computeProgress(eveningAdhkar, progress.counts),
    });
    setSheet("adhkar");
  };
  const openCoran = () => {
    setLastPage(readJSON<number>("quran-last-page", 1));
    setSheet("coran");
  };

  const items = [
    { key: "accueil", to: "/" as const, label: "Accueil", icon: Home },
    { key: "coran", label: "Coran", icon: BookOpen, onOpen: openCoran },
    { key: "adhkar", label: "Adhkār", icon: Sparkles, onOpen: openAdhkar },
    { key: "plus", label: "Plus", icon: MoreHorizontal, onOpen: () => setSheet("plus") },
  ] as const;

  return (
    <>
      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70"
      >
        <ul className="mx-auto flex max-w-3xl items-stretch justify-around px-1 py-1.5">
          {items.map((item) => {
            const active = "to" in item ? pathname === item.to : false;
            const content = (
              <>
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-full transition-all",
                    active && "bg-primary/12",
                  )}
                >
                  <item.icon className="size-5" />
                </span>
                <span>{item.label}</span>
              </>
            );
            const className = cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground",
            );
            return (
              <li key={item.key} className="flex-1">
                {"to" in item ? (
                  <Link to={item.to} className={className}>
                    {content}
                  </Link>
                ) : (
                  <button onClick={item.onOpen} className={cn(className, "w-full")}>
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {sheet === "adhkar" && (
        <AdhkarSheet
          morningPct={adhkarPct.morning}
          eveningPct={adhkarPct.evening}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "coran" && <CoranSheet lastPage={lastPage} onClose={() => setSheet(null)} />}
      {sheet === "plus" && <PlusSheet onClose={() => setSheet(null)} />}
    </>
  );
}
