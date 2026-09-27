/**
 * Audio des adhkār constitués d'āyāt (Āyat al-Kursī, Al-Ikhlāṣ, Al-Falaq,
 * An-Nās, fin d'Al-Baqara…) — réutilise le moteur audio Coran existant
 * (verseAudioUrl/Basmala, src/lib/mushaf.ts), jamais un second moteur.
 * `Dhikr.verseKeys` associe le dhikr à ses verseKeys EXACTS (jamais un
 * index de tableau) — voir src/data/adhkar.ts. Sans ce champ, aucun audio
 * fiable n'existe pour ce dhikr : le bouton reste honnêtement indisponible
 * (géré par les composants appelants, pas ici).
 */
import { useEffect, useRef, useState } from "react";
import {
  BASMALA_BRIDGE_KEY,
  basmalaAudioUrl,
  defaultReciter,
  verseAudioUrl,
  withBasmalaBridges,
} from "@/lib/mushaf";

function resolveUrl(key: string): string {
  return key === BASMALA_BRIDGE_KEY ? basmalaAudioUrl(defaultReciter) : verseAudioUrl(defaultReciter, key);
}

export function useDhikrVerseAudio(verseKeys: string[] | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const queueRef = useRef<string[]>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    const el = new Audio();
    audioRef.current = el;
    const onEnded = () => {
      indexRef.current += 1;
      if (indexRef.current < queueRef.current.length) {
        el.src = resolveUrl(queueRef.current[indexRef.current]);
        el.play().catch(() => setPlaying(false));
      } else {
        setPlaying(false);
      }
    };
    el.addEventListener("ended", onEnded);
    return () => {
      el.pause();
      el.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el || !verseKeys?.length) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      return;
    }
    queueRef.current = withBasmalaBridges(verseKeys);
    indexRef.current = 0;
    el.src = resolveUrl(queueRef.current[0]);
    el.play().catch(() => setPlaying(false));
    setPlaying(true);
  };

  return { playing, toggle, available: !!verseKeys?.length };
}
