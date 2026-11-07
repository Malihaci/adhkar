import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { fetchBelowText, belowSourceInfo } from "@/lib/belowContent";
import type { BelowSource, ReadingSize } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const TEXT_SIZE: Record<ReadingSize, string> = {
  normal: "text-[0.9rem] leading-[1.8]",
  large: "text-[1rem] leading-[1.85]",
  xlarge: "text-[1.12rem] leading-[1.9]",
};
const AR_TEXT_SIZE: Record<ReadingSize, string> = {
  normal: "text-[1.05rem] leading-[2]",
  large: "text-[1.2rem] leading-[2.05]",
  xlarge: "text-[1.35rem] leading-[2.1]",
};

/** Texte d'une āyah pour la source choisie (mis en cache, partagé). */
export function BelowText({
  verseKey,
  source,
  size,
  enabled = true,
}: {
  verseKey: string;
  source: BelowSource;
  size: ReadingSize;
  enabled?: boolean;
}) {
  const info = belowSourceInfo(source);
  const [s, a] = verseKey.split(":").map(Number);
  const { data, isPending, isError } = useQuery({
    queryKey: ["below", source, s, a],
    queryFn: () => fetchBelowText(source, s, a),
    staleTime: Infinity,
    enabled: enabled && !!s && !!a && source !== "none",
  });
  if (!enabled || isPending) {
    return <p className="text-sm text-muted-foreground">{enabled ? "Chargement…" : " "}</p>;
  }
  if (isError || !data) {
    return <p className="text-sm text-muted-foreground">Texte indisponible pour cette āyah.</p>;
  }
  return (
    <p
      lang={info?.rtl ? "ar" : undefined}
      dir={info?.rtl ? "rtl" : "ltr"}
      className={cn(
        "select-text whitespace-pre-line text-foreground",
        info?.rtl ? cn("font-arabic", AR_TEXT_SIZE[size]) : TEXT_SIZE[size],
        source === "phonetic" && "italic",
      )}
    >
      {data}
    </p>
  );
}

/** Ne charge le contenu d'une āyah que lorsqu'elle approche de l'écran (un appel par āyah). */
export function LazyBelow({
  verseKey,
  source,
  size,
}: {
  verseKey: string;
  source: BelowSource;
  size: ReadingSize;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return (
    <div ref={ref} className="min-h-6">
      <BelowText verseKey={verseKey} source={source} size={size} enabled={seen} />
    </div>
  );
}

const HEIGHT_KEY = "nm-below-height";
const MIN_H = 96;

/**
 * Volet d'UNE āyah sous la page du Mushaf : aucun bouton d'action, le texte
 * est sélectionnable (pour copier, on le sélectionne). Poignée = hauteur
 * réglable ; la flèche replie le volet en une fine barre.
 */
export function BelowPanel({
  verseKeys,
  verseKey,
  source,
  size,
  onSelect,
  onHeight,
}: {
  /** Toutes les āyāt de la page (dans l'ordre). */
  verseKeys: string[];
  /** L'āyah suivie : touchée, récitée ou, à défaut, la première de la page. */
  verseKey: string;
  onSelect: (key: string) => void;
  source: Exclude<BelowSource, "none">;
  size: ReadingSize;
  /** Hauteur occupée par le volet (px), pour réserver la place sous la page. */
  onHeight: (px: number) => void;
}) {
  const info = belowSourceInfo(source);
  const [height, setHeight] = useState(180);
  const [collapsed, setCollapsed] = useState(false);
  const drag = useRef<{ y: number; h: number } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // L'āyah suivie vient se placer en haut de la liste.
  useEffect(() => {
    const box = listRef.current;
    if (!box || collapsed) return;
    const el = box.querySelector<HTMLElement>(`[data-k="${verseKey}"]`);
    if (el) box.scrollTo({ top: Math.max(0, el.offsetTop - box.offsetTop), behavior: "smooth" });
  }, [verseKey, collapsed, verseKeys.length]);

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(HEIGHT_KEY));
      if (saved >= MIN_H) setHeight(saved);
      else setHeight(Math.round(window.innerHeight * 0.24));
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const maxH = () => Math.round(window.innerHeight * 0.7);
  const shown = collapsed ? 40 : Math.min(Math.max(height, MIN_H), maxH());

  useEffect(() => {
    onHeight(shown);
    return () => onHeight(0);
  }, [shown, onHeight]);

  return (
    <section
      aria-label="Contenu de l'āyah"
      style={{ bottom: 0, height: `calc(${shown}px + env(safe-area-inset-bottom))`, paddingBottom: "env(safe-area-inset-bottom)" }}
      className="fixed inset-x-0 z-[25] flex flex-col rounded-t-2xl border-t border-border/50 bg-card/95 shadow-[0_-6px_20px_-12px_rgba(0,0,0,.35)] backdrop-blur-xl transition-[bottom] duration-300"
    >
      <div
        onPointerDown={(e) => {
          if (collapsed) return;
          drag.current = { y: e.clientY, h: shown };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const next = drag.current.h + (drag.current.y - e.clientY);
          setHeight(Math.min(Math.max(next, MIN_H), maxH()));
        }}
        onPointerUp={() => {
          if (!drag.current) return;
          drag.current = null;
          try {
            window.localStorage.setItem(HEIGHT_KEY, String(height));
          } catch {
            /* ignoré */
          }
        }}
        className="flex h-10 shrink-0 touch-none items-center gap-2 px-3"
      >
        <span className="mx-auto absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-border" aria-hidden />
        <span className="mt-1 min-w-0 flex-1 truncate text-xs font-semibold text-primary">
          {verseKey} · <span className="font-normal text-muted-foreground">{info?.label}</span>
        </span>
        <Link
          to="/etude/$surah/$ayah"
          params={{ surah: verseKey.split(":")[0], ayah: verseKey.split(":")[1] }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Tadabbur de cette āyah"
          className="mt-1 flex h-8 shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 text-xs font-semibold text-primary"
        >
          <Sparkles className="size-3.5" /> Tadabbur
        </Link>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Déplier" : "Replier"}
          className="mt-1 grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted"
        >
          {collapsed ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
      </div>
      {!collapsed && (
        <div ref={listRef} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain pb-3">
          <div className="mx-auto max-w-2xl">
            {verseKeys.map((k) => {
              const on = k === verseKey;
              return (
                <button
                  key={k}
                  type="button"
                  data-k={k}
                  onClick={() => onSelect(k)}
                  className={cn(
                    "block w-full border-b border-border/40 px-4 py-2.5 text-left transition-colors",
                    on ? "bg-primary/10" : "hover:bg-muted/40",
                  )}
                >
                  <span className="mb-0.5 block text-xs font-semibold text-primary">({k.split(":")[1]})</span>
                  <LazyBelow verseKey={k} source={source} size={size} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
