/**
 * Esclusione del traffico interno dalle statistiche.
 * Quando un admin apre /admin/metriche, il browser viene segnato come "interno"
 * e da quel momento non invia più dati a Vercel, GA, Clarity, Hotjar e Ahrefs.
 * Vale per browser e dispositivo, non per IP, quindi funziona anche cambiando rete.
 */
const KEY = "cambusa_internal_traffic";

export const isInternalVisitor = () => {
  try {
    return typeof window !== "undefined" && localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

export const setInternalVisitor = (internal: boolean) => {
  try {
    if (internal) localStorage.setItem(KEY, "1");
    else localStorage.removeItem(KEY);
  } catch {
    // localStorage non disponibile (es. navigazione privata): niente da fare
  }
};
