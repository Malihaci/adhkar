import type { BelowMode, BelowSource, QuranPreferences } from "@/lib/preferences";
import { BELOW_SOURCES } from "@/lib/belowContent";
import { ChoiceSelect } from "@/components/ChoiceSelect";

/**
 * « Sous le Mushaf » — l'utilisateur choisit UNE source (Français,
 * Phonétique, un tafsir…) dans une liste, et le mode d'affichage :
 *  - volet : page du Mushaf + une āyah dessous (celle touchée / récitée) ;
 *  - āyah par āyah : l'arabe puis la source choisie, une āyah par bloc.
 */
type Patch = Pick<QuranPreferences, "belowSource" | "belowMode">;

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
      <div className="block">
        <span className="mb-1 block text-xs text-muted-foreground">Contenu sous le Mushaf</span>
        <ChoiceSelect
          title="Contenu sous le Mushaf"
          value={source}
          onChange={(v) => onChange({ belowSource: v as BelowSource, belowMode: mode })}
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
        </ChoiceSelect>
      </div>

      {source !== "none" && (
        <div className="block">
          <span className="mb-1 block text-xs text-muted-foreground">Affichage</span>
          <ChoiceSelect
            title="Affichage"
            value={mode}
            onChange={(v) => onChange({ belowSource: source, belowMode: v as BelowMode })}
          >
            <option value="panel">Page du Mushaf + volet d'une āyah</option>
            <option value="ayah">Une āyah par bloc</option>
          </ChoiceSelect>
        </div>
      )}
    </div>
  );
}
