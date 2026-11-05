/**
 * Index unique des adhkār (occasions + livre « Al-Adhkâr wa-l-Âdâb ») :
 *  - recherche en français ET en arabe (voyelles/signes ignorés) ;
 *  - regroupements « Maison » et « Prière » (occasions + chapitres du livre) ;
 *  - « liste naturelle » d'un dhikr, pour enchaîner sur le suivant sans sortir.
 */
import type { Dhikr } from "@/data/adhkar";
import { ALL_ADHKAR, apresPriereAdhkar, sortieAdhkar } from "@/data/adhkar-occasions";
import { LIVRE_THEMES } from "@/data/adhkar-livre-2";
import { livreAll } from "@/data/livre-book";

/** Minuscules, sans accents latins ; arabe sans voyelles/tatwīl, alif et yā' unifiés. */
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ـً-ٰٟۖ-ۭ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

export interface AdhkarGroup {
  id: string;
  label: string;
  ar: string;
  list: Dhikr[];
}

/** Sans doublon : un même texte arabe n'apparaît qu'une fois (occasion d'abord). */
function dedupe(list: Dhikr[]): Dhikr[] {
  const seen = new Set<string>();
  return list.filter((d) => {
    const k = normalizeText(d.arabic);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const livreTheme = (t: string) => livreAll.filter((d) => d.theme === t);

export const ADHKAR_GROUPS: AdhkarGroup[] = [
  {
    id: "maison",
    label: "Maison",
    ar: "البيت",
    // Sortir de la maison + entrer chez soi + vêtement (chapitres du livre).
    list: dedupe([...sortieAdhkar, ...livreTheme("maison")]),
  },
  {
    id: "priere",
    label: "Prière",
    ar: "الصلاة",
    // Ablutions → appel, mosquée, dans la prière → après la prière.
    list: dedupe([...livreTheme("purification"), ...livreTheme("priere"), ...apresPriereAdhkar]),
  },
];

/** Thèmes du livre déjà absorbés dans un regroupement (pas répétés dans la grille). */
export const GROUPED_THEMES = new Set(["maison", "priere", "purification"]);

export const groupById = (id: string | undefined) => ADHKAR_GROUPS.find((g) => g.id === id);

/** Tout ce qui est cherchable, sans doublon d'id. */
const SEARCHABLE: Dhikr[] = (() => {
  const seen = new Set<string>();
  return [...ALL_ADHKAR, ...livreAll].filter((d) => {
    if (seen.has(d.id)) return false;
    seen.add(d.id);
    return true;
  });
})();

const haystack = new Map<string, string>(
  SEARCHABLE.map((d) => [
    d.id,
    normalizeText(
      [d.title, d.titleAr, d.arabic, d.translation, d.phonetic, d.reference, d.context]
        .filter(Boolean)
        .join(" "),
    ),
  ]),
);

export function searchAdhkar(query: string, limit = 60): Dhikr[] {
  const q = normalizeText(query);
  if (!q) return [];
  const words = q.split(" ");
  const out: Dhikr[] = [];
  const seenText = new Set<string>();
  for (const d of SEARCHABLE) {
    const h = haystack.get(d.id) ?? "";
    if (!words.every((w) => h.includes(w))) continue;
    const k = normalizeText(d.arabic);
    if (seenText.has(k)) continue;
    seenText.add(k);
    out.push(d);
    if (out.length >= limit) break;
  }
  return out;
}

export function findDhikr(id: string | undefined): Dhikr | undefined {
  return id ? SEARCHABLE.find((d) => d.id === id) : undefined;
}

/** Liste dans laquelle on continue après ce dhikr (suivant / précédent). */
export function naturalList(d: Dhikr): { list: Dhikr[]; label: string } {
  if (d.id.startsWith("livre-") && d.theme) {
    const g = ADHKAR_GROUPS.find((x) => x.list.some((y) => y.id === d.id));
    if (g) return { list: g.list, label: g.label };
    const th = LIVRE_THEMES.find((t) => t.theme === d.theme);
    return { list: livreTheme(d.theme), label: th?.label ?? "Adhkār et ādāb" };
  }
  const g = ADHKAR_GROUPS.find((x) => x.list.some((y) => y.id === d.id));
  if (g) return { list: g.list, label: g.label };
  return { list: ALL_ADHKAR.filter((x) => x.category === d.category), label: "Adhkār" };
}
