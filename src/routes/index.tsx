import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BookOpen, ChevronRight, Clock, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AdhkarSheet } from "@/components/AdhkarSheet";
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import { useDailyProgress, useLocalState } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { HomeSuggestion } from "@/components/HomeSuggestion";
import { NextPrayerWidget } from "@/components/NextPrayerWidget";
import { DhikrChallengeCard } from "@/components/DhikrChallengeCard";
import { KahfChallengeCard } from "@/components/KahfChallengeCard";
import { OnboardingModal } from "@/components/OnboardingModal";
import { usePreferences, resolveCoranMode } from "@/lib/preferences";
import {
  PRAYER_LABELS,
  getAsrDateFromTimings,
  getNextPrayer,
  usePrayerTimings,
} from "@/lib/prayerTimes";
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

  /* Informations affichées sous chaque titre (tout est déjà connu localement). */
  const morningTime = new Date().getHours() < 13;
  const adhkarPct = morningTime ? morning.pct : evening.pct;
  const adhkarHint = `${morningTime ? "Matin" : "Soir"} : ${adhkarPct} % terminé`;
  const nextPrayer = timings ? getNextPrayer(timings) : null;
  const prayerHint = nextPrayer
    ? `Prochaine : ${PRAYER_LABELS[nextPrayer.key]} à ${String(nextPrayer.time.getHours()).padStart(2, "0")}:${String(nextPrayer.time.getMinutes()).padStart(2, "0")}`
    : "Voir les horaires du jour";
  const wirdTarget = getWirdResumeTarget(wird, lastPage);
  const wirdHint = wirdTarget
    ? `Reprendre à la page ${wirdTarget.resumePage}`
    : "Créer ou suivre mon Wird";

  return (
    <AppShell title="Accueil" homeHeader>
      {hydrated && !prefs.onboarded && <OnboardingModal />}
      <div className="space-y-5">
        <NextPrayerWidget />
        <HomeSuggestion counts={progress.counts} />
        <KahfChallengeCard />
        <DhikrChallengeCard />

        {/* À reprendre : une seule carte, trois lignes fines */}
        <section aria-labelledby="home-resume" className="space-y-2">
          <h2
            id="home-resume"
            className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            À reprendre
          </h2>
          <div className="surface-card divide-y divide-border/60 overflow-hidden rounded-2xl">
            <ResumeRow
              onClick={openCoran}
              icon={<BookOpen className="size-[18px]" />}
              label="Coran"
              hint={`Page ${lastPage}`}
            />
            <ResumeRow
              onClick={openAdhkar}
              icon={<Sparkles className="size-[18px]" />}
              label="Adhkār"
              hint={adhkarHint}
              progress={adhkarPct}
            />
            <ResumeRow
              onClick={openLectureDuJour}
              icon={<BookOpen className="size-[18px]" />}
              label="Lecture du jour"
              hint={wirdHint}
            />
          </div>
        </section>

        {/* Accès principaux, compacts */}
        <section aria-label="Accès rapides" className="grid grid-cols-4 gap-2.5">
          <QuickAccess
            onClick={openCoran}
            label="Coran"
            arabic="قُرْآن"
            icon={<BookOpen className="size-5" />}
          />
          <QuickAccess
            onClick={openAdhkar}
            label="Adhkār"
            arabic="أَذْكَار"
            icon={<Sparkles className="size-5" />}
          />
          <QuickAccess
            onClick={() => navigate({ to: "/horaires" })}
            label="Horaires"
            arabic="مَوَاقِيت"
            hint={prayerHint}
            icon={<Clock className="size-5" />}
          />
          <QuickAccess
            onClick={openLectureDuJour}
            label="Wird"
            arabic="وِرْد"
            icon={<BookOpen className="size-5" />}
          />
        </section>
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

/** Ligne « À reprendre » : icône, titre, info utile, barre fine éventuelle. */
function ResumeRow({
  onClick,
  icon,
  label,
  hint,
  progress,
}: {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  hint: string;
  progress?: number;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex min-h-[3.5rem] w-full items-center gap-3 px-3.5 py-2.5 text-left transition hover:bg-muted/50 active:bg-muted"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-display text-[1.05rem] font-semibold leading-tight text-foreground">
          {label}
        </span>
        <span className="truncate text-xs text-muted-foreground">{hint}</span>
        {progress !== undefined && (
          <span className="mt-1 block h-1 overflow-hidden rounded-full bg-border">
            <span
              className="block h-full rounded-full bg-primary"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </span>
        )}
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5" />
    </button>
  );
}

/** Accès principal compact : icône, nom, arabe — 4 par ligne. */
function QuickAccess({
  onClick,
  label,
  arabic,
  icon,
}: {
  onClick: () => void;
  label: string;
  arabic: string;
  hint?: string;
  icon: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="surface-card group flex flex-col items-center gap-1 rounded-2xl px-1 py-3 text-center transition hover:-translate-y-0.5 hover:border-primary/40 active:scale-[0.97]"
    >
      <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary transition group-hover:scale-105">
        {icon}
      </span>
      <span className="font-display text-[0.95rem] font-semibold leading-tight text-foreground">
        {label}
      </span>
      <span lang="ar" dir="rtl" className="font-arabic text-[0.95rem] leading-none text-muted-foreground">
        {arabic}
      </span>
    </button>
  );
}
