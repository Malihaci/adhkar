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
      className="surface-card flex flex-col items-center gap-0.5 rounded-2xl px-4 py-2 text-center transition hover:-translate-y-0.5"
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Prochaine prière · {PRAYER_LABELS[next.key]}
      </span>
      <span className="font-display text-xl font-bold tabular-nums text-[#c62828] dark:text-[#ff8a80]">
        {hh}:{mm} · dans {formatCountdown(next.time.getTime() - now.getTime())}
      </span>
    </Link>
  );
}
