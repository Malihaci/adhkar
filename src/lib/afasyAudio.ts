import type { Dhikr, DhikrCategory } from "@/data/adhkar";

// Récitations authentiques de Cheikh Mishary Rashid Al-Afasy
// Sources publiques hébergées sur archive.org (CORS activé, Range supporté)
// `startOffset` : durée de l'introduction (ambiance, chant du coq, ta'awwudh)
// à sauter pour démarrer directement sur Âyat al-Kursî.
export const AFASY_AUDIO: Record<
  DhikrCategory,
  { src: string; duration: number; startOffset: number }
> = {
  morning: {
    src:
      "https://ia800900.us.archive.org/26/items/sheikh-mishary-rashid-alafasy-azkar/Sheikh%20Mishary%20Rashid%20Alafasy%20-%20%D8%A3%D8%B0%D9%83%D8%A7%D8%B1%20%D8%A7%D9%84%D8%B5%D8%A8%D8%A7%D8%AD.mp3",
    duration: 1408.55,
    startOffset: 41,
  },
  evening: {
    src:
      "https://ia800900.us.archive.org/26/items/sheikh-mishary-rashid-alafasy-azkar/Sheikh%20Mishary%20Rashid%20Alafasy%20-%20%D8%A3%D8%B0%D9%83%D8%A7%D8%B1%20%D8%A7%D9%84%D9%85%D8%B3%D8%A7%D8%A1.mp3",
    duration: 1662.59,
    startOffset: 41,
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
export function buildTimeMap(
  list: Dhikr[],
  duration: number,
  startOffset = 0,
): number[] {
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
  return map.map((t, i) =>
    Math.min(duration - 1, Math.max(i === 0 ? startOffset : 0, t + delta)),
  );
}
