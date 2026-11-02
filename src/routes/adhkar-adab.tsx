import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
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
  validateSearch: (search: Record<string, unknown>): { i?: number } => ({
    i: search["i"] !== undefined ? Number(search["i"]) : undefined,
  }),
  component: AdhkarAdabPage,
});

function AdhkarAdabPage() {
  const { i } = Route.useSearch();

  if (i !== undefined && Number.isFinite(i)) {
    return (
      <DhikrViewer
        list={livreAdhkar}
        accent="gold"
        label={LIVRE_TITLE}
        backTo="/adhkar-adab"
        initialIndex={i}
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
          <h1 className="font-display text-xl font-semibold">{LIVRE_TITLE}</h1>
          <p lang="ar" dir="rtl" className="font-arabic text-sm text-muted-foreground">
            الأذكار والآداب
          </p>
        </div>
      </header>

      <p className="mb-5 text-xs leading-relaxed text-muted-foreground">{LIVRE_SOURCE_NOTE}</p>

      {LIVRE_SECTIONS.map((sec) => (
        <section key={sec.theme} className="mb-6">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {sec.label}
          </h2>
          <ul className="space-y-2">
            {livreAdhkar
              .map((d, index) => ({ d, index }))
              .filter(({ d }) => d.theme === sec.theme)
              .map(({ d, index }) => (
                <li key={d.id}>
                  <Link
                    to="/adhkar-adab"
                    search={{ i: index }}
                    className="surface-card block rounded-2xl px-4 py-3 transition hover:border-primary/40"
                  >
                    <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-[1.9] text-primary">
                      {d.titleAr}
                    </p>
                    <p className="font-medium text-foreground">{d.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{d.context}</p>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
