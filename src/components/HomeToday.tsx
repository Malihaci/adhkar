import { BookOpen, Moon, Sparkles, Sunrise } from "lucide-react";
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import { coucherAdhkar } from "@/data/adhkar-occasions";
import { useLocalState } from "@/lib/storage";
import { daysElapsedSince, effectiveSchedule, type WirdState } from "@/lib/khatma";
import { adhkarStatus } from "@/lib/todayState";
import type { AdhkarMoment } from "@/lib/dayPeriod";
import { ACTION_COLORS, ActionCard } from "@/components/ActionCard";

const DHIKR_META = {
  morning: { label: "Adhkār du matin", sub: "À faire avant Dhuhr", to: "/matin", Icon: Sunrise },
  evening: { label: "Adhkār du soir", sub: "À faire avant ʿIshāʾ", to: "/soir", Icon: Moon },
  sleep: { label: "Adhkār avant de dormir", sub: "Avant le coucher", to: "/coucher", Icon: Sparkles },
} as const;

/**
 * Cartes « à faire » de l'accueil : dhikr du moment (tant qu'il n'est pas
 * terminé) et Lecture du jour (celle du jour, plus celle d'hier si non lue).
 * Mêmes règles que les notifications (src/lib/todayState.ts) ; rien n'est
 * rendu quand tout est fait — l'accueil affiche alors son état calme.
 */
export function HomeToday({
  counts,
  moment,
}: {
  counts: Record<string, number>;
  moment: AdhkarMoment;
}) {
  const [wird] = useLocalState<WirdState | null>("adhkar:wird", null);

  const dhikrList =
    moment === "morning" ? morningAdhkar : moment === "evening" ? eveningAdhkar : moment === "sleep" ? coucherAdhkar : null;
  const status = dhikrList ? adhkarStatus(dhikrList, counts) : null;
  const meta = moment ? DHIKR_META[moment] : null;

  let overdue: { day: number; startPage: number; endPage: number; yesterday: boolean } | null = null;
  let today: { day: number; startPage: number; endPage: number } | null = null;
  if (wird) {
    const schedule = effectiveSchedule(wird);
    const next = wird.lastCompletedDay + 1;
    const elapsed = daysElapsedSince(wird.startDateISO);
    // Date de départ illisible : on suit simplement le prochain jour non lu.
    const expected = Number.isFinite(elapsed) ? Math.min(elapsed + 1, schedule.length) : next;
    if (next <= schedule.length) {
      const late = next < expected ? schedule.find((d) => d.day === next) : undefined;
      if (late) overdue = { ...late, yesterday: next === expected - 1 };
      const cur = schedule.find((d) => d.day === expected);
      if (cur && wird.lastCompletedDay < expected) today = cur;
    }
  }

  return (
    <>
      {status && !status.done && meta && moment && (
        <ActionCard
          to={meta.to}
          search={moment === "morning" || moment === "evening" ? { i: status.firstUndoneIndex ?? 0 } : undefined}
          color={ACTION_COLORS.adhkar}
          icon={<meta.Icon />}
          title={meta.label}
          sub={status.completed > 0 ? `${status.pct} % terminé · ${meta.sub.toLowerCase()}` : meta.sub}
          cta={status.completed > 0 ? "Continuer" : "Commencer"}
          pct={status.pct}
        />
      )}
      {today && (
        <ActionCard
          to="/quran/page/$page"
          params={{ page: String(today.startPage) }}
          search={{ end: today.endPage, shared: "wird" }}
          color={ACTION_COLORS.lecture}
          icon={<BookOpen />}
          title="Lecture du jour"
          sub={`Pages ${today.startPage} → ${today.endPage}`}
          cta="Lire"
        />
      )}
      {overdue && (
        <ActionCard
          to="/quran/page/$page"
          params={{ page: String(overdue.startPage) }}
          search={{ end: overdue.endPage, shared: "wird" }}
          color={ACTION_COLORS.doux}
          icon={<BookOpen />}
          title={overdue.yesterday ? "Lecture d'hier · non lue" : `Lecture restée en attente · jour ${overdue.day}`}
          sub={`Pages ${overdue.startPage} → ${overdue.endPage}`}
          cta="Lire"
        />
      )}
    </>
  );
}
