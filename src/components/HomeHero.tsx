import { useEffect, useState } from "react";
import { gregorianFr, hijriFr } from "@/lib/dateFr";

/**
 * En-tête d'accueil : le salām, puis la date du jour en français (grégorienne),
 * et la date hijri écrite en français. Les dates ne sont lues qu'après le
 * montage (même rendu serveur/client, pas de décalage d'hydratation).
 */
export function HomeHero() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  const hijri = now ? hijriFr(now) : "";
  return (
    <header className="px-1 pb-1 pt-2">
      <h1 className="font-display text-[1.6rem] font-bold leading-tight text-foreground">
        Assalāmu ʿalaykum
      </h1>
      <p className="mt-1 min-h-[1.25rem] text-sm font-semibold text-foreground/80">
        {now ? gregorianFr(now) : ""}
      </p>
      {hijri && <p className="text-[13.5px] font-semibold text-primary">{hijri}</p>}
    </header>
  );
}
