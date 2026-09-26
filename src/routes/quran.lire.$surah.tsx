import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Heart, Pause, Play, Settings2, Share2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { fetchChapters, verseAudioUrl, defaultReciter } from "@/lib/mushaf";
import { fetchHamidullahSura } from "@/lib/hamidullah";
import { useFavorites, useLocalState } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quran/lire/$surah")({
  head: ({ params }) => ({
    meta: [{ title: `Lire — Sourate ${params.surah}` }],
  }),
  component: LirePage,
});

interface Layers {
  arabic: boolean;
  francais: boolean;
  phonetique: boolean;
}

const DEFAULT_LAYERS: Layers = { arabic: true, francais: true, phonetique: false };

function LirePage() {
  const { surah: surahParam } = Route.useParams();
  const navigate = useNavigate();
  const surah = Number(surahParam);
  const [layers, setLayers] = useLocalState<Layers>("adhkar:reading-layers", DEFAULT_LAYERS);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [audioEl] = useState(() => (typeof Audio !== "undefined" ? new Audio() : null));

  const { data: chapters } = useQuery({
    queryKey: ["chapters-fr"],
    queryFn: fetchChapters,
    staleTime: Infinity,
  });
  const { data: verses, isPending } = useQuery({
    queryKey: ["hamidullah-sura", surah],
    queryFn: () => fetchHamidullahSura(surah),
    staleTime: Infinity,
  });

  const chapter = chapters?.find((c) => c.id === surah);

  const goSurah = (delta: number) => {
    const next = surah + delta;
    if (next < 1 || next > 114) return;
    navigate({ to: "/quran/lire/$surah", params: { surah: String(next) } });
  };

  const toggleAudio = (verseKey: string) => {
    if (!audioEl) return;
    if (playingKey === verseKey) {
      audioEl.pause();
      setPlayingKey(null);
      return;
    }
    audioEl.src = verseAudioUrl(defaultReciter, verseKey);
    audioEl.onended = () => setPlayingKey(null);
    audioEl.play().catch(() => setPlayingKey(null));
    setPlayingKey(verseKey);
  };

  const shareAyah = async (verseKey: string, arabic: string, translation: string) => {
    const [s, a] = verseKey.split(":");
    const url = new URL(`/etude/${s}/${a}`, window.location.origin);
    const label = chapter ? `${chapter.nameFrench} — ${verseKey}` : verseKey;
    const text = [arabic, translation, label, url.toString()].filter(Boolean).join("\n\n");
    try {
      if (navigator.share) await navigator.share({ text, url: url.toString() });
      else await navigator.clipboard.writeText(text);
    } catch {
      /* annulé */
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="shrink-0 border-b border-border/40 bg-card/80 px-3 py-2.5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <Link
            to="/"
            aria-label="Accueil"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <button
            onClick={() => goSurah(-1)}
            disabled={surah <= 1}
            aria-label="Sourate précédente"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-foreground">
            {chapter ? `${chapter.nameFrench} · ${chapter.nameArabic}` : `Sourate ${surah}`}
          </p>
          <button
            onClick={() => goSurah(1)}
            disabled={surah >= 114}
            aria-label="Sourate suivante"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
          <button
            onClick={() => setOptionsOpen((v) => !v)}
            aria-label="Options d'affichage"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted"
          >
            <Settings2 className="size-[18px]" />
          </button>
        </div>
        {optionsOpen && (
          <div className="mx-auto mt-2 flex max-w-2xl flex-wrap gap-2 px-1">
            {(
              [
                ["arabic", "Arabe"],
                ["francais", "Français"],
                ["phonetique", "Phonétique"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setLayers((prev) => ({ ...prev, [key]: !prev[key] }))}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                  layers[key]
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-3 px-4 py-4">
          {isPending ? (
            <p className="py-16 text-center text-sm text-muted-foreground">Chargement…</p>
          ) : !verses?.length ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Lecture indisponible pour le moment.
            </p>
          ) : (
            verses.map((v) => {
              const verseKey = `${surah}:${v.ayah}`;
              const fav = isFavorite("ayah", verseKey);
              const playing = playingKey === verseKey;
              return (
                <div key={verseKey} className="surface-card space-y-2.5 rounded-2xl px-4 py-4">
                  <p className="text-xs font-semibold text-muted-foreground">{verseKey}</p>
                  {layers.arabic && (
                    <p
                      lang="ar"
                      dir="rtl"
                      className="font-arabic text-xl font-bold leading-[2] text-foreground"
                    >
                      {v.arabic}
                    </p>
                  )}
                  {layers.francais && (
                    <p className="text-[0.95rem] leading-[1.85] text-foreground/90">
                      {v.translation}
                    </p>
                  )}
                  {layers.phonetique && (
                    <p className="rounded-xl bg-muted/60 px-3 py-2 text-xs italic text-muted-foreground">
                      Phonétique indisponible — aucune source complète et fiable identifiée pour
                      l'instant.
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 border-t border-border/40 pt-2.5">
                    <button
                      onClick={() => toggleAudio(verseKey)}
                      className="flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium text-foreground"
                    >
                      {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                      Écouter
                    </button>
                    <button
                      onClick={() => toggleFavorite("ayah", verseKey)}
                      aria-pressed={fav}
                      className="flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium text-foreground"
                    >
                      <Heart className={cn("size-3.5", fav && "fill-gold text-gold")} />
                    </button>
                    <button
                      onClick={() => shareAyah(verseKey, v.arabic, v.translation)}
                      className="flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium text-foreground"
                    >
                      <Share2 className="size-3.5" />
                    </button>
                    <Link
                      to="/etude/$surah/$ayah"
                      params={{ surah: String(surah), ayah: String(v.ayah) }}
                      className="ml-auto flex h-8 items-center gap-1 rounded-full bg-primary/10 px-3 text-xs font-semibold text-primary"
                    >
                      <Sparkles className="size-3.5" /> Étudier
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
