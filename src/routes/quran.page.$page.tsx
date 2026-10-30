import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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
import {
  MIN_FALLBACK_QUERY_LENGTH,
  RECITERS,
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
  loadQcfFont,
  type QcfVariant,
  searchQuranArabic,
  searchQuranFallback,
  TAJWEED_COLORS,
  TAJWEED_LEGEND,
  verseAudioUrl,
  basmalaAudioUrl,
  withBasmalaBridges,
  BASMALA_BRIDGE_KEY,
  type Chapter,
  type PageVerse,
  type SearchResult,
} from "@/lib/mushaf";
import { useLocalState, useFavorites } from "@/lib/storage";
import { usePreferences } from "@/lib/preferences";
import { getPageContent, type EtudeCategory } from "@/lib/etude-content";
import { ContentList, AgirSection } from "@/routes/etude.$surah.$ayah";
import { QuranDisplayModes } from "@/components/QuranDisplayModes";
import { cachedAudioBlobUrl } from "@/lib/offline";
import { cn } from "@/lib/utils";

interface Search {
  r?: string;
  sel?: string;
  /** Portion "Mon Wird" partagée (lien direct, jamais le programme complet
   * ni aucune donnée personnelle de l'auteur — voir §"Partage Mon Wird") :
   * `shared=wird` + `end` = dernière page de la portion, la page de l'URL
   * elle-même étant déjà `startPage`. */
  end?: number;
  shared?: string;
}

