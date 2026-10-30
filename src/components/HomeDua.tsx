import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { pickDuaOfTheMoment } from "@/data/dua-du-moment";

/** Doua / hadith authentique du moment, sous l'en-tête. Replié par défaut
 * (arabe + source) pour ne pas allonger l'accueil ; un tap affiche la
 * traduction et l'explication (quand la dire / ce que cela signifie). */
export function HomeDua({ now, isDay }: { now: Date; isDay: boolean }) {
  const [open, setOpen] = useState(false);
  const item = pickDuaOfTheMoment(now, isDay);
  return (
    <section
      aria-label={item.kind === "dua" ? "Doua du moment" : "Hadith du moment"}
      className="surface-card rounded-2xl px-4 py-3"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="block w-full text-left"
      >
        <span className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-gold">
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
      {open && (
        <div className="mt-1 space-y-2">
          <p className="text-[13px] leading-snug text-foreground">{item.french}</p>
          <p className="text-xs leading-snug text-muted-foreground">{item.note}</p>
        </div>
      )}
      <p className="mt-2 border-t border-border/60 pt-1.5 text-[11px] text-muted-foreground">
        {item.source}
      </p>
    </section>
  );
}
