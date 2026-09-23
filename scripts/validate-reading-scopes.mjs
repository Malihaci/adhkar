// Contrôle déterministe des portées de lecture (§36 "LECTURE"), en
// import direct de la logique réelle de src/lib/mushaf.ts (Node 24,
// type-stripping natif — aucune réimplémentation, aucun framework de
// test ajouté).
import { keysBetween, isValidVerseKey, keysToEndOfQuran, clampPage, TOTAL_PAGES } from "../src/lib/mushaf.ts";

let failures = 0;
const check = (label, cond) => {
  if (!cond) {
    failures++;
    console.error("ECHEC:", label);
  } else {
    console.log("OK:", label);
  }
};

const chapters = [
  { id: 1, versesCount: 7 },
  { id: 2, versesCount: 286 },
  { id: 5, versesCount: 120 },
  { id: 12, versesCount: 111 },
  { id: 114, versesCount: 6 },
];

// --- Intervalle personnalisé ---
const r1 = keysBetween("5:39", "5:50", chapters);
check("intervalle simple : 12 ayat, premier=5:39, dernier=5:50", r1.length === 12 && r1[0] === "5:39" && r1.at(-1) === "5:50");

const r2 = keysBetween("5:50", "5:39", chapters); // inversé
check("intervalle inversé refusé (liste vide)", r2.length === 0);

const r3 = keysBetween("1:5", "2:3", chapters); // traverse une sourate
check("intervalle traversant une sourate : premier=1:5, dernier=2:3, sans trou", r3[0] === "1:5" && r3.at(-1) === "2:3" && r3.length === 3 + 3);

const r4 = keysBetween("1:1", "1:900", chapters); // ayah de fin invalide
check("ayah de fin invalide → liste vide (pas d'invention)", r4.length === 0);

const r5 = keysBetween("999:1", "999:2", chapters); // sourate invalide
check("sourate invalide → liste vide", r5.length === 0);

// --- Doublons ---
const seen = new Set(r1);
check("aucun doublon dans l'intervalle 5:39-5:50", seen.size === r1.length);

// --- Validité de clé ---
check("isValidVerseKey accepte 2:286 (dernière ayah de Baqara)", isValidVerseKey("2:286", chapters));
check("isValidVerseKey refuse 2:287 (hors plage)", !isValidVerseKey("2:287", chapters));
check("isValidVerseKey refuse un format invalide", !isValidVerseKey("abc", chapters));

// --- Jusqu'à la fin du Coran ---
const toEnd = keysToEndOfQuran("114:1", chapters);
check("jusqu'à la fin depuis la dernière sourate connue : couvre exactement 114:1-114:6", toEnd.length === 6 && toEnd[0] === "114:1" && toEnd.at(-1) === "114:6");

// --- Pages ---
check("clampPage borne à 1 en dessous", clampPage(0) === 1);
check("clampPage borne à TOTAL_PAGES au-dessus", clampPage(9999) === TOTAL_PAGES);
check(`TOTAL_PAGES = 604`, TOTAL_PAGES === 604);

console.log(failures === 0 ? "\nTous les contrôles LECTURE sont passés." : `\n${failures} échec(s).`);
process.exit(failures === 0 ? 0 : 1);
