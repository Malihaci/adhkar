import type { ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export interface NavItem {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  to?: "/" | "/horaires";
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}

/** Barre flottante unique de l'app (style de l'accueil) : seules les icônes changent selon la page. */
export function FloatingNav({ items, global }: { items: NavItem[]; global?: boolean }) {
  return (
    <nav
      data-global-nav={global ? "" : undefined}
      aria-label="Navigation principale"
      style={{ bottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
      className="fixed inset-x-3 z-40 mx-auto max-w-md rounded-[1.35rem] border border-border/60 bg-card/85 px-1.5 py-1 shadow-[0_8px_24px_-8px_rgba(0,0,0,.35)] backdrop-blur-xl"
    >
      <ul className="flex items-center justify-around">
        {items.map((item) => {
          const className = cn(
            "flex w-full flex-col items-center gap-0.5 rounded-xl py-1.5 transition active:scale-95 active:bg-muted disabled:opacity-30",
            item.active ? "text-primary" : "text-muted-foreground",
          );
          const content = (
            <>
              <span className={item.active ? "text-primary" : "text-foreground/80"}>
                <item.icon className="size-[19px]" strokeWidth={1.75} />
              </span>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </>
          );
          return (
            <li key={item.key} className="flex-1">
              {item.to ? (
                <Link to={item.to} aria-label={item.label} className={className}>
                  {content}
                </Link>
              ) : (
                <button type="button" onClick={item.onClick} disabled={item.disabled} aria-label={item.label} className={className}>
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
