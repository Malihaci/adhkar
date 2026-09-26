import type { Dhikr, DhikrCategory } from "@/data/adhkar";

/**
 * Partage d'un dhikr — contenu STRICTEMENT limité à ce qui est déjà validé
 * dans la donnée (jamais de mérite/hadith/répétition ajoutés ici). Réutilisé
 * par toutes les catégories d'Adhkār (matin/soir + occasions), pas seulement
 * matin/soir.
 */
const CATEGORY_ROUTE: Record<DhikrCategory, string> = {
  morning: "/matin",
  evening: "/soir",
  reveil: "/reveil",
  coucher: "/coucher",
  apres_priere: "/apres-priere",
  sortie: "/sortie",
  voyage: "/voyage",
};

export function buildDhikrShareText(dhikr: Dhikr, index?: number): string {
  const lines = [dhikr.arabic, "", dhikr.translation];
  if (dhikr.reference) lines.push("", dhikr.reference);
  if (typeof window !== "undefined") {
    const route = CATEGORY_ROUTE[dhikr.category];
    if (route) {
      const url = new URL(route, window.location.origin);
      if (typeof index === "number") url.searchParams.set("i", String(index));
      lines.push("", url.toString());
    }
  }
  return lines.join("\n");
}

export async function shareDhikr(
  dhikr: Dhikr,
  index?: number,
): Promise<"shared" | "copied" | "failed"> {
  const text = buildDhikrShareText(dhikr, index);
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ text, title: dhikr.title });
      return "shared";
    } catch {
      return "failed";
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
