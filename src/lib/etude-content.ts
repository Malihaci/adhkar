/**
 * Modèle des contenus d'étude d'une ayah (Tadabbur, Mise en pratique,
 * Orientations, Asbab an-Nuzul).
 *
 * Les données réelles (par sourate) vivent dans des fichiers séparés
 * (ex. `src/data/al-fatiha-content.ts`) et sont assemblées ci-dessous.
 * Ce module ne définit que le modèle et les fonctions de sélection — il
 * n'invente jamais de contenu religieux lui-même.
 *
 * `sourceStatus: "needs_review"` n'est pas caché : provenance/transcription
 * du contenu, validation de la traduction française et droits de
 * réutilisation sont trois sujets distincts, tous affichés honnêtement.
 */

import { AL_FATIHA_CONTENT } from "@/data/al-fatiha-content";
import { AL_BAQARA_CONTENT } from "@/data/al-baqara-content";

export type SourceStatus = "verified_source" | "needs_review";
export type ContentStatus = "draft" | "reviewed" | "validated";

export type EtudeCategory =
  | "tadabbur"
  | "amal"
  | "tawjihat"
  | "asbab_nuzul"
  | "hadith" // Hadith authentique dont le rapport avec l'ayah est réellement établi
  | "lesson" // ✨ Leçons à retenir — synthèse fidèle sourcée, jamais une conclusion nouvelle
  | "today"; // 🌍 Dans ma vie / Dès aujourd'hui — synthèse pédagogique sourcée uniquement

/** Portée réelle d'un contenu — ne jamais forcer un contenu large sur "verse". */
export type ScopeType = "verse" | "verse_range" | "passage" | "page" | "surah";

export type ContentOrigin =
  | "source_quote" // texte de la source, inchangé
  | "source_translation" // traduction fidèle par l'application d'un texte source
  | "editorial_explanation" // explication pédagogique séparée (Comprendre)
  | "pedagogical_synthesis"; // application/méditation/orientation construite par l'app

export interface EtudeContent {
  id: string;
  category: EtudeCategory;
  scopeType: ScopeType;
  /** Ayah de référence (ex. "1:5") — requis si scopeType === "verse". */
  verseKey?: string;
  /** Plage si le contenu concerne plusieurs ayat (ex. "1:2-1:4"). */
  verseRange?: string;
  /** Sourate concernée si scopeType === "surah". */
  surahNumber?: number;
  /** Page du Mushaf concernée si scopeType === "page" (portée éditoriale, sans ayah citée). */
  pageNumber?: number;

  /** Texte source exact — jamais reformulé. */
  textAr: string;
  /** Traduction fidèle — jamais interprétative. */
  translationFr?: string;
  /** Explication pédagogique séparée — jamais présentée comme la source. */
  explanationFr?: string;

  /** Question de réflexion éditoriale (jamais attribuée au mufassir cité). */
  reflectionQuestionAr?: string;
  reflectionQuestionFr?: string;

  contentOrigin: ContentOrigin;
  sourceTitle: string;
  /** Auteur/mufassir réellement cité (ex. "As-Sa'dî"), distinct de la source éditoriale. */
  sourceAuthor?: string;
  /** Source éditoriale qui a compilé/publié le contenu (ex. "القرآن تدبر وعمل"). */
  editorialSource?: string;
  sourceReference?: string;

  sourceStatus: SourceStatus;
  translationStatus?: ContentStatus;
  explanationStatus?: ContentStatus;

  /**
   * Pour `contentOrigin: "pedagogical_synthesis"` uniquement : identifiants
   * des contenus sources (autres `EtudeContent.id`) sur lesquels la
   * synthèse s'appuie. Une synthèse sans `sourceIds` ne doit jamais être
   * affichée comme fiable (voir `validate-etude-content.mjs`).
   */
  sourceIds?: string[];

