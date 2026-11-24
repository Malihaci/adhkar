import { useCallback, useEffect, useState } from "react";
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

function QiblaPage() {
  const [pos, setPos] = useState<Pos | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [needPermission, setNeedPermission] = useState(false);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);

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
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 },
    );
  };

  const listen = useCallback(() => {
    const onOri = (e: Event) => {
      const o = e as OrientEvent;
      if (typeof o.webkitCompassHeading === "number") setHeading(o.webkitCompassHeading);
      else if (o.absolute && o.alpha != null) setHeading((360 - o.alpha) % 360);
    };
    window.addEventListener("deviceorientationabsolute", onOri as EventListener, true);
    window.addEventListener("deviceorientation", onOri as EventListener, true);
    return () => {
      window.removeEventListener("deviceorientationabsolute", onOri as EventListener, true);
      window.removeEventListener("deviceorientation", onOri as EventListener, true);
    };
  }, []);

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
  const diff = bearing != null && heading != null ? ((bearing - heading + 540) % 360) - 180 : null;
  const aligned = diff != null && Math.abs(diff) <= 5;

  useEffect(() => {
    if (aligned && "vibrate" in navigator) navigator.vibrate?.(30);
  }, [aligned]);

  return (
    <div className="mx-auto min-h-[100dvh] max-w-2xl bg-background px-4 pb-32 pt-4">
      <header className="mb-4 flex items-center gap-3">
        <Link to="/" aria-label="Accueil" className="grid size-10 shrink-0 place-items-center rounded-full border border-border">
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-semibold">Qibla</h1>
          <p lang="ar" dir="rtl" className="font-arabic text-sm text-muted-foreground">
            القبلة
          </p>
        </div>
      </header>

      {!pos ? (
        <section className="surface-card px-5 py-8 text-center">
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
          <section className="surface-card px-5 py-6 text-center">
            <div className="relative mx-auto grid size-64 place-items-center">
              <div
                className={cn(
                  "absolute inset-0 rounded-full border-4 transition-colors",
                  aligned ? "border-primary" : "border-border",
                )}
              />
              <span className="absolute left-1/2 top-1 -translate-x-1/2 text-[11px] font-bold text-muted-foreground">N</span>
              {/* La flèche pointe vers la Qibla : sans boussole, elle indique le cap depuis le nord. */}
              <div
                className="absolute inset-4 transition-transform duration-200"
                style={{ transform: `rotate(${diff != null ? diff : (bearing ?? 0)}deg)` }}
              >
                <div className="mx-auto h-1/2 w-1 rounded-full bg-primary" />
                <div className="absolute left-1/2 top-0 size-0 -translate-x-1/2 border-x-[10px] border-b-[18px] border-x-transparent border-b-primary" />
              </div>
              <span className="relative text-3xl">🕋</span>
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-primary">{Math.round(bearing ?? 0)}°</p>
            <p className="text-sm text-muted-foreground">
              vers le {cardinal(bearing ?? 0)}
              {pos.label ? ` · depuis ${pos.label}` : ""}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">À environ {Math.round(distanceKm(pos.lat, pos.lon)).toLocaleString("fr-FR")} km de la Kaaba</p>
            {diff != null ? (
              <p className={cn("mt-3 text-sm font-semibold", aligned ? "text-primary" : "text-foreground")}>
                {aligned ? "Vous faites face à la Qibla" : "Tournez-vous jusqu'à ce que la flèche pointe vers le haut"}
              </p>
            ) : needPermission ? (
              <button
                type="button"
                onClick={enableCompass}
                className="mt-3 h-11 rounded-full border border-border px-5 text-sm font-semibold"
              >
                Activer la boussole
              </button>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                Pas de boussole détectée : posez le téléphone à plat et orientez-vous à {Math.round(bearing ?? 0)}° par rapport au nord.
              </p>
            )}
          </section>

          <button
            type="button"
            onClick={locate}
            disabled={locating}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold disabled:opacity-60"
          >
            <LocateFixed className="size-4" /> {locating ? "Recherche…" : "Actualiser ma position"}
          </button>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
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
  );
}
