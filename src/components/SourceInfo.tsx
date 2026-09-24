import { useState } from "react";
import { Info } from "lucide-react";

interface SourceInfoProps {
  /** Titre de la source (ouvrage, recueil de hadith, projet éditorial…). */
  sourceTitle: string;
  sourceAuthor?: string;
  editorialSource?: string;
  sourceReference?: string;
  /** Portée honnête (ex. "Concerne les ayat 2:75–2:79"). */
  scope?: string | null;
  /** Statut d'authenticité pour un hadith (ex. "Authentique — Sahih al-Bukhari"). */
  authenticity?: string;
  /** Précise si le texte affiché est une citation, une traduction ou une synthèse. */
  nature?: string;
}

/**
 * Petit ⓘ discret donnant accès à la provenance complète d'un contenu,
 * sans polluer la lecture principale. Le jargon interne (needs_review,
 * droits de réutilisation…) vit ici, jamais dans le corps du texte.
 */
export function SourceInfo({
  sourceTitle,
  sourceAuthor,
  editorialSource,
  sourceReference,
  scope,
  authenticity,
  nature,
}: SourceInfoProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Voir la provenance"
        className="inline-grid size-4 shrink-0 place-items-center rounded-full text-muted-foreground/70 transition hover:text-primary"
      >
        <Info className="size-3.5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)}>
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-border bg-card p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[var(--shadow-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 text-sm font-bold text-foreground">Provenance</p>
            <dl className="space-y-2 text-sm">
              {sourceAuthor && <Row label="Auteur / mufassir" value={sourceAuthor} />}
              <Row label="Source" value={sourceTitle} />
              {editorialSource && editorialSource !== sourceTitle && (
                <Row label="Compilation éditoriale" value={editorialSource} />
              )}
              {sourceReference && <Row label="Référence" value={sourceReference} />}
              {scope && <Row label="Portée" value={scope} />}
              {authenticity && <Row label="Authenticité" value={authenticity} />}
              {nature && <Row label="Nature du texte" value={nature} />}
            </dl>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-full bg-muted py-2.5 text-sm font-semibold text-foreground"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-foreground/90">{value}</dd>
    </div>
  );
}
