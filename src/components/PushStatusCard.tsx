import { useCallback, useEffect, useState } from "react";
import { BellRing, CheckCircle2, TriangleAlert } from "lucide-react";
import { disablePush, enablePush, getPushState, sendPushTest, type PushState } from "@/lib/pushSync";

/** Planificateur actif = il a tourné dans les 3 dernières minutes. */
const TICK_FRESH_MS = 3 * 60_000;

function ago(ms: number): string {
  const min = Math.round((Date.now() - ms) / 60_000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  return `il y a ${Math.round(min / 60)} h`;
}

/**
 * Notifications même application fermée (Web Push) : activer, tester, et voir
 * honnêtement ce qui manque (stockage Redis, planificateur) plutôt que de
 * promettre un rappel qui ne partira pas.
 */
export function PushStatusCard() {
  const [state, setState] = useState<PushState | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = useCallback(() => {
    getPushState()
      .then(setState)
      .catch(() => setState({ kind: "server-missing" }));
  }, []);
  useEffect(refresh, [refresh]);

  const run = async (fn: () => Promise<string | null>) => {
    setBusy(true);
    setMsg(null);
    try {
      setMsg(await fn());
    } finally {
      setBusy(false);
      refresh();
    }
  };

  if (!state) return null;

  const tickOk = state.kind === "on" && state.lastTick !== null && Date.now() - state.lastTick < TICK_FRESH_MS;

  return (
    <div className="surface-card space-y-3 px-4 py-3.5">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
          <BellRing className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">Rappels même application fermée</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {state.kind === "unsupported" &&
              "Ce navigateur ne gère pas les notifications push. Sur iPhone, ajoutez d'abord l'app à l'écran d'accueil."}
            {state.kind === "denied" && "Notifications bloquées : réactivez-les dans les réglages du navigateur."}
            {state.kind === "server-missing" &&
              "Le serveur de notifications n'est pas encore activé (il manque la base Redis côté Vercel)."}
            {state.kind === "off" && "Recevez vos rappels à l'heure choisie, écran verrouillé ou application fermée."}
            {state.kind === "on" &&
              (tickOk
                ? "Actif. Les rappels arrivent à l'heure choisie, même si l'app est fermée."
                : "Appareil abonné, mais le planificateur n'a pas encore tourné : sans lui, rien ne part à l'heure.")}
          </p>
        </div>
      </div>

      {state.kind === "on" && (
        <p
          className={`flex items-center gap-2 text-xs ${tickOk ? "text-primary" : "text-amber-600 dark:text-amber-400"}`}
        >
          {tickOk ? <CheckCircle2 className="size-4 shrink-0" /> : <TriangleAlert className="size-4 shrink-0" />}
          {state.lastTick
            ? `Planificateur : dernière vérification ${ago(state.lastTick)}`
            : "Planificateur : jamais appelé (voir la configuration du cron)"}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {state.kind === "off" && (
          <button
            disabled={busy}
            onClick={() =>
              run(async () => {
                const r = await enablePush();
                return r.ok ? "Activé sur cet appareil." : r.reason;
              })
            }
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
          >
            Activer sur cet appareil
          </button>
        )}
        {state.kind === "on" && (
          <>
            <button
              disabled={busy}
              onClick={() => run(async () => (await sendPushTest()).message)}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground disabled:opacity-50"
            >
              Envoyer un test push
            </button>
            <button
              disabled={busy}
              onClick={() => run(async () => (await disablePush(), "Désactivé sur cet appareil."))}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground disabled:opacity-50"
            >
              Désactiver
            </button>
          </>
        )}
      </div>
      {msg && <p className="text-xs text-foreground">{msg}</p>}
    </div>
  );
}
