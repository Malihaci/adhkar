// Service worker minimal — critère d'installabilité PWA uniquement
// (chantier "Plein écran paysage + Installation"). Aucune stratégie de
// cache : chaque requête part réellement au réseau, pour ne jamais servir
// une version figée de l'app après déploiement ni risquer de perdre des
// données utilisateur (favoris/progression/Wird/paramètres vivent dans
// localStorage, jamais dans un cache de ce Service Worker).
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Un gestionnaire `fetch` présent (même sans interception) reste un des
// critères historiques d'installabilité Chrome — on laisse systématiquement
// passer au réseau.
self.addEventListener("fetch", () => {});
