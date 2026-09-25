import { createFileRoute } from "@tanstack/react-router";
import { DhikrViewer } from "@/components/DhikrViewer";
import { voyageAdhkar } from "@/data/adhkar-occasions";

export const Route = createFileRoute("/voyage")({
  head: () => ({
    meta: [
      { title: "Adhkâr du voyage — Récitation authentique" },
      {
        name: "description",
        content:
          "Adhkâr du voyage organisés par moment (départ, trajet, halte, retour), sourcés (Sahih Muslim, Sahih al-Bukhari, At-Tirmidhi).",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { i?: number } => ({
    i: search["i"] !== undefined ? Number(search["i"]) : undefined,
  }),
  component: VoyagePage,
});

function VoyagePage() {
  const { i } = Route.useSearch();
  return (
    <DhikrViewer
      list={voyageAdhkar}
      accent="primary"
      label="Voyage"
      initialIndex={Number.isFinite(i) ? i : undefined}
    />
  );
}
