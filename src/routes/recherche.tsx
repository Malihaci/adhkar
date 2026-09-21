import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DhikrCard } from "@/components/DhikrCard";
import { adhkar } from "@/data/adhkar";

export const Route = createFileRoute("/recherche")({
  head: () => ({
    meta: [
      { title: "Recherche — Adhkâr" },
      {
        name: "description",
        content:
          "Recherchez par mot arabe, français, phonétique ou référence de hadith.",
      },
      { property: "og:title", content: "Adhkâr — Recherche" },
      {
        property: "og:description",
        content: "Trouvez rapidement un dhikr par mot-clé ou référence.",
      },
    ],
  }),
  component: RecherchePage,
});

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`]/g, "");
}

function RecherchePage() {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const query = normalize(q.trim());
    if (!query) return [];
    return adhkar.filter((d) => {
      const hay = normalize(
        `${d.title} ${d.phonetic} ${d.translation} ${d.reference} ${d.explanation} ${d.merits}`,
      );
      return hay.includes(query) || d.arabic.includes(q.trim());
    });
  }, [q]);

  return (
    <AppShell title="Recherche" subtitle="Arabe, français, phonétique ou référence.">
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ex : Ayat al-Kursî, Bukhârî, protection…"
          aria-label="Rechercher un dhikr"
          className="h-12 w-full rounded-full border border-input bg-card pl-11 pr-11 text-[15px] shadow-[var(--shadow-soft)] outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            aria-label="Effacer"
            className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {!q.trim() ? (
        <p className="text-center text-sm text-muted-foreground">
          Commencez à taper pour rechercher parmi {adhkar.length} adhkâr
          authentiques.
        </p>
      ) : results.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Aucun résultat pour « {q} ».
        </p>
      ) : (
        <div className="space-y-5">
          {results.map((d, i) => (
            <DhikrCard key={d.id} dhikr={d} index={i} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
