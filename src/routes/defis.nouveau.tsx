import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  FREE_COUNTER_ID,
  SALAT_DHIKR_ID,
  challengeApi,
  counterDhikrList,
  dhikrShortTitle,
  endOfDayISO,
  isFriday,
  type ChallengeType,
} from "@/lib/dhikrCounter";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/defis/nouveau")({
  validateSearch: (s: Record<string, unknown>): { dhikr?: string } => ({
    dhikr: typeof s.dhikr === "string" ? s.dhikr : undefined,
  }),
  head: () => ({ meta: [{ title: "Créer un défi" }] }),
  component: NewChallengePage,
});

const GOALS = [33, 100, 500, 1000, 10000];
const ENDS = [
  { label: "Aujourd'hui", days: 0 },
  { label: "3 jours", days: 2 },
  { label: "7 jours", days: 6 },
  { label: "30 jours", days: 29 },
];

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-12 flex-1 rounded-2xl border px-3 text-sm font-semibold transition",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</p>;
}

function NewChallengePage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [dhikrId, setDhikrId] = useState(search.dhikr ?? SALAT_DHIKR_ID);
  const [type, setType] = useState<ChallengeType>("collective");
  const [target, setTarget] = useState(100);
  const [endDays, setEndDays] = useState(0);
  const [leaderboard, setLeaderboard] = useState(false);
  const [title, setTitle] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultTitle =
    dhikrId === SALAT_DHIKR_ID && isFriday() ? "Défi du vendredi" : `Défi — ${dhikrShortTitle(dhikrId)}`;

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const { challenge } = await challengeApi.create({
        dhikrId,
        title: (title.trim() || defaultTitle).slice(0, 80),
        type,
        target,
        endsAt: endOfDayISO(endDays),
        leaderboardEnabled: leaderboard,
      });
      navigate({ to: "/challenge/$id", params: { id: challenge.id }, search: { nouveau: 1 } });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const dhikrOptions = [...counterDhikrList().map((d) => d.id), FREE_COUNTER_ID];

  return (
    <AppShell title="Créer un défi" subtitle="Rapide et simple" hideSettings>
      <div className="space-y-6">
        <div>
          <Label>Dhikr</Label>
          <select
            value={dhikrId}
            onChange={(e) => setDhikrId(e.target.value)}
            className="h-14 w-full rounded-2xl border border-border bg-card px-4 text-base font-medium text-foreground"
          >
            {dhikrOptions.map((id) => (
              <option key={id} value={id}>
                {dhikrShortTitle(id)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Type de défi</Label>
          <div className="flex gap-2">
            <Choice active={type === "collective"} onClick={() => setType("collective")}>
              Collectif
            </Choice>
            <Choice active={type === "individual"} onClick={() => setType("individual")}>
              Individuel
            </Choice>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {type === "collective"
              ? "Tout le monde compte vers un objectif commun."
              : "Chacun a son propre objectif."}
          </p>
        </div>

        <div>
          <Label>{type === "collective" ? "Objectif collectif" : "Objectif du défi"}</Label>
          <div className="flex flex-wrap gap-2">
            {(type === "collective" ? [100, 1000, 10000, 100000] : GOALS.slice(0, 4)).map((g) => (
              <Choice key={g} active={target === g} onClick={() => setTarget(g)}>
                {g.toLocaleString("fr-FR")}
              </Choice>
            ))}
          </div>
        </div>

        <div>
          <Label>Fin</Label>
          <div className="flex flex-wrap gap-2">
            {ENDS.map((e) => (
              <Choice key={e.days} active={endDays === e.days} onClick={() => setEndDays(e.days)}>
                {e.label}
              </Choice>
            ))}
          </div>
        </div>

        <div>
          <Label>Classement</Label>
          <div className="flex gap-2">
            <Choice active={!leaderboard} onClick={() => setLeaderboard(false)}>
              Non
            </Choice>
            <Choice active={leaderboard} onClick={() => setLeaderboard(true)}>
              Oui
            </Choice>
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            className="min-h-11 text-xs font-medium text-muted-foreground underline-offset-4 hover:underline"
          >
            Plus d'options
          </button>
          {showMore && (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              placeholder={defaultTitle}
              className="mt-2 h-12 w-full rounded-xl border border-border bg-card px-3 text-sm"
              aria-label="Nom du défi"
            />
          )}
        </div>

        {error && <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="flex min-h-16 w-full items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-[var(--shadow-soft)] disabled:opacity-60"
        >
          {busy ? "Création…" : "Créer et partager"}
        </button>
      </div>
    </AppShell>
  );
}
