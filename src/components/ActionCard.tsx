import type { CSSProperties, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/** Palette fonctionnelle des cartes d'action : Coran vert, Adhkār doré, Lecture du jour violet, Horaires bleu, accent doux pour le contextuel. */
export const ACTION_COLORS = {
  coran: "#1f9d6b",
  adhkar: "#c79a2e",
  lecture: "#8a63c0",
  horaires: "#2d8fbf",
  doux: "#c0643f",
} as const;

/**
 * Carte d'action de l'accueil — une seule définition (hauteur, padding,
 * icône et typographie homogènes). Le titre peut passer sur deux lignes,
 * jamais tronqué ; aucun contour coloré : la teinte ne porte que l'icône,
 * la barre de progression et le bouton.
 */
export function ActionCard({
  to,
  params,
  search,
  color,
  icon,
  title,
  sub,
  cta,
  pct,
  className,
}: {
  to: string;
  params?: Record<string, string>;
  search?: Record<string, unknown>;
  color: string;
  icon: ReactNode;
  title: string;
  sub?: string;
  cta: string;
  /** Progression 0–100 : barre fine sous le texte. */
  pct?: number;
  className?: string;
}) {
  return (
    <Link
      to={to}
      params={params as never}
      search={search as never}
      style={{ "--c": color } as CSSProperties}
      className={cn(
        "surface-card flex min-h-[4.5rem] items-center gap-3 rounded-2xl p-3 transition duration-150 active:scale-[0.985]",
        className,
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--c)_16%,transparent)] text-[var(--c)] [&_svg]:size-5">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-center">
        <span className="block text-[15px] font-semibold leading-tight text-foreground">{title}</span>
        {sub && <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{sub}</span>}
        {pct !== undefined && (
          <span className="mt-2 block h-1 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--c)_18%,transparent)]">
            <span
              className="block h-full rounded-full bg-[var(--c)] transition-[width] duration-300"
              style={{ width: `${Math.max(pct, 4)}%` }}
            />
          </span>
        )}
      </span>
      <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-[color-mix(in_srgb,var(--c)_16%,transparent)] px-3 text-[13px] font-semibold text-[color-mix(in_srgb,var(--c)_70%,var(--foreground))]">
        {cta}
      </span>
    </Link>
  );
}
