import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  DoorOpen,
  Hash,
  Headphones,
  HeartPulse,
  Luggage,
  Moon,
  Repeat2,
  Search,
  Settings2,
  ShieldPlus,
  Sparkles,
  Star,
  Sunrise,
  Swords,
  UtensilsCrossed,
  Users,
  X,
} from "lucide-react";
import { HUB_COLORS, HubCardBody, hubCardClass } from "@/components/HubCard";
import { useLocalState } from "@/lib/storage";
import { searchAdhkar } from "@/lib/adhkarIndex";

/**
 * Menu Adhkār : recherche (FR/AR), Matin/Soir en deux lignes fines, Favoris
 * (tuiles entières que l'on épingle), puis les tuiles classées. Un tap sur une
 * tuile ouvre directement la lecture des adhkār, sans liste intermédiaire.
 */

type TileTo = "/reveil" | "/adhkar-adab" | "/duas-coran" | "/compteur" | "/defis";
interface Tile {
  id: string;
  label: string;
  arabic: string;
  color: string;
  icon: ReactNode;
  to: TileTo;
  g?: string;
}

const OCCASIONS: Tile[] = [
  { id: "reveil", label: "Réveil", arabic: "الاستيقاظ", color: HUB_COLORS[0], icon: <Sunrise />, to: "/reveil" },
  { id: "dormir", label: "Avant de dormir", arabic: "النوم", color: HUB_COLORS[7], icon: <Moon />, to: "/adhkar-adab", g: "dormir" },
  { id: "priere", label: "Prière", arabic: "الصلاة", color: HUB_COLORS[5], icon: <Sparkles />, to: "/adhkar-adab", g: "priere" },
  { id: "maison", label: "Maison", arabic: "البيت", color: HUB_COLORS[3], icon: <DoorOpen />, to: "/adhkar-adab", g: "maison" },
  { id: "voyage", label: "Voyage", arabic: "السفر", color: HUB_COLORS[1], icon: <Luggage />, to: "/adhkar-adab", g: "voyage" },
  { id: "repas", label: "Repas", arabic: "الطعام", color: HUB_COLORS[6], icon: <UtensilsCrossed />, to: "/adhkar-adab", g: "repas" },
  { id: "sante", label: "Santé, épreuves", arabic: "المرض", color: HUB_COLORS[4], icon: <HeartPulse />, to: "/adhkar-adab", g: "sante" },
  { id: "social", label: "Vie sociale", arabic: "المعاشرة", color: HUB_COLORS[2], icon: <Users />, to: "/adhkar-adab", g: "social" },
];
const INVOCATIONS: Tile[] = [
  { id: "coran", label: "Duʿāʾ du Coran", arabic: "أدعية القرآن", color: HUB_COLORS[2], icon: <BookOpen />, to: "/duas-coran" },
  { id: "ruqya", label: "Ruqya", arabic: "الرقية الشرعية", color: HUB_COLORS[1], icon: <ShieldPlus />, to: "/adhkar-adab", g: "ruqya" },
  { id: "tasbih", label: "Tasbīḥ, istighfār", arabic: "التسبيح", color: HUB_COLORS[0], icon: <Repeat2 />, to: "/adhkar-adab", g: "tasbih" },
];
const OUTILS: Tile[] = [
  { id: "compteur", label: "Compteur", arabic: "العداد", color: HUB_COLORS[3], icon: <Hash />, to: "/compteur" },
  { id: "defis", label: "Mes défis", arabic: "التحديات", color: HUB_COLORS[4], icon: <Swords />, to: "/defis" },
];
const ALL_TILES = [...OCCASIONS, ...INVOCATIONS, ...OUTILS];

