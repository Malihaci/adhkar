import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Teintes des cartes (même palette que l'accueil) ; on les fait tourner par position. */
export const HUB_COLORS = ["#c49a2c", "#2f7d78", "#8a63c0", "#2d8fbf", "#c0504a", "#4f8a4b", "#b8742a", "#5a60b5"];

/** Classe commune des cartes cliquables : à poser sur un <Link> ou un <button>. */
export const hubCardClass =
  "surface-card relative flex min-h-[5.25rem] flex-col items-center gap-1 rounded-2xl px-1 pb-2 pt-2 text-center transition duration-150 active:scale-[0.97]";

/** Grille de cartes : 3 colonnes. */
export function HubGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-3 gap-2", className)}>{children}</div>;
}

/** Contenu d'une carte : icône colorée, titre français, arabe en petit, compteur dans le coin. */
export function HubCardBody({
  label,
  arabic,
  color,
  icon,
  note,
}: {
  label: string;
  arabic?: string;
  color: string;
  icon: ReactNode;
  note?: string | number;
}) {
  return (
    <span style={{ "--c": color } as CSSProperties} className="contents">
      {note !== undefined && (
        <span className="absolute right-2 top-1.5 text-[10px] font-medium text-muted-foreground">{note}</span>
      )}
      <span className="grid size-8 place-items-center rounded-[10px] bg-[color-mix(in_srgb,var(--c)_16%,transparent)] text-[var(--c)] [&_svg]:size-[17px]">
        {icon}
      </span>
      <span className="flex min-h-[1.9rem] items-center font-display text-[0.8rem] font-bold leading-[1.1] text-foreground">
        {label}
      </span>
      {arabic && (
        <span lang="ar" dir="rtl" className="font-arabic text-[0.8rem] leading-tight text-[var(--c)]">
          {arabic}
        </span>
      )}
    </span>
  );
}
