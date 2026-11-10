import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { LazyBelow } from "@/components/BelowPanel";
import type { NavTab } from "@/components/GoToPanel";
import { fetchHamidullahSura } from "@/lib/hamidullah";
import { belowSourceInfo } from "@/lib/belowContent";
import { TOTAL_PAGES } from "@/lib/mushaf";
import type { ReadingSize } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const ARABIC_SIZE: Record<ReadingSize, string> = {
  normal: "text-lg leading-[1.9]",
  large: "text-xl leading-[2]",
  xlarge: "text-2xl leading-[2.1]",
};

type AyahVerse = { key: string; surah: number; ayah: number; arabic: string; juz?: number };
type Chap = { id: number; nameFrench: string; nameArabic: string };

/** Mode « āyah par āyah » : les āyāt de la page du Mushaf en cartes, à
 * l'intérieur de la page Mushaf elle-même (même barre du bas, même récitation,
 * mêmes options). Toucher une carte sélectionne l'āyah. */
export function AyahCards({
  verses,
  chapters,
  page,
  quran,
  selected,
  playingKey,
  onSelect,
  onOpenNav,
  onGoPage,
}: {
  verses: AyahVerse[];
  chapters: Chap[];
  page: number;
  quran: {
    arabic?: boolean;
    francais?: boolean;
    phonetique?: boolean;
    belowSource?: string;
    textSize: ReadingSize;
  };
  selected: string[];
  playingKey?: string;
  onSelect: (key: string) => void;
  onOpenNav: (tab: NavTab) => void;
  onGoPage: (page: number) => void;
}) {
  const source = quran.belowSource ?? "none";
  const showAr = quran.arabic !== false;
  const showFr = !!quran.francais || source === "fr";
  const showPh = !!quran.phonetique || source === "phonetic";
  const tafsirInfo = belowSourceInfo(source as never);
  const tafsirOn = !!tafsirInfo && tafsirInfo.group === "Tafsir";

  const list = useMemo(() => {
    const seen = new Set<string>();
    return verses
      .filter((v) => (seen.has(v.key) ? false : (seen.add(v.key), true)))
      .sort((x, y) => x.surah - y.surah || x.ayah - y.ayah);
  }, [verses]);
  const surahs = useMemo(() => Array.from(new Set(list.map((v) => v.surah))), [list]);
  const trQueries = useQueries({
    queries: showFr
      ? surahs.map((n) => ({
          queryKey: ["hamidullah-sura", n],
          queryFn: () => fetchHamidullahSura(n),
          staleTime: Infinity,
        }))
      : [],
  });
  const translationOf = (s: number, a: number) =>
    trQueries[surahs.indexOf(s)]?.data?.find((x) => x.ayah === a)?.translation ?? "";

  const names = surahs.map((n) => chapters.find((c) => c.id === n)?.nameFrench).filter(Boolean);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-32 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="mb-3 flex items-center gap-2">
        <Chip label={names.join(" · ") || `Sourate ${surahs[0] ?? ""}`} aria="Changer de sourate" onClick={() => onOpenNav("surah")} grow />
        <Chip label={`Juz ${list[0]?.juz ?? ""}`} aria="Changer de juz" onClick={() => onOpenNav("juz")} />
        <Chip label={`Page ${page}`} aria="Changer de page" onClick={() => onOpenNav("page")} />
      </div>

      <div className="space-y-3">
        {list.map((v) => {
          const sName = v.ayah === 1 ? chapters.find((c) => c.id === v.surah) : undefined;
          const isSel = selected.includes(v.key);
          const isPlaying = playingKey === v.key;
          return (
            <div key={v.key} className="space-y-3">
              {sName && (
                <p className="pt-2 text-center text-xs font-semibold tracking-wide text-muted-foreground">
                  {sName.id}. {sName.nameFrench} ·{" "}
                  <span lang="ar" className="font-arabic text-sm">
                    {sName.nameArabic}
                  </span>
                </p>
              )}
              <div
                onClick={() => onSelect(v.key)}
                className={cn(
                  "surface-card space-y-2.5 rounded-2xl px-4 py-4 transition",
                  isSel && "ring-2 ring-primary/50",
                  isPlaying && "bg-[#8fd1ae]/20",
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground">{v.key}</p>
                  <Link
                    to="/etude/$surah/$ayah"
                    params={{ surah: String(v.surah), ayah: String(v.ayah) }}
                    onClick={(e) => e.stopPropagation()}
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
                    className={cn("select-text font-arabic font-bold text-foreground", ARABIC_SIZE[quran.textSize])}
                  >
                    {v.arabic}
                  </p>
                )}
                {showFr && (
                  <p className="select-text text-[0.95rem] leading-[1.85] text-foreground/90">
                    {translationOf(v.surah, v.ayah).replace(/\s*\[\d+\]/g, "")}
                  </p>
                )}
                {showPh && <LazyBelow verseKey={v.key} source="phonetic" size={quran.textSize} />}
                {tafsirOn && (
                  <div className="border-t border-border/50 pt-2">
                    <p className="mb-1 text-[11px] font-semibold text-muted-foreground">{tafsirInfo?.label}</p>
                    <LazyBelow verseKey={v.key} source={source as never} size={quran.textSize} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {list.length > 0 && (
        <button
          type="button"
          disabled={page >= TOTAL_PAGES}
          onClick={() => onGoPage(page + 1)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary/10 py-3 text-sm font-semibold text-primary disabled:opacity-30"
        >
          Page suivante
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  );
}

function Chip({ label, aria, onClick, grow }: { label: string; aria: string; onClick: () => void; grow?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={aria}
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
