import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  SALAT_DHIKR_ID,
  dhikrShortTitle,
  isChallengeEnded,
  isFriday,
  todayKey,
  useDhikrLog,
  useFridayChallenge,
  useLocalChallenges,
} from "@/lib/dhikrCounter";
import { useSmartReminderPrefs } from "@/lib/smartReminders";

export const Route = createFileRoute("/defis/")({
  head: () => ({ meta: [{ title: "Mes défis" }] }),
  component: ChallengesPage,
});

function ChallengesPage() {
  const [challenges] = useLocalChallenges();
  const [friday, setFriday] = useFridayChallenge();
  const [log] = useDhikrLog();
  const [smart, setSmart] = useSmartReminderPrefs();
  const fridayToday = log[todayKey()]?.[SALAT_DHIKR_ID] ?? 0;
  const challengeReminders = smart.challenges !== false;

  return (
    <AppShell title="Mes défis" subtitle="Dhikr ensemble" hideSettings>
      <div className="space-y-5">
        <Link
          to="/defis/nouveau"
          className="flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-base font-semibold text-primary-foreground shadow-[var(--shadow-soft)]"
        >
          <Plus className="size-5" /> Créer un défi
        </Link>

        <div className="space-y-3">
          {challenges.length === 0 && (
            <p className="surface-card p-5 text-center text-sm text-muted-foreground">
              Aucun défi pour l'instant. Créez-en un, ou ouvrez un lien reçu.
            </p>
          )}
          {challenges.map((c) => {
            const ended = isChallengeEnded(c);
            return (
              <Link
                key={c.id}
                to="/challenge/$id"
                params={{ id: c.id }}
                className="surface-card flex min-h-20 items-center gap-3 rounded-2xl px-4 py-4 transition hover:-translate-y-0.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{c.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {dhikrShortTitle(c.dhikrId)} ·{" "}
                    {ended ? "Terminé" : c.type === "collective" ? "Collectif" : "Individuel"}
                  </p>
                </div>
                <span className="text-lg font-bold tabular-nums text-primary">
                  {c.type === "collective" && c.lastKnownTotal != null
                    ? `${c.lastKnownTotal}/${c.target}`
                    : `${c.myCount}/${c.target}`}
                </span>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
              </Link>
            );
          })}
        </div>

        <div className="surface-card space-y-3 p-5">
          <p className="font-display text-base font-semibold text-foreground">Vendredi 🌿</p>
          <p className="text-sm text-muted-foreground">
            Salāt sur le Prophète ﷺ — objectif personnel :{" "}
            <span className="font-semibold text-foreground">{friday.goal}</span>
            {isFriday() ? ` · aujourd'hui ${fridayToday}` : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {[50, 100, 300, 500].map((g) => (
              <button
                key={g}
                onClick={() => setFriday({ goal: g })}
                className={`min-h-11 min-w-14 rounded-full border px-4 text-sm font-semibold tabular-nums ${
                  friday.goal === g ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <Link
            to="/compteur/$dhikrId"
            params={{ dhikrId: SALAT_DHIKR_ID }}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-primary"
          >
            Ouvrir le compteur
          </Link>
          <label className="flex min-h-11 items-center justify-between gap-3 border-t border-border pt-3 text-sm font-medium text-foreground">
            Rappels des défis Dhikr
            <input
              type="checkbox"
              className="size-6 accent-[var(--color-primary)]"
              checked={challengeReminders}
              onChange={(e) => setSmart({ ...smart, challenges: e.target.checked })}
            />
          </label>
          <p className="text-xs text-muted-foreground">
            Le nombre est un objectif personnel que vous choisissez, pas un nombre prescrit.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
