import { SURAH_NAMES } from "@/data/surah-names";
import type { Dhikr } from "@/data/adhkar";

const DIGITS = "٠١٢٣٤٥٦٧٨٩";
const toArabicDigits = (n: number) => String(n).replace(/\d/g, (d) => DIGITS[Number(d)]);
const marker = (n: number) => `﴿${toArabicDigits(n)}﴾`;

/** Un dhikr est coranique s'il porte des `verseKeys` (les duʿāʾ du Coran ont leur propre affichage). */
export function isQuranDhikr(d: Dhikr): boolean {
  return !!d.verseKeys?.length && d.category !== "dua_coran";
}

/**
 * Affichage d'un dhikr coranique : numéro de āyah (﴿٢٥٥﴾) à la fin de chaque verset
 * et référence « Sourate … · āyah … ». Ne modifie jamais `dhikr.arabic` (le minutage
 * audio en dépend) ; sans découpage fiable en versets, seule la référence est ajoutée.
 */
export function quranDhikrView(d: Dhikr): { arabic: string; ref: string } | null {
  const keys = d.verseKeys ?? [];
  if (!keys.length || d.category === "dua_coran") return null;
  const parsed = keys.map((k) => k.split(":").map(Number) as [number, number]);
  const [sura, first] = parsed[0];
  const last = parsed[parsed.length - 1][1];
  const name = SURAH_NAMES[sura - 1];
  if (!name || parsed.some(([s]) => s !== sura)) return null;

  const text = d.arabic.trim();
  let parts: string[] | null = null;
  if (keys.length === 1) parts = [text];
  else if (text.includes("•")) parts = text.split("•");
  else parts = text.split(/\.\s+/);
  const numbered =
    parts && parts.length === keys.length && !text.includes("...") && !text.includes("…")
      ? parts.map((p, i) => `${p.trim().replace(/[.\s]+$/, "")} ${marker(parsed[i][1])}`).join(" ")
      : text;

  const ref =
    keys.length === 1
      ? `Sourate ${name} · āyah ${first}`
      : first === 1
        ? `Sourate ${name} · ${keys.length} āyāt`
        : `Sourate ${name} · āyāt ${first}–${last}`;
  return { arabic: numbered, ref };
}
