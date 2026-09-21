import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { adhkar } from "@/data/adhkar";
import { useFavorites } from "@/lib/storage";
import { Heart, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/favoris")({
  head: () => ({
    meta: [
      { title: "Favoris — Adhkâr" },
      {
        name: "description",
        content: "Vos adhkâr favoris, prêts à être récités en un instant.",
      },
      { property: "og:title", content: "Adhkâr — Favoris" },
      {
        property: "og:description",
        content: "Retrouvez rapidement vos invocations préférées.",
      },
    ],
  }),
  component: FavorisPage,
});

function FavorisPage() {
  const { favorites, toggle } = useFavorites();
  const list = adhkar.filter((d) => favorites.includes(d.id));

  return (
    <AppShell title="Favoris" subtitle="Vos adhkâr enregistrés.">
      {list.length === 0 ? (
        <div className="surface-card flex flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-secondary text-muted-foreground">
            <Heart className="size-6" />
          </span>
          <p className="font-display text-lg font-semibold">Aucun favori</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Touchez le cœur d'un dhikr pour l'enregistrer ici et le retrouver
            facilement.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((d) => {
            const morning = d.category === "morning";
            return (
              <li key={d.id} className="surface-card overflow-hidden">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <Link
                    to="/favoris-lecture"
                    search={{ id: d.id }}
                    className="min-w-0 px-4 py-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {morning ? "Matin" : "Soir"} ·{" "}
                      <span className="text-primary">
                        {d.repetitions} fois
                      </span>
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
                      onClick={() => toggle(d.id)}
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
          })}
        </ul>
      )}
    </AppShell>
  );
}
