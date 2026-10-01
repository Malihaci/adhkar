import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, Check, ChevronDown, Laptop, MapPin, Moon, Navigation, Sun, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useTheme, type ThemeMode } from "@/lib/storage";
import { usePreferences, type ReadingSize } from "@/lib/preferences";
import { useSmartReminderPrefs, type WirdReminderMode } from "@/lib/smartReminders";
import {
  CALC_METHODS,
  getMosqueCalendar,
  getMosqueCalendarStatus,
  makeMosqueId,
  parseMosqueCalendarInput,
  setMosqueCalendar,
  usePrayerTimings,
  type MosqueCalendar,
  type PrayerSettings,
} from "@/lib/prayerTimes";
import { MOSQUE_PRESETS } from "@/data/mosque-calendars-preset";
import { RECITERS } from "@/lib/mushaf";
import { cn } from "@/lib/utils";

/**
 * Centre unique de paramètres (chantier "Paramètres intelligents et
 * centralisés") — une seule architecture (`src/lib/preferences.ts`) pour
 * Coran, Adhkār, Audio, Général ; Horaires garde son propre panneau complet
 * (source mosquée/calcul, déjà construit) et n'est ici qu'un lien, pour ne
 * jamais dupliquer ce réglage. `?section=coran|adhkar|audio|horaires|general`
 * fait défiler directement vers la bonne section (accès contextuel §2/§14 :
 * chaque écran renvoie ici avec la bonne ancre plutôt que d'obliger
 * l'utilisateur à chercher parmi plusieurs niveaux de menus).
 */
export const Route = createFileRoute("/parametres")({
  validateSearch: (s: Record<string, unknown>): { section?: string } => ({
    section: typeof s.section === "string" ? s.section : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Paramètres" },
      { name: "description", content: "Coran, Adhkār, audio et affichage — tout au même endroit." },
    ],
  }),
  component: ParametresPage,
});

const SIZE_OPTIONS: { key: ReadingSize; label: string }[] = [
  { key: "normal", label: "Normal" },
  { key: "large", label: "Grand" },
  { key: "xlarge", label: "Très grand" },
];

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: "auto", label: "Automatique", icon: Laptop },
  { mode: "light", label: "Clair", icon: Sun },
  { mode: "dark", label: "Sombre", icon: Moon },
];

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-1 size-5 rounded-full bg-background shadow transition-all",
            checked ? "left-6" : "left-1",
          )}
        />
      </button>
    </div>
  );
}

function SizeRow({ value, onChange }: { value: ReadingSize; onChange: (v: ReadingSize) => void }) {
  return (
    <div className="mt-2 flex gap-1 rounded-full border border-border p-1">
      {SIZE_OPTIONS.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          aria-pressed={value === o.key}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-semibold transition",
            value === o.key ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SpeedRow({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="mt-2 flex gap-1 rounded-full border border-border p-1">
      {[0.75, 1, 1.25].map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          aria-pressed={value === s}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-semibold transition",
            value === s ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          {s}×
        </button>
      ))}
    </div>
  );
}

const WIRD_MODE_OPTIONS: { key: WirdReminderMode; label: string }[] = [
  { key: "after-fajr", label: "Après Fajr" },
  { key: "after-morning-adhkar", label: "Après mes Adhkār du matin" },
  { key: "custom", label: "Heure personnalisée" },
  { key: "off", label: "Désactivé" },
];

/** Ligne avec détails repliés par défaut (§2/§21 mission — "les options
 * détaillées apparaissent seulement en touchant chaque ligne"). */
function DisclosureRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border py-2.5 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {value}
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        </span>
      </button>
      {open && <div className="pt-2.5">{children}</div>}
    </div>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="surface-card scroll-mt-20 space-y-1 p-5">
      <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      <div className="pt-1">{children}</div>
    </section>
  );
}

