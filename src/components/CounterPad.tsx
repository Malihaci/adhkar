import { useEffect, useRef, useState } from "react";
import { Check, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { milestones, vibrateLight } from "@/lib/dhikrCounter";

/**
 * Cœur du compteur — une seule action principale : taper n'importe où dans
 * la grande zone = +1. Réutilisé par le compteur personnel et par les défis.
 * `goalLabel` distingue toujours "Objectif personnel" / "Objectif du défi"
 * d'un "Nombre rapporté" (affiché ailleurs, avec sa source).
 */
export function CounterPad({
  count,
  goal,
  goalLabel,
  onIncrement,
  onUndo,
  canUndo,
  disabled,
}: {
  count: number;
  goal?: number;
  goalLabel: string;
  onIncrement: () => void;
  onUndo: () => void;
  canUndo: boolean;
  disabled?: boolean;
}) {
  const [pulse, setPulse] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const prev = useRef(count);

  // Feedback de palier / d'objectif : discret, jamais bloquant.
  useEffect(() => {
    if (count > prev.current && goal) {
      if (count === goal) setFlash("Objectif atteint 🌿");
      else if (milestones(goal).includes(count)) setFlash(`${count} ✓`);
    }
    prev.current = count;
  }, [count, goal]);
  useEffect(() => {
    if (!flash) return;
    const t = window.setTimeout(() => setFlash(null), 1800);
    return () => window.clearTimeout(t);
  }, [flash]);

  const tap = () => {
    if (disabled) return;
    vibrateLight();
    setPulse(true);
    window.setTimeout(() => setPulse(false), 120);
    onIncrement();
  };

  const pct = goal ? Math.min(100, Math.round((count / goal) * 100)) : 0;
  const steps = goal ? milestones(goal) : [];

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={tap}
        disabled={disabled}
        aria-label={`Ajouter 1 — compteur à ${count}`}
        className={cn(
          "surface-card relative flex min-h-[36vh] w-full select-none flex-col items-center justify-center gap-4 rounded-[2rem] px-4 py-6 text-center transition-transform active:scale-[0.985] disabled:opacity-60",
          pulse && "scale-[0.99]",
        )}
        style={{ touchAction: "manipulation" }}
      >
        <span
          className="text-[6.5rem] font-bold leading-none tabular-nums text-foreground sm:text-[8rem]"
          aria-live="polite"
        >
          {count}
        </span>
        {goal ? (
          <span className="text-sm font-medium text-muted-foreground">
            sur {goal} · {goalLabel}
          </span>
        ) : null}
        <span className="grid h-20 w-48 place-items-center rounded-full bg-primary text-3xl font-semibold text-primary-foreground shadow-[var(--shadow-elevated)]">
          +1
        </span>
        {flash && (
          <span className="absolute inset-x-0 top-4 mx-auto w-fit rounded-full bg-primary/12 px-4 py-1.5 text-sm font-semibold text-primary">
            {flash}
          </span>
        )}
      </button>

      {goal ? (
        <div className="space-y-3">
          <div className="h-3 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={count} aria-valuemax={goal}>
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <ul className="flex flex-wrap justify-center gap-1.5">
            {steps.map((s) => (
              <li
                key={s}
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums",
                  count >= s ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {s}
                {count >= s && <Check className="size-3" />}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-muted-foreground transition enabled:hover:text-foreground disabled:opacity-40"
        >
          <Undo2 className="size-4" /> Annuler le dernier +1
        </button>
      </div>
    </div>
  );
}
