/**
 * Bandeau d'accueil : la basmala seule, centrée, sur un simple dégradé doux
 * vert → or (aucun dessin). Clair en thème clair, vert profond voilé d'or en
 * thème sombre.
 */
export function HomeHero() {
  return (
    <div
      className="flex h-16 items-center justify-center overflow-hidden rounded-2xl border border-[#c9b87a]/30 bg-[linear-gradient(110deg,#dcece2,#f4ecd2)] dark:border-[#d9c27a]/15 dark:bg-[linear-gradient(110deg,#17352a,#2f2a16)]"
    >
      {/* Les voyelles arabes allongent la ligne : interligne généreux + léger
          décalage vers le bas pour centrer le texte, pas la boîte. */}
      <p
        lang="ar"
        dir="rtl"
        className="pt-2 font-arabic text-[1.65rem] leading-[1.7] text-[#2c4a38] dark:text-[#f1e6bd]"
      >
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </p>
    </div>
  );
}
