import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, BookMarked, Share2, Clock, Compass, Download, Flower2, Heart, Search, Settings, Sparkles, X, type LucideIcon } from "lucide-react";
import { useInstallPrompt } from "@/lib/pwaInstall";
import { sharePage } from "@/lib/pageShare";

/**
 * "Plus" — point d'accès unique aux contenus/réglages secondaires (§5/§I
 * mission). "Comprendre — Tadabbur" (accès général, hors āyah précise) y
 * reste accessible depuis que CoranSheet a été supprimé (chantier "Coran
 * direct") — l'accès le plus rapide au contenu Comprendre/Tadabbur reste
 * désormais au niveau de l'āyah (bouton "Étudier" dans le lecteur), mais
 * rien de ce contenu n'a été retiré ni rendu injoignable.
 */
export function PlusSheet({
  onClose,
  actions: pageActions = [],
  header,
}: {
  onClose: () => void;
  /** Actions propres à la page (ex. Partager), affichées en tête. */
  /** Contenu propre à la page, affiché en tête. */
  header?: ReactNode;
  actions?: { label: string; icon: LucideIcon; onClick: () => void }[];
}) {
  const { canInstall, isStandalone } = useInstallPrompt();
  // Sans action de partage propre à la page, Plus propose de partager la page en cours.
  const actions = pageActions.some((a) => /partag/i.test(a.label))
    ? pageActions
    : [{ label: "Partager cette page", icon: Share2, onClick: () => void sharePage() }, ...pageActions];
  const items = [
    // Entrée discrète (§3 mission "Installation") — seulement quand le
    // navigateur a réellement déclenché `beforeinstallprompt`, jamais un
    // bouton toujours visible qui ne mènerait à rien sur Safari/desktop.
    ...(canInstall && !isStandalone
      ? [{ to: "/install" as const, label: "Installer l'application", icon: Download }]
      : []),
    { to: "/favoris" as const, label: "Favoris", icon: Heart },
    { to: "/tadabbur" as const, label: "Comprendre — Tadabbur", icon: Sparkles },
    { to: "/horaires" as const, label: "Horaires de prière", icon: Clock },
    { to: "/qibla" as const, label: "Qibla", icon: Compass },
    { to: "/cycle" as const, label: "Mon cycle", icon: Flower2 },
    { to: "/rappels" as const, label: "Mes rappels", icon: Bell },
    { to: "/wird" as const, label: "Mon Wird / Khatma", icon: BookMarked },
    { to: "/recherche" as const, label: "Recherche", icon: Search },
    { to: "/parametres" as const, label: "Paramètres", icon: Settings },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[88dvh] w-full overflow-y-auto rounded-t-3xl border-t border-border bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
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
        {header && <div className="mb-2 border-b border-border pb-2">{header}</div>}
        <div className="space-y-1.5">
          {actions.map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                onClick();
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-muted"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{label}</span>
            </button>
          ))}
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
