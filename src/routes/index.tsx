import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BookMarked, BookOpen, Clock, MoreHorizontal, Sparkles } from "lucide-react";
import { PlusSheet } from "@/components/PlusSheet";
import { AppShell } from "@/components/AppShell";
import { AdhkarSheet } from "@/components/AdhkarSheet";
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import { useDailyProgress, useLocalState } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { HomeHero } from "@/components/HomeHero";
import { HomeDua } from "@/components/HomeDua";
import { HomeToday } from "@/components/HomeToday";
import { HomeCalm } from "@/components/HomeCalm";
import { ResumeReadingCard } from "@/components/ResumeReadingCard";
import { useDayPeriod } from "@/lib/dayPeriod";
import { NextPrayerWidget } from "@/components/NextPrayerWidget";
import { DhikrChallengeCard } from "@/components/DhikrChallengeCard";
import { KahfChallengeCard } from "@/components/KahfChallengeCard";
import { OnboardingModal } from "@/components/OnboardingModal";
import { usePreferences, resolveCoranMode } from "@/lib/preferences";
import { usePrayerTimings } from "@/lib/prayerTimes";
import { getWirdResumeTarget, type WirdState } from "@/lib/khatma";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Accueil — NurMaLiHa" },
      {
        name: "description",
        content: "Adhkâr, Coran, horaires de prière et lecture du jour.",
      },
      { property: "og:title", content: "NurMaLiHa — Accueil" },
      {
        property: "og:description",
        content: "Adhkâr, Coran, horaires de prière et lecture du jour.",
      },
    ],
  }),
  component: Index,
});

