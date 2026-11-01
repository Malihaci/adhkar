/**
 * NotificationProvider — décide COMMENT notifier (le moteur, lui, décide QUOI
 * et QUAND : reminders.ts / smartReminders.ts). Implémentation Web/PWA ; un
 * futur fournisseur natif (Capacitor) reprendrait la même signature.
 *
 * Sur Android (Chrome / PWA installée), le constructeur `new Notification()`
 * est refusé : seule `ServiceWorkerRegistration.showNotification` fonctionne.
 * Repli sur le constructeur pour les navigateurs de bureau sans service worker.
 * Limite réelle : sans serveur de push, rien n'est émis quand l'application
 * est complètement fermée.
 */
export const LAST_NOTIF_KEY = "adhkar:last-notif-at";

export interface NotifyOptions {
  body?: string;
  tag?: string;
  deepLink?: string;
  /** Intention (id du rappel) — reprise par l'action « Plus tard ». */
  intent?: string;
  /** Libellé du bouton principal ; ajoute « Plus tard » si défini. */
  cta?: string;
  onClick?: () => void;
}

export async function showAppNotification(title: string, opts: NotifyOptions): Promise<void> {
  const { deepLink, onClick, intent, cta, ...options } = opts;
  try {
    localStorage.setItem(LAST_NOTIF_KEY, String(Date.now()));
  } catch {
    /* stockage indisponible */
  }
  try {
    const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration() : undefined;
    if (reg) {
      const actions = cta
        ? [
            { action: "open", title: cta },
            { action: "snooze", title: "Plus tard" },
          ]
        : undefined;
      await reg.showNotification(title, {
        ...options,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        ...(actions ? { actions } : {}),
        data: { url: deepLink ?? "/", intent },
      } as NotificationOptions);
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
