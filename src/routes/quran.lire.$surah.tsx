import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  Pause,
  Play,
  Settings2,
  Share2,
  Sparkles,
} from "lucide-react";
import { RECITERS, fetchChapters, fetchVersePage, verseAudioUrl } from "@/lib/mushaf";
import { fetchHamidullahSura } from "@/lib/hamidullah";
import { useFavorites, writeJSON } from "@/lib/storage";
import { usePreferences, type ReadingSize } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quran/lire/$surah")({
  head: ({ params }) => ({
    meta: [{ title: `Lire — Sourate ${params.surah}` }],
  }),
  component: LirePage,
});

/** Ce réglage vient désormais du centre unique ⚙️ Paramètres > Coran
 * (chantier "Paramètres intelligents") — voir src/lib/preferences.ts.
 * Ce mode ayah-par-ayah gère déjà toutes les combinaisons A-F de la
 * mission (chaque couche est indépendante) : Arabe seul, Arabe+Français,
 * Arabe+Phonétique, les trois, Français seul, Phonétique seule. */
const ARABIC_SIZE: Record<ReadingSize, string> = {
  normal: "text-lg leading-[1.9]",
  large: "text-xl leading-[2]",
  xlarge: "text-2xl leading-[2.1]",
};
const TEXT_SIZE: Record<ReadingSize, string> = {
  normal: "text-[0.85rem]",
  large: "text-[0.95rem]",
  xlarge: "text-[1.05rem]",
};

