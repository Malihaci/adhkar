import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, BellOff, CheckCircle2, Music, Plus, Trash2, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PushStatusCard } from "@/components/PushStatusCard";
import { ReminderTrigger } from "@/components/ReminderTrigger";
import { useLocalState } from "@/lib/storage";
import {
  DEFAULT_REMINDERS,
  notificationsSupported,
  playReminderSound,
  requestNotificationPermission,
  resolveReminderTime,
  type ReminderConfig,
} from "@/lib/reminders";
import { showAppNotification } from "@/lib/notify";
import { ADHAN_CATALOG, playBeep, type AdhanId } from "@/lib/adhan";
import {
  deletePersonalAudio,
  getPersonalAudioMeta,
  getPersonalAudioURL,
  savePersonalAudio,
  type PersonalAudioMeta,
} from "@/lib/personalAudio";
import { usePrayerTimings, type PrayerKey } from "@/lib/prayerTimes";
import { useSmartReminderPrefs } from "@/lib/smartReminders";
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

const DRAFT_TARGETS = [
  { to: "/", label: "Accueil" },
  { to: "/matin", label: "Adhkār du matin" },
  { to: "/soir", label: "Adhkār du soir" },
  { to: "/wird", label: "Lecture du jour" },
  { to: "/horaires", label: "Horaires de prière" },
  { to: "/compteur", label: "Compteur de dhikr" },
];

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
  const patchReminder = (id: string, patch: Partial<ReminderConfig>) =>
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const removeReminder = (id: string) => setReminders((prev) => prev.filter((r) => r.id !== id));
  const [draft, setDraft] = useState<{
    label: string;
    deepLink: string;
    time: string;
    anchor?: PrayerKey;
    anchorOffset?: number;
  } | null>(null);
  const addReminder = () => {
    if (!draft || !draft.label.trim()) return;
    setReminders((prev) => [
      ...prev,
      {
        id: `custom-${Date.now().toString(36)}`,
        label: draft.label.trim().slice(0, 40),
        time: draft.time,
        anchor: draft.anchor,
        anchorOffset: draft.anchorOffset,
        enabled: true,
        deepLink: draft.deepLink,
        custom: true,
      },
    ]);
    setDraft(null);
  };
  const setAdhan = (id: string, adhanId: AdhanId) =>
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, adhanId } : r)));

  const askPermission = async () => {
    const p = await requestNotificationPermission();
    setPermission(p);
  };

  const testNotification = () => {
    if (permission !== "granted") return;
    void showAppNotification("ʿAsr dans 15 min", { body: "Ceci est un test de notification.", tag: "test" });
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

  const [smart] = useSmartReminderPrefs();
  // Quand le mode intelligent est actif, ces 3 rappels à heure fixe ne
  // sonnent plus jamais (voir useReminderEngine dans reminders.ts) — les
  // masquer ici plutôt que de laisser un interrupteur "activé" qui ne ferait
  // plus rien, ce qui serait trompeur (chantier "Rappels intelligents").
  const smartManagedIds = smart.enabled ? ["matin", "soir", "wird"] : [];
  const fixedReminders = reminders.filter((r) => !r.prayerKey && !smartManagedIds.includes(r.id));
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

        <PushStatusCard />

        {smart.enabled && (
          <p className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            Adhkār (matin/soir) et Mon Wird sont désormais gérés par le mode intelligent — voir{" "}
            <Link to="/parametres" search={{ section: "notifications" }} className="font-medium text-primary underline-offset-2 hover:underline">
              ⚙️ Paramètres → Notifications
            </Link>
            .
          </p>
        )}

        <div className="surface-card divide-y divide-border">
          {fixedReminders.map((r) => (
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
                    {!r.enabled
                      ? "Désactivé"
                      : resolveReminderTime(r, timings ?? null)
                        ? `À ${resolveReminderTime(r, timings ?? null)}`
                        : "Horaire indisponible"}
                  </p>
                </div>
                {r.custom && (
                  <button
                    onClick={() => removeReminder(r.id)}
                    aria-label={`Supprimer ${r.label}`}
                    className="grid size-9 shrink-0 place-items-center rounded-xl border border-destructive/40 text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
              <div className="pl-[60px]">
                <ReminderTrigger value={r} disabled={!r.enabled} onChange={(p) => patchReminder(r.id, p)} />
              </div>
            </div>
          ))}
          {draft ? (
            <div className="space-y-2.5 px-4 py-3.5">
              <input
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                placeholder="Nom du rappel (ex. Dhikr du soir)"
                maxLength={40}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
              />
              <select
                value={draft.deepLink}
                onChange={(e) => setDraft({ ...draft, deepLink: e.target.value })}
                className="h-10 w-full rounded-xl border border-border bg-background px-2 text-xs"
                aria-label="Page à ouvrir"
              >
                {DRAFT_TARGETS.map((t) => (
                  <option key={t.to} value={t.to}>
                    Ouvrir : {t.label}
                  </option>
                ))}
              </select>
              <ReminderTrigger value={draft} onChange={(p) => setDraft({ ...draft, ...p })} />
              <div className="flex gap-2">
                <button
                  onClick={addReminder}
                  disabled={!draft.label.trim()}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-40"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => setDraft(null)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-foreground"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setDraft({ label: "", deepLink: "/", time: "12:00" })}
              className="flex w-full items-center gap-2 px-4 py-3.5 text-left text-sm font-medium text-primary"
            >
              <Plus className="size-4" /> Ajouter un rappel
            </button>
          )}
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
                    {r.fixed && (
                      <input
                        type="time"
                        value={r.time}
                        onChange={(e) => setTime(r.id, e.target.value)}
                        disabled={!r.enabled}
                        aria-label="Heure précise"
                        className="h-10 w-24 shrink-0 rounded-xl border border-border bg-background px-2 text-sm disabled:opacity-40"
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pl-[60px]">
                    <select
                      value={r.fixed ? "fixed" : (r.offsetMinutes ?? 0)}
                      onChange={(e) =>
                        e.target.value === "fixed"
                          ? patchReminder(r.id, { fixed: true, time: r.time || effective || "12:00" })
                          : patchReminder(r.id, { fixed: false, offsetMinutes: Number(e.target.value) })
                      }
                      disabled={!r.enabled}
                      className="h-10 rounded-xl border border-border bg-background px-2 text-xs disabled:opacity-40"
                    >
                      {OFFSET_CHOICES.map((o) => (
                        <option key={o} value={o}>
                          {o === 0 ? "À l'heure de la prière" : `${o} min avant`}
                        </option>
                      ))}
                      <option value="fixed">À une heure précise…</option>
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
