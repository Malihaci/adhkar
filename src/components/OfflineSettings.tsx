import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Trash2, WifiOff } from "lucide-react";
import { fetchChapters, getReciter } from "@/lib/mushaf";
import { usePreferences } from "@/lib/preferences";
import {
  clearOfflineData,
  countCachedSurahVerses,
  downloadAdhkarAudio,
  downloadCorePack,
  downloadSurahAudio,
  getOfflineStatus,
  isAutoOfflineEnabled,
  offlineSupported,
  setAutoOfflineEnabled,
  type OfflineStatus,
  type PackProgress,
} from "@/lib/offline";

/** Réglages « Hors ligne » : télécharger l'app + le Coran (texte), l'audio des
 * Adhkār, l'audio d'une sourate (récitateur courant), ou tout effacer. */
export function OfflineSettings() {
  const { prefs } = usePreferences();
  const reciterId = prefs.quran.reciterId;
  const { data: chapters } = useQuery({ queryKey: ["chapters-fr"], queryFn: fetchChapters, staleTime: Infinity });
  const [status, setStatus] = useState<OfflineStatus | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState<PackProgress | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [surah, setSurah] = useState(18);
  const [surahCached, setSurahCached] = useState<number | null>(null);
  const stopRef = useRef(false);
  const [auto, setAuto] = useState(true);
  useEffect(() => setAuto(isAutoOfflineEnabled()), []);

  const refresh = useCallback(async () => {
    if (offlineSupported()) setStatus(await getOfflineStatus());
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const versesCount = chapters?.find((c) => c.id === surah)?.versesCount ?? 0;
  useEffect(() => {
    let cancelled = false;
    if (!versesCount) return;
    countCachedSurahVerses(reciterId, surah, versesCount).then((n) => {
      if (!cancelled) setSurahCached(n);
    });
    return () => {
      cancelled = true;
    };
  }, [surah, versesCount, reciterId, busy]);

  const run = async (name: string, job: () => Promise<{ failed: number }>) => {
    stopRef.current = false;
    setBusy(name);
    setMessage(null);
    setProgress(null);
    try {
      const { failed } = await job();
      setMessage(
        stopRef.current
          ? "Téléchargement interrompu — ce qui est déjà enregistré reste disponible."
          : failed
            ? `Terminé, ${failed} élément(s) n'ont pas pu être téléchargés (connexion ou serveur) — vous pouvez relancer.`
            : "Téléchargement terminé — disponible hors ligne.",
      );
    } catch {
      setMessage("Téléchargement impossible pour l'instant (connexion).");
    } finally {
      setBusy(null);
      setProgress(null);
      void refresh();
    }
  };

  if (!offlineSupported()) {
    return (
      <p className="text-sm text-muted-foreground">
        Le mode hors ligne n'est pas disponible dans ce navigateur.
      </p>
    );
  }

  const pct = progress && progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
  const btn =
    "flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition enabled:hover:border-primary/40 disabled:opacity-50";

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Une fois téléchargé, l'application, le Coran (texte, Mushaf, traduction) et l'audio choisi
        fonctionnent sans connexion. Vos favoris, progression et réglages restent sur cet appareil.
      </p>

      {status && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <WifiOff className="size-3.5" />
          {status.usageMb != null ? `${status.usageMb} Mo utilisés` : "Espace utilisé inconnu"}
          {status.quotaMb != null ? ` sur ${status.quotaMb} Mo` : ""} · {status.pagesCached}/604 pages du Mushaf ·{" "}
          {status.audioFiles} fichier(s) audio
        </p>
      )}

      <label className="flex min-h-11 items-center justify-between gap-3 text-sm font-medium text-foreground">
        Téléchargement automatique (connexion correcte)
        <input
          type="checkbox"
          className="size-6 accent-[var(--color-primary)]"
          checked={auto}
          onChange={(e) => {
            setAuto(e.target.checked);
            setAutoOfflineEnabled(e.target.checked);
          }}
        />
      </label>

      <button
        className={btn}
        disabled={!!busy}
        onClick={() => run("core", () => downloadCorePack(setProgress, () => stopRef.current))}
      >
        <Download className="size-4" /> Télécharger l'application et le Coran (≈ 130 Mo)
      </button>

      <button
        className={btn}
        disabled={!!busy}
        onClick={() => run("adhkar", () => downloadAdhkarAudio(setProgress, () => stopRef.current))}
      >
        <Download className="size-4" /> Audio des Adhkār matin et soir (≈ 50 Mo)
      </button>

      <div className="space-y-2 rounded-2xl border border-border p-3">
        <p className="text-sm font-medium text-foreground">Audio du Coran — {getReciter(reciterId).name}</p>
        <select
          value={surah}
          onChange={(e) => setSurah(Number(e.target.value))}
          aria-label="Sourate à télécharger"
          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
        >
          {(chapters ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.id}. {c.nameFrench} — {c.versesCount} versets
            </option>
          ))}
        </select>
        {surahCached != null && versesCount > 0 && (
          <p className="text-xs text-muted-foreground">
            {surahCached}/{versesCount} versets déjà disponibles hors ligne
          </p>
        )}
        <button
          className={btn}
          disabled={!!busy || !versesCount}
          onClick={() => run("surah", () => downloadSurahAudio(reciterId, surah, setProgress, () => stopRef.current))}
        >
          <Download className="size-4" /> Télécharger l'audio de cette sourate
        </button>
        <p className="text-[11px] text-muted-foreground">
          Environ 0,3 Mo par verset (la sourate Al-Baqara ≈ 100 Mo). Le récitateur se change dans
          « Audio ».
        </p>
      </div>

      {busy && progress && (
        <div className="space-y-1.5">
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {progress.label} — {progress.done}/{progress.total}
            </span>
            <button className="font-semibold text-foreground" onClick={() => (stopRef.current = true)}>
              Arrêter
            </button>
          </div>
        </div>
      )}
      {message && <p className="text-xs font-medium text-foreground">{message}</p>}

      <button
        className={btn}
        disabled={!!busy}
        onClick={async () => {
          if (window.confirm("Supprimer toutes les données hors ligne (téléchargements) ? Vos favoris et réglages sont conservés.")) {
            await clearOfflineData();
            setMessage("Données hors ligne supprimées.");
            void refresh();
          }
        }}
      >
        <Trash2 className="size-4" /> Supprimer les données hors ligne
      </button>
    </div>
  );
}
