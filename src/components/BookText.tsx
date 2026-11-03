import { cn } from "@/lib/utils";

const DIGITS = "٠١٢٣٤٥٦٧٨٩";
const arDigits = (n: string) => n.replace(/\d/g, (d) => DIGITS[Number(d)]);

/**
 * Texte arabe « comme dans le livre » : récit en texte normal, formule en couleur
 * ({{…}}), renvois <n> en exposant et notes de bas de page numérotées.
 */
export function BookText({ text, notes, className }: { text: string; notes?: string[]; className?: string }) {
  const parts = text.split(/(\{\{[\s\S]*?\}\}|<\d+>)/g).filter(Boolean);
  return (
    <div lang="ar" dir="rtl" className="font-arabic text-foreground">
      <p className={cn("whitespace-pre-line leading-[2.3]", className)}>
        {parts.map((p, i) => {
          if (p.startsWith("{{")) {
            return (
              <span key={i} className="font-bold text-gold">
                {p.slice(2, -2).replace(/<(\d+)>/g, (_, n) => `(${arDigits(n)})`)}
              </span>
            );
          }
          const m = p.match(/^<(\d+)>$/);
          if (m) return <sup key={i} className="mx-0.5 text-[0.6em] text-muted-foreground">({arDigits(m[1])})</sup>;
          return <span key={i}>{p}</span>;
        })}
      </p>
      {notes && notes.length > 0 && (
        <ol className="mt-3 space-y-1 border-t border-border pt-2 text-sm leading-relaxed text-muted-foreground">
          {notes.map((n, i) => (
            <li key={i}>
              ({arDigits(String(i + 1))}) {n}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
