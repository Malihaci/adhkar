import type { ComponentProps, CSSProperties, ReactNode } from "react";
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
        <div className="mb-2 grid grid-cols-2 gap-2">
          <MomentCard
            to="/matin"
            listen="morning"
            onClose={onClose}
            label="Matin"
            arabic="أذكار الصباح"
            color={HUB_COLORS[0]}
            icon={<Sunrise />}
            pct={morningPct}
          />
          <MomentCard
            to="/soir"
            listen="evening"
            onClose={onClose}
            label="Soir"
            arabic="أذكار المساء"
            color={HUB_COLORS[7]}
            icon={<Moon />}
            pct={eveningPct}
          />
        </div>
        <HubGrid>
          <HubLink to="/compteur" onClose={onClose} label="Compteur" arabic="العداد" color={HUB_COLORS[3]} icon={<Hash />} />
          <HubLink to="/defis" onClose={onClose} label="Mes défis" arabic="التحديات" color={HUB_COLORS[4]} icon={<Swords />} />
          <HubLink to="/duas-coran" onClose={onClose} label="Duʿāʾ du Coran" arabic="أدعية القرآن" color={HUB_COLORS[2]} icon={<BookOpen />} />
          <HubLink to="/adhkar-adab" onClose={onClose} label="Adhkār et ādāb" arabic="الأذكار والآداب" color={HUB_COLORS[6]} icon={<BookOpen />} />
          <HubLink to="/reveil" onClose={onClose} label="Réveil" arabic="الاستيقاظ" color={HUB_COLORS[0]} icon={<Sunrise />} />
          <HubLink to="/coucher" onClose={onClose} label="Avant de dormir" arabic="أذكار النوم" color={HUB_COLORS[7]} icon={<Moon />} />
          <Link to="/adhkar-adab" search={{ g: "priere" }} onClick={onClose} className={hubCardClass}>
            <HubCardBody label="Prière" arabic="أذكار الصلاة" color={HUB_COLORS[5]} icon={<Sparkles />} />
          </Link>
          <Link to="/adhkar-adab" search={{ g: "ruqya" }} onClick={onClose} className={hubCardClass}>
            <HubCardBody label="Ruqya" arabic="الرقية الشرعية" color={HUB_COLORS[2]} icon={<Sparkles />} />
          </Link>
          <Link to="/adhkar-adab" search={{ g: "maison" }} onClick={onClose} className={hubCardClass}>
            <HubCardBody label="Maison" arabic="أذكار البيت" color={HUB_COLORS[3]} icon={<DoorOpen />} />
          </Link>
          <HubLink to="/voyage" onClose={onClose} label="Voyage" arabic="السفر" color={HUB_COLORS[1]} icon={<Luggage />} />
        </HubGrid>
      </div>
    </div>
  );
}

/** Matin / Soir : on choisit directement Lire (dhikr par dhikr) ou Écouter (récitation continue). */
function MomentCard({
  to,
  listen,
  onClose,
  label,
  arabic,
  color,
  icon,
  pct,
}: {
  to: "/matin" | "/soir";
  listen: "morning" | "evening";
  onClose: () => void;
  label: string;
  arabic: string;
  color: string;
  icon: ReactNode;
  pct: number;
}) {
  return (
    <div className="surface-card relative flex flex-col gap-2.5 rounded-2xl p-3" style={{ "--c": color } as CSSProperties}>
      <span className="absolute right-3 top-2.5 text-[10px] font-medium text-muted-foreground">{pct}%</span>
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-[11px] bg-[color-mix(in_srgb,var(--c)_16%,transparent)] text-[var(--c)] [&_svg]:size-[18px]">
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block font-display text-[0.95rem] font-bold leading-tight text-foreground">{label}</span>
          <span lang="ar" dir="rtl" className="block font-arabic text-[0.85rem] leading-tight text-[var(--c)]">
            {arabic}
          </span>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <Link
          to={to}
          onClick={onClose}
          className="flex h-10 items-center justify-center gap-1.5 rounded-full bg-primary text-[13px] font-semibold text-primary-foreground transition active:scale-95"
        >
          <BookOpen className="size-3.5" /> Lire
        </Link>
        <Link
          to="/ecoute"
          search={{ m: listen }}
          onClick={onClose}
          className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-border bg-background text-[13px] font-semibold text-foreground transition active:scale-95"
        >
          <Headphones className="size-3.5" /> Écouter
        </Link>
      </div>
    </div>
  );
}

type HubTo =
  | "/matin" | "/soir" | "/compteur" | "/defis" | "/duas-coran" | "/adhkar-adab"
  | "/reveil" | "/coucher" | "/voyage";

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
