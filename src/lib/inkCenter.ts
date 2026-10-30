import { useEffect, useState } from "react";

/**
 * Décalage vertical (en em, positif = vers le bas) qui centre l'ENCRE d'un
 * texte arabe dans sa boîte. Une ligne centrée en CSS centre la boîte de ligne,
 * pas les lettres : selon la police (ascendante/descendante, voyelles), le
 * texte paraît trop haut ou trop bas et touche le cadre. On mesure les vraies
 * bornes du dessin (canvas) une fois la police chargée ; applicable en
 * `translateY(${offset}em)` sur le texte, quelle que soit sa taille.
 */
export function useInkOffset(text: string, family: string, weight = 700): number {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (!text || typeof document === "undefined") return;
    let cancelled = false;
    const run = async () => {
      const font = `${weight} 100px ${family}`;
      try {
        await document.fonts?.load(font, text);
      } catch {
        /* mesure avec la police disponible */
      }
      if (cancelled) return;
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx) return;
      ctx.font = font;
      const m = ctx.measureText(text);
      const fontAscent = m.fontBoundingBoxAscent;
      const fontDescent = m.fontBoundingBoxDescent;
      if (!fontAscent && !fontDescent) return; // navigateur sans ces mesures : pas de correction
      // Ligne centrée : ligne de base à (fa − fd)/2 sous le centre ; encre centrée
      // à (haut − bas)/2 au-dessus de la ligne de base.
      const px = (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2 - (fontAscent - fontDescent) / 2;
      setOffset(Math.max(-0.35, Math.min(0.35, px / 100)));
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [text, family, weight]);
  return offset;
}
