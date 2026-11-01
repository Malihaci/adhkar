/**
 * Affiche une notification. Sur Android (Chrome / PWA installée), le
 * constructeur `new Notification()` est refusé : seule
 * `ServiceWorkerRegistration.showNotification` fonctionne — c'était la cause
 * de « aucune notification n'arrive » sur téléphone. Repli sur le constructeur
 * pour les navigateurs de bureau sans service worker actif.
 */
export async function showAppNotification(
  title: string,
  opts: { body?: string; tag?: string; deepLink?: string; onClick?: () => void },
): Promise<void> {
  const { deepLink, onClick, ...options } = opts;
  try {
    const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration() : undefined;
    if (reg) {
      await reg.showNotification(title, {
        ...options,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        data: { url: deepLink ?? "/" },
      });
      return;
    }
  } catch {
    /* repli ci-dessous */
  }
  try {
    const n = new Notification(title, options);
    n.onclick = () => {
      window.focus();
      onClick?.();
      if (deepLink) window.location.href = deepLink;
    };
  } catch {
    /* navigateur sans notifications */
  }
}
