import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ChevronDown, ChevronLeft, Compass, Sparkles, Sun } from "lucide-react";
import { fetchChapters, fetchVerseDetail } from "@/lib/mushaf";
import { fetchTafsir, type TafsirSlug } from "@/lib/quran";
import { fetchHamidullahAyah } from "@/lib/hamidullah";
import { useActionsProgress } from "@/lib/storage";
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

  const [openSection, setOpenSection] = useState<Section | null>(null);

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

  // Contenus locaux (synchrones) — vides tant qu'aucune donnée n'est vérifiée
  // pour cette ayah. Aucune rubrique n'est affichée si elle est vide : une
  // rubrique absente est toujours préférable à un contenu religieux
  // incertain ou mal rattaché.
  const contexteItems = getEtudeContent(verseKey, "asbab_nuzul", verse?.page);
  const lessonItems = getEtudeContent(verseKey, "lesson", verse?.page);
  const meditateItems = getEtudeContent(verseKey, "tadabbur", verse?.page);
  const agirItems = getEtudeContent(verseKey, "amal", verse?.page);
  const todayItems = getEtudeContent(verseKey, "today", verse?.page);

  const sections: Section[] = [
    ...(contexteItems.length ? (["asbab_nuzul"] as const) : []),
    "tafsir",
    ...(lessonItems.length ? (["lesson"] as const) : []),
    ...(meditateItems.length ? (["tadabbur"] as const) : []),
    ...(agirItems.length ? (["amal"] as const) : []),
    ...(todayItems.length ? (["today"] as const) : []),
  ];

  const backToMushaf = () => {
    navigate({
      to: "/quran/page/$page",
      params: { page: search.fromPage ?? String(verse?.page ?? 1) },
      search: { r: search.r, sel: search.sel ?? verseKey },
    });
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="shrink-0 border-b border-border/40 bg-card/80 px-3 py-2.5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <button
            onClick={backToMushaf}
            aria-label="Retour au Mushaf"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="size-5" />
          </button>
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
            {chapterMeta?.nameFrench ?? `Sourate ${surah}`} — {verseKey}
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-5">
          {/* Ayah + traduction Hamidullah */}
          <div className="rounded-[28px] border border-border/40 bg-card px-5 py-7 text-center">
            {versePending ? (
              <Loading />
            ) : (
              <p
                lang="ar"
                dir="rtl"
                className="font-arabic text-2xl font-bold leading-[2.2] text-foreground"
              >
                {verse?.arabic}
              </p>
            )}
            <div className="my-5 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--gold)_45%,transparent),transparent)]" />
            {hamidullahPending ? (
              <Loading />
            ) : hamidullah ? (
              <>
                <p className="text-[0.95rem] leading-[1.9] text-foreground/90">
                  {hamidullah.translation}
                </p>
                {hamidullah.footnotes && (
                  <p className="mt-3 text-left text-xs leading-relaxed text-muted-foreground">
                    {hamidullah.footnotes}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                  Traduction des sens — Muhammad Hamidullah
                  <SourceInfo
                    sourceTitle="Traduction française des sens du Coran"
                    sourceAuthor="Muhammad Hamidullah"
                    editorialSource="QuranEnc"
                    nature="Traduction publiée, réutilisée telle quelle."
                  />
                </div>
              </>
            ) : (
              <Empty text="Traduction indisponible pour le moment." />
            )}
          </div>

          {/* Rubriques — une seule ouverte à la fois, jamais de rubrique vide */}
          <div className="space-y-2">
            {sections.map((key) => {
              const meta = SECTION_META[key];
              const open = openSection === key;
              return (
                <div
                  key={key}
                  className="overflow-hidden rounded-3xl border border-border/40 bg-card"
                >
                  <button
                    onClick={() => setOpenSection(open ? null : key)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <meta.icon className="size-4 shrink-0 text-primary" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-foreground">
                          {meta.label}
                        </span>
                        <span
                          lang="ar"
                          className="block truncate font-arabic text-xs text-muted-foreground"
                        >
                          {meta.subtitle}
                        </span>
                      </span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                  {open && (
                    <div className="border-t border-border/40 px-5 py-4">
                      {key === "tafsir" && <TafsirSection surah={surah} ayah={ayah} />}
                      {key === "asbab_nuzul" && <ContentList items={contexteItems} />}
                      {key === "lesson" && <ContentList items={lessonItems} />}
                      {key === "tadabbur" && <ContentList items={meditateItems} />}
                      {key === "today" && <ContentList items={todayItems} />}
                      {key === "amal" && <AgirSection items={agirItems} />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * [Al-Mukhtasar] [Al-Muyassar] [As-Sa'di] [Ibn Kathir] — chaque tafsir
 * reste indépendant, jamais fusionné. Al-Mukhtasar dispose d'une
 * traduction française déjà publiée ; les trois autres n'ont que
 * l'arabe vérifié pour l'instant (aucune traduction française publiée
 * et réutilisable identifiée) — affiché directement en arabe avec bouton
 * de bascule, sans grand panneau vide annonçant une attente.
 */
function TafsirSection({ surah, ayah }: { surah: number; ayah: number }) {
  const [choice, setChoice] = useState<"mokhtasar" | "muyassar" | "saadi" | "ibnkathir">(
    "mokhtasar",
  );
  const [showArabic, setShowArabic] = useState(false);
  const arSlug: TafsirSlug | null =
    choice === "saadi"
      ? "ar-tafsir-as-saadi"
      : choice === "ibnkathir"
        ? "ar-tafsir-ibn-kathir"
        : choice === "muyassar"
          ? "ar-tafsir-muyassar"
          : null;

  const { data: arabicText, isPending: arabicPending } = useQuery({
    queryKey: ["tafsir-etude", arSlug, surah, ayah],
    queryFn: () => fetchTafsir(arSlug as TafsirSlug, surah, ayah),
    enabled: !!arSlug,
    staleTime: Infinity,
  });
  const { data: mokhtasarText, isPending: mokhtasarPending } = useQuery({
    queryKey: ["tafsir-etude", "french-mokhtasar", surah, ayah],
    queryFn: () => fetchTafsir("french-mokhtasar", surah, ayah),
    enabled: choice === "mokhtasar",
    staleTime: Infinity,
  });

  const labels = {
    mokhtasar: "Al-Mukhtasar",
    muyassar: "Al-Muyassar",
    saadi: "As-Sa'di",
    ibnkathir: "Ibn Kathir",
  } as const;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-1 rounded-full border border-border p-1">
        {(["mokhtasar", "muyassar", "saadi", "ibnkathir"] as const).map((k) => (
          <button
            key={k}
            onClick={() => {
              setChoice(k);
              setShowArabic(false);
            }}
            className={cn(
              "rounded-full py-2 text-[11px] font-semibold transition",
              choice === k ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            {labels[k]}
          </button>
        ))}
      </div>

      {choice === "mokhtasar" ? (
        mokhtasarPending ? (
          <Loading />
        ) : mokhtasarText ? (
          <div>
            <p className="text-[0.95rem] leading-[1.85] text-foreground/90">{mokhtasarText}</p>
            <div className="mt-3 flex items-center gap-1 border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
              Al-Mukhtasar fî at-tafsîr, Markaz Tafsîr
              <SourceInfo
                sourceTitle="Al-Mukhtasar fî at-tafsîr al-Qur'ân al-karîm"
                editorialSource="Markaz Tafsîr"
                nature="Traduction française publiée, réutilisée telle quelle."
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Pas de contenu disponible pour cette ayah.
          </p>
        )
      ) : arSlug ? (
        arabicPending ? (
          <Loading />
        ) : arabicText ? (
          <div>
            <div className="mb-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
              {labels[choice]} — texte arabe vérifié
              <SourceInfo
                sourceTitle={labels[choice]}
                nature="Texte arabe source, aucune traduction française publiée identifiée pour l'instant."
              />
            </div>
            <button
              onClick={() => setShowArabic((v) => !v)}
              className="text-xs font-semibold text-primary"
            >
              {showArabic ? "Masquer l'original" : "العربية · Voir le texte arabe"}
            </button>
            {showArabic && (
              <p
                lang="ar"
                dir="rtl"
                className="mt-2 font-arabic text-right text-[1.05rem] leading-[2.1] text-foreground"
              >
                {arabicText}
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Pas de contenu disponible pour cette ayah.
          </p>
        )
      ) : null}
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
