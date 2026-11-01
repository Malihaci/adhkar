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
const VERSION = "v9";
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

// Clic sur une notification (affichée via registration.showNotification) :
// « Plus tard » prévient l'app (qui reporte le rappel une seule fois) ; sinon
// ramène l'app au premier plan sur la page prévue.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const url = data.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      if (event.action === "snooze") {
        for (const c of list) c.postMessage({ type: "snooze", intent: data.intent, minutes: 30 });
        // App fermée : le report est porté par le serveur (un seul « Plus tard »).
        return snoozeOnServer(data, event.notification);
      }
      for (const c of list) {
        if ("focus" in c) {
          c.focus();
          if ("navigate" in c) return c.navigate(url);
          return;
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});

// ── Web Push (rappels app fermée) ────────────────────────────────────────
// Le serveur envoie un push SANS contenu ; on vient chercher les textes à
// afficher via /api/push/pending (voir src/lib/push-store.server.ts).
function showPushItem(it) {
  const actions = it.cta
    ? [
        { action: "open", title: it.cta },
        { action: "snooze", title: "Plus tard" },
      ]
    : undefined;
  return self.registration.showNotification(it.title, {
    body: it.body || "",
    tag: it.tag,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    ...(actions ? { actions } : {}),
    data: { url: it.url || "/", intent: it.intent, title: it.title, body: it.body, tag: it.tag, cta: it.cta },
  });
}

self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      let items = null;
      try {
        const sub = await self.registration.pushManager.getSubscription();
        if (sub) {
          const res = await fetch("/api/push/pending", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ endpoint: sub.endpoint }),
          });
          if (res.ok) items = (await res.json()).items || [];
        }
      } catch {
        /* réseau indisponible : notification générique ci-dessous */
      }
      if (items === null) items = [{ title: "NurMaLiHa", body: "Un rappel vous attend.", url: "/", tag: "adhkar-generic" }];
      await Promise.all(items.map(showPushItem));
    })(),
  );
});

async function snoozeOnServer(data, notification) {
  try {
    const sub = await self.registration.pushManager.getSubscription();
    if (!sub || !data.title) return;
    await fetch("/api/push/snooze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        endpoint: sub.endpoint,
        minutes: 30,
        item: {
          title: data.title,
          body: data.body || "",
          url: data.url || "/",
          tag: data.tag || notification.tag || "snooze",
          intent: data.intent,
          cta: data.cta,
        },
      }),
    });
  } catch {
    /* best-effort */
  }
}

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

  // Polices du Mushaf par page (KFGQPC « QCF ») — immuables.
  if (url.hostname === "verses.quran.com" && url.pathname.startsWith("/fonts/")) {
    event.respondWith(cacheFirst(request, FONTS));
    return;
  }
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request, FONTS));
    return;
  }
  // Tafsīrs (spa5k/tafsir_api) : immuables, lisibles hors ligne une fois ouverts.
  if (
    (url.hostname === "cdn.jsdelivr.net" || url.hostname === "raw.githubusercontent.com") &&
    url.pathname.includes("tafsir_api")
  ) {
    event.respondWith(cacheFirst(request, DATA));
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
