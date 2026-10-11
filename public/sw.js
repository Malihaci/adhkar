// Service Worker — application utilisable HORS LIGNE (chantier "Hors ligne").
//
// Principes :
//  - Aucune donnée utilisateur ici : favoris, progression, Wird, paramètres
//    vivent en localStorage, jamais dans ces caches.
//  - `/assets/*` (noms hachés = immuables) : cache d'abord.
//  - Pages (HTML) : réseau d'abord (nouveau déploiement toujours prioritaire),
//    repli sur le cache, puis sur l'accueil mis en cache.
//  - Données Coran (api.quran.com, QuranEnc, alquran.cloud) : immuables →
//    cache d'abord. Heures de prière (aladhan) : réseau d'abord.
//  - Polices Google : cache d'abord.
//  - Audio : JAMAIS intercepté ici (requêtes Range, gros fichiers) ; l'audio
//    hors ligne est stocké par l'application dans AUDIO_CACHE et lu via des
//    URL blob (voir src/lib/offline.ts).
// Changer VERSION nettoie les anciens caches (AUDIO_CACHE est conservé).
const VERSION = "v3";
const SHELL = `adhkar-shell-${VERSION}`;
const ASSETS = `adhkar-assets-${VERSION}`;
const DATA = `adhkar-data-${VERSION}`;
const FONTS = `adhkar-fonts-${VERSION}`;
const KEEP = new Set([SHELL, ASSETS, DATA, FONTS, "adhkar-audio-v1"]);

const DATA_HOSTS = ["api.quran.com", "quranenc.com", "api.alquran.cloud"];
const NETWORK_FIRST_HOSTS = ["api.aladhan.com"];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((c) =>
        Promise.allSettled(
          ["/", "/manifest.webmanifest", "/icon-192.png", "/favicon.ico"].map((u) => c.add(u)),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !KEEP.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) cache.put(request, res.clone()).catch(() => {});
  return res;
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

async function networkFirst(request, cacheName, timeoutMs, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const res = await withTimeout(fetch(request), timeoutMs);
    if (res.ok) cache.put(request, res.clone()).catch(() => {});
    return res;
  } catch (err) {
    const hit = await cache.match(request, { ignoreSearch: true });
    if (hit) return hit;
    if (fallbackUrl) {
      const shell = await cache.match(fallbackUrl);
      if (shell) return shell;
    }
    throw err;
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  // Audio / gros fichiers : jamais interceptés.
  if (request.headers.has("range")) return;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    const accept = request.headers.get("accept") || "";
    // Pages (navigations + fetch() HTML du « pack hors ligne »)
    if (request.mode === "navigate" || accept.includes("text/html")) {
      event.respondWith(networkFirst(request, SHELL, 3500, "/"));
      return;
    }
    if (url.pathname.startsWith("/assets/")) {
      event.respondWith(cacheFirst(request, ASSETS));
      return;
    }
    if (
      url.pathname.startsWith("/tafsir/") ||
      url.pathname.startsWith("/icon-") ||
      url.pathname === "/favicon.ico" ||
      url.pathname === "/manifest.webmanifest" ||
      url.pathname === "/apple-touch-icon.png"
    ) {
      event.respondWith(networkFirst(request, DATA, 3500));
      return;
    }
    return; // /api/*, fonctions serveur, dev (/@vite…) : réseau
  }

  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request, FONTS));
    return;
  }
  if (DATA_HOSTS.includes(url.hostname) && !url.pathname.includes("/search")) {
    event.respondWith(cacheFirst(request, DATA));
    return;
  }
  if (NETWORK_FIRST_HOSTS.includes(url.hostname)) {
    event.respondWith(networkFirst(request, DATA, 5000));
  }
});
