/**
 * « القرآن تدبر وعمل » (مركز المنهاج) via l'édition `tadabbur-wa-amal`
 * (QUL / Tarteel, ressource 517) du dépôt spa5k/tafsir_api.
 *
 * Le JSON renvoyé pour une āyah contient le texte de TOUTE la page du Mushaf :
 * on ne le traite donc jamais comme « le contenu de cette āyah ». On le parse
 * en points, puis chaque point est rattaché à son āyah par la citation
 * ﴿ ﴾ qu'il contient (comparée au texte coranique de l'application). Un point
 * sans rattachement fiable reste au niveau PAGE et n'est jamais affiché comme
 * spécifique à une āyah.
 *
 * Le texte source n'est jamais modifié : la normalisation ne sert qu'à la
 * comparaison.
 */

import { CDN, CDN_FALLBACK, type AyahText } from "@/lib/quran";

export type TaCategory = "tadabbur" | "amal" | "tawjihat";
export type TaScope = "AYAH" | "RANGE" | "PAGE";

export interface TaItem {
  id: string;
  category: TaCategory;
  /** Numéro tel qu'écrit dans la source (ex. « ٣ »). */
  number: string;
  /** Citation coranique ﴿ ﴾ qui ouvre le point (tadabbur), telle quelle. */
  quote?: string;
  /** Texte exact du point (référence du mufassir incluse). */
  originalText: string;
  /** Référence du mufassir, ex. « ابن جزي: ١/٥٤ » (déjà présente dans le texte). */
  reference?: string;
  /** « السؤال » lié à ce point. */
  question?: string;
  scope: TaScope;
  verseStart?: number;
  verseEnd?: number;
  surah: number;
  page: number;
  sourceTitle: string;
  sourceResourceId: number;
  sourceProvider: string;
  validationStatus: "source_text";
}

export interface TaWordMeaning {
  word: string;
  meaning: string;
}

export interface TaPage {
  items: TaItem[];
  /** Préparé pour une future rubrique « MOTS » (non affichée pour l'instant). */
  wordMeanings: TaWordMeaning[];
}

const SOURCE_TITLE = "القرآن تدبر وعمل";
const PROVIDER = "QUL (Tarteel) · spa5k/tafsir_api";
const RESOURCE_ID = 517;

const HEADERS: Record<string, TaCategory | "words"> = {
  "الوقفات التدبرية": "tadabbur",
  "العمل بالآيات": "amal",
  "التوجيهات": "tawjihat",
  "معاني الكلمات": "words",
};

const toNumber = (s: string) =>
  Number(s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))));

/** Comparaison uniquement : sans voyelles, signes coraniques, chiffres, espaces. */
export function normalizeArabic(s: string): string {
  return s
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭ࣓-ࣿـ‌-‏]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ء/g, "")
    .replace(/[٠-٩0-9۞۩()\[\]﴿﴾{}«»]/g, "")
    .replace(/\s+/g, "");
}

function parsePoints(
  lines: string[],
): { number: string; chunk: string[]; broken: boolean }[] {
  const points: { number: string; chunk: string[]; broken: boolean }[] = [];
  let prev = 0;
  let broken = false;
  for (const line of lines) {
    const m = line.match(/^([٠-٩0-9]+)\s*-\s*(.*)$/);
    if (m) {
      const n = toNumber(m[1]);
      // Numérotation qui ne suit pas 1, 2, 3… : le titre d'une rubrique a pu
      // manquer dans la source → les points suivants sont jugés incertains.
      if (n !== prev + 1) broken = true;
      prev = n;
      points.push({ number: m[1], chunk: [m[2]], broken });
    } else if (points.length) {
      points[points.length - 1].chunk.push(line);
    }
  }
  return points;
}

/** Texte brut d'une page → points séparés par rubrique (sans rattachement). */
export function parseTadabburText(text: string): {
  points: (Omit<TaItem, "scope" | "verseStart" | "verseEnd" | "surah" | "page" | "id"> & {
    uncertain: boolean;
  })[];
  wordMeanings: TaWordMeaning[];
} {
  const lines = text.replace(/\r/g, "").split("\n");
  const sections: { cat: TaCategory | "words"; lines: string[] }[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    const cat = HEADERS[line];
    if (cat) sections.push({ cat, lines: [] });
    else if (sections.length && line) sections[sections.length - 1].lines.push(line);
  }
  const points: ReturnType<typeof parseTadabburText>["points"] = [];
  const wordMeanings: TaWordMeaning[] = [];
  for (const sec of sections) {
    if (sec.cat === "words") {
      for (const l of sec.lines) {
        const m = l.match(/^﴿([^﴾]+)﴾\s*(.*)$/);
        if (m) wordMeanings.push({ word: m[1].trim(), meaning: m[2].trim() });
      }
      continue;
    }
    for (const p of parsePoints(sec.lines)) {
      const paras = p.chunk.map((s) => s.trim()).filter(Boolean);
      const originalText = paras.join("\n");
      let question: string | undefined;
      const qi = paras.findIndex((s) => s.startsWith("السؤال"));
      if (qi >= 0) question = paras.slice(qi).join("\n");
      const bodyParas = qi >= 0 ? paras.slice(0, qi) : paras;
      const first = bodyParas[0] ?? "";
      const quote = sec.cat === "tadabbur" && /^﴿.*﴾$/.test(first) ? first : undefined;
      const body = quote ? bodyParas.slice(1) : bodyParas;
      const ref = body.join(" ").match(/\[([^\[\]]*[:：][^\[\]]*)\]\s*$/);
      points.push({
        category: sec.cat,
        number: p.number,
        quote,
        originalText: body.join("\n") || originalText,
        reference: ref?.[1]?.trim(),
        question,
        sourceTitle: SOURCE_TITLE,
        sourceResourceId: RESOURCE_ID,
        sourceProvider: PROVIDER,
        validationStatus: "source_text",
        uncertain: p.broken,
      });
    }
  }
  return { points, wordMeanings };
}

