// Outil de CONSTRUCTION (hors runtime) : extrait les informations
// factuelles d'introduction de chaque sourate depuis les 30 PDF français
// d'Al-Mukhtasar (texte réellement sélectionnable, aucun OCR nécessaire).
// Génère src/data/surah-intro.generated.ts — un fichier statique, relu et
// committé, jamais un PDF lu au runtime de l'application.
import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "C:\\adhkar\\sources\\Coran_al_mokhtasar";
const PDFTOTEXT =
  "C:\\Users\\LAP-022\\AppData\\Local\\Microsoft\\WinGet\\Packages\\oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe\\poppler-25.07.0\\Library\\bin\\pdftotext.exe";

const files = readdirSync(DIR).filter((f) => f.endsWith(".pdf"));

// Tolérant aux variations réelles observées entre volumes : tiret simple
// ou tiret cadratin avant Mecquoise/Médinoise, parenthèse de sens du nom
// pouvant s'étendre sur plusieurs lignes (parfois coupée par un saut de
// page), et le filigrane "Observation: translate@mokhtasr.com" retiré au
// préalable.
const surahHeaderRe =
  /Sourate\s+(\d+)\s*:\s*([\s\S]{1,80}?)\s*(?:\(([\s\S]{1,200}?)\))?\s*\n\s*(\d+)\s*versets?\s*[-–—]\s*(Mecquoise|Médinoise)/gi;

function cleanNoise(text) {
  return text
    .replace(/^Observation:.*$/gim, "")
    .replace(/\f/g, "\n")
    .replace(/\n{3,}/g, "\n\n");
}

const results = new Map();

for (const file of files) {
  const full = join(DIR, file);
  let text;
  try {
    text = cleanNoise(
      execFileSync(PDFTOTEXT, ["-enc", "UTF-8", full, "-"], {
        maxBuffer: 1024 * 1024 * 50,
      })
        .toString("utf8")
        .replace(/\r\n?/g, "\n"),
    );
  } catch (e) {
    console.error("ECHEC lecture:", file, e.message);
    continue;
  }

  let m;
  surahHeaderRe.lastIndex = 0;
  const matches = [...text.matchAll(surahHeaderRe)];
  for (let i = 0; i < matches.length; i++) {
    m = matches[i];
    const surahNumber = Number(m[1]);
    const nameLatin = m[2].replace(/\s+/g, " ").trim();
    const meaningParenthetical = (m[3] || "").replace(/\s+/g, " ").trim();
    const versesCount = Number(m[4]);
    const revelationType = m[5].toLowerCase(); // mecquoise | médinoise
    const startIdx = m.index + m[0].length;
    const endIdx = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const block = text.slice(startIdx, endIdx);

    const viseeMatch = block.match(
      /Principale visée de cette sourate\s*:\s*([\s\S]*?)(?:\n\s*(?:CC)?Exégèse\s*:|\n\s*\d+\s*Cette|\n\s*Sourate\s+\d+\s*:|$)/i,
    );
    const principaleVisee = viseeMatch ? viseeMatch[1].replace(/\s+/g, " ").trim() : null;

    // Reason for naming: first ~2 sentences of "Exégèse" mentioning
    // "porte le nom" / "nommée" / "s'appelle", kept short and verbatim.
    const exegeseMatch = block.match(/Exégèse\s*:\s*([\s\S]*?)(?:\n\s*\d+\s*Cette formule|\n\s*Sourate\s+\d+\s*:|$)/i);
    let raisonNom = null;
    if (exegeseMatch) {
      const exegese = exegeseMatch[1].replace(/\s+/g, " ").trim();
      const sentences = exegese.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ");
      if (/nom|nomm|appel/i.test(sentences)) raisonNom = sentences;
    }

    if (!results.has(surahNumber)) {
      results.set(surahNumber, {
        surahNumber,
        nameLatin,
        meaningParenthetical: meaningParenthetical || null,
        versesCount,
        revelationType,
        principaleVisee,
        raisonNom,
        sourceFile: file,
      });
    }
  }
}

const sorted = [...results.values()].sort((a, b) => a.surahNumber - b.surahNumber);
console.log(`Sourates trouvées: ${sorted.length} / 114`);
const missing = [];
for (let n = 1; n <= 114; n++) if (!results.has(n)) missing.push(n);
console.log("Manquantes:", missing);

writeFileSync(
  "C:\\adhkar\\scripts\\mukhtasar-intro-raw.json",
  JSON.stringify(sorted, null, 2),
  "utf8",
);
console.log("Ecrit: scripts/mukhtasar-intro-raw.json");
