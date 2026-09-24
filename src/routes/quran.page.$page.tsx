import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Home,
  Loader2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Search,
  Settings2,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import {
  MIN_FALLBACK_QUERY_LENGTH,
  RECITERS,
  TOTAL_PAGES,
  clampPage,
  fetchChapters,
  fetchFullQuranText,
  fetchHizbVerseKeys,
  fetchJuzVerseKeys,
  fetchPageLayout,
  fetchSurahVerseKeys,
  fetchVersePage,
  getReciter,
  isValidVerseKey,
  keysBetween,
  keysToEndOfQuran,
  normalizeArabicForSearch,
  parseQuranQuery,
  searchQuranArabic,
  searchQuranFallback,
  verseAudioUrl,
  type Chapter,
  type PageVerse,
  type SearchResult,
} from "@/lib/mushaf";
import { Basmala } from "@/components/AyahText";
import { useLocalState } from "@/lib/storage";
import { getPageContent, type EtudeCategory } from "@/lib/etude-content";
import { ContentList, AgirSection } from "@/routes/etude.$surah.$ayah";
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

/** Portée de lecture choisie dans Options — détermine la file construite. */
type ReadMode = "ayah" | "page" | "surah" | "juz" | "hizb" | "toEnd" | "range";

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
    if (i >= 0 && j >= 0) return keys.slice(Math.min(i, j), Math.max(i, j) + 1);
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
  /** Position d'ouverture desktop (clic droit) — reste `null` pour l'appui
   * long mobile, qui garde la bottom sheet existante. Les deux modes sont
   * distingués par le geste réel, jamais par la largeur d'écran. */
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);
  const closeMenu = () => {
    setMenuFor(null);
    setMenuAnchor(null);
  };
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchNavigating, setSearchNavigating] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  /** `document.fullscreenEnabled` n'existe pas côté serveur (SSR) : rester à
   * `false` au premier rendu (identique au serveur) puis ne détecter le
   * support qu'après montage évite un mismatch d'hydratation React — jamais
   * lire `document` directement dans le JSX de rendu. */
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  useEffect(() => {
    setFullscreenSupported(!!document.fullscreenEnabled);
  }, []);

  // Sélection venant du lien partagé
  useEffect(() => {
    if (verses) setSelected(parseSelection(search.sel, verses));
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
  const [pageLifeOpen, setPageLifeOpen] = useState(false);
  const [autoTurn, setAutoTurn] = useState(false);
  const [readMode, setReadMode] = useState<ReadMode>("toEnd");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const current = playing || queue.length ? queue[qIndex] : undefined;
  /**
   * Identifie la commande (portée + point de départ, ou bornes pour un
   * intervalle) pour laquelle `queue` a été construite. Tant que rien n'a
   * changé depuis, le ▶ principal doit reprendre la session en cours
   * (pause → play) ; dès que la portée ou le point de départ diffère, il
   * s'agit d'une NOUVELLE commande, jamais d'une reprise silencieuse de
   * l'ancienne file.
   */
  const activeQueueContext = useRef<string | null>(null);
  /** Incrémenté à chaque `load()` : ignore les promesses `play()` obsolètes. */
  const loadSessionRef = useRef(0);

  const load = useCallback(
    (key: string, autoplay = true) => {
      const el = audioRef.current;
      if (!el || !key) return;
      const sessionId = ++loadSessionRef.current;
      el.src = verseAudioUrl(reciterId, key);
      el.load();
      el.playbackRate = speed;
      if (autoplay) {
        el.play().catch(() => {
          // Une promesse issue d'un load() déjà remplacé par une commande
          // plus récente ne doit jamais réinitialiser l'état de lecture.
          if (loadSessionRef.current === sessionId) setPlaying(false);
        });
      }
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
  const start = (keys: string[], opts?: { turnPages?: boolean; skipSelRepeat?: boolean }) => {
    if (!keys.length) return;
    // Nouvelle commande explicite : invalide toute notion de "reprise" de
    // l'ancienne file — le prochain ▶ ne pourra plus la confondre avec
    // celle-ci tant que la portée, le point de départ ou les réglages
    // (répétitions) n'auront pas de nouveau changé. Basé sur les PARAMÈTRES
    // de la commande (pas sur la file résultante, parfois construite de
    // façon asynchrone pour sourate/juz'/hizb).
    activeQueueContext.current = selectionSignature();
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
    const forward = s > last.surah || (s === last.surah && a > last.ayah);
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
      if (prev.includes(key)) return prev.length === 1 ? [] : prev.filter((k) => k !== key);
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

  /**
   * Référence de page directe (recherche "page 42" ou nombre seul) : ouvre
   * la page sans sélectionner arbitrairement une ayah.
   */
  const goToPageDirect = (targetPage: number) => {
    setSearchOpen(false);
    navigate({
      to: "/quran/page/$page",
      params: { page: String(clampPage(targetPage)) },
      search: { r: reciterId },
    });
  };

  /* ------------------------------------------------------------ partage */
  const buildLink = (sel?: string) => {
    const url = new URL(
      `/quran/page/${page}`,
      typeof window !== "undefined"
        ? window.location.origin
        : "https://adhkari-daily-guide.lovable.app",
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
    selected.length > 1 ? `${selected[0]}-${selected[selected.length - 1]}` : selected[0];

  /* ------------------------------------------------------------ sourate */
  const surahOnPage = verses?.[0]?.surah ?? 1;
  const surahMeta = chapters?.find((c) => c.id === surahOnPage);

  /** Ayah de référence : la 1re sélectionnée, sinon la 1re de la page. */
  const anchorVerse =
    (selected.length ? verses?.find((v) => v.key === selected[0]) : verses?.[0]) ?? verses?.[0];
  const anchor = {
    key: anchorVerse?.key ?? "",
    surah: anchorVerse?.surah ?? surahOnPage,
    juz: anchorVerse?.juz ?? 1,
    hizb: anchorVerse?.hizb ?? 1,
  };

  /** Signature des PARAMÈTRES de la commande actuellement affichée dans Options. */
  const selectionSignature = () =>
    readMode === "range"
      ? `range|${rangeStart}|${rangeEnd}|${ayahRepeat}|${selRepeat}`
      : `${readMode}|${anchor.key}|${ayahRepeat}|${selRepeat}`;

  /**
   * Vrai uniquement si la file en cours a été construite pour exactement la
   * commande actuellement affichée : dans ce cas, et seulement dans ce cas,
   * le ▶ doit se comporter comme Pause → Play (reprise exacte). Dès que la
   * portée, le point de départ ou les réglages ont changé depuis, il s'agit
   * d'une nouvelle commande qui doit reconstruire la file — jamais reprendre
   * silencieusement l'ancienne lecture.
   */
  const isCurrentSession = queue.length > 0 && activeQueueContext.current === selectionSignature();

  /** Raison lisible si la commande actuelle ne peut pas construire de file. */
  const rangeInvalidReason = (() => {
    if (readMode !== "range") return null;
    if (!rangeStart || !rangeEnd) return "Choisissez l'ayah de départ et de fin";
    if (!chapters) return null;
    if (!isValidVerseKey(rangeStart, chapters) || !isValidVerseKey(rangeEnd, chapters))
      return "Ayah introuvable (format attendu : sourate:ayah)";
    if (keysBetween(rangeStart, rangeEnd, chapters).length === 0)
      return "L'ayah de fin doit être après l'ayah de départ";
    return null;
  })();
  const canPlay = readMode === "range" ? !rangeInvalidReason && !!chapters : !!anchor.key;

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

  const playHizbFromAnchor = async () => {
    const all = await fetchHizbVerseKeys(anchor.hizb);
    const idx = all.indexOf(anchor.key);
    start(all.slice(idx < 0 ? 0 : idx), { turnPages: true });
  };

  /** Jusqu'à la fin du Coran, depuis l'ayah sélectionnée. */
  const playToEndFromAnchor = () => {
    if (!chapters || !anchor.key) return;
    start(keysToEndOfQuran(anchor.key, chapters), {
      turnPages: true,
      skipSelRepeat: true,
    });
  };

  /** Intervalle personnalisé De → À (inclusif, peut traverser une sourate). */
  const playRangeFromAnchor = () => {
    if (!chapters) return;
    const keys = keysBetween(rangeStart, rangeEnd, chapters);
    if (!keys.length) return;
    start(keys, { turnPages: true });
  };

  /** Point d'entrée unique du bouton ▶ — démarre selon la portée choisie. */
  const playFromAnchor = () => {
    switch (readMode) {
      case "ayah":
        if (anchor.key) playAyah();
        return;
      case "page":
        if (anchor.key) playPageFromAnchor();
        return;
      case "surah":
        if (anchor.key) void playSurahFromAnchor();
        return;
      case "juz":
        if (anchor.key) void playJuzFromAnchor();
        return;
      case "hizb":
        if (anchor.key) void playHizbFromAnchor();
        return;
      case "range":
        playRangeFromAnchor();
        return;
      case "toEnd":
      default:
        if (anchor.key) playToEndFromAnchor();
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
  /** Conteneur "virtuel" sur lequel le fitting calcule réellement — sa
   * taille est délibérément box/zoom (jamais 100%), pour que l'agrandissement
   * agisse sur l'échelle visuelle (CSS transform) sans jamais changer la
   * composition (line_number, retours à la ligne) calculée par le fitting. */
  const fitBoxRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [fontPx, setFontPx] = useState(26);
  const [zoom, setZoom] = useLocalState("adhkar:mushaf-zoom", 1);
  const ZOOM_LEVELS = [0.85, 1, 1.15, 1.3] as const;

  useLayoutEffect(() => {
    const box = boxRef.current;
    const fitBox = fitBoxRef.current;
    const sheet = sheetRef.current;
    if (!box || !fitBox || !sheet || !lines?.length) return;
    let raf = 0;
    let cancelled = false;
    // scrollWidth === clientWidth dès qu'une ligne tient (pas de "marge"
    // native à lire ici) : on cherche donc d'abord la taille maximale qui
    // tient exactement, puis on recule d'un petit pourcentage pour ne
    // jamais laisser un mot/haraka effleurer le bord de la ligne.
    const SAFE_FACTOR = 0.97;
    const fits = () => {
      if (sheet.scrollHeight > fitBox.clientHeight) return false;
      const rows = sheet.querySelectorAll<HTMLElement>("[data-mushaf-line]");
      for (const r of rows) if (r.scrollWidth > r.clientWidth) return false;
      return true;
    };
    const fit = () => {
      if (cancelled) return;
      // Boîte virtuelle = boîte réelle / zoom : le fitting compose toujours
      // pour cette taille virtuelle, jamais pour la taille visuelle finale.
      // En portrait, la largeur reste plafonnée (comme l'ancien max-w-2xl) ;
      // en paysage, le Mushaf utilise toute la largeur réellement disponible
      // — c'est le cœur de la correction du mode paysage.
      const isLandscape =
        typeof window !== "undefined" && window.matchMedia("(orientation: landscape)").matches;
      const PORTRAIT_MAX_WIDTH_PX = 672; // équivalent Tailwind max-w-2xl
      // Plafond de lecture en paysage/desktop : un mobile ou une tablette en
      // paysage reste presque toujours en dessous de ce plafond et continue
      // donc d'utiliser tout l'espace réel (correction du mode paysage) ;
      // un grand écran desktop, lui, ne doit jamais étirer les lignes du
      // Mushaf jusqu'aux bords — proportions de page et espacement des mots
      // restent naturels, comme une vraie page de Mushaf centrée.
      const LANDSCAPE_MAX_WIDTH_PX = 960;
      const effectiveWidth = isLandscape
        ? Math.min(box.clientWidth, LANDSCAPE_MAX_WIDTH_PX)
        : Math.min(box.clientWidth, PORTRAIT_MAX_WIDTH_PX);
      fitBox.style.width = `${effectiveWidth / zoom}px`;
      fitBox.style.height = `${box.clientHeight / zoom}px`;
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
    // Observe la boîte RÉELLE : redimensionnement de fenêtre ET rotation
    // portrait/paysage déclenchent tous les deux un recalcul du fitting.
    const ro = new ResizeObserver(() => {
      if (!cancelled) requestAnimationFrame(fit);
    });
    ro.observe(box);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // `zoom` recalcule volontairement le fitting (nouvelle boîte virtuelle) ;
    // ni la sélection ni la file de lecture ne doivent le redéclencher.
  }, [lines, zoom]);

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

  /** Références "toujours à jour" pour les raccourcis clavier : l'effet qui
   * écoute `keydown` n'a volontairement pas `page`/`queue`/etc. dans ses
   * dépendances (il tournerait à chaque tick audio) — sans cela, la
   * fermeture capturerait une valeur de `page` figée au moment où l'effet a
   * été (re)créé, et ← / → navigueraient depuis une ancienne page (bug
   * constaté en test : ← puis → ne revenait pas sur la page de départ). */
  const goPageRef = useRef(goPage);
  const toggleRef = useRef(toggle);
  const playFromAnchorRef = useRef(playFromAnchor);
  const isCurrentSessionRef = useRef(isCurrentSession);
  useEffect(() => {
    goPageRef.current = goPage;
    toggleRef.current = toggle;
    playFromAnchorRef.current = playFromAnchor;
    isCurrentSessionRef.current = isCurrentSession;
  });

  /* --------------------------------------------------- plein écran (desktop) */
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  };

  /* ------------------------------------------- raccourcis clavier (desktop)
   * ← / → : page suivante/précédente (même sens que les boutons existants,
   * cohérent avec la navigation RTL déjà en place — ChevronLeft = suivante).
   * Espace : lecture/pause, ignoré si le focus est dans un champ de saisie.
   * Échap : ferme le panneau ouvert le plus prioritaire, ou quitte le plein
   * écran — ne remplace jamais les commandes visibles, ne fait rien de plus. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (e.key === "Escape") {
        if (menuFor) closeMenu();
        else if (optionsOpen) setOptionsOpen(false);
        else if (searchOpen) setSearchOpen(false);
        else if (showNav) setShowNav(false);
        else if (pageLifeOpen) setPageLifeOpen(false);
        else if (document.fullscreenElement) void document.exitFullscreen();
        return;
      }
      if (typing) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPageRef.current(1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goPageRef.current(-1);
      } else if (e.code === "Space") {
        e.preventDefault();
        if (isCurrentSessionRef.current) toggleRef.current();
        else playFromAnchorRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuFor, optionsOpen, searchOpen, showNav, pageLifeOpen]);

  const suppressNextClick = useRef(false);

  const onSheetTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    gesture.current.x = t.clientX;
    gesture.current.y = t.clientY;
    gesture.current.longPress = false;
    const wordEl = (e.target as HTMLElement).closest<HTMLElement>("[data-word-key]");
    gesture.current.wordKey = wordEl?.dataset.wordKey ?? null;
    if (gesture.current.timer) window.clearTimeout(gesture.current.timer);
    if (gesture.current.wordKey) {
      gesture.current.timer = window.setTimeout(() => {
        gesture.current.longPress = true;
        suppressNextClick.current = true;
        const key = gesture.current.wordKey!;
        // L'appui long sélectionne l'ayah si nécessaire (jamais un toggle/
        // une extension de plage comme le tap) puis ouvre son menu —
        // selectedVerseKey correspond toujours à l'ayah concernée.
        setSelected((prev) => (prev.includes(key) ? prev : [key]));
        setMenuFor(key);
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

  /** Clic droit desktop : sélectionne l'ayah et ouvre le menu près du curseur
   * (jamais le gros menu plein écran) — équivalent desktop de l'appui long. */
  const onWordContextMenu = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    setSelected((prev) => (prev.includes(key) ? prev : [key]));
    setMenuFor(key);
    setMenuAnchor({ x: e.clientX, y: e.clientY });
  };

  /** Contenu identique (titre + Étudier/Copier/Partager) pour les deux
   * présentations du menu — bottom sheet mobile (appui long) et popover
   * ancré au curseur (clic droit desktop). Mêmes actions, même comportement. */
  const menuActions = (key: string) => (
    <>
      <p className="mb-2 text-center text-xs font-semibold text-muted-foreground">
        {key}
        {menuVerse &&
          (() => {
            const meta = chapters?.find((c) => c.id === menuVerse.surah);
            return meta ? ` · ${meta.nameFrench} · ${meta.nameArabic}` : "";
          })()}
      </p>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => {
            const [s, a] = key.split(":");
            closeMenu();
            navigate({
              to: "/etude/$surah/$ayah",
              params: { surah: s, ayah: a },
              search: { fromPage: String(page), r: reciterId, sel: key },
            });
          }}
          className="flex flex-col items-center gap-1 rounded-2xl border border-primary/40 bg-primary/5 py-3 text-xs font-semibold text-primary transition hover:bg-primary/10"
        >
          <Sparkles className="size-5" />
          Étudier
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
            share(key);
            closeMenu();
          }}
          className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-background py-3 text-xs font-semibold transition hover:border-primary/50 hover:text-primary"
        >
          <Share2 className="size-5" />
          Partager
        </button>
      </div>
    </>
  );

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
    closeMenu();
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

      {/* En-tête ultra-compacte : sourate/page + recherche, une seule fois.
          Plus fine en paysage pour laisser le maximum d'espace au Mushaf. */}
      <header className="shrink-0 border-b border-border/40 bg-card/80 px-2 py-1 backdrop-blur-xl [@media(orientation:landscape)_and_(max-height:500px)]:py-0.5">
        <div className="mx-auto flex max-w-2xl items-center gap-1.5">
          <button
            onClick={() => setShowNav(true)}
            className="min-w-0 flex-1 truncate rounded-full border border-border/60 bg-background px-3 py-1 text-left text-[13px] font-semibold"
          >
            {surahMeta ? (
              <>
                {surahMeta.nameSimple} ·{" "}
                <span lang="ar" className="font-arabic">
                  {surahMeta.nameArabic}
                </span>{" "}
                ·{" "}
              </>
            ) : (
              ""
            )}
            Page {page}
            <span className="text-muted-foreground"> / {TOTAL_PAGES}</span>
          </button>
          <button
            onClick={() => setPageLifeOpen(true)}
            aria-label="Vivre cette page"
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <span aria-hidden className="text-[15px] leading-none">
              🌿
            </span>
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Recherche"
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Search className="size-[17px]" />
          </button>
          {/* Plein écran — desktop uniquement (souris fine), discret, à côté
              de la recherche. Aucun impact mobile. */}
          {fullscreenSupported && (
            <button
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
              className="hidden size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground [@media(pointer:fine)]:grid"
            >
              {isFullscreen ? (
                <Minimize2 className="size-[15px]" />
              ) : (
                <Maximize2 className="size-[15px]" />
              )}
            </button>
          )}
        </div>
      </header>

      {/* Mushaf — élément principal, coupures de lignes officielles (15 lignes).
          En paysage, toute la largeur/hauteur disponible est utilisée (pas
          de max-w-2xl) : c'est l'élément prioritaire de l'écran. */}
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
        {/* Boîte virtuelle : dimensionnée en JS (box/zoom, capée à 672px
            seulement en portrait) puis agrandie visuellement par transform
            scale — le fitting à l'intérieur ne voit jamais l'agrandissement,
            donc jamais de reflow/retour à la ligne différent selon le zoom. */}
        <div
          ref={fitBoxRef}
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
          className="mx-auto h-full"
        >
          <div
            ref={sheetRef}
            style={{ fontSize: fontPx }}
            className="flex h-full w-full flex-col justify-start gap-[0.35em]"
          >
            {(lines ?? []).map((line, li) => {
              const startSurah = surahStartAtLine.get(li);
              const meta = startSurah ? chapters?.find((c) => c.id === startSurah) : undefined;
              const showBasmala = !!startSurah && startSurah !== 1 && startSurah !== 9;
              return (
                <div key={line.n} className="contents">
                  {startSurah && (
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-gold/30 bg-gold/5 py-[0.15em] text-center">
                      <p className="text-[0.7em] font-semibold text-gold">
                        {meta?.nameSimple}{" "}
                        <span lang="ar" className="font-arabic text-[1.05em]">
                          {meta?.nameArabic ?? ""}
                        </span>
                      </p>
                      <Link
                        to="/sourate/$surah"
                        params={{ surah: String(startSurah) }}
                        className="rounded-full bg-gold/15 px-2 py-0.5 text-[0.55em] font-semibold text-gold"
                      >
                        🌿 Découvrir
                      </Link>
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
                          onContextMenu={(e) => onWordContextMenu(e, w.key)}
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
            onClick={() => (isCurrentSession ? toggle() : playFromAnchor())}
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

      {menuFor && !menuAnchor && (
        // Appui long mobile — bottom sheet. Pas de voile gris/assombrissement :
        // le Mushaf et l'ayah sélectionnée (déjà surlignée via `isSel`)
        // restent pleinement visibles. Le calque transparent ne sert qu'à
        // détecter le tap "en dehors" pour fermer.
        <div className="fixed inset-0 z-50" onClick={closeMenu}>
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-border bg-card p-3 pb-4 shadow-[var(--shadow-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            {menuActions(menuFor)}
          </div>
        </div>
      )}

      {menuFor && menuAnchor && (
        // Clic droit desktop — petit menu ancré près du curseur, jamais un
        // grand panneau qui cacherait le Mushaf.
        <div className="fixed inset-0 z-50" onClick={closeMenu}>
          <div
            className="absolute w-56 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-elevated)]"
            style={{
              left: Math.min(
                menuAnchor.x,
                (typeof window !== "undefined" ? window.innerWidth : 0) - 232,
              ),
              top: Math.min(
                menuAnchor.y,
                (typeof window !== "undefined" ? window.innerHeight : 0) - 190,
              ),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {menuActions(menuFor)}
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
          onGoToPage={goToPageDirect}
          onClose={() => setSearchOpen(false)}
        />
      )}

      {optionsOpen && (
        // Mobile/tablette : bottom sheet inchangée. Desktop (lg+) : panneau
        // latéral droit ~420px — n'occupe jamais la quasi-totalité de l'écran.
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm lg:items-stretch lg:justify-end">
          <div className="flex max-h-[85dvh] w-full flex-col rounded-t-3xl border-t border-border bg-card lg:max-h-none lg:w-[420px] lg:rounded-none lg:rounded-l-3xl lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between px-4 pb-3 pt-4">
              <h2 className="font-display text-lg font-semibold">Options de récitation</h2>
              <button
                onClick={() => setOptionsOpen(false)}
                aria-label="Fermer"
                className="grid size-9 place-items-center rounded-full border border-border"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Sélection rapide
              </p>
              <div className="grid grid-cols-2 gap-1.5 pb-1">
                {(
                  [
                    { id: "ayah", label: "Cette ayah", detail: anchor.key || undefined },
                    { id: "page", label: "Cette page", detail: `Page ${page}` },
                    {
                      id: "surah",
                      label: "Cette sourate",
                      detail: chapters?.find((c) => c.id === anchor.surah)?.nameFrench,
                    },
                    { id: "juz", label: "Ce juz'", detail: `Juz ${anchor.juz}` },
                    { id: "hizb", label: "Ce hizb", detail: `Hizb ${anchor.hizb}` },
                    { id: "toEnd", label: "Jusqu'à la fin", detail: undefined },
                  ] as { id: ReadMode; label: string; detail?: string }[]
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setReadMode(m.id)}
                    aria-pressed={readMode === m.id}
                    className={cn(
                      "rounded-2xl border px-3 py-2.5 text-left text-sm font-semibold transition",
                      readMode === m.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background hover:border-primary/40",
                    )}
                  >
                    <span className="block">{m.label}</span>
                    {m.detail && (
                      <span className="block truncate text-[11px] font-normal text-muted-foreground">
                        {m.detail}
                      </span>
                    )}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setReadMode("range");
                    if (!rangeStart && anchor.key) setRangeStart(anchor.key);
                  }}
                  aria-pressed={readMode === "range"}
                  className={cn(
                    "col-span-2 rounded-2xl border px-3 py-2.5 text-left text-sm font-semibold transition",
                    readMode === "range"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:border-primary/40",
                  )}
                >
                  Intervalle personnalisé
                </button>
              </div>

              {readMode === "range" && (
                <div className="mb-2 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-background p-3">
                  <label className="text-xs font-medium text-muted-foreground">
                    De
                    <input
                      value={rangeStart}
                      onChange={(e) => setRangeStart(e.target.value.trim())}
                      placeholder="ex : 5:39"
                      className="mt-1 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm"
                    />
                  </label>
                  <label className="text-xs font-medium text-muted-foreground">
                    À
                    <input
                      value={rangeEnd}
                      onChange={(e) => setRangeEnd(e.target.value.trim())}
                      placeholder="ex : 5:50"
                      className="mt-1 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm"
                    />
                  </label>
                  {rangeInvalidReason && (
                    <p className="col-span-2 text-xs text-destructive">{rangeInvalidReason}</p>
                  )}
                </div>
              )}

              <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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

              <PillRow label="Répéter chaque ayah" value={ayahRepeat} onChange={setAyahRepeat} />
              <PillRow label="Répéter la sélection" value={selRepeat} onChange={setSelRepeat} />

              <p className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Vitesse
              </p>
              <div className="mb-4 flex gap-1 rounded-full border border-border p-1">
                {[1, 1.25].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={cn(
                      "flex-1 rounded-full py-2 text-sm font-semibold transition",
                      speed === s ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>

              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Taille du Mushaf
              </p>
              <div className="mb-4 flex items-center gap-2 rounded-full border border-border p-1">
                <button
                  onClick={() =>
                    setZoom((z) => {
                      const i = ZOOM_LEVELS.indexOf(z as (typeof ZOOM_LEVELS)[number]);
                      return ZOOM_LEVELS[Math.max(0, i - 1)] ?? ZOOM_LEVELS[0];
                    })
                  }
                  disabled={zoom <= ZOOM_LEVELS[0]}
                  aria-label="Réduire le Mushaf"
                  className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold text-foreground transition disabled:opacity-30"
                >
                  A−
                </button>
                <span className="flex-1 text-center text-xs font-semibold text-muted-foreground">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() =>
                    setZoom((z) => {
                      const i = ZOOM_LEVELS.indexOf(z as (typeof ZOOM_LEVELS)[number]);
                      return ZOOM_LEVELS[Math.min(ZOOM_LEVELS.length - 1, i + 1)] ?? ZOOM_LEVELS[0];
                    })
                  }
                  disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
                  aria-label="Agrandir le Mushaf"
                  className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold text-foreground transition disabled:opacity-30"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Footer sticky : une seule action pour appliquer la config et lancer. */}
            <div
              className="shrink-0 border-t border-border/60 bg-card px-4 pt-3"
              style={{ paddingBottom: "calc(0.875rem + env(safe-area-inset-bottom))" }}
            >
              {!canPlay && (
                <p className="mb-2 text-center text-xs text-muted-foreground">
                  {rangeInvalidReason ?? "Sélectionnez une ayah pour commencer"}
                </p>
              )}
              <button
                onClick={playFromAnchor}
                disabled={!canPlay}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold transition active:scale-[0.98]",
                  canPlay
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-elevated)]"
                    : "cursor-not-allowed bg-muted text-muted-foreground",
                )}
              >
                <Play className="size-4 fill-current" />
                {isCurrentSession && !playing ? "Reprendre la lecture" : "Commencer la lecture"}
              </button>
            </div>
          </div>
        </div>
      )}

      {pageLifeOpen && verses && (
        <PageLifeSheet
          page={page}
          verses={verses}
          chapters={chapters ?? []}
          onClose={() => setPageLifeOpen(false)}
        />
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
              value === o.v ? "bg-primary text-primary-foreground" : "text-muted-foreground",
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
  onGoToPage,
  onClose,
}: {
  chapters: Chapter[];
  navigatingKey: string | null;
  onSelectVerse: (key: string) => void;
  onGoToPage: (page: number) => void;
  onClose: () => void;
}) {
  const [raw, setRaw] = useState("");
  const [query, setQuery] = useState("");

  // Debounce : un seul appel réseau après une pause de saisie.
  useEffect(() => {
    const t = window.setTimeout(() => setQuery(raw.trim()), 350);
    return () => window.clearTimeout(t);
  }, [raw]);

  /**
   * Détection locale et instantanée (sans réseau) d'une référence d'ayah
   * (« 2:255 », « 2 255 », « Al-Baqara 255 », « البقرة 255 ») ou de page
   * (« page 42 », « p 42 », nombre seul). Si rien ne correspond, la
   * recherche textuelle existante prend le relais sans aucun changement.
   */
  const parsed = useMemo(
    () => parseQuranQuery(raw, chapters.length ? chapters : undefined),
    [raw, chapters],
  );
  const isReference = parsed.kind !== "text";

  const { data, isFetching, isError } = useQuery({
    queryKey: ["quran-search", query],
    queryFn: () => searchQuranArabic(query, 20),
    enabled: query.length >= 2 && !isReference,
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
    !isReference && normalizeArabicForSearch(query).length >= MIN_FALLBACK_QUERY_LENGTH;
  const primaryEmpty = !isFetching && (data?.results.length ?? 0) === 0;
  const tryFallback = primaryEmpty && canFallback;

  const { data: fullQuranText, isFetching: isFetchingFullText } = useQuery({
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
          <p className="mt-1.5 px-1 text-[11px] text-muted-foreground/70">
            Mot, ayah ou page — ex. الله · 2:255 · Page 42
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {parsed.kind === "ayah" ? (
            <button
              onClick={() => onSelectVerse(`${parsed.surah}:${parsed.ayah}`)}
              disabled={!!navigatingKey}
              className="flex w-full items-center justify-between gap-2 rounded-2xl border border-primary/40 bg-primary/5 px-4 py-3 text-left transition hover:bg-primary/10 disabled:opacity-60"
            >
              <span className="text-sm font-medium text-foreground">
                Aller à{" "}
                {chapters.find((c) => c.id === parsed.surah)?.nameFrench ??
                  `sourate ${parsed.surah}`}{" "}
                — ayah {parsed.ayah}
              </span>
              {navigatingKey ? (
                <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
              ) : (
                <span className="shrink-0 text-xs font-medium tabular-nums text-primary">
                  {parsed.surah}:{parsed.ayah}
                </span>
              )}
            </button>
          ) : parsed.kind === "invalid-ayah" ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {parsed.surahName} ne compte que {parsed.versesCount} ayat.
            </p>
          ) : parsed.kind === "page" ? (
            <button
              onClick={() => onGoToPage(parsed.page)}
              className="flex w-full items-center justify-between gap-2 rounded-2xl border border-primary/40 bg-primary/5 px-4 py-3 text-left transition hover:bg-primary/10"
            >
              <span className="text-sm font-medium text-foreground">
                Ouvrir la page {parsed.page}
              </span>
              <span className="shrink-0 text-xs font-medium tabular-nums text-primary">/ 604</span>
            </button>
          ) : parsed.kind === "page-suggestion" ? (
            <button
              onClick={() => onGoToPage(parsed.page)}
              className="flex w-full items-center justify-between gap-2 rounded-2xl border border-border/60 bg-background px-4 py-3 text-left transition hover:border-primary/40 hover:bg-muted"
            >
              <span className="text-sm font-medium text-foreground">
                Aller à la page {parsed.page}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">/ 604</span>
            </button>
          ) : parsed.kind === "invalid-page" ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Le Mushaf contient 604 pages.
            </p>
          ) : query.length < 2 ? (
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
                            <span key={i} className={w.highlight ? "text-primary" : undefined}>
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

const PAGE_LIFE_SECTIONS: { key: EtudeCategory; icon: string; label: string; subtitle: string }[] =
  [
    { key: "tadabbur", icon: "💭", label: "Méditer", subtitle: "تدبر" },
    { key: "amal", icon: "🌱", label: "Agir", subtitle: "العمل بالآيات" },
    { key: "tawjihat", icon: "🧭", label: "S'orienter", subtitle: "التوجيهات" },
    { key: "lesson", icon: "✨", label: "À retenir", subtitle: "دروس" },
    { key: "today", icon: "🌍", label: "Dès aujourd'hui", subtitle: "اليوم" },
  ];

/**
 * « Vivre cette page » — répond à une intention différente d'« Étudier
 * cette ayah » : après avoir lu toute la page, que puis-je en retenir et
 * mettre en pratique ? Réutilise exactement les mêmes données (Waqafat/
 * Amal/Tawjihat de القرآن تدبر وعمل) via `getPageContent`, sans
 * réextraction ni deuxième base. Aucune rubrique sans contenu réel ne
 * s'affiche — pas de "Message de la page" tant qu'aucune source ne permet
 * d'en établir un fidèlement.
 */
function PageLifeSheet({
  page,
  verses,
  chapters,
  onClose,
}: {
  page: number;
  verses: PageVerse[];
  chapters: Chapter[];
  onClose: () => void;
}) {
  const pageVerseKeys = verses.map((v) => v.key);
  const surahesOnPage = [...new Set(verses.map((v) => v.surah))]
    .map((id) => chapters.find((c) => c.id === id)?.nameFrench)
    .filter(Boolean);
  const [openSection, setOpenSection] = useState<EtudeCategory | null>(null);

  const contentBySection = PAGE_LIFE_SECTIONS.map((s) => ({
    ...s,
    items: getPageContent(page, pageVerseKeys, s.key),
  })).filter((s) => s.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm">
      <div className="flex max-h-[85dvh] w-full flex-col rounded-t-3xl border-t border-border bg-card">
        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold">🌿 Vivre cette page</h2>
            <p className="truncate text-xs text-muted-foreground">
              Page {page} {surahesOnPage.length ? `· ${surahesOnPage.join(", ")}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {contentBySection.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucun contenu vérifié disponible pour cette page pour le moment.
            </p>
          ) : (
            <div className="space-y-2">
              {contentBySection.map((s) => {
                const open = openSection === s.key;
                return (
                  <div
                    key={s.key}
                    className="overflow-hidden rounded-3xl border border-border/40 bg-background"
                  >
                    <button
                      onClick={() => setOpenSection(open ? null : s.key)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        <span aria-hidden className="text-base leading-none">
                          {s.icon}
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-foreground">{s.label}</span>
                          <span
                            lang="ar"
                            className="block font-arabic text-xs text-muted-foreground"
                          >
                            {s.subtitle}
                          </span>
                        </span>
                      </span>
                      <ChevronRight
                        className={cn(
                          "size-4 shrink-0 text-muted-foreground transition-transform",
                          open && "rotate-90",
                        )}
                      />
                    </button>
                    {open && (
                      <div className="border-t border-border/40 px-4 py-3.5">
                        {s.key === "amal" ? (
                          <AgirSection items={s.items} />
                        ) : (
                          <ContentList items={s.items} />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