interface SurahIndex {
  S: string;
  segs: { n: number; start: number; end: number }[];
}

function buildIndex(ayahs: AyahText[], surah: number): SurahIndex {
  let S = "";
  const segs: SurahIndex["segs"] = [];
  const basmala = normalizeArabic("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ");
  for (const a of ayahs) {
    let t = normalizeArabic(a.arabic);
    if (a.n === 1 && surah !== 1 && t.startsWith(basmala)) t = t.slice(basmala.length);
    segs.push({ n: a.n, start: S.length, end: S.length + t.length });
    S += t;
  }
  return { S, segs };
}

/** Citations ﴿ ﴾ d'un point, dans l'ordre le plus pertinent pour la catégorie. */
function quotesOf(p: { category: TaCategory; quote?: string; originalText: string }): string[] {
  if (p.quote) return [p.quote.replace(/^﴿|﴾$/g, "")];
  const all = [...p.originalText.matchAll(/﴿([^﴾]+)﴾/g)].map((m) => m[1]);
  // Amal / Tawjihat : la citation de l'āyah visée termine le point.
  return all.reverse();
}

function matchQuote(
  quote: string,
  idx: SurahIndex,
  pageAyahs: Set<number>,
): [number, number] | null {
  const nq = normalizeArabic(quote);
  if (nq.length < 8) return null;
  const hits: [number, number][] = [];
  let from = 0;
  for (;;) {
    const at = idx.S.indexOf(nq, from);
    if (at < 0) break;
    const end = at + nq.length;
    const covered = idx.segs.filter((s) => s.start < end && s.end > at).map((s) => s.n);
    if (covered.length && covered.some((n) => pageAyahs.has(n))) {
      hits.push([Math.min(...covered), Math.max(...covered)]);
    }
    from = at + 1;
  }
  return hits.length === 1 ? hits[0] : null;
}

/** Rattache chaque point à son āyah ; sinon PAGE (jamais affiché comme spécifique). */
export function attachPoints(
  parsed: ReturnType<typeof parseTadabburText>,
  surah: number,
  page: number,
  ayahs: AyahText[],
): TaPage {
  const idx = buildIndex(ayahs, surah);
  const pageAyahs = new Set(ayahs.filter((a) => a.page === page).map((a) => a.n));
  const counters: Record<string, number> = {};
  const items: TaItem[] = parsed.points.map((p) => {
    const { uncertain, ...rest } = p;
    counters[p.category] = (counters[p.category] ?? 0) + 1;
    let scope: TaScope = "PAGE";
    let range: [number, number] | null = null;
    if (!uncertain) {
      for (const q of quotesOf(p)) {
        range = matchQuote(q, idx, pageAyahs);
        if (range) break;
      }
      if (range) scope = range[0] === range[1] ? "AYAH" : "RANGE";
    }
    return {
      ...rest,
      id: `ta517:${surah}:${page}:${p.category}:${counters[p.category]}`,
      scope,
      verseStart: range?.[0],
      verseEnd: range?.[1],
      surah,
      page,
    };
  });
  return { items, wordMeanings: parsed.wordMeanings };
}

/** Points d'une page qui concernent réellement `ayah` (jamais ceux de portée PAGE). */
export function itemsForAyah(page: TaPage | undefined, category: TaCategory, ayah: number): TaItem[] {
  if (!page) return [];
  return page.items.filter(
    (i) =>
      i.category === category &&
      i.scope !== "PAGE" &&
      i.verseStart != null &&
      i.verseEnd != null &&
      ayah >= i.verseStart &&
      ayah <= i.verseEnd,
  );
}

async function fetchRaw(surah: number, ayah: number): Promise<string> {
  for (const base of [CDN, CDN_FALLBACK]) {
    try {
      const res = await fetch(`${base}/tadabbur-wa-amal/${surah}/${ayah}.json`);
      if (!res.ok) continue;
      const data = await res.json();
      if (typeof data?.text === "string") return data.text;
    } catch {
      /* source suivante */
    }
  }
  return "";
}

const pageCache = new Map<string, Promise<TaPage>>();

/**
 * Page parsée et rattachée, en cache mémoire par (sourate, page du Mushaf) :
 * passer de 2:21 à 2:22 (même page) ne refait ni fetch ni parsing.
 */
export function loadTadabburPage(surah: number, ayah: number, ayahs: AyahText[]): Promise<TaPage> {
  const page = ayahs.find((a) => a.n === ayah)?.page ?? 0;
  const key = `${surah}:${page}`;
  let p = pageCache.get(key);
  if (!p) {
    p = fetchRaw(surah, ayah)
      .then((text) =>
        text ? attachPoints(parseTadabburText(text), surah, page, ayahs) : { items: [], wordMeanings: [] },
      )
      .catch(() => ({ items: [], wordMeanings: [] }));
    pageCache.set(key, p);
    // Échec réseau : ne pas mémoriser une page vide.
    void p.then((r) => {
      if (!r.items.length) pageCache.delete(key);
    });
  }
  return p;
}
