import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  Sunrise,
  Moon,
  Crosshair,
  SkipBack,
  SkipForward,
  Gauge,
  Loader2,
} from "lucide-react";
import { AyahText } from "@/components/AyahText";

import { morningAdhkar, eveningAdhkar, type Dhikr } from "@/data/adhkar";
import {
  AFASY_AUDIO,
  PLAYBACK_RATES,
  buildTimeMap,
  calibrateTimeMap,
} from "@/lib/afasyAudio";
import { readJSON, writeJSON } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ecoute")({
  head: () => ({
    meta: [
      { title: "Écoute — Récitation d'Al-‘Afâsy" },
      {
        name: "description",
        content:
          "Écoutez la récitation authentique des adhkâr du matin et du soir par Cheikh Mishary Rashid Al-‘Afâsy, avec vitesse de lecture réglable et texte synchronisé.",
      },
      { property: "og:title", content: "Écoute — Al-‘Afâsy" },
      {
        property: "og:description",
        content: "Récitation continue, vitesse réglable et texte synchronisé.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EcoutePage,
});

type Mode = "morning" | "evening";

const calibKey = (mode: Mode) => `adhkar.audio.calib.${mode}`;

function EcoutePage() {
  const [mode, setMode] = useState<Mode>("morning");
  const list: Dhikr[] = mode === "morning" ? morningAdhkar : eveningAdhkar;
  const audio = AFASY_AUDIO[mode];

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [rate, setRate] = useState(1);
  const [rateOpen, setRateOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userNavRef = useRef(false);

  const baseMap = useMemo(
    () => buildTimeMap(list, audio.duration, audio.startOffset),
    [list, audio.duration, audio.startOffset],
  );

  // Décalage manuel mémorisé par mode
  useEffect(() => {
    setShift(readJSON<number>(calibKey(mode), 0));
  }, [mode]);

  const timeMap = useMemo(
    () =>
      baseMap.map((t, i) =>
        Math.min(
          audio.duration - 1,
          Math.max(i === 0 ? audio.startOffset : 0, t + shift),
        ),
      ),
    [baseMap, shift, audio.duration, audio.startOffset],
  );
  const timeMapRef = useRef(timeMap);
  timeMapRef.current = timeMap;

  // (Re)create the audio element when mode changes
  useEffect(() => {
    const el = new Audio();
    el.src = audio.src;
    el.preload = "metadata";
    el.crossOrigin = "anonymous";
    audioRef.current = el;
    setIdx(0);
    setCurrentTime(audio.startOffset);
    setPlaying(false);
    setLoading(true);

    const startAt = audio.startOffset;
    const onLoaded = () => {
      setLoading(false);
      try {
        if (el.currentTime < startAt) el.currentTime = startAt;
      } catch {
        /* ignore */
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);
    const onTime = () => {
      const t = el.currentTime;
      setCurrentTime(t);
      if (userNavRef.current) return;
      const map = timeMapRef.current;
      let i = 0;
      for (let k = 0; k < map.length; k++) {
        if (map[k] <= t) i = k;
        else break;
      }
      setIdx((prev) => (prev !== i ? i : prev));
    };
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("waiting", onWaiting);
    el.addEventListener("playing", onPlaying);
    el.addEventListener("timeupdate", onTime);
    return () => {
      el.pause();
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("waiting", onWaiting);
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("timeupdate", onTime);
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Vitesse de lecture
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, [rate, mode]);

  const seekSeconds = useCallback(
    (t: number) => {
      const el = audioRef.current;
      if (!el) return;
      const clamped = Math.min(
        audio.duration - 1,
        Math.max(audio.startOffset, t),
      );
      try {
        el.currentTime = clamped;
      } catch {
        /* ignore */
      }
      setCurrentTime(clamped);
    },
    [audio.duration, audio.startOffset],
  );

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      if (el.paused) {
        if (el.currentTime < audio.startOffset) el.currentTime = audio.startOffset;
        el.playbackRate = rate;
        await el.play();
      } else el.pause();
    } catch {
      /* ignore */
    }
  };

  const seekTo = (i: number) => {
    const n = Math.min(list.length - 1, Math.max(0, i));
    setIdx(n);
    if (timeMap[n] !== undefined) {
      userNavRef.current = true;
      seekSeconds(timeMap[n]);
      window.setTimeout(() => {
        userNavRef.current = false;
      }, 600);
    }
  };

  // Recalage : « ce dhikr commence maintenant »
  const syncHere = () => {
    const next = calibrateTimeMap(
      baseMap,
      idx,
      currentTime,
      audio.duration,
      audio.startOffset,
    );
    const delta = (next[idx] ?? 0) - (baseMap[idx] ?? 0);
    setShift(delta);
    writeJSON(calibKey(mode), delta);
  };

  const onScrub = (e: React.ChangeEvent<HTMLInputElement>) =>
    seekSeconds(Number(e.target.value));

  const dhikr = list[idx];
  const accent = mode === "morning" ? "gold" : "primary";
  const accentBg = accent === "gold" ? "bg-gold" : "bg-primary";
  const accentText = accent === "gold" ? "text-gold" : "text-primary";

  const fmt = (s: number) => {
    const m = Math.floor(Math.max(0, s) / 60);
    const r = Math.floor(Math.max(0, s) % 60);
    return `${m}:${r.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background p-2 sm:p-3">
      {/* Top bar */}
      <div className="mb-2 flex items-center gap-2">
        <Link
          to="/"
          aria-label="Retour à l'accueil"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-card/80 text-foreground transition hover:border-primary/40 hover:text-primary"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="surface-card flex flex-1 items-center gap-1 p-1">
          <button
            onClick={() => setMode("morning")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition",
              mode === "morning"
                ? "bg-gold text-gold-foreground shadow-[var(--shadow-soft)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Sunrise className="size-4" /> Matin
          </button>
          <button
            onClick={() => setMode("evening")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition",
              mode === "evening"
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Moon className="size-4" /> Soir
          </button>
        </div>
      </div>

      {/* Now-reciting card */}
      <article className="surface-card relative flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              En cours · Cheikh Al-‘Afâsy
            </p>
            <h3 className="truncate font-display text-base font-semibold text-foreground">
              {dhikr.title}
            </h3>
          </div>
          <span
            className={cn(
              "shrink-0 font-display text-lg font-bold tabular-nums",
              accentText,
            )}
          >
            {idx + 1}
            <span className="text-xs font-semibold text-muted-foreground">
              /{list.length}
            </span>
          </span>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">
          <AyahText
            text={dhikr.arabic}
            className="text-[1.6rem] leading-[2] sm:text-[2.1rem] sm:leading-[2]"
          />

          <p className="border-t border-border pt-3 text-[14px] italic leading-relaxed text-foreground">
            {dhikr.phonetic}
          </p>
          <p className="border-t border-border pt-3 text-[14px] leading-relaxed text-foreground">
            {dhikr.translation}
          </p>
        </div>

        {/* Player */}
        <div className="border-t border-border bg-secondary/50 px-3 py-2">
          {/* Scrub bar */}
          <div className="mb-2 flex items-center gap-2 text-[11px] tabular-nums text-muted-foreground">
            <span>{fmt(currentTime - audio.startOffset)}</span>
            <input
              type="range"
              min={audio.startOffset}
              max={Math.floor(audio.duration)}
              step={1}
              value={Math.min(audio.duration, Math.max(audio.startOffset, currentTime))}
              onChange={onScrub}
              aria-label="Position de lecture"
              className={cn(
                "h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-border outline-none",
                "[&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow",
                accent === "gold"
                  ? "accent-gold [&::-webkit-slider-thumb]:bg-gold"
                  : "accent-primary [&::-webkit-slider-thumb]:bg-primary",
              )}
            />
            <span>{fmt(audio.duration - audio.startOffset)}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Vitesse */}
            <div className="relative">
              <button
                onClick={() => setRateOpen((v) => !v)}
                aria-label="Vitesse de lecture"
                aria-expanded={rateOpen}
                className="flex h-11 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-foreground transition hover:border-primary/40"
              >
                <Gauge className="size-4" />
                {rate}×
              </button>
              {rateOpen && (
                <div className="absolute bottom-13 left-0 z-20 mb-2 w-24 overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-elevated)]">
                  {PLAYBACK_RATES.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRate(r);
                        setRateOpen(false);
                      }}
                      className={cn(
                        "block w-full px-3 py-2 text-left text-xs font-semibold transition hover:bg-muted",
                        r === rate ? accentText : "text-foreground",
                      )}
                    >
                      {r}×
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => seekTo(idx - 1)}
                disabled={idx === 0}
                aria-label="Dhikr précédent"
                className="grid size-11 place-items-center rounded-full border border-border text-foreground transition disabled:opacity-30 hover:border-primary/40"
              >
                <SkipBack className="size-5" />
              </button>
              <button
                onClick={toggle}
                aria-label={playing ? "Pause" : "Lecture"}
                className={cn(
                  "grid size-14 place-items-center rounded-full text-primary-foreground shadow-[var(--shadow-elevated)] transition active:scale-95",
                  accentBg,
                )}
              >
                {loading && playing ? (
                  <Loader2 className="size-6 animate-spin" />
                ) : playing ? (
                  <Pause className="size-6" />
                ) : (
                  <Play className="size-6 translate-x-0.5" />
                )}
              </button>
              <button
                onClick={() => seekTo(idx + 1)}
                disabled={idx === list.length - 1}
                aria-label="Dhikr suivant"
                className="grid size-11 place-items-center rounded-full border border-border text-foreground transition disabled:opacity-30 hover:border-primary/40"
              >
                <SkipForward className="size-5" />
              </button>
            </div>

            <button
              onClick={syncHere}
              aria-label="Le dhikr affiché commence maintenant"
              title="Recaler : ce dhikr commence maintenant"
              className="grid size-11 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            >
              <Crosshair className="size-4" />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
