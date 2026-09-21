import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Home,
  Languages,
  Lightbulb,
  Loader2,
  Pause,
  Play,
  Repeat2,
  Search,
  Share2,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { baqaraJuz1 } from "@/data/tadabbur";
import { AyahText, Basmala, splitBasmala } from "@/components/AyahText";
import {
  fetchSurahList,
  fetchSurahText,
  fetchTafsir,
  type TafsirSlug,
} from "@/lib/quran";
import {
  diffWords,
  findMutashabihat,
  parseWaqafat,
  summarize,
} from "@/lib/waqafat";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tadabbur")({
  head: () => ({
    meta: [
      { title: "Étude du Coran — Ayah, Tadabbur, Tafsir & Moutachabihât" },
      {
        name: "description",
        content:
          "Lis, comprends et médite chaque verset du Coran : mode Lecture épuré, résumé instantané, tadabbur en cartes, tafsir résumé, analyse des mots et versets similaires.",
      },
      { property: "og:title", content: "Étude du Coran — Ayah & Tadabbur" },
      {
        property: "og:description",
        content:
          "Une expérience apaisante pour lire, comprendre, méditer et appliquer chaque verset du Coran.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AyahStudyPage,
});

type Mode = "lecture" | "etude";
type Tab = "tadabbur" | "tafsir" | "mots" | "similaires" | "favoris";

const TABS: { key: Tab; label: string; icon: typeof Lightbulb; tone: string }[] =
  [
    { key: "tadabbur", label: "Tadabbur", icon: Lightbulb, tone: "text-gold" },
    { key: "tafsir", label: "Tafsir", icon: BookOpen, tone: "text-primary" },
    { key: "mots", label: "Linguistique", icon: Languages, tone: "text-sky-400" },
    {
      key: "similaires",
      label: "Moutachabihât",
      icon: Repeat2,
      tone: "text-violet-400",
    },
    { key: "favoris", label: "Favoris", icon: Star, tone: "text-amber-400" },
  ];

const pad = (n: number, l: number) => String(n).padStart(l, "0");
const ls = {
  get<T>(k: string, fb: T): T {
    try {
      const v = localStorage.getItem(k);
      return v ? (JSON.parse(v) as T) : fb;
    } catch {
      return fb;
    }
  },
  set(k: string, v: unknown) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      /* quota */
    }
  },
};

