import { useEffect, useState } from "react";
import { MoonStar, X } from "lucide-react";
import { fastNotice, type FastNotice } from "@/lib/fasting";
import { readJSON, writeJSON } from "@/lib/storage";

const KEY = "adhkar:fast-dismissed";

function when(n: FastNotice): { head: string; line: string } {
  if (n.inDays === 0)
    return {
      head: "Aujourd'hui",
      line: "Il est recommandé de jeûner. Faites l'intention avant le Fajr.",
    };
  if (n.inDays === 1)
    return { head: "Demain", line: "Il serait bien de jeûner demain. Pensez à l'intention avant le Fajr." };
  return { head: `Dans ${n.inDays} jours`, line: "À prévoir : jeûne recommandé." };
}

/** Rappel des jours de jeûne recommandés : quelques jours avant, la veille, le jour même. */
export function HomeFasting({ now }: { now: Date }) {
  const [notice, setNotice] = useState<FastNotice | null>(null);
  useEffect(() => {
    const n = fastNotice(now);
    const dismissed = readJSON<string[]>(KEY, []);
    setNotice(n && !dismissed.includes(`${n.key}@${n.inDays}`) ? n : null);
  }, [now.toDateString()]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!notice) return null;
  const w = when(notice);
  const dismiss = () => {
    const list = readJSON<string[]>(KEY, []).slice(-30);
    writeJSON(KEY, [...list, `${notice.key}@${notice.inDays}`]);
    setNotice(null);
  };
  return (
    <section
      aria-label="Jeûne recommandé"
      className="relative flex gap-3 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3"
    >
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-gold/20 text-gold">
        <MoonStar className="size-[18px]" />
      </span>
      <div className="min-w-0 flex-1 pr-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {w.head} · {notice.title}
        </p>
        <p className="mt-0.5 text-[13px] font-semibold leading-snug text-foreground">{w.line}</p>
        <p className="mt-1 text-xs leading-snug text-muted-foreground">{notice.text}</p>
        <p className="mt-1 text-[11px] text-muted-foreground/80">{notice.source}</p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Masquer"
        className="absolute right-2 top-2 grid size-7 place-items-center rounded-full text-muted-foreground"
      >
        <X className="size-4" />
      </button>
    </section>
  );
}
