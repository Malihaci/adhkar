import { useEffect, useState } from "react";
import { Download, Share, SquarePlus, X } from "lucide-react";
import { detectPlatform, isStandaloneDisplay, useInstallPrompt } from "@/lib/pwaInstall";
import { readJSON, writeJSON } from "@/lib/storage";

const KEY = "adhkar:install-banner";

/**
 * Invitation à installer l'application, sur l'accueil, tant qu'elle n'est pas
 * installée. Android/Chrome : bouton « Installer » (seulement si le navigateur
 * a vraiment proposé l'installation). iPhone : les deux gestes à faire (Safari
 * ne permet pas l'installation en un bouton). Masquable ; revient après 7 jours.
 */
export function InstallBanner() {
  const { canInstall, promptInstall } = useInstallPrompt();
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">("desktop");
  useEffect(() => {
    if (isStandaloneDisplay()) return;
    const until = readJSON<number>(KEY, 0);
    setPlatform(detectPlatform());
    setShow(Date.now() > until);
  }, []);

  const dismiss = () => {
    writeJSON(KEY, Date.now() + 7 * 86400000);
    setShow(false);
  };

  if (!show) return null;
  if (platform !== "ios" && !canInstall) return null;

  return (
    <section aria-label="Installer l'application" className="relative rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Masquer"
        className="absolute right-2 top-2 grid size-7 place-items-center rounded-full text-muted-foreground"
      >
        <X className="size-4" />
      </button>
      <p className="pr-7 text-sm font-semibold text-foreground">Installez NurMaLiHa sur votre téléphone</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Un seul geste : l'application s'ouvre comme les autres et fonctionne sans Internet.
      </p>
      {canInstall ? (
        <button
          type="button"
          onClick={async () => {
            if (await promptInstall()) setShow(false);
          }}
          className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground active:scale-95"
        >
          <Download className="size-4" /> Installer
        </button>
      ) : (
        <ol className="mt-2 space-y-1.5 text-xs text-foreground">
          <li className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-full bg-card">
              <Share className="size-3.5" />
            </span>
            Touchez « Partager » dans Safari
          </li>
          <li className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-full bg-card">
              <SquarePlus className="size-3.5" />
            </span>
            Puis « Sur l'écran d'accueil »
          </li>
        </ol>
      )}
    </section>
  );
}
