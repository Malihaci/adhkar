// Inventaire déterministe des PDF القرآن تدبر وعمل présents dans
// sources/ — ne suppose aucun nom de fichier, détecte réellement ce qui
// existe, avant tout traitement. Outil de CONSTRUCTION uniquement.
import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIR = "C:\\adhkar\\sources";
const PDFINFO =
  "C:\\Users\\LAP-022\\AppData\\Local\\Microsoft\\WinGet\\Packages\\oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe\\poppler-25.07.0\\Library\\bin\\pdfinfo.exe";
const PDFTOTEXT =
  "C:\\Users\\LAP-022\\AppData\\Local\\Microsoft\\WinGet\\Packages\\oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe\\poppler-25.07.0\\Library\\bin\\pdftotext.exe";

const entries = readdirSync(DIR, { withFileTypes: true });
const pdfFiles = entries.filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".pdf"));

const inventory = [];
for (const f of pdfFiles) {
  const full = join(DIR, f.name);
  const stat = statSync(full);
  const item = {
    fileName: f.name,
    path: full,
    sizeBytes: stat.size,
    readable: false,
    pages: null,
    textExtractableSample: null,
  };
  try {
    const info = execFileSync(PDFINFO, [full], { maxBuffer: 1024 * 1024 * 10 }).toString("utf8");
    const m = info.match(/^Pages:\s*(\d+)/m);
    item.pages = m ? Number(m[1]) : null;
    item.readable = true;
  } catch (e) {
    item.error = e.message;
  }
  if (item.readable && item.pages) {
    try {
      const sample = execFileSync(
        PDFTOTEXT,
        ["-f", "1", "-l", String(Math.min(3, item.pages)), full, "-"],
        { maxBuffer: 1024 * 1024 * 20 },
      ).toString("utf8");
      item.textExtractableSample = sample.replace(/\s/g, "").length > 20;
    } catch {
      item.textExtractableSample = false;
    }
  }
  inventory.push(item);
}

console.log(JSON.stringify(inventory, null, 2));
writeFileSync(
  "C:\\adhkar\\scripts\\tadabbur-pdf-inventory.json",
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      files: inventory,
      note:
        "Cartographie fine (offsets vers la pagination réelle du Mushaf, doublon confirmé) : voir scripts/pdf-page-mapping.json, établie par échantillonnage visuel direct, pas par ce script.",
    },
    null,
    2,
  ),
  "utf8",
);
console.log(`\nEcrit scripts/tadabbur-pdf-inventory.json (${inventory.length} fichiers PDF trouvés dans sources/)`);
