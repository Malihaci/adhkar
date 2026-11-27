import { useEffect } from "react";

/**
 * Partage de « ce qu'on est en train de lire » depuis le menu Plus.
 * Une page peut déclarer son contenu (texte + lien) ; sinon Plus partage le titre
 * et le lien de la page ouverte.
 */
export interface PageShare {
  title?: string;
  text?: string;
  url?: string;
}

let current: PageShare | null = null;

export function usePageShare(share: PageShare | null) {
  const key = share ? JSON.stringify(share) : "";
  useEffect(() => {
    current = share;
    return () => {
      if (current === share) current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

export async function sharePage(): Promise<void> {
  const base: PageShare = current ?? {};
  const url = base.url ?? window.location.href;
  const title = base.title ?? document.title;
  const text = base.text ?? title;
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url: base.text ? undefined : url });
      return;
    }
    await navigator.clipboard.writeText(base.text ? `${text}\n\n${url}` : url);
  } catch {
    /* annulé */
  }
}
