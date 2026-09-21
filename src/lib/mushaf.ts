/**
 * Mushaf de Médine — pagination 604 pages.
 * Source : api.quran.com (v4), audio verset par verset.
 * Aucune dépendance supplémentaire, chargement à la demande (une page à la fois).
 */

const API = "https://api.quran.com/api/v4";

export interface PageVerse {
  key: string; // "32:1"
  surah: number;
  ayah: number;
  arabic: string;
  juz: number;
  hizb: number;
}

export interface Chapter {
  id: number;
  nameArabic: string;
  nameFrench: string;
  versesCount: number;
  pages: [number, number];
  bismillahPre: boolean;
}

export const TOTAL_PAGES = 604;

export const clampPage = (p: number) =>
  Math.min(TOTAL_PAGES, Math.max(1, Math.round(p) || 1));

export async function fetchChapters(): Promise<Chapter[]> {
  const res = await fetch(`${API}/chapters?language=fr`);
  if (!res.ok) throw new Error("Liste des sourates indisponible");
  const json = await res.json();
  return (json.chapters as any[]).map((c) => ({
    id: c.id,
    nameArabic: c.name_arabic,
    nameFrench: c.translated_name?.name ?? c.name_simple,
    versesCount: c.verses_count,
    pages: c.pages as [number, number],
    bismillahPre: !!c.bismillah_pre,
  }));
}

export async function fetchPage(page: number): Promise<PageVerse[]> {
  const res = await fetch(
    `${API}/verses/by_page/${clampPage(page)}?fields=text_uthmani&per_page=50`,
  );
  if (!res.ok) throw new Error("Page indisponible");
  const json = await res.json();
  return (json.verses as any[]).map((v) => {
    const [s, a] = String(v.verse_key).split(":").map(Number);
    return {
      key: v.verse_key as string,
      surah: s,
      ayah: a,
      arabic: (v.text_uthmani as string).trim(),
      juz: v.juz_number as number,
      hizb: v.hizb_number as number,
    };
  });
}

/* ------------------------------------------ Layout réel du Mushaf (15 lignes) */

export interface LayoutWord {
  key: string; // verse_key
  surah: number;
  ayah: number;
  text: string;
  /** marqueur de fin de verset ﴿n﴾ */
  end: boolean;
  /** premier mot du verset */
  first: boolean;
}

export interface MushafLine {
  n: number;
  words: LayoutWord[];
}

export interface PageLayout {
  verses: PageVerse[];
  lines: MushafLine[];
}

/**
 * Page du Mushaf avec les coupures de lignes officielles (KFGQPC / Mushaf de
 * Médine) : chaque mot porte son `line_number` fourni par api.quran.com,
 * on ne recalcule jamais les retours à la ligne.
 */
export async function fetchPageLayout(page: number): Promise<PageLayout> {
  const res = await fetch(
    `${API}/verses/by_page/${clampPage(page)}?words=true&word_fields=text_uthmani,line_number&fields=text_uthmani&per_page=50`,
  );
  if (!res.ok) throw new Error("Page indisponible");
  const json = await res.json();
  const verses: PageVerse[] = [];
  const byLine = new Map<number, LayoutWord[]>();
  for (const v of json.verses as any[]) {
    const [s, a] = String(v.verse_key).split(":").map(Number);
    verses.push({
      key: v.verse_key,
      surah: s,
      ayah: a,
      arabic: (v.text_uthmani ?? "").trim(),
      juz: v.juz_number,
      hizb: v.hizb_number ?? 0,
    });
    const words = (v.words as any[]) ?? [];
    words.forEach((w, i) => {
      const line = Number(w.line_number) || 0;
      if (!line) return;
      const arr = byLine.get(line) ?? [];
      arr.push({
        key: v.verse_key,
        surah: s,
        ayah: a,
        text: w.text_uthmani ?? w.text ?? "",
        end: w.char_type_name === "end",
        first: i === 0,
      });
      byLine.set(line, arr);
    });
  }
  const lines = [...byLine.entries()]
    .sort((x, y) => x[0] - y[0])
    .map(([n, words]) => ({ n, words }));
  return { verses, lines };
}


/** Versets d'une sourate (clés uniquement) pour la lecture continue. */
export async function fetchSurahVerseKeys(surah: number): Promise<string[]> {
  const res = await fetch(
    `${API}/verses/by_chapter/${surah}?fields=text_uthmani&per_page=300`,
  );
  if (!res.ok) throw new Error("Sourate indisponible");
  const json = await res.json();
  return (json.verses as any[]).map((v) => v.verse_key as string);
}

