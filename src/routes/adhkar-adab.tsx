import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft, BedDouble, Brush, Footprints, Handshake, Star, BookOpen, Droplets, HandHeart, Heart, HeartPulse, Home, Landmark, Luggage, MessageCircle,
  Moon, Plane, Repeat2, Search, Sparkles, Sunrise, UtensilsCrossed, Wind, Users, type LucideIcon,
} from "lucide-react";
import { HUB_COLORS, HubCardBody, HubGrid, hubCardClass } from "@/components/HubCard";
import type { Dhikr } from "@/data/adhkar";
import { DhikrViewer } from "@/components/DhikrViewer";
import { LIVRE_SOURCE_NOTE, LIVRE_TITLE } from "@/data/adhkar-livre";
import { LIVRE_CHAPTERS, LIVRE_THEMES } from "@/data/adhkar-livre-2";
import { livreAll } from "@/data/livre-book";

export const Route = createFileRoute("/adhkar-adab")({
  head: () => ({
    meta: [
      { title: "Adhkār et ādāb — invocations et rappels du quotidien" },
      {
        name: "description",
        content:
          "Les adhkār du livre « Al-Adhkâr wa-l-Âdâb », classés par thème : arabe, phonétique, français et source.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { c?: string; t?: string; i?: number } => ({
    c: typeof search["c"] === "string" ? (search["c"] as string) : undefined,
    t: typeof search["t"] === "string" ? (search["t"] as string) : undefined,
    i: search["i"] !== undefined ? Number(search["i"]) : undefined,
  }),
  component: AdhkarAdabPage,
});

/** Chapitre du livre = numéro dans l'id (« livre-06b » → « 06 »). */
const chapterOf = (d: Dhikr) => d.id.slice(6, 8);

const THEME_ICONS: Record<string, LucideIcon> = {
  merites: Sparkles,
  purification: Droplets,
  priere: Landmark,
  maladie: HeartPulse,
  janaza: Heart,
  epreuve: HandHeart,
  voyage: Plane,
  hajj: Luggage,
  maison: Home,
  repas: UtensilsCrossed,
  mariage: Users,
  sommeil: BedDouble,
  reves: Moon,
  matinsoir: Sunrise,
  haqqallah: Star,
  ibadat: Footprints,
  haqqkhalq: Handshake,
  nadafa: Brush,
  dhikr: Repeat2,
  generaux: BookOpen,
  relations: MessageCircle,
  nature: Wind,
  assemblee: Users,
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

function AdhkarAdabPage() {
  const { c, t, i } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [showNote, setShowNote] = useState(false);

  const theme = t && t !== "all" ? t : null;

  const chapters = useMemo(() => {
    const by = new Map<string, Dhikr[]>();
    for (const d of livreAll) {
      if (theme && d.theme !== theme) continue;
      const k = chapterOf(d);
      by.set(k, [...(by.get(k) ?? []), d]);
    }
    return [...by.entries()];
  }, [theme]);

  const chapterList = c ? livreAll.filter((d) => chapterOf(d) === c) : [];
  if (chapterList.length > 0) {
    return (
      <DhikrViewer
        list={chapterList}
        accent="gold"
        label={LIVRE_CHAPTERS[c!]?.title ?? LIVRE_TITLE}
        backTo="/adhkar-adab"
        initialIndex={i !== undefined && Number.isFinite(i) ? i : 0}
        persist={false}
      />
    );
  }

  const q = normalize(query.trim());
  const shown = chapters.filter(
    ([k, list]) =>
      !q ||
      normalize(
        `${LIVRE_CHAPTERS[k]?.title ?? ""} ${list.map((d) => `${d.title} ${d.translation} ${d.phonetic}`).join(" ")}`,
      ).includes(q),
  );

  return (
    <div className="mx-auto min-h-[100dvh] max-w-2xl bg-background px-4 pb-10 pt-4">
      <header className="mb-4 flex items-center gap-3">
        <Link
          to={t !== undefined ? "/adhkar-adab" : "/"}
          aria-label={t !== undefined ? "Thèmes" : "Accueil"}
          className="grid size-10 shrink-0 place-items-center rounded-full border border-border"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="font-display text-xl font-semibold">
            {LIVRE_TITLE}
            <button
              type="button"
              aria-label="Source et remarque"
              onClick={() => setShowNote((v) => !v)}
              className="ml-1 align-super text-xs text-muted-foreground"
            >
              *
            </button>
          </h1>
          <p lang="ar" dir="rtl" className="font-arabic text-sm text-muted-foreground">
            الأذكار والآداب
          </p>
        </div>
      </header>

      {showNote && <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{LIVRE_SOURCE_NOTE}</p>}

      <label className="relative mb-3 block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher (prière, malade, voyage…)"
          className="h-11 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </label>

      {t === undefined && !q && (
        <HubGrid>
          {LIVRE_THEMES.filter((th) => livreAll.some((d) => d.theme === th.theme)).map((th, n) => {
            const Icon = THEME_ICONS[th.theme] ?? BookOpen;
            const count = new Set(livreAll.filter((d) => d.theme === th.theme).map(chapterOf)).size;
            return (
              <Link key={th.theme} to="/adhkar-adab" search={{ t: th.theme }} className={hubCardClass}>
                <HubCardBody label={th.label} arabic={th.ar} color={HUB_COLORS[n % HUB_COLORS.length]} icon={<Icon />} note={count} />
              </Link>
            );
          })}
        </HubGrid>
      )}

      {(t !== undefined || q) && (
      <ul className="space-y-2">
        {shown.map(([k, list]) => (
          <li key={k}>
            <Link
              to="/adhkar-adab"
              search={{ c: k }}
              className="surface-card flex items-center justify-between gap-3 rounded-2xl px-4 py-3 transition hover:border-primary/40"
            >
              <span className="min-w-0">
                <span className="block font-medium text-foreground">{LIVRE_CHAPTERS[k]?.title ?? list[0].title}</span>
                {list.length > 1 && <span className="text-xs text-muted-foreground">{list.length} textes</span>}
              </span>
              <span lang="ar" dir="rtl" className="shrink-0 font-arabic text-2xl leading-[1.9] text-primary">
                {LIVRE_CHAPTERS[k]?.ar ?? list[0].titleAr}
              </span>
            </Link>
          </li>
        ))}
        {shown.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            Aucun résultat.
          </li>
        )}
      </ul>
      )}
    </div>
  );
}