function AyahStudyPage() {
  const [surah, setSurah] = useState(2);
  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState<Mode>("lecture");
  const [tab, setTab] = useState<Tab>("tadabbur");
  const [tajwid, setTajwid] = useState(true);
  const [panel, setPanel] = useState<null | "goto">(null);
  const [favs, setFavs] = useState<string[]>([]);
  const [done, setDone] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFavs(ls.get<string[]>("q-favs", []));
    setDone(ls.get<string[]>("q-actions", []));
    const m = localStorage.getItem("q-mode");
    if (m === "etude" || m === "lecture") setMode(m);
    const pos = ls.get<{ s: number; a: number } | null>("q-pos", null);
    if (pos && pos.s >= 1 && pos.s <= 114) {
      setSurah(pos.s);
      setIdx(Math.max(0, pos.a - 1));
    }
  }, []);

  const { data: surahs } = useQuery({
    queryKey: ["surah-list"],
    queryFn: fetchSurahList,
    staleTime: Infinity,
  });
  const { data: ayahs, isPending: loadingSurah } = useQuery({
    queryKey: ["surah", surah],
    queryFn: () => fetchSurahText(surah),
    staleTime: Infinity,
  });

  const total = ayahs?.length ?? 0;
  const ayah = ayahs?.[Math.min(idx, Math.max(total - 1, 0))];
  const meta = surahs?.find((s) => s.number === surah);
  const ref = ayah ? `${surah}:${ayah.n}` : "";

  useEffect(() => {
    if (ayah) ls.set("q-pos", { s: surah, a: ayah.n });
  }, [surah, ayah]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [idx, surah, tab, mode]);

  const setModeP = (m: Mode) => {
    setMode(m);
    localStorage.setItem("q-mode", m);
  };
  const go = (d: number) =>
    setIdx((i) => Math.min(Math.max(total - 1, 0), Math.max(0, i + d)));
  const jump = (key: string) => {
    const [s, a] = key.split(":").map(Number);
    setSurah(s);
    setIdx(Math.max(0, (a || 1) - 1));
    setPanel(null);
  };
  const toggleFav = () => {
    if (!ref) return;
    setFavs((f) => {
      const next = f.includes(ref) ? f.filter((x) => x !== ref) : [ref, ...f];
      ls.set("q-favs", next);
      return next;
    });
  };
  const toggleDone = (k: string) =>
    setDone((d) => {
      const next = d.includes(k) ? d.filter((x) => x !== k) : [k, ...d];
      ls.set("q-actions", next);
      return next;
    });
  const share = async () => {
    if (!ayah) return;
    const txt = `${meta?.frenchName ?? ""} ${ref}\n\n${ayah.arabic}\n\n${ayah.french}`;
    try {
      if (navigator.share) await navigator.share({ text: txt });
      else await navigator.clipboard.writeText(txt);
    } catch {
      /* annulé */
    }
  };

  const local = useMemo(
    () => (surah === 2 && ayah ? baqaraJuz1.find((a) => a.n === ayah.n) : undefined),
    [surah, ayah],
  );

  const { data: mokhtasar } = useQuery({
    queryKey: ["tafsir", "french-mokhtasar", surah, ayah?.n],
    enabled: !!ayah,
    queryFn: () => fetchTafsir("french-mokhtasar", surah, ayah!.n),
    staleTime: Infinity,
  });

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      {/* Barre unique */}
      <header className="shrink-0 border-b border-border/40 bg-card/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-2xl grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-2 px-3 pt-2.5">
          <Link
            to="/"
            aria-label="Accueil"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Home className="size-[18px]" />
          </Link>
          <select
            aria-label="Choisir une sourate"
            value={surah}
            onChange={(e) => {
              setSurah(Number(e.target.value));
              setIdx(0);
            }}
            className="h-9 w-full min-w-0 truncate rounded-full border border-border/60 bg-background px-3 text-sm font-semibold text-foreground"
          >
            {(surahs ?? []).map((s) => (
              <option key={s.number} value={s.number}>
                {s.number}. {s.frenchName} — {s.name}
              </option>
            ))}
            {!surahs && <option value={surah}>سورة البقرة</option>}
          </select>
          <select
            aria-label="Choisir un verset"
            value={Math.min(idx, Math.max(total - 1, 0))}
            onChange={(e) => setIdx(Number(e.target.value))}
            className="h-9 w-16 shrink-0 rounded-full border border-border/60 bg-background px-2 text-center text-sm font-bold text-primary"
          >
            {(ayahs ?? []).map((a, i) => (
              <option key={a.n} value={i}>
                {a.n}
              </option>
            ))}
          </select>
          <button
            onClick={() => setPanel("goto")}
            aria-label="Recherche"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Search className="size-[18px]" />
          </button>
        </div>

        <div className="mx-auto flex max-w-2xl items-center gap-2 px-3 pb-2.5 pt-2">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <Chip>Juz' {ayah?.juz ?? "–"}</Chip>
            <Chip>Hizb {ayah ? Math.ceil(ayah.hizbQuarter / 4) : "–"}</Chip>
            <Chip>Page {ayah?.page ?? "–"}</Chip>
          </div>
          <div className="flex shrink-0 gap-1 rounded-full bg-muted/70 p-1">
            <ModeBtn
              active={mode === "lecture"}
              onClick={() => setModeP("lecture")}
              icon={BookOpen}
              label="Lecture"
            />
            <ModeBtn
              active={mode === "etude"}
              onClick={() => setModeP("etude")}
              icon={GraduationCap}
              label="Étude"
            />
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-4 px-4 pb-8 pt-6">
          {/* Mushaf */}
          <article className="animate-fade-in rounded-[28px] border border-border/40 bg-card px-5 py-7 shadow-[0_1px_2px_rgba(0,0,0,.04),0_24px_60px_-40px_rgba(0,0,0,.6)]">
            <div className="flex flex-col items-center gap-1">
              <h1 lang="ar" className="font-arabic text-xl text-gold">
                {meta?.name ?? "—"}
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                {meta?.frenchName} · verset {ayah?.n ?? "–"}
                {total ? ` / ${total}` : ""}
              </p>
            </div>

            <div className="my-6 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--gold)_45%,transparent),transparent)]" />

            {loadingSurah || !ayah ? (
              <p className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Chargement…
              </p>
            ) : (
              <>
                <MushafText text={ayah.arabic} n={ayah.n} tajwid={tajwid} />

                <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
                  <AyahAudio surah={surah} ayah={ayah.n} />
                  <IconBtn
                    label="Favori"
                    active={favs.includes(ref)}
                    onClick={toggleFav}
                  >
                    <Star
                      className={cn("size-4", favs.includes(ref) && "fill-current")}
                    />
                  </IconBtn>
                  <IconBtn label="Partager" onClick={share}>
                    <Share2 className="size-4" />
                  </IconBtn>
                  <IconBtn
                    label="Repères de tajwid"
                    active={tajwid}
                    onClick={() => setTajwid((t) => !t)}
                  >
                    <Sparkles className="size-4" />
                  </IconBtn>
                </div>

                {ayah.french && (
                  <p className="mt-6 border-t border-border/40 pt-5 text-center text-[0.98rem] leading-[1.9] text-foreground/90">
                    {ayah.french}
                  </p>
                )}
              </>
            )}
          </article>

          {mode === "lecture" ? (
            <>
              {mokhtasar && (
                <QuickCard text={summarize(mokhtasar, 2)} onStudy={() => setModeP("etude")} />
              )}
              <p className="px-1 text-center text-[11px] leading-relaxed text-muted-foreground">
                Mode Lecture : Coran, traduction et audio uniquement. Passe en
                mode Étude pour le tadabbur, les tafsirs et les moutachabihât.
              </p>
            </>
          ) : (
            <>
              {mokhtasar && <QuickCard text={summarize(mokhtasar, 3)} />}

              <nav className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    aria-pressed={tab === t.key}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition",
                      tab === t.key
                        ? "border-border bg-card text-foreground shadow-sm"
                        : "border-transparent bg-muted/60 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <t.icon className={cn("size-3.5", tab === t.key && t.tone)} />
                    {t.label}
                  </button>
                ))}
              </nav>

              {ayah && tab === "tadabbur" && (
                <TadabburTab
                  key={`t-${surah}-${ayah.n}`}
                  surah={surah}
                  ayah={ayah.n}
                  localFr={local}
                  done={done}
                  onToggleDone={toggleDone}
                />
              )}
              {ayah && tab === "tafsir" && (
                <TafsirTab
                  key={`f-${surah}-${ayah.n}`}
                  surah={surah}
                  ayah={ayah.n}
                  french={mokhtasar ?? ""}
                />
              )}
              {ayah && tab === "mots" && (
                <WordsTab
                  key={`w-${surah}-${ayah.n}`}
                  surah={surah}
                  ayah={ayah.n}
                  words={local?.words ?? []}
                />
              )}
              {ayah && tab === "similaires" && (
                <SimilarTab
                  key={`s-${surah}-${ayah.n}`}
                  current={ayah}
                  all={ayahs ?? []}
                  onJump={(n) => setIdx(n - 1)}
                />
              )}
              {tab === "favoris" && (
                <RefList
                  items={favs}
                  surahs={surahs ?? []}
                  onJump={jump}
                  empty="Aucun verset en favori pour l'instant."
                />
              )}

              <p className="px-1 pt-1 text-[11px] leading-relaxed text-muted-foreground">
                Sources : Al-Moukhtasar fî at-tafsîr (français), Tafsîr as-Sa'dî,
                Tafsîr Ibn Kathîr et « القرآن تدبر وعمل ». Affichage instantané,
                sans génération automatique.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Navigation flottante */}
      <nav className="shrink-0 border-t border-border/40 bg-card/90 px-3 py-2 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <button
            onClick={() => go(-1)}
            disabled={idx === 0}
            aria-label="Verset précédent"
            className="grid h-12 flex-1 place-items-center rounded-2xl bg-muted/70 text-muted-foreground transition hover:text-foreground disabled:opacity-30"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => setPanel("goto")}
            className="h-12 shrink-0 rounded-2xl bg-primary/12 px-6 text-sm font-bold text-primary"
          >
            {surah}:{ayah?.n ?? "–"}
          </button>
          <button
            onClick={() => go(1)}
            disabled={total === 0 || idx >= total - 1}
            aria-label="Verset suivant"
            className="grid h-12 flex-1 place-items-center rounded-2xl bg-muted/70 text-muted-foreground transition hover:text-foreground disabled:opacity-30"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </nav>

      {panel === "goto" && (
        <Overlay title="Aller à un verset" onClose={() => setPanel(null)}>
          <GoTo surahs={surahs ?? []} onJump={jump} />
        </Overlay>
      )}
    </div>
  );
}

