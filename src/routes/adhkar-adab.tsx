import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { Dhikr } from "@/data/adhkar";
import { DhikrViewer } from "@/components/DhikrViewer";
import {
  LIVRE_SECTIONS,
  LIVRE_SOURCE_NOTE,
  LIVRE_TITLE,
  livreAdhkar,
} from "@/data/adhkar-livre";

export const Route = createFileRoute("/adhkar-adab")({
  head: () => ({
    meta: [
      { title: "Adhkār et ādāb — invocations et rappels du quotidien" },
      {
        name: "description",
        content:
          "Les mérites de la science et du Coran, puis les invocations de la purification : arabe, phonétique, français et source.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { c?: string; i?: number } => ({
    c: typeof search["c"] === "string" ? (search["c"] as string) : undefined,
    i: search["i"] !== undefined ? Number(search["i"]) : undefined,
  }),
  component: AdhkarAdabPage,
});

/** Chapitre du livre = numéro dans l'id (« livre-06b » → « 06 »). */
const chapterOf = (d: Dhikr) => d.id.slice(6, 8);
const chapterTitle = (d: Dhikr) => d.title.replace(/ \(\d\/\d\)$/, "").split(" : ")[0];

function chaptersOf(theme: string): Dhikr[][] {
  const by = new Map<string, Dhikr[]>();
  for (const d of livreAdhkar) {
    if (d.theme !== theme) continue;
    const k = chapterOf(d);
    by.set(k, [...(by.get(k) ?? []), d]);
  }
  return [...by.values()];
}

function AdhkarAdabPage() {
  const { c, i } = Route.useSearch();
  const [showNote, setShowNote] = useState(false);

  const chapterList = c ? livreAdhkar.filter((d) => chapterOf(d) === c) : [];
  if (chapterList.length > 0) {
    return (
      <DhikrViewer
        list={chapterList}
        accent="gold"
        label={chapterTitle(chapterList[0])}
        backTo="/adhkar-adab"
        initialIndex={i !== undefined && Number.isFinite(i) ? i : 0}
        persist={false}
      />
    );
  }

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
          <h1 className="font-display text-xl font-semibold">
            {LIVRE_TITLE}
            <button
              type="button"
              aria-label="Source et remarque"
              onClick={() => setShowNote((v) => !v)}
              className="ml-1 align-super text-xs text-muted-foreground"
            >
              *
            </button>
          </h1>
          <p lang="ar" dir="rtl" className="font-arabic text-sm text-muted-foreground">
            الأذكار والآداب
          </p>
        </div>
      </header>

      {showNote && (
        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">{LIVRE_SOURCE_NOTE}</p>
      )}

      {LIVRE_SECTIONS.map((sec) => (
        <section key={sec.theme} className="mb-6">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {sec.label}
          </h2>
          <ul className="space-y-2">
            {chaptersOf(sec.theme).map((ch) => (
              <li key={chapterOf(ch[0])}>
                <Link
                  to="/adhkar-adab"
                  search={{ c: chapterOf(ch[0]) }}
                  className="surface-card flex items-center justify-between gap-3 rounded-2xl px-4 py-3 transition hover:border-primary/40"
                >
                  <span className="min-w-0">
                    <span className="block font-medium text-foreground">{chapterTitle(ch[0])}</span>
                    {ch.length > 1 && (
                      <span className="text-xs text-muted-foreground">{ch.length} textes</span>
                    )}
                  </span>
                  <span lang="ar" dir="rtl" className="shrink-0 font-arabic text-2xl leading-[1.9] text-primary">
                    {ch[0].titleAr}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
