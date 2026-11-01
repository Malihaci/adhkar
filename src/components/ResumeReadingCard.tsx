import { BookOpen } from "lucide-react";
import { useLocalState } from "@/lib/storage";
import { getWirdResumeTarget, type WirdState } from "@/lib/khatma";
import { ACTION_COLORS, ActionCard } from "@/components/ActionCard";

const RECENT_MS = 36 * 3_600_000;

/** « Reprendre ma lecture » : seulement si le Coran a été lu récemment et
 * que la Lecture du jour ne propose pas déjà la même chose. */
export function ResumeReadingCard() {
  const [lastPage] = useLocalState<number>("quran-last-page", 1);
  const [lastAt] = useLocalState<number>("quran-last-read-at", 0);
  const [wird] = useLocalState<WirdState | null>("adhkar:wird", null);
  if (!lastAt || Date.now() - lastAt > RECENT_MS || lastPage <= 1) return null;
  if (getWirdResumeTarget(wird, lastPage)) return null;
  return (
    <ActionCard
      to="/quran/page/$page"
      params={{ page: String(lastPage) }}
      color={ACTION_COLORS.coran}
      icon={<BookOpen />}
      title="Reprendre ma lecture"
      sub={`Page ${lastPage} du Mushaf`}
      cta="Reprendre"
    />
  );
}
