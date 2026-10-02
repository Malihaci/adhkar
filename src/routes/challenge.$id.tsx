import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CloudOff, Share2, Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CounterPad } from "@/components/CounterPad";
import {
  addToLog,
  challengeApi,
  dhikrShortTitle,
  getCounterDhikr,
  newParticipantToken,
  reportedNumber,
  shareTextForChallenge,
  useDhikrLog,
  useLocalChallenges,
  type ChallengeState,
  type LocalChallenge,
} from "@/lib/dhikrCounter";

export const Route = createFileRoute("/challenge/$id")({
  validateSearch: (s: Record<string, unknown>): { nouveau?: number } => ({
    nouveau: s.nouveau ? 1 : undefined,
  }),
  head: () => ({ meta: [{ title: "Défi Dhikr" }] }),
  component: ChallengePage,
});

/** Tap → compteur local immédiat ; le serveur reçoit le compteur ABSOLU en
 * arrière-plan (2,5 s après le dernier tap, ou tous les 10 taps, ou au
 * retour de connexion / quand l'écran est quitté) — jamais un appel par tap. */
const SYNC_DEBOUNCE_MS = 2500;
const SYNC_EVERY_TAPS = 10;
const POLL_MS = 25_000;

function ChallengePage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const [locals, setLocals] = useLocalChallenges();
  const [, setLog] = useDhikrLog();
  const local = locals.find((c) => c.id === id) ?? null;

  const { data, error, refetch } = useQuery({
    queryKey: ["challenge", id, local?.participantToken ?? null],
    queryFn: () => challengeApi.get(id, local?.participantToken),
    refetchInterval: POLL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
    retry: (n, e) => (e as { status?: number }).status == null && n < 2,
  });
  const challenge = data?.challenge;

  // --- synchronisation optimiste -------------------------------------------
  const localRef = useRef(local);
  localRef.current = local;
  const inFlight = useRef(false);
  const timer = useRef<number | null>(null);
  const tapsSinceSync = useRef(0);
  const [syncFailed, setSyncFailed] = useState(false);
  const [sessionTaps, setSessionTaps] = useState(0);

  const syncNow = useCallback(async () => {
    const l = localRef.current;
    if (!l || inFlight.current || l.myCount === l.syncedCount) return;
    inFlight.current = true;
    tapsSinceSync.current = 0;
    try {
      const sent = l.myCount;
      const res = await challengeApi.progress(l.id, l.participantToken, sent);
      setLocals((all) => all.map((c) => (c.id === l.id ? { ...c, syncedCount: res.count } : c)));
      setSyncFailed(false);
      void refetch();
    } catch {
      setSyncFailed(true);
    } finally {
      inFlight.current = false;
    }
  }, [refetch, setLocals]);

  const scheduleSync = useCallback(() => {
    if (timer.current != null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => void syncNow(), SYNC_DEBOUNCE_MS);
  }, [syncNow]);

  useEffect(() => {
    const flush = () => void syncNow();
    const onVisibility = () => document.visibilityState === "hidden" && flush();
    window.addEventListener("online", flush);
    document.addEventListener("visibilitychange", onVisibility);
    // Reprise des taps restés en file (hors ligne / onglet fermé).
    const retry = window.setInterval(flush, POLL_MS);
    flush();
    return () => {
      window.removeEventListener("online", flush);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(retry);
      if (timer.current != null) window.clearTimeout(timer.current);
      flush();
    };
  }, [syncNow, id]);

  // Met à jour la copie locale (totaux connus, objectif atteint) pour l'accueil.
  useEffect(() => {
    if (!challenge || !local) return;
    const reached = challenge.type === "individual" && local.myCount >= challenge.target;
    if (
      local.lastKnownTotal !== challenge.total ||
      local.lastKnownParticipants !== challenge.participants ||
      (reached && !local.reached)
    ) {
      setLocals((all) =>
        all.map((c) =>
          c.id === id
            ? {
                ...c,
                lastKnownTotal: challenge.total,
                lastKnownParticipants: challenge.participants,
                reached: c.reached || reached,
              }
            : c,
        ),
      );
    }
  }, [challenge, local, id, setLocals]);

  const bump = (delta: 1 | -1) => {
    const l = localRef.current;
    if (!l) return;
    const next = Math.max(0, l.myCount + delta);
    if (next === l.myCount) return;
    setLocals((all) => all.map((c) => (c.id === l.id ? { ...c, myCount: next } : c)));
    setLog((log) => addToLog(log, l.dhikrId, delta));
    // Mise à jour synchrone de la ref pour des taps très rapprochés.
    localRef.current = { ...l, myCount: next };
    tapsSinceSync.current += 1;
    if (tapsSinceSync.current >= SYNC_EVERY_TAPS) void syncNow();
    else scheduleSync();
  };

  if (error && !challenge) {
    const status = (error as { status?: number }).status;
    return (
      <AppShell title="Défi Dhikr" hideSettings>
        <p className="surface-card p-6 text-center text-sm text-muted-foreground">
          {status === 404
            ? "Ce défi n'existe pas ou a expiré."
            : (error as Error).message || "Impossible de charger ce défi pour l'instant."}
        </p>
      </AppShell>
    );
  }
  if (!challenge) {
    return (
      <AppShell title="Défi Dhikr" hideSettings>
        <p className="surface-card p-6 text-center text-sm text-muted-foreground">Chargement…</p>
      </AppShell>
    );
  }

  return (
    <AppShell title={challenge.title} subtitle={dhikrShortTitle(challenge.dhikrId)} hideSettings>
      <div className="space-y-5">
        {search.nouveau && <ShareBanner challenge={challenge} />}
        {!local ? (
          challenge.ended ? (
            <Summary challenge={challenge} mine={undefined} />
          ) : (
            <JoinForm
              challenge={challenge}
              onJoined={(l) => {
                setLocals((all) => [l, ...all.filter((c) => c.id !== l.id)]);
                void refetch();
              }}
            />
          )
        ) : (
          <JoinedView
            challenge={challenge}
            local={local}
            syncFailed={syncFailed || (local.myCount !== local.syncedCount && !navigator.onLine)}
            sessionTaps={sessionTaps}
            onIncrement={() => {
              setSessionTaps((n) => n + 1);
              bump(1);
            }}
            onUndo={() => {
              setSessionTaps((n) => Math.max(0, n - 1));
              bump(-1);
            }}
          />
        )}
        {!search.nouveau && !challenge.ended && <ShareBanner challenge={challenge} compact />}
      </div>
    </AppShell>
  );
}