export const Route = createFileRoute("/quran/page/$page")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    r: typeof s.r === "string" ? s.r : undefined,
    sel: typeof s.sel === "string" ? s.sel : undefined,
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
type ReadMode = "ayah" | "page" | "surah" | "juz" | "hizb" | "toEnd" | "range";

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
    } catch {
      /* quota */
    }
  }, [page]);

  // Défi du vendredi (Al-Kahf) : chaque page de la sourate lue est comptée ;
  // la dernière page la termine et fait disparaître la pastille d'accueil.
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
  const [progress, setProgress] = useState(0);
  const [loop, setLoop] = useState(false);
  const [ayahRepeat, setAyahRepeat] = useState(1); // 1,3,5 ou 0 = ∞
  const [selRepeat, setSelRepeat] = useState(1); // 1,3,5 ou 0 = ∞
  // Vitesse persistée dans ⚙️ Paramètres > Coran — indépendante de la
  // vitesse Adhkār (§12 mission : quranPlaybackSpeed ≠ adhkarPlaybackSpeed).
  const speed = prefs.quran.speed;
  const setSpeed = (s: number) => updateQuran({ speed: s });
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [pageLifeOpen, setPageLifeOpen] = useState(false);

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
  const immersiveBlocked =
    selected.length > 0 || optionsOpen || searchOpen || showNav || pageLifeOpen;
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
    else resetPlayback(); // fin de file : arrêt propre, plus aucune surbrillance
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

  /** Bascule automatique vers le mode ayah-par-ayah (§3/§4 mission "Coran
   * direct") : dès que Français ou Phonétique est activé, plus de message
   * demandant d'ouvrir ce mode — on y navigue directement, sur la sourate
   * affichée (position préservée au mieux, voir §15). */
  useEffect(() => {
    if (!verses?.length) return; // sourate pas encore connue, jamais naviguer à l'aveugle
    if (prefs.quran.francais || prefs.quran.phonetique) {
      navigate({ to: "/quran/lire/$surah", params: { surah: String(surahOnPage) } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs.quran.francais, prefs.quran.phonetique, verses?.length]);

  /** Ayah de référence : la 1re sélectionnée, sinon la 1re de la page. */
  const anchorVerse =
    (selected.length ? verses?.find((v) => v.key === selected[0]) : verses?.[0]) ?? verses?.[0];
  const anchor = {
    key: anchorVerse?.key ?? "",
    surah: anchorVerse?.surah ?? surahOnPage,
    juz: anchorVerse?.juz ?? 1,
    hizb: anchorVerse?.hizb ?? 1,
  };

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
      fitBox.style.width = `${effectiveWidth}px`;
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
      const ceiling = Math.max(8, best * SAFE_FACTOR);
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
  }, [lines, qcfName]);

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
  }, [selected.length, optionsOpen, searchOpen, showNav, pageLifeOpen]);

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
  const onSheetClick = () => {
    if (Date.now() < suppressClickUntil.current) return;
    if (selected.length) {
      setSelected([]);
      setControlsHidden(true);
      return;
    }
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
    <div className="relative h-[100dvh] overflow-hidden bg-[#fcf9ef] dark:bg-background">
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
          "fixed inset-x-0 top-0 z-20 border-b border-border/40 bg-card/80 px-2 py-1 backdrop-blur-xl transition-transform duration-300 [@media(orientation:landscape)_and_(max-height:500px)]:py-0.5",
          (controlsHidden || selected.length > 0) && "-translate-y-full",
        )}
      >
        <div className="mx-auto flex max-w-2xl items-center gap-1.5">
          <button
            onClick={() => openNav("surah")}
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
            {verses?.[0] && (
              <span className="text-muted-foreground">
                {" "}
                · Juz {verses[0].juz} · Hizb {verses[0].hizb}
              </span>
            )}
          </button>
          <button
            onClick={() => setPageLifeOpen(true)}
            aria-label="Vivre cette page"
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {/* Vraie icône vectorielle, jamais un emoji comme asset final
                (même langage visuel que la petite feuille "Vivre ce dhikr"
                côté Adhkār — chantier "Lecture Coran + Adhkār"). */}
            <Leaf className="size-4" />
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
        className="absolute inset-0 overflow-x-hidden overflow-y-auto px-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-[max(0.25rem,env(safe-area-inset-top))]"
        onTouchStart={onSheetTouchStart}
        onTouchMove={onSheetTouchMove}
        onTouchEnd={onSheetTouchEnd}
        onTouchCancel={onSheetTouchCancel}
        onClick={onSheetClick}
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
        <div ref={fitBoxRef} className="mx-auto flex min-h-full flex-col">
          {/* Métadonnées DANS la page (comme le Mushaf papier) : sourate à gauche,
              juz' à droite — jamais une barre d'application permanente. */}
          {verses?.[0] && (
            <div className="flex min-h-9 shrink-0 items-center justify-between gap-2 px-1 pb-1">
              {/* Sourate à gauche, juz à droite : un tap ouvre la liste et
                  l'on arrive au début de l'élément choisi. */}
              <button
                type="button"
                lang="ar"
                onClick={() => openNav("surah")}
                aria-label="Changer de sourate"
                className="inline-flex items-center gap-1 rounded-md border border-gold/60 px-2.5 py-1 font-arabic text-[15px] font-bold leading-none text-[#140d05] dark:text-[#fbf5e6]"
              >
                {surahMeta?.nameArabic ?? ""}
                <ChevronDown className="size-3 text-gold" />
              </button>
              <button
                type="button"
                lang="ar"
                onClick={() => openNav("juz")}
                aria-label="Changer de juz"
                className="inline-flex items-center gap-1 rounded-md border border-gold/60 px-2.5 py-1 font-arabic text-[15px] font-bold leading-none text-[#140d05] dark:text-[#fbf5e6]"
              >
                الجزء {verses[0].juz}
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
                      "flex items-baseline whitespace-nowrap leading-[1.9] text-[#140d05] dark:text-[#fbf5e6]",
                      centeredPage ? "justify-center gap-x-[0.3em]" : "justify-between",
                    )}
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
                          className={cn(
                            // Surlignage de sélection volontairement très discret
                            // (simple teinte, pas de changement de couleur de texte)
                            // pour éviter l'effet "gros rectangles" — même boîte,
                            // même rayon, aucun reflow (§12 mission menu ayah).
                            "rounded px-[0.02em] transition-colors",
                            isSel && "bg-primary/15",
                            isPlaying && "bg-gold/20 text-gold",
                          )}
                        >
                          {w.end ? (
                            // Numéro de fin d'āyah en chiffres français (le glyphe
                            // imprimé de la police affiche des chiffres arabes).
                            <span
                              lang="fr"
                              dir="ltr"
                              style={{ WebkitTextStroke: 0 }}
                              className="inline-grid size-[0.95em] translate-y-[0.08em] place-items-center rounded-full border border-gold font-sans text-[0.4em] font-bold leading-none tabular-nums text-gold"
                            >
                              {w.ayah}
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
              {/* Numéro de page seul, cliquable : saisie ou curseur 1–604. */}
              <button
                type="button"
                onClick={() => openNav("page")}
                aria-label={`Page ${page} — aller à une autre page`}
                className="min-w-[2.6rem] rounded-md border-2 border-gold/70 bg-gold/10 px-3 py-1 text-[15px] font-bold text-[#140d05] dark:text-[#fbf5e6]"
              >
                {page}
              </button>
              {verses[0].hizb ? (
                <span className="absolute right-2 text-[11px] text-foreground/60">
                  Hizb {verses[0].hizb}
                  {verses[0].rub ? ` · ${((verses[0].rub - 1) % 4) + 1}/4` : ""}
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Une seule barre basse à la fois (§13 mission menu ayah) : les
          actions de l'ayah sélectionnée REMPLACENT les contrôles Mushaf,
          jamais les deux empilés. */}
      {selected.length > 0 && selKey ? (
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
          className={cn(
            "fixed inset-x-0 bottom-0 z-20 border-t border-border/40 bg-card/90 px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-300",
            controlsHidden && "translate-y-full",
          )}
        >
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
                    ...(pageSurahs.length > 1 && !selected.length
                      ? pageSurahs.map((s) => ({
                          id: "surah" as ReadMode,
                          surah: s,
                          label: "Cette sourate",
                          detail: chapters?.find((c) => c.id === s)?.nameFrench,
                        }))
                      : [
                          {
                            id: "surah" as ReadMode,
                            surah: scopeSurah,
                            label: "Cette sourate",
                            detail: chapters?.find((c) => c.id === scopeSurah)?.nameFrench,
                          },
                        ]),
                    { id: "juz", label: "Ce juz'", detail: `Juz ${anchor.juz}` },
                    { id: "hizb", label: "Ce hizb", detail: `Hizb ${anchor.hizb}` },
                    { id: "toEnd", label: "Jusqu'à la fin", detail: undefined },
                  ] as { id: ReadMode; label: string; detail?: string; surah?: number }[]
                ).map((m) => {
                  const active =
                    readMode === m.id && (m.id !== "surah" || m.surah === scopeSurah);
                  return (
                  <button
                    key={m.id + (m.surah ?? "")}
                    onClick={() => {
                      setReadMode(m.id);
                      if (m.id === "surah" && m.surah != null) setSurahPick(m.surah);
                    }}
                    aria-pressed={active}
                    className={cn(
                      "rounded-2xl border px-3 py-2.5 text-left text-sm font-semibold transition",
                      active
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
                  );
                })}
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
                onChange={(e) => {
                  setSearchParam({ r: e.target.value });
                  updateQuran({ reciterId: e.target.value });
                }}
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
              <div className="mb-4 flex gap-1 rounded-full border border-border p-1">
                {TEXT_SIZE_LEVELS.map((lvl) => (
                  <button
                    key={lvl.key}
                    onClick={() => setTextSize(lvl.key)}
                    aria-pressed={prefs.quran.textSize === lvl.key}
                    className={cn(
                      "flex-1 rounded-full py-2 text-sm font-semibold transition",
                      prefs.quran.textSize === lvl.key
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>

              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Affichage
              </p>
              <div className="mb-1 flex gap-1 rounded-full border border-border p-1">
                {(
                  [
                    { v: false, l: "Normal" },
                    { v: true, l: "Tajwīd" },
                  ] as const
                ).map((o) => (
                  <button
                    key={String(o.v)}
                    onClick={() => setTajweedMode(o.v)}
                    aria-pressed={tajweedMode === o.v}
                    className={cn(
                      "flex-1 rounded-full py-2 text-sm font-semibold transition",
                      tajweedMode === o.v
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
              {tajweedMode && (
                <div className="mb-4 grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-2xl border border-border bg-background p-3">
                  {TAJWEED_LEGEND.map((item) => (
                    <div
                      key={item.rule}
                      className="flex items-center gap-1.5 text-[11px] text-foreground"
                    >
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: TAJWEED_COLORS[item.rule] }}
                      />
                      {item.label}
                    </div>
                  ))}
                </div>
              )}

              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Affichage
              </p>
              <div className="mb-2">
                <QuranDisplayModes
                  quran={prefs.quran}
                  onChange={(layers) => updateQuran(layers)}
                  compact
                />
              </div>

              <Link
                to="/parametres"
                search={{ section: "coran" }}
                onClick={() => setOptionsOpen(false)}
                className="mb-1 inline-block text-xs font-medium text-primary underline-offset-2 hover:underline"
              >
                Tous les paramètres
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

type NavTab = "page" | "surah" | "juz";

/** Première page de chaque juz dans le Mushaf de Médine (604 pages). */
const JUZ_START_PAGE = [
  1, 22, 42, 62, 82, 102, 122, 142, 162, 182, 202, 222, 242, 262, 282, 302, 322, 342, 362, 382,
  402, 422, 442, 462, 482, 502, 522, 542, 562, 582,
];

/** Bandeau de début de sourate, façon Mushaf de Médine : double filet, deux
 * panneaux d'arabesques, deux médaillons ronds et un cartouche central aux
 * extrémités en accolade qui porte le nom. La petite feuille (dans le
 * médaillon de gauche) ouvre la fiche de la sourate. */
function SurahBanner({ nameArabic, surah }: { nameArabic: string; surah: number }) {
  const ogee =
    "M118 30C126 17 136 12 150 12H250C264 12 274 17 282 30C274 43 264 48 250 48H150C136 48 126 43 118 30Z";
  const long = nameArabic.length > 9;
  return (
    <div className="relative my-[0.15em] aspect-[400/60] w-full text-[#140d05] dark:text-[#fbf5e6]">
      <svg viewBox="0 0 400 60" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <pattern id="sb-orn" width="9" height="9" patternUnits="userSpaceOnUse">
            <path d="M4.5 .8 8.2 4.5 4.5 8.2 .8 4.5Z" fill="none" stroke="currentColor" strokeWidth=".7" />
            <circle cx="4.5" cy="4.5" r="1" fill="currentColor" />
            <path d="M0 0Q2.2 2.2 0 4.5M9 0Q6.8 2.2 9 4.5M0 9Q2.2 6.8 0 4.5M9 9Q6.8 6.8 9 4.5" fill="none" stroke="currentColor" strokeWidth=".5" />
          </pattern>
        </defs>
        <rect x="1" y="1" width="398" height="58" className="fill-background" stroke="currentColor" strokeWidth="2.2" />
        <rect x="5" y="5" width="390" height="50" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="8" y="8" width="104" height="44" fill="url(#sb-orn)" stroke="currentColor" strokeWidth=".8" />
        <rect x="288" y="8" width="104" height="44" fill="url(#sb-orn)" stroke="currentColor" strokeWidth=".8" />
        {[88, 312].map((x) => (
          <g key={x}>
            <circle cx={x} cy="30" r="21" className="fill-background" stroke="currentColor" strokeWidth="2" />
            <circle cx={x} cy="30" r="17" fill="none" stroke="currentColor" strokeWidth=".9" />
          </g>
        ))}
        <path d={ogee} className="fill-background" stroke="currentColor" strokeWidth="2" />
        <path
          d={ogee}
          fill="none"
          stroke="currentColor"
          strokeWidth=".8"
          vectorEffect="non-scaling-stroke"
          transform="translate(200 30) scale(.93 .82) translate(-200 -30)"
        />
      </svg>
      <p
        lang="ar"
        dir="rtl"
        className={cn(
          "absolute inset-y-0 left-[30%] right-[30%] flex items-center justify-center whitespace-nowrap font-arabic font-bold leading-none",
          long ? "text-[0.8em]" : "text-[1em]",
        )}
      >
        سُورَةُ {nameArabic}
      </p>
      <Link
        to="/sourate/$surah"
        params={{ surah: String(surah) }}
        aria-label="Découvrir la sourate"
        className="absolute left-[22%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.55em] leading-none"
      >
        🌿
      </Link>
    </div>
  );
}

function GoToPanel({
  initialTab,
  juz,
  surahId,
  page,
  chapters,
  reciterId,
  onClose,
}: {
  initialTab: NavTab;
  juz?: number;
  surahId?: number;
  page: number;
  chapters: { id: number; nameArabic: string; nameFrench: string; pages: [number, number] }[];
  reciterId: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<NavTab>(initialTab);
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
  const tabs: { key: NavTab; label: string }[] = [
    { key: "page", label: "Page" },
    { key: "surah", label: "Sourate" },
    { key: "juz", label: "Juz" },
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
        <div className="mb-3 grid grid-cols-3 gap-1 rounded-full bg-muted p-1">
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
          </>
        )}

        {tab === "juz" && (
          <ul className="grid grid-cols-3 gap-2 pb-4">
            {JUZ_START_PAGE.map((p, i) => (
              <li key={i}>
                <button
                  onClick={() => go(p)}
                  className={cn(
                    "flex w-full flex-col items-center rounded-xl border border-border px-2 py-2 text-sm transition hover:bg-muted",
                    i + 1 === juz && "border-gold bg-gold/10",
                  )}
                >
                  <span className="font-semibold">Juz {i + 1}</span>
                  <span className="text-[11px] tabular-nums text-muted-foreground">p. {p}</span>
                </button>
              </li>
            ))}
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
