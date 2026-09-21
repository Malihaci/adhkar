import { createFileRoute, Navigate } from "@tanstack/react-router";
import { DhikrViewer } from "@/components/DhikrViewer";
import { adhkar } from "@/data/adhkar";
import { useFavorites } from "@/lib/storage";

export const Route = createFileRoute("/favoris-lecture")({
  head: () => ({
    meta: [
      { title: "Lecture des favoris — Adhkâr" },
      {
        name: "description",
        content:
          "Récitez uniquement vos adhkâr favoris, avec navigation précédent / suivant limitée à vos favoris.",
      },
      { property: "og:title", content: "Lecture des favoris — Adhkâr" },
      {
        property: "og:description",
        content: "Un parcours de récitation dédié à vos adhkâr enregistrés.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { id?: string } => ({
    id: typeof search['id'] === "string" ? search['id'] : undefined,
  }),
  component: FavorisLecturePage,
});

function FavorisLecturePage() {
  const { id } = Route.useSearch();
  const { favorites, hydrated } = useFavorites();

  // Parcours construit à partir des IDs favoris (jamais des positions générales)
  const list = adhkar.filter((d) => favorites.includes(d.id));

  if (!hydrated) return null;
  if (list.length === 0) return <Navigate to="/favoris" replace />;

  const start = Math.max(
    0,
    list.findIndex((d) => d.id === id),
  );

  return (
    <DhikrViewer
      key={id ?? "fav"}
      list={list}
      initialIndex={start}
      label="Favoris"
      backTo="/favoris"
      persist={false}
    />
  );
}