/* ---------- Briques UI ---------- */

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 rounded-full bg-muted/70 px-2.5 py-1">{children}</span>
  );
}

function ModeBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof BookOpen;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}

function IconBtn({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "grid size-11 place-items-center rounded-full border border-border/60 transition",
        active
          ? "border-gold/50 bg-gold/15 text-gold"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

const MADD = /\u0653/;
const SHADDA = "\u0651";

/** Texte du mushaf avec repères de tajwid simples (madd, ghunnah). */
function MushafText({
  text,
  n,
  tajwid,
}: {
  text: string;
  n: number;
  tajwid: boolean;
}) {
  const { basmala, rest } = splitBasmala(text);
  const body = rest || basmala || "";

  const marker = (
    <span className="mx-1.5 inline-grid size-8 place-items-center rounded-full border border-gold/50 align-middle text-sm font-semibold text-gold">
      {n}
    </span>
  );

  if (!tajwid)
    return (
      <>
        {basmala && rest && <Basmala text={basmala} />}
        <AyahText
          text={body}
          align="center"
          className="text-[1.85rem] leading-[2.5] sm:text-[2.25rem]"
        >
          {marker}
        </AyahText>
      </>
    );

  const words = body.split(/\s+/).filter(Boolean);
  return (
    <>
      {basmala && rest && <Basmala text={basmala} />}
      <p
        lang="ar"
        dir="rtl"
        className="font-arabic text-center text-[1.85rem] font-bold leading-[2.5] text-foreground sm:text-[2.25rem]"
      >
        {words.map((w, i) => {
          const isMadd = MADD.test(w);
          const isGhunnah = /[نم]\u0651/.test(w);
          return (
            <span
              key={i}
              className={cn(
                isMadd
                  ? "text-primary"
                  : isGhunnah
                    ? "text-gold"
                    : "text-foreground",
              )}
            >
              {w}{" "}
            </span>
          );
        })}
        {marker}
      </p>
    </>
  );
}

function AyahAudio({ surah, ayah }: { surah: number; ayah: number }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLAudioElement | null>(null);
  const src = `https://everyayah.com/data/Alafasy_128kbps/${pad(surah, 3)}${pad(ayah, 3)}.mp3`;

  useEffect(() => {
    ref.current?.pause();
    setPlaying(false);
  }, [src]);

  return (
    <>
      <audio ref={ref} src={src} onEnded={() => setPlaying(false)} />
      <button
        onClick={() => {
          const a = ref.current;
          if (!a) return;
          if (playing) {
            a.pause();
            setPlaying(false);
          } else {
            void a.play();
            setPlaying(true);
          }
        }}
        className="flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        {playing ? "Pause" : "Écouter"}
      </button>
    </>
  );
}

function QuickCard({ text, onStudy }: { text: string; onStudy?: () => void }) {
  if (!text) return null;
  return (
    <section className="animate-fade-in rounded-3xl border border-primary/25 bg-primary/[0.06] px-5 py-4">
      <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
        <Sparkles className="size-3.5" /> Comprendre rapidement
      </h2>
      <p className="mt-2.5 text-[0.95rem] leading-[1.8] text-foreground/90">{text}</p>
      {onStudy && (
        <button
          onClick={onStudy}
          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary"
        >
          <GraduationCap className="size-3.5" /> Approfondir en mode Étude
        </button>
      )}
    </section>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "animate-fade-in rounded-3xl border border-border/40 bg-card px-5 py-4",
        className,
      )}
    >
      {children}
    </section>
  );
}

