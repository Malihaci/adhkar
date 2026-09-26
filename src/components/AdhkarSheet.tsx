import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { DoorOpen, Headphones, Luggage, Moon, Sparkles, Sunrise, X } from "lucide-react";

/**
 * Choix Adhkār — Quotidien (Matin/Soir) + Occasions. Composant partagé entre
 * l'accueil (porte "Adhkār") et la bottom nav (§3/§5 mission) : une seule
 * définition, réutilisée partout où ce choix doit apparaître.
 */
export function AdhkarSheet({
  morningPct,
  eveningPct,
  onClose,
}: {
  morningPct: number;
  eveningPct: number;
  onClose: () => void;
}) {
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
          <h2 className="font-display text-lg font-semibold">Quel Adhkâr souhaitez-vous lire ?</h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Quotidien
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to="/matin"
            onClick={onClose}
            className="surface-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-gold/40"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
              <Sunrise className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">Adhkâr du matin</p>
              <p className="text-xs text-muted-foreground">{morningPct}% complété aujourd'hui</p>
            </div>
          </Link>
          <Link
            to="/soir"
            onClick={onClose}
            className="surface-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
              <Moon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">Adhkâr du soir</p>
              <p className="text-xs text-muted-foreground">{eveningPct}% complété aujourd'hui</p>
            </div>
          </Link>
        </div>

        <Link
          to="/ecoute"
          onClick={onClose}
          className="surface-card mt-3 flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition hover:-translate-y-0.5 hover:border-primary/40"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
            <Headphones className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">Tout écouter (Matin/Soir)</p>
            <p className="text-xs text-muted-foreground">Récitation Al-'Afâsy, texte synchronisé</p>
          </div>
        </Link>

        <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Occasions
        </p>
        <div className="space-y-1.5">
          <OccasionRow
            to="/reveil"
            icon={<Sunrise className="size-4" />}
            label="Réveil"
            arabic="أذكار الاستيقاظ"
            onClose={onClose}
          />
          <OccasionRow
            to="/coucher"
            icon={<Moon className="size-4" />}
            label="Avant de dormir"
            arabic="أذكار النوم"
            onClose={onClose}
          />
          <OccasionRow
            to="/apres-priere"
            icon={<Sparkles className="size-4" />}
            label="Après la prière"
            arabic="أذكار بعد الصلاة"
            onClose={onClose}
          />
          <OccasionRow
            to="/sortie"
            icon={<DoorOpen className="size-4" />}
            label="Sortir de la maison"
            arabic="الخروج من المنزل"
            onClose={onClose}
          />
          <OccasionRow
            to="/voyage"
            icon={<Luggage className="size-4" />}
            label="Voyage"
            arabic="أذكار السفر"
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}

function OccasionRow({
  to,
  icon,
  label,
  arabic,
  onClose,
}: {
  to: "/reveil" | "/coucher" | "/apres-priere" | "/sortie" | "/voyage";
  icon: ReactNode;
  label: string;
  arabic: string;
  onClose: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-muted"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{label}</span>
      <span lang="ar" dir="rtl" className="font-arabic text-xs text-muted-foreground">
        {arabic}
      </span>
    </Link>
  );
}
