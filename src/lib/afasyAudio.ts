import type { Dhikr } from "@/data/adhkar";
import { AFASY_CUES, type AfasyCue } from "@/data/afasy-cues";
import { MATIN_2_CUES, SOIR_2_CUES, SOIR_3_CUES } from "@/data/recitation-cues";

// Récitations authentiques de Cheikh Mishary Rashid Al-Afasy
// Sources publiques hébergées sur archive.org (CORS activé, Range supporté)
// `startOffset` : durée de l'introduction (chant du coq, oiseaux) à sauter pour
// démarrer EXACTEMENT sur « A'ûdhu billâhi mina-sh-shaytâni-r-rajîm » (mesuré sur
// l'enveloppe audio : silence/ambiance jusqu'à ~7,0 s (matin) et ~10,0 s (soir),
// début de la voix à ~7,3 s et ~10,2 s).
// Uniquement matin/soir — moteur audio non étendu aux nouvelles catégories
// (coucher/sortie/voyage) dans ce chantier.
export const AFASY_AUDIO: Record<
  "morning" | "evening",
  { src: string; duration: number; startOffset: number }
> = {
  morning: {
    src: "https://ia800900.us.archive.org/26/items/sheikh-mishary-rashid-alafasy-azkar/Sheikh%20Mishary%20Rashid%20Alafasy%20-%20%D8%A3%D8%B0%D9%83%D8%A7%D8%B1%20%D8%A7%D9%84%D8%B5%D8%A8%D8%A7%D8%AD.mp3",
    duration: 1408.55,
    startOffset: 7.15,
  },
  evening: {
    src: "https://ia800900.us.archive.org/26/items/sheikh-mishary-rashid-alafasy-azkar/Sheikh%20Mishary%20Rashid%20Alafasy%20-%20%D8%A3%D8%B0%D9%83%D8%A7%D8%B1%20%D8%A7%D9%84%D9%85%D8%B3%D8%A7%D8%A1.mp3",
    duration: 1662.59,
    startOffset: 10.1,
  },
};

export const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;

// Poids d'un dhikr dans la piste continue : longueur du texte pondérée par
// la racine du nombre de répétitions (dhikr courts x100 durent plus longtemps).
function weight(d: Dhikr): number {
  const len = d.arabic.length;
  const r = Math.max(1, d.repetitions);
  return len * Math.pow(r, 0.55);
}

/**
 * Estime le timestamp de début (en secondes) de chaque dhikr dans la piste
 * continue d'Al-Afasy, en ignorant l'introduction (`startOffset`) et en
 * distribuant le reste proportionnellement à la longueur pondérée.
 */
export function buildTimeMap(list: Dhikr[], duration: number, startOffset = 0): number[] {
  const usable = Math.max(1, duration - startOffset);
  const weights = list.map(weight);
  const total = weights.reduce((a, b) => a + b, 0);
  const starts: number[] = [];
  let acc = 0;
  for (const w of weights) {
    starts.push(startOffset + (acc / total) * usable);
    acc += w;
  }
  return starts;
}

/**
 * Recale la carte des temps à partir d'une ancre : l'utilisateur indique que
 * le dhikr `index` commence réellement à `time`. On décale l'ensemble en
 * conservant les durées relatives, sans jamais passer avant l'intro.
 */
export function calibrateTimeMap(
  map: number[],
  index: number,
  time: number,
  duration: number,
  startOffset = 0,
): number[] {
  const anchor = map[index];
  if (anchor === undefined) return map;
  const delta = time - anchor;
  return map.map((t, i) => Math.min(duration - 1, Math.max(i === 0 ? startOffset : 0, t + delta)));
}

export interface Voice {
  id: string;
  label: string;
  src: string;
  duration: number;
  startOffset: number;
  cues: AfasyCue[];
}

/** Voix disponibles pour « Écouter » (la première est la voix par défaut). */
export const VOICES: Record<"morning" | "evening", Voice[]> = {
  morning: [
    { id: "afasy", label: "Cheikh Al-ʿAfâsy", ...AFASY_AUDIO.morning, cues: AFASY_CUES.morning },
    { id: "matin-2", label: "Récitation 2", src: "/audio/recitations/matin-2.mp3", duration: 937.6, startOffset: 0, cues: MATIN_2_CUES },
  ],
  evening: [
    { id: "afasy", label: "Cheikh Al-ʿAfâsy", ...AFASY_AUDIO.evening, cues: AFASY_CUES.evening },
    { id: "soir-2", label: "Récitation 2", src: "/audio/recitations/soir-2.m4a", duration: 1163.7, startOffset: 0, cues: SOIR_2_CUES },
    { id: "soir-3", label: "Récitation 3", src: "/audio/recitations/soir-3.mp3", duration: 1322.7, startOffset: 0, cues: SOIR_3_CUES },
  ],
};
