import { createFileRoute } from "@tanstack/react-router";
import { DhikrViewer } from "@/components/DhikrViewer";
import { morningAdhkar } from "@/data/adhkar";

export const Route = createFileRoute("/matin")({
  head: () => ({
    meta: [
      { title: "Adhkâr du Matin — Récitation authentique" },
      {
        name: "description",
        content:
          "Adhkâr authentiques du matin : arabe vocalisé, phonétique, traduction française, explication, mérites et références (Bukhârî, Muslim, Abû Dâwud, Tirmidhî, Nasâ'î).",
      },
      { property: "og:title", content: "Adhkâr du Matin" },
      {
        property: "og:description",
        content:
          "Compteur intelligent, progression et mérites authentiques pour la récitation du matin.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { i?: number } => ({
    i: search['i'] !== undefined ? Number(search['i']) : undefined,
  }),
  component: MatinPage,
});

function MatinPage() {
  const { i } = Route.useSearch();
  return (
    <DhikrViewer
      list={morningAdhkar}
      accent="gold"
      initialIndex={Number.isFinite(i) ? i : undefined}
    />
  );
}
