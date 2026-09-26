import { useState } from "react";
import { Heart, RotateCcw, Minus, Plus, ChevronDown, Check, Share2 } from "lucide-react";
import type { Dhikr } from "@/data/adhkar";
import { AyahText } from "@/components/AyahText";

import { useDailyProgress, useFavorites } from "@/lib/storage";
import { shareDhikr } from "@/lib/share";
import { cn } from "@/lib/utils";

interface Props {
  dhikr: Dhikr;
  index: number;
}

export function DhikrCard({ dhikr, index }: Props) {
  const { progress, increment, decrement, reset, setLastRead } = useDailyProgress();
  const { isFavorite, toggle } = useFavorites();
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<"ar" | "ph" | "fr" | "all">("ar");

  const count = progress.counts[dhikr.id] ?? 0;
  const done = count >= dhikr.repetitions;
  const fav = isFavorite("dhikr", dhikr.id);

  const onCount = () => {
    if (done) return;
    increment(dhikr.id, dhikr.repetitions);
    setLastRead(dhikr.id, dhikr.category);
  };

  return (
    <article className="surface-card overflow-hidden">
      {/* Header */}
      <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {index + 1}
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-semibold">
              {dhikr.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {dhikr.repetitions === 1
                ? "1 fois"
                : `${dhikr.repetitions} fois`}{" "}
              · {dhikr.reference.split(",")[0]}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            onClick={() => shareDhikr(dhikr, index)}
            aria-label="Partager"
            className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-primary"
          >
            <Share2 className="size-4" />
          </button>
          <button
            onClick={() => toggle("dhikr", dhikr.id)}
            aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
            aria-pressed={fav}
            className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-gold"
          >
            <Heart
              className={cn("size-5 transition", fav && "fill-gold text-gold")}
            />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border px-3 py-2">
        {(
          [
            { key: "ar", label: "عربي" },
            { key: "ph", label: "Phonétique" },
            { key: "fr", label: "Français" },
            { key: "all", label: "Tout" },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition",
              tab === t.key
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4 px-5 py-4">
        {(tab === "ar" || tab === "all") && (
          <AyahText
            text={dhikr.arabic}
            className="text-2xl leading-loose sm:text-3xl"
          />
        )}

        {(tab === "ph" || tab === "all") && (
          <p className="text-[15px] italic leading-relaxed text-foreground">
            {dhikr.phonetic}
          </p>
        )}
        {(tab === "fr" || tab === "all") && (
          <p className="text-[15px] leading-relaxed text-foreground">
            {dhikr.translation}
          </p>
        )}
      </div>

      {/* Counter */}
      <div className="mx-5 mb-4 rounded-2xl bg-secondary/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Compteur
            </p>
            <p className="mt-0.5 text-2xl font-semibold tabular-nums">
              {count}
              <span className="text-muted-foreground"> / {dhikr.repetitions}</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => reset(dhikr.id)}
              aria-label="Réinitialiser"
              className="grid size-10 place-items-center rounded-full text-muted-foreground transition hover:bg-background hover:text-foreground"
            >
              <RotateCcw className="size-4" />
            </button>
            <button
              onClick={() => decrement(dhikr.id)}
              aria-label="Diminuer"
              className="grid size-10 place-items-center rounded-full text-muted-foreground transition hover:bg-background hover:text-foreground"
            >
              <Minus className="size-4" />
            </button>
            <button
              onClick={onCount}
              disabled={done}
              aria-label={done ? "Terminé" : "Compter"}
              className={cn(
                "grid size-14 place-items-center rounded-full text-lg font-semibold transition-all",
                done
                  ? "bg-primary/15 text-primary"
                  : "bg-primary text-primary-foreground shadow-[var(--shadow-elevated)] hover:scale-105 active:scale-95",
              )}
            >
              {done ? <Check className="size-6" /> : <Plus className="size-6" />}
            </button>
          </div>
        </div>

        {/* Dots progression */}
        {dhikr.repetitions <= 10 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {Array.from({ length: dhikr.repetitions }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "size-3 rounded-full transition-all",
                  i < count
                    ? "bg-primary scale-100"
                    : "bg-border scale-90",
                )}
              />
            ))}
          </div>
        )}
        {dhikr.repetitions > 10 && (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${Math.min(100, (count / dhikr.repetitions) * 100)}%`,
              }}
            />
          </div>
        )}
        {done && (
          <p className="mt-3 text-center text-xs font-medium text-primary">
            ✓ Dhikr terminé — barakAllâhu fîk
          </p>
        )}
      </div>

      {/* Explanation / merits collapse */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 border-t border-border px-5 py-3 text-sm font-medium text-primary transition hover:bg-secondary/40"
        aria-expanded={expanded}
      >
        <span>Explication & mérites</span>
        <ChevronDown
          className={cn("size-4 transition-transform", expanded && "rotate-180")}
        />
      </button>
      {expanded && (
        <div className="space-y-4 border-t border-border bg-secondary/30 px-5 py-4 text-sm leading-relaxed">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Explication
            </p>
            <p>{dhikr.explanation}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Mérites
            </p>
            <p>{dhikr.merits}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Référence
            </p>
            <p className="text-muted-foreground">{dhikr.reference}</p>
          </div>
        </div>
      )}
    </article>
  );
}
