/**
 * Compteur de dhikr + défis (chantier "Compteur & Défis Dhikr").
 * Tout l'état personnel vit en localStorage (même mécanisme que le reste de
 * l'app) ; seuls les défis partagés passent par l'API serveur minimale.
 */
import type { Dhikr } from "@/data/adhkar";
import { ALL_ADHKAR } from "@/data/adhkar-occasions";
import { useLocalState } from "@/lib/storage";

/** Dhikr proposés dans le compteur : uniquement des entrées DÉJÀ présentes
 * et sourcées dans le corpus (jamais dupliquées ici). Subḥān Allāh /
 * Al-ḥamdu lillāh / Allāhu akbar / Lā ḥawla n'existent pas comme entrées
 * isolées validées dans le corpus actuel — ils ne sont donc pas proposés. */
export const COUNTER_DHIKR_IDS = [
  "m-22-salat-nabi",
  "m-30-subhan-100",
  "m-29-lailaha-100",
  "m-31-istighfar-100",
] as const;

export const FREE_COUNTER_ID = "libre";

export const SALAT_DHIKR_ID = "m-22-salat-nabi";

export function getCounterDhikr(id: string): Dhikr | null {
  return ALL_ADHKAR.find((d) => d.id === id) ?? null;
}

export function counterDhikrList(): Dhikr[] {
  return COUNTER_DHIKR_IDS.map((id) => getCounterDhikr(id)).filter((d): d is Dhikr => !!d);
}

export function dhikrShortTitle(id: string): string {
  if (id === FREE_COUNTER_ID) return "Compteur libre";
  if (id === SALAT_DHIKR_ID) return "Salāt sur le Prophète ﷺ";
  const d = getCounterDhikr(id);
  return d ? d.title.replace(/^\d+\.\s*/, "") : "Dhikr";
}

/** Nombre RAPPORTÉ par une source (jamais un objectif arbitraire) : on ne
 * l'affiche que si le dhikr l'établit réellement (`repetitions` > 1 dans le
 * corpus, avec sa référence). */
export function reportedNumber(id: string): { count: number; reference: string } | null {
  const d = getCounterDhikr(id);
  if (!d || d.repetitions <= 1) return null;
  return { count: d.repetitions, reference: d.reference };
}

export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Paliers automatiques : toujours 10 jalons réguliers jusqu'à l'objectif
 * (100 → 10,20…100 ; 500 → 50,100…500). */
export function milestones(goal: number): number[] {
  if (goal < 10) return [goal];
  const step = Math.max(1, Math.round(goal / 10));
  const out: number[] = [];
  for (let v = step; v < goal; v += step) out.push(v);
  out.push(goal);
  return out;
}

export function vibrateLight() {
  try {
    navigator.vibrate?.(12);
  } catch {
    /* indisponible */
  }
}

/* ------------------------------------------------------------ compteur perso */

export interface PersonalCounter {
  count: number;
  goal?: number;
}
export type PersonalCounters = Record<string, PersonalCounter>;
const COUNTERS_KEY = "dhikr:counters:v1";
export function usePersonalCounters() {
  return useLocalState<PersonalCounters>(COUNTERS_KEY, {});
}

/** Historique par jour : { "2026-10-02": { dhikrId: n } } — pas de graphique,
 * pas de série ("streak") culpabilisante. */
export type DhikrLog = Record<string, Record<string, number>>;
const LOG_KEY = "dhikr:log:v1";
export function useDhikrLog() {
  return useLocalState<DhikrLog>(LOG_KEY, {});
}
/** Garde les 60 derniers jours seulement. */
export function addToLog(log: DhikrLog, dhikrId: string, delta: number, day = todayKey()): DhikrLog {
  const next: DhikrLog = { ...log };
  const today = { ...(next[day] ?? {}) };
  today[dhikrId] = Math.max(0, (today[dhikrId] ?? 0) + delta);
  next[day] = today;
  const keys = Object.keys(next).sort();
  while (keys.length > 60) delete next[keys.shift()!];
  return next;
}