export function AdhkarSheet({
  morningPct,
  eveningPct,
  onClose,
}: {
  morningPct: number;
  eveningPct: number;
  onClose: () => void;
}) {
  const [favs, setFavs] = useLocalState<string[]>("adhkar:fav-tiles", []);
  const [query, setQuery] = useState("");
  const found = useMemo(() => (query.trim() ? searchAdhkar(query, 30) : []), [query]);
  const favTiles = favs.map((id) => ALL_TILES.find((t) => t.id === id)).filter((t): t is Tile => !!t);

  const toggle = (id: string) => setFavs(favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id]);
  const renderTile = (t: Tile) => (
    <TileCard key={t.id} tile={t} fav={favs.includes(t.id)} onToggle={() => toggle(t.id)} onClose={onClose} />
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-3xl border-t border-border bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Adhkār</h2>
          <div className="flex shrink-0 items-center gap-1">
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

        <label className="relative mb-3 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher en français ou en arabe"
            className="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </label>

        {query.trim() ? (
          <ul className="space-y-2">
            {found.map((x) => (
              <li key={x.id}>
                <Link
                  to="/adhkar-adab"
                  search={{ d: x.id }}
                  onClick={onClose}
                  className="surface-card block rounded-2xl px-4 py-3 transition hover:border-primary/40"
                >
                  <span className="block text-sm font-medium text-foreground">{x.title}</span>
                  <span lang="ar" dir="rtl" className="mt-1 line-clamp-2 block font-arabic text-lg leading-[1.9] text-primary">
                    {x.arabic}
                  </span>
                  <span className="line-clamp-2 text-xs text-muted-foreground">{x.translation}</span>
                </Link>
              </li>
            ))}
            {found.length === 0 && (
              <li className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                Aucun résultat.
              </li>
            )}
          </ul>
        ) : (
          <>
            <div className="mb-4 space-y-1.5">
              <MomentRow
                to="/matin"
                listen="morning"
                onClose={onClose}
                label="Matin"
                arabic="أذكار الصباح"
                color={HUB_COLORS[0]}
                icon={<Sunrise />}
                pct={morningPct}
              />
              <MomentRow
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

            {favTiles.length > 0 && (
              <Section title="Favoris">
                <Grid>{favTiles.map(renderTile)}</Grid>
              </Section>
            )}
            <Section title="Occasions">
              <Grid>{OCCASIONS.map(renderTile)}</Grid>
            </Section>
            <Section title="Invocations">
              <Grid>{INVOCATIONS.map(renderTile)}</Grid>
            </Section>
            <Section title="Outils">
              <Grid>{OUTILS.map(renderTile)}</Grid>
            </Section>
            <p className="mt-1 text-center text-[11px] text-muted-foreground">
              Touchez l’étoile d’une tuile pour l’ajouter à vos favoris.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-4">
      <h3 className="mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-3 gap-2">{children}</div>;
}

/** Tuile : un tap ouvre directement la lecture ; l'étoile (à part) l'épingle en favori. */
function TileCard({
  tile,
  fav,
  onToggle,
  onClose,
}: {
  tile: Tile;
  fav: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const body = <HubCardBody label={tile.label} arabic={tile.arabic} color={tile.color} icon={tile.icon} />;
  return (
    <div className="relative">
      {tile.g ? (
        <Link to="/adhkar-adab" search={{ g: tile.g }} onClick={onClose} className={`${hubCardClass} h-full`}>
          {body}
        </Link>
      ) : (
        <Link to={tile.to as "/reveil"} onClick={onClose} className={`${hubCardClass} h-full`}>
          {body}
        </Link>
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-label={fav ? `Retirer ${tile.label} des favoris` : `Ajouter ${tile.label} aux favoris`}
        aria-pressed={fav}
        className="absolute right-0.5 top-0.5 grid size-7 place-items-center rounded-full"
      >
        <Star className={fav ? "size-3.5 fill-gold text-gold" : "size-3.5 text-muted-foreground/60"} />
      </button>
    </div>
  );
}

/** Matin / Soir : une ligne fine, livre (lire) et casque (écouter) en icônes, avancement en filet. */
function MomentRow({
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
    <div className="surface-card overflow-hidden rounded-2xl" style={{ ["--c" as string]: color }}>
      <div className="flex items-center gap-2.5 px-3 py-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-[color-mix(in_srgb,var(--c)_16%,transparent)] text-[var(--c)] [&_svg]:size-[17px]">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[0.92rem] font-bold leading-tight text-foreground">
            {label} <span className="text-[11px] font-medium text-muted-foreground">{pct}%</span>
          </span>
          <span lang="ar" dir="rtl" className="block text-left font-arabic text-[0.8rem] leading-tight text-[var(--c)]">
            {arabic}
          </span>
        </span>
        <Link
          to={to}
          onClick={onClose}
          aria-label={`Lire les adhkār du ${label.toLowerCase()}`}
          className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground transition active:scale-95"
        >
          <BookOpen className="size-4" />
        </Link>
        <Link
          to="/ecoute"
          search={{ m: listen }}
          onClick={onClose}
          aria-label={`Écouter les adhkār du ${label.toLowerCase()}`}
          className="grid size-9 place-items-center rounded-full border border-border bg-background text-foreground transition active:scale-95"
        >
          <Headphones className="size-4" />
        </Link>
      </div>
      <div className="h-[3px] bg-muted">
        <div className="h-full bg-[var(--c)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
