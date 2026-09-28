/**
 * Catalogue Adhān — UNIQUEMENT des sons dont la provenance/licence est
 * claire et vérifiée. Jamais un fichier MAWAQIT (propriétaire) copié ;
 * MAWAQIT n'a servi que de référence UX (aperçu + choix par prière).
 *
 * "beep" est généré localement (Web Audio API, aucun fichier, aucun
 * droit tiers). "wikimedia-1" est vérifié en direct : Wikimedia Commons,
 * CC BY-SA 4.0, auteur Atcovi — voir la page du fichier pour l'attribution
 * complète. Aucun autre Adhān "complet" n'a été trouvé avec une licence
 * de réutilisation claire ; ne pas en ajouter tant que ce n'est pas vérifié.
 */
export type AdhanId = "none" | "beep" | "wikimedia-1" | "personal";

export interface AdhanOption {
  id: AdhanId;
  title: string;
  source: string;
  license: string;
  audioUrl?: string;
}

export const ADHAN_CATALOG: AdhanOption[] = [
  { id: "none", title: "Aucun", source: "", license: "" },
  {
    id: "beep",
    title: "Bip",
    source: "Généré localement (Web Audio API)",
    license: "Aucun tiers — aucun fichier",
  },
  {
    id: "wikimedia-1",
    title: "Adhān — Aaqib Azeez",
    source: "Wikimedia Commons (Atcovi)",
    license: "CC BY-SA 4.0",
    audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/The_Adhan_-_Muslim_Call_to_Prayer_-_Aaqib_Azeez.mp3",
  },
];

export function getAdhanOption(id: string | undefined): AdhanOption {
  return ADHAN_CATALOG.find((a) => a.id === id) ?? ADHAN_CATALOG[0];
}

/** Tonalité brève générée sans aucun asset — jamais de droit tiers en jeu. */
export function playBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
    osc.onended = () => ctx.close();
  } catch {
    /* Web Audio indisponible — silencieux, pas de crash */
  }
}
