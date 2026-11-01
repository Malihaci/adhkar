import { AyahText } from "@/components/AyahText";
import { ISTIADHA, quranDhikrView } from "@/lib/quranDhikr";
import type { Dhikr } from "@/data/adhkar";

/**
 * Texte arabe d'un dhikr. S'il s'agit du Coran : formule de protection avant,
 * numéros de āyāt dans le texte et « Sourate … · āyah … » après — pour voir
 * d'un coup d'œil que ce sont des versets.
 */
export function QuranDhikrText({
  dhikr,
  className,
  showPhonetic = true,
}: {
  dhikr: Dhikr;
  className?: string;
  showPhonetic?: boolean;
}) {
  const view = quranDhikrView(dhikr);
  if (!view) return <AyahText text={dhikr.arabic} className={className} />;
  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-gold/30 bg-gold/5 px-3 py-2 text-center">
        <p lang="ar" dir="rtl" className="font-arabic text-lg leading-[1.9] text-gold">
          {ISTIADHA.ar}
        </p>
        {showPhonetic && <p className="text-[11px] italic text-muted-foreground">{ISTIADHA.ph}</p>}
      </div>
      <AyahText text={view.arabic} className={className} />
      <p className="text-center text-xs font-semibold text-gold">{view.ref}</p>
    </div>
  );
}