function ShareBanner({ challenge, compact }: { challenge: ChallengeState; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const text = shareTextForChallenge(challenge);
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        /* annulé */
      }
      return;
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className={compact ? "" : "surface-card space-y-3 p-5 text-center"}>
      {!compact && <p className="font-display text-lg font-semibold text-foreground">Défi créé 🌿</p>}
      <button
        onClick={share}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:-translate-y-0.5"
      >
        <Share2 className="size-4" /> {copied ? "Lien copié" : "Partager le défi"}
      </button>
    </div>
  );
}

function JoinForm({ challenge, onJoined }: { challenge: ChallengeState; onJoined: (l: LocalChallenge) => void }) {
  const [nickname, setNickname] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const join = async (name: string) => {
    const clean = name.trim().slice(0, 30);
    if (!clean) return;
    setBusy(true);
    setError(null);
    try {
      const token = newParticipantToken();
      await challengeApi.join(challenge.id, clean, token);
      onJoined({
        id: challenge.id,
        dhikrId: challenge.dhikrId,
        title: challenge.title,
        type: challenge.type,
        target: challenge.target,
        endsAt: challenge.endsAt,
        leaderboardEnabled: challenge.leaderboardEnabled,
        nickname: clean,
        participantToken: token,
        myCount: 0,
        syncedCount: 0,
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="surface-card space-y-4 p-6">
      <p className="font-display text-xl font-semibold text-foreground">Comment souhaitez-vous apparaître ?</p>
      <p className="text-sm text-muted-foreground">
        {challenge.type === "collective"
          ? `Objectif collectif : ${challenge.target.toLocaleString("fr-FR")}`
          : `Objectif du défi : ${challenge.target.toLocaleString("fr-FR")}`}{" "}
        · {challenge.participants} participant{challenge.participants > 1 ? "s" : ""}
      </p>
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        maxLength={30}
        placeholder="Prénom ou pseudo"
        aria-label="Prénom ou pseudo"
        className="h-14 w-full rounded-2xl border border-border bg-background px-4 text-base"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        onClick={() => join(nickname)}
        disabled={busy || !nickname.trim()}
        className="min-h-14 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground disabled:opacity-50"
      >
        Participer
      </button>
      <button
        onClick={() => join("Anonyme")}
        disabled={busy}
        className="min-h-11 w-full text-sm font-medium text-muted-foreground"
      >
        Participer anonymement
      </button>
    </div>
  );
}

function JoinedView({
  challenge,
  local,
  syncFailed,
  sessionTaps,
  onIncrement,
  onUndo,
}: {
  challenge: ChallengeState;
  local: LocalChallenge;
  syncFailed: boolean;
  sessionTaps: number;
  onIncrement: () => void;
  onUndo: () => void;
}) {
  const pending = local.myCount - local.syncedCount;
  // Total affiché = total serveur + mes taps pas encore synchronisés.
  const total = challenge.total + Math.max(0, pending);
  const collective = challenge.type === "collective";
  const reported = reportedNumber(challenge.dhikrId);
  const dhikr = getCounterDhikr(challenge.dhikrId);
  const pct = Math.min(100, Math.round((total / challenge.target) * 100));

  if (challenge.ended) return <Summary challenge={challenge} mine={local.myCount} nickname={local.nickname} />;

  return (
    <div className="space-y-5">
      {collective && (
        <div className="surface-card space-y-3 p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ensemble</p>
          <p className="text-4xl font-bold tabular-nums text-foreground">
            {total.toLocaleString("fr-FR")}
            <span className="text-xl font-semibold text-muted-foreground">
              {" "}
              / {challenge.target.toLocaleString("fr-FR")}
            </span>
          </p>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-sm text-muted-foreground">
            {challenge.participants} participant{challenge.participants > 1 ? "s" : ""} · Vous : {local.myCount}
          </p>
        </div>
      )}

      {dhikr && (
        <p lang="ar" dir="rtl" className="px-2 text-center font-arabic text-2xl leading-loose text-foreground">
          {dhikr.arabic}
        </p>
      )}

      <CounterPad
        count={local.myCount}
        goal={collective ? undefined : challenge.target}
        goalLabel="Objectif du défi"
        canUndo={sessionTaps > 0 && local.myCount > 0}
        onIncrement={onIncrement}
        onUndo={onUndo}
      />

      {syncFailed && (
        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <CloudOff className="size-3.5" /> Hors ligne — vos taps seront synchronisés au retour du réseau.
        </p>
      )}

      {!collective && <Trophies challenge={challenge} mine={local.myCount} nickname={local.nickname} />}
      {collective && local.myCount > 0 && (
        <p className="text-center text-sm font-medium text-primary">✨ Contribution collective</p>
      )}
      {challenge.leaderboardEnabled && challenge.leaderboard && <Leaderboard rows={challenge.leaderboard} me={local.nickname} />}

      {reported && (
        <p className="text-center text-xs text-muted-foreground">
          Nombre rapporté pour ce dhikr : {reported.count} — {reported.reference}. L'objectif du défi est un choix
          personnel, pas un nombre prescrit.
        </p>
      )}
    </div>
  );
}

function Trophies({ challenge, mine, nickname }: { challenge: ChallengeState; mine: number; nickname: string }) {
  const badges: string[] = [];
  if (mine >= challenge.target) badges.push("🌿 Objectif atteint");
  const top = challenge.leaderboard?.[0];
  if (challenge.ended && top && top.nickname === nickname && top.count === mine && mine > 0) badges.push("🏆 Première place");
  if (!badges.length) return null;
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {badges.map((b) => (
        <span key={b} className="rounded-full bg-primary/12 px-3 py-1 text-sm font-semibold text-primary">
          {b}
        </span>
      ))}
    </div>
  );
}

function Leaderboard({ rows, me }: { rows: { nickname: string; count: number }[]; me: string }) {
  if (!rows.length) return null;
  return (
    <div className="surface-card divide-y divide-border overflow-hidden">
      {rows.slice(0, 20).map((r, i) => (
        <div key={`${r.nickname}-${i}`} className="flex items-center gap-3 px-4 py-3 text-sm">
          <span className="w-6 text-center font-semibold text-muted-foreground">
            {i === 0 ? <Trophy className="mx-auto size-4 text-gold" /> : i + 1}
          </span>
          <span className="min-w-0 flex-1 truncate font-medium text-foreground">
            {r.nickname}
            {r.nickname === me && <span className="ml-1 text-xs text-muted-foreground">(vous)</span>}
          </span>
          <span className="font-semibold tabular-nums text-foreground">{r.count}</span>
        </div>
      ))}
    </div>
  );
}

function Summary({
  challenge,
  mine,
  nickname,
}: {
  challenge: ChallengeState;
  mine: number | undefined;
  nickname?: string;
}) {
  return (
    <div className="space-y-5">
      <div className="surface-card space-y-3 p-6 text-center">
        <p className="font-display text-xl font-semibold text-foreground">Défi terminé</p>
        <p className="text-sm text-muted-foreground">Ensemble</p>
        <p className="text-4xl font-bold tabular-nums text-foreground">
          {challenge.total.toLocaleString("fr-FR")} <span className="text-base font-medium">récitations</span>
        </p>
        {mine != null && <p className="text-sm text-foreground">Votre contribution : {mine}</p>}
        <p className="text-sm text-muted-foreground">Participants : {challenge.participants}</p>
      </div>
      {mine != null && nickname && challenge.type === "individual" && (
        <Trophies challenge={challenge} mine={mine} nickname={nickname} />
      )}
      {challenge.leaderboardEnabled && challenge.leaderboard && (
        <Leaderboard rows={challenge.leaderboard} me={nickname ?? ""} />
      )}
    </div>
  );
}
