import { useEffect } from "react";

/** Masque la barre du bas globale : l'écran de lecture a sa propre barre (Accueil · lecture · Plus). */
export function useImmersive() {
  useEffect(() => {
    document.body.dataset.immersive = "1";
    return () => {
      delete document.body.dataset.immersive;
    };
  }, []);
}
