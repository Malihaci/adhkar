export interface SurahMeta {
  number: number;
  name: string;
  frenchName: string;
  numberOfAyahs: number;
}

export interface AyahText {
  n: number;
  arabic: string;
  french: string;
  juz: number;
  page: number;
  hizbQuarter: number;
}

const CDN = "https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir";

export async function fetchSurahList(): Promise<SurahMeta[]> {
  const res = await fetch("https://api.alquran.cloud/v1/surah");
  if (!res.ok) throw new Error("Liste des sourates indisponible");
  const json = await res.json();
  return (json.data as any[]).map((s) => ({
    number: s.number,
    name: s.name.replace(/^سُورَةُ\s*/, ""),
    frenchName: s.englishName,
    numberOfAyahs: s.numberOfAyahs,
  }));
}

export async function fetchSurahText(surah: number): Promise<AyahText[]> {
  const res = await fetch(
    `https://api.alquran.cloud/v1/surah/${surah}/editions/quran-uthmani,fr.hamidullah`,
  );
  if (!res.ok) throw new Error("Sourate indisponible");
  const json = await res.json();
  const [ar, fr] = json.data as any[];
  return (ar.ayahs as any[]).map((a, i) => ({
    n: a.numberInSurah,
    arabic: a.text,
    french: fr?.ayahs?.[i]?.text ?? "",
    juz: a.juz,
    page: a.page,
    hizbQuarter: a.hizbQuarter,
  }));
}

export type TafsirSlug =
  | "ar-tafsir-as-saadi"
  | "ar-tafsir-ibn-kathir"
  | "ar-tafsir-muyassar"
  | "french-mokhtasar"
  | "tadabbur-wa-amal";

/**
 * Association explicite (jamais un "sinon") entre un slug et la clé du
 * cache local `public/tafsir/2/*.json` : un nouveau slug sans entrée ici
 * doit systématiquement passer par le CDN, jamais retomber par accident
 * sur une clé locale d'une autre provenance (bug réel constaté avec
 * "ar-tafsir-muyassar" qui remontait la clé `tadabbur`, à la provenance
 * non confirmée — voir src/lib/etude-content.ts).
 */
const LOCAL_CACHE_KEY: Partial<Record<TafsirSlug, string>> = {
  "ar-tafsir-as-saadi": "saadi",
  "ar-tafsir-ibn-kathir": "ibnKathir",
  "tadabbur-wa-amal": "tadabbur",
};

export async function fetchTafsir(slug: TafsirSlug, surah: number, ayah: number): Promise<string> {
  // Contenu local enrichi (Al-Baqara, Juz' 1) prioritaire, uniquement pour
  // les slugs explicitement mappés ci-dessus.
  const localKey = LOCAL_CACHE_KEY[slug];
  if (surah === 2 && ayah <= 141 && localKey) {
    try {
      const local = await fetch(`/tafsir/2/${ayah}.json`);
      if (local.ok) {
        const d = await local.json();
        if (d?.[localKey]) return d[localKey] as string;
      }
    } catch {
      /* on retombe sur le CDN */
    }
  }
  const res = await fetch(`${CDN}/${slug}/${surah}/${ayah}.json`);
  if (!res.ok) return "";
  const data = await res.json();
  return typeof data?.text === "string" ? data.text : "";
}
