/**
 * Notifications Web Push (app fermée / téléphone verrouillé) — côté serveur.
 *
 * Principe (aucune dépendance npm) :
 * - le client envoie son abonnement push + un PLANNING de rappels déjà calculés
 *   (instants absolus, textes, liens) — voir src/lib/pushSchedule.ts ;
 * - un planificateur externe appelle /api/push/tick chaque minute ; le serveur
 *   envoie alors un push SANS charge utile (seule l'authentification VAPID est
 *   nécessaire, pas de chiffrement) ; le service worker vient chercher le texte
 *   via /api/push/pending puis affiche la notification ;
 * - tout est stocké dans le même Redis REST (Upstash) que les défis partagés.
 * Les clés VAPID sont générées une fois et conservées dans Redis.
 */
import { z } from "zod";
import { redisConfig, StorageUnavailableError } from "@/lib/challenge-store.server";

const SUBJECT = "https://adhkar-gamma.vercel.app";
const MINUTE = 60_000;
const MAX_LATE_MS = 2 * 60 * MINUTE; // un rappel manqué de plus de 2 h n'est plus envoyé
const PUSH_TTL_S = 4 * 3600;
const PENDING_TTL_S = 6 * 3600;
const DEVICE_TTL_S = 45 * 86400;
const MAX_SNOOZE = 20;

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Seuls les services de push des navigateurs sont autorisés comme cible (anti-SSRF). */
function allowedEndpoint(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return false;
    const h = u.hostname;
    return (
      h === "fcm.googleapis.com" ||
      h.endsWith(".push.services.mozilla.com") ||
      h === "web.push.apple.com" ||
      h.endsWith(".push.apple.com") ||
      h.endsWith(".notify.windows.com")
    );
  } catch {
    return false;
  }
}

