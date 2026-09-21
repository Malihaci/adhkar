import { createFileRoute } from "@tanstack/react-router";
import { DhikrViewer } from "@/components/DhikrViewer";
import { eveningAdhkar } from "@/data/adhkar";

export const Route = createFileRoute("/soir")({
  head: () => ({
    meta: [
      { title: "Adhkâr du Soir — Récitation authentique" },
      {
        name: "description",
        content:
          "Adhkâr authentiques du soir : arabe vocalisé, phonétique, traduction française, explication, mérites et références.",
      },
      { property: "og:title", content: "Adhkâr du Soir" },
      {
        property: "og:description",
        content: "Vos invocations du soir avec compteur et progression.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { i?: number } => ({
    i: search['i'] !== undefined ? Number(search['i']) : undefined,
  }),
  component: SoirPage,
});

function SoirPage() {
  const { i } = Route.useSearch();
  return (
    <DhikrViewer
      list={eveningAdhkar}
      accent="primary"
      initialIndex={Number.isFinite(i) ? i : undefined}
    />
  );
}
