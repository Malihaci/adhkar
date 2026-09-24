// Rendu déterministe d'une page Mushaf en PNG à partir des 3 PDF uniques
// القرآن تدبر وعمل, via la cartographie vérifiée (pdf-page-mapping.json).
// Usage : node --experimental-strip-types scripts/render-mushaf-page.mjs <mushafPage> [dpi]
//
// Nécessaire car les PDF (jusqu'à 520 Mo) dépassent la limite de lecture
// directe par outil — on rend la page ciblée en PNG avant toute lecture
// visuelle ou tentative d'OCR. Ce script ne fait QUE le rendu : il ne lit,
// ne structure et n'invente aucun contenu.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const POPPLER_BIN =
  "C:\\Users\\LAP-022\\AppData\\Local\\Microsoft\\WinGet\\Packages\\oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe\\poppler-25.07.0\\Library\\bin\\pdftoppm.exe";
const SOURCES_DIR = "C:\\adhkar\\sources";
const OUT_DIR = "C:\\adhkar\\scripts\\_pages";

// Formules vérifiées par échantillonnage visuel — voir pdf-page-mapping.json.
function resolvePdfPage(mushafPage) {
  if (mushafPage >= 1 && mushafPage <= 201) {
    return { file: "1-10.pdf", pdfPage: mushafPage + 9 };
  }
  if (mushafPage >= 202 && mushafPage <= 401) {
    return { file: "11-20.pdf", pdfPage: mushafPage - 201 };
  }
  if (mushafPage >= 402 && mushafPage <= 604) {
    return { file: "21-30.pdf", pdfPage: mushafPage - 401 };
  }
  throw new Error(`mushafPage hors plage 1-604 : ${mushafPage}`);
}

const mushafPage = Number(process.argv[2]);
const dpi = Number(process.argv[3] ?? 200);
if (!Number.isInteger(mushafPage)) {
  console.error("Usage: node render-mushaf-page.mjs <mushafPage 1-604> [dpi]");
  process.exit(1);
}

const { file, pdfPage } = resolvePdfPage(mushafPage);
const pdfPath = `${SOURCES_DIR}\\${file}`;
if (!existsSync(pdfPath)) {
  console.error(`Source introuvable : ${pdfPath}`);
  process.exit(1);
}
if (!existsSync(OUT_DIR)) {
  execFileSync("cmd", ["/c", "mkdir", OUT_DIR]);
}

const outPrefix = `${OUT_DIR}\\mushaf-p${mushafPage}`;
execFileSync(POPPLER_BIN, [
  "-f",
  String(pdfPage),
  "-l",
  String(pdfPage),
  "-r",
  String(dpi),
  "-png",
  pdfPath,
  outPrefix,
]);

console.log(
  `mushafPage ${mushafPage} -> ${file} pdfPage ${pdfPage} -> ${outPrefix}-${String(pdfPage).padStart(3, "0")}.png`,
);
