import { AyahText } from "@/components/AyahText";
import { quranDhikrView } from "@/lib/quranDhikr";
import type { Dhikr } from "@/data/adhkar";

/**
 * Texte arabe d'un dhikr. S'il s'agit du Coran : numéros de āyāt dans le texte
 * et « Sourate … · āyah … » après — pour voir d'un coup d'œil que ce sont des versets.
 */
export function QuranDhikrText({
  dhikr,
  className,
}: {
  dhikr: Dhikr;
  className?: string;
}) {
  const view = quranDhikrView(dhikr);
  if (!view) return <AyahText text={dhikr.arabic} className={className} />;
  return (
    <div className="space-y-2">
      <AyahText text={view.arabic} className={className} />
      <p className="text-center text-xs font-semibold text-gold">{view.ref}</p>
    </div>
  );
}
