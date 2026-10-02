import { useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Info, Swords } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CounterPad } from "@/components/CounterPad";
import {
  FREE_COUNTER_ID,
  SALAT_DHIKR_ID,
  addToLog,
  dhikrShortTitle,
  getCounterDhikr,
  isFriday,
  reportedNumber,
  todayKey,
  useDhikrLog,
  useFridayChallenge,
  usePersonalCounters,
} from "@/lib/dhikrCounter";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compteur/$dhikrId")({
  head: () => ({ meta: [{ title: "Compteur de dhikr" }] }),
  component: CounterPage,
});

const GOAL_CHOICES = [33, 100, 500, 1000];

function CounterPage() {
  const { dhikrId } = Route.useParams();
  const dhikr = dhikrId === FREE_COUNTER_ID ? null : getCounterDhikr(dhikrId);
  const [counters, setCounters] = usePersonalCounters();
  const [log, setLog] = useDhikrLog();
  const [friday] = useFridayChallenge();
  const [sessionTaps, setSessionTaps] = useState(0);
  const [advanced, setAdvanced] = useState(false);
  const [customGoal, setCustomGoal] = useState("");
  const lastTap = useRef(0);

  const entry = counters[dhikrId] ?? { count: 0 };
  const fridayMode = dhikrId === SALAT_DHIKR_ID && isFriday();
  const todayCount = log[todayKey()]?.[dhikrId] ?? 0;
  // Le vendredi, la salāt se compte contre l'objectif personnel du jour.
  const shownCount = fridayMode ? todayCount : entry.count;
  const goal = fridayMode ? friday.goal : entry.goal;
  const reported = reportedNumber(dhikrId);

  const bump = (delta: 1 | -1) => {
    setCounters((c) => {
      const cur = c[dhikrId] ?? { count: 0 };
      return { ...c, [dhikrId]: { ...cur, count: Math.max(0, cur.count + delta) } };
    });
    setLog((l) => addToLog(l, dhikrId, delta));
  };

  const setGoal = (g: number | undefined) =>
    setCounters((c) => ({ ...c, [dhikrId]: { ...(c[dhikrId] ?? { count: 0 }), goal: g } }));

  if (dhikrId !== FREE_COUNTER_ID && !dhikr) {
    return (
      <AppShell title="Compteur" hideSettings>
        <p className="surface-card p-6 text-center text-sm text-muted-foreground">Dhikr introuvable.</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="Compteur" subtitle={dhikrShortTitle(dhikrId)} hideSettings>
      <div className="space-y-5">
        {fridayMode && (
          <p className="rounded-2xl bg-primary/8 px-4 py-3 text-center text-sm font-medium text-primary">
            Vendredi 🌿 · Objectif personnel : {friday.goal}
          </p>
        )}

        {dhikr && (
          <div className="surface-card space-y-2 p-5 text-center">
            <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-loose text-foreground">
              {dhikr.arabic}
            </p>
            <p className="text-sm text-muted-foreground">{dhikr.translation}</p>
          </div>
        )}

        <CounterPad
          count={shownCount}
          goal={goal}
          goalLabel="Objectif personnel"
          canUndo={sessionTaps > 0 && shownCount > 0}
          onIncrement={() => {
            lastTap.current = Date.now();
            setSessionTaps((n) => n + 1);
            bump(1);
          }}
          onUndo={() => {
            setSessionTaps((n) => Math.max(0, n - 1));
            bump(-1);
          }}
        />

        {reported && (
          <div className="surface-card flex gap-3 p-4 text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Nombre rapporté : {reported.count}</span>
              <br />
              {reported.reference}
            </p>
          </div>
        )}

        {!fridayMode && (
          <div className="space-y-2">
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Objectif personnel (facultatif)
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {GOAL_CHOICES.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(entry.goal === g ? undefined : g)}
                  className={cn(
                    "min-h-11 min-w-16 rounded-full border px-4 text-sm font-semibold tabular-nums transition",
                    entry.goal === g
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground",
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        <Link
          to="/defis/nouveau"
          search={{ dhikr: dhikrId }}
          className="surface-card flex min-h-14 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
        >
          <Swords className="size-4 text-primary" /> Créer un défi avec ce dhikr
        </Link>

        <div className="text-center">
          <button
            onClick={() => setAdvanced((v) => !v)}
            className="min-h-11 text-xs font-medium text-muted-foreground underline-offset-4 hover:underline"
          >
            Options
          </button>
          {advanced && (
            <div className="surface-card mt-2 space-y-3 p-4">
              {!fridayMode && (
                <div className="flex items-center gap-2">
                  <input
                    inputMode="numeric"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value.replace(/\D/g, "").slice(0, 7))}
                    placeholder="Autre objectif"
                    className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-background px-3 text-sm"
                  />
                  <button
                    onClick={() => {
                      const n = Number(customGoal);
                      if (n > 0) setGoal(n);
                      setCustomGoal("");
                    }}
                    className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
                  >
                    OK
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  if (window.confirm("Remettre ce compteur à zéro ?")) {
                    setCounters((c) => ({ ...c, [dhikrId]: { ...(c[dhikrId] ?? { count: 0 }), count: 0 } }));
                    setSessionTaps(0);
                  }
                }}
                className="h-11 w-full rounded-xl border border-border text-sm font-medium text-muted-foreground"
              >
                Remettre à zéro
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
