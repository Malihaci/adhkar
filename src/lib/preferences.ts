/**
 * Centre unique de préférences (chantier "Paramètres intelligents et
 * centralisés") — AVANT ce fichier, chaque écran avait sa propre clé
 * localStorage indépendante pour des réglages qui se recoupaient
 * conceptuellement (taille de texte, phonétique, récitateur…) :
 * `adhkar:reading-layers` (lire/$surah), `adhkar:tajweed-mode` +
 * `adhkar:mushaf-text-size` (Mushaf), `adhkar:phonetic` + `adhkar:font-size`
 * (DhikrViewer). Ce module les remplace par UN SEUL objet `AppPreferences`
 * versionné, avec des sous-sections indépendantes (`quran`, `adhkar`,
 * `general`) — Coran et Adhkār restent des réglages séparés, jamais
 * mélangés, mais partagent la même architecture de stockage/réactivité que
 * `useLocalState` (même storage.ts, même événement `adhkar-storage`).
 *
 * Migration : au tout premier accès, si `adhkar:preferences` n'existe pas
 * encore, les anciennes clés ci-dessus sont lues (avec leurs anciennes
 * valeurs par défaut) pour construire le modèle central, qui est ensuite
 * écrit immédiatement — idempotent (la migration ne se rejoue jamais une
 * fois la clé centrale présente), sans perte, sans dupliquer le réglage.
 * Les anciennes clés ne sont pas supprimées (au cas où, mais plus lues par
 * l'application une fois ce chantier terminé).
 */
import { useCallback, useEffect, useState } from "react";
import { readJSON, writeJSON } from "@/lib/storage";

export type ReadingSize = "normal" | "large" | "xlarge";

export interface QuranPreferences {
  arabic: boolean;
  francais: boolean;
  phonetique: boolean;
  /** Purement visuel (couleurs) — n'a de sens que si `arabic` est actif. */
  tajweed: boolean;
  textSize: ReadingSize;
  reciterId: string;
  speed: number;
}

/** "afasy" = piste continue existante (Al-'Afâsy, voir src/lib/afasyAudio.ts
 * et /ecoute) pour "Tout écouter" — "ghamdi" = second profil demandé (§14-17
 * mission) ; voir src/lib/adhkarGhamidi.ts pour son état réel (aucun fichier
 * autorisé trouvé à ce jour, jamais un audio de repli fabriqué à sa place). */
export type AdhkarAudioProfile = "afasy" | "ghamdi";

export interface AdhkarPreferences {
  arabic: boolean;
  francais: boolean;
  phonetique: boolean;
  textSize: ReadingSize;
  speed: number;
  audioProfile: AdhkarAudioProfile;
  /** Enchaîne automatiquement l'audio du dhikr suivant quand disponible. */
  continuous: boolean;
}

export interface GeneralPreferences {
  /** Limite les transitions/animations visuelles (§17 mission — pas de
   * "mode senior" séparé, juste une préférence simple). */
  reduceMotion: boolean;
}

export interface AppPreferences {
  v: 1;
  /** Premier lancement déjà passé — l'assistant ne doit plus jamais
   * réapparaître automatiquement une fois à `true`. */
  onboarded: boolean;
  quran: QuranPreferences;
  adhkar: AdhkarPreferences;
  general: GeneralPreferences;
}

const PREFS_KEY = "adhkar:preferences";

export const DEFAULT_QURAN: QuranPreferences = {
  arabic: true,
  francais: false,
  phonetique: false,
  tajweed: false,
  textSize: "large",
  reciterId: "minshawi",
  speed: 1,
};

export const DEFAULT_ADHKAR: AdhkarPreferences = {
  arabic: true,
  francais: true,
  phonetique: false,
  textSize: "large",
  speed: 1,
  audioProfile: "afasy",
  continuous: false,
};

export const DEFAULT_GENERAL: GeneralPreferences = { reduceMotion: false };

export const DEFAULT_PREFERENCES: AppPreferences = {
  v: 1,
  onboarded: false,
  quran: DEFAULT_QURAN,
  adhkar: DEFAULT_ADHKAR,
  general: DEFAULT_GENERAL,
};

/** Fraction de mushaf-text-size (ancien réglage, 0..1) → niveau sémantique. */
function legacyMushafFractionToSize(f: number): ReadingSize {
  if (f >= 0.95) return "xlarge";
  if (f >= 0.8) return "large";
  return "normal";
}

const LEGACY_KEYS = [
  "adhkar:reading-layers",
  "adhkar:mushaf-text-size",
  "adhkar:tajweed-mode",
  "adhkar:phonetic",
  "adhkar:font-size",
] as const;

