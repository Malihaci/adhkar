import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Accueil : remplace l'éveil/titre/sous-titre par la Basmala + Salam (§2 mission). */
  homeHeader?: boolean;
  /** Une seule icône ⚙️ par écran (chantier "Paramètres centralisés") — à
   * ne passer que si la page fournit déjà son propre bouton contextuel
   * (ex. Horaires), pour ne jamais en afficher deux à la fois. */
  hideSettings?: boolean;
  /** Destination de l'icône ⚙️ générique — par défaut le centre complet. */
  settingsHref?: "/parametres" | "/parametres/apparence";
}

export function AppShell({
  title,
  subtitle,
  children,
  homeHeader,
  hideSettings,
  settingsHref = "/parametres",
}: Props) {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <header className="hero-gradient sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div
          className={cn(
            "mx-auto flex max-w-3xl items-center gap-4 px-5",
            homeHeader ? "justify-center py-3" : "justify-between py-4",
          )}
        >
          {homeHeader ? (
            <p lang="ar" dir="rtl" className="font-arabic text-lg text-foreground">
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ
            </p>
          ) : (
            <>
              <div className="min-w-0">
                <h1 className="truncate font-display text-2xl font-semibold">{title}</h1>
                {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
              </div>
              {!hideSettings && (
                <Link
                  to={settingsHref}
                  aria-label="Paramètres"
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  <Settings className="size-5" />
                </Link>
              )}
            </>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-5">{children}</main>
      <BottomNav />
    </div>
  );
}
