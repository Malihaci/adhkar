import { useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, X } from "lucide-react";
import { ChoiceSelect } from "@/components/ChoiceSelect";
import { KaabaIcon, MadinaMosqueIcon } from "@/components/PlaceIcons";
import { RUB_BOUNDS } from "@/data/rub-bounds";
import { clampPage } from "@/lib/mushaf";
import { cn } from "@/lib/utils";

export type NavTab = "page" | "surah" | "juz" | "hizb";

/** Choix d'un verset : sourate + numéro d'āyah (listes déroulantes). */
export function VersePick({
  label,
  value,
  chapters,
  onChange,
  last,
}: {
  label: string;
  value: string;
  chapters: { id: number; nameSimple: string; versesCount: number }[];
  onChange: (key: string) => void;
  last?: boolean;
}) {
  const [sRaw, aRaw] = value.split(":");
  const surah = Number(sRaw) || 1;
  const ayah = Number(aRaw) || 1;
  const ch = chapters.find((c) => c.id === surah);
  const n = ch?.versesCount ?? 1;
  const cls = "h-11 min-w-0 rounded-xl border border-border bg-card px-3 text-sm font-medium";
  return (
    <div className="rounded-2xl border border-border bg-background p-3">
      <p className="mb-1.5 text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="flex gap-2">
        <select
          aria-label={label + " — sourate"}
          value={surah}
          onChange={(e) => {
            const id = Number(e.target.value);
            const c = chapters.find((x) => x.id === id);
            onChange(`${id}:${last ? (c?.versesCount ?? 1) : 1}`);
          }}
          className={cn(cls, "flex-1")}
        >
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} - {c.nameSimple}
            </option>
          ))}
        </select>
        <select
          aria-label={label + " — āyah"}
          value={Math.min(ayah, n)}
          onChange={(e) => onChange(`${surah}:${e.target.value}`)}
          className={cn(cls, "w-24")}
        >
          {Array.from({ length: n }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

type RubBoundRow = (typeof RUB_BOUNDS)[number];

/** Premiers mots d'une āyah sur UNE seule ligne, alignés à droite. */
function ArLine({ text, className }: { text: string; className?: string }) {
  return (
    <span
      lang="ar"
      dir="rtl"
      className={cn("min-w-0 flex-1 overflow-hidden whitespace-nowrap text-right font-arabic leading-[2]", className)}
    >
      {text.split(" ").slice(0, 4).join(" ")} …
    </span>
  );
}

/** Ligne dépliable : titre + références, puis Début et Fin l'un sous l'autre
 * (une ligne chacun, texte arabe en gras aligné à droite). Chaque ligne ouvre
 * la page et met l'āyah en surbrillance. */
function BoundRow({
  title,
  sub,
  start,
  end,
  current,
  isOpen,
  onToggle,
  go,
  children,
}: {
  title: string;
  sub: string;
  start: RubBoundRow;
  end: RubBoundRow;
  current?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  go: (page: number, mark?: string) => void;
  children?: ReactNode;
}) {
  const line = "flex w-full items-center gap-2 rounded-lg px-1 py-0.5 text-left transition hover:bg-muted/60";
  return (
    <li className={cn("rounded-xl border border-border", current && "border-gold bg-gold/10")}>
      <div className="flex items-stretch">
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? `Replier ${title}` : `Déplier ${title}`}
          className="grid w-9 shrink-0 place-items-start pt-3 text-muted-foreground"
        >
          <ChevronDown className={cn("mx-auto size-4 transition", !isOpen && "-rotate-90")} />
        </button>
        <div className="min-w-0 flex-1 py-2 pr-2">
          <button onClick={onToggle} className="block w-full text-left">
            <span className="block text-sm font-bold">{title}</span>
            <span className="block text-[11px] tabular-nums text-muted-foreground">{sub}</span>
          </button>
          <div className="mt-1">
            <button onClick={() => go(start[1], start[0])} className={line}>
              <span className="w-[4.6rem] shrink-0 text-[11px] font-semibold tabular-nums text-muted-foreground">
                Début · {start[0]}
              </span>
              <ArLine text={start[2]} className="text-[15px] font-bold" />
            </button>
            <button onClick={() => go(end[4], end[3])} className={line}>
              <span className="w-[4.6rem] shrink-0 text-[11px] font-semibold tabular-nums text-muted-foreground">
                Fin · {end[3]}
              </span>
              <ArLine text={end[5]} className="text-[15px] font-bold" />
            </button>
          </div>
        </div>
      </div>
      {isOpen && children && <div className="px-2 pb-2">{children}</div>}
    </li>
  );
}

/** Un hizb : début/fin + ses quatre quarts. */
function HizbNode({
  h,
  withJuz,
  current,
  rub,
  open,
  toggle,
  go,
}: {
  h: number;
  withJuz?: boolean;
  current?: number;
  rub?: number;
  open: Set<string>;
  toggle: (k: string) => void;
  go: (page: number, mark?: string) => void;
}) {
  const first = RUB_BOUNDS[(h - 1) * 4];
  const last = RUB_BOUNDS[h * 4 - 1];
  return (
    <BoundRow
      title={`Hizb ${h}`}
      sub={`${withJuz ? `Juz ${Math.ceil(h / 2)} · ` : ""}${first[0]} → ${last[3]}`}
      start={first}
      end={last}
      current={h === current}
      isOpen={open.has(`h${h}`)}
      onToggle={() => toggle(`h${h}`)}
      go={go}
    >
      <ul className="border-l-2 border-border pl-2">
        {[1, 2, 3, 4].map((k) => {
          const r = (h - 1) * 4 + k;
          const b = RUB_BOUNDS[r - 1];
          return (
            <li key={k}>
              <button
                onClick={() => go(b[1], b[0])}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1 text-left text-xs transition hover:bg-muted",
                  r === rub && "bg-gold/20",
                )}
              >
                <span className="w-[5.4rem] shrink-0">
                  <span className="block text-sm font-bold">{k}/4</span>
                  <span className="block text-[11px] tabular-nums text-muted-foreground">
                    {b[0]} → {b[3]}
                  </span>
                </span>
                <ArLine text={b[2]} className="text-[15px] font-bold" />
              </button>
            </li>
          );
        })}
      </ul>
    </BoundRow>
  );
}