function Accordion({
  title,
  subtitle,
  defaultOpen,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <section className="overflow-hidden rounded-3xl border border-border/40 bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-foreground">
            {title}
          </span>
          {subtitle && (
            <span
              lang="ar"
              className="block truncate font-arabic text-xs text-muted-foreground"
            >
              {subtitle}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="animate-fade-in border-t border-border/40 px-5 py-4">
          {children}
        </div>
      )}
    </section>
  );
}

/* ---------- Onglets ---------- */

function TadabburTab({
  surah,
  ayah,
  localFr,
  done,
  onToggleDone,
}: {
  surah: number;
  ayah: number;
  localFr?: { tadabburFr: string; amalFr: string; tawjihFr: string };
  done: string[];
  onToggleDone: (k: string) => void;
}) {
  const { data, isPending } = useQuery({
    queryKey: ["tafsir", "tadabbur-wa-amal", surah, ayah],
    queryFn: () => fetchTafsir("tadabbur-wa-amal", surah, ayah),
    staleTime: Infinity,
  });
  const parsed = useMemo(() => parseWaqafat(data ?? ""), [data]);

  if (isPending) return <Loading />;

  const actions = [
    ...(localFr ? [localFr.amalFr] : []),
    ...parsed.amal,
  ].filter(Boolean);

  return (
    <div className="space-y-3">
      {localFr?.tadabburFr && (
        <Card className="border-gold/25 bg-gold/[0.05]">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gold">
            <Lightbulb className="size-3.5" /> Réflexion
          </h3>
          <p className="mt-2 text-[0.95rem] leading-[1.85] text-foreground/90">
            {localFr.tadabburFr}
          </p>
          {localFr.tawjihFr && (
            <p className="mt-3 border-t border-gold/20 pt-3 text-sm leading-relaxed text-muted-foreground">
              🧠 {localFr.tawjihFr}
            </p>
          )}
        </Card>
      )}

      {parsed.waqafat.map((w, i) => (
        <Card key={i}>
          <div className="mb-2 flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-full bg-gold/15 text-[11px] font-bold text-gold">
              {i + 1}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Halte méditative
            </span>
          </div>
          {w.verse && (
            <p
              lang="ar"
              dir="rtl"
              className="font-arabic text-right text-[1.15rem] font-bold leading-[2] text-gold"
            >
              ﴿{w.verse}﴾
            </p>
          )}
          <Ar className="mt-2">{w.body}</Ar>
          {w.source && (
            <p className="mt-2 text-[11px] font-medium text-muted-foreground">
              📚 {w.source}
            </p>
          )}
          {w.question && (
            <Question text={w.question} />
          )}
        </Card>
      ))}

      {parsed.tawjihat.length > 0 && (
        <Accordion title="Orientations" subtitle="التوجيهات">
          <div className="space-y-3">
            {parsed.tawjihat.map((t, i) => (
              <Ar key={i}>{t}</Ar>
            ))}
          </div>
        </Accordion>
      )}

      {actions.length > 0 && (
        <Card>
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <Check className="size-3.5" /> Aujourd'hui je mets en pratique
          </h3>
          <ul className="mt-3 space-y-2">
            {actions.map((a, i) => {
              const key = `${surah}:${ayah}:${i}`;
              const isDone = done.includes(key);
              return (
                <li key={key}>
                  <button
                    onClick={() => onToggleDone(key)}
                    className="flex w-full items-start gap-3 rounded-2xl bg-muted/50 px-3 py-2.5 text-left transition hover:bg-muted"
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition",
                        isDone
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border",
                      )}
                    >
                      {isDone && <Check className="size-3.5" />}
                    </span>
                    <span
                      dir="auto"
                      className={cn(
                        "text-sm leading-relaxed",
                        isDone
                          ? "text-muted-foreground line-through"
                          : "text-foreground/90",
                      )}
                    >
                      {a}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {done.filter((d) => d.startsWith(`${surah}:${ayah}:`)).length} /{" "}
            {actions.length} action(s) réalisée(s)
          </p>
        </Card>
      )}

      {!localFr && parsed.waqafat.length === 0 && (
        <Empty text="Pas encore de tadabbur pour ce verset. Consulte l'onglet Tafsir." />
      )}
    </div>
  );
}

function Question({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 rounded-2xl bg-muted/50 px-3 py-2.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="text-xs font-bold text-foreground">
          ❓ Question de réflexion
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition",
            open && "rotate-180",
          )}
        />
      </button>
      {open && <Ar className="mt-2">{text}</Ar>}
    </div>
  );
}

