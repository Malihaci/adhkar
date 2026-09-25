import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SourceInfo } from "@/components/SourceInfo";
import { anasKhatmaPractice, khatmaCaution, khatmaInvitation } from "@/data/khatma";

export const Route = createFileRoute("/khatma")({
  head: () => ({
    meta: [
      { title: "Fin de lecture du Coran — ختم القرآن" },
      {
        name: "description",
        content:
          "Ce que les sources établissent réellement sur la fin de lecture complète du Coran — sans invocation prophétique inventée.",
      },
    ],
  }),
  component: KhatmaPage,
});

function KhatmaPage() {
  return (
    <AppShell title="Fin de lecture du Coran" subtitle="ختم القرآن">
      <div className="space-y-4">
        <div className="surface-card space-y-3 p-5">
          <p className="text-sm leading-relaxed text-foreground">{khatmaCaution}</p>
        </div>

        <div className="surface-card space-y-3 p-5">
          <div className="flex items-center gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
              <BookOpen className="size-4" />
            </span>
            <h2 className="font-display text-base font-semibold text-foreground">
              Une pratique rapportée d'Anas ibn Malik (رضي الله عنه)
            </h2>
          </div>
          <p
            lang="ar"
            dir="rtl"
            className="font-arabic text-right text-lg leading-[2] text-foreground"
          >
            {anasKhatmaPractice.textAr}
          </p>
          <p className="text-sm leading-relaxed text-foreground">
            {anasKhatmaPractice.translationFr}
          </p>
          <div className="flex items-center gap-1 border-t border-border/60 pt-2 text-xs text-muted-foreground">
            <span>
              Pratique rapportée d'Anas ibn Malik (رضي الله عنه) — Sunan al-Darimi{" "}
              {anasKhatmaPractice.hadithNumber}
            </span>
            <SourceInfo
              sourceTitle={anasKhatmaPractice.collection}
              sourceReference={anasKhatmaPractice.hadithNumber}
              sourceAuthor={anasKhatmaPractice.narrator}
              nature={anasKhatmaPractice.authenticityNote}
            />
          </div>
        </div>

        <div className="surface-card space-y-2 p-5">
          <p className="text-sm leading-relaxed text-foreground">{khatmaInvitation}</p>
        </div>
      </div>
    </AppShell>
  );
}
