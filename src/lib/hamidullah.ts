/**
 * Traduction française des sens du Coran — Muhammad Hamidullah.
 * Source vérifiée : QuranEnc (Encyclopedia of the Noble Quran), clé
 * `french_hameedullah`, API publique par ayah. Vérifié manuellement avant
 * intégration (réponse HTTP, contenu, notes de bas de page) — voir l'audit
 * du chantier "Étude d'une ayah".
 *
 * Ne jamais modifier le texte retourné : il doit être affiché tel quel.
 */

const QURANENC_API = "https://quranenc.com/api/v1/translation/aya/french_hameedullah";

export interface HamidullahAyah {
  translation: string;
  /** Notes de bas de page éventuelles — toujours affichées séparément du texte. */
  footnotes: string | null;
}

export interface HamidullahSuraAyah extends HamidullahAyah {
  ayah: number;
  arabic: string;
}

/**
 * Sourate entière en un seul appel (endpoint `sura`, vérifié en direct) —
 * évite un appel par ayah pour la lecture continue française (§27
 * performance : pas de N+1 sur une sourate longue).
 */
export async function fetchHamidullahSura(surah: number): Promise<HamidullahSuraAyah[]> {
  const res = await fetch(`${QURANENC_API.replace("/aya/", "/sura/")}/${surah}`);
  if (!res.ok) return [];
  const json = await res.json();
  const result = Array.isArray(json?.result) ? json.result : [];
  return result.map((r: any) => ({
    ayah: Number(r.aya),
    arabic: typeof r.arabic_text === "string" ? r.arabic_text : "",
    translation: typeof r.translation === "string" ? r.translation : "",
    footnotes: typeof r.footnotes === "string" && r.footnotes ? r.footnotes : null,
  }));
}

export async function fetchHamidullahAyah(
  surah: number,
  ayah: number,
): Promise<HamidullahAyah | null> {
  const res = await fetch(`${QURANENC_API}/${surah}/${ayah}`);
  if (!res.ok) return null;
  const json = await res.json();
  const translation = json?.result?.translation;
  if (typeof translation !== "string" || !translation) return null;
  const footnotes = typeof json?.result?.footnotes === "string" ? json.result.footnotes : null;
  return { translation, footnotes: footnotes || null };
}
