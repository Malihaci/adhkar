import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Sunrise, Moon, Heart, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/matin", label: "Matin", icon: Sunrise },
  { to: "/soir", label: "Soir", icon: Moon },
  { to: "/favoris", label: "Favoris", icon: Heart },
  { to: "/recherche", label: "Recherche", icon: Search },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70"
    >
      <ul className="mx-auto flex max-w-3xl items-stretch justify-around px-1 py-1.5">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-full transition-all",
                    active && "bg-primary/12",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