function computeProgress(
  list: { id: string; repetitions: number }[],
  counts: Record<string, number>,
) {
  const total = list.reduce((n, d) => n + d.repetitions, 0);
  const done = list.reduce((n, d) => n + Math.min(counts[d.id] ?? 0, d.repetitions), 0);
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

function Index() {
  const { progress } = useDailyProgress();
  const morning = computeProgress(morningAdhkar, progress.counts);
  const evening = computeProgress(eveningAdhkar, progress.counts);
  const [lastPage] = useLocalState<number>("quran-last-page", 1);
  const [lastSurah] = useLocalState<number>("quran-last-surah", 1);
  const [wird] = useLocalState<WirdState | null>("adhkar:wird", null);
  const [adhkarChooserOpen, setAdhkarChooserOpen] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const { prefs, hydrated } = usePreferences();
  const { timings } = usePrayerTimings();
  const navigate = useNavigate();
  const period = useDayPeriod(timings);

  /** Chantier "Coran direct" (§1/§2/§17) : un seul clic, plus d'écran
   * intermédiaire — ouvre directement le lecteur (Mushaf ou ayah par ayah)
   * qu'imposent les préférences, à la dernière position connue. */
  const openCoran = () => {
    if (resolveCoranMode(prefs) === "mushaf") {
      navigate({ to: "/quran/page/$page", params: { page: String(lastPage) } });
    } else {
      navigate({ to: "/quran/lire/$surah", params: { surah: String(lastSurah) } });
    }
  };

  /** Porte "Adhkār" : ouvre toujours la liste des adhkār (AdhkarSheet) ;
   * « À faire aujourd'hui » reste le raccourci vers le dhikr du moment. */
  const openAdhkar = () => setAdhkarChooserOpen(true);

  /** Porte "Lecture du jour" (remplace "Mon Wird", §2/§4) : ouvre
   * directement la portion du jour à la page de reprise réelle, sans
   * jamais reposer sur une autre source que `getWirdResumeTarget`
   * (partagée avec le moteur de rappels). Sans Wird actif ou résumable,
   * retombe sur l'écran Mon Wird (création/suivi). */
  const openLectureDuJour = () => {
    const target = getWirdResumeTarget(wird, lastPage);
    if (!target) {
      navigate({ to: "/wird" });
      return;
    }
    navigate({
      to: "/quran/page/$page",
      params: { page: String(target.resumePage) },
      search: { end: target.endPage, shared: "wird" },
    });
  };

  return (
    <AppShell title="Accueil" homeHeader>
      {hydrated && !prefs.onboarded && <OnboardingModal />}
      <div className="space-y-3">
        <HomeHero isDay={period.isDay} />
        <NextPrayerWidget />
        {/* À faire aujourd'hui : défis, dhikr du moment, Lecture du jour, reprise
            du Coran. La section disparaît s'il n'y a rien à faire ; l'état calme
            prend alors sa place. */}
        <div className="group/todo space-y-3">
          <section aria-label="À faire aujourd'hui" className="hidden has-[a]:block">
            <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              À faire aujourd'hui
            </h2>
            <div className="space-y-2">
              <KahfChallengeCard />
              <HomeToday counts={progress.counts} moment={period.adhkar} />
              <DhikrChallengeCard />
              <ResumeReadingCard />
            </div>
          </section>
          <HomeCalm />
        </div>

        {/* Hadith / doua du moment : secondaire, sous les actions du jour. */}
        <HomeDua now={period.now} isDay={period.isDay} />

        {/* Accès principaux, compacts */}
        {/* Barre fixée en bas de l'écran (toutes tailles) ; zone sûre iPhone/Android incluse. */}
        <nav
          aria-label="Accès rapides"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border/50 bg-background/92 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl"
        >
          <div className="mx-auto grid max-w-3xl grid-cols-[repeat(4,minmax(0,1fr))_3.5rem] items-start gap-2">
          <QuickAccess
            onClick={openCoran}
            label="Coran"
            arabic="قُرْآن"
            color="#1f9d6b"
            icon={<BookOpen className="size-5" />}
          />
          <QuickAccess
            onClick={openAdhkar}
            label="Adhkār"
            arabic="أَذْكَار"
            color="#c79a2e"
            icon={<Sparkles className="size-5" />}
          />
          <QuickAccess
            onClick={openLectureDuJour}
            label="Lecture du jour"
            arabic="وِرْد"
            color="#8a63c0"
            icon={<BookMarked className="size-5" />}
          />
          <QuickAccess
            onClick={() => navigate({ to: "/horaires" })}
            label="Horaires"
            arabic="مَوَاقِيت"
            color="#2d8fbf"
            icon={<Clock className="size-5" />}
          />
          <button
            onClick={() => setPlusOpen(true)}
            aria-label="Plus"
            className="flex h-[5.25rem] flex-col items-center gap-1 pt-2.5 text-muted-foreground transition active:scale-[0.97] hover:text-foreground"
          >
            <span className="grid size-8 place-items-center">
              <MoreHorizontal className="size-5" />
            </span>
            <span className="flex h-[1.9rem] items-center text-[12.5px] font-medium">Plus</span>
          </button>
          </div>
        </nav>
      </div>

      {plusOpen && <PlusSheet onClose={() => setPlusOpen(false)} />}
      {adhkarChooserOpen && (
        <AdhkarSheet
          morningPct={morning.pct}
          eveningPct={evening.pct}
          onClose={() => setAdhkarChooserOpen(false)}
        />
      )}
    </AppShell>
  );
}

/** Accès principal compact : icône colorée, nom (2 lignes max), arabe — hauteur identique pour tous. */
function QuickAccess({
  onClick,
  label,
  arabic,
  color,
  icon,
}: {
  onClick: () => void;
  label: string;
  arabic: string;
  color: string;
  icon: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{ "--c": color } as React.CSSProperties}
      className="surface-card group flex h-[5.25rem] flex-col items-center gap-1 rounded-2xl px-1 pb-2 pt-2 text-center transition duration-150 active:scale-[0.97]"
    >
      <span className="grid size-8 place-items-center rounded-[10px] bg-[color-mix(in_srgb,var(--c)_16%,transparent)] text-[var(--c)] [&_svg]:size-[17px]">
        {icon}
      </span>
      <span className="flex h-[1.9rem] items-center font-display text-[0.8rem] font-bold leading-[1.1] text-foreground">{label}</span>
      <span lang="ar" dir="rtl" className="font-arabic text-[0.8rem] leading-none text-[var(--c)]">
        {arabic}
      </span>
    </button>
  );
}
