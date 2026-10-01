import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  PRAYER_KEYS,
  PRAYER_LABELS,
  formatCountdown,
  getNextPrayer,
  usePrayerTimings,
} from "@/lib/prayerTimes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/horaires")({
  head: () => ({
    meta: [
      { title: "Horaires de prière" },
      { name: "description", content: "Fajr, Dhuhr, ʿAsr, Maghrib, ʿIshāʾ et la prochaine prière." },
    ],
  }),
  component: HorairesPage,
});

/**
 * Page épurée (chantier "Simplifier Horaires + Accueil") — ne garde que
 * l'essentiel : prochaine prière, compte à rebours, liste des 6 horaires,
 * et UNE ligne discrète de source. Tout le réglage (mosquée, localisation,
 * méthode, école ʿAsr, import/suppression de calendrier, messages
 * techniques) vit désormais dans ⚙️ Paramètres > Horaires — ⚙️ y ouvre
 * directement (settingsSearch), jamais un détour par un autre menu.
 */
function HorairesPage() {
  const { settings, timings, isPending, isError, mosqueActive } = usePrayerTimings();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Toutes les 15 s : le compte à rebours reste fluide et bascule sur la
    // prière suivante sans jamais rester bloqué (§ "jamais dans 0 min").
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const next = timings ? getNextPrayer(timings, now) : null;

  return (
    <AppShell
      title="Horaires de prière"
      subtitle="مواقيت الصلاة"
      settingsSearch={{ section: "horaires" }}
    >
      <div className="space-y-4">
        {isPending ? (
          <div className="surface-card p-8 text-center text-sm text-muted-foreground">
            Chargement des horaires…
          </div>
        ) : isError || !timings ? (
          <div className="surface-card p-6 text-center text-sm text-muted-foreground">
            Horaires momentanément indisponibles.
          </div>
        ) : (
          <>
            {next && (
              <div className="surface-card space-y-1 p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {PRAYER_LABELS[next.key]}
                </p>
                <p className="font-display text-3xl font-bold tabular-nums text-foreground">
                  {timings[next.key]}
                </p>
                <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-3.5" />
                  dans {formatCountdown(next.time.getTime() - now.getTime())}
                </p>
              </div>
            )}

            <div className="surface-card divide-y divide-border overflow-hidden">
              {PRAYER_KEYS.map((key) => (
                <div
                  key={key}
                  className={cn(
                    "flex items-center justify-between px-5 py-3.5",
                    next?.key === key && "bg-primary/5",
                  )}
                >
                  <span className="text-sm font-medium text-foreground">{PRAYER_LABELS[key]}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-display text-base font-semibold tabular-nums text-foreground">
                      {timings[key]}
                    </span>
                    {next?.key === key && (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        Prochaine
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Source : {settings.source === "mosque" && mosqueActive ? "ma mosquée" : "calcul automatique"}
        </p>
      </div>
    </AppShell>
  );
}