function ParametresPage() {
  const search = Route.useSearch();
  const { prefs, updateQuran, updateAdhkar, updateGeneral } = usePreferences();
  const { mode, setMode } = useTheme();
  const [smart, setSmart] = useSmartReminderPrefs();
  const updateSmart = (patch: Partial<typeof smart>) => setSmart((prev) => ({ ...prev, ...patch }));
  const scrolled = useRef(false);

  // --- Horaires (déplacé depuis la page Horaires — chantier "Simplifier
  // Horaires + Accueil" : la page principale ne garde que l'essentiel, tout
  // le réglage vit ici). Logique inchangée, simplement transplantée.
  const { settings, setSettings, mosqueActive } = usePrayerTimings();
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

  const updatePrayerSettings = (patch: Partial<PrayerSettings>) => {
    // Changement de source/mosquée/localisation : sauvegarde immédiate —
    // horaires, prochaine prière, accueil et rappels se rechargent tous
    // depuis cette même clé (une seule source centrale), jamais d'ancien
    // calendrier conservé.
    setSettings({ ...settings, ...patch });
  };

  const saveMosque = () => {
    const name = mosqueDraft.name.trim();
    const city = mosqueDraft.city.trim();
    updatePrayerSettings({
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
   * Import manuel d'un calendrier réellement publié par la mosquée — JAMAIS
   * récupéré automatiquement (aucune source publique/autorisée exploitable
   * trouvée, voir l'analyse préalable). L'utilisateur colle ici le
   * calendrier qu'il a obtenu directement de sa mosquée.
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
    void queryClient.invalidateQueries({ queryKey: ["prayer-timings"] });
  };

  /**
   * Mosquées pré-remplies (sur demande explicite) — capturées une fois
   * depuis la page publique mawaqit.net de chacune (jamais un appel
   * automatisé à l'API MAWAQIT, voir la provenance détaillée dans
   * src/data/mosque-calendars-preset.ts).
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
        updatePrayerSettings({
          mode: "auto",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => setGeoError("Localisation refusée — utilisez une ville manuellement."),
      { timeout: 10_000 },
    );
  };

  const mosqueSelected = settings.source === "mosque" && !!settings.mosqueName;
  const calendarStatus = getMosqueCalendarStatus(calendar, settings.mosqueId);

  useEffect(() => {
    if (scrolled.current || !search.section) return;
    // `scrollRestoration: true` (router.tsx) remet le scroll à sa position
    // restaurée juste après le montage de la page — un `requestAnimationFrame`
    // suffit à laisser cette restauration passer avant notre ancre contextuelle,
    // sinon elle écrase systématiquement ce `scrollIntoView` (§"section=...").
    const id = requestAnimationFrame(() => {
      const el = document.getElementById(search.section!);
      if (el) {
        el.scrollIntoView({ block: "start" });
        scrolled.current = true;
      }
    });
    return () => cancelAnimationFrame(id);
  }, [search.section]);

  return (
    <AppShell title="Paramètres" subtitle="الإعدادات">
      <div className="space-y-4">
        <Section id="coran" title="Coran" subtitle="S'applique au Mushaf et au mode ayah par ayah">
          <ToggleRow
            label="Arabe"
            checked={prefs.quran.arabic}
            onChange={(v) => updateQuran({ arabic: v })}
          />
          <ToggleRow
            label="Français (traduction Hamidullah)"
            checked={prefs.quran.francais}
            onChange={(v) => updateQuran({ francais: v })}
          />
          <ToggleRow
            label="Phonétique"
            checked={prefs.quran.phonetique}
            onChange={(v) => updateQuran({ phonetique: v })}
          />
          <ToggleRow
            label="Tajwīd (couleurs, Mushaf uniquement)"
            checked={prefs.quran.tajweed}
            onChange={(v) => updateQuran({ tajweed: v })}
          />
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Taille de lecture
          </p>
          <SizeRow value={prefs.quran.textSize} onChange={(v) => updateQuran({ textSize: v })} />
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            Arabe seul (± Tajwīd) → Mushaf de Médine traditionnel. Dès que Français ou Phonétique
            est activé → mode ayah par ayah (jamais inséré dans les lignes du Mushaf).
          </p>
        </Section>

        <Section id="adhkar" title="Adhkār" subtitle="S'applique à toutes les catégories (matin, soir, coucher…)">
          <ToggleRow
            label="Français"
            checked={prefs.adhkar.francais}
            onChange={(v) => updateAdhkar({ francais: v })}
          />
          <ToggleRow
            label="Phonétique"
            checked={prefs.adhkar.phonetique}
            onChange={(v) => updateAdhkar({ phonetique: v })}
          />
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Taille de lecture
          </p>
          <SizeRow value={prefs.adhkar.textSize} onChange={(v) => updateAdhkar({ textSize: v })} />
        </Section>

        <Section id="audio" title="Audio">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Audio Coran
          </p>
          <label className="mt-1.5 block">
            <span className="mb-1 block text-xs text-muted-foreground">Récitateur</span>
            <select
              value={prefs.quran.reciterId}
              onChange={(e) => updateQuran({ reciterId: e.target.value })}
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm font-medium"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <p className="mb-1 mt-3 text-xs text-muted-foreground">Vitesse</p>
          <SpeedRow value={prefs.quran.speed} onChange={(v) => updateQuran({ speed: v })} />
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Lecture continue déjà disponible dans le Mushaf (Options → "Jusqu'à la fin"/répétition).
          </p>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Audio Adhkār
            </p>
            <p className="mb-1 mt-3 text-xs text-muted-foreground">Version audio</p>
            <div className="flex gap-1 rounded-full border border-border p-1">
              {(
                [
                  ["afasy", "Version actuelle"],
                  ["ghamdi", "Sa‘d al-Ghâmidî"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => updateAdhkar({ audioProfile: key })}
                  aria-pressed={prefs.adhkar.audioProfile === key}
                  className={cn(
                    "flex-1 rounded-full py-2 text-xs font-semibold transition",
                    prefs.adhkar.audioProfile === key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {prefs.adhkar.audioProfile === "ghamdi" && (
              <p className="mt-2 rounded-xl border border-gold/30 bg-gold/5 px-3 py-2 text-[11px] leading-relaxed text-foreground">
                En préparation — aucun fichier audio de Sa‘d al-Ghâmidî dont l'utilisation dans
                l'application est vérifiée et autorisée n'a été trouvé pour l'instant (le fichier
                proposé en ligne ne porte aucune licence de réutilisation claire). L'architecture est
                prête ; cette voix restera honnêtement indisponible tant qu'une source légitime n'est
                pas fournie.
              </p>
            )}
            <p className="mb-1 mt-3 text-xs text-muted-foreground">Vitesse</p>
            <div className="mt-2 flex gap-1 rounded-full border border-border p-1">
              {[0.75, 1, 1.25, 1.5].map((s) => (
                <button
                  key={s}
                  onClick={() => updateAdhkar({ speed: s })}
                  aria-pressed={prefs.adhkar.speed === s}
                  className={cn(
                    "flex-1 rounded-full py-2 text-sm font-semibold transition",
                    prefs.adhkar.speed === s ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  {s}×
                </button>
              ))}
            </div>
            <div className="mt-3">
              <ToggleRow
                label="Lecture continue"
                checked={prefs.adhkar.continuous}
                onChange={(v) => updateAdhkar({ continuous: v })}
              />
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Récitation Cheikh Al-‘Afâsy (Adhkār) — réglage indépendant du récitateur Coran, jamais
              mélangés. "Tout écouter" (piste continue matin/soir) reste disponible depuis l'écran
              Adhkār.
            </p>
          </div>
        </Section>

        <Section
          id="notifications"
          title="Notifications"
          subtitle="Un seul mode intelligent pour prières, Adhkār et Mon Wird"
        >
          <ToggleRow
            label="Mode intelligent"
            checked={smart.enabled}
            onChange={(v) => updateSmart({ enabled: v })}
          />
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Propose Adhkār/Wird seulement s'ils ne sont pas déjà terminés, sans jamais empiler
            plusieurs notifications à la suite d'une prière.
          </p>

          <div className={cn("mt-3", !smart.enabled && "pointer-events-none opacity-40")}>
            <DisclosureRow label="Prières" value={smart.prayers ? "Activé" : "Désactivé"}>
              <ToggleRow
                label="Notifications de prière"
                checked={smart.prayers}
                onChange={(v) => updateSmart({ prayers: v })}
              />
              <a href="/rappels" className="text-xs font-medium text-primary underline-offset-2 hover:underline">
                Régler chaque prière (rappel avant, Adhān…)
              </a>
            </DisclosureRow>

            <DisclosureRow label="Adhkār" value={smart.adhkar ? "Activé" : "Désactivé"}>
              <ToggleRow
                label="Adhkār matin/soir"
                checked={smart.adhkar}
                onChange={(v) => updateSmart({ adhkar: v })}
              />
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Matin dès Fajr, soir dès le vrai ʿAsr — uniquement si non terminés.
              </p>
            </DisclosureRow>

            <DisclosureRow
              label="Mon Wird"
              value={
                !smart.wird
                  ? "Désactivé"
                  : (WIRD_MODE_OPTIONS.find((o) => o.key === smart.wirdMode)?.label ?? "")
              }
            >
              <ToggleRow
                label="Rappel Mon Wird"
                checked={smart.wird}
                onChange={(v) => updateSmart({ wird: v })}
              />
              {smart.wird && (
                <>
                  <p className="mb-1.5 mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Rappel du Wird
                  </p>
                  <div className="space-y-1.5">
                    {WIRD_MODE_OPTIONS.map((o) => (
                      <button
                        key={o.key}
                        onClick={() => updateSmart({ wirdMode: o.key })}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition",
                          smart.wirdMode === o.key
                            ? "border-primary/50 bg-primary/5 text-foreground"
                            : "border-border text-muted-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "size-4 shrink-0 rounded-full border-2",
                            smart.wirdMode === o.key ? "border-primary bg-primary" : "border-border",
                          )}
                        />
                        {o.label}
                      </button>
                    ))}
                  </div>
                  {smart.wirdMode === "custom" && (
                    <input
                      type="time"
                      value={smart.wirdCustomTime}
                      onChange={(e) => updateSmart({ wirdCustomTime: e.target.value })}
                      className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
                    />
                  )}
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                    Le Wird se lit à tout moment de la journée — ce rappel n'est qu'une aide, jamais
                    une contrainte, et reprend toujours là où vous en étiez.
                  </p>
                </>
              )}
            </DisclosureRow>

            <DisclosureRow label="Ne pas déranger" value={`${smart.quietStart} — ${smart.quietEnd}`}>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">Début</span>
                  <input
                    type="time"
                    value={smart.quietStart}
                    onChange={(e) => updateSmart({ quietStart: e.target.value })}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">Fin</span>
                  <input
                    type="time"
                    value={smart.quietEnd}
                    onChange={(e) => updateSmart({ quietEnd: e.target.value })}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
                  />
                </label>
              </div>
            </DisclosureRow>
          </div>
        </Section>

        <Section id="horaires" title="Horaires" subtitle="Mosquée, localisation, méthode">
          <div className="surface-card space-y-1 bg-background p-4 text-center">
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
                <MapPin className="size-4" />{" "}
                {settings.mode === "auto" && settings.latitude != null
                  ? "Ma position"
                  : (settings.city ?? "Ville non définie")}
              </p>
            )}
          </div>

          {mosqueSelected && mosqueActive && (
            <p className="mt-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-center text-xs leading-relaxed text-foreground">
              Horaires réellement publiés par {settings.mosqueName}, importés manuellement le{" "}
              {calendar?.importedAt ? new Date(calendar.importedAt).toLocaleDateString("fr-FR") : ""}{" "}
              — jamais recalculés tant que ce calendrier couvre le jour.
            </p>
          )}
          {mosqueSelected && !mosqueActive && (
            <p className="mt-2 rounded-2xl border border-gold/30 bg-gold/5 px-4 py-3 text-center text-xs leading-relaxed text-foreground">
              Aucune source autorisée ne permet de récupérer automatiquement les horaires publiés
              par cette mosquée (API MAWAQIT privée, non ouverte aux applications tierces ; la
              plupart des sites de mosquées ne publient qu'une image, pas de données exploitables).
              Importez un calendrier ci-dessous si vous en avez un, sinon les horaires affichés
              sont le calcul automatique.
            </p>
          )}
          {calendarStatus && calendarStatus.daysRemaining <= 30 && (
            <p className="mt-2 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-xs leading-relaxed text-foreground">
              {calendarStatus.daysRemaining <= 0
                ? `Le calendrier de ${settings.mosqueName} s'est terminé le ${new Date(calendarStatus.lastDate + "T00:00:00").toLocaleDateString("fr-FR")} — demandez un nouveau calendrier à votre mosquée, sinon l'app repasse au calcul automatique.`
                : `Le calendrier de ${settings.mosqueName} se termine le ${new Date(calendarStatus.lastDate + "T00:00:00").toLocaleDateString("fr-FR")} (dans ${calendarStatus.daysRemaining} j) — pensez à en importer un nouveau pour l'année suivante.`}
            </p>
          )}

          <p className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Source des horaires
          </p>
          <div className="flex gap-1 rounded-full border border-border p-1">
            <button
              onClick={() => updatePrayerSettings({ source: "mosque" })}
              className={cn(
                "flex-1 rounded-full py-2 text-xs font-semibold transition",
                settings.source === "mosque" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              Ma mosquée
            </button>
            <button
              onClick={() => updatePrayerSettings({ source: "auto" })}
              className={cn(
                "flex-1 rounded-full py-2 text-xs font-semibold transition",
                settings.source === "auto" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              Calcul automatique
            </button>
          </div>

          {settings.source === "mosque" && (
            <div className="mt-3 space-y-2 rounded-2xl border border-border bg-muted/30 p-3">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Aucune recherche automatique de mosquées n'est disponible. Identifiez votre
                mosquée ici, puis importez son calendrier ci-dessous si vous en avez un — ses
                horaires ne peuvent pas être récupérés automatiquement (voir la note ci-dessus).
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
                      settings.mosqueId === preset.id ? "border-primary/50 bg-primary/5" : "border-border",
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
                    réellement publiés) ? Collez-le ici — jamais récupéré automatiquement. Format
                    attendu, un tableau JSON :{" "}
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

          <p className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Calcul automatique — localisation et méthode
          </p>
          <div className="flex gap-1 rounded-full border border-border p-1">
            <button
              onClick={() => updatePrayerSettings({ mode: "manual" })}
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
          {geoError && <p className="mt-1 text-xs text-destructive">{geoError}</p>}

          {settings.mode === "manual" && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                value={settings.city ?? ""}
                onChange={(e) => updatePrayerSettings({ city: e.target.value })}
                placeholder="Ville"
                className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
              />
              <input
                value={settings.country ?? ""}
                onChange={(e) => updatePrayerSettings({ country: e.target.value })}
                placeholder="Pays"
                className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
              />
            </div>
          )}

          <p className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Méthode de calcul
          </p>
          <select
            value={settings.methodId}
            onChange={(e) => updatePrayerSettings({ methodId: Number(e.target.value) })}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
          >
            {CALC_METHODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <p className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            École ʿAsr
          </p>
          <div className="flex gap-1 rounded-full border border-border p-1">
            <button
              onClick={() => updatePrayerSettings({ school: 0 })}
              className={cn(
                "flex-1 rounded-full py-2 text-xs font-semibold transition",
                settings.school === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              Shafi'i / Maliki / Hanbali
            </button>
            <button
              onClick={() => updatePrayerSettings({ school: 1 })}
              className={cn(
                "flex-1 rounded-full py-2 text-xs font-semibold transition",
                settings.school === 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              Hanafi
            </button>
          </div>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
            Horaires fournis par Al Adhan API (Islamic Network) — méthode affichée ici, jamais
            calculée par l'application.
          </p>
          <a
            href="/horaires"
            className="mt-2 block text-center text-xs font-medium text-primary underline-offset-2 hover:underline"
          >
            Voir la page Horaires
          </a>
        </Section>

        <Section id="general" title="Général / accessibilité">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Apparence
          </p>
          <div className="flex gap-1 rounded-full border border-border p-1">
            {THEME_OPTIONS.map(({ mode: m, label, icon: Icon }) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition",
                  mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="size-3.5" /> {label}
              </button>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <ToggleRow
              label="Réduire les animations"
              checked={prefs.general.reduceMotion}
              onChange={(v) => updateGeneral({ reduceMotion: v })}
            />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Limite les transitions/mouvements visuels de l'interface.
            </p>
          </div>
        </Section>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Les changements s'appliquent immédiatement, partout où ils sont utilisés.
        </p>
      </div>
    </AppShell>
  );
}
