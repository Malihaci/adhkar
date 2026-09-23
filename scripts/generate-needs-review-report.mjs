// Rapport centralisé des contenus nécessitant une relecture humaine.
// Généré depuis les données réelles (pas une liste statique) + quelques
// annotations connues (anomalies déjà documentées) — jamais inventé.
import { writeFileSync } from "node:fs";
import { AL_FATIHA_CONTENT } from "../src/data/al-fatiha-content.ts";
import { AL_BAQARA_CONTENT } from "../src/data/al-baqara-content.ts";

const ALL = [
  { surah: "Al-Fatiha", items: AL_FATIHA_CONTENT },
  { surah: "Al-Baqara", items: AL_BAQARA_CONTENT },
];

const KNOWN_NOTES = {
  "fatiha-t3":
    "Anomalie confirmée du pipeline CDN (non de la source PDF) lors de l'audit initial : le CDN spa5k/tafsir_api accolait des fragments d'Amal à cet item. Le PDF lui-même est propre à cet endroit, mais la vérification de l'original reste recommandée avant validation finale.",
};

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    totalItems: ALL.reduce((n, s) => n + s.items.length, 0),
    needsReview: 0,
  },
  items: [],
};

for (const { surah, items } of ALL) {
  for (const item of items) {
    const scope =
      item.scopeType === "verse"
        ? item.verseKey
        : item.scopeType === "verse_range"
          ? item.verseRange
          : item.scopeType === "page"
            ? `page ${item.pageNumber}`
            : item.scopeType === "surah"
              ? `sourate ${item.surahNumber}`
              : "?";
    const entry = {
      id: item.id,
      surah,
      category: item.category,
      scope,
      sourceTitle: item.sourceTitle,
      sourceAuthor: item.sourceAuthor ?? null,
      sourceStatus: item.sourceStatus,
      translationStatus: item.translationStatus ?? null,
      reasonForReview:
        item.sourceStatus === "needs_review"
          ? "Droits de réutilisation de la source non confirmés (needs_review par défaut pour tout contenu extrait)"
          : null,
      knownNote: KNOWN_NOTES[item.id] ?? null,
    };
    if (entry.sourceStatus === "needs_review" || entry.knownNote) {
      report.items.push(entry);
      report.summary.needsReview++;
    }
  }
}

writeFileSync(
  "C:\\adhkar\\scripts\\needs-review-report.json",
  JSON.stringify(report, null, 2),
  "utf8",
);
console.log(
  `Ecrit scripts/needs-review-report.json — ${report.summary.needsReview}/${report.summary.totalItems} contenus signalés pour relecture humaine.`,
);
