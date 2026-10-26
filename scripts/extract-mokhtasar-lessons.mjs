// Extrait « Quelques enseignements déduits de ces versets » du Mukhtasar français
// (sources/Coran_al_mokhtasar, texte extrait par pdftotext -layout) et les
// rattache à la plage d'āyāt du passage qui précède. Sortie : JSON.
// Usage : node scripts/extract-mokhtasar-lessons.mjs <dossier-txt> <sortie.json>
import fs from "node:fs";
import path from "node:path";

const [dir, out] = process.argv.slice(2);
const MARK = "Quelques enseignements déduits de ces versets";
const result = []; // { surah, from, to, lessons[] }
let surah = 0;
let lastVerse = 0; // dernier numéro de verset repéré dans la sourate
let passageStart = 1;

const norm = (s) => s.replace(/\s+/g, " ").trim();

for (let j = 1; j <= 30; j++) {
  const lines = fs.readFileSync(path.join(dir, `j${j}.txt`), "utf8").replace(/\r/g, "").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const sm = line.match(/^\s*Sourate\s+(\d+)\s*:/i);
    if (sm) {
      surah = Number(sm[1]);
      lastVerse = 0;
      passageStart = 1;
      continue;
    }
    if (!surah) continue;
    if (!line.includes(MARK)) {
      // repère les numéros de versets attendus dans le commentaire (séquentiels)
      const re = /(?:^|[\s.:»”])(\d{1,3})\s+(?=[A-ZÀ-ÖØ-Ý«“"`(‘’])/g;
      let m;
      while ((m = re.exec(line))) {
        const n = Number(m[1]);
        if (n > lastVerse && n <= lastVerse + 3) lastVerse = n;
      }
      continue;
    }
    // bloc d'enseignements : jusqu'à une ligne très indentée (colonne d'intro) ou la fin d'un passage
    let text = line.slice(line.indexOf(MARK) + MARK.length).replace(/^[\s:]+/, "");
    let k = i + 1;
    for (; k < lines.length; k++) {
      const l = lines[k];
      if (!l.trim()) continue;
      if (/^\s{20,}/.test(l)) break;
      if (/^\s*Sourate\s+\d+\s*:/i.test(l)) break;
      if (/^\s*(CC)?Principale visée/.test(l)) break;
      // nouveau passage sans intro : commence par le numéro de verset attendu
      const nm = l.match(/^\s*(\d{1,3})\s+[A-ZÀ-ÖØ-Ý«“"`(]/);
      if (nm && Number(nm[1]) > lastVerse && Number(nm[1]) <= lastVerse + 3 && /(?:[.!?»”)]|:)\s*$/.test(text.trim())) break;
      text += " " + l.trim();
    }
    i = k - 1;
    const body = norm(text);
    const items = body
      .split(/(?:^|\s)(?=\d{1,2}-\s)/)
      .map((t) => norm(t.replace(/^\d{1,2}-\s*/, "")))
      .filter((t) => t.length > 8);
    if (items.length && lastVerse >= passageStart) {
      result.push({ surah, from: passageStart, to: lastVerse, lessons: items });
    }
    passageStart = lastVerse + 1;
  }
}
fs.writeFileSync(out, JSON.stringify(result));
console.log(result.length, "passages;", result.reduce((a, r) => a + r.lessons.length, 0), "leçons");