  /**
   * Modèle prêt pour `category: "asbab_nuzul"` et `category: "hadith"` —
   * AUCUNE entrée n'existe encore avec ces champs remplis (zéro sabab an-
   * nuzul et zéro hadith suffisamment vérifiés dans le projet à ce jour).
   * Ne jamais déduire un degré d'authenticité : le renseigner uniquement
   * lorsqu'une source reconnue l'établit explicitement.
   */
  /** Recueil du hadith (ex. "Sahih al-Bukhari"), distinct de `editorialSource`. */
  collection?: string;
  /** Degré d'authenticité établi par une source reconnue (hadith ou solidité d'un sabab an-nuzul) — jamais déduit. */
  authenticity?: string;
  /** Ayat concernées par un hadith, quand elles ne forment pas une plage contiguë (contrairement à `verseRange`). */
  relatedVerseKeys?: string[];
}

const ALL_CONTENT: EtudeContent[] = [...AL_FATIHA_CONTENT, ...AL_BAQARA_CONTENT];

/**
 * Contenus réellement rattachés à `verseKey` pour une catégorie donnée,
 * quelle que soit leur portée (ayah unique, plage, sourate entière).
 * N'exclut pas `needs_review` : le statut est affiché, jamais masqué.
 */
export function getEtudeContent(
  verseKey: string,
  category: EtudeCategory,
  pageNumber?: number,
): EtudeContent[] {
  return ALL_CONTENT.filter(
    (c) => c.category === category && concernsVerse(c, verseKey, pageNumber),
  );
}

function concernsVerse(content: EtudeContent, verseKey: string, pageNumber?: number): boolean {
  const [surahNum] = verseKey.split(":").map(Number);

  if (content.scopeType === "surah") {
    return content.surahNumber === surahNum;
  }
  if (content.scopeType === "page") {
    return pageNumber != null && content.pageNumber === pageNumber;
  }
  if (content.scopeType === "verse") {
    return content.verseKey === verseKey;
  }
  if (content.scopeType === "verse_range" && content.verseRange) {
    const [start, end] = content.verseRange.split("-");
    const [s0, a0] = verseKey.split(":").map(Number);
    const [s1, a1] = start.split(":").map(Number);
    const [s2, a2] = end.split(":").map(Number);
    if (s0 !== s1 || s1 !== s2) return false; // jamais entre sourates différentes
    return a0 >= a1 && a0 <= a2;
  }
  return false;
}

/**
 * Contenus d'une catégorie qui concernent une PAGE du Mushaf pour
 * « Vivre cette page » — regroupe tout contenu dont la portée réelle
 * touche au moins une ayah de la page (verse/verse_range/page/surah),
 * sans jamais dupliquer ni forcer une portée plus étroite qu'elle ne
 * l'est réellement dans la source.
 */
export function getPageContent(
  pageNumber: number,
  pageVerseKeys: string[],
  category: EtudeCategory,
): EtudeContent[] {
  const surahsOnPage = new Set(pageVerseKeys.map((k) => Number(k.split(":")[0])));
  return ALL_CONTENT.filter((c) => {
    if (c.category !== category) return false;
    if (c.scopeType === "page") return c.pageNumber === pageNumber;
    if (c.scopeType === "surah") return c.surahNumber != null && surahsOnPage.has(c.surahNumber);
    if (c.scopeType === "verse") return !!c.verseKey && pageVerseKeys.includes(c.verseKey);
    if (c.scopeType === "verse_range" && c.verseRange) {
      const [start, end] = c.verseRange.split("-");
      const [s1, a1] = start.split(":").map(Number);
      const [s2, a2] = end.split(":").map(Number);
      if (s1 !== s2) return false;
      return pageVerseKeys.some((k) => {
        const [s0, a0] = k.split(":").map(Number);
        return s0 === s1 && a0 >= a1 && a0 <= a2;
      });
    }
    return false;
  });
}

/** Libellé d'affichage honnête de la portée d'un contenu multi-ayah/sourate/page. */
export function formatVerseScope(content: EtudeContent): string | null {
  if (content.scopeType === "verse_range" && content.verseRange) {
    return `Concerne les ayat ${content.verseRange.replace("-", "–")}`;
  }
  if (content.scopeType === "surah") {
    return "Concerne l'ensemble de la sourate";
  }
  if (content.scopeType === "page") {
    return `Concerne la page ${content.pageNumber} du Mushaf`;
  }
  return null;
}
