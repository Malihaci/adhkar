import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Dictée vocale (Web Speech API) pour la recherche du Coran. La reconnaissance
 * est faite par le navigateur du téléphone (Chrome/Android, Safari/iOS) : on
 * ne reçoit que le texte. Indisponible sur certains navigateurs → `supported`
 * vaut false et le bouton micro n'est pas affiché.
 */
export type VoiceLang = "ar-SA" | "fr-FR";

type Rec = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getCtor(): (new () => Rec) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const ERRORS: Record<string, string> = {
  "not-allowed": "Micro refusé. Autorisez-le dans les réglages du navigateur.",
  "service-not-allowed": "Micro refusé. Autorisez-le dans les réglages du navigateur.",
  "no-speech": "Je n'ai rien entendu. Réessayez en parlant plus près.",
  "audio-capture": "Aucun micro détecté.",
  network: "La reconnaissance vocale demande une connexion internet.",
};

export function useVoiceInput(onText: (text: string, final: boolean) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const recRef = useRef<Rec | null>(null);
  const cb = useRef(onText);
  cb.current = onText;
  const supported = !!getCtor();

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      /* déjà arrêté */
    }
  }, []);

  const start = useCallback((lang: VoiceLang) => {
    const Ctor = getCtor();
    if (!Ctor) return;
    setError("");
    try {
      recRef.current?.abort();
    } catch {
      /* rien */
    }
    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      let text = "";
      let final = false;
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
        if (e.results[i].isFinal) final = true;
      }
      cb.current(text.trim(), final);
    };
    rec.onerror = (e: any) => setError(ERRORS[e.error] ?? "La dictée vocale a échoué. Réessayez.");
    rec.onend = () => setListening(false);
    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, []);

  useEffect(() => () => {
    try {
      recRef.current?.abort();
    } catch {
      /* rien */
    }
  }, []);

  return { supported, listening, error, start, stop };
}

/**
 * Transforme une phrase dictée en saisie reconnue par la recherche :
 * « page 42 », « صفحة ٤٢ », « sourate 2 verset 255 », « سورة البقرة آية 255 ».
 * Un simple mot (arabe ou français) reste inchangé.
 */
export function spokenToQuery(spoken: string): string {
  let s = spoken
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[.,،؟?!]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  // « page 42 » / « صفحة 42 »
  const pg = s.match(/^(?:page|الصفحة|صفحة|صفحه)\s*(\d{1,3})$/i);
  if (pg) return `page ${pg[1]}`;
  // « sourate 2 verset 255 » → 2:255
  const sv = s.match(/^(?:sourate|sura|surah|سورة|سوره)?\s*(\d{1,3})\s*(?:verset|ayah|aya|ayat|آية|اية|الآية)\s*(\d{1,3})$/i);
  if (sv) return `${sv[1]}:${sv[2]}`;
  // « sourate Al Baqara verset 255 » → « Al Baqara 255 »
  const nv = s.match(/^(?:sourate|sura|surah|سورة|سوره)?\s*(.+?)\s*(?:verset|ayah|aya|ayat|آية|اية|الآية)\s*(\d{1,3})$/i);
  if (nv) return `${nv[1].trim()} ${nv[2]}`;
  // « sourate Al Baqara » → nom seul
  s = s.replace(/^(?:sourate|sura|surah|سورة|سوره)\s+/i, "");
  return s;
}
