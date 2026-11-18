import { hijriParts } from "@/lib/dateFr";

/**
 * Jours où le jeûne surérogatoire est recommandé (date hijri Umm al-Qurā du
 * système, qui peut différer d'un jour de l'observation locale de la lune).
 * Jamais proposé : Ramadan (déjà jeûné), 1er Chawwāl, 10 à 13 Dhou al-hijja.
 */
export type FastKind = "blancs" | "arafa" | "achoura" | "lundi-jeudi";

export interface FastInfo {
  kind: FastKind;
  title: string;
  /** Texte court (traduction approchée, à relire). */
  text: string;
  source: string;
  /** Priorité d'affichage : plus grand = plus important. */
  rank: number;
  /** Nombre de jours d'annonce à l'avance (0 = veille et jour même seulement). */
  ahead: number;
}

const INFOS: Record<FastKind, Omit<FastInfo, "kind">> = {
  blancs: {
    title: "Jours blancs",
    text: "Jeûner trois jours par mois : les 13, 14 et 15 du mois hijri.",
    source: "At-Tirmidhī 761 · An-Nasāʾī 2424",
    rank: 3,
    ahead: 3,
  },
  arafa: {
    title: "Jour de ʿArafa",
    text: "Jeûner ce jour efface les péchés de l'année passée et de l'année à venir (hors pèlerins).",
    source: "Muslim 1162",
    rank: 5,
    ahead: 3,
  },
  achoura: {
    title: "ʿĀchoūrāʾ",
    text: "Jeûner le 10 Mouharram efface les péchés de l'année passée ; il est recommandé de jeûner aussi le 9.",
    source: "Muslim 1162 · Muslim 1134",
    rank: 5,
    ahead: 3,
  },
  "lundi-jeudi": {
    title: "Lundi et jeudi",
    text: "Les actes sont présentés à Allah le lundi et le jeudi : le Prophète ﷺ aimait être en train de jeûner.",
    source: "At-Tirmidhī 747",
    rank: 1,
    ahead: 0,
  },
};

function fastKindOn(date: Date): FastKind | null {
  const h = hijriParts(date);
  if (!h) return null;
  const { day, month } = h;
  if (month === 9) return null; // Ramadan : déjà jeûné
  if (month === 10 && day === 1) return null; // ʿĪd al-fitr
  if (month === 12 && day >= 10 && day <= 13) return null; // ʿĪd + tashrīq
  if (month === 12 && day === 9) return "arafa";
  if (month === 1 && (day === 9 || day === 10)) return "achoura";
  if (day >= 13 && day <= 15) return "blancs";
  const wd = date.getDay();
  if (wd === 1 || wd === 4) return "lundi-jeudi";
  return null;
}

export interface FastNotice extends FastInfo {
  /** 0 = aujourd'hui, 1 = demain, 2-3 = dans quelques jours. */
  inDays: number;
  /** Clé stable pour masquer l'annonce du jour. */
  key: string;
}

/** Annonce la plus pertinente : aujourd'hui, demain, ou dans quelques jours. */
export function fastNotice(now: Date): FastNotice | null {
  let best: FastNotice | null = null;
  for (let off = 0; off <= 3; off++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + off, 12);
    const kind = fastKindOn(d);
    if (!kind) continue;
    const info = INFOS[kind];
    if (off > Math.max(1, info.ahead)) continue;
    // Priorité : le plus proche d'abord, puis le plus important.
    if (!best || off < best.inDays || (off === best.inDays && info.rank > best.rank)) {
      best = { kind, ...info, inDays: off, key: `${kind}:${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` };
    }
    if (off <= 1 && best) break;
  }
  return best;
}
