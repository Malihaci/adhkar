/**
 * Fin de lecture complète du Coran (ختم القرآن) — section à prudence
 * particulière : aucune formule de du'a de Khatm n'est authentiquement
 * établie du Prophète ﷺ dans les sources vérifiées. Ne jamais présenter
 * la longue « du'a khatm al-Qur'an » imprimée dans certains Mushaf comme
 * une invocation prophétique.
 *
 * Seule pratique retenue ici : celle, authentiquement rapportée, d'Anas
 * ibn Malik (رضي الله عنه) — un Compagnon, jamais le Prophète ﷺ.
 */

export interface KhatmaEvidence {
  textAr: string;
  translationFr: string;
  context: string;
  propheticEvidenceType: "D";
  collection: string;
  hadithNumber: string;
  narrator: string;
  authenticityNote: string;
}

export const anasKhatmaPractice: KhatmaEvidence = {
  textAr: "كَانَ أَنَسٌ إِذَا خَتَمَ الْقُرْآنَ، جَمَعَ وَلَدَهُ وَأَهْلَ بَيْتِهِ، فَدَعَا لَهُمْ",
  translationFr:
    "Anas, lorsqu'il terminait la lecture complète du Coran, réunissait ses enfants et les gens de sa maison, et invoquait Allah pour eux.",
  context: "Pratique personnelle d'Anas ibn Malik à l'occasion d'un khatm",
  propheticEvidenceType: "D",
  collection: "Sunan al-Darimi",
  hadithNumber: "3378 (Livre 23, فضائل القرآن)",
  narrator: "Rapporté par Thabit al-Bunani, d'après Anas ibn Malik (رضي الله عنه)",
  authenticityNote:
    "Rapport mawqûf (arrêté à un Compagnon) — ce n'est PAS un hadith marfû' attribué au Prophète ﷺ. Une narration similaire (via Qatada, d'après Anas) existe également dans le Musannaf d'Ibn Abi Shayba, ce qui corrobore la pratique d'Anas sans en faire pour autant une parole ou un acte du Prophète ﷺ.",
};

export const khatmaCaution =
  "Il n'est pas établi qu'une formule précise d'invocation pour la fin de lecture du Coran ait été enseignée par le Prophète ﷺ dans les sources authentiques retenues ici. La célèbre longue invocation imprimée à la fin de certains Mushaf n'a pas de preuve prophétique et n'est donc pas présentée dans cette application comme une Sunnah.";

export const khatmaInvitation =
  "Vous pouvez, comme le faisait Anas ibn Malik, réunir vos proches et faire une invocation personnelle après avoir terminé la lecture du Coran — sans qu'aucune formule précise ne soit requise ni présentée ici comme prescrite.";
