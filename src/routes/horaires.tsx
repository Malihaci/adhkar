import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin, Navigation, Settings2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  CALC_METHODS,
  PRAYER_KEYS,
  PRAYER_LABELS,
  fetchTodayTimings,
  getNextPrayer,
  getPrayerSettings,
  setPrayerSettings,
  type PrayerSettings,
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

function formatCountdown(ms: number): string {
  const totalMin = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${m} min`;
}

function HorairesPage() {
  const [settings, setSettingsState] = useState<PrayerSettings>(getPrayerSettings());
  const [now, setNow] = useState(() => new Date());
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const {
    data: timings,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["prayer-timings", settings],
    queryFn: () => fetchTodayTimings(settings),
    staleTime: 30 * 60_000,
  });

  const updateSettings = (patch: Partial<PrayerSettings>) => {
    const next = { ...settings, ...patch };
    setSettingsState(next);
    setPrayerSettings(next);
  };

  const useMyLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Localisation non disponible sur cet appareil.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateSettings({
          mode: "auto",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => setGeoError("Localisation refusée — utilisez une ville manuellement."),
      { timeout: 10_000 },
    );
  };

  const next = timings ? getNextPrayer(timings, now) : null;
  const locationLabel =
    settings.mode === "auto" && settings.latitude != null
      ? "Ma position"
      : (settings.city ?? "Ville non définie");

  return (
    <AppShell title="Horaires de prière" subtitle="مواقيت الصلاة">
      <div className="space-y-4">
        <div className="surface-card space-y-1 p-5 text-center">
          <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" /> {locationLabel}
          </p>
          <p className="text-xs text-muted-foreground">Aujourd'hui</p>
        </div>

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

            {next && (
              <div className="surface-card flex items-center justify-center gap-2 p-4 text-center">
                <Clock className="size-4 text-primary" />
                <p className="text-sm text-foreground">
                  {PRAYER_LABELS[next.key]} dans{" "}
                  <span className="font-semibold text-primary">
                    {formatCountdown(next.time.getTime() - now.getTime())}
                  </span>
                </p>
              </div>
            )}
          </>
        )}

        <button
          onClick={() => setOptionsOpen((v) => !v)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-3 text-sm font-medium text-foreground"
        >
          <Settings2 className="size-4" /> Localisation et méthode de calcul
        </button>

        {optionsOpen && (
          <div className="surface-card space-y-4 p-5">
            <div className="flex gap-1 rounded-full border border-border p-1">
              <button
                onClick={() => updateSettings({ mode: "manual" })}
                className={cn(
                  "flex-1 rounded-full py-2 text-xs font-semibold transition",
                  settings.mode === "manual" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                Ville manuelle
              </button>
              <button
                onClick={useMyLocation}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1 rounded-full py-2 text-xs font-semibold transition",
                  settings.mode === "auto" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                <Navigation className="size-3.5" /> Ma position
              </button>
            </div>
            {geoError && <p className="text-xs text-destructive">{geoError}</p>}

            {settings.mode === "manual" && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={settings.city ?? ""}
                  onChange={(e) => updateSettings({ city: e.target.value })}
                  placeholder="Ville"
                  className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
                />
                <input
                  value={settings.country ?? ""}
                  onChange={(e) => updateSettings({ country: e.target.value })}
                  placeholder="Pays"
                  className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
                />
              </div>
            )}

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Méthode de calcul
              </p>
              <select
                value={settings.methodId}
                onChange={(e) => updateSettings({ methodId: Number(e.target.value) })}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
              >
                {CALC_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                École ʿAsr
              </p>
              <div className="flex gap-1 rounded-full border border-border p-1">
                <button
                  onClick={() => updateSettings({ school: 0 })}
                  className={cn(
                    "flex-1 rounded-full py-2 text-xs font-semibold transition",
                    settings.school === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  Shafi'i / Maliki / Hanbali
                </button>
                <button
                  onClick={() => updateSettings({ school: 1 })}
                  className={cn(
                    "flex-1 rounded-full py-2 text-xs font-semibold transition",
                    settings.school === 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  Hanafi
                </button>
              </div>
            </div>

            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              Horaires fournis par Al Adhan API (Islamic Network) — méthode affichée ici, jamais
              calculée par l'application.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
