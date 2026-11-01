import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

/** État calme de l'accueil : affiché seulement quand aucune carte d'action
 * n'est présente (la section voisine contient un lien → ce bloc se masque).
 * Attend un court instant avant de s'afficher pour ne pas clignoter pendant
 * le chargement des données locales. */
export function HomeCalm() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 500);
    return () => window.clearTimeout(id);
  }, []);
  if (!ready) return null;
  return (
    <div className="group-has-[a]/todo:hidden surface-card flex flex-col items-center gap-1 rounded-2xl px-4 py-6 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-primary/12 text-primary">
        <Leaf className="size-5" />
      </span>
      <p className="mt-2 font-display text-xl font-bold text-primary">Tout est à jour</p>
      <p className="text-[13px] leading-snug text-muted-foreground">
        Adhkār et Lecture du jour : rien à faire pour l'instant. Qu'Allah accepte vos actes.
      </p>
    </div>
  );
}
