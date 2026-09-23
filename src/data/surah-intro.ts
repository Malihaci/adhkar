/**
 * Données factuelles pour l'écran « Découvrir la sourate ».
 *
 * Chaque fait conserve sa propre source — jamais de fusion silencieuse.
 * Le nom (arabe/translittéré) et le nombre d'ayat viennent déjà de l'API
 * quran.com (`Chapter`), affichés séparément par l'écran : ce module ne
 * porte que les faits narratifs supplémentaires (sens du nom, révélation,
 * visée, thèmes...).
 *
 * Aucun texte de « أول مرة أتدبر القرآن » (Adel Mohamed Khalil) n'est
 * reproduit ici : seule sa logique de rubriques a servi d'inspiration.
 */

import type { SourceStatus } from "@/lib/etude-content";
import { GENERATED_MUKHTASAR_INTROS } from "@/data/surah-intro.generated";

export interface SurahIntroFact {
  label: string;
  textFr: string;
  sourceTitle: string;
  sourceAuthor?: string;
  sourceStatus: SourceStatus;
}

export interface SurahIntro {
  surahNumber: number;
  facts: SurahIntroFact[];
}

const MOKHTASAR = "Al-Mukhtasar fî at-tafsîr — Markaz Tafsîr";
const SAADI = "Tafsir As-Sa'dî (synthèse de fin de sourate)";

/**
 * Al-Fatiha : entrée sourcée manuellement (pilote), plus riche que
 * l'extraction générique (inclut la synthèse thématique d'As-Sa'dî).
 */
const AL_FATIHA_INTRO: SurahIntro = {
  surahNumber: 1,
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

const MANUAL_INTROS: Record<number, SurahIntro> = {
  1: AL_FATIHA_INTRO,
};

/**
 * Assemble l'intro d'une sourate : l'entrée manuelle si elle existe
 * (plus riche), sinon les faits extraits automatiquement (déterministe,
 * texte réel d'Al-Mukhtasar via `scripts/extract-mukhtasar-intro.mjs` —
 * jamais de PDF lu au runtime, jamais de contenu généré par l'IA).
 * Retourne `null` si rien n'est disponible pour cette sourate.
 */
export function getSurahIntro(surahNumber: number): SurahIntro | null {
  if (MANUAL_INTROS[surahNumber]) return MANUAL_INTROS[surahNumber];
  return GENERATED_MUKHTASAR_INTROS[surahNumber] ?? null;
}
