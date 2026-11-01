import { PRAYER_KEYS, PRAYER_LABELS, type PrayerKey } from "@/lib/prayerTimes";
import type { ReminderConfig } from "@/lib/reminders";

const OFFSETS = [-60, -30, -15, -10, 0, 10, 15, 30, 45, 60, 90];

const offsetLabel = (o: number) =>
  o === 0 ? "À l'heure" : o < 0 ? `${-o} min avant` : `${o} min après`;

type Trigger = Pick<ReminderConfig, "time" | "anchor" | "anchorOffset">;

/**
 * Déclencheur d'un rappel : une HEURE PRÉCISE ou une PRIÈRE (avec décalage avant/après).
 * Utilisé pour les rappels à heure fixe et pour ceux créés par l'utilisateur.
 */
export function ReminderTrigger({
  value,
  disabled,
  onChange,
}: {
  value: Trigger;
  disabled?: boolean;
  onChange: (patch: Partial<Trigger>) => void;
}) {
  const byPrayer = !!value.anchor;
  const field =
    "h-10 min-w-0 rounded-xl border border-border bg-background px-2 text-xs disabled:opacity-40";
  return (
    <div className="grid grid-cols-2 gap-2">
      <select
        value={value.anchor ?? "time"}
        disabled={disabled}
        onChange={(e) =>
          e.target.value === "time"
            ? onChange({ anchor: undefined, anchorOffset: undefined })
            : onChange({ anchor: e.target.value as PrayerKey, anchorOffset: value.anchorOffset ?? 0 })
        }
        className={field}
        aria-label="Déclenchement"
      >
        <option value="time">À une heure précise</option>
        {PRAYER_KEYS.filter((k) => k !== "Sunrise").map((k) => (
          <option key={k} value={k}>
            Selon {PRAYER_LABELS[k]}
          </option>
        ))}
      </select>
      {byPrayer ? (
        <select
          value={value.anchorOffset ?? 0}
          disabled={disabled}
          onChange={(e) => onChange({ anchorOffset: Number(e.target.value) })}
          className={field}
          aria-label="Décalage"
        >
          {OFFSETS.map((o) => (
            <option key={o} value={o}>
              {offsetLabel(o)}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="time"
          value={value.time}
          disabled={disabled}
          onChange={(e) => onChange({ time: e.target.value })}
          className={field}
          aria-label="Heure"
        />
      )}
    </div>
  );
}