/** Un utilisateur avec au moins une ancienne clé a déjà réglé l'app — ne
 * jamais lui remontrer l'assistant. Un utilisateur vraiment nouveau
 * (aucune clé, même absente) doit au contraire le voir une fois. */
function hadAnyLegacyPreference(): boolean {
  return LEGACY_KEYS.some((k) => window.localStorage.getItem(k) !== null);
}

function migrateLegacy(): AppPreferences {
  const layers = readJSON<{ arabic: boolean; francais: boolean; phonetique: boolean }>(
    "adhkar:reading-layers",
    { arabic: true, francais: true, phonetique: false },
  );
  const mushafTextSizeFraction = readJSON<number>("adhkar:mushaf-text-size", 0.86);
  const tajweed = readJSON<boolean>("adhkar:tajweed-mode", false);
  const adhkarPhonetic = readJSON<boolean>("adhkar:phonetic", false);
  const adhkarFontSize = readJSON<ReadingSize>("adhkar:font-size", "large");

  return {
    v: 1,
    onboarded: hadAnyLegacyPreference(),
    quran: {
      ...DEFAULT_QURAN,
      arabic: layers.arabic,
      francais: layers.francais,
      phonetique: layers.phonetique,
      tajweed,
      textSize: legacyMushafFractionToSize(mushafTextSizeFraction),
    },
    adhkar: {
      ...DEFAULT_ADHKAR,
      phonetique: adhkarPhonetic,
      textSize: adhkarFontSize,
    },
    general: DEFAULT_GENERAL,
  };
}

function loadPreferences(): AppPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (raw) {
      // Fusion PAR SECTION (jamais un simple spread plat) : une version
      // antérieure de `adhkar:preferences` (chantier précédent) n'a pas les
      // champs ajoutés depuis (ex. audioProfile/continuous) — un spread plat
      // remplacerait tout `adhkar`/`quran` déjà enregistré et perdrait ces
      // nouveaux champs (undefined), au lieu de simplement les compléter.
      const parsed = JSON.parse(raw) as Partial<AppPreferences>;
      return {
        ...DEFAULT_PREFERENCES,
        ...parsed,
        quran: { ...DEFAULT_QURAN, ...parsed.quran },
        adhkar: { ...DEFAULT_ADHKAR, ...parsed.adhkar },
        general: { ...DEFAULT_GENERAL, ...parsed.general },
      };
    }
  } catch {
    /* ignore, repli sur la migration/valeurs par défaut */
  }
  const migrated = migrateLegacy();
  writeJSON(PREFS_KEY, migrated);
  return migrated;
}

/**
 * Hook unique pour lire/écrire les préférences centrales. Même pattern
 * d'hydratation que `useLocalState` (valeur par défaut au premier rendu
 * pour rester SSR-safe, lecture réelle après montage) — réactif entre
 * composants via le même événement `adhkar-storage`.
 */
export function usePreferences() {
  const [prefs, setPrefsState] = useState<AppPreferences>(DEFAULT_PREFERENCES);
  /** `false` le temps très court avant l'hydratation (SSR-safe) — permet à
   * l'appelant (ex. l'assistant de premier lancement) de ne jamais se fier à
   * `onboarded === false` avant d'avoir réellement lu le stockage, sous
   * peine d'un flash de l'assistant à chaque rechargement pour un
   * utilisateur déjà réglé. */
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrefsState(loadPreferences());
    setHydrated(true);
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key?: string } | undefined;
      if (!detail || detail.key === PREFS_KEY) setPrefsState(loadPreferences());
    };
    window.addEventListener("adhkar-storage", onChange);
    return () => window.removeEventListener("adhkar-storage", onChange);
  }, []);

  const update = useCallback((updater: (prev: AppPreferences) => AppPreferences) => {
    setPrefsState((prev) => {
      const next = updater(prev);
      writeJSON(PREFS_KEY, next);
      return next;
    });
  }, []);

  const updateQuran = useCallback(
    (patch: Partial<QuranPreferences>) =>
      update((prev) => ({ ...prev, quran: { ...prev.quran, ...patch } })),
    [update],
  );
  const updateAdhkar = useCallback(
    (patch: Partial<AdhkarPreferences>) =>
      update((prev) => ({ ...prev, adhkar: { ...prev.adhkar, ...patch } })),
    [update],
  );
  const updateGeneral = useCallback(
    (patch: Partial<GeneralPreferences>) =>
      update((prev) => ({ ...prev, general: { ...prev.general, ...patch } })),
    [update],
  );
  const completeOnboarding = useCallback(
    () => update((prev) => ({ ...prev, onboarded: true })),
    [update],
  );

  return { prefs, hydrated, updateQuran, updateAdhkar, updateGeneral, completeOnboarding };
}
