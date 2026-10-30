import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
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

  const hh = next.time.getHours().toString().padStart(2, "0");
  const mm = next.time.getMinutes().toString().padStart(2, "0");

  return (
    <Link
      to="/horaires"
      className="surface-card flex flex-col items-center rounded-2xl px-4 py-2.5 text-center transition hover:-translate-y-0.5"
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Prochaine prière
      </span>
      <span className="font-display text-[1.7rem] font-bold leading-tight text-foreground">
        {PRAYER_LABELS[next.key]}
      </span>
      <span className="font-display text-lg font-semibold tabular-nums text-primary">
        {hh}:{mm}
        <span className="ml-2 font-sans text-xs font-normal text-muted-foreground">
          dans {formatCountdown(next.time.getTime() - now.getTime())}
        </span>
      </span>
    </Link>
  );
}
