import { useEffect, useRef, useState } from "react";
import {
  Heart,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Home,
  Check,
  Leaf,
  MoreHorizontal,
  Pause,
  Play,
  Share2,
  X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AyahText } from "@/components/AyahText";
import { SourceInfo } from "@/components/SourceInfo";

import type { Dhikr } from "@/data/adhkar";
import { useDailyProgress, useFavorites, getLastReadIndex } from "@/lib/storage";
import { usePreferences, type ReadingSize } from "@/lib/preferences";
import { shareDhikr } from "@/lib/share";
import { useDhikrVerseAudio } from "@/lib/dhikrAudio";
import { GHAMIDI_UNAVAILABLE_REASON } from "@/lib/adhkarGhamidi";
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
   * `idx` démarre TOUJOURS à `initialIndex ?? 0` — jamais une lecture de
   * `localStorage` dans l'initialiseur : cette app est rendue côté serveur
   * (TanStack Start), et le serveur n'a pas accès au stockage du navigateur.
   * Un initialiseur paresseux lisant la position sauvegardée y renverrait
   * une AUTRE valeur que le rendu serveur (0) dès le tout premier rendu
   * client, avant même l'hydratation — React détecte alors un mismatch et
   * rejette l'arbre serveur (erreur "Hydration failed", vu en direct sur un
   * rechargement complet de /matin). La restauration doit donc rester dans
   * un effet (post-hydratation, comme `useLocalState`), mais SANS reproduire
   * l'ancienne course avec l'effet de persistance : voir l'effet unique
   * ci-dessous qui gère restauration ET persistance ensemble.
   */
  const [idx, setIdx] = useState(initialIndex ?? 0);
  const { prefs } = usePreferences();
  const showFrancais = prefs.adhkar.francais;
  const showPhonetic = prefs.adhkar.phonetique;
  const fontSize = prefs.adhkar.textSize;
  /** Préférences d'affichage/taille/audio : centralisées dans ⚙️ Paramètres
   * > Adhkār (chantier "Paramètres centralisés") — cet écran ne les
   * reconfigure plus lui-même, voir §11 mission ("le menu ⋯ contient
   * uniquement les actions propres au dhikr"). */
  const [liveOpen, setLiveOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [warnOpen, setWarnOpen] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // La liste peut rétrécir (favori retiré) : rester dans les bornes
  useEffect(() => {
    setIdx((i) => Math.max(0, Math.min(i, list.length - 1)));
  }, [list.length]);

  const dhikr = list[Math.min(idx, list.length - 1)];
  /** "Version actuelle" (§13 mission) — inchangée : verseKeys exacts, jamais
   * un index de tableau, voir src/lib/dhikrAudio.ts. Le profil "ghamdi"
   * (§14 mission) reste honnêtement indisponible tant qu'aucun fichier
   * autorisé n'est fourni (src/lib/adhkarGhamidi.ts) — jamais de repli
   * silencieux vers l'autre voix. "Lecture continue" (§19) : uniquement en
   * fin NATURELLE de l'audio, jamais sur une pause manuelle.
   */
  const usingAfasyProfile = prefs.adhkar.audioProfile === "afasy";
  const autoAdvanceRef = useRef(false);
  const dhikrAudio = useDhikrVerseAudio(
    usingAfasyProfile ? dhikr?.verseKeys : undefined,
    () => {
      if (prefs.adhkar.continuous && idx < list.length - 1) {
        autoAdvanceRef.current = true;
        setIdx((i) => Math.min(list.length - 1, i + 1));
      }
    },
    prefs.adhkar.speed,
  );
  useEffect(() => {
    if (!autoAdvanceRef.current) return;
    autoAdvanceRef.current = false;
    if (dhikrAudio.available) dhikrAudio.toggle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  /**
   * Restauration (une seule fois, post-hydratation) PUIS persistance de la
   * position — dans le MÊME effet, pour ne jamais laisser la persistance
   * écrire une valeur transitoire pendant qu'une restauration est en cours
   * (§15/§19 mission : un aller-retour par ⚙️ Paramètres ne doit jamais
   * perdre le dhikr courant). Au tout premier passage, si une position
   * sauvegardée diffère de l'état initial (0), on l'applique et on sort
   * SANS persister cette valeur transitoire — l'effet se redéclenche
   * aussitôt avec le bon `idx` et persiste alors normalement.
   */
  const restoredRef = useRef(false);
  useEffect(() => {
    if (!restoredRef.current) {
      restoredRef.current = true;
      if (persist && typeof initialIndex !== "number") {
        const saved = getLastReadIndex(category);
        if (saved !== null && saved >= 0 && saved < list.length && saved !== idx) {
          setIdx(saved);
          return;
        }
      }
    }
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
        {/* Header épuré (§9 mission) : plus de Play/Favori/Partager/Aa
            permanents — seulement le titre (jusqu'à 2 lignes avant de
            tronquer) et deux icônes discrètes (feuille = "Vivre ce dhikr",
            ⋯ = actions du dhikr). Affichage/taille/audio vivent désormais
            uniquement dans ⚙️ Paramètres > Adhkār. */}
        <header className="flex items-start justify-between gap-2 border-b border-border px-3 py-2.5 sm:px-4">
          <div className="min-w-0 flex-1">
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
            <h1 className="line-clamp-2 font-display text-base font-semibold leading-snug text-foreground sm:text-lg">
              {dhikr.title}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => setLiveOpen(true)}
              aria-label="Vivre ce dhikr"
              className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-primary"
            >
              <Leaf className="size-[18px]" />
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Plus d'actions"
              className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <MoreHorizontal className="size-[18px]" />
            </button>
          </div>
        </header>

        {audioUnavailable && (
          <p className="bg-muted/40 px-3 py-1.5 text-center text-[11px] text-muted-foreground">
            {usingAfasyProfile ? "Audio indisponible pour ce dhikr." : GHAMIDI_UNAVAILABLE_REASON}
          </p>
        )}

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

        {/* Footer fixe (§12 mission) : Accueil · Précédent · ▶/⏸ (audio du
            dhikr affiché) · Réciter X/Y (compteur, zone tactile principale)
            · Suivant — navigation LTR normale pour l'Adhkār (§31). */}
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
              onClick={() => {
                if (dhikrAudio.available) {
                  dhikrAudio.toggle();
                  return;
                }
                setAudioUnavailable(true);
                window.setTimeout(() => setAudioUnavailable(false), 2500);
              }}
              aria-label={dhikrAudio.playing ? "Mettre en pause" : "Écouter ce dhikr"}
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary transition active:scale-95"
            >
              {dhikrAudio.playing ? <Pause className="size-5" /> : <Play className="size-5" />}
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

        {/* Petite feuille "Vivre ce dhikr" (§10 mission) — même langage
            visuel que "Vivre cette page" côté Coran : une vraie icône
            vectorielle (Leaf), jamais d'emoji comme asset final, ouvrant une
            feuille compacte plutôt qu'un gros bandeau permanent. */}
        {liveOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm"
            onClick={() => setLiveOpen(false)}
          >
            <div
              className="flex max-h-[75dvh] w-full flex-col rounded-t-3xl border-t border-border bg-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <Leaf className="size-5 text-primary" /> Vivre ce dhikr
                </h2>
                <button
                  onClick={() => setLiveOpen(false)}
                  aria-label="Fermer"
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-border"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 pb-5 text-sm leading-relaxed text-foreground">
                {dhikr.context && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {dhikr.context}
                  </p>
                )}
                <p>{dhikr.explanation}</p>
                {dhikr.merits && <p>{dhikr.merits}</p>}
                <div className="flex items-center gap-1 border-t border-border pt-3 text-xs text-muted-foreground">
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
            </div>
          </div>
        )}

        {/* ⋯ — uniquement les actions propres au dhikr (§11 mission) :
            Favori, Partager, Source. Taille/Français/Phonétique/Audio ne
            sont plus jamais répétés ici, voir ⚙️ Paramètres > Adhkār. */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          >
            <div
              className="w-full rounded-t-3xl border-t border-border bg-card p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  toggle("dhikr", dhikr.id);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-muted"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                  <Heart className={cn("size-4", fav && "fill-gold text-gold")} />
                </span>
                <span className="text-sm font-medium text-foreground">
                  {fav ? "Retirer des favoris" : "Ajouter aux favoris"}
                </span>
              </button>
              <button
                onClick={() => {
                  shareDhikr(dhikr, idx);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-muted"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                  <Share2 className="size-4" />
                </span>
                <span className="text-sm font-medium text-foreground">Partager</span>
              </button>
              {dhikr.collection ? (
                <div className="flex items-center gap-3 rounded-xl px-3 py-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                    <Leaf className="size-4 opacity-0" aria-hidden />
                  </span>
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
                  <span className="text-xs text-muted-foreground">{dhikr.reference}</span>
                </div>
              ) : (
                <p className="px-3 py-3 text-xs text-muted-foreground">{dhikr.reference}</p>
              )}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
