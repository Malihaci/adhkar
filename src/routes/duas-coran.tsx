import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";
import { DhikrViewer } from "@/components/DhikrViewer";
import { DUA_THEMES, duasCoran } from "@/data/duas-coran";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/duas-coran")({
  head: () => ({
    meta: [
      { title: "Duʿāʾ du Coran — invocations des croyants et des prophètes" },
      {
        name: "description",
        content:
          "Les invocations rapportées dans le Coran, en arabe, phonétique et français, avec leur contexte.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { t?: string; i?: number } => ({
    t: typeof search["t"] === "string" ? (search["t"] as string) : undefined,
    i: search["i"] !== undefined ? Number(search["i"]) : undefined,
  }),
  component: DuasCoranPage,
});

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

function DuasCoranPage() {
  const { t, i } = Route.useSearch();
  const [query, setQuery] = useState("");

  const theme = t && t !== "all" ? t : null;
  const list = useMemo(
    () => (theme ? duasCoran.filter((d) => d.theme === theme) : duasCoran),
    [theme],
  );

  if (i !== undefined && Number.isFinite(i)) {
    return (
      <DhikrViewer
        list={list}
        accent="gold"
        label="Duʿāʾ du Coran"
        backTo="/duas-coran"
        initialIndex={i}
        persist={false}
      />
    );
  }

  const q = normalize(query.trim());
  const shown = list
    .map((d, index) => ({ d, index }))
    .filter(
      ({ d }) =>
        !q ||
        normalize(`${d.title} ${d.translation} ${d.phonetic} ${d.reference} ${d.context ?? ""}`).includes(q),
    );

  return (
    <div className="mx-auto min-h-[100dvh] max-w-2xl bg-background px-4 pb-10 pt-4">
      <header className="mb-4 flex items-center gap-3">
        <Link
          to="/"
          aria-label="Accueil"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-border"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="font-display text-xl font-semibold">Duʿāʾ du Coran</h1>
          <p lang="ar" dir="rtl" className="font-arabic text-sm text-muted-foreground">
            أدعية القرآن
          </p>
        </div>
      </header>

      <label className="relative mb-3 block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher (Rabbanā, pardon, parents…)"
          className="h-11 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </label>

      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {[{ key: "all", label: `Toutes (${duasCoran.length})` }, ...DUA_THEMES].map((th) => {
          const active = (theme ?? "all") === th.key;
          return (
            <Link
              key={th.key}
              to="/duas-coran"
              search={{ t: th.key === "all" ? undefined : th.key }}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground",
              )}
            >
              {th.label}
            </Link>
          );
        })}
      </div>

      <ul className="space-y-2">
        {shown.map(({ d, index }) => (
          <li key={d.id}>
            <Link
              to="/duas-coran"
              search={{ t: theme ?? "all", i: index }}
              className="surface-card block rounded-2xl px-4 py-3 transition hover:border-primary/40"
            >
              <p className="font-medium text-foreground">{d.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {d.context}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-primary">
                {d.reference.replace(" · traduction de Muhammad Hamidullah", "")}
              </p>
            </Link>
          </li>
        ))}
        {shown.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            Aucune invocation ne correspond.
          </li>
        )}
      </ul>
    </div>
  );
}
