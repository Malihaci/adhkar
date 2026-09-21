import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Home,
  Loader2,
  Pause,
  Play,
  Search,
  Settings2,
  Share2,
  X,
} from "lucide-react";
import {
  RECITERS,
  TOTAL_PAGES,
  clampPage,
  fetchChapters,
  fetchJuzVerseKeys,
  fetchPageLayout,
  fetchSurahVerseKeys,
  getReciter,
  keysToEndOfQuran,
  verseAudioUrl,
  type PageVerse,
} from "@/lib/mushaf";
import { Basmala } from "@/components/AyahText";
import { cn } from "@/lib/utils";

interface Search {
  r?: string;
  sel?: string;
}

export const Route = createFileRoute("/quran/page/$page")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    r: typeof s.r === "string" ? s.r : undefined,
    sel: typeof s.sel === "string" ? s.sel : undefined,
  }),
  head: ({ params }) => {
    const title = `Coran — page ${params.page} / 604 (Mushaf de Médine)`;
    const description =
      "Lisez le Mushaf de Médine page par page, sélectionnez des versets, écoutez la récitation de votre choix et partagez le lien.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: MushafPage,
});

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const toArabic = (n: number) =>
  String(n)
    .split("")
    .map((d) => ARABIC_DIGITS[Number(d)])
    .join("");

function parseSelection(sel: string | undefined, verses: PageVerse[]): string[] {
  if (!sel) return [];
  const keys = verses.map((v) => v.key);
  if (sel.includes("-")) {
    const [a, b] = sel.split("-");
    const i = keys.indexOf(a);
    const j = keys.indexOf(b);
    if (i >= 0 && j >= 0)
      return keys.slice(Math.min(i, j), Math.max(i, j) + 1);
    return [];
  }
  return keys.includes(sel) ? [sel] : [];
}

