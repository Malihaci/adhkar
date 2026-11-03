import { cn } from "@/lib/utils";

/** Kaaba (sourate mecquoise) : cube noir, bande dorée en haut. */
export function KaabaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-4", className)}>
      <path d="M3.5 8.5 12 5l8.5 3.5v10L12 21l-8.5-2.5z" fill="currentColor" />
      <path d="M3.5 8.5 12 12l8.5-3.5" fill="none" stroke="var(--card, #fff)" strokeWidth="1" strokeLinejoin="round" />
      <path d="M12 12v9" stroke="var(--card, #fff)" strokeWidth="1" />
      <path d="M3.5 11.2 12 14.7l8.5-3.5" fill="none" stroke="#d4ad62" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/** Mosquée du Prophète (sourate médinoise) : dôme central et deux minarets. */
export function MadinaMosqueIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-4", className)} fill="currentColor">
      <path d="M12 4.2c.4 0 .7.3.7.7s-.3.7-.7.7-.7-.3-.7-.7.3-.7.7-.7Z" />
      <path d="M12 6.4c-3 0-5.2 2.3-5.2 5.1V13h10.4v-1.5c0-2.8-2.2-5.1-5.2-5.1Z" />
      <path d="M3.2 6.5 4 5l.8 1.5V20H3.2Z" />
      <path d="M19.2 6.5 20 5l.8 1.5V20h-1.6Z" />
      <path d="M5.8 13.8h12.4V20H5.8Z" />
      <path d="M10.6 20v-3a1.4 1.4 0 0 1 2.8 0v3Z" fill="var(--card, #fff)" />
    </svg>
  );
}
