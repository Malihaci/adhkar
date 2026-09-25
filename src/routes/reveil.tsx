import { createFileRoute } from "@tanstack/react-router";
import { DhikrViewer } from "@/components/DhikrViewer";
import { reveilAdhkar } from "@/data/adhkar-occasions";

export const Route = createFileRoute("/reveil")({
  head: () => ({
    meta: [{ title: "Adhkâr du réveil — Récitation authentique" }],
  }),
  validateSearch: (search: Record<string, unknown>): { i?: number } => ({
    i: search["i"] !== undefined ? Number(search["i"]) : undefined,
  }),
  component: ReveilPage,
});

function ReveilPage() {
  const { i } = Route.useSearch();
  return (
    <DhikrViewer
      list={reveilAdhkar}
      accent="gold"
      label="Au réveil"
      initialIndex={Number.isFinite(i) ? i : undefined}
    />
  );
}
