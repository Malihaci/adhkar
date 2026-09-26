import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, X } from "lucide-react";
import { useLocalState } from "@/lib/storage";
import { morningAdhkar, eveningAdhkar } from "@/data/adhkar";
import { effectiveSchedule, type WirdState } from "@/lib/khatma";
import { fetchTodayTimings, getAsrDateFromTimings, getPrayerSettings } from "@/lib/prayerTimes";

/**
 * Actions contextuelles de l'accueil — jamais des cartes permanentes.
 * 0, 1, 2 ou 3 lignes compactes selon ce qui est réellement inachevé et
 * pertinent maintenant ; rien n'est réservé quand une ligne disparaît.
 *
 * Adhkār du soir : déclenché sur la vraie heure d'ʿAsr (Al Adhan API, voir
 * src/lib/prayerTimes.ts) dès qu'elle est disponible. Si l'API est
 * injoignable ou qu'aucune localisation n'est configurée, on retombe sur
 * l'ancienne approximation horaire (16h) plutôt que de ne jamais afficher
 * la suggestion — dégradation explicite, jamais un horaire de prière
 * inventé et présenté comme réel (cette valeur n'est utilisée qu'en repli
 * silencieux, jamais affichée comme un horaire de prière).
 */
const ASR_FALLBACK_HOUR = 16;

interface Item {
  key: string;
  label: string;
  sub?: string;
  to: "/matin" | "/soir" | "/quran/page/$page";
  params?: { page: string };
}

export function HomeSuggestion({ counts }: { counts: Record<string, number> }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [wird] = useLocalState<WirdState | null>("adhkar:wird", null);
  const { data: timings } = useQuery({
    queryKey: ["prayer-timings", getPrayerSettings()],
    queryFn: () => fetchTodayTimings(getPrayerSettings()),
    staleTime: 30 * 60_000,
  });

  const items = computeItems(wird, counts, timings ?? null).filter((i) => !dismissed.has(i.key));
  if (!items.length) return null;

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.key}
          className="surface-card flex items-center gap-3 rounded-2xl border-primary/20 bg-primary/5 px-4 py-3"
        >
          <Link
            to={item.to}
            params={item.params}
            className="flex min-w-0 flex-1 items-center gap-2"
          >
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
              {item.label}
              {item.sub && (
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  {item.sub}
                </span>
              )}
            </span>
            <ChevronRight className="size-4 shrink-0 text-primary" />
          </Link>
          <button
            onClick={() => setDismissed((prev) => new Set(prev).add(item.key))}
            aria-label="Ignorer la suggestion"
            className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function computeItems(
  wird: WirdState | null,
  counts: Record<string, number>,
  timings: import("@/lib/prayerTimes").PrayerTimings | null,
): Item[] {
  const items: Item[] = [];
  const now = new Date();
  const hour = now.getHours();

  const morningProgress = adhkarProgress(morningAdhkar, counts);
  if (hour < 13 && !morningProgress.done) {
    items.push({
      key: "morning",
      label: "Continuer mes Adhkār du matin",
      sub: morningProgress.total ? `${morningProgress.completed}/${morningProgress.total}` : undefined,
      to: "/matin",
    });
  }

  const asrDate = getAsrDateFromTimings(timings);
  const pastAsr = asrDate ? now.getTime() >= asrDate.getTime() : hour >= ASR_FALLBACK_HOUR;
  const eveningProgress = adhkarProgress(eveningAdhkar, counts);
  if (pastAsr && !eveningProgress.done) {
    items.push({
      key: "evening",
      label: "Continuer mes Adhkār du soir",
      sub: eveningProgress.total ? `${eveningProgress.completed}/${eveningProgress.total}` : undefined,
      to: "/soir",
    });
  }

  if (wird) {
    const schedule = effectiveSchedule(wird);
    const total = schedule.length;
    if (wird.lastCompletedDay < total) {
      const day = schedule.find((d) => d.day === wird.lastCompletedDay + 1);
      if (day) {
        items.push({
          key: "wird",
          label: "Continuer mon Wird",
          sub: `Pages ${day.startPage} → ${day.endPage}`,
          to: "/quran/page/$page",
          params: { page: String(day.startPage) },
        });
      }
    }
  }

  return items;
}

function adhkarProgress(
  list: { id: string; repetitions: number }[],
  counts: Record<string, number>,
): { done: boolean; completed: number; total: number } {
  const total = list.reduce((n, d) => n + d.repetitions, 0);
  const completed = list.reduce((n, d) => n + Math.min(counts[d.id] ?? 0, d.repetitions), 0);
  return { done: total > 0 && completed >= total, completed, total };
}
