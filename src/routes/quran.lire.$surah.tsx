import { useEffect, useRef, useState, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ChevronLeft, ChevronRight, Home, Settings2, Sparkles } from "lucide-react";
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
  const [barHidden, setBarHidden] = useState(false);
  const lastY = useRef(0);

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

  const openMushaf = () => {
    // Repasse en mode Mushaf puis ouvre la page de cette sourate.
    updateQuran({ belowMode: "panel" });
  };

  const goSurah = (delta: number) => {
    const next = surah + delta;
    if (next < 1 || next > 114) return;
    navigate({ to: "/quran/lire/$surah", params: { surah: String(next) } });
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="relative z-30 shrink-0 border-b border-border/40 bg-card/80 px-3 py-2.5 backdrop-blur-xl">
        <p className="mx-auto max-w-2xl truncate text-center text-sm font-semibold text-foreground">
          {chapter ? `${chapter.id}. ${chapter.nameFrench} · ${chapter.nameArabic} · ${chapter.versesCount} āyāt` : `Sourate ${surah}`}
        </p>
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

      <div
        className="min-h-0 flex-1 overflow-y-auto"
        onScroll={(e) => {
          const y = e.currentTarget.scrollTop;
          const dy = y - lastY.current;
          if (Math.abs(dy) > 8) {
            setBarHidden(dy > 0 && y > 80);
            lastY.current = y;
          }
        }}
      >
        <div className="mx-auto max-w-2xl space-y-3 px-4 py-4 pb-28">
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
                    <p className="select-text text-[0.95rem] leading-[1.85] text-foreground/90">{v.translation.replace(/\s*\[\d+\]/g, "")}</p>
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
          <Link
            to="/parametres"
            search={{ section: "coran" }}
            className="mt-2 flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm"
          >
            <span className="font-semibold text-foreground">Paramètres du Coran</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        </div>
      </div>

      <nav
        aria-label="Commandes"
        style={{ bottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
        className={cn(
          "fixed inset-x-3 z-30 mx-auto max-w-md rounded-[1.35rem] border border-border/60 bg-card/85 px-1.5 py-1 shadow-[0_8px_24px_-8px_rgba(0,0,0,.35)] backdrop-blur-xl transition-all duration-300",
          barHidden && !optionsOpen && "pointer-events-none translate-y-[160%] opacity-0",
        )}
      >
        <div className="flex items-center justify-around">
          <LireBtn to="/" label="Accueil" icon={<Home className="size-[19px]" strokeWidth={1.75} />} />
          <LireBtn
            label="Précédente"
            disabled={surah <= 1}
            onClick={() => goSurah(-1)}
            icon={<ChevronLeft className="size-[19px]" strokeWidth={1.75} />}
          />
          <LireBtn
            label="Mushaf"
            onClick={openMushaf}
            icon={<BookOpen className="size-[19px]" strokeWidth={1.75} />}
            accent
          />
          <LireBtn
            label="Suivante"
            disabled={surah >= 114}
            onClick={() => goSurah(1)}
            icon={<ChevronRight className="size-[19px]" strokeWidth={1.75} />}
          />
          <LireBtn
            label="Options"
            onClick={() => setOptionsOpen((v) => !v)}
            icon={<Settings2 className="size-[19px]" strokeWidth={1.75} />}
          />
        </div>
      </nav>
    </div>
  );
}

/** Bouton compact de la barre : icône + légende minuscule. */
function LireBtn({
  label,
  icon,
  onClick,
  to,
  disabled,
  accent,
}: {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  to?: "/";
  disabled?: boolean;
  accent?: boolean;
}) {
  const cls = cn(
    "flex w-14 flex-col items-center gap-0.5 rounded-xl py-1 transition active:scale-95 active:bg-muted disabled:opacity-30",
    accent ? "text-primary" : "text-muted-foreground",
  );
  const inner = (
    <>
      <span className={accent ? "text-primary" : "text-foreground/80"}>{icon}</span>
      <span className="text-[9px] font-medium leading-none">{label}</span>
    </>
  );
  return to ? (
    <Link to={to} aria-label={label} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className={cls}>
      {inner}
    </button>
  );
}
