import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStreak } from "@/lib/streak";

const MESSAGES: Record<number, string> = {
  3: "Trois jours de suite. Le plus dur est de commencer, et tu l'as fait.",
  10: "Tes adhkār du matin et du soir, dix jours d'affilée. Qu'Allah accepte et te raffermisse.",
  21: "Trois semaines de régularité. Qu'Allah te garde sur ce chemin.",
  40: "Quarante jours de suite. Qu'Allah accepte et te raffermisse.",
};

/** Série de jours (matin + soir terminés), discrète et personnelle : rien n'est
 * partagé, pas de classement ; un jour manqué reprend simplement à zéro. */
export function HomeStreak({ bothDone }: { bothDone: boolean }) {
  const { streak, week, celebrate, dismissCelebration } = useStreak(bothDone);
  if (streak < 1 && !celebrate) return null;
  return (
    <>
      <section
        aria-label="Série de jours"
        className="surface-card flex items-center gap-3 rounded-2xl px-4 py-3"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#fdeccf] text-[#c8741a] dark:bg-[#c8741a]/20">
          <Flame className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold text-foreground">
            {streak} {streak > 1 ? "jours" : "jour"} de suite
          </p>
          <p className="text-[13px] text-muted-foreground">Adhkār du matin et du soir</p>
        </div>
        <div className="flex gap-1" aria-hidden>
          {week.map((d) => (
            <span
              key={d.key}
              className={cn("size-2.5 rounded-full", d.done ? "bg-primary" : "bg-border")}
            />
          ))}
        </div>
      </section>

      {celebrate > 0 && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm">
          <div className="w-full rounded-t-3xl border-t border-border bg-card px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#fdeccf] text-[#c8741a]">
              <Flame className="size-8" />
            </span>
            <h2 className="mt-3 font-display text-xl font-bold">{celebrate} jours de suite</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {MESSAGES[celebrate] ?? ""}
            </p>
            <p lang="ar" dir="rtl" className="mt-2 font-arabic text-xl leading-[1.8] text-primary">
              رَبَّنَا تَقَبَّلْ مِنَّا
            </p>
            <button
              type="button"
              onClick={dismissCelebration}
              className="mt-4 w-full rounded-full bg-primary py-3 text-[15px] font-semibold text-primary-foreground active:scale-[0.98]"
            >
              Alhamdulillah
            </button>
          </div>
        </div>
      )}
    </>
  );
}
