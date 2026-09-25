import { createFileRoute } from "@tanstack/react-router";
import { DhikrViewer } from "@/components/DhikrViewer";
import { apresPriereAdhkar } from "@/data/adhkar-occasions";

export const Route = createFileRoute("/apres-priere")({
  head: () => ({
    meta: [{ title: "Adhkâr après la prière — Récitation authentique" }],
  }),
  validateSearch: (search: Record<string, unknown>): { i?: number } => ({
    i: search["i"] !== undefined ? Number(search["i"]) : undefined,
  }),
  component: ApresPrierePage,
});

function ApresPrierePage() {
  const { i } = Route.useSearch();
  return (
    <DhikrViewer
      list={apresPriereAdhkar}
      accent="primary"
      label="Après la prière"
      initialIndex={Number.isFinite(i) ? i : undefined}
    />
  );
}
