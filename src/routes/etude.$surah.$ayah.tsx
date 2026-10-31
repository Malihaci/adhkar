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
import { fetchMokhtasarLessons, fetchSurahText, fetchTafsir, splitSaadiBlocks, tafsirGroupRange, type TafsirSlug } from "@/lib/quran";
import { itemsForAyah, loadTadabburPage, pageLevelItems, type TaItem } from "@/lib/tadabbur-amal";
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
    meta: [{ title: `Étudier ${params.surah}:${params.ayah} — NurMaLiHa` }],
  }),
  component: EtudePage,
});

/**
 * S'orienter (التوجيهات) n'apparaît plus au niveau d'une ayah isolée :
 * cette rubrique vit désormais exclusivement dans « Vivre cette page »,
 * puisque les Tawjihat concernent presque toujours un passage plus large
 * qu'une seule ayah — décision produit assumée, pas un oubli.
 */
type Section = "asbab_nuzul" | "tafsir" | "lesson" | "tadabbur" | "amal" | "tawjihat" | "today";

const SECTION_META: Record<Section, { label: string; subtitle: string; icon: typeof BookOpen }> = {
  asbab_nuzul: { label: "Circonstances de révélation", subtitle: "سبب النزول", icon: BookOpen },
  tafsir: { label: "Comprendre", subtitle: "تفسير", icon: BookOpen },
  lesson: { label: "Leçons à retenir", subtitle: "دروس", icon: Sparkles },
  tadabbur: { label: "Méditer", subtitle: "تدبر", icon: Sparkles },
  amal: { label: "Agir", subtitle: "العمل بالآيات", icon: Compass },
  tawjihat: { label: "S’orienter", subtitle: "التوجيهات", icon: Compass },
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
  const [main, setMain] = useState<MainTab>("comp");
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
  const onlyThisAyah = (items: EtudeContent[]) => items.filter((c) => c.scopeType === "verse");
  const meditateItems = onlyThisAyah(getEtudeContent(verseKey, "tadabbur"));
  const agirItems = onlyThisAyah(getEtudeContent(verseKey, "amal"));
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
  const { data: mkLessons } = useQuery({
    queryKey: ["mokhtasar-lessons"],
    queryFn: fetchMokhtasarLessons,
    staleTime: Infinity,
  });
  const mkHasLessons = !!mkLessons?.some((x) => x.surah === surah && ayah >= x.from && ayah <= x.to);
  // « القرآن تدبر وعمل » (source 517) : le contenu local relu à la main reste
  // prioritaire ; la source n'est utilisée que pour une catégorie sans contenu local.
  const { data: surahText } = useQuery({
    queryKey: ["surah-text", surah],
    queryFn: () => fetchSurahText(surah),
    staleTime: Infinity,
  });
  const { data: taPage } = useQuery({
    queryKey: ["ta-page", surah, surahText?.find((a) => a.n === ayah)?.page],
    queryFn: () => loadTadabburPage(surah, ayah, surahText ?? []),
    enabled: !!surahText && surah !== 1, // Al-Fātiha : contenu local relu uniquement
    staleTime: Infinity,
  });
  const tawjihatLocal = onlyThisAyah(getEtudeContent(verseKey, "tawjihat"));
  // Source 517 : points qui citent cette āyah (seule ou dans un groupe d'āyāt) ;
  // sans rien de tel, repli sur les points de la page, étiquetés comme tels.
  const forAyah = (category: "tadabbur" | "amal" | "tawjihat", fallbackToPage: boolean) => {
    const hits = itemsForAyah(taPage, category, ayah);
    return hits.length || !fallbackToPage ? hits : pageLevelItems(taPage, category);
  };
  const taTadabbur = meditateItems.length ? [] : forAyah("tadabbur", true);
  const taAmal = agirItems.length ? [] : forAyah("amal", true);
  const taTawjihat = tawjihatLocal.length ? [] : forAyah("tawjihat", false);
  const plusCount: Record<string, number> = {
    lesson: lessonItems.length + (mkHasLessons ? 1 : 0),
    tadabbur: meditateItems.length + taTadabbur.length,
    amal: agirItems.length + taAmal.length,
    tawjihat: tawjihatLocal.length + taTawjihat.length,
    today: todayItems.length,
  };

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

      {/* Trois questions, petits onglets à icône ; un seul bouton pour l'arabe. */}
      <div className="shrink-0 border-b border-border/40 bg-background px-3 py-1.5">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <div role="tablist" aria-label="Étudier" className="flex min-w-0 flex-1 gap-1">
            {MAIN_TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                role="tab"
                aria-selected={main === key}
                onClick={() => setMain(key)}
                className={cn(
                  "inline-flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-[13px] font-semibold transition",
                  main === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-pressed={lang === "ar"}
            aria-label={lang === "ar" ? "Afficher en français" : "Afficher en arabe"}
            onClick={() => setLang(lang === "ar" ? "fr" : "ar")}
            className="h-9 shrink-0 rounded-full border border-border px-3 text-xs font-bold text-foreground transition hover:bg-muted"
          >
            {lang === "ar" ? "FR" : "عربي"}
          </button>
        </div>
        {main === "comp" && (
          <div role="tablist" aria-label="Sources" className="mx-auto mt-1.5 flex max-w-2xl gap-1 overflow-x-auto pb-0.5">
            {SOURCE_CHIPS.map((c) => (
              <button
                key={c.key}
                role="tab"
                aria-selected={tab === c.key}
                onClick={() => setTab(c.key)}
                className={cn(
                  "h-8 shrink-0 rounded-full border px-3 text-xs font-semibold transition",
                  tab === c.key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-4">
          {main === "comp" &&
            (tab === "asbab" ? (
              <AsbabPanel key={verseKey} surah={surah} ayah={ayah} items={contexteItems} />
            ) : (
              <TafsirReader
                key={tab + verseKey}
                tab={tab}
                lang={lang}
                surah={surah}
                ayah={ayah}
                versesCount={chapterMeta?.versesCount ?? ayah}
              />
            ))}

          {main === "med" &&
            (lessonItems.length > 0 || mkHasLessons || plusCount.tadabbur > 0 ? (
              <div className="space-y-5">
                {(lessonItems.length > 0 || mkHasLessons) && (
                  <section>
                    <h3 className="mb-2 text-sm font-bold text-foreground">
                      Leçons à retenir{" "}
                      <span lang="ar" className="font-arabic text-xs font-normal text-muted-foreground">
                        دروس
                      </span>
                    </h3>
                    <ContentList items={lessonItems} lang={lang} />
                    <MokhtasarLessons surah={surah} ayah={ayah} />
                  </section>
                )}
                {plusCount.tadabbur > 0 && (
                  <section>
                    <h3 className="mb-2 text-sm font-bold text-foreground">
                      Méditer{" "}
                      <span lang="ar" className="font-arabic text-xs font-normal text-muted-foreground">
                        الوقفات التدبرية
                      </span>
                    </h3>
                    <ContentList items={meditateItems} lang={lang} />
                    <TaList items={taTadabbur} lang={lang} ayah={ayah} />
                  </section>
                )}
              </div>
            ) : (
              <Empty text="Aucun contenu de méditation pour cette āyah dans nos sources." />
            ))}

          {main === "act" &&
            (plusCount.amal > 0 || plusCount.tawjihat > 0 || plusCount.today > 0 ? (
              <div className="space-y-5">
                {plusCount.amal > 0 && (
                  <section>
                    <h3 className="mb-2 text-sm font-bold text-foreground">
                      Mettre en pratique{" "}
                      <span lang="ar" className="font-arabic text-xs font-normal text-muted-foreground">
                        العمل بالآيات
                      </span>
                    </h3>
                    <AgirSection items={agirItems} />
                    <TaList items={taAmal} lang={lang} ayah={ayah} checkable />
                  </section>
                )}
                {plusCount.tawjihat > 0 && (
                  <section>
                    <h3 className="mb-2 text-sm font-bold text-foreground">
                      Directives{" "}
                      <span lang="ar" className="font-arabic text-xs font-normal text-muted-foreground">
                        التوجيهات
                      </span>
                    </h3>
                    <ContentList items={tawjihatLocal} lang={lang} />
                    <TaList items={taTawjihat} lang={lang} ayah={ayah} />
                  </section>
                )}
                {plusCount.today > 0 && (
                  <section>
                    <h3 className="mb-2 text-sm font-bold text-foreground">
                      Dans ma vie{" "}
                      <span lang="ar" className="font-arabic text-xs font-normal text-muted-foreground">
                        في حياتي
                      </span>
                    </h3>
                    <ContentList items={todayItems} lang={lang} />
                  </section>
                )}
              </div>
            ) : (
              <Empty text="Aucune action rattachée à cette āyah dans nos sources." />
            ))}
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

/**
 * Circonstances de révélation (أسباب النزول) : le contenu local relu d'abord ;
 * puis « Asbāb an-nuzūl » d'Al-Wāḥidī (texte ANGLAIS publié — ni arabe ni
 * français disponibles dans nos sources), avec traduction automatique
 * facultative, étiquetée non officielle. Une āyah sans cause rapportée l'indique.
 */
function AsbabPanel({ surah, ayah, items }: { surah: number; ayah: number; items: EtudeContent[] }) {
  const { data: raw, isPending } = useQuery({
    queryKey: ["asbab-wahidi", surah, ayah],
    queryFn: () => fetchTafsir("en-asbab-al-nuzul-by-al-wahidi", surah, ayah),
    staleTime: Infinity,
  });
  const en = (raw ?? "").replace(/<[^>]+>/g, "").trim();
  return (
    <div className="space-y-5">
      {items.length > 0 && <ContentList items={items} />}
      {isPending ? (
        <Loading />
      ) : en ? (
        <>
          <Block label="Asbāb an-nuzūl — Al-Wāḥidī (texte anglais)">
            <p className="text-[1.05rem] leading-[1.95] text-foreground">{en}</p>
          </Block>
          <Block label="Traduction automatique, non officielle">
            <AutoTranslate cacheKey={`wahidi:${surah}:${ayah}`} text={en} from="en" />
          </Block>
        </>
      ) : items.length === 0 ? (
        <Empty text="Aucune cause de révélation rapportée pour cette āyah dans nos sources." />
      ) : null}
      <div className="flex items-center gap-1 border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
        Asbāb an-nuzūl — Al-Wāḥidī. Français et arabe non disponibles dans nos sources.
      </div>
    </div>
  );
}

/** Points « القرآن تدبر وعمل » (source 517) : texte arabe exact, jamais reformulé. */
function TaList({
  items,
  lang,
  ayah,
  checkable,
}: {
  items: TaItem[];
  lang: StudyLang;
  ayah: number;
  checkable?: boolean;
}) {
  const { isCompleted, toggle } = useActionsProgress();
  if (!items.length) return null;
  const fr = lang !== "ar";
  return (
    <div className="mt-2 space-y-3">
      {items.map((it) => (
        <Card key={it.id}>
          {it.verseStart == null || it.verseEnd == null ? (
            <p className="mb-1.5 text-[11px] font-semibold text-muted-foreground">
              Point de la page, non rattaché à une āyah précise
            </p>
          ) : ayah < it.verseStart || ayah > it.verseEnd ? (
            <p className="mb-1.5 text-[11px] font-semibold text-muted-foreground">
              Autre āyah de la même page : {it.surah}:{it.verseStart}
              {it.verseEnd > it.verseStart ? `–${it.verseEnd}` : ""}
            </p>
          ) : (
            it.verseEnd > it.verseStart && (
              <p className="mb-1.5 text-[11px] font-semibold text-primary">
                Concerne les āyāt {it.surah}:{it.verseStart}–{it.verseEnd}
              </p>
            )
          )}
          {fr ? (
            <>
              <AutoTranslate cacheKey={`ta517:${it.id}`} text={it.originalText} />
              {it.question && (
                <div className="mt-2 text-primary">
                  <AutoTranslate cacheKey={`ta517q:${it.id}`} text={it.question} />
                </div>
              )}
            </>
          ) : (
            <>
              {it.quote && (
                <p lang="ar" dir="rtl" className="mb-2 font-naskh text-right text-lg leading-[2] text-muted-foreground">
                  {it.quote}
                </p>
              )}
              <p lang="ar" dir="rtl" className="whitespace-pre-line text-right font-naskh text-[1.15rem] font-medium leading-[2.1] text-foreground">
                {it.originalText}
              </p>
              {it.question && (
                <p lang="ar" dir="rtl" className="mt-2 text-right font-naskh text-base leading-[2] text-primary">
                  {it.question}
                </p>
              )}
            </>
          )}
          {checkable && (
            <label className="mt-3 flex min-h-11 items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={isCompleted(it.id)}
                onChange={() => toggle(it.id)}
                className="h-5 w-5 accent-primary"
              />
              Je l'ai mise en pratique
            </label>
          )}
          <div className="mt-2 flex items-center gap-1 border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
            {fr ? "Traduction automatique, non officielle · source arabe" : "Texte arabe de la source"}
            <SourceInfo
              sourceTitle={it.sourceTitle}
              editorialSource="مركز المنهاج"
              sourceReference={`QUL ressource ${it.sourceResourceId} · ${it.sourceProvider}`}
              nature="Texte source non relu manuellement (validationStatus : source_text)."
            />
          </div>
        </Card>
      ))}
    </div>
  );
}

function MokhtasarLessons({ surah, ayah }: { surah: number; ayah: number }) {
  const { data } = useQuery({
    queryKey: ["mokhtasar-lessons"],
    queryFn: fetchMokhtasarLessons,
    staleTime: Infinity,
  });
  const p = data?.find((x) => x.surah === surah && ayah >= x.from && ayah <= x.to);
  if (!p) return null;
  return (
    <div className="mt-2 rounded-2xl border border-border bg-card p-4">
      <p className="mb-2 text-[11px] font-medium text-muted-foreground">
        Concerne les āyāt {surah}:{p.from}
        {p.to > p.from ? `–${p.to}` : ""} · Tafsīr al-Mukhtasar (français)
      </p>
      <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground">
        {p.lessons.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ol>
    </div>
  );
}

type StudyTab = "mukhtasar" | "muyassar" | "saadi" | "ibnkathir" | "qurtubi" | "asbab";
type TafsirTab = Exclude<StudyTab, "asbab">;
type StudyLang = "fr" | "ar";
type MainTab = "comp" | "med" | "act";

const MAIN_TABS: { key: MainTab; label: string; ar: string; icon: typeof BookOpen }[] = [
  { key: "comp", label: "Tafsīr", ar: "تفسير", icon: BookOpen },
  { key: "med", label: "Méditer", ar: "تدبر", icon: Sparkles },
  { key: "act", label: "Agir", ar: "عمل", icon: Compass },
];

const SOURCE_CHIPS: { key: StudyTab; label: string }[] = [
  { key: "mukhtasar", label: "Mukhtasar" },
  { key: "muyassar", label: "Muyassar" },
  { key: "saadi", label: "As-Saʿdī" },
  { key: "ibnkathir", label: "Ibn Kathīr" },
  { key: "qurtubi", label: "Al-Qurṭubī" },
  { key: "asbab", label: "Asbāb an-nuzūl" },
];

const TAFSIR_META: Record<
  TafsirTab,
  { title: string; note: string; hasFrench: boolean }
> = {
  mukhtasar: {
    title: "Al-Mukhtasar fî at-tafsîr al-Qur'ân al-karîm",
    note: "Markaz Tafsîr — un texte par āyah.",
    hasFrench: true,
  },
  muyassar: {
    title: "At-Tafsîr al-Muyassar",
    note: "Complexe du Roi Fahd — explication simplifiée.",
    hasFrench: false,
  },
  qurtubi: { title: "Tafsîr al-Qurtubî", note: "Al-Imâm al-Qurtubî — Al-Jâmiʿ li-ahkâm al-Qur'ân.", hasFrench: false },
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
      className="font-naskh text-right text-[1.25rem] font-medium leading-[2.15] text-foreground"
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
 * indépendant, jamais fusionné. Français : Al-Mukhtasar a une édition française
 * publiée ; pour les autres on affiche l'arabe, avec un petit lien de
 * traduction automatique (non officielle). As-Saʿdī : un bloc par āyah (ou
 * groupe d'āyāt), celui de l'āyah choisie est mis en valeur.
 */
function TafsirReader({
  tab,
  lang,
  surah,
  ayah,
  versesCount,
}: {
  tab: TafsirTab;
  lang: StudyLang;
  surah: number;
  ayah: number;
  versesCount: number;
}) {
  const meta = TAFSIR_META[tab];
  const wantFr = lang !== "ar";
  const wantAr = lang === "ar";
  const arSlug: TafsirSlug =
    tab === "mukhtasar"
      ? "ar-tafsir-al-mukhtasar"
      : tab === "muyassar"
        ? "ar-tafsir-muyassar"
        : tab === "qurtubi"
          ? "ar-tafseer-al-qurtubi"
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

  // Blocs de lecture : As-Saʿdī par āyah (celle choisie mise en valeur), les
  // autres ouvrages par paragraphe.
  const saadiBlocks = tab === "saadi" && arRaw ? splitSaadiBlocks(arRaw) : [];
  const blocks: { key: string; label: string | null; text: string; selected: boolean }[] =
    saadiBlocks.length
      ? saadiBlocks.map((blk) => ({
          key: `${blk.from}-${blk.to}`,
          label:
            blk.from === 0
              ? "Introduction"
              : blk.from === blk.to
                ? `Āyah ${blk.from}`
                : `Āyāt ${blk.from}–${blk.to}`,
          text: blk.text,
          selected: ayah >= blk.from && ayah <= blk.to,
        }))
      : (arRaw ?? "")
          .split(/\n+/)
          .map((t) => t.trim())
          .filter(Boolean)
          .map((t, i) => ({ key: `p${i}`, label: null, text: t, selected: false }));
  const groupNote =
    tab === "ibnkathir" && group && group[0] !== group[1] ? `Āyāt ${group[0]}–${group[1]}` : null;

  // Le bloc de l'āyah choisie est amené en haut de l'écran.
  const selRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    selRef.current?.scrollIntoView({ block: "start" });
  }, [blocks.length]);

  return (
    <div className="space-y-3">
      {groupNote && <p className="text-[11px] font-semibold text-primary">{groupNote}</p>}

      {wantFr &&
        meta.hasFrench &&
        (frPending ? (
          <Loading />
        ) : frText ? (
          <FrenchBody text={frText} />
        ) : (
          <Empty text="Pas de contenu pour cette āyah." />
        ))}

      {needArabic &&
        (arPending ? (
          <Loading />
        ) : blocks.length ? (
          <div className="space-y-2.5">
            {blocks.map((blk) => (
              <div
                key={blk.key}
                ref={blk.selected ? selRef : undefined}
                className={cn(
                  "scroll-mt-2 rounded-2xl border p-3",
                  blk.selected ? "border-primary bg-primary/5" : "border-border bg-card",
                )}
              >
                {blk.label && <p className="mb-1 text-[11px] font-bold text-primary">{blk.label}</p>}
                {noFrench ? (
                  <AutoTranslate
                    cacheKey={`${arSlug}:${surah}:${ayah}:${blk.key}`}
                    text={blk.text.replace(/\[\[[^\]]*\]\]/g, "")}
                  />
                ) : (
                  <ArabicBody text={blk.text} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <Empty text="Pas de contenu pour cette āyah." />
        ))}

      <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
        {noFrench ? "Traduction automatique, non officielle · " : ""}
        {meta.title}
        <SourceInfo
          sourceTitle={meta.title}
          nature={
            meta.hasFrench
              ? "Texte arabe et traduction française publiés, réutilisés tels quels."
              : "Texte arabe source, aucune traduction française publiée identifiée."
          }
        />
      </p>
    </div>
  );
}

/** Découpe un texte en morceaux d'au plus `max` caractères, à la fin d'une phrase si possible. */
function chunkText(text: string, max = 1200): string[] {
  const out: string[] = [];
  let cur = "";
  for (const piece of text.split(/(?<=[.؟!۔:])\s+/)) {
    if (cur && cur.length + piece.length + 1 > max) {
      out.push(cur);
      cur = "";
    }
    cur = cur ? `${cur} ${piece}` : piece;
    while (cur.length > max) {
      out.push(cur.slice(0, max));
      cur = cur.slice(max);
    }
  }
  if (cur.trim()) out.push(cur);
  return out;
}

/**
 * Traduction française automatique. Utilise d'abord le traducteur du navigateur
 * (sur l'appareil) quand il existe ; sinon le service de traduction de Google,
 * appelé directement, sans bouton. Résultat gardé sur l'appareil.
 */
async function translateToFrench(text: string, from: "ar" | "en"): Promise<string> {
  const T = (globalThis as unknown as { Translator?: any }).Translator;
  if (T) {
    try {
      const opts = { sourceLanguage: from, targetLanguage: "fr" };
      if ((await T.availability(opts)) !== "unavailable") {
        const tr = await T.create(opts);
        const parts = text.split(/\n+/).filter((p) => p.trim());
        const out: string[] = [];
        for (const p of parts) out.push(await tr.translate(p));
        return out.join("\n\n");
      }
    } catch {
      /* repli sur le service en ligne */
    }
  }
  const out: string[] = [];
  for (const para of text.split(/\n+/).filter((p) => p.trim())) {
    const pieces: string[] = [];
    for (const c of chunkText(para)) {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=fr&dt=t`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `q=${encodeURIComponent(c)}`,
        },
      );
      if (!res.ok) throw new Error("translate " + res.status);
      const data = (await res.json()) as [string, string][][];
      pieces.push((data[0] ?? []).map((x) => x[0]).join(""));
    }
    out.push(pieces.join(" "));
  }
  return out.join("\n\n");
}

/** Texte traduit automatiquement en français, sans demander ; l'étiquette « non officielle » est portée par la source. */
function AutoTranslate({
  cacheKey,
  text,
  from = "ar",
}: {
  cacheKey: string;
  text: string;
  from?: "ar" | "en";
}) {
  const storeKey = `tr-fr:${cacheKey}`;
  const [fr, setFr] = useState<string | null>(null);
  const [state, setState] = useState<"busy" | "done" | "error">("busy");
  useEffect(() => {
    let cancelled = false;
    let cached: string | null = null;
    try {
      cached = localStorage.getItem(storeKey);
    } catch {
      /* indisponible */
    }
    if (cached) {
      setFr(cached);
      setState("done");
      return;
    }
    setFr(null);
    setState("busy");
    translateToFrench(text, from)
      .then((result) => {
        if (cancelled) return;
        setFr(result);
        setState("done");
        try {
          localStorage.setItem(storeKey, result);
        } catch {
          /* quota */
        }
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [storeKey, text, from]);

  if (state === "done" && fr) {
    return <p className="whitespace-pre-line text-[1.05rem] leading-[1.95] text-foreground">{fr}</p>;
  }
  if (state === "error") {
    const google = `https://translate.google.com/?sl=${from}&tl=fr&text=${encodeURIComponent(text.slice(0, 1500))}&op=translate`;
    return (
      <p className="text-xs text-muted-foreground">
        Traduction indisponible.{" "}
        <a href={google} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">
          Ouvrir dans Google Traduction ↗
        </a>
      </p>
    );
  }
  return <p className="text-xs text-muted-foreground">Traduction…</p>;
}

/** Contexte / Leçons / Méditer / Dans ma vie — portée, provenance via ⓘ. */
export function ContentList({ items, lang }: { items: EtudeContent[]; lang?: "fr" | "ar" }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ContentCard key={item.id} item={item} lang={lang} />
      ))}
    </div>
  );
}

function ContentCard({ item, lang }: { item: EtudeContent; lang?: "fr" | "ar" }) {
  const [showArabic, setShowArabic] = useState(lang === "ar");
  useEffect(() => setShowArabic(lang === "ar"), [lang]);
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
              className="mt-1.5 text-right font-naskh font-medium leading-[2.05] text-foreground"
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
