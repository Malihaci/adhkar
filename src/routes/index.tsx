import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AdhkarSheet } from "@/components/AdhkarSheet";
import { CoranSheet } from "@/components/CoranSheet";
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import { useDailyProgress, useLocalState } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { HomeSuggestion } from "@/components/HomeSuggestion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Accueil — Adhkâr du Matin et du Soir" },
      {
        name: "description",
        content: "Adhkâr du matin, du soir, lecture du Coran et Tadabbur.",
      },
      { property: "og:title", content: "Adhkâr — Accueil" },
      {
        property: "og:description",
        content: "Adhkâr, Coran, Tadabbur et Favoris.",
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
  const [adhkarChooserOpen, setAdhkarChooserOpen] = useState(false);
  const [coranChooserOpen, setCoranChooserOpen] = useState(false);

  return (
    <AppShell title="Accueil" homeHeader>
      <div className="space-y-5">
        <HomeSuggestion lastPage={lastPage} counts={progress.counts} />

        {/* 2 portes principales (§3) — Tadabbur et Favoris restent accessibles
            depuis leurs points d'entrée naturels (sheet Coran / bottom nav Plus). */}
        <div className="grid grid-cols-2 gap-4">
          <GateButton
            onClick={() => setAdhkarChooserOpen(true)}
            label="Adhkar"
            arabic="ذِكْر"
            tone="primary"
            icon={<Sparkles className="size-6" />}
          />
          <GateButton
            onClick={() => setCoranChooserOpen(true)}
            label="Coran"
            arabic="قُرْآن"
            tone="gold"
            icon={<BookOpen className="size-6" />}
          />
        </div>

        {/* Mes outils — discrets, secondaires par rapport aux 2 portes */}
        <div>
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Mes outils
          </p>
          <div className="grid grid-cols-2 gap-3">
            <ToolLink to="/rappels" label="Mes rappels" iconLabel="🔔" />
            <ToolLink to="/wird" label="Mon Wird" iconLabel="📖" />
          </div>
        </div>
      </div>

      {adhkarChooserOpen && (
        <AdhkarSheet
          morningPct={morning.pct}
          eveningPct={evening.pct}
          onClose={() => setAdhkarChooserOpen(false)}
        />
      )}
      {coranChooserOpen && (
        <CoranSheet lastPage={lastPage} onClose={() => setCoranChooserOpen(false)} />
      )}
    </AppShell>
  );
}

function ToolLink({
  to,
  label,
  iconLabel,
}: {
  to: "/rappels" | "/wird";
  label: string;
  iconLabel: string;
}) {
  return (
    <Link
      to={to}
      className="surface-card flex items-center gap-2.5 rounded-2xl px-4 py-3 text-left transition hover:-translate-y-0.5"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-base">
        {iconLabel}
      </span>
      <span className="min-w-0 truncate text-sm font-medium text-foreground">{label}</span>
    </Link>
  );
}

/** Style commun aux portes — même dimension, même famille visuelle. */
const GATE_CLASS =
  "surface-card group flex aspect-square flex-col items-center justify-center gap-2.5 rounded-3xl p-4 text-center transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)] active:scale-[0.98]";

function GateIcon({ tone, children }: { tone: "primary" | "gold"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "grid size-14 place-items-center rounded-2xl transition group-hover:scale-105",
        tone === "gold" ? "bg-gold/15 text-gold" : "bg-primary/12 text-primary",
      )}
    >
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
  tone,
}: {
  onClick: () => void;
  label: string;
  arabic: string;
  icon: ReactNode;
  tone: "primary" | "gold";
}) {
  return (
    <button onClick={onClick} className={GATE_CLASS}>
      <GateIcon tone={tone}>{icon}</GateIcon>
      <GateLabel label={label} arabic={arabic} />
    </button>
  );
}
