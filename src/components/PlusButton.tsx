import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { PlusSheet } from "@/components/PlusSheet";
import { cn } from "@/lib/utils";

/** Bouton « Plus » (ouvre la même feuille que la barre du bas), pour les écrans de lecture. */
export function PlusButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Plus"
        className={cn("grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-foreground transition active:scale-95", className)}
      >
        <MoreHorizontal className="size-5" />
      </button>
      {open && <PlusSheet onClose={() => setOpen(false)} />}
    </>
  );
}
