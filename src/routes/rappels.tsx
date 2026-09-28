import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, BellOff, CheckCircle2, Music, Trash2, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useLocalState } from "@/lib/storage";
import {
  DEFAULT_REMINDERS,
  notificationsSupported,
  playReminderSound,
  requestNotificationPermission,
  resolveReminderTime,
  type ReminderConfig,
} from "@/lib/reminders";
import { ADHAN_CATALOG, playBeep, type AdhanId } from "@/lib/adhan";
import {
  deletePersonalAudio,
  getPersonalAudioMeta,
  getPersonalAudioURL,
  savePersonalAudio,
  type PersonalAudioMeta,
} from "@/lib/personalAudio";
import { usePrayerTimings } from "@/lib/prayerTimes";
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
  const [personalAudio, setPersonalAudio] = useState<PersonalAudioMeta | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (notificationsSupported()) setPermission(Notification.permission);
    getPersonalAudioMeta().then(setPersonalAudio);
  }, []);

  // Le moteur de vérification tourne désormais une seule fois à la racine
  // de l'app (`useReminderEngine`, monté dans __root.tsx) — voir §24 : avant
  // ce correctif il ne tournait que pendant que cet écran était affiché.
  const { timings } = usePrayerTimings();

  const toggle = (id: string) =>
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  const setTime = (id: string, time: string) =>
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, time } : r)));
  const setOffset = (id: string, offsetMinutes: number) =>
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, offsetMinutes } : r)));
  const setAdhan = (id: string, adhanId: AdhanId) =>
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, adhanId } : r)));

  const askPermission = async () => {
    const p = await requestNotificationPermission();
    setPermission(p);
  };

  const testNotification = () => {
    if (permission !== "granted") return;
    new Notification("ʿAsr dans 15 min", { body: "Ceci est un test de notification." });
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const meta = await savePersonalAudio(file);
    setPersonalAudio(meta);
    e.target.value = "";
  };
  const testPersonalAudio = async () => {
    const url = await getPersonalAudioURL();
    if (!url) return;
    new Audio(url).play().catch(() => {});
  };
  const removePersonalAudio = async () => {
    await deletePersonalAudio();
    setPersonalAudio(null);
  };

  const fixedReminders = reminders.filter((r) => !r.prayerKey);
  const prayerReminders = reminders.filter((r) => r.prayerKey);

  return (
    <AppShell title="Mes rappels" subtitle="تذكيرات">
      <div className="space-y-4">
        {permission === "granted" ? (
          <div className="surface-card flex items-center justify-between gap-3 px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CheckCircle2 className="size-5 text-primary" /> Notifications autorisées
            </span>
            <button
              onClick={testNotification}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground"
            >
              Tester une notification
            </button>
          </div>
        ) : permission === "unsupported" ? (
          <p className="flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            <BellOff className="size-4 shrink-0" />
            Les notifications ne sont pas prises en charge par ce navigateur. Les horaires restent
            enregistrés et s'appliqueront dès que ce sera possible.
          </p>
        ) : (
          <button
            onClick={askPermission}
            className="surface-card flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
              <Bell className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {permission === "denied" ? "Autorisation refusée" : "Autorisation requise"}
              </p>
              <p className="text-xs text-muted-foreground">
                {permission === "denied"
                  ? "Réactivez les notifications dans les réglages de votre navigateur."
                  : "Activer les notifications pour recevoir vos rappels."}
              </p>
            </div>
          </button>
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
            Prières — horaires réels (source active, voir Horaires de prière)
          </p>
          <div className="surface-card divide-y divide-border">
            {prayerReminders.map((r) => {
              const effective = resolveReminderTime(r, timings ?? null);
              return (
                <div key={r.id} className="space-y-2.5 px-4 py-3.5">
                  <div className="flex items-center gap-3">
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
                  </div>
                  <div className="grid grid-cols-2 gap-2 pl-[60px]">
                    <select
                      value={r.offsetMinutes ?? 0}
                      onChange={(e) => setOffset(r.id, Number(e.target.value))}
                      disabled={!r.enabled}
                      className="h-10 rounded-xl border border-border bg-background px-2 text-xs disabled:opacity-40"
                    >
                      {OFFSET_CHOICES.map((o) => (
                        <option key={o} value={o}>
                          {o === 0 ? "À l'heure" : `${o} min avant`}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1">
                      <select
                        value={r.adhanId ?? "none"}
                        onChange={(e) => setAdhan(r.id, e.target.value as AdhanId)}
                        disabled={!r.enabled}
                        className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-background px-2 text-xs disabled:opacity-40"
                      >
                        {ADHAN_CATALOG.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.title}
                          </option>
                        ))}
                        {personalAudio && <option value="personal">Mon audio personnel</option>}
                      </select>
                      <button
                        onClick={() => void playReminderSound(r.adhanId)}
                        aria-label="Aperçu du son"
                        disabled={!r.adhanId || r.adhanId === "none"}
                        className="grid size-10 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground disabled:opacity-30"
                      >
                        <Music className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-2 px-1 text-[11px] leading-relaxed text-muted-foreground">
            Horaire recalculé chaque jour à partir de la source active (mosquée ou calcul
            automatique — Plus → Horaires de prière). Le son ne peut démarrer automatiquement que
            si l'application est ouverte au premier plan ; sinon, toucher la notification le joue
            immédiatement (limite des applications web, voir rapport).
          </p>
        </div>

        <div>
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Audio avant prière — fichier personnel
          </p>
          <div className="surface-card space-y-3 p-4">
            {personalAudio ? (
              <>
                <p className="text-sm text-foreground">
                  Audio sélectionné : <span className="font-medium">{personalAudio.name}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={testPersonalAudio}
                    className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-foreground"
                  >
                    Tester
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-foreground"
                  >
                    Remplacer
                  </button>
                  <button
                    onClick={removePersonalAudio}
                    aria-label="Supprimer l'audio personnel"
                    className="grid size-10 shrink-0 place-items-center rounded-xl border border-destructive/40 text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-foreground"
              >
                <Upload className="size-4" /> Choisir un fichier sur mon téléphone
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={onPickFile}
              className="hidden"
            />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Le fichier est conservé sur cet appareil (jamais envoyé à un serveur) et reste
              disponible après fermeture de l'application. Sélectionnez-le ensuite comme "Mon audio
              personnel" dans le réglage Adhān d'une prière.
            </p>
          </div>
        </div>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Les horaires sont des outils personnels d'organisation, pas une prescription religieuse.
        </p>
      </div>
    </AppShell>
  );
}
