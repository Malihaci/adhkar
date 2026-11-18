/** Dates de l'accueil, écrites en français : grégorienne et hijri. */

const HIJRI_MONTHS = [
  "Mouharram",
  "Safar",
  "Rabiʿ al-awwal",
  "Rabiʿ ath-thani",
  "Joumada al-oula",
  "Joumada ath-thania",
  "Rajab",
  "Chaʿbān",
  "Ramadan",
  "Chawwāl",
  "Dhou al-qaʿda",
  "Dhou al-hijja",
];

/** « Vendredi 13 novembre 2026 » */
export function gregorianFr(d: Date): string {
  const s = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** « 3 Joumada ath-thania 1448 » (calendrier Umm al-Qurā du système ; peut
 * différer d'un jour selon l'observation de la lune). Vide si indisponible. */
export function hijriFr(d: Date): string {
  try {
    const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).formatToParts(d);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    const day = get("day");
    const month = get("month");
    const year = get("year") || get("relatedYear");
    if (!day || !month || !year || month < 1 || month > 12) return "";
    return `${day} ${HIJRI_MONTHS[month - 1]} ${year}`;
  } catch {
    return "";
  }
}

/** Jour, mois (1-12) et année hijri (Umm al-Qurā du système) ; null si indisponible. */
export function hijriParts(d: Date): { day: number; month: number; year: number } | null {
  try {
    const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).formatToParts(d);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    const day = get("day");
    const month = get("month");
    const year = get("year") || get("relatedYear");
    if (!day || !month || !year || month < 1 || month > 12) return null;
    return { day, month, year };
  } catch {
    return null;
  }
}
