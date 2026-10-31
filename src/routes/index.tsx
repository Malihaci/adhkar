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
import { useDayPeriod } from "@/lib/dayPeriod";
import { NextPrayerWidget } from "@/components/NextPrayerWidget";
import { DhikrChallengeCard } from "@/components/DhikrChallengeCard";
import { KahfChallengeCard } from "@/components/KahfChallengeCard";
import { OnboardingModal } from "@/components/OnboardingModal";
import { usePreferences, resolveCoranMode } from "@/lib/preferences";
import { getAsrDateFromTimings, usePrayerTimings } from "@/lib/prayerTimes";
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

const ASR_FALLBACK_HOUR = 16;

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

  /** Porte "Adhkār" intelligente (chantier "Simplifier Horaires + Accueil"
   * §4) : ouvre directement /matin ou /soir quand le contexte le détermine
   * (même logique que HomeSuggestion — heure + vraie heure d'ʿAsr), sinon
   * retombe sur le choix existant (AdhkarSheet). */
  const openAdhkar = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 13 && morning.pct < 100) {
      navigate({ to: "/matin" });
      return;
    }
    const asrDate = getAsrDateFromTimings(timings);
    const pastAsr = asrDate ? now.getTime() >= asrDate.getTime() : hour >= ASR_FALLBACK_HOUR;
    if (pastAsr && evening.pct < 100) {
      navigate({ to: "/soir" });
      return;
    }
    setAdhkarChooserOpen(true);
  };

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
        <HomeDua now={period.now} isDay={period.isDay} />
        <NextPrayerWidget />
        {/* À faire aujourd'hui : défis du vendredi, dhikr du moment, Wird.
            La section disparaît s'il n'y a rien à faire. */}
        <section aria-label="À faire aujourd'hui" className="hidden has-[a]:block">
          <h2 className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            À faire aujourd'hui
          </h2>
          <div className="space-y-2">
            <KahfChallengeCard />
            <DhikrChallengeCard />
            <HomeToday counts={progress.counts} moment={period.adhkar} />
          </div>
        </section>

        {/* Accès principaux, compacts */}
        {/* Barre fixée en bas de l'écran (toutes tailles) ; zone sûre iPhone/Android incluse. */}
        <nav
          aria-label="Accès rapides"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border/50 bg-background/92 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl"
        >
          <div className="mx-auto grid max-w-3xl grid-cols-5 gap-2">
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
            label="Wird"
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
          <QuickAccess
            onClick={() => setPlusOpen(true)}
            label="Plus"
            arabic="المزيد"
            color="#6b7a72"
            icon={<MoreHorizontal className="size-5" />}
          />
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

/** Accès principal compact : icône colorée, nom, arabe — 4 par ligne. */
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
      className="surface-card group relative flex flex-col items-center gap-1 overflow-hidden rounded-2xl px-1 pb-3 pt-2.5 text-center transition hover:-translate-y-0.5 active:scale-[0.97]"
    >
      <span className="grid size-10 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--c)_16%,transparent)] text-[var(--c)] transition group-hover:scale-105">
        {icon}
      </span>
      <span className="font-display text-[0.95rem] font-bold leading-tight text-foreground">{label}</span>
      <span lang="ar" dir="rtl" className="font-arabic text-[0.95rem] leading-none text-[var(--c)]">
        {arabic}
      </span>
      <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[var(--c)] opacity-80" />
    </button>
  );
}
