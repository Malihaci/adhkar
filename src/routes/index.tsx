import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  BookMarked,
  BookOpen,
  DoorOpen,
  Headphones,
  Heart,
  Luggage,
  Moon,
  Sparkles,
  Sunrise,
  X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import { useDailyProgress, useLocalState } from "@/lib/storage";
import { cn } from "@/lib/utils";

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

/**
 * Masqué temporairement (demande explicite) : le code et la route /ecoute
 * restent intacts, seul ce point d'entrée est retiré. Remettre à `true`
 * pour réafficher la carte sur l'accueil.
 */
const SHOW_ECOUTE_ENTRY = false;

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

  return (
    <AppShell title="As-salâmu 'alaykum" subtitle="Que votre journée soit remplie de dhikr.">
      <div className="space-y-5">
        {/* 4 portes principales, même taille, même famille visuelle */}
        <div className="grid grid-cols-2 gap-4">
          <GateButton
            onClick={() => setAdhkarChooserOpen(true)}
            label="Adhkar"
            arabic="ذِكْر"
            tone="primary"
            icon={<Sparkles className="size-6" />}
          />
          <GateLink
            to="/quran/page/$page"
            params={{ page: String(lastPage) }}
            label="Coran"
            arabic="قُرْآن"
            tone="gold"
            icon={<BookOpen className="size-6" />}
          />
          <GateLink
            to="/tadabbur"
            label="Tadabbur"
            arabic="تَدَبُّر"
            tone="gold"
            icon={<BookMarked className="size-6" />}
          />
          <GateLink
            to="/favoris"
            label="Favoris"
            arabic="مُفَضَّلة"
            tone="primary"
            icon={<Heart className="size-6" />}
          />
        </div>

        {/* Écoute Al-Afâsy — masquée pour l'instant, code conservé */}
        {SHOW_ECOUTE_ENTRY && (
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
              <p className="truncate font-medium">Écoutez et suivez le texte synchronisé</p>
            </div>
          </Link>
        )}
      </div>

      {adhkarChooserOpen && (
        <AdhkarChooser
          morningPct={morning.pct}
          eveningPct={evening.pct}
          onClose={() => setAdhkarChooserOpen(false)}
        />
      )}
    </AppShell>
  );
}

/** Style commun aux 4 portes — même dimension, même famille visuelle. */
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

function GateLink({
  to,
  params,
  label,
  arabic,
  icon,
  tone,
}: {
  to: "/quran/page/$page" | "/tadabbur" | "/favoris";
  params?: Record<string, string>;
  label: string;
  arabic: string;
  icon: ReactNode;
  tone: "primary" | "gold";
}) {
  return (
    <Link to={to} params={params} className={GATE_CLASS}>
      <GateIcon tone={tone}>{icon}</GateIcon>
      <GateLabel label={label} arabic={arabic} />
    </Link>
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

/** Choix léger Matin/Soir — routes et données de progression existantes. */
function AdhkarChooser({
  morningPct,
  eveningPct,
  onClose,
}: {
  morningPct: number;
  eveningPct: number;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl border-t border-border bg-card p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Quel Adhkâr souhaitez-vous lire ?</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to="/matin"
            className="surface-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-gold/40"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
              <Sunrise className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">Adhkâr du matin</p>
              <p className="text-xs text-muted-foreground">{morningPct}% complété aujourd'hui</p>
            </div>
          </Link>
          <Link
            to="/soir"
            className="surface-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
              <Moon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">Adhkâr du soir</p>
              <p className="text-xs text-muted-foreground">{eveningPct}% complété aujourd'hui</p>
            </div>
          </Link>
        </div>

        <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Autres occasions
        </p>
        <div className="space-y-1.5">
          <OccasionRow
            to="/coucher"
            icon={<Moon className="size-4" />}
            label="Avant de dormir"
            arabic="أذكار النوم"
          />
          <OccasionRow
            to="/sortie"
            icon={<DoorOpen className="size-4" />}
            label="Sortir de la maison"
            arabic="الخروج من المنزل"
          />
          <OccasionRow
            to="/voyage"
            icon={<Luggage className="size-4" />}
            label="Voyage"
            arabic="أذكار السفر"
          />
          <OccasionRow
            to="/khatma"
            icon={<BookOpen className="size-4" />}
            label="Fin de lecture du Coran"
            arabic="ختم القرآن"
          />
        </div>
      </div>
    </div>
  );
}

function OccasionRow({
  to,
  icon,
  label,
  arabic,
}: {
  to: "/coucher" | "/sortie" | "/voyage" | "/khatma";
  icon: ReactNode;
  label: string;
  arabic: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-muted"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{label}</span>
      <span lang="ar" dir="rtl" className="font-arabic text-xs text-muted-foreground">
        {arabic}
      </span>
    </Link>
  );
}