function MushafPage() {
  const { page: pageParam } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const page = clampPage(Number(pageParam));
  const reciterId = getReciter(search.r).id;

  const { data: layout, isPending } = useQuery({
    queryKey: ["mushaf-layout", page],
    queryFn: () => fetchPageLayout(page),
    staleTime: Infinity,
  });
  const verses = layout?.verses;
  const lines = layout?.lines;
  const { data: chapters } = useQuery({
    queryKey: ["chapters-fr"],
    queryFn: fetchChapters,
    staleTime: Infinity,
  });

  const [selected, setSelected] = useState<string[]>([]);
  const [showNav, setShowNav] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  // Sélection venant du lien partagé
  useEffect(() => {
    if (verses) setSelected(parseSelection(search.sel, verses));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verses, search.sel]);

  useEffect(() => {
    try {
      localStorage.setItem("quran-last-page", String(page));
    } catch {
      /* quota */
    }
  }, [page]);

  /* ------------------------------------------------------------- audio */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<string[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loop, setLoop] = useState(false);
  const [ayahRepeat, setAyahRepeat] = useState(1); // 1,3,5 ou 0 = ∞
  const [selRepeat, setSelRepeat] = useState(1); // 1,3,5 ou 0 = ∞
  const [speed, setSpeed] = useState(1); // 1 ou 1.25
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [autoTurn, setAutoTurn] = useState(false);
  const current = playing || queue.length ? queue[qIndex] : undefined;

  const load = useCallback(
    (key: string, autoplay = true) => {
      const el = audioRef.current;
      if (!el || !key) return;
      el.src = verseAudioUrl(reciterId, key);
      el.load();
      el.playbackRate = speed;
      if (autoplay) el.play().catch(() => setPlaying(false));
    },
    [reciterId, speed],
  );

  // la vitesse reste active d'une ayah à l'autre
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  /** Construit la file en appliquant la répétition par ayah puis par sélection. */
  const start = (keys: string[], opts?: { turnPages?: boolean }) => {
    if (!keys.length) return;
    const perAyah = ayahRepeat > 1 ? ayahRepeat : 1;
    let full = keys.flatMap((k) => Array.from({ length: perAyah }, () => k));
    if (selRepeat > 1) {
      full = Array.from({ length: selRepeat }, () => full).flat();
    }
    setLoop(selRepeat === 0);
    setAutoTurn(!!opts?.turnPages);
    setQueue(full);
    setQIndex(0);
    setPlaying(true);
    setOptionsOpen(false);
    load(full[0]);
  };

  const toggle = () => {
    const el = audioRef.current;
    if (!el || !queue.length) return;
    if (el.paused) {
      el.play().catch(() => setPlaying(false));
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const step = (d: number) => {
    const next = qIndex + d;
    if (next < 0 || next >= queue.length) return;
    setQIndex(next);
    load(queue[next], true);
    setPlaying(true);
  };

  // changement de récitateur en cours de lecture
  useEffect(() => {
    if (queue.length && audioRef.current) {
      const wasPlaying = playing;
      load(queue[qIndex], wasPlaying);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reciterId]);

  /** Tourne la page quand la récitation quitte la page affichée. */
  const followKey = (key: string) => {
    if (!autoTurn || !verses?.length) return;
    if (verses.some((v) => v.key === key)) return;
    const [s, a] = key.split(":").map(Number);
    const last = verses[verses.length - 1];
    const forward =
      s > last.surah || (s === last.surah && a > last.ayah);
    navigate({
      to: "/quran/page/$page",
      params: { page: String(clampPage(page + (forward ? 1 : -1))) },
      search: (prev) => ({ ...prev, sel: undefined }),
      replace: true,
    });
  };

  const goTo = (i: number) => {
    setQIndex(i);
    load(queue[i]);
    followKey(queue[i]);
  };

  const onEnded = () => {
    if (ayahRepeat === 0) {
      load(queue[qIndex]); // ∞ sur l'ayah en cours
      return;
    }
    if (qIndex + 1 < queue.length) goTo(qIndex + 1);
    else if (loop) goTo(0);
    else {
      setPlaying(false);
      setProgress(0);
    }
  };


  /* --------------------------------------------------------- sélection */
  const toggleVerse = (key: string) => {
    if (!verses) return;
    const keys = verses.map((v) => v.key);
    setSelected((prev) => {
      if (!prev.length) return [key];
      if (prev.includes(key))
        return prev.length === 1 ? [] : prev.filter((k) => k !== key);
      const idxs = [...prev, key].map((k) => keys.indexOf(k));
      const min = Math.min(...idxs);
      const max = Math.max(...idxs);
      return keys.slice(min, max + 1); // versets consécutifs
    });
  };

  const selLabel =
    selected.length === 0
      ? ""
      : selected.length === 1
        ? `Ayah ${selected[0]} sélectionnée`
        : `Ayat ${selected[0]}–${selected[selected.length - 1]} sélectionnées`;

  const setSearchParam = (patch: Search) =>
    navigate({
      to: "/quran/page/$page",
      params: { page: String(page) },
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,
    });

  /* ------------------------------------------------------------ partage */
  const buildLink = (sel?: string) => {
    const url = new URL(
      `/quran/page/${page}`,
      typeof window !== "undefined" ? window.location.origin : "https://adhkari-daily-guide.lovable.app",
    );
    url.searchParams.set("r", reciterId);
    if (sel) url.searchParams.set("sel", sel);
    return url.toString();
  };

  const share = async (sel?: string) => {
    const link = buildLink(sel);
    try {
      if (navigator.share) await navigator.share({ url: link, title: `Coran — page ${page}` });
      else {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      /* annulé */
    }
  };

  const selKey =
    selected.length > 1
      ? `${selected[0]}-${selected[selected.length - 1]}`
      : selected[0];

  /* ------------------------------------------------------------ sourate */
  const surahOnPage = verses?.[0]?.surah ?? 1;
  const surahMeta = chapters?.find((c) => c.id === surahOnPage);

  /** Ayah de référence : la 1re sélectionnée, sinon la 1re de la page. */
  const anchorVerse =
    (selected.length
      ? verses?.find((v) => v.key === selected[0])
      : verses?.[0]) ?? verses?.[0];
  const anchor = {
    key: anchorVerse?.key ?? "",
    surah: anchorVerse?.surah ?? surahOnPage,
    juz: anchorVerse?.juz ?? 1,
  };


  const playSurah = async () => {
    const keys = await fetchSurahVerseKeys(anchor.surah);
    start(keys, { turnPages: true });
  };

  /* -------------------------------------------------- sélection rapide */
  const playPage = () => start((verses ?? []).map((v) => v.key), { turnPages: true });
  const playSelection = () =>
    start(selected.length ? selected : anchor.key ? [anchor.key] : []);
  const playAyah = () => start(anchor.key ? [anchor.key] : []);
  const playJuz = async () => {
    const keys = await fetchJuzVerseKeys(anchor.juz);
    start(keys, { turnPages: true });
  };
  const playToEnd = () => {
    if (!chapters || !anchor.key) return;
    start(keysToEndOfQuran(anchor.key, chapters), { turnPages: true });
  };

  /** Ligne (index) où débute une nouvelle sourate → en-tête + basmala. */
  const surahStartAtLine = useMemo(() => {
    const map = new Map<number, number>();
    const seen = new Set<number>();
    (lines ?? []).forEach((line, i) => {
      for (const w of line.words) {
        if (w.first && w.ayah === 1 && !seen.has(w.surah)) {
          seen.add(w.surah);
          map.set(i, w.surah);
        }
      }
    });
    return map;
  }, [lines]);

  /* ------------------------------------- ajustement à la hauteur d'écran */
  const boxRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [fontPx, setFontPx] = useState(26);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const sheet = sheetRef.current;
    if (!box || !sheet || !lines?.length) return;
    let raf = 0;
    let cancelled = false;
    // scrollWidth === clientWidth dès qu'une ligne tient (pas de "marge"
    // native à lire ici) : on cherche donc d'abord la taille maximale qui
    // tient exactement, puis on recule d'un petit pourcentage pour ne
    // jamais laisser un mot/haraka effleurer le bord de la ligne.
    const SAFE_FACTOR = 0.97;
    const fits = () => {
      if (sheet.scrollHeight > box.clientHeight) return false;
      const rows = sheet.querySelectorAll<HTMLElement>("[data-mushaf-line]");
      for (const r of rows) if (r.scrollWidth > r.clientWidth) return false;
      return true;
    };
    const fit = () => {
      if (cancelled) return;
      let lo = 8;
      let hi = 40;
      let best = lo;
      for (let i = 0; i < 9; i++) {
        const mid = (lo + hi) / 2;
        sheet.style.fontSize = `${mid}px`;
        if (fits()) {
          best = mid;
          lo = mid;
        } else hi = mid;
      }
      const safe = Math.max(8, best * SAFE_FACTOR);
      sheet.style.fontSize = `${safe}px`;
      setFontPx(safe);
    };
    // 1er passage immédiat (police de repli le temps du chargement), puis
    // recalcul dès que "Amiri Quran" est réellement disponible : sans cela,
    // le fit se base sur les métriques de la police de secours et le texte
    // peut déborder/être coupé une fois le swap de police effectué (FOUT).
    raf = requestAnimationFrame(fit);
    if (typeof document !== "undefined" && document.fonts) {
      Promise.all([
        document.fonts.ready,
        document.fonts.load('700 16px "Amiri Quran"').catch(() => []),
      ]).then(() => {
        if (!cancelled) requestAnimationFrame(fit);
      });
    }
    const ro = new ResizeObserver(() => {
      if (!cancelled) requestAnimationFrame(fit);
    });
    ro.observe(box);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // Volontairement limité à `lines` (changement de page) : ni la sélection
    // ni la file de lecture ne doivent redéclencher ce calcul coûteux.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines]);

  /* ------------------------------------------------- swipe + appui long */
  const gesture = useRef({
    x: 0,
    y: 0,
    wordKey: null as string | null,
    timer: null as number | null,
    longPress: false,
  });

  const goPage = (delta: number) =>
    navigate({
      to: "/quran/page/$page",
      params: { page: String(clampPage(page + delta)) },
      search: { r: reciterId },
    });

  const suppressNextClick = useRef(false);

  const onSheetTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    gesture.current.x = t.clientX;
    gesture.current.y = t.clientY;
    gesture.current.longPress = false;
    const wordEl = (e.target as HTMLElement).closest<HTMLElement>(
      "[data-word-key]",
    );
    gesture.current.wordKey = wordEl?.dataset.wordKey ?? null;
    if (gesture.current.timer) window.clearTimeout(gesture.current.timer);
    if (gesture.current.wordKey) {
      gesture.current.timer = window.setTimeout(() => {
        gesture.current.longPress = true;
        suppressNextClick.current = true;
        setMenuFor(gesture.current.wordKey);
      }, 480);
    }
  };

  const onSheetTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0];
    const dx = t.clientX - gesture.current.x;
    const dy = t.clientY - gesture.current.y;
    if ((Math.abs(dx) > 10 || Math.abs(dy) > 10) && gesture.current.timer) {
      window.clearTimeout(gesture.current.timer);
      gesture.current.timer = null;
    }
  };

  const onSheetTouchEnd = (e: React.TouchEvent) => {
    if (gesture.current.timer) {
      window.clearTimeout(gesture.current.timer);
      gesture.current.timer = null;
    }
    if (gesture.current.longPress) {
      gesture.current.longPress = false;
      // Empêche le "clic fantôme" qui suit le relâchement du doigt de
      // refermer immédiatement le menu contextuel qu'on vient d'ouvrir.
      e.preventDefault();
      return;
    }
    const t = e.changedTouches[0];
    const dx = t.clientX - gesture.current.x;
    const dy = t.clientY - gesture.current.y;
    // Seuil élevé + ratio horizontal dominant : un scroll vertical ne doit
    // jamais être interprété comme un changement de page.
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      suppressNextClick.current = true;
      e.preventDefault();
      // Swipe vers la droite = page suivante ; swipe vers la gauche = page
      // précédente (volontairement indépendant du sens des boutons).
      goPage(dx > 0 ? 1 : -1);
    }
  };

  const onWordClick = (key: string) => {
    if (suppressNextClick.current) {
      suppressNextClick.current = false;
      return;
    }
    toggleVerse(key);
  };

  const menuVerse = verses?.find((v) => v.key === menuFor);
  const copyVerse = async () => {
    if (!menuVerse) return;
    try {
      await navigator.clipboard.writeText(menuVerse.arabic);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* refusé */
    }
    setMenuFor(null);
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <audio
        ref={audioRef}
        preload="none"
        onEnded={onEnded}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          setProgress(el.duration ? (el.currentTime / el.duration) * 100 : 0);
        }}
      />

      {/* En-tête ultra-compacte : sourate/page + recherche, une seule fois */}
      <header className="shrink-0 border-b border-border/40 bg-card/80 px-2 py-1 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-1.5">
          <button
            onClick={() => setShowNav(true)}
            className="min-w-0 flex-1 truncate rounded-full border border-border/60 bg-background px-3 py-1 text-left text-[13px] font-semibold"
          >
            {surahMeta ? `${surahMeta.nameFrench} · ` : ""}Page {page}
            <span className="text-muted-foreground"> / {TOTAL_PAGES}</span>
          </button>
          <button
            onClick={() => setShowNav(true)}
            aria-label="Recherche"
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Search className="size-[17px]" />
          </button>
        </div>
      </header>

      {/* Mushaf — élément principal, coupures de lignes officielles (15 lignes) */}
      <div
        ref={boxRef}
        className="min-h-0 flex-1 overflow-hidden px-1.5 py-1"
        onTouchStart={onSheetTouchStart}
        onTouchMove={onSheetTouchMove}
        onTouchEnd={onSheetTouchEnd}
      >
        {isPending && (
          <p className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Chargement de la page…
          </p>
        )}
        <div
          ref={sheetRef}
          style={{ fontSize: fontPx }}
          className="mx-auto flex h-full max-w-2xl flex-col justify-center gap-[0.35em]"
        >
          {(lines ?? []).map((line, li) => {
            const startSurah = surahStartAtLine.get(li);
            const meta = startSurah
              ? chapters?.find((c) => c.id === startSurah)
              : undefined;
            const showBasmala =
              !!startSurah && startSurah !== 1 && startSurah !== 9;
            return (
              <div key={line.n} className="contents">
                {startSurah && (
                  <div className="rounded-xl border border-gold/30 bg-gold/5 py-[0.15em] text-center">
                    <p lang="ar" className="font-arabic text-[0.8em] text-gold">
                      سورة {meta?.nameArabic ?? ""}
                    </p>
                  </div>
                )}
                {showBasmala && (
                  <Basmala
                    text="بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
                    className="text-[0.75em]"
                  />
                )}
                <div
                  data-mushaf-line
                  lang="ar"
                  dir="rtl"
                  className="flex items-baseline justify-between gap-[0.12em] whitespace-nowrap font-arabic font-bold leading-[1.9] text-foreground"
                >
                  {line.words.map((w, wi) => {
                    const isSel = selected.includes(w.key);
                    const isPlaying = current === w.key;
                    return (
                      <span
                        key={`${w.key}-${wi}`}
                        role="button"
                        tabIndex={-1}
                        data-word-key={w.key}
                        onClick={() => onWordClick(w.key)}
                        className={cn(
                          "cursor-pointer rounded px-[0.05em] transition-colors",
                          isSel && "bg-primary/15 text-primary",
                          isPlaying && "bg-gold/20 text-gold",
                          w.end && "text-gold",
                        )}
                      >
                        {w.end ? `\u06DD${toArabic(w.ayah)}` : w.text}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Indicateur de sélection — discret, ne déplace jamais le Mushaf */}
      {selected.length > 0 && (
        <p className="shrink-0 px-3 pb-0.5 text-center text-[11px] font-medium text-primary">
          {selLabel}
        </p>
      )}

      {/* Barre basse unique : Accueil · navigation · lecture · options */}
      <nav className="shrink-0 border-t border-border/40 bg-card/90 px-2 py-1.5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-1">
          <Link
            to="/"
            aria-label="Accueil"
            className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition active:scale-95 hover:bg-muted hover:text-foreground"
          >
            <Home className="size-5" />
          </Link>
          <button
            onClick={() => goPage(1)}
            aria-label="Page suivante"
            className="grid size-11 shrink-0 place-items-center rounded-full text-foreground transition active:scale-95 hover:bg-muted"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => (queue.length ? toggle() : playSelection())}
            aria-label={playing ? "Pause" : "Lecture"}
            className="grid size-14 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)] transition active:scale-95"
          >
            {playing ? (
              <Pause className="size-6" />
            ) : (
              <Play className="size-6" />
            )}
          </button>
          <button
            onClick={() => setOptionsOpen(true)}
            aria-label="Options de récitation"
            className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition active:scale-95 hover:bg-muted hover:text-foreground"
          >
            <Settings2 className="size-5" />
          </button>
          <button
            onClick={() => goPage(-1)}
            aria-label="Page précédente"
            className="grid size-11 shrink-0 place-items-center rounded-full text-foreground transition active:scale-95 hover:bg-muted"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </nav>

      {copied && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center">
          <span className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
            <Check className="size-4" /> Copié
          </span>
        </div>
      )}

      {menuFor && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm"
          onClick={() => setMenuFor(null)}
        >
          <div
            className="w-full rounded-t-3xl border-t border-border bg-card p-3 pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-2 text-center text-xs font-semibold text-muted-foreground">
              Ayah {menuFor}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  toggleVerse(menuFor);
                  setMenuFor(null);
                }}
                className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-background py-3 text-xs font-semibold transition hover:border-primary/50 hover:text-primary"
              >
                <Check className="size-5" />
                Sélectionner
              </button>
              <button
                onClick={copyVerse}
                className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-background py-3 text-xs font-semibold transition hover:border-primary/50 hover:text-primary"
              >
                <Copy className="size-5" />
                Copier
              </button>
              <button
                onClick={() => {
                  share(menuFor);
                  setMenuFor(null);
                }}
                className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-background py-3 text-xs font-semibold transition hover:border-primary/50 hover:text-primary"
              >
                <Share2 className="size-5" />
                Partager
              </button>
            </div>
          </div>
        </div>
      )}

      {showNav && (
        <GoToPanel
          page={page}
          chapters={chapters ?? []}
          reciterId={reciterId}
          onClose={() => setShowNav(false)}
        />
      )}

      {optionsOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm">
          <div className="max-h-[85dvh] w-full overflow-y-auto rounded-t-3xl border-t border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">
                Options de récitation
              </h2>
              <button
                onClick={() => setOptionsOpen(false)}
                aria-label="Fermer"
                className="grid size-9 place-items-center rounded-full border border-border"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Récitateur
            </p>
            <select
              aria-label="Récitateur"
              value={reciterId}
              onChange={(e) => setSearchParam({ r: e.target.value })}
              className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm font-medium"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <PillRow

              label="Répéter chaque ayah"
              value={ayahRepeat}
              onChange={setAyahRepeat}
            />
            <PillRow
              label="Répéter la sélection"
              value={selRepeat}
              onChange={setSelRepeat}
            />

            <p className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Vitesse
            </p>
            <div className="flex gap-1 rounded-full border border-border p-1">
              {[1, 1.25].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={cn(
                    "flex-1 rounded-full py-2 text-sm font-semibold transition",
                    speed === s
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {s}×
                </button>
              ))}
            </div>

            <p className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sélection rapide
            </p>
            <div className="grid grid-cols-2 gap-2 pb-4">
              <QuickButton label="Cette ayah" onClick={playAyah} />
              <QuickButton label="Cette page" onClick={playPage} />
              <QuickButton label="Cette sourate" onClick={playSurah} />
              <QuickButton label="Ce juz'" onClick={playJuz} />
              <button
                onClick={playToEnd}
                className="col-span-2 rounded-2xl border border-border bg-background px-3 py-3 text-sm font-semibold transition hover:border-primary/50 hover:text-primary"
              >
                Depuis ici jusqu'à la fin du Coran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border border-border bg-background px-3 py-3 text-sm font-semibold transition hover:border-primary/50 hover:text-primary"
    >
      {label}
    </button>
  );
}

function PillRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mt-3">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="flex gap-1 rounded-full border border-border p-1">
        {[
          { v: 1, l: "1 fois" },
          { v: 3, l: "3 fois" },
          { v: 5, l: "5 fois" },
          { v: 0, l: "∞" },
        ].map((o) => (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-semibold transition",
              value === o.v
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground",
            )}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}


function GoToPanel({
  page,
  chapters,
  reciterId,
  onClose,
}: {
  page: number;
  chapters: { id: number; nameArabic: string; nameFrench: string; pages: [number, number] }[];
  reciterId: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [value, setValue] = useState(String(page));
  const [q, setQ] = useState("");

  const go = (p: number) => {
    navigate({
      to: "/quran/page/$page",
      params: { page: String(clampPage(p)) },
      search: { r: reciterId },
    });
    onClose();
  };

  const list = chapters.filter((c) =>
    q
      ? c.nameFrench.toLowerCase().includes(q.toLowerCase()) ||
        c.nameArabic.includes(q) ||
        String(c.id) === q
      : true,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm">
      <div className="max-h-[80dvh] w-full overflow-y-auto rounded-t-3xl border-t border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Aller à…</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-9 place-items-center rounded-full border border-border"
          >
            <X className="size-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            go(Number(value));
          }}
          className="mb-4 flex gap-2"
        >
          <input
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Numéro de page (1–604)"
            className="h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm"
          />
          <button className="rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground">
            Ouvrir
          </button>
        </form>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Chercher une sourate"
          className="mb-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm"
        />
        <ul className="space-y-1 pb-4">
          {list.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => go(c.pages[0])}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-muted"
              >
                <span className="truncate">
                  <span className="text-muted-foreground">{c.id}. </span>
                  {c.nameFrench}
                </span>
                <span lang="ar" className="font-arabic text-gold">
                  {c.nameArabic}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
