import type { BelowMode, BelowSource, QuranPreferences } from "@/lib/preferences";
import { BELOW_SOURCES } from "@/lib/belowContent";
import { ChoiceSelect } from "@/components/ChoiceSelect";
import { cn } from "@/lib/utils";

/**
 * Affichage du Coran — deux façons de lire :
 *  - « Mushaf (page) » : la page de Médine, avec au choix UNE source dans un
 *    volet dessous (Français, Phonétique, un tafsir) ;
 *  - « Une āyah par bloc » : on combine librement Arabe / Français / Phonétique
 *    (au moins un), et on peut ajouter un tafsir.
 */
type Patch = Partial<
  Pick<QuranPreferences, "belowSource" | "belowMode" | "arabic" | "francais" | "phonetique">
>;
type Props = Pick<
  QuranPreferences,
  "belowSource" | "belowMode" | "arabic" | "francais" | "phonetique"
>;

const TAFSIRS = BELOW_SOURCES.filter((s) => s.group === "Tafsir");
const isTafsir = (s: BelowSource) => TAFSIRS.some((t) => t.id === s);

export function QuranDisplayModes({
  quran,
  onChange,
}: {
  quran: Props;
  onChange: (patch: Patch) => void;
  /** Conservé pour compatibilité : le rendu est maintenant toujours compact. */
  compact?: boolean;
}) {
  const source: BelowSource = quran.belowSource ?? "none";
  const mode: BelowMode = quran.belowMode ?? "panel";
  const groups = ["Traduction", "Phonétique", "Tafsir"] as const;
  const tafsir: BelowSource = isTafsir(source) ? source : "none";
  const layers = {
    arabic: quran.arabic !== false,
    francais: !!quran.francais || (mode === "ayah" && source === "fr"),
    phonetique: !!quran.phonetique || (mode === "ayah" && source === "phonetic"),
  };

  const switchMode = (next: BelowMode) => {
    if (next === mode) return;
    if (next === "ayah") {
      // Reprend le contenu choisi sous le Mushaf comme couche de départ.
      onChange({
        belowMode: "ayah",
        arabic: true,
        francais: layers.francais || source === "fr",
        phonetique: layers.phonetique || source === "phonetic",
        belowSource: isTafsir(source) ? source : "none",
      });
    } else {
      onChange({ belowMode: "panel", belowSource: source });
    }
  };

  const toggleLayer = (key: "arabic" | "francais" | "phonetique") => {
    const next = { ...layers, [key]: !layers[key] };
    // Au moins une couche (ou un tafsir) doit rester affichée.
    if (!next.arabic && !next.francais && !next.phonetique && tafsir === "none") return;
    onChange({ [key]: next[key] });
  };

  return (
    <div className="space-y-3">
      <div className="block">
        <span className="mb-1 block text-xs text-muted-foreground">Affichage du Coran</span>
        <ChoiceSelect
          title="Affichage du Coran"
          value={mode}
          onChange={(v) => switchMode(v as BelowMode)}
        >
          <option value="panel">Mushaf (page de Médine)</option>
          <option value="ayah">Une āyah par bloc</option>
        </ChoiceSelect>
      </div>

      {mode === "panel" ? (
        <div className="block">
          <span className="mb-1 block text-xs text-muted-foreground">Contenu sous le Mushaf</span>
          <ChoiceSelect
            title="Contenu sous le Mushaf"
            value={source}
            onChange={(v) => onChange({ belowSource: v as BelowSource, belowMode: "panel" })}
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
      ) : (
        <>
          <div>
            <span className="mb-1.5 block text-xs text-muted-foreground">Afficher</span>
            <div className="flex gap-1.5">
              {(
                [
                  ["arabic", "Arabe"],
                  ["francais", "Français"],
                  ["phonetique", "Phonétique"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="switch"
                  aria-checked={layers[key]}
                  onClick={() => toggleLayer(key)}
                  className={cn(
                    "h-11 flex-1 rounded-full border text-sm font-semibold transition active:scale-[0.97]",
                    layers[key]
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="block">
            <span className="mb-1 block text-xs text-muted-foreground">Ajouter un tafsīr</span>
            <ChoiceSelect
              title="Tafsīr"
              value={tafsir}
              onChange={(v) => {
                const t = v as BelowSource;
                if (t === "none" && !layers.arabic && !layers.francais && !layers.phonetique) return;
                onChange({ belowSource: t, belowMode: "ayah" });
              }}
            >
              <option value="none">Aucun</option>
              {TAFSIRS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </ChoiceSelect>
          </div>
        </>
      )}
    </div>
  );
}