function TafsirTab({
  surah,
  ayah,
  french,
}: {
  surah: number;
  ayah: number;
  french: string;
}) {
  return (
    <div className="space-y-3">
      {french ? (
        <Card className="border-primary/25">
          <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Résumé du tafsir — Al-Moukhtasar (français)
          </h3>
          <div className="mt-2 space-y-2">
            {french.split(/\n+/).map((p, i) => (
              <p key={i} className="text-[0.95rem] leading-[1.85] text-foreground/90">
                {p}
              </p>
            ))}
          </div>
        </Card>
      ) : (
        <Empty text="Résumé français indisponible pour ce verset." />
      )}

      <Accordion title="Tafsîr as-Sa'dî" subtitle="تفسير السعدي">
        <ArTafsir slug="ar-tafsir-as-saadi" surah={surah} ayah={ayah} />
      </Accordion>
      <Accordion title="Tafsîr Ibn Kathîr" subtitle="تفسير ابن كثير">
        <ArTafsir slug="ar-tafsir-ibn-kathir" surah={surah} ayah={ayah} />
      </Accordion>
    </div>
  );
}

function ArTafsir({
  slug,
  surah,
  ayah,
}: {
  slug: TafsirSlug;
  surah: number;
  ayah: number;
}) {
  const { data, isPending } = useQuery({
    queryKey: ["tafsir", slug, surah, ayah],
    queryFn: () => fetchTafsir(slug, surah, ayah),
    staleTime: Infinity,
  });
  if (isPending) return <Loading />;
  if (!data) return <Empty text="Pas de contenu pour ce verset." />;
  return <Ar>{data}</Ar>;
}

