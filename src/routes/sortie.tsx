import { createFileRoute } from "@tanstack/react-router";
import { DhikrViewer } from "@/components/DhikrViewer";
import { sortieAdhkar } from "@/data/adhkar-occasions";

export const Route = createFileRoute("/sortie")({
  head: () => ({
    meta: [
      { title: "Adhkâr en sortant de la maison — Récitation authentique" },
      {
        name: "description",
        content: "Les deux invocations authentiques en sortant de la maison, sourcées (Abu Dawud).",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { i?: number } => ({
    i: search["i"] !== undefined ? Number(search["i"]) : undefined,
  }),
  component: SortiePage,
});

function SortiePage() {
  const { i } = Route.useSearch();
  return (
    <DhikrViewer
      list={sortieAdhkar}
      accent="gold"
      label="Sortir de la maison"
      initialIndex={Number.isFinite(i) ? i : undefined}
    />
  );
}
