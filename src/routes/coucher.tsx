import { createFileRoute } from "@tanstack/react-router";
import { DhikrViewer } from "@/components/DhikrViewer";
import { coucherAdhkar } from "@/data/adhkar-occasions";

export const Route = createFileRoute("/coucher")({
  head: () => ({
    meta: [
      { title: "Adhkâr du coucher — Récitation authentique" },
      {
        name: "description",
        content:
          "Adhkâr authentiques avant de dormir : sourates protectrices, Ayat al-Kursi, tasbih, invocations sourcées (Bukhari, Muslim).",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { i?: number } => ({
    i: search["i"] !== undefined ? Number(search["i"]) : undefined,
  }),
  component: CoucherPage,
});

function CoucherPage() {
  const { i } = Route.useSearch();
  return (
    <DhikrViewer
      list={coucherAdhkar}
      accent="primary"
      label="Avant de dormir"
      initialIndex={Number.isFinite(i) ? i : undefined}
    />
  );
}
