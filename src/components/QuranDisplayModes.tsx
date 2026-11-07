import type { BelowMode, BelowSource, QuranPreferences } from "@/lib/preferences";
import { BELOW_SOURCES } from "@/lib/belowContent";

/**
 * « Sous le Mushaf » — l'utilisateur choisit UNE source (Français,
 * Phonétique, un tafsir…) dans une liste, et le mode d'affichage :
 *  - volet : page du Mushaf + une āyah dessous (celle touchée / récitée) ;
 *  - āyah par āyah : l'arabe puis la source choisie, une āyah par bloc.
 */
type Patch = Pick<QuranPreferences, "belowSource" | "belowMode">;

const selectCls = "h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-medium";

export function QuranDisplayModes({
  quran,
  onChange,
}: {
  quran: Pick<QuranPreferences, "belowSource" | "belowMode">;
  onChange: (patch: Patch) => void;
  /** Conservé pour compatibilité : le rendu est maintenant toujours compact. */
  compact?: boolean;
}) {
  const source: BelowSource = quran.belowSource ?? "none";
  const mode: BelowMode = quran.belowMode ?? "panel";
  const groups = ["Traduction", "Phonétique", "Tafsir"] as const;
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs text-muted-foreground">Contenu sous le Mushaf</span>
        <select
          value={source}
          onChange={(e) => onChange({ belowSource: e.target.value as BelowSource, belowMode: mode })}
          className={selectCls}
        >
          <option value="none">Aucun (arabe seul)</option>
          {groups.map((g) => (
            <optgroup key={g} label={g}>
              {BELOW_SOURCES.filter((s) => s.group === g).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      {source !== "none" && (
        <label className="block">
          <span className="mb-1 block text-xs text-muted-foreground">Affichage</span>
          <select
            value={mode}
            onChange={(e) => onChange({ belowSource: source, belowMode: e.target.value as BelowMode })}
            className={selectCls}
          >
            <option value="panel">Page du Mushaf + volet d'une āyah</option>
            <option value="ayah">Une āyah par bloc</option>
          </select>
        </label>
      )}
    </div>
  );
}
