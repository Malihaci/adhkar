import { Link } from "@tanstack/react-router";
import { Bell, BookMarked, Heart, Search, Settings, X } from "lucide-react";

/** "Plus" — point d'accès unique aux contenus/réglages secondaires (§5/§I mission). */
export function PlusSheet({ onClose }: { onClose: () => void }) {
  const items = [
    { to: "/favoris" as const, label: "Favoris", icon: Heart },
    { to: "/rappels" as const, label: "Mes rappels", icon: Bell },
    { to: "/wird" as const, label: "Mon Wird / Khatma", icon: BookMarked },
    { to: "/recherche" as const, label: "Recherche", icon: Search },
    { to: "/parametres/apparence" as const, label: "Paramètres", icon: Settings },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl border-t border-border bg-card p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Plus</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="space-y-1.5">
          {items.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-muted"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
