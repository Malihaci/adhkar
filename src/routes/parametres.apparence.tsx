import { createFileRoute } from "@tanstack/react-router";
import { Laptop, Moon, Sun } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useTheme, type ThemeMode } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/parametres/apparence")({
  head: () => ({
    meta: [
      { title: "Apparence — Paramètres" },
      { name: "description", content: "Choisissez l'apparence claire, sombre ou automatique." },
    ],
  }),
  component: ApparencePage,
});

const OPTIONS: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: "auto", label: "Automatique", icon: Laptop },
  { mode: "light", label: "Clair", icon: Sun },
  { mode: "dark", label: "Sombre", icon: Moon },
];

function ApparencePage() {
  const { mode, setMode } = useTheme();

  return (
    <AppShell title="Apparence" subtitle="المظهر">
      <div className="space-y-3">
        {OPTIONS.map(({ mode: m, label, icon: Icon }) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "surface-card flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition",
              mode === m && "border-primary/50 bg-primary/5",
            )}
          >
            <span
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-full",
                mode === m ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
              )}
            >
              <Icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1 text-sm font-medium text-foreground">{label}</span>
            <span
              className={cn(
                "size-5 shrink-0 rounded-full border-2",
                mode === m ? "border-primary bg-primary" : "border-border",
              )}
            />
          </button>
        ))}
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          "Automatique" suit le réglage clair/sombre de votre appareil.
        </p>
      </div>
    </AppShell>
  );
}
