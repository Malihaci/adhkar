import { Check } from "lucide-react";
import type { QuranPreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

/**
 * Modes d'affichage du Coran — l'utilisateur choisit ce qu'il veut LIRE,
 * l'application choisit le rendu technique : arabe seul = Mushaf de Médine ;
 * dès que Français ou Phonétique est choisi = lecteur ayah par ayah (jamais
 * injecté dans les 15 lignes du Mushaf). Écrit uniquement les mêmes trois
 * préférences que d'habitude (arabic/francais/phonetique) — aucun nouveau
 * modèle de données.
 */
type Layers = Pick<QuranPreferences, "arabic" | "francais" | "phonetique">;

export const QURAN_DISPLAY_MODES: { id: string; label: string; hint?: string; layers: Layers }[] = [
  {
    id: "mushaf",
    label: "Mushaf (arabe)",
    hint: "Arabe seul · mise en page du Mushaf de Médine, 604 pages",
    layers: { arabic: true, francais: false, phonetique: false },
  },
  { id: "ar-fr", label: "Arabe + Français", layers: { arabic: true, francais: true, phonetique: false } },
  { id: "ar-ph", label: "Arabe + Phonétique", layers: { arabic: true, francais: false, phonetique: true } },
  {
    id: "ar-fr-ph",
    label: "Arabe + Français + Phonétique",
    layers: { arabic: true, francais: true, phonetique: true },
  },
  { id: "fr", label: "Français", layers: { arabic: false, francais: true, phonetique: false } },
  { id: "ph", label: "Phonétique", layers: { arabic: false, francais: false, phonetique: true } },
];

export function currentQuranMode(q: Layers): string | null {
  return (
    QURAN_DISPLAY_MODES.find(
      (m) =>
        m.layers.arabic === q.arabic &&
        m.layers.francais === q.francais &&
        m.layers.phonetique === q.phonetique,
    )?.id ?? null
  );
}

export function QuranDisplayModes({
  quran,
  onChange,
  compact,
}: {
  quran: Layers;
  onChange: (layers: Layers) => void;
  compact?: boolean;
}) {
  const active = currentQuranMode(quran);
  return (
    <div role="radiogroup" aria-label="Affichage" className="space-y-1.5">
      {QURAN_DISPLAY_MODES.map((m) => {
        const on = m.id === active;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(m.layers)}
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
              <span className="block text-sm font-medium text-foreground">{m.label}</span>
              {m.hint && !compact && (
                <span className="block text-xs text-muted-foreground">{m.hint}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
