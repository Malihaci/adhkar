import { Check } from "lucide-react";
import type { BelowMode, BelowSource, QuranPreferences } from "@/lib/preferences";
import { BELOW_SOURCES } from "@/lib/belowContent";
import { cn } from "@/lib/utils";

/**
 * « Sous le Mushaf » — l'utilisateur choisit UNE source (Français,
 * Phonétique, un tafsir…) et le mode d'affichage :
 *  - volet : page du Mushaf + une āyah dessous (celle touchée / récitée) ;
 *  - āyah par āyah : l'arabe puis la source choisie, une āyah par bloc.
 */
type Patch = Pick<QuranPreferences, "belowSource" | "belowMode">;

function Radio({
  on,
  label,
  hint,
  onClick,
  compact,
}: {
  on: boolean;
  label: string;
  hint?: string;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border px-4 text-left transition",
        compact ? "min-h-11 py-2" : "min-h-12 py-2.5",
        on ? "border-primary bg-primary/8" : "border-border bg-card hover:bg-muted/50",
      )}
    >
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-full border",
          on ? "border-primary bg-primary text-primary-foreground" : "border-border",
        )}
      >
        {on && <Check className="size-3" strokeWidth={3} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {hint && !compact && <span className="block text-xs text-muted-foreground">{hint}</span>}
      </span>
    </button>
  );
}

export function QuranDisplayModes({
  quran,
  onChange,
  compact,
}: {
  quran: Pick<QuranPreferences, "belowSource" | "belowMode">;
  onChange: (patch: Patch) => void;
  compact?: boolean;
}) {
  const source: BelowSource = quran.belowSource ?? "none";
  const mode: BelowMode = quran.belowMode ?? "panel";
  const groups = ["Traduction", "Phonétique", "Tafsir"] as const;
  return (
    <div className="space-y-3">
      <div role="radiogroup" aria-label="Contenu sous le Mushaf" className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Contenu sous le Mushaf
        </p>
        <Radio
          compact={compact}
          on={source === "none"}
          label="Aucun (arabe seul)"
          hint="Mushaf de Médine, 604 pages"
          onClick={() => onChange({ belowSource: "none", belowMode: mode })}
        />
        {groups.map((g) =>
          BELOW_SOURCES.filter((s) => s.group === g).map((s) => (
            <Radio
              key={s.id}
              compact={compact}
              on={source === s.id}
              label={s.label}
              onClick={() => onChange({ belowSource: s.id, belowMode: mode })}
            />
          )),
        )}
      </div>

      {source !== "none" && (
        <div role="radiogroup" aria-label="Mode d'affichage" className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Affichage
          </p>
          <Radio
            compact={compact}
            on={mode === "panel"}
            label="Page du Mushaf + volet d'une āyah"
            hint="L'āyah touchée ou récitée est traduite dessous"
            onClick={() => onChange({ belowSource: source, belowMode: "panel" })}
          />
          <Radio
            compact={compact}
            on={mode === "ayah"}
            label="Une āyah par bloc"
            hint="L'arabe, puis le contenu choisi"
            onClick={() => onChange({ belowSource: source, belowMode: "ayah" })}
          />
        </div>
      )}
    </div>
  );
}
