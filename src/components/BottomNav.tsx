import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Sparkles, Clock, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { readJSON, type DailyProgress } from "@/lib/storage";
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import { AdhkarSheet } from "@/components/AdhkarSheet";
import { PlusSheet } from "@/components/PlusSheet";
import { loadPreferences, resolveCoranMode } from "@/lib/preferences";

function computeProgress(list: { id: string; repetitions: number }[], counts: Record<string, number>) {
  const total = list.reduce((n, d) => n + d.repetitions, 0);
  const done = list.reduce((n, d) => n + Math.min(counts[d.id] ?? 0, d.repetitions), 0);
  return total ? Math.round((done / total) * 100) : 0;
}

type Sheet = "adhkar" | "plus" | null;

/**
 * Accueil | Coran | Adhkār | Horaires | Plus — même style flottant que la barre
 * du Coran (petite icône + petit nom). Présente aussi sur l’accueil.
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
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [adhkarPct, setAdhkarPct] = useState({ morning: 0, evening: 0 });

  const openAdhkar = () => {
    const progress = readJSON<DailyProgress>("adhkar:progress", { date: "", counts: {} });
    setAdhkarPct({
      morning: computeProgress(morningAdhkar, progress.counts),
      evening: computeProgress(eveningAdhkar, progress.counts),
    });
    setSheet("adhkar");
  };
  /** Chantier "Coran direct" — plus d'écran intermédiaire (CoranSheet,
   * supprimé) : un seul clic ouvre directement la dernière position, dans
   * le lecteur (Mushaf ou ayah par ayah) que les préférences imposent. */
  const openCoran = () => {
    const prefs = loadPreferences();
    if (resolveCoranMode(prefs) === "mushaf") {
      const lastPage = readJSON<number>("quran-last-page", 1);
      navigate({ to: "/quran/page/$page", params: { page: String(lastPage) } });
    } else {
      const lastSurah = readJSON<number>("quran-last-surah", 1);
      navigate({
        to: "/quran/lire/$surah",
        params: { surah: String(lastSurah) },
        search: { p: readJSON<number>("quran-last-page", 0) || undefined },
      });
    }
  };

  const items = [
    { key: "accueil", to: "/" as const, label: "Accueil", icon: Home },
    { key: "coran", label: "Coran", icon: BookOpen, onOpen: openCoran },
    { key: "adhkar", label: "Adhkār", icon: Sparkles, onOpen: openAdhkar },
    { key: "horaires", to: "/horaires" as const, label: "Horaires", icon: Clock },
    { key: "plus", label: "Plus", icon: MoreHorizontal, onOpen: () => setSheet("plus") },
  ] as const;

  return (
    <>
      <nav
        aria-label="Navigation principale"
        style={{ bottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
        className="fixed inset-x-3 z-40 mx-auto max-w-md rounded-[1.35rem] border border-border/60 bg-card/85 px-1.5 py-1 shadow-[0_8px_24px_-8px_rgba(0,0,0,.35)] backdrop-blur-xl"
      >
        <ul className="flex items-center justify-around">
          {items.map((item) => {
            const active = "to" in item ? (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)) : false;
            const className = cn(
              "flex w-full flex-col items-center gap-0.5 rounded-xl py-1.5 transition active:scale-95 active:bg-muted",
              active ? "text-primary" : "text-muted-foreground",
            );
            const content = (
              <>
                <span className={active ? "text-primary" : "text-foreground/80"}>
                  <item.icon className="size-[19px]" strokeWidth={1.75} />
                </span>
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </>
            );
            return (
              <li key={item.key} className="flex-1">
                {"to" in item ? (
                  <Link to={item.to} aria-label={item.label} className={className}>
                    {content}
                  </Link>
                ) : (
                  <button type="button" onClick={item.onOpen} aria-label={item.label} className={className}>
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
      {sheet === "plus" && <PlusSheet onClose={() => setSheet(null)} />}
    </>
  );
}
