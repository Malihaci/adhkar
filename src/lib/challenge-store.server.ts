/**
 * Défis Dhikr partagés — stockage + logique serveur minimale (chantier
 * "Compteur & Défis Dhikr").
 *
 * PERSISTANCE : aucune base n'existait dans le projet. Choix le plus léger
 * compatible Vercel : un Redis serverless accessible par simple `fetch`
 * (API REST Upstash — c'est ce qu'installe l'intégration Vercel "Upstash
 * Redis"/ex-"Vercel KV"). Aucune dépendance npm. Variables lues :
 * `KV_REST_API_URL` + `KV_REST_API_TOKEN` (Vercel) ou
 * `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`.
 * Hors production sans ces variables : mémoire de processus (tests locaux
 * seulement). En production sans ces variables : l'API répond 503 clair —
 * jamais une persistance simulée.
 *
 * Modèle : `ch:{id}` = JSON du défi ; `ch:{id}:p` = HASH jeton → JSON
 * { n: pseudo, c: compteur, u: dernière mise à jour }. Le jeton anonyme du
 * participant n'est jamais renvoyé à personne d'autre.
 */
import { z } from "zod";

export interface ChallengeRecord {
  id: string;
  dhikrId: string;
  title: string;
  type: "collective" | "individual";
  target: number;
  startsAt: string;
  endsAt: string;
  leaderboardEnabled: boolean;
  createdAt: string;
}
interface ParticipantRecord {
  n: string;
  c: number;
  u: number;
}

interface Store {
  getChallenge(id: string): Promise<ChallengeRecord | null>;
  putChallenge(c: ChallengeRecord, ttlSec: number): Promise<void>;
  getParticipant(id: string, token: string): Promise<ParticipantRecord | null>;
  setParticipant(id: string, token: string, p: ParticipantRecord, ttlSec: number): Promise<void>;
  allParticipants(id: string): Promise<ParticipantRecord[]>;
}

export class StorageUnavailableError extends Error {}

/** Accepte les noms standards, mais aussi un préfixe personnalisé ajouté par
 * l'intégration Vercel (ex. `STORAGE_KV_REST_API_URL`). Jamais le jeton
 * lecture seule : il faut pouvoir écrire. */
const URL_SUFFIXES = ["KV_REST_API_URL", "UPSTASH_REDIS_REST_URL"];
const TOKEN_SUFFIXES = ["KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_TOKEN"];

function redisConfig() {
  const env = process.env;
  for (const key of Object.keys(env)) {
    const suffix = URL_SUFFIXES.find((s) => key.endsWith(s));
    if (!suffix || !env[key]) continue;
    const prefix = key.slice(0, key.length - suffix.length);
    const tokenKey = TOKEN_SUFFIXES.map((s) => prefix + s).find((k) => env[k]);
    if (tokenKey) return { url: env[key]!.replace(/\/$/, ""), token: env[tokenKey]! };
  }
  return null;
}

/** Noms (jamais les valeurs) des variables de stockage visibles — diagnostic. */
function visibleStorageEnvNames(): string[] {
  return Object.keys(process.env).filter((k) => /REDIS|KV_|UPSTASH/i.test(k));
}

function redisStore(cfg: { url: string; token: string }): Store {
  const pipeline = async (cmds: (string | number)[][]) => {
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(cmds),
    });
    if (!res.ok) throw new StorageUnavailableError("redis " + res.status);
    return (await res.json()) as { result?: unknown; error?: string }[];
  };
  return {
    async getChallenge(id) {
      const [r] = await pipeline([["GET", `ch:${id}`]]);
      return typeof r.result === "string" ? (JSON.parse(r.result) as ChallengeRecord) : null;
    },
    async putChallenge(c, ttl) {
      await pipeline([["SET", `ch:${c.id}`, JSON.stringify(c), "EX", ttl]]);
    },
    async getParticipant(id, token) {
      const [r] = await pipeline([["HGET", `ch:${id}:p`, token]]);
      return typeof r.result === "string" ? (JSON.parse(r.result) as ParticipantRecord) : null;
    },
    async setParticipant(id, token, p, ttl) {
      await pipeline([
        ["HSET", `ch:${id}:p`, token, JSON.stringify(p)],
        ["EXPIRE", `ch:${id}:p`, ttl],
      ]);
    },
    async allParticipants(id) {
      const [r] = await pipeline([["HGETALL", `ch:${id}:p`]]);
      const flat = Array.isArray(r.result) ? (r.result as string[]) : [];
      const out: ParticipantRecord[] = [];
      for (let i = 1; i < flat.length; i += 2) out.push(JSON.parse(flat[i]) as ParticipantRecord);
      return out;
    },
  };
}

function memoryStore(): Store {
  const g = globalThis as unknown as {
    __dhikrMem?: { ch: Map<string, ChallengeRecord>; p: Map<string, Map<string, ParticipantRecord>> };
  };
  g.__dhikrMem ??= { ch: new Map(), p: new Map() };
  const mem = g.__dhikrMem;
  return {
    async getChallenge(id) {
      return mem.ch.get(id) ?? null;
    },
    async putChallenge(c) {
      mem.ch.set(c.id, c);
    },
    async getParticipant(id, token) {
      return mem.p.get(id)?.get(token) ?? null;
    },
    async setParticipant(id, token, p) {
      if (!mem.p.has(id)) mem.p.set(id, new Map());
      mem.p.get(id)!.set(token, p);
    },
    async allParticipants(id) {
      return [...(mem.p.get(id)?.values() ?? [])];
    },
  };
}

