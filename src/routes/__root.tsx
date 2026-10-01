import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { useReminderEngine } from "@/lib/reminders";
import { useSmartReminderEngine } from "@/lib/smartReminders";
import { usePreferences } from "@/lib/preferences";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Cette page ne s'est pas chargée
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Une erreur est survenue. Vous pouvez réessayer ou revenir à l'accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0f2a23" },
      // Installation en PWA (Android/Chrome + iOS Safari) : app en mode
      // standalone une fois ajoutée à l'écran d'accueil (chantier "Plein
      // écran paysage + Installation" — icônes 192/512/maskable générées à
      // partir du favicon existant, aucune nouvelle identité graphique).
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Adhkâr" },
      { title: "Adhkâr du Matin et du Soir" },
      {
        name: "description",
        content:
          "Récitez chaque jour les adhkâr authentiques du matin et du soir : texte arabe vocalisé, phonétique, traduction française, explication et mérites avec références.",
      },
      { property: "og:title", content: "Adhkâr du Matin et du Soir" },
      {
        property: "og:description",
        content:
          "Application élégante pour vos invocations quotidiennes : compteur intelligent, favoris, recherche et mode sombre.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", href: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:wght@400;700&family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ReminderEngine />
      <SmartReminderEngine />
      <ReduceMotionEffect />
      <ServiceWorkerRegistration />
      <Outlet />
    </QueryClientProvider>
  );
}

/** ⚙️ Paramètres > Général > "Réduire les animations" (§17 mission) — un
 * attribut sur `<html>`, lu par une seule règle CSS globale (voir
 * styles.css), plutôt que de toucher chaque transition individuellement. */
function ReduceMotionEffect() {
  const { prefs } = usePreferences();
  useEffect(() => {
    document.documentElement.dataset.reduceMotion = prefs.general.reduceMotion ? "true" : "false";
  }, [prefs.general.reduceMotion]);
  return null;
}

/**
 * Moteur de rappels unique monté une seule fois à la racine (§24) — tourne
 * tant que l'app est ouverte, quel que soit l'écran affiché. Voir
 * `useReminderEngine` dans src/lib/reminders.ts pour le détail et les
 * limites PWA réelles.
 */
function ReminderEngine() {
  useReminderEngine();
  return null;
}

/** Rappels intelligents Prières/Adhkār/Wird (chantier "Rappels intelligents")
 * — voir src/lib/smartReminders.ts pour la logique et les limites (même
 * moteur "premier plan uniquement" que ReminderEngine ci-dessus). */
function SmartReminderEngine() {
  useSmartReminderEngine();
  return null;
}

/** Service Worker minimal (chantier "Plein écran paysage + Installation",
 * §6) — enregistré une seule fois, sans aucune stratégie de cache (voir
 * public/sw.js) : uniquement pour remplir le critère d'installabilité PWA,
 * jamais pour servir une version figée de l'app ni toucher aux données
 * utilisateur (favoris/progression/Wird/paramètres restent en
 * localStorage). */
function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Échec silencieux : l'app reste pleinement fonctionnelle sans SW,
      // seule l'installation PWA peut rester indisponible.
    });
  }, []);
  return null;
}
