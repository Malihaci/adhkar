import { useEffect, useRef, useState } from "react";
import {
  Heart,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Home,
  Check,
  Settings2,
  Leaf,
  ChevronDown,
  Pause,
  Play,
  Share2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AyahText } from "@/components/AyahText";
import { SourceInfo } from "@/components/SourceInfo";

import type { Dhikr } from "@/data/adhkar";
import { useDailyProgress, useFavorites, getLastReadIndex } from "@/lib/storage";
import { usePreferences, type ReadingSize } from "@/lib/preferences";
import { shareDhikr } from "@/lib/share";
import { useDhikrVerseAudio } from "@/lib/dhikrAudio";
import { cn } from "@/lib/utils";

const ARABIC_SIZE: Record<ReadingSize, string> = {
  normal: "text-[1.5rem] leading-[2] sm:text-[1.9rem] sm:leading-[2]",
  large: "text-[1.9rem] leading-[1.95] sm:text-[2.3rem] sm:leading-[1.95]",
  xlarge: "text-[2.3rem] leading-[1.9] sm:text-[2.8rem] sm:leading-[1.9]",
};
const TEXT_SIZE: Record<ReadingSize, string> = {
  normal: "text-[15px]",
  large: "text-[18px]",
  xlarge: "text-[21px]",
};

interface Props {
  list: Dhikr[];
  accent?: "primary" | "gold";
  initialIndex?: number;
  /** Libellé affiché en haut (par défaut : matin / soir) */
  label?: string;
  /** Cible du bouton retour */
  backTo?: "/" | "/favoris";
  /** Mémoriser la position de lecture (désactivé pour le parcours Favoris) */
  persist?: boolean;
}

