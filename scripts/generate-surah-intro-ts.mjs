// Convertit scripts/mukhtasar-intro-raw.json (extrait déterministe des PDF
// Al-Mukhtasar) en src/data/surah-intro.generated.ts — fichier statique,
// committé, jamais un PDF lu au runtime de l'application.
import { readFileSync, writeFileSync } from "node:fs";

const raw = JSON.parse(readFileSync("C:\\adhkar\\scripts\\mukhtasar-intro-raw.json", "utf8"));

const MOKHTASAR = "Al-Mukhtasar fî at-tafsîr — Markaz Tafsîr";

function esc(s) {
  return s
    .replace(/\r\n?/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

const entries = raw.map((s) => {
  const facts = [];
  if (s.raisonNom) {
    facts.push({
      label: "Sens du nom / pourquoi ce nom ?",
      textFr: s.raisonNom,
      sourceTitle: MOKHTASAR,
      sourceStatus: "needs_review",
    });
  }
  facts.push({
    label: "Révélation",
    textFr: `${s.revelationType === "mecquoise" ? "Mecquoise" : "Médinoise"}, selon cette source.`,
    sourceTitle: MOKHTASAR,
    sourceStatus: "needs_review",
  });
  if (s.principaleVisee) {
    facts.push({
      label: "Principale visée",
      textFr: s.principaleVisee,
      sourceTitle: MOKHTASAR,
      sourceStatus: "needs_review",
    });
  }
  return { surahNumber: s.surahNumber, facts };
});

const body = entries
  .map(
    (e) =>
      `  ${e.surahNumber}: { surahNumber: ${e.surahNumber}, facts: [\n${e.facts
        .map(
          (f) =>
            `    { label: \`${esc(f.label)}\`, textFr: \`${esc(f.textFr)}\`, sourceTitle: \`${esc(f.sourceTitle)}\`, sourceStatus: "needs_review" },`,
        )
        .join("\n")}\n  ] },`,
  )
  .join("\n");

const out = `/**
 * GÉNÉRÉ AUTOMATIQUEMENT par scripts/extract-mukhtasar-intro.mjs +
 * scripts/generate-surah-intro-ts.mjs — à partir du texte réel des PDF
 * Al-Mukhtasar (sources/Coran_al_mokhtasar/), jamais lu au runtime.
 * Ne pas éditer à la main : relancer le pipeline pour régénérer.
 *
 * Couverture : ${entries.length} / 114 sourates. Les sourates absentes de cet
 * objet n'ont pas été extraites avec certitude (format de page atypique) —
 * getSurahIntro() renverra null pour elles, jamais un contenu inventé.
 */

import type { SurahIntro } from "@/data/surah-intro";

export const GENERATED_MUKHTASAR_INTROS: Record<number, SurahIntro> = {
${body}
};
`;

writeFileSync("C:\\adhkar\\src\\data\\surah-intro.generated.ts", out, "utf8");
console.log(`Ecrit src/data/surah-intro.generated.ts (${entries.length} sourates)`);
