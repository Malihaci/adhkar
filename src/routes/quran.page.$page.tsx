import { type ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  Home,
  Leaf,
  Loader2,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Pause,
  Play,
  Search,
  Settings2,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { fetchHamidullahAyah } from "@/lib/hamidullah";
import { useKahfChallenge } from "@/lib/kahfChallenge";
import { useWakeLock } from "@/lib/wakeLock";
import { readJSON, writeJSON } from "@/lib/storage";
import { effectiveSchedule, type WirdState } from "@/lib/khatma";
import { useInkOffset } from "@/lib/inkCenter";
import { ChoiceSelect } from "@/components/ChoiceSelect";
import { TajweedLegend } from "@/components/TajweedLegend";
import {
  foldVerses,
  fetchSurahPages,
  searchLocal,
  type LocalSearchResult,
  RECITERS,
  clampPage,
  fetchChapters,
  fetchFullQuranText,
  fetchHizbVerseKeys,
  fetchJuzVerseKeys,
  fetchPageLayout,
  fetchSurahVerseKeys,
  fetchVersePage,
  fetchVerseSegments,
  type WordSegment,
  getReciter,
  isValidVerseKey,
  keysBetween,
  keysToEndOfQuran,
  parseQuranQuery,
  loadQcfFont,
  type QcfVariant,
  TAJWEED_COLORS,
  TAJWEED_LEGEND,
  verseAudioUrl,
  basmalaAudioUrl,
  withBasmalaBridges,
  BASMALA_BRIDGE_KEY,
  type Chapter,
  type PageVerse,
} from "@/lib/mushaf";
import { useLocalState, useFavorites } from "@/lib/storage";
import { usePreferences } from "@/lib/preferences";
import { fetchMokhtasarLessons, type MokhtasarPassage } from "@/lib/quran";
import { QuranDisplayModes } from "@/components/QuranDisplayModes";
import { BelowPanel } from "@/components/BelowPanel";
import { cachedAudioBlobUrl } from "@/lib/offline";
import { cn } from "@/lib/utils";
import { RUB_BOUNDS } from "@/data/rub-bounds";
import { KaabaIcon, MadinaMosqueIcon } from "@/components/PlaceIcons";

interface Search {
  r?: string;
  sel?: string;
  /** Āyah mise en évidence (vert) à l'arrivée depuis « Aller à… » : début d'un juz, hizb ou quart. */
  mark?: string;
  /** Portion "Mon Wird" partagée (lien direct, jamais le programme complet
   * ni aucune donnée personnelle de l'auteur — voir §"Partage Mon Wird") :
   * `shared=wird` + `end` = dernière page de la portion, la page de l'URL
   * elle-même étant déjà `startPage`. */
  end?: number;
  shared?: string;
}

/** Recherche en cours : liste ordonnée des résultats, position, page d'origine. */
interface SearchSession {
  query: string;
  keys: string[];
  index: number;
  origin: number;
}
let lastSearchSession: SearchSession | null = null;

export const Route = createFileRoute("/quran/page/$page")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    r: typeof s.r === "string" ? s.r : undefined,
    sel: typeof s.sel === "string" ? s.sel : undefined,
    mark: typeof s.mark === "string" ? s.mark : undefined,
    end: typeof s.end === "string" || typeof s.end === "number" ? Number(s.end) : undefined,
    shared: typeof s.shared === "string" ? s.shared : undefined,
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
type ReadMode = "ayah" | "page" | "pageToEnd" | "surahEnd" | "surah" | "juz" | "hizb" | "toEnd" | "range";

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const toArabic = (n: number) =>
  String(n)
    .split("")
    .map((d) => ARABIC_DIGITS[Number(d)])
    .join("");

const JUZ_ORDINALS_AR = ["", "الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر", "الحادي عشر", "الثاني عشر", "الثالث عشر", "الرابع عشر", "الخامس عشر", "السادس عشر", "السابع عشر", "الثامن عشر", "التاسع عشر", "العشرون", "الحادي والعشرون", "الثاني والعشرون", "الثالث والعشرون", "الرابع والعشرون", "الخامس والعشرون", "السادس والعشرون", "السابع والعشرون", "الثامن والعشرون", "التاسع والعشرون", "الثلاثون"];

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
  /** Page de départ RÉELLE de la portion "Mon Wird" partagée — capturée une
   * seule fois à l'arrivée sur le lien (`page` change ensuite à mesure que
   * l'utilisateur avance, `shared`/`end` restent mais plus rien ne donne le
   * point de départ d'origine dans l'URL). Jamais recalculée après. */
  const sharedStartPageRef = useRef<number | null>(null);
  if (search.shared === "wird" && sharedStartPageRef.current === null) {
    sharedStartPageRef.current = page;
  }
  const sharedStartPage = sharedStartPageRef.current;
  const { prefs, updateQuran } = usePreferences();
  // `search.r` (lien partagé) prévaut sur la préférence centrale, elle-même
  // le repli par défaut — jamais un retour silencieux au 1er récitateur.
  const reciterId = getReciter(search.r ?? prefs.quran.reciterId).id;

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

  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const [selected, setSelected] = useState<string[]>([]);
  const [showNav, setShowNav] = useState(false);
  const [navTab, setNavTab] = useState<NavTab>("surah");
  const openNav = (tab: NavTab) => {
    setNavTab(tab);
    setShowNav(true);
  };
  const [copied, setCopied] = useState(false);
  const [pageEditing, setPageEditing] = useState(false);
  const [searchNav, setSearchNav] = useState<SearchSession | null>(() => lastSearchSession);
  const updateSearchNav = (v: SearchSession | null) => {
    lastSearchSession = v;
    setSearchNav(v);
  };
  // Changement de page = fermeture de la sélection en cours — cette route
  // reste montée d'une page à l'autre (seul `page` change).
  useEffect(() => {
    setSelected([]);
  }, [page]);
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
      localStorage.setItem("quran-last-read-at", String(Date.now()));
    } catch {
      /* quota */
    }
  }, [page]);

  // Défi du vendredi (Al-Kahf) : chaque page de la sourate lue est comptée ;
  // la dernière page la termine et fait disparaître la pastille d'accueil.
  // Wird : arriver à la dernière page de la portion du jour la marque lue
  // (la carte « à faire » de l'accueil disparaît).
  useEffect(() => {
    try {
      const w = readJSON<WirdState | null>("adhkar:wird", null);
      if (!w) return;
      const next = effectiveSchedule(w).find((d) => d.day === w.lastCompletedDay + 1);
      if (next && page === next.endPage) writeJSON("adhkar:wird", { ...w, lastCompletedDay: next.day });
    } catch {
      /* stockage indisponible */
    }
  }, [page]);

  // Écran allumé sur le Mushaf (réglable dans les options de récitation).
  useWakeLock(prefs.quran.keepAwake);

  const { record: recordKahfPage } = useKahfChallenge();
  useEffect(() => {
    recordKahfPage(page);
  }, [page, recordKahfPage]);

  /* ------------------------------------------------------------- audio */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /**
   * Cause réelle de la coupure perceptible entre deux ayat : `load()` ne
   * déclenchait le téléchargement de l'ayah N+1 qu'à l'intérieur de
   * `onEnded`, une fois l'ayah N déjà terminée — le silence audible était
   * donc un temps réseau (latence CDN), jamais un silence naturel de la
   * récitation. Ce second élément `<audio>`, jamais attaché au DOM ni joué,
   * précharge l'ayah suivante pendant que l'ayah courante joue encore ; au
   * moment de `onEnded`, `load()` réutilise la même URL déjà en cache HTTP
   * du navigateur et démarre sans nouvelle attente réseau.
   */
  const preloadRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<string[]>([]);
  const [qIndex, setQIndex] = useState(0);
  /** Miroirs SYNCHRONES de la file courante : les callbacks audio (ended,
   * error) lisent toujours la session réelle, jamais une fermeture d'un
   * rendu précédent. `playbackSessionId` change à CHAQUE nouvelle commande
   * ou arrêt : tout résultat asynchrone (fetch sourate/juz'/hizb, retry) issu
   * d'une ancienne session est ignoré. */
  const queueRef = useRef<string[]>([]);
  const qIndexRef = useRef(0);
  const loopRef = useRef(false);
  const loadedKeyRef = useRef<string | null>(null);
  const playbackSessionId = useRef(0);
  const [playing, setPlaying] = useState(false);
  /** Dernière āyah lue ou étudiée : le ▶ y reprend quand elle est sur la page affichée. */
  const [resumeKey, setResumeKey] = useState<string | null>(null);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("nm-quran-resume");
      if (raw) setResumeKey((JSON.parse(raw) as { key?: string }).key ?? null);
    } catch {
      /* stockage indisponible */
    }
  }, []);
  const rememberPosition = (key: string | null) => {
    setResumeKey(key);
    try {
      if (key) window.localStorage.setItem("nm-quran-resume", JSON.stringify({ key, at: Date.now() }));
      else window.localStorage.removeItem("nm-quran-resume");
    } catch {
      /* stockage indisponible */
    }
  };
  const [progress, setProgress] = useState(0);
  const [loop, setLoop] = useState(false);
  /** Minshāwī et Husarī : surbrillance mot par mot seulement (pas d’āyah entière). */
  const wordSync = getReciter(reciterId).source === "quran";
  const [ayahRepeat, setAyahRepeat] = useState(1); // 1,3,5 ou 0 = ∞
  const [selRepeat, setSelRepeat] = useState(1); // 1,3,5 ou 0 = ∞
  // Vitesse persistée dans ⚙️ Paramètres > Coran — indépendante de la
  // vitesse Adhkār (§12 mission : quranPlaybackSpeed ≠ adhkarPlaybackSpeed).
  const speed = prefs.quran.speed;
  const setSpeed = (s: number) => updateQuran({ speed: s });
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [meditateOpen, setMeditateOpen] = useState(false);
  const { data: mkPassages } = useQuery({
    queryKey: ["mokhtasar-lessons"],
    queryFn: fetchMokhtasarLessons,
    staleTime: Infinity,
  });
  /** Position (dans le verset en cours de lecture) du mot récité : surbrillance
   * verte mot par mot. `null` tant que l'on ne sait pas. */
  const [curWord, setCurWord] = useState<number | null>(null);
  /** Dernier `load()` pour lequel l'enchaînement anticipé a déjà été déclenché. */
  const earlyFiredRef = useRef(-1);
  const onEndedRef = useRef<() => void>(() => {});

  /* --------------------------------------------- mode immersif (portrait
   * ET paysage, chantier "Plein écran paysage + Installation" §1) : un tap
   * sur le Mushaf masque/affiche l'en-tête et le bas de page, qui flottent
   * alors en overlay (translucide, jamais de reflow du texte dessous —
   * voir `fixed` + `translate` plus bas) au lieu de pousser le contenu.
   * Repli automatique après quelques secondes d'inactivité ; délai plus
   * court en paysage, où l'espace vertical est le plus précieux. Jamais
   * masqué pendant une interaction en cours (sélection, menu, recherche,
   * navigation, "Vivre cette page", plein écran) — l'utilisateur garde
   * alors toujours ses commandes sous les yeux. */
  const [controlsHidden, setControlsHidden] = useState(true);
  const hideTimerRef = useRef<number | null>(null);
  /** Fin de page atteinte (mode volet) : la barre du bas apparaît puis se replie. */
  const atEndRef = useRef(false);
  const panelModeEarly =
    (prefs.quran.belowSource ?? "none") !== "none" && (prefs.quran.belowMode ?? "panel") === "panel";
  const immersiveBlocked =
    (selected.length > 0 && !panelModeEarly) || optionsOpen || searchOpen || showNav || meditateOpen;
  const immersiveBlockedRef = useRef(immersiveBlocked);
  immersiveBlockedRef.current = immersiveBlocked;

  const clearHideTimer = () => {
    if (hideTimerRef.current != null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };
  const scheduleHide = () => {
    clearHideTimer();
    if (immersiveBlockedRef.current) return;
    const isLandscapeNow =
      typeof window !== "undefined" && window.matchMedia("(orientation: landscape)").matches;
    const delay = isLandscapeNow ? 1800 : 4000;
    hideTimerRef.current = window.setTimeout(() => setControlsHidden(true), delay);
  };
  const revealControls = () => {
    setControlsHidden(false);
    scheduleHide();
  };
  const toggleControls = () => {
    if (controlsHidden) revealControls();
    else {
      clearHideTimer();
      setControlsHidden(true);
    }
  };

  // Une interaction démarre (sélection/menu/panneau) : toujours ré-afficher
  // et suspendre le repli tant qu'elle dure ; une fois terminée, reprendre
  // le cycle normal d'auto-masquage.
  useEffect(() => {
    if (immersiveBlocked) {
      clearHideTimer();
      setControlsHidden(false);
    } else {
      scheduleHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immersiveBlocked]);

  useEffect(() => clearHideTimer, []);

  const [autoTurn, setAutoTurn] = useState(false);
  const [readMode, setReadMode] = useState<ReadMode>("toEnd");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const current = playing || queue.length ? queue[qIndex] : undefined;
  useEffect(() => {
    if (playing && current && current !== BASMALA_BRIDGE_KEY) rememberPosition(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, current]);
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

  const audioUrlForKey = (key: string) =>
    key === BASMALA_BRIDGE_KEY ? basmalaAudioUrl(reciterId) : verseAudioUrl(reciterId, key);

  /** Enchaînement SANS coupure audible : les 2 ayat suivantes sont
   * téléchargées EN ENTIER (blob local) pendant que l'ayah courante joue ;
   * au changement d'ayah la source est locale (aucune attente réseau, même
   * si le navigateur mobile ignore `preload`). Repli transparent sur l'URL
   * distante si le téléchargement échoue (CORS/réseau). */
  const blobCache = useRef(new Map<string, string>());
  const blobPending = useRef(new Set<string>());
  const prefetchBlob = (url: string) => {
    if (blobCache.current.has(url) || blobPending.current.has(url)) return;
    blobPending.current.add(url);
    cachedAudioBlobUrl(url)
      .then((local) => {
        if (local) {
          blobCache.current.set(url, local);
          return;
        }
        return fetch(url)
          .then((r) => (r.ok ? r.blob() : Promise.reject(new Error("audio"))))
          .then((b) => {
            blobCache.current.set(url, URL.createObjectURL(b));
          });
      })
      .catch(() => {
        /* repli : lecture directe de l'URL distante */
      })
      .finally(() => blobPending.current.delete(url));
  };
  const releaseBlobs = (keep: Set<string>) => {
    for (const [url, obj] of blobCache.current) {
      if (!keep.has(url)) {
        URL.revokeObjectURL(obj);
        blobCache.current.delete(url);
      }
    }
  };
  const playableUrl = (url: string) => blobCache.current.get(url) ?? url;

  const load = useCallback(
    (key: string, autoplay = true) => {
      const el = audioRef.current;
      if (!el || !key) return;
      const sessionId = ++loadSessionRef.current;
      loadedKeyRef.current = key;
      audioRetryRef.current = 0;
      const url = audioUrlForKey(key);
      const apply = (src: string) => {
        // Une source résolue après une commande plus récente est ignorée.
        if (loadSessionRef.current !== sessionId) return;
        el.src = src;
        el.load();
        el.playbackRate = speed;
        if (autoplay) {
          el.play().catch(() => {
            if (loadSessionRef.current === sessionId) setPlaying(false);
          });
        }
      };
      const mem = blobCache.current.get(url);
      if (mem) {
        apply(mem);
      } else if (typeof navigator !== "undefined" && !navigator.onLine) {
        // Hors ligne : copie téléchargée (Paramètres > Hors ligne), sinon URL.
        void cachedAudioBlobUrl(url).then((local) => {
          if (local) blobCache.current.set(url, local);
          apply(local ?? url);
        });
      } else {
        apply(url);
      }
    },
    [reciterId, speed],
  );

  // la vitesse reste active d'une ayah à l'autre
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  // Précharge l'ayah suivante de la file pendant que l'ayah courante joue —
  // voir le commentaire sur `preloadRef` plus haut. Ne joue jamais ce second
  // élément, ne touche jamais à `audioRef` (celui réellement audible).
  useEffect(() => {
    const wanted = new Set<string>();
    for (const k of [queue[qIndex], queue[qIndex + 1], queue[qIndex + 2]]) {
      if (k) wanted.add(audioUrlForKey(k));
    }
    releaseBlobs(wanted);
    for (const k of [queue[qIndex + 1], queue[qIndex + 2]]) if (k) prefetchBlob(audioUrlForKey(k));
    const nextKey = queue[qIndex + 1];
    if (!nextKey) return;
    let el = preloadRef.current;
    if (!el) {
      el = new Audio();
      el.preload = "auto";
      preloadRef.current = el;
    }
    const url = audioUrlForKey(nextKey);
    if (el.src !== url) {
      el.src = url;
      el.load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, qIndex, reciterId]);

  /**
   * Construit la file en appliquant la répétition par ayah puis par
   * sélection. `skipSelRepeat` ignore la répétition de sélection pour une
   * lecture continue/jusqu'à la fin du Coran (répéter une liste qui va
   * jusqu'à la fin du Coran n'a pas de sens) — la répétition par ayah,
   * elle, reste active dans tous les modes.
   */
  /** Une seule tentative de reprise par ayah avant de passer à la suivante —
   * jamais de boucle infinie sur un fichier durablement indisponible. */
  const audioRetryRef = useRef(0);

  /** Invalide TOTALEMENT la session audio en cours : file, index, source,
   * position, préchargement, surbrillance, callbacks et retries en attente. */
  const resetPlayback = () => {
    playbackSessionId.current += 1;
    loadSessionRef.current += 1;
    activeQueueContext.current = null;
    queueRef.current = [];
    qIndexRef.current = 0;
    loopRef.current = false;
    loadedKeyRef.current = null;
    audioRetryRef.current = 0;
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
    const pre = preloadRef.current;
    if (pre) {
      pre.removeAttribute("src");
      pre.load();
    }
    releaseBlobs(new Set());
    setQueue([]);
    setQIndex(0);
    setPlaying(false);
    setProgress(0);
    setLoop(false);
  };

  const start = (keys: string[], opts?: { turnPages?: boolean; skipSelRepeat?: boolean }) => {
    if (!keys.length) return;
    // NOUVELLE commande : l'ancienne session est entièrement invalidée avant
    // de construire la nouvelle file — jamais de reprise silencieuse.
    resetPlayback();
    activeQueueContext.current = selectionSignature();
    const perAyah = ayahRepeat > 1 ? ayahRepeat : 1;
    // Le pont Basmala (voir withBasmalaBridges) ne doit jamais être répété
    // par la répétition PAR AYAH — seule l'ayah qui le suit l'est.
    let full = withBasmalaBridges(keys).flatMap((k) =>
      k === BASMALA_BRIDGE_KEY ? [k] : Array.from({ length: perAyah }, () => k),
    );
    const applySelRepeat = !opts?.skipSelRepeat;
    if (applySelRepeat && selRepeat > 1) {
      full = Array.from({ length: selRepeat }, () => full).flat();
    }
    queueRef.current = full;
    qIndexRef.current = 0;
    loopRef.current = applySelRepeat && selRepeat === 0;
    setLoop(loopRef.current);
    setAutoTurn(!!opts?.turnPages);
    setQueue(full);
    setQIndex(0);
    setPlaying(true);
    setOptionsOpen(false);
    load(full[0]);
  };

  const toggle = () => {
    const el = audioRef.current;
    if (!el || !queueRef.current.length) return;
    if (el.paused) {
      el.play().catch(() => setPlaying(false));
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const step = (d: number) => {
    const next = qIndexRef.current + d;
    if (next < 0 || next >= queueRef.current.length) return;
    qIndexRef.current = next;
    setQIndex(next);
    load(queueRef.current[next], true);
    setPlaying(true);
  };

  // changement de récitateur en cours de lecture
  useEffect(() => {
    if (queueRef.current.length && audioRef.current) {
      const wasPlaying = playing;
      load(queueRef.current[qIndexRef.current], wasPlaying);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reciterId]);

  /** Tourne la page quand la récitation quitte la page affichée. */
  const followKey = (key: string) => {
    if (!autoTurn || !verses?.length) return;
    if (key === BASMALA_BRIDGE_KEY) return; // pont Basmala : jamais de tourne-page
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
    qIndexRef.current = i;
    setQIndex(i);
    load(queueRef.current[i]);
    followKey(queueRef.current[i]);
  };

  /** Avance à l'ayah suivante de la SESSION ACTUELLE, boucle, ou arrête
   * proprement — partagé par la fin normale (onEnded) et l'abandon après
   * échec réseau (onAudioError). */
  const advanceQueue = () => {
    const len = queueRef.current.length;
    if (!len) return;
    if (qIndexRef.current + 1 < len) goTo(qIndexRef.current + 1);
    else if (loopRef.current) goTo(0);
    else {
      rememberPosition(null); // lecture terminée : rien à reprendre
      resetPlayback(); // fin de file : arrêt propre, plus aucune surbrillance
    }
  };

  const lastProgressRef = useRef<{ t: number; at: number }>({ t: -1, at: 0 });
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const el = audioRef.current;
      if (!el || el.paused || el.ended || !queueRef.current.length) return;
      const now = Date.now();
      if (el.currentTime !== lastProgressRef.current.t) {
        lastProgressRef.current = { t: el.currentTime, at: now };
        return;
      }
      if (now - lastProgressRef.current.at > 8000) {
        // Lecture figée (réseau) : recharge la même source à la même position.
        const t = el.currentTime;
        const sessionId = loadSessionRef.current;
        el.load();
        el.currentTime = t;
        el.play().catch(() => {
          if (loadSessionRef.current === sessionId) setPlaying(false);
        });
        lastProgressRef.current = { t: -1, at: now };
      }
    }, 2000);
    return () => window.clearInterval(id);
  }, [playing]);

  const onAudioError = () => {
    const el = audioRef.current;
    const failedKey = queueRef.current[qIndexRef.current];
    // Erreur d'une source qui n'est plus celle de la session (ancienne
    // commande, reset) : ignorée.
    if (!el || !failedKey || loadedKeyRef.current !== failedKey) return;
    const sessionId = loadSessionRef.current;
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("[audio] erreur de lecture", {
        verseKey: failedKey,
        src: el.currentSrc || el.src,
        errorCode: el.error?.code,
        retry: audioRetryRef.current,
      });
    }
    if (audioRetryRef.current < 1) {
      audioRetryRef.current += 1;
      window.setTimeout(() => {
        if (loadSessionRef.current !== sessionId) return;
        el.load();
        el.play().catch(() => {
          if (loadSessionRef.current === sessionId) {
            audioRetryRef.current = 0;
            advanceQueue();
          }
        });
      }, 400);
      return;
    }
    audioRetryRef.current = 0;
    advanceQueue();
  };

  /**
   * Mot récité + enchaînement anticipé. Le temps de lecture du fichier est lu
   * à chaque image (les événements `timeupdate` sont trop espacés pour suivre
   * un mot). Surbrillance mot par mot uniquement avec les segments exacts de
   * l'API (Minshāwī, Husarī) ; pour les autres récitateurs, l'ayah entière.
   * Enchaînement : on passe à l'ayah suivante dès que la voix s'est arrêtée
   * (fin du dernier segment + marge, ou fin du fichier − 0,2 s) au lieu
   * d'attendre le silence qui termine le fichier.
   */
  useEffect(() => {
    if (!playing || !current) {
      setCurWord(null);
      return;
    }
    const key = current;
    const isBridge = key === BASMALA_BRIDGE_KEY;
    let cancelled = false;
    let raf = 0;
    let segs: WordSegment[] | null = null;
    let ready = false;
    void fetchVerseSegments(reciterId, isBridge ? "1:1" : key).then((s) => {
      segs = s;
      ready = true;
    });
    const tick = () => {
      if (cancelled) return;
      const el = audioRef.current;
      if (el && ready && !el.paused && loadedKeyRef.current === key && el.currentTime > 0) {
        const t = el.currentTime * 1000;
        const dur = Number.isFinite(el.duration) ? el.duration * 1000 : 0;
        let pos: number | null = null;
        if (!isBridge) {
          if (segs?.length) {
            for (const [p, start] of segs) {
              if (t >= start) pos = p;
              else break;
            }
          }
          setCurWord((prev) => (prev === pos ? prev : pos));
        }
        const endAt = segs?.length ? segs[segs.length - 1][2] + 120 : dur > 0 ? dur - 200 : Infinity;
        if (t >= endAt && earlyFiredRef.current !== loadSessionRef.current) {
          earlyFiredRef.current = loadSessionRef.current;
          onEndedRef.current();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      setCurWord(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, current, reciterId]);

  const onEnded = () => {
    const key = queueRef.current[qIndexRef.current];
    // « ended » d'une ancienne source/session : ignoré.
    if (!key || loadedKeyRef.current !== key) return;
    audioRetryRef.current = 0;
    if (ayahRepeat === 0) {
      load(key); // ∞ sur l'ayah en cours
      return;
    }
    advanceQueue();
  };

  onEndedRef.current = onEnded;

  /* --------------------------------------------------------- sélection */
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
  const goToSearchResult = async (key: string, ctx?: { query: string; keys: string[] }) => {
    setSearchNavigating(key);
    try {
      const targetPage = await fetchVersePage(key);
      if (ctx) {
        updateSearchNav({
          query: ctx.query,
          keys: ctx.keys,
          index: Math.max(0, ctx.keys.indexOf(key)),
          origin: page,
        });
      }
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
  const goSearchResult = (i: number) => {
    if (!searchNav || i < 0 || i >= searchNav.keys.length) return;
    updateSearchNav({ ...searchNav, index: i });
    void goToSearchResult(searchNav.keys[i]);
  };

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

  /**
   * Partage riche d'une ayah (§6 menu ayah) : texte arabe exact + traduction
   * française validée (Hamidullah, même source que partout ailleurs) +
   * sourate + numéro + lien existant — jamais de Tafsir/mérite/texte généré.
   */
  /** COPIER = exactement les couches affichées. Ici : Mushaf (arabe) → référence
   * + arabe seulement (Français/Phonétique basculent vers le lecteur ayah par
   * ayah, jamais dans cette vue). Sélection native d'une partie du texte
   * inchangée (appui long). */
  const copySelectedVerse = async () => {
    const v = verses?.find((x) => x.key === selKey);
    if (!v) return;
    try {
      await navigator.clipboard.writeText(`${v.key}\n\n${v.arabic}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* refusé */
    }
  };

  const studySelectedVerse = (key: string) => {
    rememberPosition(key);
    const [s, a] = key.split(":");
    navigate({
      to: "/etude/$surah/$ayah",
      params: { surah: s, ayah: a },
      search: { fromPage: String(page), r: reciterId, sel: key },
    });
  };

  const shareSelectedVerse = async (key: string) => {
    const v = verses?.find((vv) => vv.key === key);
    if (!v) return;
    const [s, a] = key.split(":").map(Number);
    const meta = chapters?.find((c) => c.id === s);
    const hamidullah = await fetchHamidullahAyah(s, a).catch(() => null);
    const link = buildLink(key);
    const label = meta ? `${meta.nameFrench} — ${key}` : key;
    const text = [v.arabic, hamidullah?.translation, label, link].filter(Boolean).join("\n\n");
    try {
      if (navigator.share) await navigator.share({ text, url: link });
      else {
        await navigator.clipboard.writeText(text);
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
  // Texte des capsules du haut centré sur l'encre (pas sur la boîte de ligne).
  const surahChipInk = useInkOffset(surahMeta?.nameArabic ?? "", '"Amiri Quran"');
  const juzChipText = `الجزء ${verses?.[0]?.juz ?? ""}`;
  const juzChipInk = useInkOffset(juzChipText, '"Amiri Quran"');

  /** Bascule automatique vers le mode ayah-par-ayah (§3/§4 mission "Coran
   * direct") : dès que Français ou Phonétique est activé, plus de message
   * demandant d'ouvrir ce mode — on y navigue directement, sur la sourate
   * affichée (position préservée au mieux, voir §15). */
  useEffect(() => {
    if (!verses?.length) return; // sourate pas encore connue, jamais naviguer à l'aveugle
    if (prefs.quran.belowMode === "ayah") {
      navigate({ to: "/quran/lire/$surah", params: { surah: String(surahOnPage) } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs.quran.belowMode, prefs.quran.belowSource, verses?.length]);

  /* ------------------------------------------- volet « sous le Mushaf »
   * L'āyah traduite en bas est TOUJOURS celle qui est surlignée dans la page :
   * pendant la récitation, l'āyah en cours ; sinon l'āyah sélectionnée. */
  const belowSource = prefs.quran.belowSource ?? "none";
  const belowPanelOn = belowSource !== "none" && (prefs.quran.belowMode ?? "panel") === "panel";
  const playingKey = current && current !== BASMALA_BRIDGE_KEY ? current : undefined;
  const startKey = resumeKey && verses?.some((v) => v.key === resumeKey) ? resumeKey : verses?.[0]?.key;
  const focusKey = playing ? (playingKey ?? selected[0] ?? startKey) : (selected[0] ?? playingKey ?? startKey);
  const [belowH, setBelowH] = useState(0);
  const belowVisible = belowPanelOn && !!focusKey;
  // Garde l'āyah suivie visible au-dessus du volet.
  useEffect(() => {
    if (!belowVisible || !focusKey) return;
    const box = boxRef.current;
    const el = box?.querySelector<HTMLElement>(`[data-word-key="${focusKey}"]`);
    if (!box || !el) return;
    const r = el.getBoundingClientRect();
    const visibleBottom = window.innerHeight - belowH - 8;
    if (r.bottom > visibleBottom || r.top < 56) {
      box.scrollBy({ top: r.top - Math.max(80, visibleBottom / 3), behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey, belowVisible, verses?.length]);

  /** Ayah de référence : la 1re sélectionnée, sinon la 1re de la page. */
  /** Sans sélection : l’āyah mémorisée, si elle est sur cette page. */
  const resumeVerse = !selected.length && resumeKey ? verses?.find((v) => v.key === resumeKey) : undefined;
  const anchorVerse =
    (selected.length ? verses?.find((v) => v.key === selected[0]) : (resumeVerse ?? verses?.[0])) ?? verses?.[0];
  const anchor = {
    key: anchorVerse?.key ?? "",
    surah: anchorVerse?.surah ?? surahOnPage,
    juz: anchorVerse?.juz ?? 1,
    hizb: anchorVerse?.hizb ?? 1,
  };

  /** Points à méditer (Tafsīr al-Mukhtasar) des passages qui touchent cette page. */
  const pagePassages = useMemo(
    () =>
      (mkPassages ?? []).filter((p) =>
        (verses ?? []).some((v) => v.surah === p.surah && v.ayah >= p.from && v.ayah <= p.to),
      ),
    [mkPassages, verses],
  );

  /** Sourates présentes sur la page (ex. fin d'Al-Isrā' + début d'Al-Kahf). */
  const pageSurahs = useMemo(
    () => Array.from(new Set((verses ?? []).map((v) => v.surah))),
    [verses],
  );
  /** Sourate choisie explicitement quand la page en contient plusieurs. */
  const [surahPick, setSurahPick] = useState<number | null>(null);
  /** « Cette sourate » : la sourate de l'āyah sélectionnée, sinon le choix
   * explicite, sinon celle de la page. */
  const scopeSurah = selected.length
    ? anchor.surah
    : surahPick != null && pageSurahs.includes(surahPick)
      ? surahPick
      : surahOnPage;

  /** Signature des PARAMÈTRES de la commande (jamais dérivée de la page
   * affichée : tourner la page en cours de lecture ne doit pas ressembler à
   * une nouvelle commande). */
  const selectionSignature = () =>
    readMode === "range"
      ? `range|${rangeStart}|${rangeEnd}|${ayahRepeat}|${selRepeat}`
      : `${readMode}|${selected[0] ?? "-"}|${readMode === "surah" ? scopeSurah : "-"}|${ayahRepeat}|${selRepeat}`;

  /**
   * Vrai uniquement si la file en cours correspond à la commande affichée ET
   * que l'on regarde encore là où elle joue (ou qu'elle joue) : seul cas où
   * ▶ = Pause → Play (reprise exacte). Toute nouvelle sélection, ou une page
   * quittée pendant une pause, est une NOUVELLE commande.
   */
  const isCurrentSession =
    queue.length > 0 &&
    activeQueueContext.current === selectionSignature() &&
    (playing || !!verses?.some((v) => v.key === queue[qIndex]));

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

  /** « Cette sourate » = de sa PREMIÈRE à sa DERNIÈRE āyah (jamais depuis le
   * début de la page ni depuis l'āyah sélectionnée). */
  const playSurahFromAnchor = async () => {
    resetPlayback();
    const token = playbackSessionId.current;
    const all = await fetchSurahVerseKeys(scopeSurah);
    if (playbackSessionId.current !== token) return; // une commande plus récente a pris le relais
    start(all, { turnPages: true });
  };

  /** De l’āyah choisie JUSQU’À LA FIN de sa sourate (reprise après l’étude). */
  const playSurahEndFromAnchor = async () => {
    if (!anchor.key) return;
    resetPlayback();
    const token = playbackSessionId.current;
    const all = await fetchSurahVerseKeys(anchor.surah);
    if (playbackSessionId.current !== token) return;
    const idx = all.indexOf(anchor.key);
    start(all.slice(idx < 0 ? 0 : idx), { turnPages: true });
  };

  const playJuzFromAnchor = async () => {
    resetPlayback();
    const token = playbackSessionId.current;
    const all = await fetchJuzVerseKeys(anchor.juz);
    if (playbackSessionId.current !== token) return;
    const idx = all.indexOf(anchor.key);
    start(all.slice(idx < 0 ? 0 : idx), { turnPages: true });
  };

  const playHizbFromAnchor = async () => {
    resetPlayback();
    const token = playbackSessionId.current;
    const all = await fetchHizbVerseKeys(anchor.hizb);
    if (playbackSessionId.current !== token) return;
    const idx = all.indexOf(anchor.key);
    start(all.slice(idx < 0 ? 0 : idx), { turnPages: true });
  };

  /** Du début de la page affichée jusqu'à la fin du Coran. */
  const playPageToEnd = () => {
    const first = verses?.[0]?.key;
    if (!chapters || !first) return;
    start(keysToEndOfQuran(first, chapters), { turnPages: true, skipSelRepeat: true });
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
      case "pageToEnd":
        playPageToEnd();
        return;
      case "surahEnd":
        void playSurahEndFromAnchor();
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

  /* ------------------------------------- ajustement à la largeur d'écran */
  const boxRef = useRef<HTMLDivElement>(null);
  const fitBoxRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [fontPx, setFontPx] = useState(26);
  /**
   * Cause réelle du texte trop petit sur mobile : l'ancien réglage "Taille
   * du Mushaf" rétrécissait la boîte de calcul par `zoom` PUIS agrandissait
   * le rendu par exactement le même facteur (`transform: scale(zoom)`) — les
   * deux s'annulaient mathématiquement, donc A+/A- ne changeait jamais rien
   * à l'écran (vérifié en direct : même taille de mot en pixels à 100 % et
   * 115 %). En plus, l'ancien fit visait à faire tenir les 15 lignes ENTIÈRES
   * de la page dans la hauteur d'écran SANS jamais faire défiler — sur un
   * mobile dense en texte, c'est la hauteur (pas la largeur) qui limitait la
   * taille, souvent bien en dessous de ce que la largeur autoriserait.
   *
   * Correction : `ceilingFontPx` est désormais calculé sur la LARGEUR
   * réelle uniquement (aucune ligne ne doit jamais déborder horizontalement
   * — c'est la seule contrainte de fidélité non négociable) ; la hauteur
   * n'est plus un facteur qui rétrécit le texte. Si le résultat dépasse la
   * hauteur d'écran, la page défile verticalement (voir `overflow-y-auto`
   * plus bas) au lieu d'être invisible/coupée par un `overflow:hidden`.
   * "Standard/Grand/Très grand" appliquent ensuite une simple fraction ≤ 1
   * de ce plafond — toujours sûr, jamais de dépassement horizontal possible
   * puisqu'on ne fait que réduire depuis la valeur qui tient exactement.
   */
  const [ceilingFontPx, setCeilingFontPx] = useState(26);
  /** `readingSize` sémantique (normal/large/xlarge) vient du centre unique
   * ⚙️ Paramètres > Coran (src/lib/preferences.ts) — partagée avec l'Adhkār
   * et le lecteur ayah-par-ayah, mais chaque écran l'applique différemment
   * (§9 mission) : ici, une fraction sûre du plafond de largeur du Mushaf. */
  const TEXT_SIZE_LEVELS = [
    { key: "normal" as const, value: 0.97, label: "Standard" },
    { key: "large" as const, value: 1, label: "Grand" },
    { key: "xlarge" as const, value: 1, label: "Très grand" },
  ] as const;
  const textSize =
    TEXT_SIZE_LEVELS.find((l) => l.key === prefs.quran.textSize)?.value ?? TEXT_SIZE_LEVELS[1].value;
  const setTextSize = (key: (typeof TEXT_SIZE_LEVELS)[number]["key"]) => updateQuran({ textSize: key });
  /** Toujours à jour pour que `fit()` (fermeture recréée seulement quand
   * `lines` change) lise le niveau de taille courant sans figurer dans ses
   * dépendances — un changement de taille seul ne doit jamais refaire la
   * recherche en largeur, voir l'effet séparé plus bas. */
  const textSizeRef = useRef(textSize);
  textSizeRef.current = textSize;
  /** Couche visuelle uniquement (couleurs) — jamais de reflow, jamais de
   * changement de line_number/texte/ordre. Voir src/lib/mushaf.ts. */
  const tajweedMode = prefs.quran.tajweed;
  const setTajweedMode = (v: boolean) => updateQuran({ tajweed: v });

  /** Police officielle de la page (KFGQPC « QCF » v2 = noir, v4 = Tajwīd en
   * couleurs, mêmes glyphes) : chaque mot est un glyphe imprimé, donc mêmes
   * formes et mêmes justifications que le Mushaf papier. Rien n'est affiché
   * tant que la police de CETTE page n'est pas chargée. */
  const qcfVariant: QcfVariant = tajweedMode ? "v4" : "v2";
  const [qcfLoadedName, setQcfLoadedName] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    setQcfLoadedName(null);
    loadQcfFont(page, qcfVariant)
      .catch(() => loadQcfFont(page, "v2")) // Tajwīd indisponible : même page en noir
      .then((name) => {
        if (!cancelled) setQcfLoadedName(name);
      })
      .catch(() => {
        /* hors ligne sans police en cache : le Mushaf attend la connexion */
      });
    return () => {
      cancelled = true;
    };
  }, [page, qcfVariant]);
  const qcfName = qcfLoadedName && qcfLoadedName.endsWith(`_p${page}`) ? qcfLoadedName : null;
  // Pages voisines préchargées (texte + police) : le tap sur un bord tourne la
  // page sans attente. Léger : 3 pages, seulement quand la page courante est prête.
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!layout) return;
    for (const p of [page + 1, page - 1, page + 2]) {
      if (p < 1 || p > 604) continue;
      void queryClient.prefetchQuery({
        queryKey: ["mushaf-layout", p],
        queryFn: () => fetchPageLayout(p),
        staleTime: Infinity,
      });
      loadQcfFont(p, qcfVariant).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, !!layout, qcfVariant]);
  const centeredPage = page <= 2;

  useLayoutEffect(() => {
    const box = boxRef.current;
    const fitBox = fitBoxRef.current;
    const sheet = sheetRef.current;
    if (!box || !fitBox || !sheet || !lines?.length) return;
    if (!qcfName) {
      sheet.style.visibility = "hidden";
      return;
    }
    let raf = 0;
    let cancelled = false;
    // scrollWidth === clientWidth dès qu'une ligne tient (pas de "marge"
    // native à lire ici) : on cherche donc d'abord la taille maximale qui
    // tient exactement en LARGEUR, puis on recule d'un petit pourcentage
    // pour ne jamais laisser un mot/haraka effleurer le bord de la ligne.
    // La hauteur n'est plus vérifiée ici : un dépassement vertical fait
    // défiler la page (voir overflow-y-auto), jamais rétrécir le texte.
    // Glyphes imprimés : la ligne la plus large occupe presque toute la largeur
    // (marge 0,5 % seulement) ; les autres lignes ont déjà quasi la même largeur
    // naturelle (justification gravée dans la police).
    const SAFE_FACTOR = 0.995;
    const fitsWidth = () => {
      const rows = sheet.querySelectorAll<HTMLElement>("[data-mushaf-line]");
      for (const r of rows) if (r.scrollWidth > r.clientWidth) return false;
      return true;
    };
    const fit = () => {
      if (cancelled) return;
      // En portrait, la largeur reste plafonnée (comme l'ancien max-w-2xl) ;
      // en paysage, le Mushaf utilise toute la largeur réellement disponible.
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
      // `box.clientWidth` INCLUT le padding horizontal de `box` (px-1.5) —
      // ce n'est pas la largeur réellement disponible pour son contenu.
      // Cause du bug de contenu coupé (ex. page 3) : la boîte virtuelle
      // héritait de la largeur totale (padding compris), débordait donc de
      // exactement ce padding hors du cadre réel de `box`, et se faisait
      // rogner par son `overflow-hidden` — un mot/diacritique entier pouvait
      // disparaître à droite selon la ligne. Retirer le padding réel (lu
      // dynamiquement, jamais une valeur codée en dur) avant de calculer la
      // largeur effective corrige la cause exacte, pour toutes les pages.
      const boxStyle = window.getComputedStyle(box);
      const boxPaddingX = parseFloat(boxStyle.paddingLeft) + parseFloat(boxStyle.paddingRight);
      const boxContentWidth = box.clientWidth - boxPaddingX;
      const effectiveWidth = isLandscape
        ? Math.min(boxContentWidth, LANDSCAPE_MAX_WIDTH_PX)
        : Math.min(boxContentWidth, PORTRAIT_MAX_WIDTH_PX);
      // Les 15 lignes doivent tenir dans la hauteur de l'écran, sans défiler :
      // la boîte prend exactement la hauteur disponible et on mesure son
      // débordement. Sur un téléphone en paysage (écran très bas) le texte
      // deviendrait illisible : on y garde le défilement.
      const boxPaddingY = parseFloat(boxStyle.paddingTop) + parseFloat(boxStyle.paddingBottom);
      // Avec le volet de traduction (style Ayat) : toute la largeur est utilisée,
      // la page défile verticalement et le volet la recouvre par le bas.
      const fitHeight = !belowPanelOn && !tajweedMode && !(isLandscape && window.innerHeight < 600);
      if (fitHeight) fitBox.style.height = `${box.clientHeight - boxPaddingY}px`;
      else fitBox.style.height = "";
      const fitsHeight = () => !fitHeight || fitBox.scrollHeight <= fitBox.clientHeight + 1;
      const widthSearch = () => {
        let lo = 8;
        let hi = 60;
        let best = lo;
        for (let i = 0; i < 10; i++) {
          const mid = (lo + hi) / 2;
          sheet.style.fontSize = `${mid}px`;
          if (fitsWidth()) {
            best = mid;
            lo = mid;
          } else hi = mid;
        }
        return Math.max(8, best * SAFE_FACTOR);
      };
      fitBox.style.width = `${effectiveWidth}px`;
      sheet.style.setProperty("--lh", "1.9");
      let ceiling = widthSearch();
      sheet.style.fontSize = `${ceiling}px`;
      // D'abord resserrer l'interligne (1,9 → 1,5) : le texte garde sa taille.
      for (const lh of [1.75, 1.6, 1.5]) {
        if (fitsHeight()) break;
        sheet.style.setProperty("--lh", String(lh));
      }
      if (!fitsHeight()) {
        // Limité par la hauteur : plus grande taille qui tient, puis page
        // rétrécie dans la même proportion (mêmes espaces entre les mots,
        // page centrée) au lieu d'étirer les lignes sur toute la largeur.
        let lo = 8;
        let hi = ceiling;
        let bestH = lo;
        for (let i = 0; i < 10; i++) {
          const mid = (lo + hi) / 2;
          sheet.style.fontSize = `${mid}px`;
          if (fitsHeight()) {
            bestH = mid;
            lo = mid;
          } else hi = mid;
        }
        fitBox.style.width = `${Math.floor((effectiveWidth * bestH) / ceiling)}px`;
        ceiling = Math.min(widthSearch(), bestH * 1.02);
        sheet.style.fontSize = `${ceiling}px`;
        for (let k = 0; k < 12 && !fitsHeight(); k++) {
          ceiling *= 0.98;
          sheet.style.fontSize = `${ceiling}px`;
        }
      }
      setCeilingFontPx(ceiling);
      const safe = ceiling * textSizeRef.current;
      sheet.style.fontSize = `${safe}px`;
      setFontPx(safe);
    };
    // 1er passage immédiat (police de repli le temps du chargement), puis
    // recalcul dès que "Amiri Quran" est réellement disponible : sans cela,
    // le fit se base sur les métriques de la police de secours et le texte
    // peut déborder/être coupé une fois le swap de police effectué (FOUT).
    // Rien n'est montré tant que la police n'est pas chargée ET mesurée : aucun
    // rendu intermédiaire avec les métriques de la police de secours (qui
    // pourrait déborder ou changer de taille à l'écran).
    sheet.style.visibility = "hidden";
    const reveal = () => {
      if (!cancelled) sheet.style.visibility = "visible";
    };
    const revealTimer = window.setTimeout(reveal, 2500);
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        if (cancelled) return;
        requestAnimationFrame(() => {
          fit();
          reveal();
        });
      });
    } else {
      raf = requestAnimationFrame(() => {
        fit();
        reveal();
      });
    }
    // Observe la boîte RÉELLE : redimensionnement de fenêtre ET rotation
    // portrait/paysage déclenchent tous les deux un recalcul du fitting.
    const onFontsDone = () => {
      if (!cancelled) requestAnimationFrame(fit);
    };
    document.fonts?.addEventListener?.("loadingdone", onFontsDone);
    const ro = new ResizeObserver(() => {
      if (!cancelled) requestAnimationFrame(fit);
    });
    ro.observe(box);
    return () => {
      cancelled = true;
      window.clearTimeout(revealTimer);
      document.fonts?.removeEventListener?.("loadingdone", onFontsDone);
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // `textSize` ne redéclenche PAS la recherche en largeur (le plafond ne
    // dépend que de l'écran/police) — voir l'effet séparé ci-dessous qui se
    // contente de réappliquer `ceilingFontPx * textSize`, instantané.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, qcfName, belowPanelOn, tajweedMode]);

  // Changement de "Standard/Grand/Très grand" : pas besoin de refaire la
  // recherche en largeur, seulement réappliquer la fraction du plafond déjà
  // connu — instantané, jamais de reflow différent.
  useEffect(() => {
    if (sheetRef.current) sheetRef.current.style.fontSize = `${ceilingFontPx * textSize}px`;
    setFontPx(ceilingFontPx * textSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textSize, ceilingFontPx]);

  /* ------------------------------------------------------------- swipe
   * (§21 mission "Coran direct") : l'appui long ne sélectionne plus rien
   * lui-même — il retombe sur la sélection de texte NATIVE du téléphone/
   * navigateur (voir la suppression de `mushaf-no-callout`/user-select
   * plus bas), pour permettre de copier une partie précise du texte avec
   * le "Copier" système. Seul un TAP court ouvre encore la barre d'actions
   * de l'application (onWordClick, inchangé). */
  const gesture = useRef({ x: 0, y: 0 });

  const goPage = (delta: number) =>
    navigate({
      to: "/quran/page/$page",
      params: { page: String(clampPage(page + delta)) },
      // La navigation normale (précédent/suivant, clavier, swipe) doit
      // continuer à traverser toute la portion "Mon Wird" partagée — jamais
      // perdre `shared`/`end` en cours de route (§3/§4 partage Wird).
      search: { r: reciterId, shared: search.shared, end: search.end },
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
        if (selected.length) setSelected([]);
        else if (optionsOpen) setOptionsOpen(false);
        else if (searchOpen) setSearchOpen(false);
        else if (showNav) setShowNav(false);
        else if (meditateOpen) setMeditateOpen(false);
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
  }, [selected.length, optionsOpen, searchOpen, showNav, meditateOpen]);

  /* ------------------------------------------------------------- gestes
   * TAP = commandes générales (jamais de sélection) ; APPUI LONG sur une
   * āyah = sélection + barre d'actions ; SWIPE = page ; PINCH = zoom natif
   * du navigateur (aucun zoom maison). Un appui long est annulé si le doigt
   * bouge (scroll/swipe), si un second doigt arrive (pinch) ou s'il est
   * relâché avant le seuil ; après un appui long réussi ou un swipe/pinch,
   * le « click » synthétique qui suit est ignoré (pas de double déclenchement). */
  const LONG_PRESS_MS = 500;
  const LONG_PRESS_SLOP_PX = 10;
  const longPress = useRef<{ timer: number | null; fired: boolean }>({ timer: null, fired: false });
  const multiTouch = useRef(false);
  const suppressClickUntil = useRef(0);
  const touchContextUntil = useRef(0);
  const clearLongPress = () => {
    if (longPress.current.timer != null) {
      window.clearTimeout(longPress.current.timer);
      longPress.current.timer = null;
    }
  };
  const wordKeyOf = (target: EventTarget | null) =>
    (target as HTMLElement | null)?.closest<HTMLElement>("[data-word-key]")?.dataset.wordKey;

  const onSheetTouchStart = (e: React.TouchEvent) => {
    touchContextUntil.current = Date.now() + 1500;
    if (e.touches.length > 1) {
      multiTouch.current = true;
      clearLongPress();
      return;
    }
    multiTouch.current = false;
    longPress.current.fired = false;
    clearLongPress();
    const t = e.touches[0];
    gesture.current.x = t.clientX;
    gesture.current.y = t.clientY;
    const key = wordKeyOf(e.target);
    if (!key) return;
    longPress.current.timer = window.setTimeout(() => {
      longPress.current.timer = null;
      longPress.current.fired = true;
      try {
        navigator.vibrate?.(12);
      } catch {
        /* indisponible */
      }
      setSelected([key]);
    }, LONG_PRESS_MS);
  };

  const onSheetTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 1) {
      multiTouch.current = true;
      clearLongPress();
      return;
    }
    const t = e.touches[0];
    if (Math.hypot(t.clientX - gesture.current.x, t.clientY - gesture.current.y) > LONG_PRESS_SLOP_PX) {
      clearLongPress();
    }
  };

  const onSheetTouchCancel = () => {
    clearLongPress();
    multiTouch.current = false;
  };

  const onSheetTouchEnd = (e: React.TouchEvent) => {
    clearLongPress();
    touchContextUntil.current = Date.now() + 1500;
    if (e.touches.length > 0) return; // pinch en cours : d'autres doigts restent posés
    if (multiTouch.current) {
      multiTouch.current = false;
      suppressClickUntil.current = Date.now() + 500;
      return;
    }
    if (longPress.current.fired) {
      suppressClickUntil.current = Date.now() + 500;
      e.preventDefault();
      return;
    }
    const t = e.changedTouches[0];
    const dx = t.clientX - gesture.current.x;
    const dy = t.clientY - gesture.current.y;
    // Seuil élevé + ratio horizontal dominant : un scroll vertical ne doit
    // jamais être interprété comme un changement de page.
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      suppressClickUntil.current = Date.now() + 500;
      e.preventDefault();
      // Swipe vers la droite = page suivante ; swipe vers la gauche = page
      // précédente (volontairement indépendant du sens des boutons).
      goPage(dx > 0 ? 1 : -1);
    }
  };

  /** Tap/clic simple : ferme la sélection s'il y en a une, sinon bascule les
   * commandes générales. Ne sélectionne JAMAIS une āyah, même sur un mot. */
  const onSheetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (Date.now() < suppressClickUntil.current) return;
    if (selected.length) {
      setSelected([]);
      setControlsHidden(true);
      return;
    }
    // Bords de l'écran : tap à gauche = page suivante, à droite = précédente
    // (sens de lecture de droite à gauche) ; le centre affiche/masque la barre.
    const w = e.currentTarget.clientWidth;
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
    if (x < w * 0.2) return void goPage(1);
    if (x > w * 0.8) return void goPage(-1);
    toggleControls();
  };

  /** Texte du Mushaf : jamais de sélection native (poignées bleues, menu
   * système). Clic droit souris = sélection de l'āyah (équivalent desktop de
   * l'appui long) ; sur un écran tactile, c'est le timer ci-dessus qui fait foi. */
  const onSheetContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (Date.now() < touchContextUntil.current) return;
    const key = wordKeyOf(e.target);
    if (key) setSelected([key]);
  };

  return (
    <div
      className={cn(
        "relative h-[100dvh] overflow-hidden dark:bg-background",
        prefs.quran.pageBackground === "white" ? "bg-white" : "bg-[#fcf9ef]",
      )}
    >
      <audio
        ref={audioRef}
        preload="none"
        onEnded={onEnded}
        onError={onAudioError}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          setProgress(el.duration ? (el.currentTime / el.duration) * 100 : 0);
        }}
      />

      {/* En-tête ultra-compacte : sourate/page + recherche, une seule fois.
          Plus fine en paysage pour laisser le maximum d'espace au Mushaf. */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-20 border-b border-border/40 bg-card/80 px-2 py-0.5 backdrop-blur-xl transition-transform duration-300 [@media(orientation:landscape)_and_(max-height:500px)]:py-0",
          (controlsHidden || selected.length > 0) && "-translate-y-full",
          !(search.shared === "wird" && search.end) && "hidden",
        )}
      >
        {/* Portion "Mon Wird" partagée (lien direct reçu, jamais le
            programme complet ni aucune donnée personnelle de l'auteur) —
            discret, informatif, ne bloque jamais la navigation normale. */}
        {search.shared === "wird" && search.end && (
          <p className="mx-auto mt-1 max-w-2xl px-1 text-center text-[11px] text-muted-foreground">
            {page >= search.end
              ? `Wird partagé · pages ${sharedStartPage}–${search.end} · portion terminée`
              : `Wird partagé · pages ${sharedStartPage}–${search.end}`}
          </p>
        )}
      </header>

      {/* Mushaf — élément principal, coupures de lignes officielles (15 lignes).
          En paysage, toute la largeur/hauteur disponible est utilisée (pas
          de max-w-2xl) : c'est l'élément prioritaire de l'écran.
          `overflow-y-auto` (jamais `-hidden`) : à "Très grand" (ou sur un
          petit écran), les 15 lignes peuvent dépasser la hauteur visible —
          l'utilisateur défile alors pour lire la suite au lieu qu'un
          overflow:hidden ne cache silencieusement une partie de la page. Le
          défilement horizontal reste bloqué : aucune ligne ne doit jamais
          déborder en largeur (voir le fit ci-dessus, seule contrainte dure). */}
      <div
        ref={boxRef}
        style={belowVisible ? { paddingBottom: belowH + 12 } : undefined}
        className="absolute inset-0 overflow-x-hidden overflow-y-auto px-0.5 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-[max(0.25rem,env(safe-area-inset-top))]"
        onTouchStart={onSheetTouchStart}
        onTouchMove={onSheetTouchMove}
        onTouchEnd={onSheetTouchEnd}
        onTouchCancel={onSheetTouchCancel}
        onClick={onSheetClick}
        onScroll={(e) => {
          if (!belowVisible) return;
          const el = e.currentTarget;
          const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 6;
          if (atEnd && !atEndRef.current) revealControls();
          atEndRef.current = atEnd;
        }}
      >
        {isPending && (
          <p className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Chargement de la page…
          </p>
        )}
        {/* Boîte dimensionnée en JS (largeur réelle, capée à 672px seulement
            en portrait — voir le fit ci-dessus) ; plus de transform scale
            depuis la correction §"Taille du Mushaf" (l'ancien trick
            rétrécir/agrandir s'annulait exactement, voir le commentaire sur
            `ceilingFontPx`). La composition (line_number, retours à la
            ligne) ne dépend que des données du Mushaf, jamais de la taille. */}
        <div ref={fitBoxRef} className="mx-auto flex flex-col">
          {/* Métadonnées DANS la page (comme le Mushaf papier) : sourate à gauche,
              juz' à droite — jamais une barre d'application permanente. */}
          {verses?.[0] && (
            <div className="flex min-h-8 shrink-0 items-center justify-between gap-2 px-2 pb-1 pt-0.5">
              <button
                type="button"
                lang="ar"
                onClick={(e) => {
                  e.stopPropagation();
                  openNav("surah");
                }}
                aria-label="Changer de sourate"
                className="inline-flex min-w-[4.25rem] items-center justify-center gap-1 rounded-md border border-gold/60 px-2.5 py-0 font-arabic text-[12.5px] font-bold leading-[1.7] text-[#140d05] dark:text-[#fbf5e6]"
              >
                <span style={{ transform: `translateY(${surahChipInk}em)` }}>
                  {surahMeta?.nameArabic ?? ""}
                </span>
                <ChevronDown className="size-3 text-gold" />
              </button>
              <button
                type="button"
                lang="ar"
                onClick={(e) => {
                  e.stopPropagation();
                  openNav("juz");
                }}
                aria-label="Changer de juz"
                className="inline-flex min-w-[4.25rem] items-center justify-center gap-1 rounded-md border border-gold/60 px-2.5 py-0 font-arabic text-[12.5px] font-bold leading-[1.7] text-[#140d05] dark:text-[#fbf5e6]"
              >
                <span dir="rtl" style={{ transform: `translateY(${juzChipInk}em)` }}>
                  {juzChipText}
                </span>
                <ChevronDown className="size-3 text-gold" />
              </button>
            </div>
          )}
          {/* Cadre de page ouvert côté reliure : page impaire (à droite) sans
              trait à gauche, page paire (à gauche) sans trait à droite. */}
          <div
            className={cn(
              "flex flex-1 flex-col border-y-[3px] border-double border-gold/70",
              page % 2 === 1 ? "border-r-[3px] pr-1.5" : "border-l-[3px] pl-1.5",
            )}
          >
          <div
            ref={sheetRef}
            style={{ fontSize: fontPx } as React.CSSProperties}
            // Sélection de texte NATIVE volontairement conservée ici (§21
            // mission "Coran direct") : un appui long doit pouvoir
            // sélectionner une partie précise du texte et utiliser le
            // "Copier" du système — ne plus bloquer ce geste globalement
            // (l'ancien `mushaf-no-callout`/user-select:none empêchait
            // aussi bien le menu natif Android que toute sélection
            // partielle, ce qui est désormais explicitement indésirable).
            className={cn(
              "flex w-full flex-1 select-none flex-col [-webkit-touch-callout:none] [-webkit-tap-highlight-color:transparent]",
              // Pages 1 et 2 du Mushaf de Médine : bloc de texte centré (lignes
              // courtes, interligne régulier) au lieu de lignes étirées.
              centeredPage ? "justify-center gap-[0.45em] px-[3%]" : "justify-between gap-[0.12em]",
            )}
            onContextMenu={onSheetContextMenu}
          >
            {(lines ?? []).map((line, li) => {
              const startSurah = surahStartAtLine.get(li);
              const meta = startSurah ? chapters?.find((c) => c.id === startSurah) : undefined;
              const showBasmala = !!startSurah && startSurah !== 1 && startSurah !== 9;
              return (
                <div key={line.n} className="contents">
                  {startSurah && (
                    <SurahBanner
                      nameArabic={meta?.nameArabic ?? ""}
                      surah={startSurah}
                      versesCount={meta?.versesCount}
                    />
                  )}
                  {showBasmala && (
                    <p
                      lang="ar"
                      dir="rtl"
                      className="text-center font-arabic text-[0.85em] leading-[1.9] text-[#140d05] dark:text-[#fbf5e6]"
                    >
                      بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                    </p>
                  )}
                  <div
                    data-mushaf-line
                    lang="ar"
                    dir="rtl"
                    style={
                      qcfName
                        ? {
                            fontFamily: `"${qcfName}"`,
                            fontWeight: 400,
                            // Encre plus dense, sans toucher aux glyphes.
                            WebkitTextStroke: "0.02em currentColor",
                          }
                        : undefined
                    }
                    className={cn(
                      "flex items-baseline whitespace-nowrap leading-[var(--lh,1.9)] text-[#140d05] dark:text-[#fbf5e6]",
                      centeredPage ? "justify-center gap-x-[0.3em]" : "justify-between",
                    )}
                  >
                    {line.words.map((w, wi) => {
                      const isSel = selected.includes(w.key);
                      const isMark = search.mark === w.key;
                      const isPlayingAyah = current === w.key;
                      // Mot récité (vert) ; tant qu'on ne le connaît pas, l'ayah entière.
                      const isPlayingWord = isPlayingAyah && curWord != null && w.pos === curWord;
                      const isPlaying = isPlayingAyah && curWord == null && !wordSync;
                      return (
                        <span
                          key={`${w.key}-${wi}`}
                          role="button"
                          tabIndex={-1}
                          data-word-key={w.key}
                          className={cn(
                            // Surlignage de sélection volontairement très discret
                            // (simple teinte, pas de changement de couleur de texte)
                            // pour éviter l'effet "gros rectangles" — même boîte,
                            // même rayon, aucun reflow (§12 mission menu ayah).
                            "rounded px-[0.02em] transition-colors",
                            // Le médaillon se centre sur la ligne (pas sur la
                            // ligne de base du texte) : position identique sur
                            // toutes les pages.
                            w.end && "self-center",
                            isMark && "bg-[#8fd1ae]/40",
                            isSel && "bg-primary/15",
                            isPlaying && "bg-[#8fd1ae]/30",
                            isPlayingWord && "bg-[#8fd1ae]/45",
                          )}
                        >
                          {w.end ? (
                            // Numéro de fin d'āyah en chiffres français (le glyphe
                            // imprimé de la police affiche des chiffres arabes).
                            // Médaillon d'1,1 em (taille du PARENT) ; le chiffre est un
                            // enfant à part, centré en flex avec line-height 1, de sorte
                            // que la taille du cercle ne dépend pas de celle du chiffre.
                            <span
                              lang="fr"
                              dir="ltr"
                              style={{ WebkitTextStroke: 0 }}
                              className="flex size-[1.1em] items-center justify-center rounded-full border-[1.5px] border-gold text-gold"
                            >
                              <span
                                className={cn(
                                  "block font-sans font-bold leading-none tabular-nums",
                                  w.ayah > 99 ? "text-[0.46em]" : w.ayah > 9 ? "text-[0.56em]" : "text-[0.66em]",
                                )}
                              >
                                {w.ayah}
                              </span>
                            </span>
                          ) : (
                            (w.code ?? w.text)
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          </div>
          {verses?.[0] && (
            <div
              lang="fr"
              dir="ltr"
              className="relative flex min-h-10 shrink-0 items-center justify-center px-2 pt-1.5 font-sans leading-none tabular-nums"
            >
              {/* Pied de page comme un Mushaf imprimé : juz à gauche, page au
                  centre (saisie directe + Entrée), hizb à droite. */}
              <PageNumberInput page={page} onGo={goToPageDirect} onEditing={setPageEditing} />
              {verses[0].hizb ? (
                <button
                  type="button"
                  onClick={(e) => {
                  e.stopPropagation();
                  openNav("hizb");
                }}
                  aria-label={`Hizb ${verses[0].hizb} — aller à un autre hizb`}
                  className="absolute right-2 rounded-md px-1.5 py-1 text-[11px] text-foreground/60 transition hover:bg-muted hover:text-foreground"
                >
                  Hizb {verses[0].hizb}
                  {verses[0].rub ? ` · ${((verses[0].rub - 1) % 4) + 1}/4` : ""}
                </button>
              ) : null}
            </div>
          )}
          {tajweedMode && <TajweedLegend className="mt-1" />}
          {tajweedMode && <div className="h-20" aria-hidden />}
        </div>
      </div>

      {/* Une seule barre basse à la fois (§13 mission menu ayah) : les
          actions de l'ayah sélectionnée REMPLACENT les contrôles Mushaf,
          jamais les deux empilés. */}
      {selected.length > 0 && selKey && !belowPanelOn ? (
        <nav
          aria-label="Actions de l'āyah"
          className={cn(
            "fixed inset-x-0 bottom-0 z-20 border-t border-border/40 bg-card/95 px-2 pt-1 pb-[calc(0.375rem+env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-300",
            controlsHidden && "translate-y-full",
          )}
        >
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-between px-1">
              <p className="min-w-0 flex-1 truncate text-center text-xs font-semibold text-primary">
                {selLabel}
              </p>
              <button
                onClick={() => setSelected([])}
                aria-label="Fermer la sélection"
                className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="size-[18px]" strokeWidth={1.75} />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {(
                [
                  {
                    key: "play",
                    label: playing && current === selKey ? "Pause" : "Écouter",
                    icon: playing && current === selKey ? Pause : Play,
                    onClick: () => {
                      if (playing && current === selKey) toggle();
                      else playAyah();
                    },
                  },
                  {
                    key: "fav",
                    label: "Favori",
                    icon: Heart,
                    active: isFavorite("ayah", selKey),
                    onClick: () => toggleFavorite("ayah", selKey),
                  },
                  { key: "copy", label: "Copier", icon: Copy, onClick: copySelectedVerse },
                  {
                    key: "share",
                    label: "Partager",
                    icon: Share2,
                    onClick: () => shareSelectedVerse(selKey),
                  },
                  {
                    key: "study",
                    label: "Étudier",
                    icon: Leaf,
                    primary: true,
                    onClick: () => studySelectedVerse(selKey),
                  },
                ] as const
              ).map((a) => (
                <button
                  key={a.key}
                  onClick={a.onClick}
                  aria-label={a.label}
                  className={cn(
                    "flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 text-[11px] font-semibold transition active:scale-95",
                    "primary" in a && a.primary
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <a.icon
                    className={cn("size-5", "active" in a && a.active && "fill-gold text-gold")}
                    strokeWidth={1.75}
                  />
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      ) : (
        <nav
          aria-label="Commandes du Mushaf"
          className={cn(
            "fixed inset-x-3 z-[27] mx-auto max-w-md rounded-[1.35rem] border border-border/60 bg-card/85 px-1.5 pb-1 pt-1 shadow-[0_8px_24px_-8px_rgba(0,0,0,.35)] backdrop-blur-xl transition-all duration-300",
            (controlsHidden || pageEditing) && "pointer-events-none translate-y-[160%] opacity-0",
          )}
          style={{ bottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-end justify-around">
            <BarBtn to="/" label="Accueil" icon={<Home className="size-[19px]" strokeWidth={1.75} />} />
            <BarBtn label="Chercher" icon={<Search className="size-[19px]" strokeWidth={1.75} />} onClick={() => setSearchOpen(true)} />
            <button
              onClick={() =>
                isCurrentSession ? toggle() : resumeVerse ? void playSurahEndFromAnchor() : playFromAnchor()
              }
              aria-label={playing ? "Pause" : "Lecture"}
              className="-mt-5 flex flex-col items-center gap-0.5 px-2 active:scale-95"
            >
              <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_6px_14px_-4px_rgba(31,122,87,.6)] ring-4 ring-card/85">
                {playing ? <Pause className="size-5" strokeWidth={1.75} /> : <Play className="size-5" strokeWidth={1.75} />}
              </span>
              <span className="text-[9px] font-medium leading-none text-muted-foreground">{playing ? "Pause" : "Lire"}</span>
            </button>
            {pagePassages.length > 0 ? (
              <BarBtn label="Méditer" icon={<Leaf className="size-[19px]" strokeWidth={1.75} />} onClick={() => setMeditateOpen(true)} />
            ) : (
              <BarBtn label="Étudier" icon={<Sparkles className="size-[19px]" strokeWidth={1.75} />} onClick={() => setSearchOpen(true)} hidden />
            )}
            <BarBtn label="Options" icon={<Settings2 className="size-[19px]" strokeWidth={1.75} />} onClick={() => setOptionsOpen(true)} />
          </div>
        </nav>
      )}

      {searchNav && !searchOpen && (
        <div
          style={{
            bottom: belowVisible
              ? `calc(${belowH}px + 3.75rem)`
              : "calc(0.75rem + env(safe-area-inset-bottom))",
          }}
          className="pointer-events-none fixed inset-x-0 z-[26] flex items-center justify-between gap-2 px-3 transition-[bottom] duration-300"
        >
          <span />
          <div className="pointer-events-auto flex h-10 items-center gap-0.5 rounded-full bg-card/95 px-1 shadow-[var(--shadow-soft)] ring-1 ring-border/60">
            <button
              onClick={() => goSearchResult(searchNav.index + 1)}
              disabled={searchNav.index >= searchNav.keys.length - 1}
              aria-label="Résultat suivant"
              className="grid size-8 place-items-center rounded-full disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-[3.5rem] text-center text-xs font-semibold tabular-nums">
              {searchNav.index + 1} / {searchNav.keys.length}
            </span>
            <button
              onClick={() => goSearchResult(searchNav.index - 1)}
              disabled={searchNav.index <= 0}
              aria-label="Résultat précédent"
              className="grid size-8 place-items-center rounded-full disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Liste des résultats"
              className="grid size-8 place-items-center rounded-full text-primary"
            >
              <Search className="size-4" />
            </button>
            <button
              onClick={() => updateSearchNav(null)}
              aria-label="Fermer la recherche"
              className="grid size-8 place-items-center rounded-full text-muted-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {copied && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center">
          <span className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
            <Check className="size-4" /> Copié
          </span>
        </div>
      )}



      {showNav && (
        <GoToPanel
          initialTab={navTab}
          juz={verses?.[0]?.juz}
          hizb={verses?.[0]?.hizb}
          rub={verses?.[0]?.rub}
          surahId={surahMeta?.id}
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
          onSelectVerse={(k, ctx) => void goToSearchResult(k, ctx)}
          onGoToPage={goToPageDirect}
          onClose={() => setSearchOpen(false)}
        />
      )}

      {belowVisible && focusKey && (
        <>
          <BelowPanel
            verseKeys={[...new Set((verses ?? []).map((v) => v.key))]}
            verseKey={focusKey}
            source={belowSource}
            size={prefs.quran.textSize}
            onSelect={(k) => setSelected([k])}
            onHeight={setBelowH}
          />
        </>
      )}

      {optionsOpen && (
        // Mobile/tablette : bottom sheet inchangée. Desktop (lg+) : panneau
        // latéral droit ~420px — n'occupe jamais la quasi-totalité de l'écran.
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm lg:items-stretch lg:justify-end">
          <div className="flex max-h-[85dvh] w-full flex-col rounded-t-3xl border-t border-border bg-card lg:max-h-none lg:w-[420px] lg:rounded-none lg:rounded-l-3xl lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between px-4 pb-3 pt-4">
              <h2 className="font-display text-lg font-semibold">Récitation</h2>
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
                Lire
              </p>
              {(() => {
                const opts = (
                  [
                    { id: "ayah", label: `Cette āyah${anchor.key ? " · " + anchor.key : ""}` },
                    { id: "page", label: `Cette page · ${page}` },
                    ...(pageSurahs.length > 1 && !selected.length
                      ? pageSurahs.map((sr) => ({
                          id: "surah" as ReadMode,
                          surah: sr,
                          label: `Cette sourate · ${chapters?.find((c) => c.id === sr)?.nameFrench ?? sr}`,
                        }))
                      : [
                          {
                            id: "surah" as ReadMode,
                            surah: scopeSurah,
                            label: `Cette sourate · ${chapters?.find((c) => c.id === scopeSurah)?.nameFrench ?? scopeSurah}`,
                          },
                        ]),
                    { id: "juz", label: `Ce juz' · ${anchor.juz}` },
                    { id: "hizb", label: `Ce hizb · ${anchor.hizb}` },
                    { id: "toEnd", label: `À partir de cette āyah → fin du Coran` },
                    { id: "pageToEnd", label: `À partir de cette page → fin du Coran` },
                    { id: "range", label: "Intervalle personnalisé…" },
                  ] as { id: ReadMode; label: string; surah?: number }[]
                ).map((o) => ({ ...o, value: o.id + "|" + (o.surah ?? "") }));
                const cur =
                  opts.find((o) => o.id === readMode && (o.id !== "surah" || o.surah === scopeSurah))?.value ??
                  opts[0].value;
                return (
                  <ChoiceSelect
                    title="Que lire"
                    ariaLabel="Que lire"
                    value={cur}
                    onChange={(val) => {
                      const o = opts.find((x) => x.value === val);
                      if (!o) return;
                      setReadMode(o.id);
                      if (o.id === "surah" && o.surah != null) setSurahPick(o.surah);
                      if (o.id === "range") {
                        if (!rangeStart && anchor.key) setRangeStart(anchor.key);
                        if (!rangeEnd && anchor.key) setRangeEnd(anchor.key);
                      }
                    }}
                  >
                    {opts.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </ChoiceSelect>
                );
              })()}

              {readMode === "range" && (
                <div className="mb-2 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Sélectionner l'intervalle</p>
                  <VersePick
                    label="Verset initial"
                    value={rangeStart || anchor.key}
                    chapters={chapters ?? []}
                    onChange={setRangeStart}
                  />
                  <VersePick
                    label="Verset final"
                    value={rangeEnd || rangeStart || anchor.key}
                    chapters={chapters ?? []}
                    onChange={setRangeEnd}
                    last
                  />
                  {rangeInvalidReason && <p className="text-xs text-destructive">{rangeInvalidReason}</p>}
                </div>
              )}

              <PillRow label="Répéter chaque āyah" value={ayahRepeat} onChange={setAyahRepeat} />
              <PillRow label="Répéter l'intervalle" value={selRepeat} onChange={setSelRepeat} />

              <Link
                to="/parametres"
                search={{ section: "audio" }}
                onClick={() => setOptionsOpen(false)}
                className="mt-5 flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm"
              >
                <span className="min-w-0">
                  <span className="block font-semibold text-foreground">Récitant et vitesse</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {getReciter(reciterId).name} · {speed}×
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>

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

      {meditateOpen && pagePassages.length > 0 && (
        <PageMeditateSheet
          page={page}
          passages={pagePassages}
          chapters={chapters ?? []}
          onClose={() => setMeditateOpen(false)}
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
    <div className="mt-3 block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <ChoiceSelect title={label} value={value} onChange={(v) => onChange(Number(v))}>
        <option value={1}>1 fois</option>
        <option value={3}>3 fois</option>
        <option value={5}>5 fois</option>
        <option value={0}>À l'infini</option>
      </ChoiceSelect>
    </div>
  );
}

type NavTab = "page" | "surah" | "juz" | "hizb";

/** Première page de chaque juz dans le Mushaf de Médine (604 pages). */
const JUZ_START_PAGE = [
  1, 22, 42, 62, 82, 102, 122, 142, 162, 182, 202, 222, 242, 262, 282, 302, 322, 342, 362, 382,
  402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
];

/** Bandeau de début de sourate, façon Mushaf de Médine : double filet, deux
 * panneaux d'arabesques et, au centre, un large cartouche aux extrémités en
 * accolade qui porte le nom. La taille du nom suit la hauteur du bandeau (et
 * non celle du texte), il ne peut donc jamais déborder du cartouche. La petite
 * feuille (panneau de gauche) ouvre la fiche de la sourate. */
function SurahBanner({ nameArabic, surah, versesCount }: { nameArabic: string; surah: number; versesCount?: number }) {
  const ogee =
    "M96 30C104 15 114 8 130 8H270C286 8 296 15 304 30C296 45 286 52 270 52H130C114 52 104 45 96 30Z";
  const name = `سُورَةُ ${nameArabic}`;
  const ink = useInkOffset(name, '"Amiri Quran"');
  const size = name.length > 16 ? "text-[28cqh]" : name.length > 12 ? "text-[33cqh]" : "text-[38cqh]";
  return (
    <div className="relative my-[0.15em] aspect-[400/60] w-full text-[#140d05] [container-type:size] dark:text-[#fbf5e3]">
      <svg viewBox="0 0 400 60" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <pattern id="sb-orn" width="9" height="9" patternUnits="userSpaceOnUse">
            <path d="M4.5 .8 8.2 4.5 4.5 8.2 .8 4.5Z" fill="none" stroke="currentColor" strokeWidth=".7" />
            <circle cx="4.5" cy="4.5" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect x="1" y="1" width="398" height="58" className="fill-background" stroke="currentColor" strokeWidth="2.2" />
        <rect x="5" y="5" width="390" height="50" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="8" y="8" width="92" height="44" fill="url(#sb-orn)" stroke="currentColor" strokeWidth=".8" />
        <rect x="300" y="8" width="92" height="44" fill="url(#sb-orn)" stroke="currentColor" strokeWidth=".8" />
        <path d={ogee} className="fill-background" stroke="currentColor" strokeWidth="2" />
        <path
          d={ogee}
          fill="none"
          stroke="currentColor"
          strokeWidth=".8"
          vectorEffect="non-scaling-stroke"
          transform="translate(200 30) scale(.96 .86) translate(-200 -30)"
        />
      </svg>
      <p
        lang="ar"
        dir="rtl"
        className={cn(
          "absolute inset-y-0 left-[27%] right-[27%] flex items-center justify-center whitespace-nowrap font-arabic font-bold leading-none",
          size,
        )}
      >
        <span style={{ transform: `translateY(${ink}em)` }}>{name}</span>
      </p>
      <Link
        to="/sourate/$surah"
        params={{ surah: String(surah) }}
        aria-label="Découvrir la sourate"
        className="absolute left-[12.5%] top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/80 px-[3%] py-[1.5%] text-[34cqh] leading-none"
      >
        🌿
      </Link>
      <span
        aria-hidden
        className="pointer-events-none absolute right-[13.5%] top-1/2 flex -translate-y-1/2 translate-x-1/2 flex-col items-center rounded-md bg-background/85 px-[2%] py-[1.5%] font-sans font-bold leading-none"
      >
        <span className="text-[30cqh]">{surah}</span>
        {versesCount ? <span className="mt-[2cqh] text-[17cqh] font-semibold opacity-80">({versesCount})</span> : null}
      </span>
    </div>
  );
}

/** Choix d'un verset : sourate + numéro d'āyah (listes déroulantes). */
function VersePick({
  label,
  value,
  chapters,
  onChange,
  last,
}: {
  label: string;
  value: string;
  chapters: { id: number; nameSimple: string; versesCount: number }[];
  onChange: (key: string) => void;
  last?: boolean;
}) {
  const [sRaw, aRaw] = value.split(":");
  const surah = Number(sRaw) || 1;
  const ayah = Number(aRaw) || 1;
  const ch = chapters.find((c) => c.id === surah);
  const n = ch?.versesCount ?? 1;
  const cls = "h-11 min-w-0 rounded-xl border border-border bg-card px-3 text-sm font-medium";
  return (
    <div className="rounded-2xl border border-border bg-background p-3">
      <p className="mb-1.5 text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="flex gap-2">
        <select
          aria-label={label + " — sourate"}
          value={surah}
          onChange={(e) => {
            const id = Number(e.target.value);
            const c = chapters.find((x) => x.id === id);
            onChange(`${id}:${last ? (c?.versesCount ?? 1) : 1}`);
          }}
          className={cn(cls, "flex-1")}
        >
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} - {c.nameSimple}
            </option>
          ))}
        </select>
        <select
          aria-label={label + " — āyah"}
          value={Math.min(ayah, n)}
          onChange={(e) => onChange(`${surah}:${e.target.value}`)}
          className={cn(cls, "w-24")}
        >
          {Array.from({ length: n }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

type RubBoundRow = (typeof RUB_BOUNDS)[number];

/** Premiers mots d'une āyah sur UNE seule ligne, alignés à droite. */
function ArLine({ text, className }: { text: string; className?: string }) {
  return (
    <span
      lang="ar"
      dir="rtl"
      className={cn("min-w-0 flex-1 overflow-hidden whitespace-nowrap text-right font-arabic leading-[2]", className)}
    >
      {text.split(" ").slice(0, 4).join(" ")} …
    </span>
  );
}

/** Ligne dépliable : titre + références, puis Début et Fin l'un sous l'autre
 * (une ligne chacun, texte arabe en gras aligné à droite). Chaque ligne ouvre
 * la page et met l'āyah en surbrillance. */
function BoundRow({
  title,
  sub,
  start,
  end,
  current,
  isOpen,
  onToggle,
  go,
  children,
}: {
  title: string;
  sub: string;
  start: RubBoundRow;
  end: RubBoundRow;
  current?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  go: (page: number, mark?: string) => void;
  children?: ReactNode;
}) {
  const line = "flex w-full items-center gap-2 rounded-lg px-1 py-0.5 text-left transition hover:bg-muted/60";
  return (
    <li className={cn("rounded-xl border border-border", current && "border-gold bg-gold/10")}>
      <div className="flex items-stretch">
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? `Replier ${title}` : `Déplier ${title}`}
          className="grid w-9 shrink-0 place-items-start pt-3 text-muted-foreground"
        >
          <ChevronDown className={cn("mx-auto size-4 transition", !isOpen && "-rotate-90")} />
        </button>
        <div className="min-w-0 flex-1 py-2 pr-2">
          <button onClick={onToggle} className="block w-full text-left">
            <span className="block text-sm font-bold">{title}</span>
            <span className="block text-[11px] tabular-nums text-muted-foreground">{sub}</span>
          </button>
          <div className="mt-1">
            <button onClick={() => go(start[1], start[0])} className={line}>
              <span className="w-[4.6rem] shrink-0 text-[11px] font-semibold tabular-nums text-muted-foreground">
                Début · {start[0]}
              </span>
              <ArLine text={start[2]} className="text-[15px] font-bold" />
            </button>
            <button onClick={() => go(end[4], end[3])} className={line}>
              <span className="w-[4.6rem] shrink-0 text-[11px] font-semibold tabular-nums text-muted-foreground">
                Fin · {end[3]}
              </span>
              <ArLine text={end[5]} className="text-[15px] font-bold" />
            </button>
          </div>
        </div>
      </div>
      {isOpen && children && <div className="px-2 pb-2">{children}</div>}
    </li>
  );
}

/** Un hizb : début/fin + ses quatre quarts. */
function HizbNode({
  h,
  withJuz,
  current,
  rub,
  open,
  toggle,
  go,
}: {
  h: number;
  withJuz?: boolean;
  current?: number;
  rub?: number;
  open: Set<string>;
  toggle: (k: string) => void;
  go: (page: number, mark?: string) => void;
}) {
  const first = RUB_BOUNDS[(h - 1) * 4];
  const last = RUB_BOUNDS[h * 4 - 1];
  return (
    <BoundRow
      title={`Hizb ${h}`}
      sub={`${withJuz ? `Juz ${Math.ceil(h / 2)} · ` : ""}${first[0]} → ${last[3]}`}
      start={first}
      end={last}
      current={h === current}
      isOpen={open.has(`h${h}`)}
      onToggle={() => toggle(`h${h}`)}
      go={go}
    >
      <ul className="border-l-2 border-border pl-2">
        {[1, 2, 3, 4].map((k) => {
          const r = (h - 1) * 4 + k;
          const b = RUB_BOUNDS[r - 1];
          return (
            <li key={k}>
              <button
                onClick={() => go(b[1], b[0])}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1 text-left text-xs transition hover:bg-muted",
                  r === rub && "bg-gold/20",
                )}
              >
                <span className="w-[5.4rem] shrink-0">
                  <span className="block text-sm font-bold">{k}/4</span>
                  <span className="block text-[11px] tabular-nums text-muted-foreground">
                    {b[0]} → {b[3]}
                  </span>
                </span>
                <ArLine text={b[2]} className="text-[15px] font-bold" />
              </button>
            </li>
          );
        })}
      </ul>
    </BoundRow>
  );
}

function GoToPanel({
  initialTab,
  juz,
  hizb,
  rub,
  surahId,
  page,
  chapters,
  reciterId,
  onClose,
}: {
  initialTab: NavTab;
  juz?: number;
  hizb?: number;
  rub?: number;
  surahId?: number;
  page: number;
  chapters: {
    id: number;
    nameArabic: string;
    nameFrench: string;
    pages: [number, number];
    versesCount: number;
    revelationPlace?: "makkah" | "madinah";
  }[];
  reciterId: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<NavTab>(initialTab);
  const [value, setValue] = useState(String(page));
  const [q, setQ] = useState("");
  // Nœuds dépliés (juz « j3 », hizb « h5 ») : on ouvre d'emblée ceux de la page en cours.
  const [open, setOpen] = useState<Set<string>>(
    () => new Set([juz ? `j${juz}` : "", hizb ? `h${hizb}` : ""].filter(Boolean)),
  );
  const toggle = (k: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(k)) next.add(k);
      return next;
    });

  const go = (p: number, mark?: string) => {
    navigate({
      to: "/quran/page/$page",
      params: { page: String(clampPage(p)) },
      search: { r: reciterId, mark },
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
  const tabs: { key: NavTab; label: string }[] = [
    { key: "page", label: "Page" },
    { key: "surah", label: "Sourate" },
    { key: "juz", label: "Juz" },
    { key: "hizb", label: "Hizb" },
  ];

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
        <div className="mb-3 grid grid-cols-4 gap-1 rounded-full bg-muted p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full py-1.5 text-sm font-semibold transition",
                tab === t.key ? "bg-background shadow-sm" : "text-muted-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "page" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(Number(value));
            }}
            className="space-y-4 pb-2"
          >
            <div className="flex gap-2">
              <input
                inputMode="numeric"
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 3))}
                placeholder="Numéro de page (1–604)"
                className="h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-center text-lg font-bold tabular-nums"
              />
              <button className="rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
                Ouvrir
              </button>
            </div>
            <input
              type="range"
              min={1}
              max={604}
              value={clampPage(Number(value) || 1)}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Choisir la page"
              className="w-full accent-[var(--gold)]"
            />
            <div className="flex justify-between text-xs tabular-nums text-muted-foreground">
              <span>1</span>
              <span>604</span>
            </div>
          </form>
        )}

        {tab === "surah" && (
          <>
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
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-muted",
                      c.id === surahId && "bg-gold/10",
                    )}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate">
                        <span className="text-muted-foreground">{c.id}. </span>
                        {c.nameFrench}
                      </span>
                      {c.revelationPlace && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          {c.revelationPlace === "makkah" ? (
                            <KaabaIcon className="size-3.5 text-foreground" />
                          ) : (
                            <MadinaMosqueIcon className="size-3.5 text-[#3f7a54] dark:text-[#6fe0b0]" />
                          )}
                          {c.revelationPlace === "makkah" ? "Mecquoise" : "Médinoise"} · {c.versesCount} āyāt
                        </span>
                      )}
                    </span>
                    <span lang="ar" className="font-arabic text-gold">
                      {c.nameArabic}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === "hizb" && (
          <ul className="space-y-1.5 pb-4">
            {Array.from({ length: 60 }, (_, i) => i + 1).map((h) => (
              <HizbNode key={h} h={h} withJuz current={hizb} rub={rub} open={open} toggle={toggle} go={go} />
            ))}
          </ul>
        )}

        {tab === "juz" && (
          <ul className="space-y-1.5 pb-4">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => {
              const first = RUB_BOUNDS[(j - 1) * 8];
              const last = RUB_BOUNDS[j * 8 - 1];
              return (
                <BoundRow
                  key={j}
                  title={`Juz ${j}`}
                  sub={`${first[0]} → ${last[3]}`}
                  start={first}
                  end={last}
                  current={j === juz}
                  isOpen={open.has(`j${j}`)}
                  onToggle={() => toggle(`j${j}`)}
                  go={go}
                >
                  <ul className="space-y-1.5 border-l-2 border-border pl-2">
                    {[1, 2].map((k) => (
                      <HizbNode key={k} h={(j - 1) * 2 + k} current={hizb} rub={rub} open={open} toggle={toggle} go={go} />
                    ))}
                  </ul>
                </BoundRow>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/**
 * Recherche V1 — texte arabe uniquement (tolérante aux harakat côté API).
 * Prévu pour accueillir plus tard traduction/phonétique/thématique sans
 * changer ce contrat : SearchResult reste la seule forme consommée ici.
 */
const SEARCH_HISTORY_KEY = "nm-quran-search-history";
const SEARCH_PAGE = 60;

function loadSearchHistory(): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(SEARCH_HISTORY_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 15) : [];
  } catch {
    return [];
  }
}
function saveSearchHistory(list: string[]) {
  try {
    window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(list.slice(0, 15)));
  } catch {
    /* stockage indisponible */
  }
}

/** Texte uthmanien d'origine, mots trouvés surlignés. */
function Highlighted({ text, ranges }: { text: string; ranges: [number, number][] }) {
  const parts: ReactNode[] = [];
  let pos = 0;
  ranges.forEach(([a, b], i) => {
    if (a > pos) parts.push(text.slice(pos, a));
    parts.push(
      <mark key={i} className="rounded bg-gold/35 px-0.5 text-foreground">
        {text.slice(a, b)}
      </mark>,
    );
    pos = b;
  });
  if (pos < text.length) parts.push(text.slice(pos));
  return <>{parts}</>;
}

function SearchPanel({
  chapters,
  navigatingKey,
  onSelectVerse,
  onGoToPage,
  onClose,
}: {
  chapters: Chapter[];
  navigatingKey: string | null;
  onSelectVerse: (key: string, ctx?: { query: string; keys: string[] }) => void;
  onGoToPage: (page: number) => void;
  onClose: () => void;
}) {
  const [raw, setRaw] = useState("");
  const [query, setQuery] = useState("");
  const [shownCount, setShownCount] = useState(SEARCH_PAGE);
  const [history, setHistory] = useState<string[]>([]);
  useEffect(() => setHistory(loadSearchHistory()), []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setQuery(raw.trim());
      setShownCount(SEARCH_PAGE);
    }, 250);
    return () => window.clearTimeout(t);
  }, [raw]);

  const remember = (q: string) => {
    const t = q.trim();
    if (!t) return;
    const next = [t, ...history.filter((h) => h !== t)].slice(0, 15);
    setHistory(next);
    saveSearchHistory(next);
  };

  /** Référence directe (« 2:255 », « page 42 », nom de sourate + numéro). */
  const parsed = useMemo(
    () => parseQuranQuery(raw, chapters.length ? chapters : undefined),
    [raw, chapters],
  );
  const isReference = parsed.kind !== "text";

  // Texte complet du Coran : un seul téléchargement (mis en cache).
  const { data: fullText, isFetching, isError } = useQuery({
    queryKey: ["quran-full-text"],
    queryFn: fetchFullQuranText,
    staleTime: Infinity,
    enabled: query.length >= 2 && !isReference,
  });
  const folded = useMemo(() => (fullText ? foldVerses(fullText) : null), [fullText]);
  const results = useMemo(
    () => (folded && !isReference && query.length >= 2 ? searchLocal(query, folded) : []),
    [folded, query, isReference],
  );

  // Groupé par sourate, dans l'ordre du Coran.
  const groups = useMemo(() => {
    const list = results.slice(0, shownCount);
    const out: { surah: number; items: LocalSearchResult[] }[] = [];
    for (const r of list) {
      const last = out[out.length - 1];
      if (last && last.surah === r.surah) last.items.push(r);
      else out.push({ surah: r.surah, items: [r] });
    }
    return out;
  }, [results, shownCount]);
  const pageQueries = useQueries({
    queries: groups.map((g) => ({
      queryKey: ["surah-pages", g.surah],
      queryFn: () => fetchSurahPages(g.surah),
      staleTime: Infinity,
    })),
  });
  const pageOf = (key: string): number | undefined => {
    const [sr, ay] = key.split(":").map(Number);
    const gi = groups.findIndex((g) => g.surah === sr);
    return gi >= 0 ? pageQueries[gi]?.data?.[ay] : undefined;
  };
  const surahSummary = useMemo(() => {
    const m = new Map<number, string[]>();
    for (const r of results) {
      const l = m.get(r.surah) ?? [];
      l.push(r.key);
      m.set(r.surah, l);
    }
    return [...m.entries()];
  }, [results]);
  const jumpTo = (key: string) => {
    const idx = results.findIndex((r) => r.key === key);
    if (idx >= 0 && idx >= shownCount) setShownCount(idx + 1);
    window.setTimeout(() => {
      document.getElementById("res-" + key.replace(":", "-"))?.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 60);
  };
  const countBySurah = useMemo(() => {
    const m = new Map<number, number>();
    for (const r of results) m.set(r.surah, (m.get(r.surah) ?? 0) + 1);
    return m;
  }, [results]);
  const loading = isFetching && !folded;
  const [toast, setToast] = useState("");
  const flash = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(""), 1600);
  };
  const resultText = (key: string, text: string, name?: string) =>
    `${text}\n\n${name ? name + " — " : ""}${key}`;
  const copyResult = async (key: string, text: string, name?: string) => {
    try {
      await navigator.clipboard.writeText(resultText(key, text, name));
      flash("Copié");
    } catch {
      /* refusé */
    }
  };
  const shareResult = async (key: string, text: string, name?: string) => {
    const t = resultText(key, text, name);
    try {
      if (navigator.share) await navigator.share({ text: t });
      else {
        await navigator.clipboard.writeText(t);
        flash("Copié");
      }
    } catch {
      /* annulé */
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm">
      <div className="relative flex h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border-t border-border bg-card">
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
            <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              dir="rtl"
              lang="ar"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") remember(raw);
              }}
              placeholder="Rechercher dans le Coran…"
              aria-label="Rechercher dans le Coran"
              className="h-12 w-full rounded-full border border-border bg-background pl-12 pr-11 text-right font-arabic text-[17px] outline-none transition placeholder:text-right placeholder:font-sans placeholder:text-[14px] placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
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
            Mot ou phrase exacte, ayah ou page — ex. كتب عليكم القتال · 2:255 · Page 42
          </p>
        </div>

        {toast && (
          <p className="pointer-events-none absolute inset-x-0 bottom-6 z-20 mx-auto w-fit rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
            {toast}
          </p>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          {parsed.kind === "ayah" ? (
            <button
              onClick={() => {
                remember(raw);
                onSelectVerse(`${parsed.surah}:${parsed.ayah}`);
              }}
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
              onClick={() => {
                remember(raw);
                onGoToPage(parsed.page);
              }}
              className="flex w-full items-center justify-between gap-2 rounded-2xl border border-primary/40 bg-primary/5 px-4 py-3 text-left transition hover:bg-primary/10"
            >
              <span className="text-sm font-medium text-foreground">Ouvrir la page {parsed.page}</span>
              <span className="shrink-0 text-xs font-medium tabular-nums text-primary">/ 604</span>
            </button>
          ) : parsed.kind === "page-suggestion" ? (
            <button
              onClick={() => onGoToPage(parsed.page)}
              className="flex w-full items-center justify-between gap-2 rounded-2xl border border-border/60 bg-background px-4 py-3 text-left transition hover:border-primary/40 hover:bg-muted"
            >
              <span className="text-sm font-medium text-foreground">Aller à la page {parsed.page}</span>
              <span className="shrink-0 text-xs text-muted-foreground">/ 604</span>
            </button>
          ) : parsed.kind === "invalid-page" ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Le Mushaf contient 604 pages.</p>
          ) : query.length < 2 ? (
            history.length > 0 ? (
              <div>
                <div className="mb-2 flex items-center justify-between px-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Recherches récentes
                  </p>
                  <button
                    onClick={() => {
                      setHistory([]);
                      saveSearchHistory([]);
                    }}
                    className="text-xs font-medium text-primary"
                  >
                    Tout effacer
                  </button>
                </div>
                <ul className="divide-y divide-border/50 rounded-2xl border border-border/60 bg-background">
                  {history.map((h) => (
                    <li key={h} className="flex items-center">
                      <button
                        onClick={() => {
                          setRaw(h);
                          setQuery(h);
                        }}
                        className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left"
                      >
                        <Search className="size-4 shrink-0 text-muted-foreground" />
                        <span dir="auto" className="truncate font-arabic text-lg text-foreground">
                          {h}
                        </span>
                      </button>
                      <button
                        aria-label="Retirer"
                        onClick={() => {
                          const next = history.filter((x) => x !== h);
                          setHistory(next);
                          saveSearchHistory(next);
                        }}
                        className="grid size-10 shrink-0 place-items-center text-muted-foreground"
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Tapez au moins deux lettres — un mot ou un fragment d'ayah.
              </p>
            )
          ) : loading ? (
            <p className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Préparation de la recherche…
            </p>
          ) : isError && !folded ? (
            <p className="py-10 text-center text-sm text-destructive">
              Recherche indisponible pour le moment. Réessayez.
            </p>
          ) : results.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Aucun résultat pour « {query} ».</p>
          ) : (
            <>
              <div className="mb-3 rounded-2xl border border-border/60 bg-background p-3">
                <div className="flex justify-around text-center">
                  <div>
                    <p className="text-xl font-bold tabular-nums">{results.length}</p>
                    <p className="text-[11px] text-muted-foreground">āyāt</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold tabular-nums">{countBySurah.size}</p>
                    <p className="text-[11px] text-muted-foreground">sourate{countBySurah.size > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="mt-2 max-h-36 space-y-1.5 overflow-y-auto border-t border-border/50 pt-2">
                  {surahSummary.map(([sr, keys]) => {
                    const m = chapters.find((c) => c.id === sr);
                    return (
                      <div key={sr} className="flex items-start gap-2">
                        <span className="w-28 shrink-0 truncate pt-0.5 text-xs font-semibold">
                          {sr}. {m?.nameFrench ?? ""}
                        </span>
                        <span className="flex flex-wrap gap-1">
                          {keys.map((k) => (
                            <button
                              key={k}
                              onClick={() => jumpTo(k)}
                              className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary"
                            >
                              {k.split(":")[1]}
                            </button>
                          ))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {groups.map((g) => {
                const meta = chapters.find((c) => c.id === g.surah);
                return (
                  <section key={g.surah} className="mb-4">
                    <div className="sticky top-0 z-10 -mx-1 mb-1.5 flex items-center justify-between gap-2 bg-card/95 px-1 py-1.5 backdrop-blur">
                      <span lang="ar" className="font-arabic text-lg font-bold text-foreground">
                        {meta?.nameArabic ?? ""}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {g.surah}. {meta?.nameFrench ?? ""} ·{" "}
                        <span className="rounded-full bg-muted px-2 py-0.5 font-semibold tabular-nums text-foreground">
                          {countBySurah.get(g.surah)}
                        </span>
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {g.items.map((r) => (
                        <li key={r.key} id={"res-" + r.key.replace(":", "-")}>
                          <div className="rounded-2xl border border-border/60 bg-background transition hover:border-primary/40">
                            <div className="flex items-center justify-between px-3 pt-2 text-xs font-medium tabular-nums text-muted-foreground">
                              <span>
                                {r.key}
                                {pageOf(r.key) ? <span className="ml-2 font-normal">· page {pageOf(r.key)}</span> : null}
                                {navigatingKey === r.key && (
                                  <span className="ml-2 inline-flex items-center gap-1 text-primary">
                                    <Loader2 className="size-3 animate-spin" /> Ouverture…
                                  </span>
                                )}
                              </span>
                              <span className="flex items-center">
                                <button
                                  onClick={() => copyResult(r.key, r.text, meta?.nameFrench)}
                                  aria-label="Copier l'āyah"
                                  className="grid size-8 place-items-center rounded-full hover:bg-muted"
                                >
                                  <Copy className="size-3.5" />
                                </button>
                                <button
                                  onClick={() => shareResult(r.key, r.text, meta?.nameFrench)}
                                  aria-label="Partager l'āyah"
                                  className="grid size-8 place-items-center rounded-full hover:bg-muted"
                                >
                                  <Share2 className="size-3.5" />
                                </button>
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                remember(raw);
                                onSelectVerse(r.key, { query, keys: results.map((x) => x.key) });
                              }}
                              disabled={!!navigatingKey}
                              className="w-full px-4 pb-3 pt-0.5 text-left disabled:opacity-60"
                            >
                              <p
                                lang="ar"
                                dir="rtl"
                                style={{ fontFamily: '"Noto Naskh Arabic", "Amiri", serif' }}
                                className="text-[1.08rem] leading-[1.85] text-foreground"
                              >
                                <Highlighted text={r.text} ranges={r.ranges} />
                              </p>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
              {shownCount < results.length && (
                <button
                  onClick={() => setShownCount((n) => n + SEARCH_PAGE)}
                  className="mb-2 w-full rounded-full border border-border py-2.5 text-sm font-medium text-primary"
                >
                  Afficher plus ({results.length - shownCount} restants)
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Bouton compact de la barre du Mushaf : icône + légende minuscule. */
function BarBtn({
  label,
  icon,
  onClick,
  to,
  hidden,
}: {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  to?: "/";
  hidden?: boolean;
}) {
  const cls =
    "flex w-14 flex-col items-center gap-0.5 rounded-xl py-1 text-muted-foreground transition active:scale-95 active:bg-muted";
  if (hidden) return <span className="w-14" aria-hidden />;
  const inner = (
    <>
      <span className="text-foreground/80">{icon}</span>
      <span className="text-[9px] font-medium leading-none">{label}</span>
    </>
  );
  return to ? (
    <Link to={to} aria-label={label} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} aria-label={label} className={cls}>
      {inner}
    </button>
  );
}

/** Numéro de page : on tape directement, Entrée ouvre la page (1–604). */
function PageNumberInput({
  page,
  onGo,
  onEditing,
}: {
  page: number;
  onGo: (p: number) => void;
  onEditing: (v: boolean) => void;
}) {
  const [val, setVal] = useState(String(page));
  useEffect(() => setVal(String(page)), [page]);
  const commit = (el: HTMLInputElement) => {
    const n = Number(val);
    if (Number.isInteger(n) && n >= 1 && n <= 604 && n !== page) {
      el.blur();
      onGo(n);
    } else {
      setVal(String(page));
      el.blur();
    }
  };
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      enterKeyHint="go"
      maxLength={3}
      value={val}
      aria-label={`Page ${page} sur 604 — saisir un numéro puis Entrée`}
      onFocus={(e) => {
        const el = e.currentTarget;
        el.select();
        onEditing(true);
        // Après l'ouverture du clavier : amener le champ au centre de la zone visible.
        window.setTimeout(() => el.scrollIntoView({ block: "center", behavior: "smooth" }), 350);
      }}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onChange={(e) => setVal(e.target.value.replace(/\D/g, "").slice(0, 3))}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit(e.currentTarget);
      }}
      onBlur={() => {
        setVal(String(page));
        onEditing(false);
      }}
      className="w-14 rounded-md border-2 border-gold/70 bg-gold/10 px-1 py-1 text-center text-[15px] font-bold tabular-nums text-[#140d05] outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 dark:text-[#fbf5e6]"
    />
  );
}

/** « Méditer cette page » : les leçons du Tafsīr al-Mukhtasar (français) des passages de la page. */
function PageMeditateSheet({
  page,
  passages,
  chapters,
  onClose,
}: {
  page: number;
  passages: MokhtasarPassage[];
  chapters: Chapter[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex max-h-[85dvh] w-full flex-col rounded-t-3xl border-t border-border bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold">Méditer cette page</h2>
            <p className="truncate text-xs text-muted-foreground">
              Page {page} · Tafsīr al-Mukhtasar (français)
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
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-6">
          {passages.map((p) => (
            <section key={`${p.surah}:${p.from}`} className="rounded-2xl border border-border bg-background p-4">
              <p className="mb-2 text-[11px] font-medium text-muted-foreground">
                {chapters.find((c) => c.id === p.surah)?.nameFrench ?? p.surah} · āyāt {p.surah}:{p.from}
                {p.to > p.from ? `–${p.to}` : ""}
              </p>
              <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground">
                {p.lessons.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
