import { cn } from "@/lib/utils";

/**
 * Bandeau d'accueil compact : la basmala seule, sur un ciel clair avec soleil
 * le jour (Fajr → Maghrib) et sur un ciel de nuit avec lune ensuite. Statique
 * (aucune rotation) ; seules les étoiles scintillent doucement la nuit.
 */
export function HomeHero({ isDay }: { isDay: boolean }) {
  return (
    <div
      className={cn(
        "relative h-[64px] overflow-hidden rounded-2xl",
        isDay
          ? "bg-gradient-to-b from-[#6fbdf0] via-[#a9d9f6] to-[#e4f3fc]"
          : "bg-gradient-to-b from-[#0a0f2e] via-[#151d4b] to-[#27306b]",
      )}
    >
      <svg viewBox="0 0 360 64" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
        {isDay ? (
          <>
            <defs>
              <radialGradient id="hero-sun-glow">
                <stop offset="0" stopColor="#fffbe3" />
                <stop offset=".3" stopColor="#ffe680" stopOpacity=".95" />
                <stop offset="1" stopColor="#ffd34d" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="46" cy="28" r="44" fill="url(#hero-sun-glow)" />
            <circle cx="46" cy="28" r="13" fill="#ffd54a" />
            <circle cx="43" cy="25" r="6" fill="#fff4b8" opacity=".7" />
            <g fill="#fff" opacity=".92">
              <ellipse cx="298" cy="42" rx="30" ry="8" />
              <ellipse cx="280" cy="36" rx="15" ry="8" />
              <ellipse cx="316" cy="37" rx="13" ry="7" />
            </g>
            <g fill="#fff" opacity=".7">
              <ellipse cx="150" cy="54" rx="22" ry="5" />
              <ellipse cx="138" cy="50" rx="10" ry="5" />
            </g>
          </>
        ) : (
          <>
            <circle cx="46" cy="28" r="34" fill="#f6f1c8" opacity=".1" />
            <path
              transform="translate(30 10) scale(.8)"
              d="M32 8a16 16 0 1 0 8 26A13 13 0 0 1 32 8z"
              fill="#f6f1c8"
            />
            {[
              [300, 14, 0],
              [326, 34, 0.7],
              [270, 40, 1.4],
              [120, 12, 2.1],
              [205, 52, 0.4],
              [340, 12, 1.1],
            ].map(([x, y, d]) => (
              <circle
                key={`${x}-${y}`}
                cx={x}
                cy={y}
                r="1.6"
                fill="#fff"
                className="animate-pulse"
                style={{ animationDelay: `${d}s`, animationDuration: "3s" }}
              />
            ))}
          </>
        )}
      </svg>
      <p
        lang="ar"
        dir="rtl"
        className={cn(
          "absolute inset-0 flex items-center justify-center font-arabic text-[1.55rem] leading-none",
          isDay ? "text-[#0f3552]" : "text-[#eef0ff]",
        )}
      >
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </p>
    </div>
  );
}
