import type { ComponentProps } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, DoorOpen, Hash, Headphones, Swords, Luggage, Moon, Settings2, Sparkles, Sunrise, X } from "lucide-react";
import { HUB_COLORS, HubCardBody, HubGrid, hubCardClass } from "@/components/HubCard";

/**
 * Choix Adhkār — Quotidien (Matin/Soir) + Occasions. Composant partagé entre
 * l'accueil (porte "Adhkār") et la bottom nav (§3/§5 mission) : une seule
 * définition, réutilisée partout où ce choix doit apparaître.
 */
export function AdhkarSheet({
  morningPct,
  eveningPct,
  onClose,
}: {
  morningPct: number;
  eveningPct: number;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-3xl border-t border-border bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Quel Adhkār souhaitez-vous lire ?</h2>
          <div className="flex shrink-0 items-center gap-1">
            {/* ⚙️ contextuel (§2 mission "Paramètres centralisés") — ouvre
                directement Paramètres > Adhkār, jamais un second système. */}
            <Link
              to="/parametres"
              search={{ section: "adhkar" }}
              onClick={onClose}
              aria-label="Paramètres Adhkār"
              className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition hover:text-foreground"
            >
              <Settings2 className="size-4" />
            </Link>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="grid size-9 shrink-0 place-items-center rounded-full border border-border"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
        <HubGrid>
          <HubLink to="/matin" onClose={onClose} label="Matin" arabic="أذكار الصباح" color={HUB_COLORS[0]} icon={<Sunrise />} note={`${morningPct}%`} />
          <HubLink to="/soir" onClose={onClose} label="Soir" arabic="أذكار المساء" color={HUB_COLORS[7]} icon={<Moon />} note={`${eveningPct}%`} />
          <HubLink to="/ecoute" onClose={onClose} label="Tout écouter" arabic="استماع" color={HUB_COLORS[1]} icon={<Headphones />} />
          <HubLink to="/compteur" onClose={onClose} label="Compteur" arabic="العداد" color={HUB_COLORS[3]} icon={<Hash />} />
          <HubLink to="/defis" onClose={onClose} label="Mes défis" arabic="التحديات" color={HUB_COLORS[4]} icon={<Swords />} />
          <HubLink to="/duas-coran" onClose={onClose} label="Duʿāʾ du Coran" arabic="أدعية القرآن" color={HUB_COLORS[2]} icon={<BookOpen />} />
          <HubLink to="/adhkar-adab" onClose={onClose} label="Adhkār et ādāb" arabic="الأذكار والآداب" color={HUB_COLORS[6]} icon={<BookOpen />} />
          <HubLink to="/reveil" onClose={onClose} label="Réveil" arabic="الاستيقاظ" color={HUB_COLORS[0]} icon={<Sunrise />} />
          <HubLink to="/coucher" onClose={onClose} label="Avant de dormir" arabic="أذكار النوم" color={HUB_COLORS[7]} icon={<Moon />} />
          <HubLink to="/apres-priere" onClose={onClose} label="Après la prière" arabic="بعد الصلاة" color={HUB_COLORS[5]} icon={<Sparkles />} />
          <HubLink to="/sortie" onClose={onClose} label="Sortir de la maison" arabic="الخروج" color={HUB_COLORS[3]} icon={<DoorOpen />} />
          <HubLink to="/voyage" onClose={onClose} label="Voyage" arabic="السفر" color={HUB_COLORS[1]} icon={<Luggage />} />
        </HubGrid>
      </div>
    </div>
  );
}

type HubTo =
  | "/matin" | "/soir" | "/ecoute" | "/compteur" | "/defis" | "/duas-coran" | "/adhkar-adab"
  | "/reveil" | "/coucher" | "/apres-priere" | "/sortie" | "/voyage";

function HubLink({
  to,
  onClose,
  ...card
}: { to: HubTo; onClose: () => void } & ComponentProps<typeof HubCardBody>) {
  return (
    <Link to={to} onClick={onClose} className={hubCardClass}>
      <HubCardBody {...card} />
    </Link>
  );
}
