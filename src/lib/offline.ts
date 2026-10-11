/**
 * Mode hors ligne (chantier "Hors ligne") — le Service Worker (public/sw.js)
 * met en cache app + données Coran au fil de l'eau ; ce module ajoute le
 * « pack » à télécharger explicitement (tout le Coran texte/Mushaf/traduction,
 * toutes les routes de l'app) et le stockage de l'AUDIO (Cache API, lu via des
 * URL blob — le SW n'intercepte jamais l'audio).
 *
 * Aucune donnée utilisateur ici : favoris/progression/Wird/paramètres restent
 * en localStorage, jamais touchés par « Supprimer les données hors ligne ».
 */
import {
  basmalaAudioUrl,
  chaptersUrl,
  fetchChapters,
  fullQuranTextUrl,
  pageLayoutUrl,
  verseAudioUrl,
  TOTAL_PAGES,
} from "@/lib/mushaf";
import { hamidullahSuraUrl } from "@/lib/hamidullah";
import { AFASY_AUDIO } from "@/lib/afasyAudio";

export const AUDIO_CACHE = "adhkar-audio-v1";

const STATIC_ROUTES = [
  "/",
  "/matin",
  "/soir",
  "/coucher",
  "/reveil",
  "/sortie",
  "/voyage",
  "/apres-priere",
  "/horaires",
  "/parametres",
  "/favoris",
  "/wird",
  "/khatma",
  "/ecoute",
  "/recherche",
  "/tadabbur",
  "/rappels",
  "/install",
  "/compteur",
  "/defis",
];

export function offlineSupported(): boolean {
  return typeof window !== "undefined" && "caches" in window && "serviceWorker" in navigator;
}

/** Prochaine tâche avec un plafond de parallélisme. */
async function runPool<T>(items: T[], size: number, worker: (item: T) => Promise<void>, stop?: () => boolean) {
  let i = 0;
  const lanes = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length && !stop?.()) {
      const item = items[i++];
      await worker(item);
    }
  });
  await Promise.all(lanes);
}

async function hit(url: string, init?: RequestInit): Promise<boolean> {
  try {
    const res = await fetch(url, init);
    // Le Service Worker met en cache la réponse ; on la vide ici pour libérer.
    await res.arrayBuffer().catch(() => undefined);
    return res.ok;
  } catch {
    return false;
  }
}

/** Fichiers JS/CSS de l'app : on lit l'accueil puis chaque chunk récursivement
 * (les routes chargées à la demande doivent être disponibles hors ligne). */
