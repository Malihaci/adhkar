import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { BookOpen, ChevronDown, ChevronLeft, ChevronRight, Home, Settings2, Sparkles } from "lucide-react";
import { clampPage, fetchChapters, fetchPageLayout, TOTAL_PAGES } from "@/lib/mushaf";
import { GoToPanel, type NavTab } from "@/components/GoToPanel";
import { fetchHamidullahSura } from "@/lib/hamidullah";
import { writeJSON } from "@/lib/storage";
import { usePreferences, type ReadingSize } from "@/lib/preferences";
import { belowSourceInfo } from "@/lib/belowContent";
import { LazyBelow } from "@/components/BelowPanel";
import { QuranDisplayModes } from "@/components/QuranDisplayModes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quran/lire/$surah")({
  validateSearch: (s: Record<string, unknown>): { p?: number } => {
    const n = Number(s.p);
    return { p: Number.isFinite(n) && n >= 1 ? clampPage(n) : undefined };
  },
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
  const search = Route.useSearch();
  const navigate = useNavigate();
  const surahFromUrl = Number(surahParam);
  const { prefs, updateQuran } = usePreferences();
  const layers = prefs.quran;
  const source = layers.belowSource ?? "none";
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [barHidden, setBarHidden] = useState(false);
  const [navTab, setNavTab] = useState<NavTab | null>(null);
  const lastY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: chapters } = useQuery({
    queryKey: ["chapters-fr"],
    queryFn: fetchChapters,
    staleTime: Infinity,
  });

  /** Page du Mushaf affichée : celle demandée, sinon la 1re page de la sourate. */
  const page = search.p ?? chapters?.find((c) => c.id === surahFromUrl)?.pages[0];

  // Les āyāt de CETTE page du Mushaf (les 15 lignes imprimées), pas la sourate entière.
  const { data: layout, isPending } = useQuery({
    queryKey: ["mushaf-layout", page],
    queryFn: () => fetchPageLayout(page as number),
    enabled: page != null,
    staleTime: Infinity,
  });
  const verses = useMemo(() => {
    const seen = new Set<string>();
    return (layout?.verses ?? [])
      .filter((v) => (seen.has(v.key) ? false : (seen.add(v.key), true)))
      .sort((x, y) => x.surah - y.surah || x.ayah - y.ayah);
  }, [layout]);
  const surahsOnPage = useMemo(() => Array.from(new Set(verses.map((v) => v.surah))), [verses]);

  // Traduction française : une requête par sourate présente sur la page.
  const trQueries = useQueries({
    queries: surahsOnPage.map((n) => ({
      queryKey: ["hamidullah-sura", n],
      queryFn: () => fetchHamidullahSura(n),
      staleTime: Infinity,
    })),
  });
  const translationOf = (surah: number, ayah: number) =>
    trQueries[surahsOnPage.indexOf(surah)]?.data?.find((a) => a.ayah === ayah)?.translation ?? "";

  const firstSurah = verses[0]?.surah ?? surahFromUrl;
  const chapter = chapters?.find((c) => c.id === firstSurah);
  const pageChapters = surahsOnPage.map((n) => chapters?.find((c) => c.id === n)).filter(Boolean);

  useEffect(() => {
    if (verses[0]) writeJSON("quran-last-surah", verses[0].surah);
  }, [verses]);
  useEffect(() => {
    if (page == null) return;
    try {
      window.localStorage.setItem("quran-last-page", String(page));
      window.localStorage.setItem("quran-last-read-at", String(Date.now()));
    } catch {
      /* stockage indisponible */
    }
    scrollRef.current?.scrollTo({ top: 0 });
    setBarHidden(false);
    lastY.current = 0;
  }, [page]);

  // Retour automatique au Mushaf dès que ce mode n'est plus choisi (arabe
  // seul, ou mode « volet ») — sur la même page.
  const stay = layers.belowMode === "ayah";
  const showAr = layers.arabic !== false;
  const showFr = !!layers.francais || source === "fr";
  const showPh = !!layers.phonetique || source === "phonetic";
  const tafsirInfo = belowSourceInfo(source);
  const tafsirOn = !!tafsirInfo && tafsirInfo.group === "Tafsir";
  useEffect(() => {
    if (stay || page == null) return;
    navigate({ to: "/quran/page/$page", params: { page: String(page) } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stay]);

  const openMushaf = () => {
    // Repasse en mode Mushaf : l'effet ci-dessus ouvre la même page.
    updateQuran({ belowMode: "panel" });
  };

  const goPage = (p: number) => {
    const target = clampPage(p);
    navigate({
      to: "/quran/lire/$surah",
      params: { surah: String(firstSurah) },
      search: { p: target },
    });
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="relative z-30 shrink-0 border-b border-border/40 bg-card/80 px-3 py-2.5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-2">
          <HeaderChip
            label={
              pageChapters.length
                ? pageChapters.map((c) => c!.nameFrench).join(" · ")
                : chapter
                  ? chapter.nameFrench
                  : `Sourate ${firstSurah}`
            }
            ariaLabel="Changer de sourate"
            onClick={() => setNavTab("surah")}
            grow
          />
          <HeaderChip
            label={`Juz ${verses[0]?.juz ?? ""}`}
            ariaLabel="Changer de juz"
            onClick={() => setNavTab("juz")}
          />
          <HeaderChip
            label={`Page ${page ?? ""}`}
            ariaLabel="Changer de page"
            onClick={() => setNavTab("page")}
          />
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

      <div
        ref={scrollRef}
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
          {isPending || page == null ? (
            <p className="py-16 text-center text-sm text-muted-foreground">Chargement…</p>
          ) : !verses.length ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Lecture indisponible pour le moment.
            </p>
          ) : (
            verses.map((v) => {
              const verseKey = v.key;
              const surah = v.surah;
              const sName = v.ayah === 1 ? chapters?.find((c) => c.id === surah) : undefined;
              return (
                <div key={verseKey} className="space-y-3">
                  {sName && (
                    <p className="pt-2 text-center text-xs font-semibold tracking-wide text-muted-foreground">
                      {sName.id}. {sName.nameFrench} · <span lang="ar" className="font-arabic text-sm">{sName.nameArabic}</span>
                    </p>
                  )}
                <div className="surface-card space-y-2.5 rounded-2xl px-4 py-4">
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
                    <p className="select-text text-[0.95rem] leading-[1.85] text-foreground/90">{translationOf(v.surah, v.ayah).replace(/\s*\[\d+\]/g, "")}</p>
                  )}
                  {showPh && <LazyBelow verseKey={verseKey} source="phonetic" size={layers.textSize} />}
                  {tafsirOn && (
                    <div className="border-t border-border/50 pt-2">
                      <p className="mb-1 text-[11px] font-semibold text-muted-foreground">{tafsirInfo?.label}</p>
                      <LazyBelow verseKey={verseKey} source={source} size={layers.textSize} />
                    </div>
                  )}
                </div>
                </div>
              );
            })
          )}
          {verses.length > 0 && (
            <button
              type="button"
              disabled={(page ?? 1) >= TOTAL_PAGES}
              onClick={() => goPage((page ?? 1) + 1)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary/10 py-3 text-sm font-semibold text-primary disabled:opacity-30"
            >
              Page suivante
              <ChevronRight className="size-4" />
            </button>
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

      {navTab && page != null && (
        <GoToPanel
          initialTab={navTab}
          juz={verses[0]?.juz}
          hizb={verses[0]?.hizb}
          rub={verses[0]?.rub}
          surahId={chapter?.id}
          page={page}
          chapters={chapters ?? []}
          reciterId={layers.reciterId}
          onClose={() => setNavTab(null)}
          onGo={(p) => goPage(p)}
        />
      )}

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
            disabled={(page ?? 1) <= 1}
            onClick={() => goPage((page ?? 1) - 1)}
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
            disabled={(page ?? 1) >= TOTAL_PAGES}
            onClick={() => goPage((page ?? 1) + 1)}
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

/** Capsule de l'en-tête : sourate, juz ou page — ouvre « Aller à… ». */
function HeaderChip({
  label,
  ariaLabel,
  onClick,
  grow,
}: {
  label: string;
  ariaLabel: string;
  onClick: () => void;
  grow?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-9 min-w-0 items-center justify-center gap-1 rounded-full border border-border bg-background/70 px-3 text-sm font-semibold text-foreground active:scale-95",
        grow && "flex-1",
      )}
    >
      <span className="truncate">{label}</span>
      <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
    </button>
  );
}
