import { useEffect, useRef, useState, type ReactNode } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Copy,
  Heart,
  MoreHorizontal,
  Pause,
  Play,
  Share2,
  Sparkles,
  Sun,
  Volume2,
  X,
} from "lucide-react";
import { fetchChapters, fetchVerseDetail, verseAudioUrl, defaultReciter } from "@/lib/mushaf";
import { fetchTafsir, sliceSaadiForAyah, tafsirGroupRange, type TafsirSlug } from "@/lib/quran";
import { fetchHamidullahAyah } from "@/lib/hamidullah";
import { useActionsProgress, useFavorites, useLocalState } from "@/lib/storage";
import { formatVerseScope, getEtudeContent, type EtudeContent } from "@/lib/etude-content";
import { SourceInfo } from "@/components/SourceInfo";
import { Card, Empty, Loading } from "@/routes/tadabbur";
import { cn } from "@/lib/utils";

interface EtudeSearch {
  /** Page Mushaf d'où l'utilisateur est venu, pour le retour. */
  fromPage?: string;
  r?: string;
  /** Sélection à restaurer sur le Mushaf au retour (par défaut : cette ayah). */
  sel?: string;
}

export const Route = createFileRoute("/etude/$surah/$ayah")({
  validateSearch: (s: Record<string, unknown>): EtudeSearch => ({
    fromPage: typeof s.fromPage === "string" ? s.fromPage : undefined,
    r: typeof s.r === "string" ? s.r : undefined,
    sel: typeof s.sel === "string" ? s.sel : undefined,
  }),
  head: ({ params }) => ({
    meta: [{ title: `Étudier ${params.surah}:${params.ayah} — Adhkâr` }],
  }),
  component: EtudePage,
});

/**
 * S'orienter (التوجيهات) n'apparaît plus au niveau d'une ayah isolée :
 * cette rubrique vit désormais exclusivement dans « Vivre cette page »,
 * puisque les Tawjihat concernent presque toujours un passage plus large
 * qu'une seule ayah — décision produit assumée, pas un oubli.
 */
type Section = "asbab_nuzul" | "tafsir" | "lesson" | "tadabbur" | "amal" | "today";

const SECTION_META: Record<Section, { label: string; subtitle: string; icon: typeof BookOpen }> = {
  asbab_nuzul: { label: "Circonstances de révélation", subtitle: "سبب النزول", icon: BookOpen },
  tafsir: { label: "Comprendre", subtitle: "تفسير", icon: BookOpen },
  lesson: { label: "Leçons à retenir", subtitle: "دروس", icon: Sparkles },
  tadabbur: { label: "Méditer", subtitle: "تدبر", icon: Sparkles },
  amal: { label: "Agir", subtitle: "العمل بالآيات", icon: Compass },
  today: { label: "Dans ma vie", subtitle: "في حياتي", icon: Sun },
};

