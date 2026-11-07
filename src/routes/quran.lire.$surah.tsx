import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Settings2, Sparkles } from "lucide-react";
import { fetchChapters, fetchVersePage } from "@/lib/mushaf";
import { fetchHamidullahSura } from "@/lib/hamidullah";
import { writeJSON } from "@/lib/storage";
import { usePreferences, type ReadingSize } from "@/lib/preferences";
import { belowSourceInfo } from "@/lib/belowContent";
import { LazyBelow } from "@/components/BelowPanel";
import { QuranDisplayModes } from "@/components/QuranDisplayModes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quran/lire/$surah")({
  head: ({ params }) => ({
    meta: [{ title: `Lire — Sourate ${params.surah}` }],
  }),
  component: LirePage,
});

/** Mode « une āyah par bloc » : l'arabe, puis UNE source choisie dans les
 * Options (Français, Phonétique ou un tafsir). Aucun bouton d'action : pour
 * copier, on sélectionne le texte. */
const ARABIC_SIZE: Record<ReadingSize, string> = {
  normal: "text-lg leading-[1.9]",
  large: "text-xl leading-[2]",
  xlarge: "text-2xl leading-[2.1]",
};

function LirePage() {
  const { surah: surahParam } = Route.useParams();
  const navigate = useNavigate();
  const surah = Number(surahParam);
  const { prefs, updateQuran } = usePreferences();
  const layers = prefs.quran;
  const source = layers.belowSource ?? "none";
  const [optionsOpen, setOptionsOpen] = useState(false);

  const { data: chapters } = useQuery({
    queryKey: ["chapters-fr"],
    queryFn: fetchChapters,
    staleTime: Infinity,
  });
  // Sourate entière en un appel : donne l'arabe (et le français Hamidullah).
  const { data: verses, isPending } = useQuery({
    queryKey: ["hamidullah-sura", surah],
    queryFn: () => fetchHamidullahSura(surah),
    staleTime: Infinity,
  });

  const chapter = chapters?.find((c) => c.id === surah);

  useEffect(() => {
    writeJSON("quran-last-surah", surah);
  }, [surah]);

  // Retour automatique au Mushaf dès que ce mode n'est plus choisi (arabe
  // seul, ou mode « volet ») — sur la page de cette sourate.
  const stay = layers.belowMode === "ayah";
  const showAr = layers.arabic !== false;
  const showFr = !!layers.francais || source === "fr";
  const showPh = !!layers.phonetique || source === "phonetic";
  const tafsirInfo = belowSourceInfo(source);
  const tafsirOn = !!tafsirInfo && tafsirInfo.group === "Tafsir";
  useEffect(() => {
    if (stay) return;
    let cancelled = false;
    fetchVersePage(`${surah}:1`)
      .then((page) => {
        if (!cancelled) navigate({ to: "/quran/page/$page", params: { page: String(page) } });
      })
      .catch(() => {
        /* échec réseau ponctuel — l'utilisateur reste ici */
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stay]);

  const goSurah = (delta: number) => {
    const next = surah + delta;
    if (next < 1 || next > 114) return;
    navigate({ to: "/quran/lire/$surah", params: { surah: String(next) } });
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="relative z-30 shrink-0 border-b border-border/40 bg-card/80 px-3 py-2.5 backdrop-blur-xl">
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
            {chapter ? `${chapter.id}. ${chapter.nameFrench} · ${chapter.nameArabic} · ${chapter.versesCount} āyāt` : `Sourate ${surah}`}
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
          <div className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-card px-4 pb-4 pt-3 shadow-xl">
            <div className="mx-auto max-w-2xl">
            <QuranDisplayModes quran={layers} onChange={(next) => updateQuran(next)} compact />

            <p className="mb-1 mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Taille de lecture
            </p>
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
                  onClick={() => updateQuran({ textSize: key })}
                  aria-pressed={layers.textSize === key}
                  className={cn(
                    "flex-1 rounded-full py-1.5 text-xs font-semibold transition",
                    layers.textSize === key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <Link
              to="/parametres"
              search={{ section: "coran" }}
              onClick={() => setOptionsOpen(false)}
              className="mt-3 inline-block text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              Tous les paramètres
            </Link>
            </div>
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
              return (
                <div key={verseKey} className="surface-card space-y-2.5 rounded-2xl px-4 py-4">
                  <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-muted-foreground">
                        {verseKey}
                      </p>
                    <Link
                      to="/etude/$surah/$ayah"
                      params={{ surah: String(surah), ayah: String(v.ayah) }}
                      aria-label="Étudier cette āyah"
                      className="grid size-7 place-items-center rounded-full text-primary hover:bg-primary/10"
                    >
                      <Sparkles className="size-3.5" />
                    </Link>
                  </div>
                  {showAr && (
                    <p
                      lang="ar"
                      dir="rtl"
                      className={cn("select-text font-arabic font-bold text-foreground", ARABIC_SIZE[layers.textSize])}
                    >
                      {v.arabic}
                    </p>
                  )}
                  {showFr && (
                    <p className="select-text text-[0.95rem] leading-[1.85] text-foreground/90">{v.translation}</p>
                  )}
                  {showPh && <LazyBelow verseKey={verseKey} source="phonetic" size={layers.textSize} />}
                  {tafsirOn && (
                    <div className="border-t border-border/50 pt-2">
                      <p className="mb-1 text-[11px] font-semibold text-muted-foreground">{tafsirInfo?.label}</p>
                      <LazyBelow verseKey={verseKey} source={source} size={layers.textSize} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
