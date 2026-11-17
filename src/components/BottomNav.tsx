import { useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Sparkles, Clock, MoreHorizontal } from "lucide-react";
import { FloatingNav, type NavItem } from "@/components/FloatingNav";
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

  const items: NavItem[] = [
    { key: "accueil", to: "/", label: "Accueil", icon: Home, active: pathname === "/" },
    { key: "coran", label: "Coran", icon: BookOpen, onClick: openCoran },
    { key: "adhkar", label: "Adhkār", icon: Sparkles, onClick: openAdhkar },
    { key: "horaires", to: "/horaires", label: "Horaires", icon: Clock, active: pathname.startsWith("/horaires") },
    { key: "plus", label: "Plus", icon: MoreHorizontal, onClick: () => setSheet("plus") },
  ];

  return (
    <>
      <FloatingNav global items={items} />

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
