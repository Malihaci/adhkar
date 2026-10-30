import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight } from "lucide-react";
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import { coucherAdhkar } from "@/data/adhkar-occasions";
import { useLocalState } from "@/lib/storage";
import { daysElapsedSince, effectiveSchedule, type WirdState } from "@/lib/khatma";
import type { AdhkarMoment } from "@/lib/dayPeriod";

/** Couleur de chaque carte « à faire » (même ton en clair et en sombre). */
const COLORS = {
  morning: "#0f9aa8",
  evening: "#d9722f",
  sleep: "#6a68d6",
  wird: "#1f9d6b",
  late: "#d4524c",
} as const;

const DHIKR_META = {
  morning: { label: "Adhkār du matin", sub: "À faire avant Dhuhr", to: "/matin" },
  evening: { label: "Adhkār du soir", sub: "À faire avant ʿIshāʾ", to: "/soir" },
  sleep: { label: "Adhkār avant de dormir", sub: "Avant le coucher", to: "/coucher" },
} as const;

function progressOf(list: { id: string; repetitions: number }[], counts: Record<string, number>) {
  const total = list.reduce((n, d) => n + d.repetitions, 0);
  const done = list.reduce((n, d) => n + Math.min(counts[d.id] ?? 0, d.repetitions), 0);
  return { done: total > 0 && done >= total, pct: total ? Math.round((done / total) * 100) : 0 };
}

function Ring({ pct }: { pct: number }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative grid size-10 shrink-0 place-items-center">
      <svg viewBox="0 0 40 40" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="20" cy="20" r={r} fill="none" strokeWidth="4" className="stroke-border" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          stroke="var(--c)"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <span className="text-[10px] font-bold tabular-nums" style={{ color: "var(--c)" }}>
        {pct}%
      </span>
    </span>
  );
}

function TodoCard({
  to,
  params,
  search,
  color,
  lead,
  title,
  sub,
  cta,
}: {
  to: string;
  params?: Record<string, string>;
  search?: Record<string, unknown>;
  color: string;
  lead: React.ReactNode;
  title: string;
  sub: string;
  cta: string;
}) {
  return (
    <Link
      to={to}
      params={params as never}
      search={search as never}
      style={{ "--c": color } as CSSProperties}
      className="flex min-h-[3.5rem] items-center gap-3 rounded-2xl border border-[color:var(--c)] bg-[color-mix(in_srgb,var(--c)_10%,transparent)] px-3.5 py-2 transition hover:-translate-y-0.5"
    >
      {lead}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">{sub}</span>
      </span>
      <span className="flex shrink-0 items-center gap-0.5 text-[13px] font-bold" style={{ color: "var(--c)" }}>
        {cta} <ChevronRight className="size-4" />
      </span>
    </Link>
  );
}

/**
 * Cartes « à faire » de l'accueil : dhikr du moment (matin / soir / avant de
 * dormir, tant qu'il n'est pas terminé) et lecture du Wird (celle du jour, plus
 * celle en retard — « d'hier » — si elle n'a pas été lue). Rien n'est rendu
 * quand il n'y a rien à faire.
 */
export function HomeToday({
  counts,
  moment,
}: {
  counts: Record<string, number>;
  moment: AdhkarMoment;
}) {
  const [wird, , wirdHydrated] = useLocalState<WirdState | null>("adhkar:wird", null);

  const dhikrList =
    moment === "morning" ? morningAdhkar : moment === "evening" ? eveningAdhkar : moment === "sleep" ? coucherAdhkar : null;
  const dhikr = dhikrList && moment ? { ...progressOf(dhikrList, counts), ...DHIKR_META[moment] } : null;

  let overdue: { day: number; startPage: number; endPage: number; yesterday: boolean } | null = null;
  let today: { day: number; startPage: number; endPage: number } | null = null;
  if (wird) {
    const schedule = effectiveSchedule(wird);
    const expected = Math.min(daysElapsedSince(wird.startDateISO) + 1, schedule.length);
    const next = wird.lastCompletedDay + 1;
    if (next <= schedule.length) {
      const late = next < expected ? schedule.find((d) => d.day === next) : undefined;
      if (late) overdue = { ...late, yesterday: next === expected - 1 };
      const cur = schedule.find((d) => d.day === expected);
      if (cur && wird.lastCompletedDay < expected) today = cur;
    }
  }

  return (
    <>
      {wirdHydrated && wird === null && (
        <TodoCard
          to="/wird"
          color={COLORS.wird}
          lead={
            <span className="grid size-10 shrink-0 place-items-center text-[var(--c)]">
              <BookOpen className="size-6" />
            </span>
          }
          title="Configurer mon Wird"
          sub="Pages par jour, page de départ"
          cta="Créer"
        />
      )}
      {dhikr && !dhikr.done && moment && (
        <TodoCard
          to={dhikr.to}
          color={COLORS[moment]}
          lead={<Ring pct={dhikr.pct} />}
          title={dhikr.label}
          sub={dhikr.sub}
          cta={dhikr.pct > 0 ? "Continuer" : "Commencer"}
        />
      )}
      {overdue && (
        <TodoCard
          to="/quran/page/$page"
          params={{ page: String(overdue.startPage) }}
          search={{ end: overdue.endPage, shared: "wird" }}
          color={COLORS.late}
          lead={
            <span className="grid size-10 shrink-0 place-items-center text-[var(--c)]">
              <BookOpen className="size-6" />
            </span>
          }
          title={overdue.yesterday ? "Wird d'hier · non lu" : `Wird en retard · jour ${overdue.day}`}
          sub={`Pages ${overdue.startPage} → ${overdue.endPage}`}
          cta="Lire"
        />
      )}
      {today && (
        <TodoCard
          to="/quran/page/$page"
          params={{ page: String(today.startPage) }}
          search={{ end: today.endPage, shared: "wird" }}
          color={COLORS.wird}
          lead={
            <span className="grid size-10 shrink-0 place-items-center text-[var(--c)]">
              <BookOpen className="size-6" />
            </span>
          }
          title="Lecture du jour · Wird"
          sub={`Pages ${today.startPage} → ${today.endPage}`}
          cta="Lire"
        />
      )}
    </>
  );
}
