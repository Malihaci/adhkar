/**
 * Contenu affiché sous le Mushaf (ou sous l'arabe, en mode āyah par āyah).
 * Une seule source à la fois, choisie dans les Options. Les textes sont
 * affichés tels quels, sans reformulation :
 *  - Français : Muhammad Hamidullah (QuranEnc) ;
 *  - Phonétique : translittération mot à mot de l'API Quran.com (aucune
 *    source « officielle » ; c'est un repère de lecture, pas un texte savant) ;
 *  - Tafsirs : Al-Mukhtasar (fr / ar), Al-Muyassar, As-Saʿdī (spa5k/tafsir_api).
 */
import { fetchHamidullahAyah } from "@/lib/hamidullah";
import { fetchTafsir, sliceSaadiForAyah, type TafsirSlug } from "@/lib/quran";
import type { BelowSource } from "@/lib/preferences";

export interface BelowSourceInfo {
  id: Exclude<BelowSource, "none">;
  label: string;
  group: "Traduction" | "Phonétique" | "Tafsir";
  /** Texte arabe (sens de lecture droite → gauche). */
  rtl?: boolean;
}

export const BELOW_SOURCES: BelowSourceInfo[] = [
  { id: "fr", label: "Français — Hamidullah", group: "Traduction" },
  { id: "phonetic", label: "Phonétique (translittération)", group: "Phonétique" },
  { id: "mukhtasar-fr", label: "Tafsir al-Mukhtasar (français)", group: "Tafsir" },
  { id: "muyassar", label: "Tafsir al-Muyassar (arabe)", group: "Tafsir", rtl: true },
  { id: "mukhtasar-ar", label: "Tafsir al-Mukhtasar (arabe)", group: "Tafsir", rtl: true },
  { id: "saadi", label: "Tafsir as-Saʿdī (arabe)", group: "Tafsir", rtl: true },
];

export function belowSourceInfo(id: BelowSource | undefined): BelowSourceInfo | undefined {
  return BELOW_SOURCES.find((s) => s.id === id);
}

const TAFSIR_SLUG: Partial<Record<BelowSource, TafsirSlug>> = {
  "mukhtasar-fr": "french-mokhtasar",
  muyassar: "ar-tafsir-muyassar",
  "mukhtasar-ar": "ar-tafsir-al-mukhtasar",
  saadi: "ar-tafsir-as-saadi",
};

async function fetchPhonetic(surah: number, ayah: number): Promise<string> {
  const res = await fetch(
    `https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?words=true&word_fields=transliteration`,
  );
  if (!res.ok) return "";
  const json = await res.json();
  const words: { char_type_name?: string; transliteration?: { text?: string | null } }[] =
    json?.verse?.words ?? [];
  return words
    .filter((w) => w.char_type_name === "word" && w.transliteration?.text)
    .map((w) => w.transliteration!.text!)
    .join(" ");
}

/** Texte de l'āyah pour la source choisie ; chaîne vide si indisponible. */
export async function fetchBelowText(
  source: BelowSource,
  surah: number,
  ayah: number,
): Promise<string> {
  if (source === "none") return "";
  if (source === "fr") return (await fetchHamidullahAyah(surah, ayah))?.translation ?? "";
  if (source === "phonetic") return fetchPhonetic(surah, ayah);
  const slug = TAFSIR_SLUG[source];
  if (!slug) return "";
  const raw = await fetchTafsir(slug, surah, ayah);
  if (!raw) return "";
  return source === "saadi" ? sliceSaadiForAyah(raw, ayah).text : raw.trim();
}
