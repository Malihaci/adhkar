import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ChevronLeft } from "lucide-react";
import { fetchChapters } from "@/lib/mushaf";
import { AL_FATIHA_INTRO } from "@/data/surah-intro";
import { Card, Loading } from "@/routes/tadabbur";

export const Route = createFileRoute("/sourate/$surah")({
  head: ({ params }) => ({
    meta: [{ title: `Découvrir la sourate ${params.surah} — Adhkâr` }],
  }),
  component: SouratePage,
});

function SouratePage() {
  const { surah: surahParam } = Route.useParams();
  const navigate = useNavigate();
  const surah = Number(surahParam);

  const { data: chapters, isPending } = useQuery({
    queryKey: ["chapters-fr"],
    queryFn: fetchChapters,
    staleTime: Infinity,
  });
  const chapterMeta = chapters?.find((c) => c.id === surah);

  const intro = surah === 1 ? AL_FATIHA_INTRO : null;

  const goToMushaf = () => {
    if (!chapterMeta) return;
    navigate({ to: "/quran/page/$page", params: { page: String(chapterMeta.pages[0]) } });
  };

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
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
            Découvrir {chapterMeta?.nameFrench ?? `la sourate ${surah}`}
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-5">
          {isPending && <Loading />}

          {chapterMeta && (
            <div className="rounded-[28px] border border-border/40 bg-card px-5 py-7 text-center">
              <p lang="ar" dir="rtl" className="font-arabic text-3xl font-bold text-foreground">
                {chapterMeta.nameArabic}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {chapterMeta.nameFrench}
                {intro ? ` (${intro.nameTransliteration})` : ""}
              </p>
              {intro && (
                <p className="mt-1 text-xs text-muted-foreground">{intro.versesCount} versets</p>
              )}
            </div>
          )}

          {!intro && chapterMeta && (
            <Card>
              <p className="text-sm text-muted-foreground">
                La découverte détaillée de cette sourate n'est pas encore disponible — seule
                Al-Fatiha a été préparée pour ce pilote.
              </p>
            </Card>
          )}

          {intro?.facts.map((fact) => (
            <Card key={fact.label}>
              <p className="mb-1.5 text-[11px] font-semibold text-primary">{fact.label}</p>
              <p className="text-[0.95rem] leading-[1.85] text-foreground/90">{fact.textFr}</p>
              <p className="mt-3 border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
                Source : {fact.sourceTitle}
                {fact.sourceAuthor ? ` — ${fact.sourceAuthor}` : ""}
                {fact.sourceStatus === "needs_review" ? " · à valider" : ""}
              </p>
            </Card>
          ))}

          {chapterMeta && (
            <button
              onClick={goToMushaf}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground transition active:scale-[0.98]"
            >
              <BookOpen className="size-4" />
              Lire la sourate dans le Mushaf
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
