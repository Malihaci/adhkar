/**
 * Données factuelles pour l'écran « Découvrir la sourate ».
 *
 * Chaque fait conserve sa propre source — jamais de fusion silencieuse.
 * Aucun texte de « أول مرة أتدبر القرآن » (Adel Mohamed Khalil) n'est
 * reproduit ici : seule sa logique de rubriques a servi d'inspiration.
 */

import type { SourceStatus } from "@/lib/etude-content";

export interface SurahIntroFact {
  label: string;
  textFr: string;
  sourceTitle: string;
  sourceAuthor?: string;
  sourceStatus: SourceStatus;
}

export interface SurahIntro {
  surahNumber: number;
  nameArabic: string;
  nameTransliteration: string;
  versesCount: number;
  facts: SurahIntroFact[];
}

const MOKHTASAR = "Al-Mukhtasar fî at-tafsîr — Markaz Tafsîr";
const SAADI = "Tafsir As-Sa'dî (synthèse de fin de sourate)";

export const AL_FATIHA_INTRO: SurahIntro = {
  surahNumber: 1,
  nameArabic: "الفاتحة",
  nameTransliteration: "Al-Fâtiha",
  versesCount: 7,
  facts: [
    {
      label: "Sens du nom",
      textFr:
        "« L'Ouvrante » : elle porte ce nom car c'est elle qui ouvre le Livre d'Allah. Elle est également appelée Umm al-Qur'ân (« Mère du Coran ») car elle réunit, sous une forme condensée, les grands thèmes du Coran.",
      sourceTitle: MOKHTASAR,
      sourceStatus: "needs_review",
    },
    {
      label: "Révélation",
      textFr:
        "Mecquoise, selon cette source. (D'autres tafsir mentionnent une divergence classique sur ce point — non tranchée ici.)",
      sourceTitle: MOKHTASAR,
      sourceStatus: "needs_review",
    },
    {
      label: "Nombre d'ayat",
      textFr:
        "7 versets, répétés au moins deux fois à chaque prière rituelle — d'où l'appellation « les sept versets répétés » (as-sab'u l-mathânî).",
      sourceTitle: MOKHTASAR,
      sourceStatus: "needs_review",
    },
    {
      label: "Principale visée",
      textFr: "Réaliser les conditions d'une parfaite servitude à Allah.",
      sourceTitle: MOKHTASAR,
      sourceStatus: "needs_review",
    },
    {
      label: "Thèmes principaux",
      textFr:
        "Selon la synthèse de fin de sourate d'As-Sa'dî : les trois catégories du tawhîd (l'unicité d'Allah dans Sa seigneurie, dans le droit exclusif à l'adoration, et dans Ses noms et attributs), l'affirmation de la prophétie, et l'affirmation de la rétribution des actes au Jour du Jugement.",
      sourceTitle: SAADI,
      sourceAuthor: "As-Sa'dî",
      sourceStatus: "needs_review",
    },
  ],
};
