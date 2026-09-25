// Contrôle déterministe des adhkār authentiques (coucher / sortie / voyage
// / khatma) — jamais un hadith faible présenté comme authentique, jamais
// un nombre de répétitions sans preuve, jamais une pratique de Compagnon
// présentée comme parole du Prophète ﷺ. Signale seulement, ne corrige rien.
import { coucherAdhkar, sortieAdhkar, voyageAdhkar } from "../src/data/adhkar-occasions.ts";
import { anasKhatmaPractice } from "../src/data/khatma.ts";

const ALL = [...coucherAdhkar, ...sortieAdhkar, ...voyageAdhkar];
const EVIDENCE_TYPES = new Set(["A", "B", "C", "D", "E"]);
const WEAK_MARKERS = /faible|da[ée]if|fabriqu|munkar|matr[ou]uk|mawd[ou]'?/i;

let issues = 0;
const flag = (item, msg) => {
  issues++;
  console.error(`ANOMALIE [${item.id}]: ${msg}`);
};

const seenIds = new Set();
for (const item of ALL) {
  if (seenIds.has(item.id)) flag(item, "id dupliqué");
  seenIds.add(item.id);

  if (!item.arabic || !item.arabic.trim()) flag(item, "texte arabe absent");
  if (!item.translation || !item.translation.trim()) flag(item, "traduction française absente");

  if (!item.collection) flag(item, "collection (recueil) absente — dhikr sans source");
  if (!item.hadithNumber) flag(item, "hadithNumber absent — hadith sans référence");
  if (!item.narrator) flag(item, "narrator absent");
  if (!item.authenticityGrade) flag(item, "authenticityGrade absent");
  if (!item.propheticEvidenceType || !EVIDENCE_TYPES.has(item.propheticEvidenceType)) {
    flag(item, `propheticEvidenceType manquant ou invalide: ${item.propheticEvidenceType}`);
  }
  if (!item.evidenceSummaryFr)
    flag(item, "evidenceSummaryFr absent — impossible de vérifier ce que la preuve établit");

  // Un hadith dont le degré signale une faiblesse ne doit jamais être
  // présenté comme authentique (sourceStatus/validationStatus verified).
  if (item.authenticityGrade && WEAK_MARKERS.test(item.authenticityGrade)) {
    if (item.validationStatus === "verified_source") {
      flag(
        item,
        `authenticityGrade signale une faiblesse ("${item.authenticityGrade}") mais validationStatus=verified_source`,
      );
    }
  }

  // Un nombre de répétitions > 1 doit être justifié dans le résumé de
  // preuve ou l'explication (jamais un nombre rituel inventé).
  if (item.repetitions > 1) {
    const justified =
      String(item.repetitions) === "1" ||
      (item.explanation && item.explanation.includes(String(item.repetitions))) ||
      (item.evidenceSummaryFr && item.evidenceSummaryFr.match(/\d/));
    if (!justified) {
      flag(
        item,
        `repeatCount=${item.repetitions} sans justification explicite dans explanation/evidenceSummaryFr`,
      );
    }
  }

  // sourceIds doit référencer des ids réellement existants (jamais un
  // renvoi fantôme).
  for (const srcId of item.sourceIds ?? []) {
    if (!ALL.some((i) => i.id === srcId))
      flag(item, `sourceIds référence un id inexistant: ${srcId}`);
  }

  // Heuristique anti-confusion : une pratique de Compagnon (type C/D) ne
  // doit jamais être décrite comme "Le Prophète ﷺ disait/faisait" dans
  // l'explication affichée à l'utilisateur.
  if (
    (item.propheticEvidenceType === "C" || item.propheticEvidenceType === "D") &&
    item.explanation
  ) {
    if (/le proph[eè]te.*(disait|faisait|a dit|a fait)/i.test(item.explanation)) {
      flag(
        item,
        `type ${item.propheticEvidenceType} (Compagnon/Salaf) mais l'explication attribue l'action au Prophète ﷺ directement`,
      );
    }
  }
}

// Khatma : le du'a affiché ne doit jamais être marqué comme provenant du
// Prophète ﷺ — uniquement une pratique de Compagnon (type D).
if (anasKhatmaPractice.propheticEvidenceType !== "D") {
  issues++;
  console.error(
    "ANOMALIE [khatma]: la pratique d'Anas doit être de type D (Compagnon), jamais attribuée au Prophète ﷺ",
  );
}
if (/le proph[eè]te.*(disait|faisait)/i.test(anasKhatmaPractice.translationFr)) {
  issues++;
  console.error(
    "ANOMALIE [khatma]: la traduction attribue la pratique au Prophète ﷺ au lieu d'Anas ibn Malik",
  );
}

console.log(
  `\n${ALL.length} adhkār vérifiés (${coucherAdhkar.length} coucher, ${sortieAdhkar.length} sortie, ${voyageAdhkar.length} voyage) + 1 pratique Khatma.`,
);
console.log(issues === 0 ? "Aucune anomalie détectée." : `${issues} anomalie(s) détectée(s).`);
process.exit(issues === 0 ? 0 : 1);
