import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight, Share2, Sparkles, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useLocalState } from "@/lib/storage";
import {
  buildKhatmaSchedule,
  createWirdState,
  daysElapsedSince,
  decodeKhatmaShare,
  effectiveSchedule,
  encodeKhatmaShare,
  TOTAL_MUSHAF_PAGES,
  type WirdState,
} from "@/lib/khatma";
import { cn } from "@/lib/utils";

interface WirdSearch {
  join?: string;
}

export const Route = createFileRoute("/wird")({
  head: () => ({
    meta: [
      { title: "Mon Wird — Lecture organisée du Coran" },
      {
        name: "description",
        content:
          "Organisez votre lecture complète du Coran (Khatma) sur 30, 60, 90 jours ou une durée personnalisée — seul ou en groupe.",
      },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): WirdSearch => ({
    join: typeof s.join === "string" ? s.join : undefined,
  }),
  component: WirdPage,
});

function WirdPage() {
  const { join } = Route.useSearch();
  const navigate = useNavigate();
  const [wird, setWird] = useLocalState<WirdState | null>("adhkar:wird", null);
  const [copied, setCopied] = useState(false);

  const joined = join ? decodeKhatmaShare(join) : null;

  if (joined && (!wird || wird.startDateISO !== joined.startDateISO || wird.name !== joined.name)) {
    return (
      <AppShell title="Rejoindre une Khatma" subtitle={joined.name ?? "Khatma de groupe"}>
        <JoinPreview
          joined={joined}
          onJoin={() => {
            setWird(createWirdStateFromJoin(joined));
            void navigate({ to: "/wird", search: {} });
          }}
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Mon Wird" subtitle="ورد القرآن">
      {!wird ? (
        <CreateWird onCreate={setWird} />
      ) : (
        <ActiveWird
          wird={wird}
          onUpdate={setWird}
          copied={copied}
          onShare={() => setCopied(true)}
        />
      )}
    </AppShell>
  );
}

function createWirdStateFromJoin(joined: {
  name?: string;
  durationDays: number;
  startDateISO: string;
}): WirdState {
  return {
    id: `wird-${Date.now()}`,
    name: joined.name,
    durationDays: joined.durationDays,
    startDateISO: joined.startDateISO,
    lastCompletedDay: 0,
    createdAt: new Date().toISOString(),
    isGroup: true,
  };
}

function JoinPreview({
  joined,
  onJoin,
}: {
  joined: { name?: string; durationDays: number; startDateISO: string };
  onJoin: () => void;
}) {
  const elapsed = daysElapsedSince(joined.startDateISO);
  const day = Math.min(joined.durationDays, elapsed + 1);
  const schedule = buildKhatmaSchedule(joined.durationDays);
  const today = schedule.find((d) => d.day === day) ?? schedule[0];
  return (
    <div className="surface-card space-y-4 p-5 text-center">
      <p className="font-display text-lg font-semibold text-foreground">
        {joined.name ?? "Khatma de groupe"}
      </p>
      <p className="text-sm text-muted-foreground">
        Jour {day} / {joined.durationDays}
      </p>
      <p className="text-2xl font-bold text-primary">
        Pages {today.startPage} → {today.endPage}
      </p>
      <button
        onClick={onJoin}
        className="h-12 w-full rounded-2xl bg-primary font-semibold text-primary-foreground transition active:scale-95"
      >
        Rejoindre
      </button>
    </div>
  );
}

function CreateWird({ onCreate }: { onCreate: (w: WirdState) => void }) {
  const [mode, setMode] = useState<"perso" | "groupe">("perso");
  const [basis, setBasis] = useState<"duree" | "pages">("duree");
  const [custom, setCustom] = useState("");
  const [customPages, setCustomPages] = useState("");
  const [groupName, setGroupName] = useState("");

  // Les deux modes ("Durée" ou "Pages/jour") passent TOUJOURS par la même
  // durée en jours, elle-même consommée par l'unique `buildKhatmaSchedule()`
  // — aucun second algorithme de répartition (§22 mission).
  const start = (days: number) => onCreate(createWirdState(days));
  const startGroup = (days: number) => {
    if (!groupName.trim()) return;
    onCreate(createWirdState(days, groupName.trim()));
  };
  const startFromPagesPerDay = (pagesPerDay: number) => {
    if (pagesPerDay <= 0) return;
    const days = Math.ceil(TOTAL_MUSHAF_PAGES / pagesPerDay);
    if (mode === "perso") start(days);
    else startGroup(days);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-full border border-border p-1">
        <button
          onClick={() => setMode("perso")}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-semibold transition",
            mode === "perso" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          Personnelle
        </button>
        <button
          onClick={() => setMode("groupe")}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-semibold transition",
            mode === "groupe" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          Groupe
        </button>
      </div>

      {mode === "groupe" && (
        <input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Nom de la Khatma (ex : Khatma 21)"
          className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm"
        />
      )}

      <div className="flex gap-1 rounded-full border border-border p-1">
        <button
          onClick={() => setBasis("duree")}
          className={cn(
            "flex-1 rounded-full py-2 text-xs font-semibold transition",
            basis === "duree" ? "bg-secondary text-foreground" : "text-muted-foreground",
          )}
        >
          Durée
        </button>
        <button
          onClick={() => setBasis("pages")}
          className={cn(
            "flex-1 rounded-full py-2 text-xs font-semibold transition",
            basis === "pages" ? "bg-secondary text-foreground" : "text-muted-foreground",
          )}
        >
          Pages / jour
        </button>
      </div>

      {basis === "duree" ? (
        <>
          <div className="grid grid-cols-3 gap-2">
            {[30, 60, 90].map((d) => (
              <button
                key={d}
                onClick={() => (mode === "perso" ? start(d) : startGroup(d))}
                disabled={mode === "groupe" && !groupName.trim()}
                className="surface-card flex flex-col items-center gap-1 rounded-2xl px-3 py-4 transition hover:-translate-y-0.5 hover:border-gold/40 disabled:opacity-40"
              >
                <span className="font-display text-xl font-bold text-gold">{d}</span>
                <span className="text-xs text-muted-foreground">jours</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              inputMode="numeric"
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))}
              placeholder="Durée personnalisée (jours)"
              className="h-12 flex-1 rounded-2xl border border-border bg-background px-4 text-sm"
            />
            <button
              onClick={() => {
                const d = Number(custom);
                if (d <= 0) return;
                if (mode === "perso") start(d);
                else startGroup(d);
              }}
              disabled={!custom || (mode === "groupe" && !groupName.trim())}
              className="h-12 shrink-0 rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              Créer
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2">
            {[2, 4, 5, 10].map((p) => (
              <button
                key={p}
                onClick={() => startFromPagesPerDay(p)}
                disabled={mode === "groupe" && !groupName.trim()}
                className="surface-card flex flex-col items-center gap-1 rounded-2xl px-2 py-4 transition hover:-translate-y-0.5 hover:border-gold/40 disabled:opacity-40"
              >
                <span className="font-display text-xl font-bold text-gold">{p}</span>
                <span className="text-[11px] text-muted-foreground">pages/j</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              inputMode="numeric"
              value={customPages}
              onChange={(e) => setCustomPages(e.target.value.replace(/\D/g, ""))}
              placeholder="Pages par jour (autre)"
              className="h-12 flex-1 rounded-2xl border border-border bg-background px-4 text-sm"
            />
            <button
              onClick={() => startFromPagesPerDay(Number(customPages))}
              disabled={!customPages || (mode === "groupe" && !groupName.trim())}
              className="h-12 shrink-0 rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              Créer
            </button>
          </div>
          {customPages && Number(customPages) > 0 && (
            <p className="text-center text-xs text-muted-foreground">
              ≈ {Math.ceil(TOTAL_MUSHAF_PAGES / Number(customPages))} jours pour terminer le Coran
            </p>
          )}
        </>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Les {TOTAL_MUSHAF_PAGES} pages du Mushaf sont réparties automatiquement, sans trou ni
        répétition.
      </p>
    </div>
  );
}

function ActiveWird({
  wird,
  onUpdate,
  copied,
  onShare,
}: {
  wird: WirdState;
  onUpdate: (w: WirdState | null) => void;
  copied: boolean;
  onShare: () => void;
}) {
  const schedule = effectiveSchedule(wird);
  const totalDays = schedule.length;
  const currentDayNum = Math.min(wird.lastCompletedDay + 1, totalDays);
  const today = schedule.find((d) => d.day === currentDayNum) ?? schedule[schedule.length - 1];
  const elapsed = daysElapsedSince(wird.startDateISO);
  const isLate = elapsed > wird.lastCompletedDay && wird.lastCompletedDay < totalDays;
  // Pages réellement en retard (jours prévus mais jamais marqués terminés,
  // jamais silencieusement considérés comme lus) — §4.1 mission.
  const missedDays = isLate
    ? schedule.filter((d) => d.day > wird.lastCompletedDay && d.day <= Math.min(elapsed, totalDays))
    : [];
  const missedPages = missedDays.reduce((n, d) => n + (d.endPage - d.startPage + 1), 0);
  const isDone = wird.lastCompletedDay >= totalDays;

  const [showProgram, setShowProgram] = useState(false);

  const markDone = () => {
    onUpdate({ ...wird, lastCompletedDay: Math.min(totalDays, wird.lastCompletedDay + 1) });
  };

  const redistribute = () => {
    onUpdate({
      ...wird,
      redistributedFrom: { fromDay: today.day, fromPage: today.startPage },
    });
  };

  const share = async (dayOnly: boolean) => {
    const code = encodeKhatmaShare(wird);
    const url = new URL(
      "/wird",
      typeof window !== "undefined"
        ? window.location.origin
        : "https://adhkari-daily-guide.lovable.app",
    );
    url.searchParams.set("join", code);
    const text = dayOnly
      ? `${wird.name ?? "Mon Wird"} — Jour ${today.day}/${totalDays}\nPages ${today.startPage} → ${today.endPage}\n${url.toString()}`
      : `${wird.name ?? "Ma Khatma"} — ${totalDays} jours\n${url.toString()}`;
    try {
      if (navigator.share) await navigator.share({ text, url: url.toString() });
      else {
        await navigator.clipboard.writeText(text);
        onShare();
        setTimeout(() => {}, 1800);
      }
    } catch {
      /* annulé */
    }
  };

  if (isDone) {
    return (
      <div className="surface-card space-y-4 p-6 text-center">
        <p className="font-arabic text-2xl text-primary">الحمد لله</p>
        <p className="font-display text-lg font-semibold text-foreground">
          Lecture du Coran terminée
        </p>
        <button
          onClick={() => onUpdate(null)}
          className="h-12 w-full rounded-2xl bg-primary font-semibold text-primary-foreground transition active:scale-95"
        >
          Commencer une nouvelle Khatma
        </button>
        <Link to="/khatma" className="block text-xs text-muted-foreground underline">
          Ce que disent les sources sur la fin de lecture (Khatma)
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="surface-card space-y-3 p-5">
        {wird.name && (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Users className="size-4 text-primary" /> {wird.name}
          </p>
        )}
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Aujourd'hui</p>
        <p className="font-display text-2xl font-bold text-foreground">
          Pages {today.startPage} → {today.endPage}
        </p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gold transition-all"
            style={{ width: `${(wird.lastCompletedDay / totalDays) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Jour {today.day}/{totalDays}
        </p>

        {isLate && !wird.redistributedFrom && (
          <div className="rounded-2xl border border-gold/30 bg-gold/10 p-3 text-xs text-foreground">
            <p className="mb-2">
              {missedPages} page{missedPages > 1 ? "s" : ""} à rattraper — sans souci.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => onUpdate({ ...wird })}
                className="flex-1 rounded-xl bg-background py-2 font-semibold"
              >
                Continuer normalement
              </button>
              <button
                onClick={redistribute}
                className="flex-1 rounded-xl bg-primary py-2 font-semibold text-primary-foreground"
              >
                Répartir les pages restantes
              </button>
            </div>
          </div>
        )}

        <Link
          to="/quran/page/$page"
          params={{ page: String(today.startPage) }}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-primary-foreground transition active:scale-95"
        >
          <ChevronRight className="size-4" /> Continuer
        </Link>
        <button
          onClick={markDone}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-border text-sm font-semibold text-foreground transition active:scale-95"
        >
          <Check className="size-4" /> J'ai terminé la lecture d'aujourd'hui
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => share(true)}
          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-border text-sm font-medium text-foreground"
        >
          <Share2 className="size-4" /> Partager
        </button>
        {wird.isGroup && (
          <button
            onClick={() => share(false)}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-border text-sm font-medium text-foreground"
          >
            <Sparkles className="size-4" /> Partager toute la Khatma
          </button>
        )}
      </div>
      {copied && <p className="text-center text-xs text-muted-foreground">Lien copié.</p>}

      <button
        onClick={() => setShowProgram((v) => !v)}
        className="w-full text-center text-xs font-medium text-muted-foreground underline"
      >
        {showProgram ? "Masquer" : "Voir"} le programme complet
      </button>
      {showProgram && (
        <div className="surface-card max-h-64 space-y-1 overflow-y-auto p-4 text-sm">
          {schedule.map((d) => (
            <div
              key={d.day}
              className={cn(
                "flex justify-between rounded-lg px-2 py-1",
                d.day === today.day && "bg-primary/10 font-semibold text-primary",
              )}
            >
              <span>Jour {d.day}</span>
              <span>
                Pages {d.startPage}–{d.endPage}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
