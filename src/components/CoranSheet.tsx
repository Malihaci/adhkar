import { Link } from "@tanstack/react-router";
import { BookMarked, BookOpen, Headphones, X } from "lucide-react";

/**
 * Coran → Lire · Écouter · Comprendre (§3 mission). Tadabbur reste
 * accessible ici plutôt que via une porte dédiée sur l'accueil.
 * "Écouter" masqué tant que SHOW_ECOUTE_ENTRY est false (voir index.tsx).
 */
const SHOW_ECOUTE_ENTRY = false;

export function CoranSheet({ lastPage, onClose }: { lastPage: number; onClose: () => void }) {
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
          <h2 className="font-display text-lg font-semibold">Coran</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="space-y-3">
          <Link
            to="/quran/page/$page"
            params={{ page: String(lastPage) }}
            onClick={onClose}
            className="surface-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-gold/40"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
              <BookOpen className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">Lire</p>
              <p className="text-xs text-muted-foreground">Reprendre à la page {lastPage}</p>
            </div>
          </Link>
          <Link
            to="/tadabbur"
            onClick={onClose}
            className="surface-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
              <BookMarked className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">Comprendre — Tadabbur</p>
              <p className="text-xs text-muted-foreground">Méditation et sens du Coran</p>
            </div>
          </Link>
          {SHOW_ECOUTE_ENTRY && (
            <Link
              to="/ecoute"
              onClick={onClose}
              className="surface-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
                <Headphones className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">Écouter</p>
                <p className="text-xs text-muted-foreground">Récitation Al-'Afâsy synchronisée</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
