import { useCallback } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";

/**
 * Vrai « retour » : revient à l'écran précédent de l'historique ; si l'on
 * est arrivé par un lien direct (aucun écran avant), repli sur `fallback`.
 */
export function useSmartBack(fallback: "/" | "/adhkar-adab" | "/favoris" | "/duas-coran" = "/") {
  const router = useRouter();
  const navigate = useNavigate();
  return useCallback(() => {
    const canGoBack = typeof window !== "undefined" && window.history.length > 1;
    if (canGoBack) router.history.back();
    else void navigate({ to: fallback });
  }, [router, navigate, fallback]);
}
