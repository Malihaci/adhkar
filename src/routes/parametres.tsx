import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Laptop, Moon, Sun } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useTheme, type ThemeMode } from "@/lib/storage";
import { usePreferences, type ReadingSize } from "@/lib/preferences";
import { useSmartReminderPrefs, type WirdReminderMode } from "@/lib/smartReminders";
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

  useEffect(() => {
    if (scrolled.current || !search.section) return;
    const el = document.getElementById(search.section);
    if (el) {
      el.scrollIntoView({ block: "start" });
      scrolled.current = true;
    }
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

        <Section id="horaires" title="Horaires">
          <p className="text-sm text-muted-foreground">
            Source des horaires (mosquée ou calcul automatique), localisation et méthode se règlent
            directement sur la page Horaires.
          </p>
          <a
            href="/horaires"
            className="mt-3 inline-block rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Ouvrir Horaires de prière
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
