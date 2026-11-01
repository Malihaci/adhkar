import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Bookmark, ChevronLeft, PencilLine, Search } from "lucide-react";
import { useLocalState } from "@/lib/storage";
import { fetchChapters } from "@/lib/mushaf";
import { getSurahIntro } from "@/data/surah-intro";
import { Card, Loading } from "@/routes/tadabbur";

export const Route = createFileRoute("/sourate/$surah")({
  head: ({ params }) => ({
    meta: [{ title: `Découvrir la sourate ${params.surah} — NurMaLiHa` }],
  }),
  component: SouratePage,
});

function SouratePage() {
  const { surah: surahParam } = Route.useParams();
  const navigate = useNavigate();
  const surah = Number(surahParam);
  const [lastPage] = useLocalState<number>("quran-last-page", 1);

  const { data: chapters, isPending } = useQuery({
    queryKey: ["chapters-fr"],
    queryFn: fetchChapters,
    staleTime: Infinity,
  });
  const chapterMeta = chapters?.find((c) => c.id === surah);

  const intro = getSurahIntro(surah);

  const goToMushaf = (page?: number) => {
    if (!chapterMeta) return;
    navigate({ to: "/quran/page/$page", params: { page: String(page ?? chapterMeta.pages[0]) } });
  };
  /** Progression existante : la dernière page lue tombe dans cette sourate (hors toute première page). */
  const resumePage =
    chapterMeta && lastPage > chapterMeta.pages[0] && lastPage <= chapterMeta.pages[1] ? lastPage : null;

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="shrink-0 border-b border-border/40 bg-card/80 px-3 py-2.5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <Link
            to="/"
            aria-label="Retour"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <p className="min-w-0 flex-1 truncate font-display text-lg font-bold text-foreground">
            Découvrir une sourate
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-4 px-4 pb-8 pt-4">
          {isPending && <Loading />}

          {chapterMeta && (
            <div className="rounded-[20px] bg-gradient-to-br from-primary to-[color-mix(in_srgb,var(--primary)_70%,black)] px-4 py-6 text-center text-primary-foreground">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-75">
                Sourate {chapterMeta.id}
              </p>
              <p lang="ar" dir="rtl" className="mt-1 font-arabic text-4xl font-bold leading-[1.7]">
                {chapterMeta.nameArabic}
              </p>
              <p className="font-display text-3xl font-bold leading-tight">{chapterMeta.nameSimple}</p>
              <p className="mt-1 text-sm opacity-80">{chapterMeta.nameFrench}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[
                  `${chapterMeta.versesCount} versets`,
                  `Page ${chapterMeta.pages[0]}`,
                ].map((c) => (
                  <span key={c} className="inline-flex h-7 items-center rounded-full bg-white/15 px-3 text-xs font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {chapterMeta && (
            <div className="space-y-2">
              <button
                onClick={() => goToMushaf()}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground transition duration-150 active:scale-[0.98]"
              >
                <BookOpen className="size-[18px]" />
                Lire dans le Mushaf
              </button>
              {resumePage && (
                <button
                  onClick={() => goToMushaf(resumePage)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[color-mix(in_srgb,#8a63c0_16%,transparent)] text-[15px] font-semibold text-[color-mix(in_srgb,#8a63c0_75%,var(--foreground))] transition duration-150 active:scale-[0.98]"
                >
                  <Bookmark className="size-[18px]" />
                  Reprendre ma lecture · page {resumePage}
                </button>
              )}
              <Link
                to="/etude/$surah/$ayah"
                params={{ surah: String(chapterMeta.id), ayah: "1" }}
                className="surface-card flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold text-foreground transition duration-150 active:scale-[0.98]"
              >
                <Search className="size-[18px]" />
                Étudier les āyāt
              </Link>
            </div>
          )}

          {!intro && chapterMeta && (
            <div className="flex items-center gap-3 rounded-2xl bg-gold/15 px-4 py-3 text-sm font-semibold text-foreground">
              <PencilLine className="size-5 shrink-0 text-gold" />
              Fiche détaillée en préparation
            </div>
          )}

          {intro?.facts.map((fact) => (
            <Card key={fact.label}>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">{fact.label}</p>
              <p className="text-[0.95rem] leading-[1.85] text-foreground/90">{fact.textFr}</p>
              <p className="mt-3 border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
                Source : {fact.sourceTitle}
                {fact.sourceAuthor ? ` — ${fact.sourceAuthor}` : ""}
                {fact.sourceStatus === "needs_review" ? " · à valider" : ""}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
