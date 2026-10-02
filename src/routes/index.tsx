import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BookOpen, Clock, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AdhkarSheet } from "@/components/AdhkarSheet";
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import { useDailyProgress, useLocalState } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { HomeSuggestion } from "@/components/HomeSuggestion";
import { NextPrayerWidget } from "@/components/NextPrayerWidget";
import { DhikrChallengeCard } from "@/components/DhikrChallengeCard";
import { OnboardingModal } from "@/components/OnboardingModal";
import { usePreferences, resolveCoranMode } from "@/lib/preferences";
import { getAsrDateFromTimings, usePrayerTimings } from "@/lib/prayerTimes";
import { getWirdResumeTarget, type WirdState } from "@/lib/khatma";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Accueil — Adhkâr du Matin et du Soir" },
      {
        name: "description",
        content: "Adhkâr, Coran, horaires de prière et lecture du jour.",
      },
      { property: "og:title", content: "Adhkâr — Accueil" },
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
  const { prefs, hydrated } = usePreferences();
  const { timings } = usePrayerTimings();
  const navigate = useNavigate();

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
      <div className="space-y-5">
        <NextPrayerWidget />
        <HomeSuggestion counts={progress.counts} />
        <DhikrChallengeCard />

        {/* 4 portes principales, exactement — même style, même taille (§2) */}
        <div className="grid grid-cols-2 gap-4">
          <GateButton
            onClick={openCoran}
            label="Coran"
            arabic="قُرْآن"
            icon={<BookOpen className="size-6" />}
          />
          <GateButton
            onClick={openAdhkar}
            label="Adhkār"
            arabic="ذِكْر"
            icon={<Sparkles className="size-6" />}
          />
          <GateButton
            onClick={() => navigate({ to: "/horaires" })}
            label="Horaires de prière"
            arabic="مواقيت الصلاة"
            icon={<Clock className="size-6" />}
          />
          <GateButton
            onClick={openLectureDuJour}
            label="Lecture du jour"
            arabic="وِرْد"
            icon={<BookOpen className="size-6" />}
          />
        </div>
      </div>

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

/** Style commun aux 4 portes — même dimension, même famille visuelle,
 * un seul ton (chantier "Simplifier Horaires + Accueil" §2 : "même style,
 * même taille" — fini la distinction primaire/or entre portes). */
const GATE_CLASS =
  "surface-card group flex aspect-square flex-col items-center justify-center gap-2.5 rounded-3xl p-4 text-center transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)] active:scale-[0.98]";

function GateIcon({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-14 place-items-center rounded-2xl bg-primary/12 text-primary transition group-hover:scale-105">
      {children}
    </span>
  );
}

function GateLabel({ label, arabic }: { label: string; arabic: string }) {
  return (
    <span className="flex flex-col items-center gap-0.5">
      <span className="font-display text-base font-semibold text-foreground sm:text-lg">
        {label}
      </span>
      <span lang="ar" dir="rtl" className="font-arabic text-sm text-muted-foreground">
        {arabic}
      </span>
    </span>
  );
}

function GateButton({
  onClick,
  label,
  arabic,
  icon,
}: {
  onClick: () => void;
  label: string;
  arabic: string;
  icon: ReactNode;
}) {
  return (
    <button onClick={onClick} className={cn(GATE_CLASS)}>
      <GateIcon>{icon}</GateIcon>
      <GateLabel label={label} arabic={arabic} />
    </button>
  );
}
