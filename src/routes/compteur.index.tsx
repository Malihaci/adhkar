import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Hash, Swords } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  FREE_COUNTER_ID,
  counterDhikrList,
  dhikrShortTitle,
  todayKey,
  useDhikrLog,
  useLocalChallenges,
  usePersonalCounters,
} from "@/lib/dhikrCounter";

export const Route = createFileRoute("/compteur/")({
  head: () => ({ meta: [{ title: "Compteur de dhikr" }] }),
  component: CounterHub,
});

function CounterHub() {
  const [counters] = usePersonalCounters();
  const [log] = useDhikrLog();
  const [challenges] = useLocalChallenges();
  const today = log[todayKey()] ?? {};
  const todayEntries = Object.entries(today).filter(([, n]) => n > 0);
  const weekStart = Date.now() - 7 * 86400_000;
  const finished = challenges.filter((c) => c.reached && new Date(c.endsAt).getTime() >= weekStart).length;

  return (
    <AppShell title="Compteur de dhikr" subtitle="Choisissez un dhikr" hideSettings>
      <div className="space-y-5">
        <div className="space-y-3">
          {counterDhikrList().map((d) => (
            <Link
              key={d.id}
              to="/compteur/$dhikrId"
              params={{ dhikrId: d.id }}
              className="surface-card flex min-h-20 items-center gap-3 rounded-2xl px-4 py-4 transition hover:-translate-y-0.5"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">{dhikrShortTitle(d.id)}</p>
                <p lang="ar" dir="rtl" className="truncate font-arabic text-lg text-muted-foreground">
                  {d.arabic}
                </p>
              </div>
              <span className="text-xl font-bold tabular-nums text-primary">
                {counters[d.id]?.count ?? 0}
              </span>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
            </Link>
          ))}
          <Link
            to="/compteur/$dhikrId"
            params={{ dhikrId: FREE_COUNTER_ID }}
            className="surface-card flex min-h-16 items-center gap-3 rounded-2xl px-4 py-3 transition hover:-translate-y-0.5"
          >
            <Hash className="size-5 text-muted-foreground" />
            <p className="min-w-0 flex-1 font-medium text-foreground">Compteur libre</p>
            <span className="text-xl font-bold tabular-nums text-primary">
              {counters[FREE_COUNTER_ID]?.count ?? 0}
            </span>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
          </Link>
        </div>

        <Link
          to="/defis"
          className="surface-card flex min-h-16 items-center gap-3 rounded-2xl px-4 py-3 transition hover:-translate-y-0.5"
        >
          <span className="grid size-10 place-items-center rounded-full bg-primary/12 text-primary">
            <Swords className="size-5" />
          </span>
          <p className="min-w-0 flex-1 font-medium text-foreground">Mes défis</p>
          <ChevronRight className="size-5 text-muted-foreground" />
        </Link>

        <div className="surface-card space-y-2 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Aujourd'hui</p>
          {todayEntries.length ? (
            todayEntries.map(([id, n]) => (
              <p key={id} className="flex justify-between text-sm">
                <span className="text-foreground">{dhikrShortTitle(id)}</span>
                <span className="font-semibold tabular-nums text-foreground">{n}</span>
              </p>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Rien de compté pour l'instant.</p>
          )}
          <p className="border-t border-border pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Cette semaine
          </p>
          <p className="text-sm text-foreground">Défis terminés : {finished}</p>
        </div>
      </div>
    </AppShell>
  );
}