async function collectAppAssets(): Promise<string[]> {
  const seen = new Set<string>();
  const queue: string[] = [];
  const push = (u: string) => {
    if (!seen.has(u)) {
      seen.add(u);
      queue.push(u);
    }
  };
  const html = await (await fetch("/", { headers: { Accept: "text/html" } })).text();
  for (const m of html.matchAll(/\/assets\/[A-Za-z0-9_.$@-]+\.(?:js|css)/g)) push(m[0]);
  while (queue.length) {
    const url = queue.shift()!;
    if (!url.endsWith(".js")) continue;
    let text = "";
    try {
      const res = await fetch(url);
      text = await res.text();
    } catch {
      continue;
    }
    for (const m of text.matchAll(/["'`(]\.{0,2}\/?((?:assets\/)?[A-Za-z0-9_.$@-]+\.(?:js|css))/g)) {
      push(`/assets/${m[1].replace(/^assets\//, "")}`);
    }
  }
  return [...seen];
}

async function collectFonts(): Promise<string[]> {
  const html = await (await fetch("/", { headers: { Accept: "text/html" } })).text();
  const cssUrls = [...html.matchAll(/https:\/\/fonts\.googleapis\.com\/css2[^"'<>\s]+/g)].map((m) =>
    m[0].replace(/&amp;/g, "&"),
  );
  const files: string[] = [];
  for (const u of cssUrls) {
    try {
      const css = await (await fetch(u)).text();
      for (const m of css.matchAll(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g)) files.push(m[1]);
    } catch {
      /* hors ligne */
    }
  }
  return files;
}

export interface PackProgress {
  done: number;
  total: number;
  label: string;
}

/** App complète + Coran (texte, Mushaf 604 pages, traduction Hamidullah). */
export async function downloadCorePack(
  onProgress: (p: PackProgress) => void,
  shouldStop?: () => boolean,
): Promise<{ failed: number }> {
  try {
    await navigator.storage?.persist?.();
  } catch {
    /* ignoré */
  }
  onProgress({ done: 0, total: 1, label: "Préparation…" });
  const assets = await collectAppAssets().catch(() => [] as string[]);
  const fonts = await collectFonts().catch(() => [] as string[]);

  // `optional` : fichiers déduits par analyse du code (un nom inexistant n'est pas une erreur).
  const jobs: { url: string; init?: RequestInit; optional?: boolean }[] = [
    ...assets.map((url) => ({ url, optional: true })),
    ...fonts.map((url) => ({ url, optional: true })),
    ...STATIC_ROUTES.map((url) => ({ url, init: { headers: { Accept: "text/html" } } as RequestInit })),
    { url: chaptersUrl() },
    { url: fullQuranTextUrl() },
    ...Array.from({ length: TOTAL_PAGES }, (_, i) => ({ url: pageLayoutUrl(i + 1) })),
    ...Array.from({ length: 114 }, (_, i) => ({ url: hamidullahSuraUrl(i + 1) })),
  ];

  let done = 0;
  let failed = 0;
  await runPool(
    jobs,
    6,
    async (job) => {
      const ok = await hit(job.url, job.init);
      if (!ok && !job.optional) failed += 1;
      done += 1;
      if (done % 8 === 0 || done === jobs.length) {
        onProgress({ done, total: jobs.length, label: "Application et Coran (texte)" });
      }
    },
    shouldStop,
  );
  onProgress({ done: jobs.length, total: jobs.length, label: "Terminé" });
  return { failed };
}

/* ------------------------------------------------------------------ audio */

async function audioCache() {
  return caches.open(AUDIO_CACHE);
}

/** Télécharge une liste d'URL audio dans AUDIO_CACHE (CORS requis : si le
 * serveur ne l'autorise pas, le fichier est compté « échoué », jamais
 * stocké de façon inutilisable). */
async function downloadAudioUrls(
  urls: string[],
  label: string,
  onProgress: (p: PackProgress) => void,
  shouldStop?: () => boolean,
): Promise<{ failed: number }> {
  const cache = await audioCache();
  let done = 0;
  let failed = 0;
  onProgress({ done: 0, total: urls.length, label });
  await runPool(
    urls,
    3,
    async (url) => {
      try {
        if (!(await cache.match(url))) {
          const res = await fetch(url, { mode: "cors" });
          if (!res.ok) throw new Error("http");
          await cache.put(url, res);
        }
      } catch {
        failed += 1;
      }
      done += 1;
      onProgress({ done, total: urls.length, label });
    },
    shouldStop,
  );
  return { failed };
}

export function surahAudioUrls(reciterId: string, surah: number, versesCount: number): string[] {
  const urls = Array.from({ length: versesCount }, (_, i) => verseAudioUrl(reciterId, `${surah}:${i + 1}`));
  if (surah !== 1 && surah !== 9) urls.unshift(basmalaAudioUrl(reciterId));
  return urls;
}

export async function downloadSurahAudio(
  reciterId: string,
  surah: number,
  onProgress: (p: PackProgress) => void,
  shouldStop?: () => boolean,
) {
  const chapters = await fetchChapters();
  const ch = chapters.find((c) => c.id === surah);
  if (!ch) return { failed: 1 };
  return downloadAudioUrls(
    surahAudioUrls(reciterId, surah, ch.versesCount),
    `Audio — ${ch.nameFrench}`,
    onProgress,
    shouldStop,
  );
}

export function adhkarAudioUrls(): string[] {
  return [AFASY_AUDIO.morning.src, AFASY_AUDIO.evening.src];
}

export function downloadAdhkarAudio(onProgress: (p: PackProgress) => void, shouldStop?: () => boolean) {
  return downloadAudioUrls(adhkarAudioUrls(), "Audio des Adhkār (matin et soir)", onProgress, shouldStop);
}

export async function isAudioCached(url: string): Promise<boolean> {
  if (!offlineSupported()) return false;
  try {
    return !!(await (await audioCache()).match(url));
  } catch {
    return false;
  }
}

export async function countCachedSurahVerses(reciterId: string, surah: number, versesCount: number): Promise<number> {
  if (!offlineSupported()) return 0;
  const cache = await audioCache();
  let n = 0;
  for (let a = 1; a <= versesCount; a++) {
    if (await cache.match(verseAudioUrl(reciterId, `${surah}:${a}`))) n += 1;
  }
  return n;
}

/** URL blob d'un audio stocké hors ligne, ou `null`. À révoquer par l'appelant. */
export async function cachedAudioBlobUrl(url: string): Promise<string | null> {
  if (!offlineSupported()) return null;
  try {
    const res = await (await audioCache()).match(url);
    if (!res) return null;
    return URL.createObjectURL(await res.blob());
  } catch {
    return null;
  }
}

/** Hors connexion : privilégie la copie locale ; en ligne : l'URL distante
 * (lecture immédiate, sans attendre le cache). */
export async function resolveAudioSrc(url: string): Promise<string> {
  if (typeof navigator !== "undefined" && navigator.onLine) return url;
  return (await cachedAudioBlobUrl(url)) ?? url;
}

/* ----------------------------------------------------------------- statut */

export interface OfflineStatus {
  usageMb: number | null;
  quotaMb: number | null;
  persisted: boolean | null;
  pagesCached: number;
  audioFiles: number;
}

export async function getOfflineStatus(): Promise<OfflineStatus> {
  const est = await navigator.storage?.estimate?.().catch(() => undefined);
  const persisted = (await navigator.storage?.persisted?.().catch(() => undefined)) ?? null;
  let pagesCached = 0;
  let audioFiles = 0;
  if (offlineSupported()) {
    try {
      const keys = await caches.keys();
      for (const k of keys) {
        const c = await caches.open(k);
        if (k.startsWith("adhkar-data-")) {
          const reqs = await c.keys();
          pagesCached += reqs.filter((r) => r.url.includes("/verses/by_page/")).length;
        }
        if (k === AUDIO_CACHE) audioFiles = (await c.keys()).length;
      }
    } catch {
      /* ignoré */
    }
  }
  return {
    usageMb: est?.usage != null ? Math.round(est.usage / 1048576) : null,
    quotaMb: est?.quota != null ? Math.round(est.quota / 1048576) : null,
    persisted,
    pagesCached,
    audioFiles,
  };
}

/** Efface UNIQUEMENT les caches hors ligne (jamais localStorage). */
export async function clearOfflineData(): Promise<void> {
  if (!offlineSupported()) return;
  const keys = await caches.keys();
  await Promise.all(keys.filter((k) => k.startsWith("adhkar-")).map((k) => caches.delete(k)));
}
