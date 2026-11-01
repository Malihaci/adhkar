/**
 * Abonnement Web Push + synchronisation du planning de rappels avec le serveur
 * (notifications même application fermée). Voir push-store.server.ts / pushSchedule.ts.
 */
import { useEffect } from "react";
import { buildPushSchedule } from "@/lib/pushSchedule";

const SIG_KEY = "adhkar:push-sync-sig";
const KEY_USED = "adhkar:push-vapid";
const SYNC_EVERY_MS = 6 * 3600_000;

export type PushState =
  | { kind: "unsupported" }
  | { kind: "denied" }
  | { kind: "off" } // pas encore abonné
  | { kind: "on"; lastTick: number | null } // abonné ; lastTick = dernier passage du planificateur
  | { kind: "server-missing" }; // Redis non relié côté serveur

export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

function urlBase64ToUint8Array(b64: string): Uint8Array<ArrayBuffer> {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function getRegistration() {
  return (await navigator.serviceWorker.getRegistration()) ?? (await navigator.serviceWorker.ready);
}

async function fetchServerKey(): Promise<{ publicKey: string; lastTick: number | null } | null> {
  try {
    const res = await fetch("/api/push/key", { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getPushState(): Promise<PushState> {
  if (!pushSupported()) return { kind: "unsupported" };
  if (Notification.permission === "denied") return { kind: "denied" };
  const server = await fetchServerKey();
  if (!server) return { kind: "server-missing" };
  const reg = await getRegistration();
  const sub = await reg.pushManager.getSubscription();
  if (!sub || Notification.permission !== "granted") return { kind: "off" };
  return { kind: "on", lastTick: server.lastTick };
}

async function postSync(endpoint: string): Promise<boolean> {
  const schedule = await buildPushSchedule();
  const sig = JSON.stringify(schedule.map((i) => [i.at, i.tag, i.body, i.url]));
  try {
    const prev = JSON.parse(localStorage.getItem(SIG_KEY) ?? "null") as { sig: string; at: number } | null;
    if (prev && prev.sig === sig && Date.now() - prev.at < SYNC_EVERY_MS) return true;
  } catch {
    /* stockage indisponible : on synchronise */
  }
  const res = await fetch("/api/push/sync", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ endpoint, schedule }),
  });
  if (res.ok) {
    try {
      localStorage.setItem(SIG_KEY, JSON.stringify({ sig, at: Date.now() }));
    } catch {
      /* ignoré */
    }
  }
  return res.ok;
}

/** Demande l'autorisation, abonne l'appareil et envoie le planning. */
export async function enablePush(): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!pushSupported()) return { ok: false, reason: "Ce navigateur ne gère pas les notifications push." };
  const perm = Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;
  if (perm !== "granted") return { ok: false, reason: "Autorisation refusée dans les réglages du navigateur." };
  const server = await fetchServerKey();
  if (!server) return { ok: false, reason: "Le serveur de notifications n'est pas encore activé (stockage Redis manquant)." };
  const reg = await getRegistration();
  let sub = await reg.pushManager.getSubscription();
  const usedKey = localStorage.getItem(KEY_USED);
  if (sub && usedKey && usedKey !== server.publicKey) {
    await sub.unsubscribe().catch(() => {});
    sub = null;
  }
  if (!sub) {
    try {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(server.publicKey),
      });
    } catch {
      return { ok: false, reason: "Abonnement impossible sur cet appareil (installez l'app sur l'écran d'accueil si besoin)." };
    }
    try {
      localStorage.setItem(KEY_USED, server.publicKey);
    } catch {
      /* ignoré */
    }
  }
  try {
    localStorage.removeItem(SIG_KEY);
  } catch {
    /* ignoré */
  }
  const ok = await postSync(sub.endpoint).catch(() => false);
  return ok ? { ok: true } : { ok: false, reason: "Envoi du planning au serveur impossible." };
}

export async function disablePush(): Promise<void> {
  const reg = await getRegistration();
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    await fetch("/api/push/sync", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ endpoint: sub.endpoint, schedule: [] }),
    }).catch(() => {});
    await sub.unsubscribe().catch(() => {});
  }
  try {
    localStorage.removeItem(SIG_KEY);
  } catch {
    /* ignoré */
  }
}

/** Envoie tout de suite une vraie notification push (test de bout en bout). */
export async function sendPushTest(): Promise<{ ok: boolean; message: string }> {
  const reg = await getRegistration();
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return { ok: false, message: "Notifications push non activées." };
  try {
    const res = await fetch("/api/push/test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ endpoint: sub.endpoint }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; status?: number };
    if (res.ok && data.ok) return { ok: true, message: "Envoyée — elle doit apparaître dans quelques secondes." };
    return { ok: false, message: data.error ?? `Le service de notifications a répondu ${data.status ?? res.status}.` };
  } catch {
    return { ok: false, message: "Serveur injoignable." };
  }
}

/**
 * À monter une fois à la racine : tant que l'appareil est abonné, recalcule le
 * planning chaque minute (et au retour sur l'app) et ne l'envoie que s'il a changé.
 */
export function usePushSync() {
  useEffect(() => {
    if (!pushSupported()) return;
    let stopped = false;
    const run = async () => {
      if (stopped || Notification.permission !== "granted") return;
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        const sub = await reg?.pushManager.getSubscription();
        if (sub) await postSync(sub.endpoint);
      } catch {
        /* réessai à la prochaine minute */
      }
    };
    const first = window.setTimeout(run, 4000);
    const id = window.setInterval(run, 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void run();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      window.clearTimeout(first);
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
}
