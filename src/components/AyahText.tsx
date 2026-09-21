import { cn } from "@/lib/utils";

const DIACRITICS = /[\u064B-\u0652\u0670\u0653-\u0658\u0640]/;

/**
 * Sépare la basmala du début d'un texte coranique.
 * Retourne { basmala, rest } — basmala est null si absente.
 */
export function splitBasmala(text: string): {
  basmala: string | null;
  rest: string;
} {
  if (!text) return { basmala: null, rest: "" };
  const idxMap: number[] = [];
  let norm = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (DIACRITICS.test(ch)) continue;
    norm += ch === "ٱ" ? "ا" : ch;
    idxMap.push(i);
  }
  if (!norm.trimStart().startsWith("بسم")) return { basmala: null, rest: text };
  const at = norm.indexOf("الرحيم");
  if (at < 0 || at > 40) return { basmala: null, rest: text };
  let end = idxMap[at + 5] + 1;
  // inclure les diacritiques finaux + ponctuation
  while (end < text.length && (DIACRITICS.test(text[end]) || /[.،\s]/.test(text[end])))
    end++;
  return { basmala: text.slice(0, end).trim(), rest: text.slice(end).trim() };
}

export function Basmala({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("my-1 flex items-center justify-center gap-3", className)}>
      <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--gold)_60%,transparent))]" />
      <span
        lang="ar"
        dir="rtl"
        className="font-arabic text-center text-[1.1rem] font-normal leading-[1.9] text-gold sm:text-[1.25rem]"
      >
        {text}
      </span>
      <span className="h-px flex-1 bg-[linear-gradient(270deg,transparent,color-mix(in_oklab,var(--gold)_60%,transparent))]" />
    </div>
  );
}

/**
 * Texte arabe coranique : versets en gras, basmala dans un format distinct.
 */
export function AyahText({
  text,
  className,
  align = "right",
  children,
}: {
  text: string;
  className?: string;
  align?: "right" | "center";
  children?: React.ReactNode;
}) {
  const { basmala, rest } = splitBasmala(text);
  return (
    <div className="space-y-2">
      {basmala && <Basmala text={basmala} />}
      <p
        lang="ar"
        dir="rtl"
        className={cn(
          "font-arabic font-bold text-foreground",
          align === "center" ? "text-center" : "text-right",
          className,
        )}
      >
        {rest || basmala}
        {children}
      </p>
    </div>
  );
}
