import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/storage";
import { BottomNav } from "./BottomNav";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AppShell({ title, subtitle, children }: Props) {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-dvh bg-background pb-24">
      <header className="hero-gradient sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Adhkâr
            </p>
            <h1 className="truncate font-display text-2xl font-semibold">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition hover:border-primary/40 hover:text-primary"
          >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-5">{children}</main>
      <BottomNav />
    </div>
  );
}
