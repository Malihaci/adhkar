import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, ChevronRight, BookOpen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AyahText } from "@/components/AyahText";
import { ALL_ADHKAR } from "@/data/adhkar-occasions";
import type { DhikrCategory } from "@/data/adhkar";
import { fetchChapters, fetchVerseDetail } from "@/lib/mushaf";
import { useFavorites } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/favoris")({
  head: () => ({
    meta: [
      { title: "Favoris" },
      {
        name: "description",
        content: "Vos adhkâr et âyāt favoris, prêts à être retrouvés en un instant.",
      },
    ],
  }),
  component: FavorisPage,
});

const CATEGORY_LABEL: Record<DhikrCategory, string> = {
  morning: "Matin",
  evening: "Soir",
  reveil: "Réveil",
  coucher: "Coucher",
  apres_priere: "Après la prière",
  sortie: "Sortie",
  voyage: "Voyage",
};

type Tab = "tous" | "adhkar" | "coran";

function FavorisPage() {
  const [tab, setTab] = useState<Tab>("tous");
  const { favorites, toggle } = useFavorites();

  const dhikrFavIds = favorites.filter((f) => f.type === "dhikr").map((f) => f.id);
  const ayahFavKeys = favorites.filter((f) => f.type === "ayah").map((f) => f.id);
  const dhikrList = ALL_ADHKAR.filter((d) => dhikrFavIds.includes(d.id));

  const showAdhkar = tab === "tous" || tab === "adhkar";
  const showAyat = tab === "tous" || tab === "coran";
  const isEmpty = dhikrList.length === 0 && ayahFavKeys.length === 0;

  return (
    <AppShell title="Favoris" subtitle="المفضلة">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ["tous", "Tous"],
              ["adhkar", "Adhkār"],
              ["coran", "Coran"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "rounded-2xl px-3 py-2.5 text-sm font-semibold transition",
                tab === key
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                  : "surface-card text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {isEmpty ? (
          <div className="surface-card flex flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-secondary text-muted-foreground">
              <Heart className="size-6" />
            </span>
            <p className="font-display text-lg font-semibold">Aucun favori</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Touchez le cœur d'un dhikr ou d'une ayah pour l'enregistrer ici.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {showAdhkar &&
              dhikrList.map((d) => (
                <li key={d.id} className="surface-card list-none overflow-hidden">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <Link
                      to="/favoris-lecture"
                      search={{ id: d.id }}
                      className="min-w-0 px-4 py-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {CATEGORY_LABEL[d.category]} ·{" "}
                        <span className="text-primary">{d.repetitions} fois</span>
                      </p>
                      <p className="mt-0.5 truncate font-display text-lg font-semibold">
                        {d.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {d.translation}
                      </p>
                    </Link>
                    <div className="flex shrink-0 items-center gap-1 pr-3">
                      <button
                        onClick={() => toggle("dhikr", d.id)}
                        aria-label="Retirer des favoris"
                        className="grid size-11 place-items-center rounded-full text-gold transition hover:bg-muted"
                      >
                        <Heart className="size-6 fill-gold" />
                      </button>
                      <ChevronRight className="size-5 text-muted-foreground" />
                    </div>
                  </div>
                </li>
              ))}

            {showAyat &&
              ayahFavKeys.map((key) => (
                <AyahFavoriteRow key={key} verseKey={key} onRemove={() => toggle("ayah", key)} />
              ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}

function AyahFavoriteRow({ verseKey, onRemove }: { verseKey: string; onRemove: () => void }) {
  const { data: chapters } = useQuery({
    queryKey: ["chapters-fr"],
    queryFn: fetchChapters,
    staleTime: Infinity,
  });
  const { data: verse } = useQuery({
    queryKey: ["verse-detail", verseKey],
    queryFn: () => fetchVerseDetail(verseKey),
    staleTime: Infinity,
  });

  const [surahStr, ayahStr] = verseKey.split(":");
  const chapter = chapters?.find((c) => c.id === Number(surahStr));

  return (
    <li className="surface-card list-none overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <Link
          to="/quran/page/$page"
          params={{ page: String(verse?.page ?? 1) }}
          search={{ sel: verseKey }}
          className="min-w-0 px-4 py-4"
        >
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <BookOpen className="size-3.5 text-gold" />
            {chapter ? `${chapter.nameFrench} — ${surahStr}:${ayahStr}` : verseKey}
          </p>
          {verse ? (
            <AyahText text={verse.arabic} className="mt-1 text-lg leading-loose" align="right" />
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Chargement…</p>
          )}
        </Link>
        <div className="flex shrink-0 items-center gap-1 pr-3">
          <button
            onClick={onRemove}
            aria-label="Retirer des favoris"
            className="grid size-11 place-items-center rounded-full text-gold transition hover:bg-muted"
          >
            <Heart className="size-6 fill-gold" />
          </button>
          <ChevronRight className="size-5 text-muted-foreground" />
        </div>
      </div>
    </li>
  );
}