export function DhikrViewer({
  list,
  accent = "primary",
  initialIndex,
  label,
  backTo = "/",
  persist = true,
}: Props) {
  const { progress, increment, reset, setLastRead } = useDailyProgress();
  const { isFavorite, toggle } = useFavorites();
  const category = list[0]?.category ?? "morning";
  /**
   * Position restaurée synchroniquement dès le premier rendu (initialiseur
   * paresseux) — jamais via un second `useEffect` séparé qui appelait
   * `setIdx(saved)` après coup : celui-ci entrait en course avec l'effet de
   * persistance juste en dessous (`setLastRead(..., idx)`, déclenché sur
   * TOUT montage). Les deux s'exécutaient dans le même flush d'effets, mais
   * la persistance lisait encore l'ancien `idx` (0) capturé au rendu
   * initial — elle réécrasait donc l'index restauré par 0 dans le stockage
   * juste après l'avoir lu, causant une perte de position perceptible dès
   * qu'on revenait sur l'écran (ex. après un aller-retour par ⚙️ Paramètres,
   * §15/§19 mission). Calculer `idx` une seule fois, dès l'état initial,
   * élimine cette course : plus rien ne peut persister une valeur transitoire.
   */
  const [idx, setIdx] = useState(() => {
    if (typeof initialIndex === "number") return initialIndex;
    if (!persist) return 0;
    const saved = getLastReadIndex(category);
    return saved !== null && saved >= 0 && saved < list.length ? saved : 0;
  });
  const { prefs, updateAdhkar } = usePreferences();
  const showFrancais = prefs.adhkar.francais;
  const showPhonetic = prefs.adhkar.phonetique;
  const fontSize = prefs.adhkar.textSize;
  const [sizeOpen, setSizeOpen] = useState(false);
  const [liveOpen, setLiveOpen] = useState(false);
  const [warnOpen, setWarnOpen] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // La liste peut rétrécir (favori retiré) : rester dans les bornes
  useEffect(() => {
    setIdx((i) => Math.max(0, Math.min(i, list.length - 1)));
  }, [list.length]);

  const dhikr = list[Math.min(idx, list.length - 1)];
  const dhikrAudio = useDhikrVerseAudio(dhikr?.verseKeys);

  // Persist current position
  useEffect(() => {
    if (persist && dhikr) setLastRead(dhikr.id, dhikr.category, idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  if (!dhikr) return null;

  const count = progress.counts[dhikr.id] ?? 0;
  const done = count >= dhikr.repetitions;
  const fav = isFavorite("dhikr", dhikr.id);

  const go = (d: number) => {
    setIdx((i) => Math.min(list.length - 1, Math.max(0, i + d)));
    setLiveOpen(false);
  };

  const tryGo = (d: number) => {
    if (d > 0 && !done) {
      setWarnOpen(true);
      return;
    }
    go(d);
  };

  const onCount = () => {
    if (done) return;
    increment(dhikr.id, dhikr.repetitions);
    const newCount = count + 1;
    if (newCount >= dhikr.repetitions && idx < list.length - 1) {
      window.setTimeout(() => go(1), 700);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) tryGo(1);
      else go(-1);
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background p-2 sm:p-3">
      <article
        className="surface-card relative flex flex-1 flex-col overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Header */}
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border px-3 py-2.5 sm:px-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {label ??
                (category === "morning"
                  ? "Adhkâr du matin"
                  : category === "evening"
                    ? "Adhkâr du soir"
                    : "Adhkâr")}
              <span
                className={cn(
                  "ml-2 font-bold tabular-nums",
                  accent === "gold" ? "text-gold" : "text-primary",
                )}
              >
                {idx + 1} / {list.length}
              </span>
            </p>
            <h1 className="truncate font-display text-base font-semibold text-foreground sm:text-lg">
              {dhikr.title}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => {
                if (dhikrAudio.available) {
                  dhikrAudio.toggle();
                  return;
                }
                setAudioUnavailable(true);
                window.setTimeout(() => setAudioUnavailable(false), 2500);
              }}
              aria-label={dhikrAudio.playing ? "Mettre en pause" : "Écouter ce dhikr"}
              className="grid size-11 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-primary"
            >
              {dhikrAudio.playing ? <Pause className="size-5" /> : <Play className="size-5" />}
            </button>
            <button
              onClick={() => toggle("dhikr", dhikr.id)}
              aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
              aria-pressed={fav}
              className="grid size-11 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-gold"
            >
              <Heart className={cn("size-6 transition", fav && "fill-gold text-gold")} />
            </button>
            <button
              onClick={() => shareDhikr(dhikr, idx)}
              aria-label="Partager"
              className="grid size-11 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-primary"
            >
              <Share2 className="size-5" />
            </button>
            {/* ⚙️ — affichage : arabe/français/phonétique + taille du texte,
                réglages peu fréquents rangés derrière un seul panneau
                (§22/35 mission), désormais backés par ⚙️ Paramètres > Adhkār
                (chantier "Paramètres centralisés" — src/lib/preferences.ts). */}
            <div className="relative">
              <button
                onClick={() => setSizeOpen((v) => !v)}
                aria-label="Affichage (arabe, français, phonétique, taille du texte)"
                aria-expanded={sizeOpen}
                className="grid size-11 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <Settings2 className="size-5" />
              </button>
              {sizeOpen && (
                <div className="absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)]">
                  {(
                    [
                      ["francais", "Français", showFrancais],
                      ["phonetique", "Phonétique", showPhonetic],
                    ] as const
                  ).map(([key, label, checked]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-3 border-b border-border px-4 py-3"
                    >
                      <span className="text-sm font-medium text-foreground">{label}</span>
                      <button
                        onClick={() => updateAdhkar({ [key]: !checked })}
                        role="switch"
                        aria-checked={checked}
                        aria-label={`Afficher ${label.toLowerCase()}`}
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
                  ))}
                  <p className="px-4 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Taille du texte
                  </p>
                  {(
                    [
                      ["normal", "Normal"],
                      ["large", "Grand"],
                      ["xlarge", "Très grand"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        updateAdhkar({ textSize: key });
                        setSizeOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition hover:bg-muted",
                        fontSize === key && "text-primary",
                      )}
                    >
                      {label}
                      {fontSize === key && <Check className="size-4" />}
                    </button>
                  ))}
                  <Link
                    to="/parametres"
                    search={{ section: "adhkar" }}
                    onClick={() => setSizeOpen(false)}
                    className="block border-t border-border px-4 py-2.5 text-center text-xs font-medium text-primary"
                  >
                    Tous les paramètres
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {audioUnavailable && (
          <p className="bg-muted/40 px-3 py-1.5 text-center text-[11px] text-muted-foreground">
            Audio indisponible pour ce dhikr.
          </p>
        )}

        {/* Vivre ce dhikr — remonté juste sous les actions (§23), plus besoin
            de descendre jusqu'en bas pour le trouver. */}
        <div className="mx-3 mt-3 shrink-0 rounded-2xl border border-border bg-secondary/40 sm:mx-4">
          <button
            onClick={() => setLiveOpen((v) => !v)}
            aria-expanded={liveOpen}
            className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
          >
            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-foreground">
              <Leaf className="size-4 shrink-0 text-primary" />
              Vivre ce dhikr
            </span>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform",
                liveOpen && "rotate-180",
              )}
            />
          </button>
          {liveOpen && (
            <div className="space-y-3 border-t border-border px-4 py-3 text-sm leading-relaxed text-foreground">
              {dhikr.context && (
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {dhikr.context}
                </p>
              )}
              <p>{dhikr.explanation}</p>
              {dhikr.merits && <p>{dhikr.merits}</p>}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{dhikr.reference}</span>
                {dhikr.collection && (
                  <SourceInfo
                    sourceTitle={dhikr.collection}
                    sourceReference={dhikr.hadithNumber}
                    sourceAuthor={dhikr.narrator}
                    authenticity={
                      dhikr.authenticityGrade
                        ? `${dhikr.authenticityGrade}${dhikr.authenticityGrader ? " — " + dhikr.authenticityGrader : ""}`
                        : undefined
                    }
                    nature={dhikr.evidenceSummaryFr}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 overflow-y-auto px-3 py-3 sm:px-6">
          <AyahText text={dhikr.arabic} className={ARABIC_SIZE[fontSize]} />

          {showPhonetic && (
            <p
              className={cn(
                "border-t border-border pt-3 italic leading-relaxed text-foreground",
                TEXT_SIZE[fontSize],
              )}
            >
              {dhikr.phonetic}
            </p>
          )}

          {showFrancais && (
            <p
              className={cn(
                "border-t border-border pt-3 leading-relaxed text-foreground",
                TEXT_SIZE[fontSize],
              )}
            >
              {dhikr.translation}
            </p>
          )}
        </div>

        {/* Bottom bar — une seule ligne, LTR : gauche = précédent, droite = suivant */}
        <div className="border-t border-border bg-secondary/50 px-2 py-2 sm:px-3">
          <div className="flex items-stretch gap-2">
            <Link
              to={backTo}
              aria-label={backTo === "/favoris" ? "Retour aux favoris" : "Accueil"}
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-destructive/15 text-destructive transition active:scale-95"
            >
              {backTo === "/favoris" ? <Heart className="size-5" /> : <Home className="size-5" />}
            </Link>
            <button
              onClick={() => go(-1)}
              disabled={idx === 0}
              aria-label="Précédent"
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sky-500/15 text-sky-600 transition disabled:opacity-30 active:scale-95"
            >
              <ChevronLeft className="size-6" />
            </button>

            <button
              onClick={onCount}
              disabled={done}
              aria-label={done ? "Terminé" : "Réciter"}
              className={cn(
                "relative flex h-12 flex-1 items-center justify-center overflow-hidden rounded-2xl text-white shadow-[var(--shadow-elevated)] transition-all active:scale-[0.98]",
                done ? "bg-emerald-700" : "bg-emerald-600",
              )}
            >
              <span
                className="absolute inset-0 bg-white/20 transition-all duration-300"
                style={{
                  transform: `scaleX(${Math.min(1, count / dhikr.repetitions)})`,
                  transformOrigin: "left",
                }}
                aria-hidden
              />
              <span className="relative flex items-center gap-1.5 text-base font-bold tabular-nums sm:text-lg">
                {done ? (
                  <>
                    <Check className="size-5" /> Terminé
                  </>
                ) : (
                  `Réciter ${count} / ${dhikr.repetitions}`
                )}
              </span>
              <span
                role="button"
                tabIndex={0}
                aria-label="Réinitialiser le compteur"
                onClick={(e) => {
                  e.stopPropagation();
                  reset(dhikr.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    reset(dhikr.id);
                  }
                }}
                className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full text-white/70 transition hover:bg-white/15 hover:text-white"
              >
                <RotateCcw className="size-3.5" />
              </span>
            </button>

            <button
              onClick={() => tryGo(1)}
              disabled={idx === list.length - 1}
              aria-label="Suivant"
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sky-500/15 text-sky-600 transition disabled:opacity-30 active:scale-95"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
        </div>

        {/* Warning: dhikr non complété */}
        {warnOpen && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-background/80 p-5 backdrop-blur-sm">
            <div className="surface-card w-full max-w-sm space-y-4 p-5 text-center">
              <h4 className="font-display text-lg font-bold text-foreground">Dhikr incomplet</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Vous ne l'avez récité que <span className="font-bold text-foreground">{count}</span>{" "}
                fois sur <span className="font-bold text-primary">{dhikr.repetitions} fois</span>.
                Il faut le lire{" "}
                <span className="font-bold text-primary">{dhikr.repetitions} fois</span> comme l'a
                enseigné le Prophète ﷺ.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => setWarnOpen(false)}
                  className="h-12 flex-1 rounded-2xl bg-primary font-semibold text-primary-foreground transition active:scale-95"
                >
                  Continuer la récitation
                </button>
                <button
                  onClick={() => {
                    setWarnOpen(false);
                    go(1);
                  }}
                  className="h-12 flex-1 rounded-2xl bg-muted font-semibold text-muted-foreground transition active:scale-95"
                >
                  Passer quand même
                </button>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