function getStore(): Store {
  const cfg = redisConfig();
  if (cfg) return redisStore(cfg);
  if (process.env["NODE_ENV"] === "production") throw new StorageUnavailableError("no storage");
  return memoryStore();
}

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

function fail(e: unknown): Response {
  if (e instanceof StorageUnavailableError) {
    return json(
      {
        error: "Les défis partagés ne sont pas encore activés sur ce serveur.",
        code: "storage_unavailable",
        envNamesSeen: visibleStorageEnvNames(),
      },
      503,
    );
  }
  if (e instanceof z.ZodError) return json({ error: "Données invalides." }, 400);
  console.error(e);
  return json({ error: "Erreur serveur." }, 500);
}

const MAX_PARTICIPANTS = 5000;
const DAY = 86400;
const ttlFor = (endsAt: string) =>
  Math.max(DAY, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 1000) + 30 * DAY);

function randomId(len = 10): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

const idSchema = z.string().regex(/^[a-z0-9]{6,20}$/);
const tokenSchema = z.string().regex(/^[a-f0-9]{32}$/);

const createSchema = z.object({
  dhikrId: z.string().regex(/^[A-Za-z0-9-]{1,64}$/),
  title: z.string().trim().min(1).max(80),
  type: z.enum(["collective", "individual"]),
  target: z.number().int().min(1).max(10_000_000),
  endsAt: z.string().datetime(),
  leaderboardEnabled: z.boolean(),
});

export async function handleCreate(request: Request): Promise<Response> {
  try {
    const input = createSchema.parse(await request.json());
    const ends = new Date(input.endsAt).getTime();
    if (ends <= Date.now() || ends > Date.now() + 400 * DAY * 1000) {
      return json({ error: "Date de fin invalide." }, 400);
    }
    const store = getStore();
    const challenge: ChallengeRecord = {
      id: randomId(),
      ...input,
      startsAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    await store.putChallenge(challenge, ttlFor(input.endsAt));
    return json({ challenge });
  } catch (e) {
    return fail(e);
  }
}

export async function handleGet(request: Request, rawId: string): Promise<Response> {
  try {
    const id = idSchema.parse(rawId);
    const store = getStore();
    const c = await store.getChallenge(id);
    if (!c) return json({ error: "Défi introuvable." }, 404);
    const parts = await store.allParticipants(id);
    const total = parts.reduce((n, p) => n + p.c, 0);
    const token = new URL(request.url).searchParams.get("token");
    const mine = token && tokenSchema.safeParse(token).success ? await store.getParticipant(id, token) : null;
    const leaderboard = c.leaderboardEnabled
      ? [...parts]
          .sort((a, b) => b.c - a.c)
          .slice(0, 50)
          .map((p) => ({ nickname: p.n, count: p.c }))
      : undefined;
    return json({
      challenge: {
        ...c,
        total,
        participants: parts.length,
        ended: Date.now() > new Date(c.endsAt).getTime(),
        leaderboard,
        mine: mine?.c,
      },
    });
  } catch (e) {
    return fail(e);
  }
}

const joinSchema = z.object({
  nickname: z.string().trim().min(1).max(30),
  token: tokenSchema,
});

export async function handleJoin(request: Request, rawId: string): Promise<Response> {
  try {
    const id = idSchema.parse(rawId);
    const { nickname, token } = joinSchema.parse(await request.json());
    const store = getStore();
    const c = await store.getChallenge(id);
    if (!c) return json({ error: "Défi introuvable." }, 404);
    if (Date.now() > new Date(c.endsAt).getTime()) return json({ error: "Ce défi est terminé." }, 409);
    const existing = await store.getParticipant(id, token);
    if (!existing && (await store.allParticipants(id)).length >= MAX_PARTICIPANTS) {
      return json({ error: "Ce défi est complet." }, 409);
    }
    await store.setParticipant(
      id,
      token,
      { n: nickname, c: existing?.c ?? 0, u: existing?.u ?? Date.now() },
      ttlFor(c.endsAt),
    );
    return json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

const progressSchema = z.object({
  token: tokenSchema,
  count: z.number().int().min(0).max(10_000_000),
});

/** Le client envoie son compteur ABSOLU (idempotent : une requête rejouée ou
 * perdue ne fausse jamais le total). Garde-fou simple contre les rafales
 * aberrantes : augmentation plafonnée à 30 + 10/seconde écoulée. */
export async function handleProgress(request: Request, rawId: string): Promise<Response> {
  try {
    const id = idSchema.parse(rawId);
    const { token, count } = progressSchema.parse(await request.json());
    const store = getStore();
    const c = await store.getChallenge(id);
    if (!c) return json({ error: "Défi introuvable." }, 404);
    if (Date.now() > new Date(c.endsAt).getTime()) return json({ error: "Ce défi est terminé." }, 409);
    const p = await store.getParticipant(id, token);
    if (!p) return json({ error: "Participation introuvable." }, 404);
    const elapsedSec = Math.max(0, (Date.now() - p.u) / 1000);
    const maxCount = p.c + Math.floor(30 + 10 * elapsedSec);
    const next = Math.min(count, maxCount);
    if (next !== p.c) await store.setParticipant(id, token, { ...p, c: next, u: Date.now() }, ttlFor(c.endsAt));
    return json({ count: next });
  } catch (e) {
    return fail(e);
  }
}