/** Versets d'un juz' (clés uniquement), pagination incluse. */
export async function fetchJuzVerseKeys(juz: number): Promise<string[]> {
  const keys: string[] = [];
  let page = 1;
  for (;;) {
    const res = await fetch(
      `${API}/verses/by_juz/${juz}?per_page=300&page=${page}`,
    );
    if (!res.ok) throw new Error("Juz' indisponible");
    const json = await res.json();
    keys.push(...(json.verses as any[]).map((v) => v.verse_key as string));
    const next = json.pagination?.next_page;
    if (!next) break;
    page = next;
  }
  return keys;
}

/** Versets d'un hizb (clés uniquement), pagination incluse. */
export async function fetchHizbVerseKeys(hizb: number): Promise<string[]> {
  const keys: string[] = [];
  let page = 1;
  for (;;) {
    const res = await fetch(
      `${API}/verses/by_hizb/${hizb}?per_page=300&page=${page}`,
    );
    if (!res.ok) throw new Error("Hizb indisponible");
    const json = await res.json();
    keys.push(...(json.verses as any[]).map((v) => v.verse_key as string));
    const next = json.pagination?.next_page;
    if (!next) break;
    page = next;
  }
  return keys;
}

/**
 * Clés de versets depuis une ayah donnée jusqu'à 114:6,
 * calculées localement à partir du nombre de versets de chaque sourate
 * (aucun préchargement audio).
 */
export function keysToEndOfQuran(
  fromKey: string,
  chapters: Chapter[],
): string[] {
  const [s0, a0] = fromKey.split(":").map(Number);
  const out: string[] = [];
  for (const c of chapters) {
    if (c.id < s0) continue;
    const start = c.id === s0 ? a0 : 1;
    for (let a = start; a <= c.versesCount; a++) out.push(`${c.id}:${a}`);
  }
  return out;
}

/* ---------------------------------------------------------------- Récitateurs */

export interface Reciter {
  id: string;
  name: string;
  /** quran.com : id de récitation ; everyayah : dossier */
  source: "quran" | "everyayah";
  ref: string;
}

/**
 * IDs vérifiés auprès des sources réelles :
 * - quran.com /resources/recitations (ids 6, 7, 9)
 * - everyayah.com (dossier existant pour Yasser Ad-Dussary)
 */
export const RECITERS: Reciter[] = [
  { id: "minshawi", name: "Muhammad Siddîq al-Minshâwî", source: "quran", ref: "9" },
  { id: "husary", name: "Mahmûd Khalîl al-Husarî", source: "quran", ref: "6" },
  {
    id: "dosari",
    name: "Yâsser al-Dossarî",
    source: "everyayah",
    ref: "Yasser_Ad-Dussary_128kbps",
  },
  {
    id: "ghamdi",
    name: "Sa‘d al-Ghâmidî",
    source: "everyayah",
    ref: "Ghamadi_40kbps",
  },
];

export const defaultReciter = RECITERS[0].id;

export function getReciter(id: string | undefined): Reciter {
  return RECITERS.find((r) => r.id === id) ?? RECITERS[0];
}

const pad = (n: number, l: number) => String(n).padStart(l, "0");

const QURAN_CDN_BASE: Record<string, string> = {
  "9": "https://verses.quran.com/Minshawi/Murattal/mp3",
  "6": "https://mirrors.quranicaudio.com/everyayah/Husary_64kbps",
  "7": "https://verses.quran.com/Alafasy/mp3",
};


/** URL du mp3 d'un verset pour le récitateur choisi. */
export function verseAudioUrl(reciterId: string, verseKey: string): string {
  const r = getReciter(reciterId);
  const [s, a] = verseKey.split(":").map(Number);
  const file = `${pad(s, 3)}${pad(a, 3)}.mp3`;
  if (r.source === "everyayah") {
    return `https://everyayah.com/data/${r.ref}/${file}`;
  }
  return `${QURAN_CDN_BASE[r.ref]}/${file}`;
}

/* ------------------------------------------------------ Recherche (V1 arabe) */
/**
 * Recherche plein texte fournie par api.quran.com (tolérante aux harakat :
 * une requête sans voyelles retrouve les mots du texte Uthmani vocalisé).
 * V1 volontairement simple — texte arabe uniquement. Prévu pour être étendu
 * plus tard (traduction, phonétique, thématique) sans changer cette forme.
 */
export interface SearchWord {
  text: string;
  /** mot correspondant à la requête, fourni par l'API (mise en évidence) */
  highlight: boolean;
}

