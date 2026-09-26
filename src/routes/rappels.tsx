import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, BellOff } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useLocalState } from "@/lib/storage";
import {
  DEFAULT_REMINDERS,
  notificationsSupported,
  requestNotificationPermission,
  resolveReminderTime,
  type ReminderConfig,
} from "@/lib/reminders";
import { fetchTodayTimings, getPrayerSettings } from "@/lib/prayerTimes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/rappels")({
  head: () => ({
    meta: [
      { title: "Mes rappels" },
      {
        name: "description",
        content: "Activez et réglez l'heure de vos rappels quotidiens.",
      },
    ],
  }),
  component: RappelsPage,
});

const OFFSET_CHOICES = [0, 5, 10, 15, 30];

function RappelsPage() {
  const [reminders, setReminders] = useLocalState<ReminderConfig[]>(
    "adhkar:reminders",
    DEFAULT_REMINDERS,
  );
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    "unsupported",
  );
  useEffect(() => {
    if (notificationsSupported()) setPermission(Notification.permission);
  }, []);

  // Le moteur de vérification tourne désormais une seule fois à la racine
  // de l'app (`useReminderEngine`, monté dans __root.tsx) — voir §24 : avant
  // ce correctif il ne tournait que pendant que cet écran était affiché.
  const { data: timings } = useQuery({
    queryKey: ["prayer-timings", getPrayerSettings()],
    queryFn: () => fetchTodayTimings(getPrayerSettings()),
    staleTime: 30 * 60_000,
  });

  const toggle = (id: string) =>
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  const setTime = (id: string, time: string) =>
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, time } : r)));
  const setOffset = (id: string, offsetMinutes: number) =>
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, offsetMinutes } : r)));

  const askPermission = async () => {
    const p = await requestNotificationPermission();
    setPermission(p);
  };

  const fixedReminders = reminders.filter((r) => !r.prayerKey);
  const prayerReminders = reminders.filter((r) => r.prayerKey);

  return (
    <AppShell title="Mes rappels" subtitle="تذكيرات">
      <div className="space-y-4">
        {permission !== "granted" && permission !== "unsupported" && (
          <button
            onClick={askPermission}
            className="surface-card flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
              <Bell className="size-5" />
            </span>
            <span className="text-sm font-medium text-foreground">
              Autoriser les notifications pour recevoir vos rappels
            </span>
          </button>
        )}
        {permission === "unsupported" && (
          <p className="flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            <BellOff className="size-4 shrink-0" />
            Les notifications ne sont pas prises en charge par ce navigateur. Les horaires restent
            enregistrés et s'appliqueront dès que ce sera possible.
          </p>
        )}

        <div className="surface-card divide-y divide-border">
          {fixedReminders.map((r) => (
            <div key={r.id} className="flex items-center gap-3 px-4 py-3.5">
              <button
                onClick={() => toggle(r.id)}
                role="switch"
                aria-checked={r.enabled}
                aria-label={r.enabled ? `Désactiver ${r.label}` : `Activer ${r.label}`}
                className={cn(
                  "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                  r.enabled ? "bg-primary" : "bg-muted",
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 size-5 rounded-full bg-background shadow transition-all",
                    r.enabled ? "left-6" : "left-1",
                  )}
                />
              </button>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                {r.label}
              </span>
              <input
                type="time"
                value={r.time}
                onChange={(e) => setTime(r.id, e.target.value)}
                disabled={!r.enabled}
                className="h-10 w-24 shrink-0 rounded-xl border border-border bg-background px-2 text-sm disabled:opacity-40"
              />
            </div>
          ))}
        </div>

        <div>
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Prières — horaires réels (Al Adhan API)
          </p>
          <div className="surface-card divide-y divide-border">
            {prayerReminders.map((r) => {
              const effective = resolveReminderTime(r, timings ?? null);
              return (
                <div key={r.id} className="flex items-center gap-3 px-4 py-3.5">
                  <button
                    onClick={() => toggle(r.id)}
                    role="switch"
                    aria-checked={r.enabled}
                    aria-label={r.enabled ? `Désactiver ${r.label}` : `Activer ${r.label}`}
                    className={cn(
                      "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                      r.enabled ? "bg-primary" : "bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1 size-5 rounded-full bg-background shadow transition-all",
                        r.enabled ? "left-6" : "left-1",
                      )}
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{r.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {effective ? `À ${effective}` : "Horaire indisponible"}
                    </p>
                  </div>
                  <select
                    value={r.offsetMinutes ?? 0}
                    onChange={(e) => setOffset(r.id, Number(e.target.value))}
                    disabled={!r.enabled}
                    className="h-10 shrink-0 rounded-xl border border-border bg-background px-2 text-xs disabled:opacity-40"
                  >
                    {OFFSET_CHOICES.map((o) => (
                      <option key={o} value={o}>
                        {o === 0 ? "À l'heure" : `${o} min avant`}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
          <p className="mt-2 px-1 text-[11px] leading-relaxed text-muted-foreground">
            Horaire recalculé chaque jour à partir de vos réglages de localisation (Plus → Horaires
            de prière). Adhan sonore non proposé pour l'instant — aucun fichier audio aux droits
            clairs n'est disponible dans l'application.
          </p>
        </div>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Les horaires sont des outils personnels d'organisation, pas une prescription religieuse.
        </p>
      </div>
    </AppShell>
  );
}