/* ------------------------------------------------------- défi du vendredi (local) */

export interface FridayChallengePrefs {
  goal: number;
}
const FRIDAY_KEY = "dhikr:friday:v1";
export function useFridayChallenge() {
  return useLocalState<FridayChallengePrefs>(FRIDAY_KEY, { goal: 100 });
}
export function isFriday(d = new Date()): boolean {
  return d.getDay() === 5;
}

/* ------------------------------------------------------------- défis partagés */

export type ChallengeType = "collective" | "individual";

export interface ChallengePublic {
  id: string;
  dhikrId: string;
  title: string;
  type: ChallengeType;
  target: number;
  startsAt: string;
  endsAt: string;
  leaderboardEnabled: boolean;
  createdAt: string;
}

export interface ChallengeState extends ChallengePublic {
  total: number;
  participants: number;
  ended: boolean;
  /** Seulement si le classement est activé. */
  leaderboard?: { nickname: string; count: number }[];
  mine?: number;
}

/** Copie locale d'un défi rejoint/créé sur cet appareil. */
export interface LocalChallenge {
  id: string;
  dhikrId: string;
  title: string;
  type: ChallengeType;
  target: number;
  endsAt: string;
  leaderboardEnabled: boolean;
  nickname: string;
  /** Jeton anonyme — jamais affiché, jamais partagé. */
  participantToken: string;
  myCount: number;
  syncedCount: number;
  lastKnownTotal?: number;
  lastKnownParticipants?: number;
  /** Jalon "objectif atteint" déjà célébré. */
  reached?: boolean;
}
const CHALLENGES_KEY = "dhikr:challenges:v1";
export function useLocalChallenges() {
  return useLocalState<LocalChallenge[]>(CHALLENGES_KEY, []);
}

export function challengeUrl(id: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://adhkar-gamma.vercel.app";
  return `${origin}/challenge/${id}`;
}

export function isChallengeEnded(c: { endsAt: string }): boolean {
  return Date.now() > new Date(c.endsAt).getTime();
}

export function newParticipantToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    const err = new Error(body.error ?? "Erreur réseau") as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return body;
}

export interface CreateChallengeInput {
  dhikrId: string;
  title: string;
  type: ChallengeType;
  target: number;
  endsAt: string;
  leaderboardEnabled: boolean;
}

export const challengeApi = {
  create: (input: CreateChallengeInput) =>
    api<{ challenge: ChallengePublic }>("/api/challenges", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  get: (id: string, token?: string) =>
    api<{ challenge: ChallengeState }>(
      `/api/challenges/${encodeURIComponent(id)}${token ? `?token=${encodeURIComponent(token)}` : ""}`,
    ),
  join: (id: string, nickname: string, token: string) =>
    api<{ ok: true }>(`/api/challenges/${encodeURIComponent(id)}/join`, {
      method: "POST",
      body: JSON.stringify({ nickname, token }),
    }),
  progress: (id: string, token: string, count: number) =>
    api<{ count: number }>(`/api/challenges/${encodeURIComponent(id)}/progress`, {
      method: "POST",
      body: JSON.stringify({ token, count }),
    }),
};

/** Fin de journée locale (23:59:59) en ISO — "Fin : Aujourd'hui". */
export function endOfDayISO(daysFromNow = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(23, 59, 59, 0);
  return d.toISOString();
}

export function shareTextForChallenge(c: {
  id: string;
  title: string;
  dhikrId: string;
  type: ChallengeType;
  target: number;
}): string {
  const goalLine =
    c.type === "collective" ? `Objectif collectif : ${c.target.toLocaleString("fr-FR")}` : `Objectif du défi : ${c.target.toLocaleString("fr-FR")}`;
  return `السلام عليكم ورحمة الله وبركاته 🌿\n\n${c.title}\n\n${dhikrShortTitle(c.dhikrId)}\n${goalLine}\n\nParticiper :\n${challengeUrl(c.id)}`;
}
