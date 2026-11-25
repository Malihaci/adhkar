import { useMemo, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Droplet, Pencil, Upload } from "lucide-react";
import { ChoiceSelect } from "@/components/ChoiceSelect";
import { cn } from "@/lib/utils";
import {
  computeCycle,
  currentPeriodDay,
  dayNum,
  fertileWindows,
  fertilityMap,
  isoFromNum,
  isoOf,
  markedDays,
  useCycle,
  type CycleData,
  type FertLevel,
} from "@/lib/cycle";

export const Route = createFileRoute("/cycle")({
  head: () => ({
    meta: [
      { title: "Mon cycle" },
      { name: "description", content: "Dates des règles et prochaines règles estimées, enregistrées sur votre téléphone." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CyclePage,
});

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const fmtLong = (n: number) => {
  const [, m, d] = isoFromNum(n).split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}`;
};

function CyclePage() {
  const [data, setData, hydrated] = useCycle();
  const [editing, setEditing] = useState(false);
  const today = isoOf(new Date());
  const todayN = dayNum(today);

  const stats = useMemo(() => computeCycle(data, today), [data, today]);
  // Jour des règles = depuis le premier jour de la série de jours marqués qui contient aujourd'hui
  // (et non depuis le seul bouton « commencées »), pour ne pas repartir à « Jour 1 ».
  const lastPeriod = stats.periods[stats.periods.length - 1];
  const periodDay =
    lastPeriod && lastPeriod.start <= todayN && todayN <= lastPeriod.end
      ? todayN - lastPeriod.start + 1
      : currentPeriodDay(data, today);
  const inPeriod = periodDay >= 1 && periodDay <= 14;
  const nextN = stats.next[0];
  const left = nextN != null ? nextN - todayN : null;
  const marked = useMemo(() => markedDays(data, today), [data, today]);
  const predicted = useMemo(() => {
    const s = new Set<number>();
    stats.next.forEach((n) => {
      for (let i = 0; i < stats.periodLength; i++) s.add(n + i);
    });
    return s;
  }, [stats]);
  const windows = useMemo(() => fertileWindows(stats.next), [stats.next]);
  const fert = useMemo(() => fertilityMap(windows), [windows]);
  const ovulations = useMemo(() => new Set(windows.map((w) => w.ovulation)), [windows]);
  const ovul = windows.find((w) => w.ovulation >= todayN)?.ovulation ?? null;

  const startPeriod = () => setData((d) => ({ ...d, open: today }));
  const endPeriod = () =>
    setData((d) => {
      if (!d.open) return d;
      const set = new Set(d.days);
      for (let n = dayNum(d.open); n <= todayN; n++) set.add(isoFromNum(n));
      return { ...d, days: [...set].sort(), open: null };
    });

  if (!hydrated) return <div className="min-h-[100dvh] bg-background" />;

  if (editing) return <EditView data={data} setData={setData} onDone={() => setEditing(false)} />;

  return (
    <div className="mx-auto min-h-[100dvh] max-w-2xl bg-background px-4 pb-32 pt-4">
      <header className="mb-4 flex items-center gap-3">
        <Link to="/" aria-label="Accueil" className="grid size-10 shrink-0 place-items-center rounded-full border border-border">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="font-display text-xl font-semibold">Mon cycle</h1>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="ml-auto flex h-10 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-semibold"
        >
          <Pencil className="size-4" /> Saisir
        </button>
      </header>

      {!stats.hasHistory ? (
        <section className="surface-card px-5 py-8 text-center">
          <Droplet className="mx-auto size-8 text-rose-500" />
          <p className="mt-3 font-display text-lg font-semibold">Commencez par vos dernières règles</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Indiquez les jours de vos dernières règles : l'application calcule la date des prochaines.
          </p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-4 h-12 w-full rounded-full bg-rose-500 text-sm font-bold text-white active:scale-[0.98]"
          >
            Saisir mes dernières règles
          </button>
        </section>
      ) : (
        <>
          <section className="surface-card px-5 py-6 text-center">
            {inPeriod ? (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Aujourd'hui</p>
                <p className="mt-1 font-display text-4xl font-bold text-rose-500">Jour {periodDay}</p>
                <p className="mt-1 text-sm text-muted-foreground">Règles en cours</p>
                <p className="mt-3 text-sm text-foreground">Prière et jeûne : dispensés pendant cette période.</p>
              </>
            ) : (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Prochaines règles</p>
                {left != null && left >= 0 ? (
                  <p className="mt-1 font-display text-4xl font-bold text-primary">
                    {left === 0 ? "Aujourd'hui" : `${left} jour${left > 1 ? "s" : ""}`}
                  </p>
                ) : (
                  <p className="mt-1 font-display text-2xl font-bold text-primary">Attendues depuis {left != null ? -left : 0} j</p>
                )}
                {nextN != null && <p className="mt-1 text-sm text-muted-foreground">vers le {fmtLong(nextN)}</p>}
              </>
            )}
            <button
              type="button"
              onClick={inPeriod ? endPeriod : startPeriod}
              className={cn(
                "mt-5 h-12 w-full rounded-full text-sm font-bold active:scale-[0.98]",
                inPeriod ? "border border-border bg-card text-foreground" : "bg-rose-500 text-white",
              )}
            >
              {inPeriod ? "Mes règles sont terminées" : "Mes règles ont commencé"}
            </button>
          </section>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <Tile value={`${stats.cycleLength} j`} label="Cycle" />
            <Tile value={`${stats.periodLength} j`} label="Règles" />
            <Tile value={ovul != null ? fmtShort(ovul) : "—"} label="Ovulation" />
          </div>

          <CycleCalendar
            todayN={todayN}
            marked={marked}
            predicted={predicted}
            fert={fert}
            ovulations={ovulations}
          />
        </>
      )}

      <Backup data={data} setData={setData} />
    </div>
  );
}

const fmtShort = (n: number) => {
  const [, m, d] = isoFromNum(n).split("-").map(Number);
  return `${d} ${MONTHS[m - 1].slice(0, 4)}${MONTHS[m - 1].length > 4 ? "." : ""}`;
};

function Tile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-muted/60 px-3 py-2">
      <p className="text-base font-semibold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

/** Calendrier en lecture : le mois choisi et le suivant. Touchez un jour pour son détail. */
function CycleCalendar({
  todayN,
  marked,
  predicted,
  fert,
  ovulations,
}: {
  todayN: number;
  marked: Set<number>;
  predicted: Set<number>;
  fert: Map<number, FertLevel>;
  ovulations: Set<number>;
}) {
  const now = new Date();
  const [base, setBase] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [sel, setSel] = useState<number | null>(null);
  const shift = (d: number) =>
    setBase(({ y, m }) => {
      const t = new Date(y, m + d, 1);
      return { y: t.getFullYear(), m: t.getMonth() };
    });
  const months = [0, 1].map((k) => {
    const t = new Date(base.y, base.m + k, 1);
    return { y: t.getFullYear(), m: t.getMonth() };
  });

  const describe = (n: number) => {
    if (marked.has(n)) return "Règles";
    if (predicted.has(n)) return "Règles prévues";
    if (ovulations.has(n)) return "Ovulation estimée · fertilité très élevée";
    const f = fert.get(n);
    if (f === "peak") return "Fertilité très élevée";
    if (f === "high") return "Fertilité élevée";
    return "Fertilité faible";
  };

  return (
    <section className="surface-card mt-3 px-3 py-3">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} aria-label="Mois précédent" className="grid size-9 place-items-center rounded-full border border-border">
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-xs text-muted-foreground">Touchez un jour pour le détail</span>
        <button type="button" onClick={() => shift(1)} aria-label="Mois suivant" className="grid size-9 place-items-center rounded-full border border-border">
          <ChevronRight className="size-4" />
        </button>
      </div>

      {months.map(({ y, m }) => {
        const count = new Date(y, m + 1, 0).getDate();
        const offset = (new Date(y, m, 1).getDay() + 6) % 7;
        return (
          <div key={`${y}-${m}`} className="mb-3">
            <p className="mb-1 px-1 font-display text-sm font-semibold capitalize">
              {MONTHS[m]} {y}
            </p>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                <span key={i} className="text-[11px] text-muted-foreground">
                  {d}
                </span>
              ))}
              {Array.from({ length: offset }).map((_, i) => (
                <span key={`o${i}`} />
              ))}
              {Array.from({ length: count }).map((_, i) => {
                const n = dayNum(`${y}-${String(m + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`);
                const on = marked.has(n);
                const pred = !on && predicted.has(n);
                const f = !on && !pred ? fert.get(n) : undefined;
                const solid = on || f === "peak";
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setSel(n)}
                    aria-label={`${i + 1} ${MONTHS[m]} : ${describe(n)}`}
                    className={cn(
                      "relative grid aspect-square place-items-center rounded-full text-[13px]",
                      on && "bg-rose-500 font-semibold text-white",
                      pred && "border-[1.5px] border-dashed border-rose-400",
                      f === "peak" && "bg-sky-500/80 font-semibold text-white",
                      f === "high" && "bg-sky-500/20",
                      n === todayN && "outline outline-2 outline-offset-1 outline-foreground",
                      n === sel && "ring-2 ring-primary ring-offset-1 ring-offset-card",
                    )}
                  >
                    {i + 1}
                    {ovulations.has(n) && !on && (
                      <span className={cn("absolute bottom-[3px] size-1 rounded-full", solid ? "bg-white" : "bg-sky-600")} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <p className="min-h-5 text-center text-sm">
        {sel != null ? (
          <>
            <span className="font-medium">{fmtLong(sel)}</span> · <span className="text-muted-foreground">{describe(sel)}</span>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">Estimation à partir de vos cycles, pas une mesure.</span>
        )}
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-rose-500" /> Règles</span>
        <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full border border-dashed border-rose-400" /> Prévues</span>
        <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-sky-500/20" /> Fertile</span>
        <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-sky-500/80" /> Très fertile</span>
      </div>
    </section>
  );
}

/** Export / import du calendrier (fichier JSON). L'import ajoute les jours, il n'efface rien. */
function Backup({
  data,
  setData,
}: {
  data: CycleData;
  setData: (v: CycleData | ((p: CycleData) => CycleData)) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  const exportData = () => {
    const today = isoOf(new Date());
    const days = [...new Set([...data.days, ...[...markedDays(data, today)].map(isoFromNum)])].sort();
    const blob = new Blob([JSON.stringify({ app: "nurmaliha-cycle", version: 1, days, manual: data.manual }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mon-cycle-${today}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    setMsg("Calendrier exporté.");
  };

  const importData = async (file: File) => {
    try {
      const json = JSON.parse(await file.text());
      const list: unknown = Array.isArray(json) ? json : json?.days;
      if (!Array.isArray(list)) throw new Error("format");
      const valid = list.filter((x): x is string => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x));
      if (!valid.length) throw new Error("vide");
      setData((d) => {
        const set = new Set(d.days);
        valid.forEach((x) => set.add(x));
        const manual = d.manual ?? (typeof json?.manual === "number" ? json.manual : null);
        return { ...d, days: [...set].sort(), manual };
      });
      setMsg(`Calendrier importé : ${valid.length} jours lus.`);
    } catch {
      setMsg("Fichier non reconnu. Choisissez un calendrier exporté depuis l'application.");
    }
  };

  return (
    <section className="mt-3">
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={exportData} className="flex h-11 items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold">
          <Download className="size-4" /> Exporter
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className="flex h-11 items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold">
          <Upload className="size-4" /> Importer
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void importData(f);
          e.target.value = "";
        }}
      />
      {msg && <p className="mt-2 text-xs text-muted-foreground">{msg}</p>}
    </section>
  );
}

function EditView({
  data,
  setData,
  onDone,
}: {
  data: CycleData;
  setData: (v: CycleData | ((p: CycleData) => CycleData)) => void;
  onDone: () => void;
}) {
  const today = isoOf(new Date());
  const todayN = dayNum(today);
  const now = new Date();
  const [month, setMonth] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const marked = markedDays(data, today);
  const stats = computeCycle(data, today);
  const predicted = new Set<number>();
  stats.next.forEach((s) => {
    for (let i = 0; i < stats.periodLength; i++) predicted.add(s + i);
  });
  const fert = useMemo(() => fertilityMap(fertileWindows(stats.next)), [stats.next]);
  const ovulations = useMemo(() => new Set(fertileWindows(stats.next).map((w) => w.ovulation)), [stats.next]);
  /** Premier jour touché : le jour touché ensuite remplit tout l'intervalle. */
  const [anchor, setAnchor] = useState<number | null>(null);

  const toggle = (n: number) => {
    if (n > todayN) return;
    const range = anchor != null && anchor !== n && Math.abs(n - anchor) <= 20;
    const lo = range ? Math.min(anchor!, n) : n;
    const hi = range ? Math.max(anchor!, n) : n;
    setData((d) => {
      const set = new Set(d.days);
      // Les règles « en cours » deviennent des jours saisis avant toute modification.
      if (d.open) for (let k = dayNum(d.open); k <= todayN; k++) set.add(isoFromNum(k));
      if (range) {
        for (let k = lo; k <= hi; k++) set.add(isoFromNum(k));
      } else {
        const iso = isoFromNum(n);
        if (set.has(iso)) set.delete(iso);
        else set.add(iso);
      }
      return { ...d, days: [...set].sort(), open: null };
    });
    setAnchor(range ? null : marked.has(n) ? null : n);
  };

  const first = new Date(month.y, month.m, 1);
  const count = new Date(month.y, month.m + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7;
  const shift = (d: number) =>
    setMonth(({ y, m }) => {
      const t = new Date(y, m + d, 1);
      return { y: t.getFullYear(), m: t.getMonth() };
    });

  return (
    <div className="mx-auto min-h-[100dvh] max-w-2xl bg-background px-4 pb-32 pt-4">
      <header className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onDone}
          aria-label="Retour"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-border"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="font-display text-xl font-semibold">Mes règles</h1>
      </header>

      <section className="surface-card px-3 py-4">
        <div className="mb-3 flex items-center justify-between">
          <button type="button" onClick={() => shift(-1)} aria-label="Mois précédent" className="grid size-9 place-items-center rounded-full border border-border">
            <ChevronLeft className="size-4" />
          </button>
          <p className="font-display text-base font-semibold capitalize">
            {MONTHS[month.m]} {month.y}
          </p>
          <button type="button" onClick={() => shift(1)} aria-label="Mois suivant" className="grid size-9 place-items-center rounded-full border border-border">
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-center">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
            <span key={i} className="text-[11px] text-muted-foreground">
              {d}
            </span>
          ))}
          {Array.from({ length: offset }).map((_, i) => (
            <span key={`o${i}`} />
          ))}
          {Array.from({ length: count }).map((_, i) => {
            const n = dayNum(`${month.y}-${String(month.m + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`);
            const on = marked.has(n);
            const future = n > todayN;
            const f = !on && !predicted.has(n) ? fert.get(n) : undefined;
            return (
              <button
                key={n}
                type="button"
                disabled={future && !predicted.has(n) && !f}
                onClick={() => toggle(n)}
                aria-pressed={on}
                aria-label={`${i + 1} ${MONTHS[month.m]}`}
                className="flex flex-col items-center gap-0.5 py-0.5 disabled:opacity-40"
              >
                <span className={cn("text-[13px]", on ? "font-bold text-rose-500" : "text-foreground", n === todayN && "underline")}>{i + 1}</span>
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full border-2 text-[12px] text-white",
                    on
                      ? "border-rose-500 bg-rose-500"
                      : predicted.has(n)
                        ? "border-dashed border-rose-400 bg-rose-500/10"
                        : f === "peak"
                          ? "border-sky-500 bg-sky-500/80"
                          : f === "high"
                            ? "border-sky-400/60 bg-sky-500/15"
                            : "border-border",
                    n === anchor && "ring-2 ring-rose-400 ring-offset-2 ring-offset-card",
                  )}
                >
                  {on ? "✓" : ovulations.has(n) && !predicted.has(n) ? "●" : ""}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-full bg-rose-500" /> Règles
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-full border border-dashed border-rose-400 bg-rose-500/10" /> Prévu
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-full bg-sky-500/20" /> Fertile
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-full bg-sky-500" /> Très fertile (● ovulation)
          </span>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Astuce : touchez le premier jour puis le dernier, les jours entre les deux sont cochés.
        </p>
      </section>

      <section className="surface-card mt-3 px-4 py-4">
        <span className="mb-1 block text-xs text-muted-foreground">Durée du cycle</span>
        <ChoiceSelect
          title="Durée du cycle"
          value={data.manual ?? "auto"}
          onChange={(v) => setData((d) => ({ ...d, manual: v === "auto" ? null : Number(v) }))}
        >
          <option value="auto">Calculée (moyenne)</option>
          {[24, 26, 28, 30, 32].map((n) => (
            <option key={n} value={n}>
              {n} jours
            </option>
          ))}
        </ChoiceSelect>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-background via-background to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6">
        <button
          type="button"
          onClick={onDone}
          className="mx-auto block h-12 w-full max-w-2xl rounded-full bg-rose-500 text-sm font-bold text-white active:scale-[0.98]"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