const itemSchema = z.object({
  at: z.number().int().positive(),
  title: z.string().trim().min(1).max(120),
  body: z.string().max(300).default(""),
  url: z.string().max(300).regex(/^\//),
  tag: z.string().max(120),
  intent: z.string().max(120).optional(),
  cta: z.string().max(40).optional(),
});
export type PushItem = z.infer<typeof itemSchema>;

const endpointSchema = z.string().max(1000).refine(allowedEndpoint, "endpoint refusé");
const syncSchema = z.object({ endpoint: endpointSchema, schedule: z.array(itemSchema).max(120) });
const endpointOnly = z.object({ endpoint: endpointSchema });
const snoozeSchema = z.object({
  endpoint: endpointSchema,
  item: itemSchema.omit({ at: true }),
  minutes: z.number().int().min(1).max(240).default(30),
});

interface DeviceRecord {
  endpoint: string;
  schedule: PushItem[];
  snooze: PushItem[];
  updated: number;
}

// ───────────────────────── Redis ─────────────────────────

async function redis(cmds: (string | number)[][]) {
  const cfg = redisConfig();
  if (!cfg) throw new StorageUnavailableError("no storage");
  const res = await fetch(`${cfg.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
  });
  if (!res.ok) throw new StorageUnavailableError("redis " + res.status);
  return (await res.json()) as { result?: unknown; error?: string }[];
}

async function deviceId(endpoint: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(endpoint));
  return Array.from(new Uint8Array(buf).slice(0, 16), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function loadDevice(id: string): Promise<DeviceRecord | null> {
  const [r] = await redis([["GET", `push:d:${id}`]]);
  return typeof r.result === "string" ? (JSON.parse(r.result) as DeviceRecord) : null;
}

async function saveDevice(id: string, rec: DeviceRecord) {
  const times = [...rec.schedule, ...rec.snooze].map((i) => i.at);
  const cmds: (string | number)[][] = [["SET", `push:d:${id}`, JSON.stringify(rec), "EX", DEVICE_TTL_S]];
  cmds.push(times.length ? ["ZADD", "push:due", Math.min(...times), id] : ["ZREM", "push:due", id]);
  await redis(cmds);
}

async function dropDevice(id: string) {
  await redis([["DEL", `push:d:${id}`], ["DEL", `push:p:${id}`], ["ZREM", "push:due", id]]);
}

// ───────────────────────── VAPID ─────────────────────────

const b64url = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const textB64url = (s: string) => b64url(new TextEncoder().encode(s));

interface Vapid {
  publicKey: string;
  privateKey: CryptoKey;
}
let vapidCache: Vapid | null = null;

async function getVapid(): Promise<Vapid> {
  if (vapidCache) return vapidCache;
  const [r] = await redis([["GET", "push:vapid"]]);
  let stored: { publicKey: string; jwk: JsonWebKey } | null =
    typeof r.result === "string" ? JSON.parse(r.result) : null;
  if (!stored) {
    const pair = (await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, [
      "sign",
      "verify",
    ])) as CryptoKeyPair;
    const candidate = {
      publicKey: b64url(await crypto.subtle.exportKey("raw", pair.publicKey)),
      jwk: await crypto.subtle.exportKey("jwk", pair.privateKey),
    };
    // NX : si deux requêtes initialisent en même temps, une seule paire gagne.
    await redis([["SET", "push:vapid", JSON.stringify(candidate), "NX"]]);
    const [again] = await redis([["GET", "push:vapid"]]);
    stored = typeof again.result === "string" ? JSON.parse(again.result) : candidate;
  }
  const privateKey = await crypto.subtle.importKey(
    "jwk",
    stored!.jwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  vapidCache = { publicKey: stored!.publicKey, privateKey };
  return vapidCache;
}

async function vapidHeader(endpoint: string): Promise<string> {
  const { publicKey, privateKey } = await getVapid();
  const head = textB64url(JSON.stringify({ typ: "JWT", alg: "ES256" }));
  const claims = textB64url(
    JSON.stringify({
      aud: new URL(endpoint).origin,
      exp: Math.floor(Date.now() / 1000) + 12 * 3600,
      sub: SUBJECT,
    }),
  );
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    new TextEncoder().encode(`${head}.${claims}`),
  );
  return `vapid t=${head}.${claims}.${b64url(sig)}, k=${publicKey}`;
}

/** Push sans charge utile : réveille le service worker, qui récupère le texte. */
async function sendPush(endpoint: string): Promise<number> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: await vapidHeader(endpoint),
      TTL: String(PUSH_TTL_S),
      Urgency: "high",
      "Content-Length": "0",
    },
  });
  return res.status;
}

// ───────────────────────── Handlers ─────────────────────────

function fail(e: unknown): Response {
  if (e instanceof StorageUnavailableError) {
    return json(
      { error: "Le stockage Redis n'est pas encore relié à ce serveur.", code: "storage_unavailable" },
      503,
    );
  }
  if (e instanceof z.ZodError) return json({ error: "Données invalides." }, 400);
  console.error(e);
  return json({ error: "Erreur serveur." }, 500);
}

export async function handleKey(): Promise<Response> {
  try {
    const { publicKey } = await getVapid();
    const [t] = await redis([["GET", "push:lasttick"]]);
    return json({ publicKey, lastTick: t.result ? Number(t.result) : null });
  } catch (e) {
    return fail(e);
  }
}

export async function handleSync(request: Request): Promise<Response> {
  try {
    const { endpoint, schedule } = syncSchema.parse(await request.json());
    const id = await deviceId(endpoint);
    const now = Date.now();
    const old = await loadDevice(id);
    const rec: DeviceRecord = {
      endpoint,
      schedule: schedule.filter((i) => i.at > now - MAX_LATE_MS),
      snooze: (old?.snooze ?? []).filter((i) => i.at > now - MAX_LATE_MS),
      updated: now,
    };
    await saveDevice(id, rec);
    return json({ ok: true, count: rec.schedule.length });
  } catch (e) {
    return fail(e);
  }
}

export async function handleSnooze(request: Request): Promise<Response> {
  try {
    const { endpoint, item, minutes } = snoozeSchema.parse(await request.json());
    const id = await deviceId(endpoint);
    const now = Date.now();
    const rec = (await loadDevice(id)) ?? { endpoint, schedule: [], snooze: [], updated: now };
    // Un seul report en attente par rappel (même tag).
    rec.snooze = rec.snooze.filter((i) => i.tag !== item.tag).slice(-(MAX_SNOOZE - 1));
    rec.snooze.push({ ...item, at: now + minutes * MINUTE });
    await saveDevice(id, rec);
    return json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

/** Le service worker réclame les notifications à afficher (et les vide). */
export async function handlePending(request: Request): Promise<Response> {
  try {
    const { endpoint } = endpointOnly.parse(await request.json());
    const id = await deviceId(endpoint);
    const [list] = await redis([["LRANGE", `push:p:${id}`, 0, -1], ["DEL", `push:p:${id}`]]);
    const raw = Array.isArray(list.result) ? (list.result as string[]) : [];
    return json({ items: raw.map((s) => JSON.parse(s) as PushItem) });
  } catch (e) {
    return fail(e);
  }
}

/** Test de bout en bout : envoie tout de suite une vraie notification push. */
export async function handleTest(request: Request): Promise<Response> {
  try {
    const { endpoint } = endpointOnly.parse(await request.json());
    const id = await deviceId(endpoint);
    const [gate] = await redis([["SET", `push:testgate:${id}`, "1", "NX", "EX", 8]]);
    if (gate.result !== "OK") return json({ error: "Patientez quelques secondes." }, 429);
    const item: PushItem = {
      at: Date.now(),
      title: "Notification de test",
      body: "Si vous voyez ceci, les rappels arriveront même application fermée.",
      url: "/rappels",
      tag: "push-test",
    };
    await redis([["RPUSH", `push:p:${id}`, JSON.stringify(item)], ["EXPIRE", `push:p:${id}`, PENDING_TTL_S]]);
    const status = await sendPush(endpoint);
    if (status === 404 || status === 410) {
      await dropDevice(id);
      return json({ ok: false, status, error: "Abonnement expiré : réactivez les notifications." }, 410);
    }
    return json({ ok: status >= 200 && status < 300, status });
  } catch (e) {
    return fail(e);
  }
}

/** Planificateur : appelé chaque minute par un cron externe. */
export async function handleTick(request: Request): Promise<Response> {
  try {
    const secret = process.env["CRON_SECRET"];
    if (secret) {
      const url = new URL(request.url);
      const given =
        request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? url.searchParams.get("key");
      if (given !== secret) return json({ error: "Non autorisé." }, 401);
    }
    const now = Date.now();
    const [lock] = await redis([["SET", "push:lock", "1", "NX", "EX", 40]]);
    if (lock.result !== "OK") return json({ ok: true, skipped: "déjà en cours" });
    await redis([["SET", "push:lasttick", now]]);

    const [due] = await redis([["ZRANGEBYSCORE", "push:due", "-inf", now, "LIMIT", 0, 300]]);
    const ids = Array.isArray(due.result) ? (due.result as string[]) : [];
    let sent = 0;
    let dropped = 0;

    const handle = async (id: string) => {
      const rec = await loadDevice(id);
      if (!rec) {
        await redis([["ZREM", "push:due", id]]);
        return;
      }
      const all = [...rec.schedule, ...rec.snooze];
      const fresh = all.filter((i) => i.at <= now && i.at >= now - MAX_LATE_MS);
      const keepSchedule = rec.schedule.filter((i) => i.at > now);
      const keepSnooze = rec.snooze.filter((i) => i.at > now);
      if (fresh.length) {
        await redis([
          ...fresh.map((i) => ["RPUSH", `push:p:${id}`, JSON.stringify(i)]),
          ["EXPIRE", `push:p:${id}`, PENDING_TTL_S],
        ]);
        const status = await sendPush(rec.endpoint);
        if (status === 404 || status === 410) {
          await dropDevice(id);
          dropped++;
          return;
        }
        if (status < 200 || status >= 300) {
          // Échec temporaire : on annule et on réessaie à la prochaine minute.
          await redis([["DEL", `push:p:${id}`]]);
          return;
        }
        sent++;
      }
      await saveDevice(id, { ...rec, schedule: keepSchedule, snooze: keepSnooze });
    };

    for (let i = 0; i < ids.length; i += 10) {
      await Promise.all(
        ids.slice(i, i + 10).map((id) => handle(id).catch((e) => console.error("push tick", id, e))),
      );
    }
    await redis([["DEL", "push:lock"]]);
    return json({ ok: true, due: ids.length, sent, dropped });
  } catch (e) {
    return fail(e);
  }
}
