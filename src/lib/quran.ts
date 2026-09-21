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
  | "french-mokhtasar"
  | "tadabbur-wa-amal";

export async function fetchTafsir(
  slug: TafsirSlug,
  surah: number,
  ayah: number,
): Promise<string> {
  // Contenu local enrichi (Al-Baqara, Juz' 1) prioritaire
  if (surah === 2 && ayah <= 141 && slug !== "french-mokhtasar") {
    try {
      const local = await fetch(`/tafsir/2/${ayah}.json`);
      if (local.ok) {
        const d = await local.json();
        const key =
          slug === "ar-tafsir-as-saadi"
            ? "saadi"
            : slug === "ar-tafsir-ibn-kathir"
              ? "ibnKathir"
              : "tadabbur";
        if (d?.[key]) return d[key] as string;
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