export function GoToPanel({
  initialTab,
  juz,
  hizb,
  rub,
  surahId,
  page,
  chapters,
  reciterId,
  onClose,
  onGo,
}: {
  initialTab: NavTab;
  juz?: number;
  hizb?: number;
  rub?: number;
  surahId?: number;
  page: number;
  chapters: {
    id: number;
    nameArabic: string;
    nameFrench: string;
    pages: [number, number];
    versesCount: number;
    revelationPlace?: "makkah" | "madinah";
  }[];
  reciterId: string;
  onClose: () => void;
  /** Remplace la navigation par défaut (Mushaf) — ex. mode āyah par āyah. */
  onGo?: (page: number, mark?: string) => void;
}) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<NavTab>(initialTab);
  const [value, setValue] = useState(String(page));
  const [q, setQ] = useState("");
  // Nœuds dépliés (juz « j3 », hizb « h5 ») : on ouvre d'emblée ceux de la page en cours.
  const [open, setOpen] = useState<Set<string>>(
    () => new Set([juz ? `j${juz}` : "", hizb ? `h${hizb}` : ""].filter(Boolean)),
  );
  const toggle = (k: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(k)) next.add(k);
      return next;
    });

  const go = (p: number, mark?: string) => {
    if (onGo) {
      onGo(clampPage(p), mark);
      onClose();
      return;
    }
    navigate({
      to: "/quran/page/$page",
      params: { page: String(clampPage(p)) },
      search: { r: reciterId, mark },
    });
    onClose();
  };

  const list = chapters.filter((c) =>
    q
      ? c.nameFrench.toLowerCase().includes(q.toLowerCase()) ||
        c.nameArabic.includes(q) ||
        String(c.id) === q
      : true,
  );
  const tabs: { key: NavTab; label: string }[] = [
    { key: "page", label: "Page" },
    { key: "surah", label: "Sourate" },
    { key: "juz", label: "Juz" },
    { key: "hizb", label: "Hizb" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm">
      <div className="max-h-[80dvh] w-full overflow-y-auto rounded-t-3xl border-t border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Aller à…</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-9 place-items-center rounded-full border border-border"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mb-3 grid grid-cols-4 gap-1 rounded-full bg-muted p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full py-1.5 text-sm font-semibold transition",
                tab === t.key ? "bg-background shadow-sm" : "text-muted-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "page" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(Number(value));
            }}
            className="space-y-4 pb-2"
          >
            <div className="flex gap-2">
              <input
                inputMode="numeric"
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 3))}
                placeholder="Numéro de page (1–604)"
                className="h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-center text-lg font-bold tabular-nums"
              />
              <button className="rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
                Ouvrir
              </button>
            </div>
            <input
              type="range"
              min={1}
              max={604}
              value={clampPage(Number(value) || 1)}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Choisir la page"
              className="w-full accent-[var(--gold)]"
            />
            <div className="flex justify-between text-xs tabular-nums text-muted-foreground">
              <span>1</span>
              <span>604</span>
            </div>
          </form>
        )}

        {tab === "surah" && (
          <>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Chercher une sourate"
              className="mb-2 h-11 w-full rounded-full border border-border bg-background px-4 text-sm"
            />
            <ul className="space-y-1 pb-4">
              {list.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => go(c.pages[0])}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-muted",
                      c.id === surahId && "bg-gold/10",
                    )}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate">
                        <span className="text-muted-foreground">{c.id}. </span>
                        {c.nameFrench}
                      </span>
                      {c.revelationPlace && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          {c.revelationPlace === "makkah" ? (
                            <KaabaIcon className="size-3.5 text-foreground" />
                          ) : (
                            <MadinaMosqueIcon className="size-3.5 text-[#3f7a54] dark:text-[#6fe0b0]" />
                          )}
                          {c.revelationPlace === "makkah" ? "Mecquoise" : "Médinoise"} · {c.versesCount} āyāt
                        </span>
                      )}
                    </span>
                    <span lang="ar" className="font-arabic text-gold">
                      {c.nameArabic}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === "hizb" && (
          <ul className="space-y-1.5 pb-4">
            {Array.from({ length: 60 }, (_, i) => i + 1).map((h) => (
              <HizbNode key={h} h={h} withJuz current={hizb} rub={rub} open={open} toggle={toggle} go={go} />
            ))}
          </ul>
        )}

        {tab === "juz" && (
          <ul className="space-y-1.5 pb-4">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => {
              const first = RUB_BOUNDS[(j - 1) * 8];
              const last = RUB_BOUNDS[j * 8 - 1];
              return (
                <BoundRow
                  key={j}
                  title={`Juz ${j}`}
                  sub={`${first[0]} → ${last[3]}`}
                  start={first}
                  end={last}
                  current={j === juz}
                  isOpen={open.has(`j${j}`)}
                  onToggle={() => toggle(`j${j}`)}
                  go={go}
                >
                  <ul className="space-y-1.5 border-l-2 border-border pl-2">
                    {[1, 2].map((k) => (
                      <HizbNode key={k} h={(j - 1) * 2 + k} current={hizb} rub={rub} open={open} toggle={toggle} go={go} />
                    ))}
                  </ul>
                </BoundRow>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
