import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import { useDailyProgress } from "@/lib/storage";
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
import { usePreferences } from "@/lib/preferences";
import { usePrayerTimings } from "@/lib/prayerTimes";

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
  const { prefs, hydrated } = usePreferences();
  const { timings } = usePrayerTimings();
  const period = useDayPeriod(timings);

  return (
    <AppShell title="Accueil" homeHeader>
      {hydrated && !prefs.onboarded && <OnboardingModal />}
      <div className="space-y-3">
        <HomeHero />
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

      </div>

    </AppShell>
  );
}
