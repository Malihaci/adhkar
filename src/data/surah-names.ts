/** Noms français usuels des 114 sourates (translittération courante). */
export const SURAH_NAMES: string[] = [
  "Al-Fâtiha", "Al-Baqara", "Âl ʿImrân", "An-Nisâ’", "Al-Mâ’ida", "Al-Anʿâm", "Al-Aʿrâf", "Al-Anfâl", "At-Tawba", "Yûnus",
  "Hûd", "Yûsuf", "Ar-Raʿd", "Ibrâhîm", "Al-Hijr", "An-Nahl", "Al-Isrâ’", "Al-Kahf", "Maryam", "Tâ-Hâ",
  "Al-Anbiyâ’", "Al-Hajj", "Al-Mu’minûn", "An-Nûr", "Al-Furqân", "Ash-Shuʿarâ’", "An-Naml", "Al-Qasas", "Al-ʿAnkabût", "Ar-Rûm",
  "Luqmân", "As-Sajda", "Al-Ahzâb", "Saba’", "Fâtir", "Yâ-Sîn", "As-Sâffât", "Sâd", "Az-Zumar", "Ghâfir",
  "Fussilat", "Ash-Shûrâ", "Az-Zukhruf", "Ad-Dukhân", "Al-Jâthiya", "Al-Ahqâf", "Muhammad", "Al-Fath", "Al-Hujurât", "Qâf",
  "Adh-Dhâriyât", "At-Tûr", "An-Najm", "Al-Qamar", "Ar-Rahmân", "Al-Wâqiʿa", "Al-Hadîd", "Al-Mujâdala", "Al-Hashr", "Al-Mumtahana",
  "As-Saff", "Al-Jumuʿa", "Al-Munâfiqûn", "At-Taghâbun", "At-Talâq", "At-Tahrîm", "Al-Mulk", "Al-Qalam", "Al-Hâqqa", "Al-Maʿârij",
  "Nûh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyâma", "Al-Insân", "Al-Mursalât", "An-Naba’", "An-Nâziʿât", "ʿAbasa",
  "At-Takwîr", "Al-Infitâr", "Al-Mutaffifîn", "Al-Inshiqâq", "Al-Burûj", "At-Târiq", "Al-Aʿlâ", "Al-Ghâshiya", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Layl", "Ad-Duhâ", "Ash-Sharh", "At-Tîn", "Al-ʿAlaq", "Al-Qadr", "Al-Bayyina", "Az-Zalzala", "Al-ʿÂdiyât",
  "Al-Qâriʿa", "At-Takâthur", "Al-ʿAsr", "Al-Humaza", "Al-Fîl", "Quraysh", "Al-Mâʿûn", "Al-Kawthar", "Al-Kâfirûn", "An-Nasr",
  "Al-Masad", "Al-Ikhlâs", "Al-Falaq", "An-Nâs",
];

/** « Sourate Al-Baqara · āyah 201 » à partir d'une référence « Coran 2:201 » ou « Coran 2:127-128 ». */
export function quranRefLabel(reference: string): string | null {
  const m = reference.match(/Coran (\d+):(\d+)(?:-(\d+))?/);
  if (!m) return null;
  const name = SURAH_NAMES[Number(m[1]) - 1];
  if (!name) return null;
  return `Sourate ${name} · ${m[1]}:${m[2]}${m[3] ? `-${m[3]}` : ""}`;
}
