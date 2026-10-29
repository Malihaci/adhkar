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

export const CDN = "https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir";
/** jsDelivr refuse certains fichiers (« Package size exceeded ») : repli sur GitHub. */
export const CDN_FALLBACK = "https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir";

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
  | "ar-tafsir-al-mukhtasar"
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
  for (const base of [CDN, CDN_FALLBACK]) {
    try {
      const res = await fetch(`${base}/${slug}/${surah}/${ayah}.json`);
      if (!res.ok) continue;
      const data = await res.json();
      if (typeof data?.text === "string") return data.text;
    } catch {
      /* essaie la source suivante */
    }
  }
  return "";
}

/**
 * As-Sa'di regroupe souvent plusieurs versets dans un même texte, avec des
 * repères internes `{n}`. Renvoie UNIQUEMENT le passage du verset demandé
 * quand son repère existe ; sinon le texte entier et la plage couverte.
 */
export function sliceSaadiForAyah(
  text: string,
  ayah: number,
): { text: string; isolated: boolean; range: [number, number] | null } {
  const marks = [...text.matchAll(/\{(\d+)\}/g)].map((m) => ({
    n: Number(m[1]),
    at: m.index ?? 0,
    len: m[0].length,
  }));
  if (!marks.length) return { text: text.trim(), isolated: false, range: null };
  const range: [number, number] = [
    Math.min(...marks.map((m) => m.n)),
    Math.max(...marks.map((m) => m.n)),
  ];
  const i = marks.findIndex((m) => m.n === ayah);
  if (i < 0) return { text: text.trim(), isolated: false, range };
  const from = marks[i].at + marks[i].len;
  const to = i + 1 < marks.length ? marks[i + 1].at : text.length;
  const part = text.slice(from, to).trim();
  return part
    ? { text: part, isolated: marks.length > 1, range }
    : { text: text.trim(), isolated: false, range };
}

/** Plage de versets partageant EXACTEMENT le même texte de commentaire (Ibn Kathīr). */
export async function tafsirGroupRange(
  slug: TafsirSlug,
  surah: number,
  ayah: number,
  versesCount: number,
  text: string,
): Promise<[number, number]> {
  let a = ayah;
  let b = ayah;
  for (let k = 0; k < 14 && a > 1; k++) {
    if ((await fetchTafsir(slug, surah, a - 1)) !== text) break;
    a -= 1;
  }
  for (let k = 0; k < 14 && b < versesCount; k++) {
    if ((await fetchTafsir(slug, surah, b + 1)) !== text) break;
    b += 1;
  }
  return [a, b];
}

export interface MokhtasarPassage {
  surah: number;
  from: number;
  to: number;
  lessons: string[];
}

let lessonsPromise: Promise<MokhtasarPassage[]> | null = null;

/** « Quelques enseignements déduits de ces versets » (Mukhtasar français), par passage. */
export function fetchMokhtasarLessons(): Promise<MokhtasarPassage[]> {
  lessonsPromise ??= fetch("/tafsir/mokhtasar-lessons.json")
    .then((r) => (r.ok ? (r.json() as Promise<MokhtasarPassage[]>) : []))
    .catch(() => {
      lessonsPromise = null;
      return [] as MokhtasarPassage[];
    });
  return lessonsPromise;
}
