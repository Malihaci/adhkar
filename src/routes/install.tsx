import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Download, Share2, SquarePlus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { detectPlatform, isStandaloneDisplay, useInstallPrompt } from "@/lib/pwaInstall";

export const Route = createFileRoute("/install")({
  head: () => ({
    meta: [
      { title: "Installer l'application" },
      { name: "description", content: "Installez Adhkâr — Coran & Adhkār sur votre téléphone." },
    ],
  }),
  component: InstallPage,
});

const INSTALL_URL = "https://adhkar-gamma.vercel.app/install";
const SHARE_TEXT = `السلام عليكم ورحمة الله وبركاته 🌿\n\nDécouvrez l'application Coran & Adhkār :\n${INSTALL_URL}`;

function InstallPage() {
  const { canInstall, promptInstall, isStandalone } = useInstallPrompt();
  const [installed, setInstalled] = useState(isStandalone);
  const [shared, setShared] = useState(false);
  const platform = detectPlatform();
  const navigate = useNavigate();

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) setInstalled(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: SHARE_TEXT });
        return;
      } catch {
        // annulé par l'utilisateur — pas de repli clipboard dans ce cas
        return;
      }
    }
    await navigator.clipboard.writeText(SHARE_TEXT);
    setShared(true);
    setTimeout(() => setShared(false), 1800);
  };

  return (
    <AppShell title="Installer l'application" subtitle="تثبيت التطبيق">
      <div className="space-y-5">
        <div className="surface-card space-y-4 p-6 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/12 text-primary">
            <Download className="size-8" />
          </div>

          {installed || isStandaloneDisplay() ? (
            <>
              <div>
                <p className="font-display text-lg font-semibold text-foreground">
                  Application déjà installée
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vous pouvez l'ouvrir directement depuis votre écran d'accueil.
                </p>
              </div>
              <button
                onClick={() => navigate({ to: "/" })}
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Ouvrir l'application
              </button>
            </>
          ) : canInstall ? (
            <>
              <div>
                <p className="font-display text-lg font-semibold text-foreground">
                  Installer Adhkâr — Coran &amp; Adhkār
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Accédez-y en un tap, comme une application normale.
                </p>
              </div>
              <button
                onClick={handleInstall}
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Installer l'application
              </button>
            </>
          ) : platform === "ios" ? (
            <div className="space-y-3 text-left">
              <p className="text-center font-display text-lg font-semibold text-foreground">
                Ajouter à l'écran d'accueil
              </p>
              <Step n={1} icon={<Share2 className="size-4" />}>
                Touchez <strong>Partager</strong> en bas de Safari.
              </Step>
              <Step n={2} icon={<SquarePlus className="size-4" />}>
                Choisissez <strong>Ajouter à l'écran d'accueil</strong>.
              </Step>
              <Step n={3} icon={<Check className="size-4" />}>
                Confirmez — l'icône apparaît sur votre écran d'accueil.
              </Step>
            </div>
          ) : (
            <div>
              <p className="font-display text-lg font-semibold text-foreground">
                Installation non disponible ici
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ouvrez ce lien dans Chrome pour installer l'application, ou utilisez
                directement {INSTALL_URL.replace("https://", "")} dans votre navigateur.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleShare}
          className="surface-card flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <Share2 className="size-4" />
          {shared ? "Lien copié" : "Partager l'application"}
        </button>
      </div>
    </AppShell>
  );
}

function Step({ n, icon, children }: { n: number; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-muted/50 px-4 py-3">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
        {n}
      </span>
      <p className="flex-1 text-sm text-foreground">{children}</p>
      <span className="shrink-0 text-muted-foreground">{icon}</span>
    </div>
  );
}
