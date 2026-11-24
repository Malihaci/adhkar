import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { pickDuaOfTheMoment } from "@/data/dua-du-moment";

/** Doua / hadith authentique du moment, sous l'en-tête. Replié par défaut
 * (arabe + source) pour ne pas allonger l'accueil ; un tap affiche la
 * traduction et l'explication (quand la dire / ce que cela signifie). */
export function HomeDua({ now, isDay }: { now: Date; isDay: boolean }) {
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const item = pickDuaOfTheMoment(now, isDay, offset);
  return (
    <section
      aria-label={item.kind === "dua" ? "Doua du moment" : "Hadith du moment"}
      className="rounded-2xl border border-border/60 bg-muted/40 px-4 py-3"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="block w-full text-left"
      >
        <span className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {item.kind === "dua" ? "Doua du moment" : "Hadith du moment"}
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        </span>
        <span
          lang="ar"
          dir="rtl"
          className={cn(
            "mt-1 block text-center font-arabic text-[1.2rem] leading-[1.9] text-foreground",
            !open && "line-clamp-2",
          )}
        >
          {item.arabic}
        </span>
      </button>
      <button type="button" onClick={() => setOpen((o) => !o)} className="mt-1 block w-full text-left">
        <p className={cn("text-[13px] leading-snug text-foreground", !open && "line-clamp-2")}>
          {item.french}
        </p>
        {open && (
          <div className="mt-3 space-y-2 rounded-xl bg-background/70 px-3 py-2.5 text-xs leading-snug">
            {item.narrator && (
              <p>
                <span className="font-semibold text-foreground">Rapporté par : </span>
                <span className="text-muted-foreground">{item.narrator}</span>
              </p>
            )}
            <p>
              <span className="font-semibold text-foreground">
                {item.kind === "dua" ? "Quand la dire et contexte : " : "Contexte et moment : "}
              </span>
              <span className="text-muted-foreground">{item.note}</span>
            </p>
          </div>
        )}
      </button>
      <div className="mt-2 flex items-center justify-between gap-2 border-t border-border/60 pt-1.5">
        <p className="min-w-0 text-[11px] text-muted-foreground">{item.source}</p>
        <button
          type="button"
          onClick={() => {
            setOffset((o) => o + 1);
            setOpen(false);
          }}
          className="shrink-0 rounded-full border border-border bg-background/60 px-3 py-1 text-[12px] font-semibold text-primary active:scale-95"
        >
          Une autre
        </button>
      </div>
      {item.dua && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="mt-3 block w-full rounded-xl bg-background/70 px-3 py-2.5 text-left"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gold">
            Doua associée
          </span>
          <span
            lang="ar"
            dir="rtl"
            className={cn(
              "mt-1 block text-center font-arabic text-[1.15rem] leading-[1.9] text-foreground",
              !open && "line-clamp-2",
            )}
          >
            {item.dua.arabic}
          </span>
          {open && (
            <>
              <span className="mt-1 block text-[13px] leading-snug text-foreground">{item.dua.french}</span>
              <span className="mt-1.5 block text-[11px] text-muted-foreground">{item.dua.source}</span>
            </>
          )}
        </button>
      )}
    </section>
  );
}
