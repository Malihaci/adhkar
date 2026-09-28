import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Clock, MapPin, Navigation, Settings2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  CALC_METHODS,
  PRAYER_KEYS,
  PRAYER_LABELS,
  describeTimeSource,
  formatCountdown,
  getNextPrayer,
  usePrayerTimings,
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

function HorairesPage() {
  const { settings, setSettings, timings, isPending, isError } = usePrayerTimings();
  const [now, setNow] = useState(() => new Date());
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [mosqueDraft, setMosqueDraft] = useState({
    name: settings.mosqueName ?? "",
    city: settings.mosqueCity ?? "",
  });

  useEffect(() => {
    // Toutes les 15 s : le compte à rebours reste fluide et bascule sur la
    // prière suivante sans jamais rester bloqué (§ "jamais dans 0 min").
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const updateSettings = (patch: Partial<PrayerSettings>) => {
    // Changement de source/mosquée/localisation : sauvegarde immédiate —
    // horaires, prochaine prière, accueil et rappels se rechargent tous
    // depuis cette même clé (une seule source centrale), jamais d'ancien
    // calendrier conservé.
    setSettings({ ...settings, ...patch });
  };

  const saveMosque = () => {
    updateSettings({
      source: "mosque",
      mosqueName: mosqueDraft.name.trim() || undefined,
      mosqueCity: mosqueDraft.city.trim() || undefined,
    });
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
  const mosqueSelected = settings.source === "mosque" && !!settings.mosqueName;

  return (
    <AppShell title="Horaires de prière" subtitle="مواقيت الصلاة">
      <div className="space-y-4">
        <div className="surface-card space-y-1 p-5 text-center">
          {mosqueSelected ? (
            <>
              <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-foreground">
                <Building2 className="size-4" /> {settings.mosqueName}
              </p>
              {settings.mosqueCity && (
                <p className="text-xs text-muted-foreground">{settings.mosqueCity}</p>
              )}
            </>
          ) : (
            <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" /> {locationLabel}
            </p>
          )}
          <p className="text-[11px] text-muted-foreground">{describeTimeSource(settings)}</p>
        </div>

        {mosqueSelected && (
          <p className="rounded-2xl border border-gold/30 bg-gold/5 px-4 py-3 text-center text-xs leading-relaxed text-foreground">
            Aucune source autorisée ne permet aujourd'hui de récupérer automatiquement les
            horaires publiés par cette mosquée (API MAWAQIT privée, non ouverte aux applications
            tierces). Les horaires ci-dessous sont donc le calcul automatique, affiché en attendant
            une intégration officielle par mosquée.
          </p>
        )}

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

        <button
          onClick={() => setOptionsOpen((v) => !v)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-3 text-sm font-medium text-foreground"
        >
          <Settings2 className="size-4" /> Source, localisation et méthode
        </button>

        {optionsOpen && (
          <div className="surface-card space-y-4 p-5">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Source des horaires
              </p>
              <div className="flex gap-1 rounded-full border border-border p-1">
                <button
                  onClick={() => updateSettings({ source: "mosque" })}
                  className={cn(
                    "flex-1 rounded-full py-2 text-xs font-semibold transition",
                    settings.source === "mosque"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  Ma mosquée
                </button>
                <button
                  onClick={() => updateSettings({ source: "auto" })}
                  className={cn(
                    "flex-1 rounded-full py-2 text-xs font-semibold transition",
                    settings.source === "auto"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  Calcul automatique
                </button>
              </div>
            </div>

            {settings.source === "mosque" && (
              <div className="space-y-2 rounded-2xl border border-border bg-muted/30 p-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Aucune recherche automatique de mosquées n'est disponible (aucune source
                  officielle ouverte). Vous pouvez identifier votre mosquée ici ; ses horaires
                  publiés ne peuvent pas encore être récupérés automatiquement — voir la note
                  ci-dessus.
                </p>
                <input
                  value={mosqueDraft.name}
                  onChange={(e) => setMosqueDraft((d) => ({ ...d, name: e.target.value }))}
                  placeholder="Nom de la mosquée"
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
                />
                <input
                  value={mosqueDraft.city}
                  onChange={(e) => setMosqueDraft((d) => ({ ...d, city: e.target.value }))}
                  placeholder="Ville"
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
                />
                <button
                  onClick={saveMosque}
                  disabled={!mosqueDraft.name.trim()}
                  className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-40"
                >
                  Enregistrer cette mosquée
                </button>
              </div>
            )}

            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Calcul automatique — localisation et méthode
            </p>
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
