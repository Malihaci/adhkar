// Contrôle déterministe du contenu religieux (§36 "CONTENU RELIGIEUX"),
// importé directement depuis les fichiers de données réels (Node 24,
// type-stripping natif). Ne corrige jamais un contenu — signale seulement.
import { AL_FATIHA_CONTENT } from "../src/data/al-fatiha-content.ts";
import { AL_BAQARA_CONTENT } from "../src/data/al-baqara-content.ts";

const ALL = [...AL_FATIHA_CONTENT, ...AL_BAQARA_CONTENT];
const CATEGORIES = new Set(["tadabbur", "amal", "tawjihat", "asbab_nuzul"]);
const SCOPES = new Set(["verse", "verse_range", "passage", "page", "surah"]);

let issues = 0;
const flag = (item, msg) => {
  issues++;
  console.error(`ANOMALIE [${item.id}]: ${msg}`);
};

const seenIds = new Set();
const verseKeyRe = /^\d{1,3}:\d{1,3}$/;

for (const item of ALL) {
  if (seenIds.has(item.id)) flag(item, "id dupliqué");
  seenIds.add(item.id);

  if (!item.textAr || !item.textAr.trim()) flag(item, "textAr vide");
  if (!CATEGORIES.has(item.category)) flag(item, `catégorie inconnue: ${item.category}`);
  if (!SCOPES.has(item.scopeType)) flag(item, `scopeType inconnu: ${item.scopeType}`);

  if (item.scopeType === "verse") {
    if (!item.verseKey) flag(item, "scopeType verse sans verseKey");
    else if (!verseKeyRe.test(item.verseKey)) flag(item, `verseKey invalide: ${item.verseKey}`);
  }
  if (item.scopeType === "verse_range") {
    if (!item.verseRange) flag(item, "scopeType verse_range sans verseRange");
    else {
      const [start, end] = item.verseRange.split("-");
      if (!verseKeyRe.test(start) || !verseKeyRe.test(end)) {
        flag(item, `verseRange invalide: ${item.verseRange}`);
      } else {
        const [s0, a0] = start.split(":").map(Number);
        const [s1, a1] = end.split(":").map(Number);
        if (s0 !== s1) flag(item, "verseRange traverse deux sourates (jamais attendu ici)");
        else if (a1 < a0) flag(item, "verseRange inversée");
      }
    }
  }
  if (item.scopeType === "surah" && !item.surahNumber) flag(item, "scopeType surah sans surahNumber");
  if (item.scopeType === "page" && !item.pageNumber) flag(item, "scopeType page sans pageNumber");

  if (!item.sourceTitle) flag(item, "sourceTitle manquant (contenu sans source)");
  if (!item.sourceStatus) flag(item, "sourceStatus manquant");
  if (item.sourceStatus === "validated" || item.sourceStatus === "verified_source") {
    // Rien dans ce lot ne doit être marqué validé automatiquement.
    if (item.sourceStatus === "verified_source") {
      // autorisé seulement si explicitement voulu — signalé pour relecture humaine
      flag(item, "sourceStatus = verified_source : à confirmer humainement, jamais automatique");
    }
  }

  // Heuristique anti-confusion Amal / Tawjihat : un item "amal" ne doit pas
  // contenir de question de réflexion (marque éditoriale des Waqafat), et
  // aucune catégorie ne doit porter un id préfixé d'une autre catégorie.
  if (item.category === "amal" && (item.reflectionQuestionAr || item.reflectionQuestionFr)) {
    flag(item, "Amal porte une question de réflexion (signature typique d'un Waqfa/Tawjih — vérifier la classification)");
  }
  const idCategoryHint = item.id.match(/-(w|a|t)\d+$/);
  if (idCategoryHint) {
    const map = { w: "tadabbur", a: "amal", t: "tawjihat" };
    const expected = map[idCategoryHint[1]];
    if (expected && expected !== item.category) {
      flag(item, `id suggère ${expected} mais category=${item.category} (anomalie type T3/A1)`);
    }
  }
}

console.log(`\n${ALL.length} contenus vérifiés (${AL_FATIHA_CONTENT.length} Al-Fatiha, ${AL_BAQARA_CONTENT.length} Al-Baqara).`);
console.log(issues === 0 ? "Aucune anomalie détectée." : `${issues} anomalie(s) détectée(s).`);
process.exit(issues === 0 ? 0 : 1);
