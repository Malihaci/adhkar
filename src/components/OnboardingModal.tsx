import { RECITERS } from "@/lib/mushaf";
import { usePreferences, type ReadingSize } from "@/lib/preferences";
import { cn } from "@/lib/utils";

/**
 * Assistant du tout premier lancement (§3 mission "Paramètres centralisés")
 * — un seul écran compact (pas plusieurs pages à enchaîner) : personnes
 * âgées et utilisateurs peu habitués n'ont qu'à cocher/décocher puis
 * "Commencer". Rien n'est obligatoire : les valeurs par défaut conviennent
 * déjà (Arabe+Tajwīd pour le Coran, Arabe+Français pour l'Adhkār). Tout
 * reste modifiable ensuite dans ⚙️ Paramètres — cet écran ne s'affiche plus
 * jamais une fois passé (`prefs.onboarded`).
 */
export function OnboardingModal() {
  const { prefs, updateQuran, updateAdhkar, completeOnboarding } = usePreferences();

  const Check = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
        checked ? "border-primary/50 bg-primary/5" : "border-border",
      )}
    >
      <span
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-full border-2 text-[11px] font-bold",
          checked ? "border-primary bg-primary text-primary-foreground" : "border-border",
        )}
      >
        {checked && "✓"}
      </span>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </button>
  );

  const SizeChoice = ({
    value,
    onChange,
  }: {
    value: ReadingSize;
    onChange: (v: ReadingSize) => void;
  }) => (
    <div className="flex gap-1 rounded-full border border-border p-1">
      {(
        [
          ["normal", "Normal"],
          ["large", "Grand"],
          ["xlarge", "Très grand"],
        ] as const
      ).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-semibold transition",
            value === key ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm">
      <div className="flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-elevated)]">
        <div className="shrink-0 border-b border-border px-5 py-4 text-center">
          <h2 className="font-display text-lg font-semibold text-foreground">Bienvenue</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Quelques préférences simples — tout reste modifiable ensuite dans ⚙️ Paramètres.
          </p>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Coran — comment souhaitez-vous lire ?
            </p>
            <div className="space-y-2">
              <Check
                label="Arabe"
                checked={prefs.quran.arabic}
                onChange={(v) => updateQuran({ arabic: v })}
              />
              <Check
                label="Français"
                checked={prefs.quran.francais}
                onChange={(v) => updateQuran({ francais: v })}
              />
              <Check
                label="Phonétique"
                checked={prefs.quran.phonetique}
                onChange={(v) => updateQuran({ phonetique: v })}
              />
              <Check
                label="Tajwīd (couleurs)"
                checked={prefs.quran.tajweed}
                onChange={(v) => updateQuran({ tajweed: v })}
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Adhkār — que souhaitez-vous afficher ?
            </p>
            <div className="space-y-2">
              <Check
                label="Français"
                checked={prefs.adhkar.francais}
                onChange={(v) => updateAdhkar({ francais: v })}
              />
              <Check
                label="Phonétique"
                checked={prefs.adhkar.phonetique}
                onChange={(v) => updateAdhkar({ phonetique: v })}
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Taille du texte
            </p>
            <SizeChoice
              value={prefs.quran.textSize}
              onChange={(v) => {
                updateQuran({ textSize: v });
                updateAdhkar({ textSize: v });
              }}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Récitateur du Coran
            </p>
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
          </div>
        </div>

        <div className="shrink-0 border-t border-border px-5 py-4">
          <button
            onClick={completeOnboarding}
            className="w-full rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-elevated)] transition active:scale-[0.98]"
          >
            Commencer
          </button>
        </div>
      </div>
    </div>
  );
}
