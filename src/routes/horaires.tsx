import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, Check, Clock, MapPin, Navigation, Settings2, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  CALC_METHODS,
  PRAYER_KEYS,
  PRAYER_LABELS,
  describeTimeSource,
  formatCountdown,
  getMosqueCalendar,
  getMosqueCalendarStatus,
  getNextPrayer,
  makeMosqueId,
  parseMosqueCalendarInput,
  setMosqueCalendar,
  usePrayerTimings,
  type MosqueCalendar,
  type PrayerSettings,
} from "@/lib/prayerTimes";
import { MOSQUE_PRESETS } from "@/data/mosque-calendars-preset";
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
  const { settings, setSettings, timings, isPending, isError, mosqueActive } = usePrayerTimings();
  const [now, setNow] = useState(() => new Date());
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [mosqueDraft, setMosqueDraft] = useState({
    name: settings.mosqueName ?? "",
    city: settings.mosqueCity ?? "",
  });
  const [calendar, setCalendarState] = useState<MosqueCalendar | null>(() => getMosqueCalendar());
  const [calendarInput, setCalendarInput] = useState("");
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [calendarImported, setCalendarImported] = useState<number | null>(null);
  const queryClient = useQueryClient();

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
    const name = mosqueDraft.name.trim();
    const city = mosqueDraft.city.trim();
    updateSettings({
      source: "mosque",
      mosqueName: name || undefined,
      mosqueCity: city || undefined,
      // Nouvel identifiant dès que nom/ville change — un calendrier déjà
      // importé pour une AUTRE mosquée ne doit jamais être réutilisé par
      // erreur (§10 chantier "horaires réels des mosquées").
      mosqueId: name ? makeMosqueId(name, city) : undefined,
    });
  };

  /**
   * Import manuel d'un calendrier réellement publié par la mosquée (§2/§6
   * du chantier "horaires réels des mosquées") — JAMAIS récupéré
   * automatiquement : aucune source publique/autorisée exploitable n'a été
   * trouvée (voir l'analyse préalable, cas Grande Mosquée de Paris : image
   * mensuelle non structurée ; MAWAQIT privé, non autorisé pour un tiers).
   * L'utilisateur colle ici le calendrier qu'il a obtenu directement de sa
   * mosquée.
   */
  const importCalendar = () => {
    if (!settings.mosqueId || !settings.mosqueName) {
      setCalendarError("Enregistrez d'abord le nom de votre mosquée ci-dessus.");
      return;
    }
    const result = parseMosqueCalendarInput(calendarInput, settings.mosqueId, settings.mosqueName);
    if ("error" in result) {
      setCalendarError(result.error);
      setCalendarImported(null);
      return;
    }
    setMosqueCalendar(result.calendar);
    setCalendarState(result.calendar);
    setCalendarError(null);
    setCalendarImported(result.daysCount);
    setCalendarInput("");
    // Le calendrier vit dans une clé séparée de `settings` (adhkar:mosque-
    // calendar) : la query ["prayer-timings", settings] ne le "voit" pas
    // tout seule (même clé de requête, mêmes valeurs) — on force le
    // recalcul explicitement, sinon les anciens horaires resteraient
    // affichés jusqu'au prochain changement de réglage ou reload.
    void queryClient.invalidateQueries({ queryKey: ["prayer-timings"] });
  };

  /**
   * Mosquées pré-remplies (sur demande explicite) — capturées une fois
   * depuis la page publique mawaqit.net de chacune (jamais un appel
   * automatisé à l'API MAWAQIT, voir la provenance détaillée dans
   * src/data/mosque-calendars-preset.ts). Un clic enregistre l'identité ET
   * applique directement le calendrier annuel, sans coller de JSON.
   */
  const selectPreset = (preset: (typeof MOSQUE_PRESETS)[number]) => {
    setMosqueDraft({ name: preset.name, city: preset.city });
    setSettings({
      ...settings,
      source: "mosque",
      mosqueName: preset.name,
      mosqueCity: preset.city,
      mosqueId: preset.calendar.mosqueId,
    });
    setMosqueCalendar(preset.calendar);
    setCalendarState(preset.calendar);
    setCalendarError(null);
    setCalendarImported(Object.keys(preset.calendar.days).length);
    void queryClient.invalidateQueries({ queryKey: ["prayer-timings"] });
  };

  const removeCalendar = () => {
    setMosqueCalendar(null);
    setCalendarState(null);
    setCalendarImported(null);
    void queryClient.invalidateQueries({ queryKey: ["prayer-timings"] });
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
  // Jamais de renouvellement automatique (voir le refus explicite de
  // scraper MAWAQIT à grande échelle/sans supervision) — juste un rappel
  // honnête avant que le calendrier importé ne couvre plus le jour.
  const calendarStatus = getMosqueCalendarStatus(calendar, settings.mosqueId);

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
          <p className="text-[11px] text-muted-foreground">
            {describeTimeSource(settings, mosqueActive)}
          </p>
        </div>

        {mosqueSelected && mosqueActive && (
          <p className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-center text-xs leading-relaxed text-foreground">
            Horaires réellement publiés par {settings.mosqueName}, importés manuellement le{" "}
            {calendar?.importedAt ? new Date(calendar.importedAt).toLocaleDateString("fr-FR") : ""} —
            jamais recalculés tant que ce calendrier couvre le jour.
          </p>
        )}
        {mosqueSelected && !mosqueActive && (
          <p className="rounded-2xl border border-gold/30 bg-gold/5 px-4 py-3 text-center text-xs leading-relaxed text-foreground">
            Aucune source autorisée ne permet de récupérer automatiquement les horaires publiés par
            cette mosquée (API MAWAQIT privée, non ouverte aux applications tierces ; la plupart des
            sites de mosquées ne publient qu'une image, pas de données exploitables). Importez un
            calendrier ci-dessous si vous en avez un, sinon les horaires affichés sont le calcul
            automatique.
          </p>
        )}

        {calendarStatus && calendarStatus.daysRemaining <= 30 && (
          <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-xs leading-relaxed text-foreground">
            {calendarStatus.daysRemaining <= 0
              ? `Le calendrier de ${settings.mosqueName} s'est terminé le ${new Date(calendarStatus.lastDate + "T00:00:00").toLocaleDateString("fr-FR")} — demandez un nouveau calendrier à votre mosquée, sinon l'app repasse au calcul automatique.`
              : `Le calendrier de ${settings.mosqueName} se termine le ${new Date(calendarStatus.lastDate + "T00:00:00").toLocaleDateString("fr-FR")} (dans ${calendarStatus.daysRemaining} j) — pensez à en importer un nouveau pour l'année suivante.`}
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
                  Aucune recherche automatique de mosquées n'est disponible. Identifiez votre
                  mosquée ici, puis importez son calendrier ci-dessous si vous en avez un —
                  ses horaires ne peuvent pas être récupérés automatiquement (voir la note
                  ci-dessus).
                </p>

                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Mosquées pré-remplies
                </p>
                <div className="space-y-1.5">
                  {MOSQUE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => selectPreset(preset)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition",
                        settings.mosqueId === preset.id
                          ? "border-primary/50 bg-primary/5"
                          : "border-border",
                      )}
                    >
                      <span>
                        <span className="block font-semibold text-foreground">{preset.name}</span>
                        <span className="text-muted-foreground">{preset.city} · calendrier 2026</span>
                      </span>
                      {settings.mosqueId === preset.id && (
                        <Check className="size-4 shrink-0 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Calendrier capturé une fois depuis la page publique de chaque mosquée — jamais
                  resynchronisé automatiquement, à remplacer l'année prochaine.
                </p>

                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Ou une autre mosquée
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

                {calendar && calendar.mosqueId === settings.mosqueId ? (
                  <div className="space-y-2 rounded-xl border border-primary/30 bg-primary/5 p-3">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <Check className="size-3.5 text-primary" /> Calendrier importé le{" "}
                      {new Date(calendar.importedAt).toLocaleDateString("fr-FR")} (
                      {Object.keys(calendar.days).length} jours)
                    </p>
                    <button
                      onClick={removeCalendar}
                      className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-destructive/40 text-xs font-semibold text-destructive"
                    >
                      <Trash2 className="size-3.5" /> Supprimer le calendrier
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 border-t border-border pt-2">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Vous avez obtenu directement de votre mosquée un calendrier (horaires
                      réellement publiés) ? Collez-le ici — jamais récupéré automatiquement.
                      Format attendu, un tableau JSON :{" "}
                      <code className="rounded bg-muted px-1 py-0.5 text-[10px]">
                        [{"{"}"date":"2026-10-01","fajr":"06:17","sunrise":"07:50","dhuhr":"13:45","asr":"16:49","maghrib":"19:33","isha":"21:00"{"}"}
                        , …]
                      </code>
                    </p>
                    <textarea
                      value={calendarInput}
                      onChange={(e) => setCalendarInput(e.target.value)}
                      placeholder='[{"date":"2026-10-01","fajr":"06:17",...}]'
                      rows={4}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-xs"
                    />
                    {calendarError && <p className="text-xs text-destructive">{calendarError}</p>}
                    {calendarImported !== null && !calendarError && (
                      <p className="text-xs text-primary">
                        {calendarImported} jour(s) importé(s) avec succès.
                      </p>
                    )}
                    <button
                      onClick={importCalendar}
                      disabled={!calendarInput.trim()}
                      className="h-10 w-full rounded-xl border border-primary/40 text-sm font-semibold text-primary disabled:opacity-40"
                    >
                      Importer ce calendrier
                    </button>
                  </div>
                )}
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
            <Link
              to="/parametres"
              search={{ section: "horaires" }}
              className="block text-center text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              Tous les paramètres
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}
