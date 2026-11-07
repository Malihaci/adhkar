import { TAJWEED_COLORS, TAJWEED_LEGEND } from "@/lib/mushaf";
import { cn } from "@/lib/utils";

/** Noms arabes des règles, comme dans la légende du Mushaf imprimé. */
const AR: Record<string, string> = {
  ghunnah: "غنة",
  idgham_ghunnah: "إدغام بغنة",
  idgham_wo_ghunnah: "إدغام بلا غنة",
  ikhafa: "إخفاء",
  qalaqah: "قلقلة",
  madda_necessary: "مد لازم",
  madda_permissible: "مد جائز",
  ham_wasl: "همزة وصل",
};

/**
 * Légende du tajwīd, compacte (2 rangées) : un trait de couleur + le nom
 * arabe de la règle, lue de droite à gauche comme sous la page imprimée.
 */
export function TajweedLegend({ className }: { className?: string }) {
  return (
    <div
      dir="rtl"
      lang="ar"
      className={cn(
        "grid grid-cols-4 gap-x-1 gap-y-2 border-y-[3px] border-double border-gold/70 bg-card/50 px-2 py-2",
        className,
      )}
    >
      {TAJWEED_LEGEND.map((item) => (
        <div key={item.rule} className="flex flex-col items-center gap-1 text-center">
          <span
            className="h-[5px] w-7 rounded-full"
            style={{ backgroundColor: TAJWEED_COLORS[item.rule] }}
            aria-hidden
          />
          <span className="font-arabic text-[12px] font-bold leading-tight text-[#140d05] dark:text-[#fbf5e6]">
            {AR[item.rule] ?? item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