export interface SearchResult {
  key: string; // "2:255"
  surah: number;
  ayah: number;
  /** texte complet du verset (affichage résultat uniquement, jamais le Mushaf) */
  text: string;
  words: SearchWord[];
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
}

export async function searchQuranArabic(
  query: string,
  size = 20,
): Promise<SearchResponse> {
  const res = await fetch(
    `${API}/search?q=${encodeURIComponent(query)}&size=${size}`,
  );
  if (!res.ok) throw new Error("Recherche indisponible");
  const json = await res.json();
  const s = json.search ?? {};
  const results: SearchResult[] = ((s.results as any[]) ?? []).map((r) => {
    const [surah, ayah] = String(r.verse_key).split(":").map(Number);
    return {
      key: r.verse_key as string,
      surah,
      ayah,
      text: (r.text as string) ?? "",
      words: ((r.words as any[]) ?? [])
        .filter((w) => w.char_type === "word")
        .map((w) => ({ text: w.text as string, highlight: !!w.highlight })),
    };
  });
  return { results, totalResults: Number(s.total_results) || results.length };
}

/** Page Mushaf (1-604) contenant un verset donné, pour ouvrir directement le Mushaf. */
export async function fetchVersePage(verseKey: string): Promise<number> {
  const res = await fetch(`${API}/verses/by_key/${verseKey}?fields=page_number`);
  if (!res.ok) throw new Error("Verset introuvable");
  const json = await res.json();
  return clampPage(Number(json.verse?.page_number) || 1);
}

/* ------------------------------------------------- Fallback recherche (fragments) */
/**
 * L'API /search d'api.quran.com fait un matching par mot entier (après
 * dévocalisation), pas par sous-chaîne : un fragment comme "كرسي" (présent
 * uniquement dans "كُرْسِيُّهُ") ne remonte aucun résultat alors que le mot
 * existe bien dans le Coran. Ce fallback ne s'active QUE si la recherche
 * principale ne renvoie rien : il compare une version normalisée (harakat et
 * tatweel retirés, variantes d'alif unifiées) du texte Uthmani complet à une
 * version normalisée de la requête. Le texte affiché reste toujours
 * `text_uthmani` original, jamais la version normalisée.
 */
const SEARCH_DIACRITICS =
  /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED\u0640]/g;
const ALIF_VARIANTS = /[\u0622\u0623\u0625\u0671]/g;

/** Normalisation réservée à la comparaison de recherche — jamais à l'affichage. */
export function normalizeArabicForSearch(text: string): string {
  return text
    .replace(SEARCH_DIACRITICS, "")
    .replace(ALIF_VARIANTS, "ا")
    .replace(/\s+/g, " ")
    .trim();
}

/** Sous 3 caractères normalisés, un fallback par sous-chaîne noierait les résultats. */
export const MIN_FALLBACK_QUERY_LENGTH = 3;

export interface FullVerseText {
  key: string;
  /** text_uthmani original — jamais modifié, utilisé tel quel à l'affichage */
  text: string;
}

/**
 * Texte complet du Coran en un seul appel (endpoint dédié d'api.quran.com,
 * même API que le reste du Mushaf) — pas de boucle sur les 604 pages.
 * À appeler seulement en cas de besoin (recherche principale vide) et à
 * mettre en cache côté appelant (staleTime: Infinity) : un seul
 * téléchargement par session, jamais un par recherche.
 */
export async function fetchFullQuranText(): Promise<FullVerseText[]> {
  const res = await fetch(`${API}/quran/verses/uthmani`);
  if (!res.ok) throw new Error("Texte complet indisponible");
  const json = await res.json();
  return ((json.verses as any[]) ?? []).map((v) => ({
    key: v.verse_key as string,
    text: (v.text_uthmani as string) ?? "",
  }));
}

/** Recherche locale par sous-chaîne sur texte déjà en cache (aucun réseau). */
export function searchQuranFallback(
  rawQuery: string,
  verses: FullVerseText[],
  limit = 20,
): SearchResponse {
  const q = normalizeArabicForSearch(rawQuery);
  if (q.length < MIN_FALLBACK_QUERY_LENGTH) return { results: [], totalResults: 0 };

  const results: SearchResult[] = [];
  let totalResults = 0;
  for (const v of verses) {
    if (!normalizeArabicForSearch(v.text).includes(q)) continue;
    totalResults++;
    if (results.length >= limit) continue;
    const [surah, ayah] = v.key.split(":").map(Number);
    const words: SearchWord[] = v.text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ text: w, highlight: normalizeArabicForSearch(w).includes(q) }));
    results.push({ key: v.key, surah, ayah, text: v.text, words });
  }
  return { results, totalResults };
}
