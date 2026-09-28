import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { formatCountdown, getNextPrayer, PRAYER_LABELS, usePrayerTimings } from "@/lib/prayerTimes";

/**
 * Zone "Prochaine prière" de l'accueil — réutilise EXACTEMENT la même
 * source que la page Horaires et le moteur de rappels (`usePrayerTimings`,
 * src/lib/prayerTimes.ts) : jamais un second calcul indépendant.
 */
export function NextPrayerWidget() {
  const { timings } = usePrayerTimings();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  if (!timings) return null;
  const next = getNextPrayer(timings, now);
  if (!next) return null;

  return (
    <Link
      to="/horaires"
      className="surface-card flex items-center justify-between gap-3 rounded-2xl px-4 py-3 transition hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          <Clock className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Prochaine prière
          </p>
          <p className="text-sm font-semibold text-foreground">{PRAYER_LABELS[next.key]}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-display text-base font-bold tabular-nums text-foreground">
          {next.time.getHours().toString().padStart(2, "0")}:
          {next.time.getMinutes().toString().padStart(2, "0")}
        </p>
        <p className="text-[11px] text-muted-foreground">
          dans {formatCountdown(next.time.getTime() - now.getTime())}
        </p>
      </div>
    </Link>
  );
}
