/**
 * Audio des adhkār constitués d'āyāt (Āyat al-Kursī, Al-Ikhlāṣ, Al-Falaq,
 * An-Nās, fin d'Al-Baqara…) — réutilise le moteur audio Coran existant
 * (verseAudioUrl/Basmala, src/lib/mushaf.ts), jamais un second moteur.
 * `Dhikr.verseKeys` associe le dhikr à ses verseKeys EXACTS (jamais un
 * index de tableau) — voir src/data/adhkar.ts. Sans ce champ, aucun audio
 * fiable n'existe pour ce dhikr : le bouton reste honnêtement indisponible
 * (géré par les composants appelants, pas ici).
 *
 * Voix : Cheikh Sa‘d al-Ghâmidî ("ghamdi" — déjà un récitateur intégré et
 * vétté du moteur Coran, everyayah.com) — voir mission "Adhkār Sa‘d
 * al-Ghâmidî" : aucune source officielle/licenciée d'un enregistrement
 * complet des Adhkār (hors Coran) n'a été trouvée, donc seuls les dhikr
 * réellement coraniques peuvent avoir cette voix ; les autres restent
 * "Audio indisponible", jamais un audio approximatif substitué.
 */
import { useEffect, useRef, useState } from "react";
import {
  BASMALA_BRIDGE_KEY,
  basmalaAudioUrl,
  verseAudioUrl,
  withBasmalaBridges,
} from "@/lib/mushaf";

const DHIKR_RECITER = "ghamdi";

function resolveUrl(key: string): string {
  return key === BASMALA_BRIDGE_KEY
    ? basmalaAudioUrl(DHIKR_RECITER)
    : verseAudioUrl(DHIKR_RECITER, key);
}

export function useDhikrVerseAudio(verseKeys: string[] | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const queueRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const retryRef = useRef(0);

  useEffect(() => {
    const el = new Audio();
    audioRef.current = el;
    const playIndex = (i: number) => {
      retryRef.current = 0;
      el.src = resolveUrl(queueRef.current[i]);
      el.play().catch(() => setPlaying(false));
    };
    const advance = () => {
      indexRef.current += 1;
      if (indexRef.current < queueRef.current.length) playIndex(indexRef.current);
      else setPlaying(false);
    };
    const onEnded = () => advance();
    // Une ayah en échec (réseau/CDN) ne doit jamais geler toute la
    // récitation du dhikr : une reprise courte, puis on passe à la
    // suivante — jamais de boucle infinie (même logique que le lecteur
    // Coran principal, voir quran.page.$page.tsx onAudioError).
    const onError = () => {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn("[dhikrAudio] erreur de lecture", {
          verseKey: queueRef.current[indexRef.current],
          src: el.currentSrc || el.src,
          errorCode: el.error?.code,
          retry: retryRef.current,
        });
      }
      if (retryRef.current < 1) {
        retryRef.current += 1;
        window.setTimeout(() => {
          el.load();
          el.play().catch(() => advance());
        }, 400);
        return;
      }
      advance();
    };
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);
    return () => {
      el.pause();
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
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
    retryRef.current = 0;
    el.src = resolveUrl(queueRef.current[0]);
    el.play().catch(() => setPlaying(false));
    setPlaying(true);
  };

  return { playing, toggle, available: !!verseKeys?.length };
}
