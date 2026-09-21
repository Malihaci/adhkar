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
  MIN_FALLBACK_QUERY_LENGTH,
  RECITERS,
  TOTAL_PAGES,
  clampPage,
  fetchChapters,
  fetchFullQuranText,
  fetchJuzVerseKeys,
  fetchPageLayout,
  fetchSurahVerseKeys,
  fetchVersePage,
  getReciter,
  keysToEndOfQuran,
  normalizeArabicForSearch,
  searchQuranArabic,
  searchQuranFallback,
  verseAudioUrl,
  type PageVerse,
  type SearchResult,
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

/**
 * Mode de lecture choisi dans Options — détermine où le bouton ▶ s'arrête.
 * "continuous" (par défaut) et "toEnd" génèrent la même file (utile pour
 * réutiliser exactement keysToEndOfQuran) mais restent deux entrées de menu
 * séparées, comme demandé.
 */
type ReadMode = "continuous" | "ayah" | "page" | "surah" | "juz" | "toEnd";

const READ_MODES: { id: ReadMode; label: string }[] = [
  { id: "continuous", label: "Lecture continue" },
  { id: "ayah", label: "Cette ayah" },
  { id: "page", label: "Cette page" },
  { id: "surah", label: "Cette sourate" },
  { id: "juz", label: "Ce juz'" },
  { id: "toEnd", label: "Depuis cette ayah jusqu'à la fin du Coran" },
];

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchNavigating, setSearchNavigating] = useState<string | null>(null);

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
  const [readMode, setReadMode] = useState<ReadMode>("continuous");
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

  /**
   * Construit la file en appliquant la répétition par ayah puis par
   * sélection. `skipSelRepeat` ignore la répétition de sélection pour une
   * lecture continue/jusqu'à la fin du Coran (répéter une liste qui va
   * jusqu'à la fin du Coran n'a pas de sens) — la répétition par ayah,
   * elle, reste active dans tous les modes.
   */
  const start = (
    keys: string[],
    opts?: { turnPages?: boolean; skipSelRepeat?: boolean },
  ) => {
    if (!keys.length) return;
    const perAyah = ayahRepeat > 1 ? ayahRepeat : 1;
    let full = keys.flatMap((k) => Array.from({ length: perAyah }, () => k));
    const applySelRepeat = !opts?.skipSelRepeat;
    if (applySelRepeat && selRepeat > 1) {
      full = Array.from({ length: selRepeat }, () => full).flat();
    }
    setLoop(applySelRepeat && selRepeat === 0);
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
      // Vide la file terminée : un futur ▶ doit démarrer une nouvelle
      // lecture (mode courant) plutôt que "reprendre" une file épuisée.
      setQueue([]);
      setQIndex(0);
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

  /**
   * Résultat de recherche → vraie page Mushaf, ayah sélectionnée via le
   * mécanisme `sel` déjà utilisé pour les liens partagés (aucune nouvelle
   * logique de sélection).
   */
  const goToSearchResult = async (key: string) => {
    setSearchNavigating(key);
    try {
      const targetPage = await fetchVersePage(key);
      setSearchOpen(false);
      navigate({
        to: "/quran/page/$page",
        params: { page: String(targetPage) },
        search: { r: reciterId, sel: key },
      });
    } catch {
      /* le panneau reste ouvert, l'utilisateur peut réessayer */
    } finally {
      setSearchNavigating(null);
    }
  };

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


  /*
   * Chaque mode part de `anchor.key` (1re ayah sélectionnée, sinon 1re ayah
   * de la page — cf. §1/§6 : la sélection n'est plus qu'un point de départ)
   * et ne diffère que par où la lecture s'arrête.
   */
  const playAyah = () => start(anchor.key ? [anchor.key] : []);

  const playPageFromAnchor = () => {
    const list = verses ?? [];
    const idx = list.findIndex((v) => v.key === anchor.key);
    const keys = list.slice(idx < 0 ? 0 : idx).map((v) => v.key);
    start(keys, { turnPages: true });
  };

  const playSurahFromAnchor = async () => {
    const all = await fetchSurahVerseKeys(anchor.surah);
    const idx = all.indexOf(anchor.key);
    start(all.slice(idx < 0 ? 0 : idx), { turnPages: true });
  };

  const playJuzFromAnchor = async () => {
    const all = await fetchJuzVerseKeys(anchor.juz);
    const idx = all.indexOf(anchor.key);
    start(all.slice(idx < 0 ? 0 : idx), { turnPages: true });
  };

  /** "Lecture continue" et "toEnd" : identique, jusqu'à la fin du Coran. */
  const playContinuousFromAnchor = () => {
    if (!chapters || !anchor.key) return;
    start(keysToEndOfQuran(anchor.key, chapters), {
      turnPages: true,
      skipSelRepeat: true,
    });
  };

  /** Point d'entrée unique du bouton ▶ — démarre selon le mode choisi. */
  const playFromAnchor = () => {
    if (!anchor.key) return;
    switch (readMode) {
      case "ayah":
        playAyah();
        return;
      case "page":
        playPageFromAnchor();
        return;
      case "surah":
        void playSurahFromAnchor();
        return;
      case "juz":
        void playJuzFromAnchor();
        return;
      case "continuous":
      case "toEnd":
      default:
        playContinuousFromAnchor();
        return;
    }
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
            onClick={() => setSearchOpen(true)}
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
          className="mx-auto flex h-full max-w-2xl flex-col justify-start gap-[0.35em]"
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
      <nav className="shrink-0 border-t border-border/40 bg-card/90 px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-1">
          <Link
            to="/"
            aria-label="Accueil"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-border/60 bg-card text-muted-foreground shadow-[var(--shadow-soft)] transition active:scale-95 hover:bg-muted hover:text-foreground"
          >
            <Home className="size-[18px]" strokeWidth={1.75} />
          </Link>
          <button
            onClick={() => goPage(1)}
            aria-label="Page suivante"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-border/60 bg-card text-foreground shadow-[var(--shadow-soft)] transition active:scale-95 hover:bg-muted"
          >
            <ChevronLeft className="size-[18px]" strokeWidth={1.75} />
          </button>
          <button
            onClick={() => (queue.length ? toggle() : playFromAnchor())}
            aria-label={playing ? "Pause" : "Lecture"}
            className="grid size-14 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-elevated)] transition active:scale-95"
          >
            {playing ? (
              <Pause className="size-6" strokeWidth={1.75} />
            ) : (
              <Play className="size-6" strokeWidth={1.75} />
            )}
          </button>
          <button
            onClick={() => setOptionsOpen(true)}
            aria-label="Options de récitation"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-border/60 bg-card text-muted-foreground shadow-[var(--shadow-soft)] transition active:scale-95 hover:bg-muted hover:text-foreground"
          >
            <Settings2 className="size-[18px]" strokeWidth={1.75} />
          </button>
          <button
            onClick={() => goPage(-1)}
            aria-label="Page précédente"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-border/60 bg-card text-foreground shadow-[var(--shadow-soft)] transition active:scale-95 hover:bg-muted"
          >
            <ChevronRight className="size-[18px]" strokeWidth={1.75} />
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

      {searchOpen && (
        <SearchPanel
          chapters={chapters ?? []}
          navigatingKey={searchNavigating}
          onSelectVerse={goToSearchResult}
          onClose={() => setSearchOpen(false)}
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
              Mode de lecture
            </p>
            <div className="space-y-1.5 pb-4">
              {READ_MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setReadMode(m.id)}
                  aria-pressed={readMode === m.id}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition",
                    readMode === m.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:border-primary/40",
                  )}
                >
                  {m.label}
                  {readMode === m.id && <Check className="size-4 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
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

/**
 * Recherche V1 — texte arabe uniquement (tolérante aux harakat côté API).
 * Prévu pour accueillir plus tard traduction/phonétique/thématique sans
 * changer ce contrat : SearchResult reste la seule forme consommée ici.
 */
function SearchPanel({
  chapters,
  navigatingKey,
  onSelectVerse,
  onClose,
}: {
  chapters: { id: number; nameFrench: string }[];
  navigatingKey: string | null;
  onSelectVerse: (key: string) => void;
  onClose: () => void;
}) {
  const [raw, setRaw] = useState("");
  const [query, setQuery] = useState("");

  // Debounce : un seul appel réseau après une pause de saisie.
  useEffect(() => {
    const t = window.setTimeout(() => setQuery(raw.trim()), 350);
    return () => window.clearTimeout(t);
  }, [raw]);

  const {
    data,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["quran-search", query],
    queryFn: () => searchQuranArabic(query, 20),
    enabled: query.length >= 2,
  });

  /**
   * Fallback fragment : l'API principale matche par mot entier et rate donc
   * certains fragments (ex. "كرسي" absent tel quel, seulement dans
   * "كُرْسِيُّهُ"). On ne le déclenche QUE si la recherche principale est
   * établie et vide — jamais en plus d'un résultat déjà pertinent — et
   * jamais pour un fragment normalisé de moins de 3 caractères (sinon
   * inondation de faux résultats). Le texte complet du Coran (un seul appel,
   * `staleTime: Infinity`) n'est donc téléchargé qu'une fois par session, et
   * seulement si ce cas se présente réellement.
   */
  const canFallback =
    normalizeArabicForSearch(query).length >= MIN_FALLBACK_QUERY_LENGTH;
  const primaryEmpty = !isFetching && (data?.results.length ?? 0) === 0;
  const tryFallback = primaryEmpty && canFallback;

  const {
    data: fullQuranText,
    isFetching: isFetchingFullText,
  } = useQuery({
    queryKey: ["quran-full-text"],
    queryFn: fetchFullQuranText,
    staleTime: Infinity,
    enabled: tryFallback,
  });

  const fallback = useMemo(
    () => (fullQuranText ? searchQuranFallback(query, fullQuranText, 20) : null),
    [fullQuranText, query],
  );

  const usingFallback = tryFallback && !!fallback && fallback.results.length > 0;
  const results = usingFallback ? fallback!.results : (data?.results ?? []);
  const totalResults = usingFallback ? fallback!.totalResults : data?.totalResults;
  const loading = isFetching || (tryFallback && isFetchingFullText);
  const showNetworkError = isError && !tryFallback;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm">
      <div className="flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-3xl border-t border-border bg-card">
        <div className="flex shrink-0 items-center justify-between px-4 pt-4">
          <h2 className="font-display text-lg font-semibold">Recherche</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-9 place-items-center rounded-full border border-border"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="shrink-0 px-4 pb-3 pt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              dir="rtl"
              lang="ar"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="Rechercher dans le Coran…"
              aria-label="Rechercher dans le Coran"
              className="h-12 w-full rounded-full border border-border bg-background px-4 text-right font-arabic text-[17px] outline-none transition placeholder:text-right placeholder:font-sans placeholder:text-[14px] placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {raw && (
              <button
                onClick={() => setRaw("")}
                aria-label="Effacer"
                className="absolute left-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {query.length < 2 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Tapez au moins deux lettres — un mot ou un fragment d'ayah.
            </p>
          ) : loading ? (
            <p className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              {tryFallback ? "Recherche élargie…" : "Recherche…"}
            </p>
          ) : showNetworkError ? (
            <p className="py-10 text-center text-sm text-destructive">
              Recherche indisponible pour le moment. Réessayez.
            </p>
          ) : results.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucun résultat pour « {query} ».
            </p>
          ) : (
            <>
              {usingFallback && (
                <p className="mb-1 px-1 text-[11px] text-muted-foreground/80">
                  Résultats de fragment (recherche élargie)
                </p>
              )}
              {typeof totalResults === "number" && (
                <p className="mb-2 px-1 text-xs text-muted-foreground">
                  {totalResults > results.length
                    ? `${results.length} premiers résultats sur ${totalResults}`
                    : `${totalResults} résultat${totalResults > 1 ? "s" : ""}`}
                </p>
              )}
              <ul className="space-y-1.5">
                {results.map((r: SearchResult) => {
                  const meta = chapters.find((c) => c.id === r.surah);
                  const isNavigating = navigatingKey === r.key;
                  return (
                    <li key={r.key}>
                      <button
                        onClick={() => onSelectVerse(r.key)}
                        disabled={!!navigatingKey}
                        className="flex w-full flex-col gap-1.5 rounded-2xl border border-border/60 bg-background px-4 py-3 text-left transition hover:border-primary/40 hover:bg-muted disabled:opacity-60"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold text-foreground">
                            {meta?.nameFrench ?? `Sourate ${r.surah}`}
                          </span>
                          <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                            {r.key}
                          </span>
                        </div>
                        <p
                          lang="ar"
                          dir="rtl"
                          className="truncate font-arabic text-[1.1rem] leading-relaxed text-foreground"
                        >
                          {r.words.map((w, i) => (
                            <span
                              key={i}
                              className={w.highlight ? "text-primary" : undefined}
                            >
                              {w.text}{" "}
                            </span>
                          ))}
                        </p>
                        {isNavigating && (
                          <span className="flex items-center gap-1.5 text-xs text-primary">
                            <Loader2 className="size-3 animate-spin" /> Ouverture…
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
