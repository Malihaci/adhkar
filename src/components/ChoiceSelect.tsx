import { Children, Fragment, isValidElement, useEffect, useMemo, useState, type ReactElement, type ReactNode } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Liste de choix lisible, à la place du <select> natif (illisible sur mobile
 * dès qu'il y a des groupes ou des libellés longs). Même API que <select> :
 * on passe des <option> / <optgroup>. Un tap ouvre une feuille propre, le
 * choix actuel est coché, un tap ailleurs referme.
 */
interface Opt {
  value: string;
  label: string;
  group?: string;
}

function collect(children: ReactNode, group: string | undefined, out: Opt[]) {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const el = child as ReactElement<{ value?: string | number; label?: string; children?: ReactNode }>;
    if (el.type === "option") {
      out.push({
        value: String(el.props.value ?? ""),
        label: Children.toArray(el.props.children).join(""),
        group,
      });
    } else if (el.type === "optgroup") {
      collect(el.props.children, el.props.label, out);
    } else if (el.type === Fragment || el.props.children) {
      collect(el.props.children, group, out);
    }
  });
}

export function ChoiceSelect({
  value,
  onChange,
  children,
  title,
  className,
  ariaLabel,
}: {
  value: string | number;
  onChange: (v: string) => void;
  children: ReactNode;
  /** Titre de la feuille (par défaut : aucun). */
  title?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const opts = useMemo(() => {
    const out: Opt[] = [];
    collect(children, undefined, out);
    return out;
  }, [children]);
  const current = opts.find((o) => o.value === String(value));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  let lastGroup: string | undefined;
  return (
    <>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-2 rounded-2xl border border-border bg-background px-4 text-left text-sm font-medium",
          className,
        )}
      >
        <span className="min-w-0 truncate">{current?.label ?? "—"}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end bg-black/45 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        >
          <div
            role="listbox"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[75dvh] w-full overflow-y-auto overscroll-contain rounded-t-3xl border-t border-border bg-card pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[var(--shadow-elevated)]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between bg-card/95 px-5 pb-2 pt-4 backdrop-blur">
              <p className="font-display text-base font-semibold">{title ?? ariaLabel ?? "Choisir"}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            <ul className="px-2">
              {opts.map((o) => {
                const head = o.group && o.group !== lastGroup ? o.group : null;
                lastGroup = o.group;
                const on = o.value === String(value);
                return (
                  <Fragment key={o.value}>
                    {head && (
                      <li
                        aria-hidden
                        className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                      >
                        {head}
                      </li>
                    )}
                    <li>
                      <button
                        type="button"
                        role="option"
                        aria-selected={on}
                        onClick={() => {
                          onChange(o.value);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] transition active:bg-muted",
                          on ? "bg-primary/10 font-semibold text-primary" : "text-foreground hover:bg-muted/60",
                        )}
                      >
                        <span className="min-w-0">{o.label}</span>
                        {on && <Check className="size-4 shrink-0" />}
                      </button>
                    </li>
                  </Fragment>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
