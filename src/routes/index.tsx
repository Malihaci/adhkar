import { createFileRoute, Link } from "@tanstack/react-router";
import { Sunrise, Moon, ArrowRight, Headphones, BookOpen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import { useDailyProgress } from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Accueil — Adhkâr du Matin et du Soir" },
      {
        name: "description",
        content:
          "Adhkâr du matin, du soir et écoute de la récitation authentique d'Al-‘Afâsy.",
      },
      { property: "og:title", content: "Adhkâr — Accueil" },
      {
        property: "og:description",
        content: "Adhkâr du matin, du soir et récitation Al-‘Afâsy.",
      },
    ],
  }),
  component: Index,
});


function computeProgress(list: { id: string; repetitions: number }[], counts: Record<string, number>) {
  const total = list.reduce((n, d) => n + d.repetitions, 0);
  const done = list.reduce(
    (n, d) => n + Math.min(counts[d.id] ?? 0, d.repetitions),
    0,
  );
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

function Index() {
  const { progress } = useDailyProgress();
  const morning = computeProgress(morningAdhkar, progress.counts);
  const evening = computeProgress(eveningAdhkar, progress.counts);

  return (
    <AppShell
      title="As-salâmu 'alaykum"
      subtitle="Que votre journée soit remplie de dhikr."
    >
      <div className="space-y-5">
        {/* Cards Matin / Soir */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SessionCard
            to="/matin"
            label="Adhkâr du matin"
            hint={`${morning.done}/${morning.total} · ${morning.pct}%`}
            pct={morning.pct}
            icon={<Sunrise className="size-5" />}
            tone="gold"
          />
          <SessionCard
            to="/soir"
            label="Adhkâr du soir"
            hint={`${evening.done}/${evening.total} · ${evening.pct}%`}
            pct={evening.pct}
            icon={<Moon className="size-5" />}
            tone="emerald"
          />
        </div>
        {/* Écoute Al-Afâsy */}
        <Link
          to="/ecoute"
          className="surface-card group relative flex items-center gap-4 overflow-hidden px-5 py-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
            <Headphones className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Récitation Al-‘Afâsy
            </p>
            <p className="truncate font-medium">
              Écoutez et suivez le texte synchronisé
            </p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
        {/* Lire le Coran */}
        <Link
          to="/quran/page/$page"
          params={{ page: "1" }}
          className="surface-card group relative flex items-center gap-4 overflow-hidden px-5 py-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
            <BookOpen className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Lire le Coran — Mushaf de Médine
            </p>
            <p className="truncate font-medium">
              604 pages · sélection et écoute des versets
            </p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
        {/* Tadabbur */}
        <Link
          to="/tadabbur"

          className="surface-card group relative flex items-center gap-4 overflow-hidden px-5 py-4 transition hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[var(--shadow-elevated)]"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
            <BookOpen className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Tadabbur — Al-Baqara (Juz' 1)
            </p>
            <p className="truncate font-medium">
              Méditation, action et mots récurrents
            </p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-gold" />
        </Link>
      </div>
    </AppShell>
  );
}

function SessionCard({
  to,
  label,
  hint,
  pct,
  icon,
  tone,
}: {
  to: "/matin" | "/soir";
  label: string;
  hint: string;
  pct: number;
  icon: React.ReactNode;
  tone: "gold" | "emerald";
}) {
  return (
    <Link
      to={to}
      className="surface-card group relative flex flex-col gap-4 overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]"
    >
      <div className="flex items-center justify-between">
        <span
          className={
            tone === "gold"
              ? "grid size-11 place-items-center rounded-full bg-gold/15 text-gold"
              : "grid size-11 place-items-center rounded-full bg-primary/12 text-primary"
          }
        >
          {icon}
        </span>
        <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
      </div>
      <div>
        <p className="font-display text-lg font-semibold">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className={
            tone === "gold"
              ? "h-full rounded-full bg-gold transition-all duration-500"
              : "h-full rounded-full bg-primary transition-all duration-500"
          }
          style={{ width: `${pct}%` }}
        />
      </div>
    </Link>
  );
}
