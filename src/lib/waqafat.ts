/**
 * Analyse du texte arabe de « القرآن تدبر وعمل » en cartes exploitables.
 * 100 % local et instantané : aucun appel IA.
 */

export interface WaqfaCard {
  verse: string | null;
  body: string;
  source: string | null;
  question: string | null;
}

export interface WordMeaning {
  word: string;
  meaning: string;
}

export interface ParsedWaqafat {
  waqafat: WaqfaCard[];
  tawjihat: string[];
  amal: string[];
  words: WordMeaning[];
}

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function splitItems(block: string): string[] {
  if (!block.trim()) return [];
  const parts = block
    .split(new RegExp(`(?:^|\\n)\\s*[${AR_DIGITS}0-9]+\\s*[-–.]\\s*`))
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [block.trim()];
}

function sectionBetween(text: string, start: string, ends: string[]): string {
  const i = text.indexOf(start);
  if (i < 0) return "";
  const from = i + start.length;
  let to = text.length;
  for (const e of ends) {
    const j = text.indexOf(e, from);
    if (j > -1 && j < to) to = j;
  }
  return text.slice(from, to);
}

export function parseWaqafat(text: string): ParsedWaqafat {
  if (!text) return { waqafat: [], tawjihat: [], amal: [], words: [] };

  const H_W = "الوقفات التدبرية";
  const H_T = "التوجيهات";
  const H_A = "العمل بالآيات";
  const H_M = "معاني الكلمات";

  const wBlock = text.includes(H_W)
    ? sectionBetween(text, H_W, [H_T, H_A, H_M])
    : sectionBetween(text, "", [H_T, H_A, H_M]) || text;

  const waqafat: WaqfaCard[] = splitItems(wBlock).map((raw) => {
    const verseMatch = raw.match(/﴿([\s\S]*?)﴾/);
    const questionMatch = raw.match(/السؤال\s*:\s*([\s\S]*)/);
    const sourceMatch = raw.match(/\[([^\]]+)\]/);
    let body = raw;
    if (verseMatch) body = body.replace(verseMatch[0], "");
    if (questionMatch) body = body.replace(questionMatch[0], "");
    if (sourceMatch) body = body.replace(sourceMatch[0], "");
    return {
      verse: verseMatch ? verseMatch[1].trim() : null,
      body: body.replace(/\n{2,}/g, "\n").trim(),
      source: sourceMatch ? sourceMatch[1].trim() : null,
      question: questionMatch ? questionMatch[1].trim() : null,
    };
  });

  const tawjihat = splitItems(sectionBetween(text, H_T, [H_A, H_M]));
  const amal = splitItems(sectionBetween(text, H_A, [H_M]));

  const wordsBlock = sectionBetween(text, H_M, []);
  const words: WordMeaning[] = [];
  const re = /﴿([^﴾]+)﴾\s*([^\n﴿]*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(wordsBlock))) {
    const meaning = m[2].trim().replace(/^[:：\s]+/, "");
    if (m[1].trim()) words.push({ word: m[1].trim(), meaning });
  }

  return { waqafat, tawjihat, amal, words };
}

/** Résumé court : premières phrases d'un texte. */
export function summarize(text: string, sentences = 3): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  const parts = clean.split(/(?<=[.!?؟])\s+/);
  return parts.slice(0, sentences).join(" ");
}

const AR_NORM = /[\u064B-\u0652\u0670\u0653-\u0658\u0640]/g;

export function normalizeAr(s: string): string {
  return s
    .replace(AR_NORM, "")
    .replace(/[ٱأإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\u0600-\u06FF\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface SimilarAyah {
  n: number;
  arabic: string;
  shared: string;
}

/**
 * Moutachabihât : versets de la sourate partageant une suite d'au moins
 * `minWords` mots avec le verset courant.
 */
export function findMutashabihat(
  current: { n: number; arabic: string },
  all: { n: number; arabic: string }[],
  minWords = 4,
): SimilarAyah[] {
  const cur = normalizeAr(current.arabic).split(" ").filter(Boolean);
  if (cur.length < minWords) return [];
  const grams = new Set<string>();
  for (let i = 0; i + minWords <= cur.length; i++)
    grams.add(cur.slice(i, i + minWords).join(" "));

  const out: SimilarAyah[] = [];
  for (const a of all) {
    if (a.n === current.n) continue;
    const words = normalizeAr(a.arabic).split(" ").filter(Boolean);
    let best = "";
    for (let i = 0; i + minWords <= words.length; i++) {
      const g = words.slice(i, i + minWords).join(" ");
      if (grams.has(g) && g.length > best.length) best = g;
    }
    if (best) out.push({ n: a.n, arabic: a.arabic, shared: best });
    if (out.length >= 12) break;
  }
  return out;
}

/** Découpe un verset en mots en marquant ceux communs avec un autre verset. */
export function diffWords(
  a: string,
  b: string,
): { word: string; same: boolean }[] {
  const setB = new Set(normalizeAr(b).split(" ").filter(Boolean));
  return a
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => ({ word: w, same: setB.has(normalizeAr(w)) }));
}