function LirePage() {
  const { surah: surahParam } = Route.useParams();
  const navigate = useNavigate();
  const surah = Number(surahParam);
  const { prefs, updateQuran } = usePreferences();
  const layers = prefs.quran;
  const setLayer = (key: "arabic" | "francais" | "phonetique", value: boolean) =>
    updateQuran({ [key]: value });
  const [optionsOpen, setOptionsOpen] = useState(false);
  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [audioEl] = useState(() => (typeof Audio !== "undefined" ? new Audio() : null));

  const { data: chapters } = useQuery({
    queryKey: ["chapters-fr"],
    queryFn: fetchChapters,
    staleTime: Infinity,
  });
  const { data: verses, isPending } = useQuery({
    queryKey: ["hamidullah-sura", surah],
    queryFn: () => fetchHamidullahSura(surah),
    staleTime: Infinity,
  });

  const chapter = chapters?.find((c) => c.id === surah);

  // Mémorise la dernière sourate visitée ici — même convention que
  // `quran-last-page` côté Mushaf (écriture directe, pas d'abonnement
  // nécessaire) — utilisée par l'entrée directe "Coran" (§1/§2 mission
  // "Coran direct") pour rouvrir exactement ce mode/cette position.
  useEffect(() => {
    writeJSON("quran-last-surah", surah);
  }, [surah]);

  // Retour automatique au Mushaf (§15 mission) : dès que Français ET
  // Phonétique sont désactivés (arabe seul), ce mode ayah-par-ayah n'a plus
  // lieu d'être — on rouvre le Mushaf de Médine sur la page de cette
  // sourate, sans redemander confirmation. `fetchVersePage` préserve la
  // position (première āyah de la sourate en cours) au lieu de renvoyer à
  // la page 1.
  useEffect(() => {
    if (!prefs.quran.arabic || prefs.quran.francais || prefs.quran.phonetique) return;
    let cancelled = false;
    fetchVersePage(`${surah}:1`)
      .then((page) => {
        if (!cancelled) navigate({ to: "/quran/page/$page", params: { page: String(page) } });
      })
      .catch(() => {
        /* échec réseau ponctuel — l'utilisateur reste sur ce mode, aucune page inventée */
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs.quran.arabic, prefs.quran.francais, prefs.quran.phonetique]);

  const goSurah = (delta: number) => {
    const next = surah + delta;
    if (next < 1 || next > 114) return;
    navigate({ to: "/quran/lire/$surah", params: { surah: String(next) } });
  };

  const toggleAudio = (verseKey: string) => {
    if (!audioEl) return;
    if (playingKey === verseKey) {
      audioEl.pause();
      setPlayingKey(null);
      return;
    }
    audioEl.src = verseAudioUrl(prefs.quran.reciterId, verseKey);
    audioEl.playbackRate = prefs.quran.speed;
    audioEl.onended = () => setPlayingKey(null);
    audioEl.play().catch(() => setPlayingKey(null));
    setPlayingKey(verseKey);
  };

  const shareAyah = async (verseKey: string, arabic: string, translation: string) => {
    const [s, a] = verseKey.split(":");
    const url = new URL(`/etude/${s}/${a}`, window.location.origin);
    const label = chapter ? `${chapter.nameFrench} — ${verseKey}` : verseKey;
    const text = [arabic, translation, label, url.toString()].filter(Boolean).join("\n\n");
    try {
      if (navigator.share) await navigator.share({ text, url: url.toString() });
      else await navigator.clipboard.writeText(text);
    } catch {
      /* annulé */
    }
  };

  /** UNE seule action "Copier" (§20 mission) — plus de "Copier arabe" /
   * "Copier traduction" séparés : combine uniquement les couches réellement
   * affichées (jamais une couche désactivée ou indisponible), dans l'ordre
   * arabe → phonétique → français. La phonétique n'existe pas encore pour
   * une āyah générique (voir le message honnête ci-dessous) donc elle n'est
   * jamais ajoutée pour l'instant — code volontairement générique si une
   * source fiable est intégrée plus tard. */
  const copyAyah = async (arabic: string, translation: string) => {
    const parts = [arabic];
    if (layers.francais) parts.push(`Français :\n${translation}`);
    try {
      await navigator.clipboard.writeText(parts.join("\n\n"));
    } catch {
      /* annulé */
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="shrink-0 border-b border-border/40 bg-card/80 px-3 py-2.5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <Link
            to="/"
            aria-label="Accueil"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <button
            onClick={() => goSurah(-1)}
            disabled={surah <= 1}
            aria-label="Sourate précédente"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-foreground">
            {chapter ? `${chapter.nameFrench} · ${chapter.nameArabic}` : `Sourate ${surah}`}
          </p>
          <button
            onClick={() => goSurah(1)}
            disabled={surah >= 114}
            aria-label="Sourate suivante"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
          <button
            onClick={() => setOptionsOpen((v) => !v)}
            aria-label="Options d'affichage"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted"
          >
            <Settings2 className="size-[18px]" />
          </button>
        </div>
        {optionsOpen && (
          <div className="mx-auto mt-2 max-w-2xl px-1">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["arabic", "Arabe"],
                  ["francais", "Français"],
                  ["phonetique", "Phonétique"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setLayer(key, !layers[key])}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                    layers[key]
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <p className="mb-1 mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Taille de lecture
            </p>
            <div className="flex gap-1 rounded-full border border-border p-1">
              {(
                [
                  ["normal", "Normal"],
                  ["large", "Grand"],
                  ["xlarge", "Très grand"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => updateQuran({ textSize: key })}
                  aria-pressed={layers.textSize === key}
                  className={cn(
                    "flex-1 rounded-full py-1.5 text-xs font-semibold transition",
                    layers.textSize === key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <select
                value={layers.reciterId}
                onChange={(e) => updateQuran({ reciterId: e.target.value })}
                aria-label="Récitateur"
                className="h-10 rounded-full border border-border bg-background px-3 text-xs font-medium"
              >
                {RECITERS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-1 rounded-full border border-border p-1">
                {[1, 1.25].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateQuran({ speed: s })}
                    aria-pressed={layers.speed === s}
                    className={cn(
                      "flex-1 rounded-full text-xs font-semibold transition",
                      layers.speed === s ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>

            <Link
              to="/parametres"
              search={{ section: "coran" }}
              onClick={() => setOptionsOpen(false)}
              className="mt-3 inline-block text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              Tous les paramètres
            </Link>
          </div>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-3 px-4 py-4">
          {isPending ? (
            <p className="py-16 text-center text-sm text-muted-foreground">Chargement…</p>
          ) : !verses?.length ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Lecture indisponible pour le moment.
            </p>
          ) : (
            verses.map((v) => {
              const verseKey = `${surah}:${v.ayah}`;
              const fav = isFavorite("ayah", verseKey);
              const playing = playingKey === verseKey;
              return (
                <div key={verseKey} className="surface-card space-y-2.5 rounded-2xl px-4 py-4">
                  <p className="text-xs font-semibold text-muted-foreground">{verseKey}</p>
                  {layers.arabic && (
                    <p
                      lang="ar"
                      dir="rtl"
                      className={cn("font-arabic font-bold text-foreground", ARABIC_SIZE[layers.textSize])}
                    >
                      {v.arabic}
                    </p>
                  )}
                  {layers.francais && (
                    <p className={cn("leading-[1.85] text-foreground/90", TEXT_SIZE[layers.textSize])}>
                      {v.translation}
                    </p>
                  )}
                  {layers.phonetique && (
                    <p className="rounded-xl bg-muted/60 px-3 py-2 text-xs italic text-muted-foreground">
                      Phonétique indisponible — aucune source complète et fiable identifiée pour
                      l'instant.
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 border-t border-border/40 pt-2.5">
                    <button
                      onClick={() => toggleAudio(verseKey)}
                      className="flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium text-foreground"
                    >
                      {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                      Écouter
                    </button>
                    <button
                      onClick={() => toggleFavorite("ayah", verseKey)}
                      aria-pressed={fav}
                      className="flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium text-foreground"
                    >
                      <Heart className={cn("size-3.5", fav && "fill-gold text-gold")} />
                    </button>
                    <button
                      onClick={() => shareAyah(verseKey, v.arabic, v.translation)}
                      className="flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium text-foreground"
                    >
                      <Share2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => copyAyah(v.arabic, v.translation)}
                      aria-label="Copier"
                      className="flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-medium text-foreground"
                    >
                      <Copy className="size-3.5" />
                    </button>
                    <Link
                      to="/etude/$surah/$ayah"
                      params={{ surah: String(surah), ayah: String(v.ayah) }}
                      className="ml-auto flex h-8 items-center gap-1 rounded-full bg-primary/10 px-3 text-xs font-semibold text-primary"
                    >
                      <Sparkles className="size-3.5" /> Étudier
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