function WordsTab({
  surah,
  ayah,
  words,
}: {
  surah: number;
  ayah: number;
  words: { word: string; count: number; refs: string[] }[];
}) {
  const [q, setQ] = useState("");
  const { data } = useQuery({
    queryKey: ["tafsir", "tadabbur-wa-amal", surah, ayah],
    queryFn: () => fetchTafsir("tadabbur-wa-amal", surah, ayah),
    staleTime: Infinity,
  });
  const meanings = useMemo(() => parseWaqafat(data ?? "").words, [data]);
  const filtered = words.filter((w) => !q || w.word.includes(q));

  return (
    <div className="space-y-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher un mot…"
        className="h-11 w-full rounded-2xl border border-border/60 bg-card px-4 text-sm text-foreground"
      />
      {meanings.map((m) => (
        <Card key={m.word}>
          <p lang="ar" dir="rtl" className="font-arabic text-xl font-bold text-gold">
            {m.word}
          </p>
          <p lang="ar" dir="rtl" className="mt-1 font-arabic text-base leading-[2] text-foreground/90">
            {m.meaning}
          </p>
        </Card>
      ))}
      {filtered.map((w) => (
        <Card key={w.word}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span lang="ar" className="font-arabic text-xl font-bold text-foreground">
              {w.word}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-primary">
              <Repeat2 className="size-3.5" />
              {w.count} occurrence{w.count > 1 ? "s" : ""} dans le Coran
            </span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Exemples : {w.refs.join(" · ")}
          </p>
        </Card>
      ))}
      {meanings.length === 0 && filtered.length === 0 && (
        <Empty text="Aucun mot analysé pour ce verset." />
      )}
    </div>
  );
}

