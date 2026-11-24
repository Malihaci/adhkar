import { useCallback, useEffect, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Compass, LocateFixed } from "lucide-react";
import { getPrayerSettings } from "@/lib/prayerTimes";
import { readJSON, writeJSON } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/qibla")({
  head: () => ({
    meta: [
      { title: "Qibla — direction de la Kaaba" },
      { name: "description", content: "La direction de la Qibla depuis votre position, avec boussole." },
    ],
  }),
  component: QiblaPage,
});

const KAABA = { lat: 21.4225, lon: 39.8262 };
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Cap initial (0–360°, depuis le nord) du grand cercle vers la Kaaba. */
export function qiblaBearing(lat: number, lon: number): number {
  const p1 = rad(lat);
  const p2 = rad(KAABA.lat);
  const dl = rad(KAABA.lon - lon);
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return (deg(Math.atan2(y, x)) + 360) % 360;
}

function distanceKm(lat: number, lon: number): number {
  const dp = rad(KAABA.lat - lat);
  const dl = rad(KAABA.lon - lon);
  const a = Math.sin(dp / 2) ** 2 + Math.cos(rad(lat)) * Math.cos(rad(KAABA.lat)) * Math.sin(dl / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const CARDINALS = ["nord", "nord-est", "est", "sud-est", "sud", "sud-ouest", "ouest", "nord-ouest"];
const cardinal = (b: number) => CARDINALS[Math.round(b / 45) % 8];

interface Pos {
  lat: number;
  lon: number;
  label?: string;
}

type OrientEvent = DeviceOrientationEvent & { webkitCompassHeading?: number };

/**
 * Cap du haut du téléphone (0–360°, depuis le nord), compensé de l'inclinaison
 * (formule de la spécification W3C) : fiable même si le téléphone n'est pas
 * parfaitement à plat.
 */
function headingFrom(alpha: number, beta: number, gamma: number): number {
  const a = rad(alpha);
  const b = rad(beta);
  const g = rad(gamma);
  const rA = -Math.cos(a) * Math.sin(g) - Math.sin(a) * Math.sin(b) * Math.cos(g);
  const rB = -Math.sin(a) * Math.sin(g) + Math.cos(a) * Math.sin(b) * Math.cos(g);
  const h = deg(Math.atan2(rA, rB));
  return (h + 360) % 360;
}

const ALIGN_ON = 3; // degrés : on s'aligne
const ALIGN_OFF = 6; // degrés : on n'est plus aligné (évite le clignotement)

function QiblaPage() {
  const [pos, setPos] = useState<Pos | null>(null);
  /** Angle continu du cadran (jamais ramené à 0–360, pour éviter les tours complets). */
  const [dial, setDial] = useState<number | null>(null);
  const [needPermission, setNeedPermission] = useState(false);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);
  const smooth = useRef<number | null>(null);

  useEffect(() => {
    const saved = readJSON<Pos | null>("qibla:pos", null);
    if (saved) {
      setPos(saved);
      return;
    }
    const s = getPrayerSettings();
    if (s.latitude != null && s.longitude != null) setPos({ lat: s.latitude, lon: s.longitude, label: s.city });
  }, []);

  const locate = () => {
    if (!navigator.geolocation) {
      setError("La localisation n'est pas disponible sur cet appareil.");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const next = { lat: p.coords.latitude, lon: p.coords.longitude };
        writeJSON("qibla:pos", next);
        setPos(next);
        setLocating(false);
      },
      () => {
        setError("Position refusée ou introuvable. Autorisez la localisation puis réessayez.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  };

  /** Lissage circulaire : réactif (≈ 0,35 par mesure) mais sans tremblement. */
  const feed = useCallback((raw: number) => {
    const cur = smooth.current;
    if (cur == null) smooth.current = raw;
    else {
      const delta = ((raw - (((cur % 360) + 360) % 360) + 540) % 360) - 180;
      smooth.current = cur + delta * 0.35;
    }
    setDial(smooth.current);
  }, []);

  const listen = useCallback(() => {
    const onOri = (e: Event) => {
      const o = e as OrientEvent;
      if (typeof o.webkitCompassHeading === "number") {
        feed(o.webkitCompassHeading); // iPhone : cap magnétique direct
        return;
      }
      if (o.alpha == null || o.beta == null || o.gamma == null) return;
      // Android : seules les mesures « absolues » sont rapportées au nord réel.
      if (e.type === "deviceorientation" && !o.absolute) return;
      feed(headingFrom(o.alpha, o.beta, o.gamma));
    };
    window.addEventListener("deviceorientationabsolute", onOri as EventListener, true);
    window.addEventListener("deviceorientation", onOri as EventListener, true);
    return () => {
      window.removeEventListener("deviceorientationabsolute", onOri as EventListener, true);
      window.removeEventListener("deviceorientation", onOri as EventListener, true);
    };
  }, [feed]);

  useEffect(() => {
    const D = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } })
      .DeviceOrientationEvent;
    if (D && typeof D.requestPermission === "function") {
      setNeedPermission(true); // iPhone : l'autorisation doit venir d'un appui
      return;
    }
    return listen();
  }, [listen]);

  const enableCompass = async () => {
    const D = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } })
      .DeviceOrientationEvent;
    try {
      const r = await D?.requestPermission?.();
      if (r === "granted") {
        setNeedPermission(false);
        listen();
      } else setError("Accès à la boussole refusé.");
    } catch {
      setError("Boussole indisponible sur cet appareil.");
    }
  };

  const bearing = pos ? qiblaBearing(pos.lat, pos.lon) : null;
  const heading = dial != null ? ((dial % 360) + 360) % 360 : null;
  const diff = bearing != null && heading != null ? ((bearing - heading + 540) % 360) - 180 : null;

  // Alignement avec hystérésis.
  const wasAligned = useRef(false);
  let aligned = false;
  if (diff != null) {
    aligned = Math.abs(diff) <= (wasAligned.current ? ALIGN_OFF : ALIGN_ON);
  }
  useEffect(() => {
    if (aligned && !wasAligned.current && "vibrate" in navigator) navigator.vibrate?.([40, 40, 40]);
    wasAligned.current = aligned;
  }, [aligned]);

  const rotation = dial != null ? -dial : 0;
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  const soft = aligned ? "text-emerald-50/85" : "text-muted-foreground";

  return (
    <div
      className={cn("min-h-[100dvh] transition-colors duration-500", aligned ? "text-white" : "bg-background text-foreground")}
      style={
        aligned
          ? { background: "radial-gradient(120% 80% at 50% 38%, #0f8a5f 0%, #065f46 55%, #022c22 100%)" }
          : undefined
      }
    >
      <div className="mx-auto max-w-2xl px-4 pb-32 pt-4">
        <header className="mb-2 flex items-center gap-3">
          <Link
            to="/"
            aria-label="Accueil"
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-full border",
              aligned ? "border-white/40" : "border-border",
            )}
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-semibold">Qibla</h1>
            <p lang="ar" dir="rtl" className={cn("font-arabic text-sm", soft)}>
              القبلة
            </p>
          </div>
        </header>

        {!pos ? (
          <section className="surface-card mt-4 px-5 py-8 text-center text-foreground">
            <Compass className="mx-auto size-8 text-primary" />
            <p className="mt-3 font-display text-lg font-semibold">Trouver la direction de la Qibla</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Votre position sert uniquement à calculer la direction, elle reste sur votre téléphone.
            </p>
            <button
              type="button"
              onClick={locate}
              disabled={locating}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground active:scale-[0.98] disabled:opacity-60"
            >
              <LocateFixed className="size-4" /> {locating ? "Recherche…" : "Utiliser ma position"}
            </button>
          </section>
        ) : (
          <>
            <p className={cn("text-center text-sm", soft)}>
              {pos.label ? `Actuellement situé à ${pos.label}` : "Votre position"} ·{" "}
              {Math.round(distanceKm(pos.lat, pos.lon)).toLocaleString("fr-FR")} km de la Kaaba
            </p>
            <p className="mt-3 text-center text-lg font-bold">
              {aligned
                ? "Vous faites face à la Qibla ✓"
                : diff != null
                  ? `Tournez-vous vers la ${diff > 0 ? "droite" : "gauche"}`
                  : "Boussole non activée"}
            </p>

            <div className="relative mx-auto mt-2 aspect-square w-full max-w-[24rem]">
              <svg viewBox="-135 -135 270 270" className="h-full w-full overflow-visible" role="img" aria-label="Boussole de la Qibla">
                <defs>
                  <filter id="qglow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                </defs>
                {/* Cadran : il tourne avec le téléphone (aucune transition : suivi immédiat). */}
                <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "0 0" }}>
                  <circle
                    r="108"
                    className={aligned ? "fill-none stroke-emerald-200/70" : "fill-none stroke-border"}
                    strokeWidth="9"
                  />
                  <circle r="104" className={aligned ? "fill-white" : "fill-card"} />
                  {ticks.map((t) => (
                    <line
                      key={t}
                      x1="0"
                      y1="-98"
                      x2="0"
                      y2={t % 90 === 0 ? -86 : t % 30 === 0 ? -90 : -94}
                      transform={`rotate(${t})`}
                      strokeWidth={t % 30 === 0 ? 2 : 1}
                      className={aligned ? "stroke-emerald-800/70" : "stroke-muted-foreground/60"}
                    />
                  ))}
                  {(
                    [
                      ["N", 0],
                      ["E", 90],
                      ["S", 180],
                      ["O", 270],
                    ] as [string, number][]
                  ).map(([l, a]) => (
                    <text
                      key={l}
                      x="0"
                      y="-66"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${a})`}
                      className={cn(
                        "text-[16px] font-extrabold",
                        l === "N" ? "fill-red-500" : aligned ? "fill-emerald-900" : "fill-foreground",
                      )}
                    >
                      {l}
                    </text>
                  ))}
                  {/* La Kaaba sur le bord, à la direction de la Qibla */}
                  <g transform={`rotate(${bearing ?? 0})`}>
                    {aligned && <circle cy="-112" r="24" fill="#fcd34d" opacity="0.8" filter="url(#qglow)" />}
                    <g transform="translate(0 -112)">
                      <rect x="-17" y="-17" width="34" height="34" rx="6" fill="#fff" />
                      <rect x="-13" y="-13" width="26" height="26" rx="3" fill="#111" />
                      <rect x="-13" y="-7" width="26" height="5" fill="#f5c542" />
                      <rect x="-3" y="-1" width="7" height="12" rx="1" fill="#f5c542" />
                    </g>
                  </g>
                </g>
                {/* Aiguille fixe : elle indique où pointe le haut du téléphone */}
                <g>
                  <polygon points="0,-46 -12,6 12,6" className={aligned ? "fill-emerald-700" : "fill-primary"} />
                  <polygon points="-12,12 12,12 0,50" className={aligned ? "fill-emerald-100" : "fill-muted"} />
                </g>
              </svg>
            </div>

            <div className="mt-1 text-center">
              <p className="font-display text-4xl font-bold">{Math.round(bearing ?? 0)}°</p>
              <p className={cn("text-sm", soft)}>vers le {cardinal(bearing ?? 0)}</p>
              {diff == null &&
                (needPermission ? (
                  <button
                    type="button"
                    onClick={enableCompass}
                    className="mt-3 h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
                  >
                    Activer la boussole
                  </button>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Pas de boussole détectée : orientez-vous à {Math.round(bearing ?? 0)}° par rapport au nord.
                  </p>
                ))}
            </div>

            <button
              type="button"
              onClick={locate}
              disabled={locating}
              className={cn(
                "mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full border text-sm font-semibold disabled:opacity-60",
                aligned ? "border-white/50" : "border-border",
              )}
            >
              <LocateFixed className="size-4" /> {locating ? "Recherche…" : "Actualiser ma position"}
            </button>
            <p className={cn("mt-3 text-center text-[11px] leading-relaxed", soft)}>
              Éloignez le téléphone des objets métalliques et aimants, et bougez-le en « 8 » pour étalonner la boussole.
            </p>
          </>
        )}
        {error && (
          <p role="alert" className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
