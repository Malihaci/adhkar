import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { clampPage, fetchChapters } from "@/lib/mushaf";
import { usePreferences } from "@/lib/preferences";

/** Ancienne adresse du mode « āyah par āyah » : ce mode vit désormais dans la
 * page Mushaf (même barre du bas, mêmes options). On redirige, sans casser les
 * anciens liens ni les entrées de l'accueil. */
export const Route = createFileRoute("/quran/lire/$surah")({
  validateSearch: (s: Record<string, unknown>): { p?: number } => {
    const n = Number(s.p);
    return { p: Number.isFinite(n) && n >= 1 ? clampPage(n) : undefined };
  },
  head: ({ params }) => ({
    meta: [{ title: `Lire — Sourate ${params.surah}` }],
  }),
  component: LireRedirect,
});

function LireRedirect() {
  const { surah } = Route.useParams();
  const { p } = Route.useSearch();
  const navigate = useNavigate();
  const { prefs, updateQuran } = usePreferences();
  const { data: chapters } = useQuery({
    queryKey: ["chapters-fr"],
    queryFn: fetchChapters,
    staleTime: Infinity,
  });
  const page = p ?? chapters?.find((c) => c.id === Number(surah))?.pages[0];

  useEffect(() => {
    if (page == null) return;
    if (prefs.quran.belowMode !== "ayah") updateQuran({ belowMode: "ayah" });
    navigate({ to: "/quran/page/$page", params: { page: String(page) }, replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return <p className="py-16 text-center text-sm text-muted-foreground">Chargement…</p>;
}