function SimilarTab({
  current,
  all,
  onJump,
}: {
  current: { n: number; arabic: string };
  all: { n: number; arabic: string }[];
  onJump: (n: number) => void;
}) {
  const similars = useMemo(
    () => findMutashabihat(current, all),
    [current, all],
  );
  if (similars.length === 0)
    return (
      <Empty text="Aucun verset très similaire détecté dans cette sourate. Les mots en commun apparaissent dès qu'au moins quatre mots consécutifs se répètent." />
    );

  return (
    <div className="space-y-3">
      <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
        Les mots <span className="font-semibold text-primary">communs</span> sont
        en vert, les mots <span className="font-semibold text-gold">différents</span>{" "}
        en or : c'est là que se joue la confusion pendant le hifdh.
      </p>
      {similars.map((s) => (
        <Card key={s.n}>
          <button
            onClick={() => onJump(s.n)}
            className="mb-2 flex items-center gap-2 text-xs font-bold text-primary"
          >
            Verset {s.n} <ChevronRight className="size-3.5" />
          </button>
          <p
            lang="ar"
            dir="rtl"
            className="font-arabic text-right text-[1.3rem] font-bold leading-[2.2]"
          >
            {diffWords(s.arabic, current.arabic).map((w, i) => (
              <span key={i} className={w.same ? "text-primary" : "text-gold"}>
                {w.word}{" "}
              </span>
            ))}
          </p>
        </Card>
      ))}
    </div>
  );
}

/* ---------- Utilitaires d'affichage ---------- */

function Loading() {
  return (
    <p className="flex items-center gap-2 px-1 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" /> Chargement…
    </p>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-3xl border border-dashed border-border/60 px-5 py-6 text-center text-sm leading-relaxed text-muted-foreground">
      {text}
    </p>
  );
}

function Ar({ children, className }: { children?: string; className?: string }) {
  if (!children) return null;
  return (
    <div lang="ar" dir="rtl" className={cn("space-y-2", className)}>
      {children.split(/\n+/).map((p, i) => (
        <p
          key={i}
          className="font-arabic text-right text-[1.05rem] font-medium leading-[2.1] text-foreground"
        >
          {p}
        </p>
      ))}
    </div>
  );
}

function Overlay({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="animate-fade-in max-h-[80dvh] w-full overflow-y-auto rounded-t-3xl bg-card p-5 sm:max-w-md sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function GoTo({
  surahs,
  onJump,
}: {
  surahs: { number: number; name: string; frenchName: string }[];
  onJump: (key: string) => void;
}) {
  const [q, setQ] = useState("");
  const direct = q.match(/^\s*(\d{1,3})\s*[:. ]\s*(\d{1,3})\s*$/);
  const results = surahs
    .filter(
      (s) =>
        s.frenchName.toLowerCase().includes(q.toLowerCase()) ||
        s.name.includes(q) ||
        String(s.number) === q.trim(),
    )
    .slice(0, 12);

  return (
    <div className="space-y-3">
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Sourate ou 2:255"
        className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground"
      />
      {direct && (
        <button
          onClick={() => onJump(`${Number(direct[1])}:${Number(direct[2])}`)}
          className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
        >
          Aller au verset {direct[1]}:{direct[2]}
        </button>
      )}
      <ul className="space-y-1">
        {results.map((s) => (
          <li key={s.number}>
            <button
              onClick={() => onJump(`${s.number}:1`)}
              className="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left transition hover:bg-muted"
            >
              <span className="text-sm font-semibold text-foreground">
                {s.number}. {s.frenchName}
              </span>
              <span lang="ar" className="font-arabic text-base text-gold">
                {s.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RefList({
  items,
  surahs,
  onJump,
  empty,
}: {
  items: string[];
  surahs: { number: number; frenchName: string }[];
  onJump: (key: string) => void;
  empty: string;
}) {
  if (items.length === 0) return <Empty text={empty} />;
  return (
    <ul className="space-y-1.5">
      {items.map((k) => {
        const [s] = k.split(":");
        const name = surahs.find((x) => x.number === Number(s))?.frenchName ?? s;
        return (
          <li key={k}>
            <button
              onClick={() => onJump(k)}
              className="flex w-full items-center justify-between rounded-2xl border border-border/40 bg-card px-4 py-3 text-left transition hover:bg-muted"
            >
              <span className="text-sm font-semibold text-foreground">{name}</span>
              <span className="text-xs font-bold text-primary">{k}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
