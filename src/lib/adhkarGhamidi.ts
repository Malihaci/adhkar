/**
 * Deuxième profil audio Adhkār — Cheikh Sa‘d al-Ghāmidî (§14-17 mission
 * "Lecture Coran + Adhkār + Audio + Paramètres").
 *
 * RECHERCHE DE LICENCE EFFECTUÉE (avant toute intégration, comme demandé) :
 * la source indiquée (mashreqspace.net/Douaa/.../Ecouter) est un site
 * d'agrégation communautaire portant uniquement la mention "MashreqSpace ©
 * 2016" — aucune page de conditions d'utilisation, aucune mention explicite
 * de licence de réutilisation/redistribution, aucune autorisation pour une
 * application tierce. La disponibilité au téléchargement n'équivaut pas à
 * une autorisation de redistribution (rappel explicite de la mission). La
 * référence YouTube fournie ne peut pas non plus être utilisée : en extraire
 * l'audio violerait les conditions d'utilisation de YouTube ("Ne mets pas en
 * place un téléchargement YouTube non autorisé").
 *
 * DÉCISION : aucun fichier n'est intégré. Cette architecture est préparée
 * pour recevoir, le jour où une source réellement autorisée (licence
 * explicite, accord de l'ayant droit, ou enregistrement propre) est fournie :
 * - `GHAMIDI_AUDIO_SRC` : URL/asset du fichier continu unique (jamais 30
 *   petits mp3 recollés, voir §19 mission) — actuellement `null`.
 * - `GHAMIDI_MANIFEST` : un timestamp réel par dhikr (`startMs`/`endMs`),
 *   mesuré à l'écoute du VRAI fichier fourni — jamais estimé à partir du
 *   nombre de mots, de la longueur du texte ou d'une division uniforme
 *   (interdiction explicite §16). Vide tant qu'aucun fichier n'existe : on
 *   ne fabrique jamais de timestamps de substitution.
 *
 * Fichier requis pour activer ce profil : un enregistrement continu
 * (matin ET soir, ou deux fichiers séparés) de Sa‘d al-Ghāmidî récitant les
 * adhkār du matin/soir, dont l'utilisation dans cette application est
 * explicitement autorisée par l'ayant droit — en commençant, comme demandé,
 * à "أعوذ بالله من الشيطان الرجيم" (sans l'introduction ambiance/oiseaux).
 */
import type { DhikrCategory } from "@/data/adhkar";

export interface GhamidiSegment {
  profile: "ghamdi";
  category: DhikrCategory;
  dhikrId: string;
  /** Millisecondes dans le fichier continu — mesurées sur le vrai
   * enregistrement, jamais estimées. */
  startMs: number;
  endMs: number;
}

/** `null` tant qu'aucune source légalement vérifiée n'est disponible — voir
 * le commentaire de fichier ci-dessus pour le résultat de la recherche. */
export const GHAMIDI_AUDIO_SRC: string | null = null;

/** Vide par construction — voir le commentaire de fichier. */
export const GHAMIDI_MANIFEST: GhamidiSegment[] = [];

export function getGhamidiSegment(dhikrId: string): GhamidiSegment | null {
  return GHAMIDI_MANIFEST.find((s) => s.dhikrId === dhikrId) ?? null;
}

export const GHAMIDI_UNAVAILABLE_REASON =
  "Aucun fichier audio de Sa‘d al-Ghâmidî dont l'utilisation dans l'application est vérifiée et autorisée n'a été trouvé pour l'instant — cette voix reste indisponible tant qu'une source légitime n'est pas fournie.";
