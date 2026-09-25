import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, BellOff } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useLocalState } from "@/lib/storage";
import {
  DEFAULT_REMINDERS,
  checkDueReminders,
  notificationsSupported,
  requestNotificationPermission,
  type ReminderConfig,
  type ReminderFireLog,
} from "@/lib/reminders";
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

function RappelsPage() {
  const [reminders, setReminders] = useLocalState<ReminderConfig[]>(
    "adhkar:reminders",
    DEFAULT_REMINDERS,
  );
  const [fireLog, setFireLog] = useLocalState<ReminderFireLog>("adhkar:reminders-firelog", {});
  // `Notification` n'existe pas côté serveur (SSR) : rester sur "unsupported"
  // au premier rendu (identique au serveur), puis ne lire le vrai état
  // qu'après montage — jamais dans l'initialiseur de useState, pour éviter
  // un mismatch d'hydratation (même règle que le fix précédent sur le Mushaf).
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    "unsupported",
  );
  useEffect(() => {
    if (notificationsSupported()) setPermission(Notification.permission);
  }, []);

  // Planification "au premier plan" — voir src/lib/reminders.ts pour les
  // limites (pas d'alarme fiable hors application sur le Web sans push serveur).
  useEffect(() => {
    if (!notificationsSupported()) return;
    const id = window.setInterval(() => {
      setFireLog((log) =>
        checkDueReminders(reminders, log, (r) => {
          const n = new Notification(r.label, { body: "Toucher pour ouvrir", tag: r.id });
          n.onclick = () => {
            window.focus();
            window.location.href = r.deepLink;
          };
        }),
      );
    }, 30_000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reminders]);

  const toggle = (id: string) =>
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  const setTime = (id: string, time: string) =>
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, time } : r)));

  const askPermission = async () => {
    const p = await requestNotificationPermission();
    setPermission(p);
  };

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
          {reminders.map((r) => (
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

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Les horaires sont des outils personnels d'organisation, pas une prescription religieuse.
        </p>
      </div>
    </AppShell>
  );
}
