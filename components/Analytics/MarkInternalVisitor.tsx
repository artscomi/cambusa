"use client";

import { useEffect, useState } from "react";
import { isInternalVisitor, setInternalVisitor } from "@/lib/internalTraffic";

/**
 * Montato nella pagina admin: segna questo browser come traffico interno
 * e permette di riattivare il tracciamento se serve (es. per fare un test).
 */
export const MarkInternalVisitor = () => {
  const [internal, setInternal] = useState<boolean | null>(null);

  useEffect(() => {
    setInternalVisitor(true);
    setInternal(isInternalVisitor());
  }, []);

  if (internal === null) return null;

  const toggle = () => {
    setInternalVisitor(!internal);
    setInternal(!internal);
  };

  return (
    <p className="text-xs text-gray-500">
      {internal
        ? "Le tue visite da questo browser sono escluse dalle statistiche."
        : "Le tue visite da questo browser vengono conteggiate."}{" "}
      <button type="button" onClick={toggle} className="underline">
        {internal ? "Riattiva il tracciamento" : "Escludile di nuovo"}
      </button>
    </p>
  );
};