function EtudePage() {
  const { surah: surahParam, ayah: ayahParam } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const surah = Number(surahParam);
  const ayah = Number(ayahParam);
  const verseKey = `${surah}:${ayah}`;

  const [tab, setTab] = useState<StudyTab>("mukhtasar");
  const [lang, setLang] = useLocalState<StudyLang>("etude:lang", "fr");
  const [menuOpen, setMenuOpen] = useState(false);
  const [ayahOpen, setAyahOpen] = useState(false);
  const [trOpen, setTrOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const longPress = useRef<number | null>(null);
  // Nouvelle āyah : blocs repliés.
  useEffect(() => {
    setMenuOpen(false);
    setAyahOpen(false);
    setTrOpen(false);
  }, [surah, ayah]);

  const { data: chapters } = useQuery({
    queryKey: ["chapters-fr"],
    queryFn: fetchChapters,
    staleTime: Infinity,
  });
  const { data: verse, isPending: versePending } = useQuery({
    queryKey: ["verse-detail", verseKey],
    queryFn: () => fetchVerseDetail(verseKey),
    staleTime: Infinity,
  });
  const { data: hamidullah, isPending: hamidullahPending } = useQuery({
    queryKey: ["hamidullah", verseKey],
    queryFn: () => fetchHamidullahAyah(surah, ayah),
    staleTime: Infinity,
  });

  const chapterMeta = chapters?.find((c) => c.id === surah);

  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const fav = isFavorite("ayah", verseKey);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const toggleAudio = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      if (!el.src) el.src = verseAudioUrl(defaultReciter, verseKey);
      el.play().catch(() => setPlaying(false));
    }
  };
  const shareAyah = async () => {
    if (!verse) return;
    const url = new URL(`/quran/page/${verse.page}`, window.location.origin);
    url.searchParams.set("sel", verseKey);
    const label = chapterMeta ? `${chapterMeta.nameFrench} — ${verseKey}` : verseKey;
    const text = [verse.arabic, hamidullah?.translation, label, url.toString()]
      .filter(Boolean)
      .join("\n\n");
    try {
      if (navigator.share) await navigator.share({ text, url: url.toString() });
      else await navigator.clipboard.writeText(text);
    } catch {
      /* annulé */
    }
  };

  /** Copier = référence + arabe + traduction (les couches affichées en en-tête). */
  const copyAyah = async () => {
    if (!verse) return;
    const parts = [verseKey, verse.arabic, hamidullah?.translation].filter(Boolean);
    try {
      await navigator.clipboard.writeText(parts.join("\n\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* refusé */
    }
    setMenuOpen(false);
  };

  const goToAyah = (delta: number) => {
    const next = ayah + delta;
    if (next < 1 || (chapterMeta && next > chapterMeta.versesCount)) return;
    navigate({
      to: "/etude/$surah/$ayah",
      params: { surah: String(surah), ayah: String(next) },
      search,
    });
  };

  // Contenus locaux (synchrones) — vides tant qu'aucune donnée n'est vérifiée
  // pour cette ayah. Aucune rubrique n'est affichée si elle est vide : une
  // rubrique absente est toujours préférable à un contenu religieux
  // incertain ou mal rattaché.
  const contexteItems = getEtudeContent(verseKey, "asbab_nuzul", verse?.page);
  const lessonItems = getEtudeContent(verseKey, "lesson", verse?.page);
  const meditateItems = getEtudeContent(verseKey, "tadabbur", verse?.page);
  const agirItems = getEtudeContent(verseKey, "amal", verse?.page);
  const todayItems = getEtudeContent(verseKey, "today", verse?.page);

  // Ordre conceptuel : Comprendre → Ce que cette ayah m'apporte → Méditer →
  // Agir → Circonstances de révélation (§4.3/4.4 chantier accueil/mobile).
  const sections: Section[] = [
    "tafsir",
    ...(lessonItems.length ? (["lesson"] as const) : []),
    ...(meditateItems.length ? (["tadabbur"] as const) : []),
    ...(agirItems.length ? (["amal"] as const) : []),
    ...(todayItems.length ? (["today"] as const) : []),
    ...(contexteItems.length ? (["asbab_nuzul"] as const) : []),
  ];

  // 🔊 Écouter l'explication (§15) : lecture vocale FRANÇAISE du texte
  // pédagogique déjà affiché — jamais le Coran (récitation arabe = toggleAudio
  // ci-dessus, moteur distinct). SpeechSynthesis lit exactement ces textes,
  // il n'en génère aucun.
  const [speaking, setSpeaking] = useState(false);
  const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const explanationTexts = [
    ...lessonItems.map((i) => i.translationFr),
    ...meditateItems.map((i) => i.translationFr),
    ...agirItems.map((i) => i.translationFr),
    ...todayItems.map((i) => i.translationFr),
    ...contexteItems.map((i) => i.translationFr),
  ].filter((t): t is string => !!t);
  const toggleExplanation = () => {
    if (!speechSupported) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    if (!explanationTexts.length) return;
    const utterance = new SpeechSynthesisUtterance(explanationTexts.join(". "));
    utterance.lang = "fr-FR";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const backToMushaf = () => {
    navigate({
      to: "/quran/page/$page",
      params: { page: search.fromPage ?? String(verse?.page ?? 1) },
      search: { r: search.r, sel: search.sel ?? verseKey },
    });
  };

  // Rubriques toujours affichées (objectif principal de l'étude), même sans contenu.
  const plusSections: Section[] = ["asbab_nuzul", "lesson", "tadabbur", "amal", "today"];
  const plusCount: Record<string, number> = {
    asbab_nuzul: contexteItems.length,
    lesson: lessonItems.length,
    tadabbur: meditateItems.length,
    amal: agirItems.length,
    today: todayItems.length,
  };
  const tabs: { key: StudyTab; label: string }[] = [
    { key: "mukhtasar", label: "Mukhtasar" },
    { key: "saadi", label: "As-Saʿdī" },
    { key: "ibnkathir", label: "Ibn Kathīr" },
    { key: "plus" as StudyTab, label: "Leçons & actions" },
  ];

  const startPress = () => {
    longPress.current = window.setTimeout(() => setMenuOpen(true), 500);
  };
  const endPress = () => {
    if (longPress.current != null) window.clearTimeout(longPress.current);
    longPress.current = null;
  };

  const menuItem =
    "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-foreground transition hover:bg-muted";

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* En-tête minimal : 1 ligne. Les actions sont dans « ⋯ » (ou appui long sur l'āyah). */}
      <header className="relative shrink-0 border-b border-border/40 bg-card/90 px-2 py-1.5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-1">
          <button
            onClick={backToMushaf}
            aria-label="Fermer et retourner au Mushaf"
            className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
          <button
            onClick={() => goToAyah(-1)}
            disabled={ayah <= 1}
            aria-label="Āyah précédente"
            className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition disabled:opacity-30"
          >
            <ChevronLeft className="size-5" />
          </button>
          <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-foreground">
            {chapterMeta?.nameFrench ?? `Sourate ${surah}`} ·{" "}
            <span className="tabular-nums">{verseKey}</span>
          </p>
          <button
            onClick={() => goToAyah(1)}
            disabled={!!chapterMeta && ayah >= chapterMeta.versesCount}
            aria-label="Āyah suivante"
            className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition disabled:opacity-30"
          >
            <ChevronRight className="size-5" />
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Actions sur cette āyah"
            aria-expanded={menuOpen}
            className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <MoreHorizontal className="size-5" />
          </button>
        </div>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-2 top-full z-40 mt-1 w-56 rounded-2xl border border-border bg-card p-1.5 shadow-[var(--shadow-elevated)]">
              <button
                className={menuItem}
                onClick={() => {
                  toggleAudio();
                  setMenuOpen(false);
                }}
              >
                {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
                {playing ? "Pause" : "Écouter la récitation"}
              </button>
              <button
                className={menuItem}
                onClick={() => {
                  toggleFavorite("ayah", verseKey);
                  setMenuOpen(false);
                }}
              >
                <Heart className={cn("size-4", fav && "fill-gold text-gold")} />
                {fav ? "Retirer des favoris" : "Ajouter aux favoris"}
              </button>
              <button className={menuItem} onClick={copyAyah}>
                <Copy className="size-4" /> Copier
              </button>
              <button
                className={menuItem}
                onClick={() => {
                  void shareAyah();
                  setMenuOpen(false);
                }}
              >
                <Share2 className="size-4" /> Partager
              </button>
              {speechSupported && explanationTexts.length > 0 && (
                <button
                  className={menuItem}
                  onClick={() => {
                    toggleExplanation();
                    setMenuOpen(false);
                  }}
                >
                  <Volume2 className="size-4" />{" "}
                  {speaking ? "Arrêter la lecture" : "Écouter l'explication"}
                </button>
              )}
            </div>
          </>
        )}
      </header>

      {/* L'āyah et sa traduction : compactes (2-3 lignes), dépliables d'un tap ; appui long = actions. */}
      <section
        className="shrink-0 select-none border-b border-border/40 bg-card/50 px-4 py-2.5"
        onPointerDown={startPress}
        onPointerUp={endPress}
        onPointerLeave={endPress}
        onPointerCancel={endPress}
        onContextMenu={(ev) => {
          ev.preventDefault();
          setMenuOpen(true);
        }}
      >
        <div className="mx-auto max-w-2xl">
          {versePending ? (
            <Loading />
          ) : (
            <p
              lang="ar"
              dir="rtl"
              onClick={() => setAyahOpen((v) => !v)}
              className={cn(
                "cursor-pointer font-arabic text-[1.35rem] font-bold leading-[2] text-foreground",
                !ayahOpen && "line-clamp-2",
              )}
            >
              {verse?.arabic}
            </p>
          )}
          {hamidullahPending ? null : hamidullah ? (
            <div
              onClick={() => setTrOpen((v) => !v)}
              className="mt-1 cursor-pointer text-[0.9rem] leading-[1.6] text-muted-foreground"
            >
              <p className={cn(!trOpen && "line-clamp-3")}>{hamidullah.translation}</p>
              {trOpen && hamidullah.footnotes && <p className="mt-2 text-xs">{hamidullah.footnotes}</p>}
              {trOpen && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                  Traduction des sens — Muhammad Hamidullah
                  <SourceInfo
                    sourceTitle="Traduction française des sens du Coran"
                    sourceAuthor="Muhammad Hamidullah"
                    editorialSource="QuranEnc"
                    nature="Traduction publiée, réutilisée telle quelle."
                  />
                </p>
              )}
            </div>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Traduction indisponible pour le moment.
            </p>
          )}
        </div>
      </section>

      {/* Onglets + langue : une seule ligne fine, toujours visible. */}
      <div className="shrink-0 border-b border-border/40 bg-background px-3 py-1.5">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <div role="tablist" aria-label="Tafsīr" className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "min-h-10 shrink-0 rounded-full px-3 text-[13px] font-semibold transition",
                  tab === t.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tab !== "plus" && (
            <div
              role="group"
              aria-label="Langue"
              className="flex shrink-0 rounded-full border border-border p-0.5"
            >
              {(
                [
                  ["fr", "FR"],
                  ["ar", "ع"],
                  ["both", "FR+ع"],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  aria-pressed={lang === k}
                  aria-label={k === "fr" ? "Français" : k === "ar" ? "Arabe" : "Français et arabe"}
                  onClick={() => setLang(k)}
                  className={cn(
                    "min-h-9 rounded-full px-2.5 text-xs font-bold transition",
                    lang === k ? "bg-foreground text-background" : "text-muted-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Le tafsīr occupe tout le reste de l'écran. */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-4">
          {tab === "plus" ? (
            <div className="space-y-5">
              {plusSections.map((key) => (
                <div key={key}>
                  <h3 className="mb-2 text-sm font-bold text-foreground">
                    {SECTION_META[key].label}{" "}
                    <span
                      lang="ar"
                      className="font-arabic text-xs font-normal text-muted-foreground"
                    >
                      {SECTION_META[key].subtitle}
                    </span>
                  </h3>
                  {plusCount[key] === 0 && (
                    <p className="rounded-xl border border-dashed border-border px-3 py-3 text-xs text-muted-foreground">
                      Pas encore de contenu sourcé pour cette āyah.
                    </p>
                  )}
                  {key === "asbab_nuzul" && <ContentList items={contexteItems} />}
                  {key === "lesson" && <ContentList items={lessonItems} />}
                  {key === "tadabbur" && <ContentList items={meditateItems} />}
                  {key === "today" && <ContentList items={todayItems} />}
                  {key === "amal" && <AgirSection items={agirItems} />}
                </div>
              ))}
            </div>
          ) : (
            <TafsirReader
              key={tab + verseKey}
              tab={tab}
              lang={lang}
              surah={surah}
              ayah={ayah}
              versesCount={chapterMeta?.versesCount ?? ayah}
            />
          )}
        </div>
      </div>

      {copied && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
          <span className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
            Copié
          </span>
        </div>
      )}
    </div>
  );
}

type StudyTab = "mukhtasar" | "saadi" | "ibnkathir" | "plus";
type StudyLang = "fr" | "ar" | "both";

const TAFSIR_META: Record<
  Exclude<StudyTab, "plus">,
  { title: string; note: string; hasFrench: boolean }
> = {
  mukhtasar: {
    title: "Al-Mukhtasar fî at-tafsîr al-Qur'ân al-karîm",
    note: "Markaz Tafsîr — un texte par āyah.",
    hasFrench: true,
  },
  saadi: { title: "Tafsîr as-Saʿdî", note: "Cheikh ʿAbd ar-Rahmân as-Saʿdî.", hasFrench: false },
  ibnkathir: { title: "Tafsîr Ibn Kathîr", note: "Al-Hâfiz Ibn Kathîr.", hasFrench: false },
};

/** Texte arabe avec les notes d'édition [[…]] atténuées (jamais supprimées). */
function ArabicBody({ text }: { text: string }) {
  const parts = text.split(/(\[\[[^\]]*\]\])/g);
  return (
    <p
      lang="ar"
      dir="rtl"
      className="font-arabic text-right text-[1.3rem] leading-[2.2] text-foreground"
    >
      {parts.map((p, i) =>
        p.startsWith("[[") ? (
          <span key={i} className="text-[0.8em] text-muted-foreground">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </p>
  );
}

function FrenchBody({ text }: { text: string }) {
  return <p className="text-[1.05rem] leading-[1.95] text-foreground">{text}</p>;
}

function Block({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{label}</p>
      )}
      {children}
    </div>
  );
}

/**
 * Lecture d'UN tafsīr, pour la seule āyah choisie. Chaque ouvrage reste
 * indépendant, jamais fusionné. Français : seul Al-Mukhtasar a une édition
 * française publiée dans nos sources ; pour As-Saʿdî et Ibn Kathîr on le dit
 * clairement (jamais de traduction improvisée).
 */
function TafsirReader({
  tab,
  lang,
  surah,
  ayah,
  versesCount,
}: {
  tab: Exclude<StudyTab, "plus">;
  lang: StudyLang;
  surah: number;
  ayah: number;
  versesCount: number;
}) {
  const meta = TAFSIR_META[tab];
  const wantFr = lang === "fr" || lang === "both";
  const wantAr = lang === "ar" || lang === "both";
  const arSlug: TafsirSlug =
    tab === "mukhtasar"
      ? "ar-tafsir-al-mukhtasar"
      : tab === "saadi"
        ? "ar-tafsir-as-saadi"
        : "ar-tafsir-ibn-kathir";

  const noFrench = wantFr && !meta.hasFrench;
  const needArabic = wantAr || noFrench;

  const { data: arRaw, isPending: arPending } = useQuery({
    queryKey: ["tafsir-etude", arSlug, surah, ayah],
    queryFn: () => fetchTafsir(arSlug, surah, ayah),
    enabled: needArabic,
    staleTime: Infinity,
  });
  const { data: frText, isPending: frPending } = useQuery({
    queryKey: ["tafsir-etude", "french-mokhtasar", surah, ayah],
    queryFn: () => fetchTafsir("french-mokhtasar", surah, ayah),
    enabled: tab === "mukhtasar" && wantFr,
    staleTime: Infinity,
  });
  const { data: group } = useQuery({
    queryKey: ["tafsir-group", arSlug, surah, ayah],
    queryFn: () => tafsirGroupRange(arSlug, surah, ayah, versesCount, arRaw ?? ""),
    enabled: tab === "ibnkathir" && !!arRaw,
    staleTime: Infinity,
  });

  let arText = arRaw ?? "";
  let scopeNote: string | null = null;
  if (tab === "saadi" && arRaw) {
    const s = sliceSaadiForAyah(arRaw, ayah);
    arText = s.text;
    if (s.isolated && s.range) {
      scopeNote = `Passage du verset ${ayah} (le commentaire d'as-Saʿdî couvre les versets ${s.range[0]} à ${s.range[1]}).`;
    } else if (s.range && s.range[0] !== s.range[1]) {
      scopeNote = `Ce commentaire couvre les versets ${s.range[0]} à ${s.range[1]} ; il est affiché en entier.`;
    }
  }
  if (tab === "ibnkathir" && group && group[0] !== group[1]) {
    scopeNote = `Ce commentaire couvre les versets ${group[0]} à ${group[1]} ; il est affiché en entier.`;
  }

  return (
    <div className="space-y-5">
      {scopeNote && (
        <p className="rounded-xl bg-muted px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          {scopeNote}
        </p>
      )}

      {wantFr && meta.hasFrench && (
        <Block label={lang === "both" ? "Français" : undefined}>
          {frPending ? (
            <Loading />
          ) : frText ? (
            <FrenchBody text={frText} />
          ) : (
            <Empty text="Pas de contenu pour cette āyah." />
          )}
        </Block>
      )}

      {noFrench && (
        <div className="rounded-xl border border-border bg-card px-3.5 py-3 text-sm leading-relaxed text-muted-foreground">
          Il n'existe pas de traduction française de ce tafsīr dans nos sources : le texte arabe est
          affiché ci-dessous.
        </div>
      )}

      {needArabic && (
        <Block label={lang === "both" && meta.hasFrench ? "العربية" : undefined}>
          {arPending ? (
            <Loading />
          ) : arText ? (
            <ArabicBody text={arText} />
          ) : (
            <Empty text="Pas de contenu pour cette āyah." />
          )}
        </Block>
      )}

      <div className="flex items-center gap-1 border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
        {meta.note}
        <SourceInfo
          sourceTitle={meta.title}
          nature={
            meta.hasFrench
              ? "Texte arabe et traduction française publiés, réutilisés tels quels."
              : "Texte arabe source, aucune traduction française publiée identifiée."
          }
        />
      </div>
    </div>
  );
}

/** Contexte / Leçons / Méditer / Dans ma vie — portée, provenance via ⓘ. */
export function ContentList({ items }: { items: EtudeContent[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ContentCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function ContentCard({ item }: { item: EtudeContent }) {
  const [showArabic, setShowArabic] = useState(false);
  const scope = formatVerseScope(item);
  return (
    <Card>
      {scope && <p className="mb-1.5 text-[11px] font-semibold text-primary">{scope}</p>}
      {item.translationFr && (
        <p className="text-[0.95rem] leading-[1.85] text-foreground/90">{item.translationFr}</p>
      )}
      {item.reflectionQuestionFr && (
        <p className="mt-2.5 text-sm italic text-muted-foreground">{item.reflectionQuestionFr}</p>
      )}
      <div className="mt-3 flex items-center gap-1 border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
        {item.sourceAuthor ?? item.editorialSource ?? item.sourceTitle}
        <SourceInfo
          sourceTitle={item.sourceTitle}
          sourceAuthor={item.sourceAuthor}
          editorialSource={item.editorialSource}
          sourceReference={item.sourceReference}
          scope={scope}
          authenticity={item.authenticity}
          nature={
            item.contentOrigin === "pedagogical_synthesis"
              ? "Synthèse pédagogique construite à partir des sources listées."
              : "Traduction de travail réalisée pour l'application, non officielle."
          }
        />
      </div>
      {item.textAr && (
        <div className="mt-1.5">
          <button
            onClick={() => setShowArabic((v) => !v)}
            className="text-xs font-semibold text-primary"
          >
            {showArabic ? "Masquer l'original" : "العربية · Voir l'original"}
          </button>
          {showArabic && (
            <p
              lang="ar"
              dir="rtl"
              className="mt-1.5 font-arabic text-right leading-[2] text-foreground"
            >
              {item.textAr}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

/** Agir — cases à cocher « Je l'ai mise en pratique », sans score ni classement. */
export function AgirSection({ items }: { items: EtudeContent[] }) {
  const { isCompleted, toggle } = useActionsProgress();
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <AgirCard key={item.id} item={item} isCompleted={isCompleted} toggle={toggle} />
      ))}
    </div>
  );
}

function AgirCard({
  item,
  isCompleted,
  toggle,
}: {
  item: EtudeContent;
  isCompleted: (id: string) => boolean;
  toggle: (id: string) => void;
}) {
  const [showArabic, setShowArabic] = useState(false);
  const scope = formatVerseScope(item);
  const done = isCompleted(item.id);
  return (
    <Card>
      {scope && <p className="mb-1.5 text-[11px] font-semibold text-primary">{scope}</p>}
      <label className="flex items-start gap-2.5">
        <input
          type="checkbox"
          checked={done}
          onChange={() => toggle(item.id)}
          className="mt-1 size-4 shrink-0 accent-primary"
        />
        <span
          className={cn(
            "text-[0.95rem] leading-[1.85]",
            done ? "text-muted-foreground line-through" : "text-foreground/90",
          )}
        >
          {item.translationFr}
        </span>
      </label>
      <div className="mt-3 flex items-center gap-1 border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
        {item.editorialSource ?? item.sourceTitle}
        <SourceInfo
          sourceTitle={item.sourceTitle}
          editorialSource={item.editorialSource}
          sourceReference={item.sourceReference}
          scope={scope}
          nature="Traduction de travail réalisée pour l'application, non officielle."
        />
      </div>
      {item.textAr && (
        <div className="mt-1.5">
          <button
            onClick={() => setShowArabic((v) => !v)}
            className="text-xs font-semibold text-primary"
          >
            {showArabic ? "Masquer l'original" : "العربية · Voir l'original"}
          </button>
          {showArabic && (
            <p
              lang="ar"
              dir="rtl"
              className="mt-1.5 font-arabic text-right leading-[2] text-foreground"
            >
              {item.textAr}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
