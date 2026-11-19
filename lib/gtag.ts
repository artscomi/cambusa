export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID!;

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const GAevent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};

/**
 * Evento Google Analytics 4 per le azioni importanti (lista creata, invito, menu generato...).
 * Se l'utente non ha accettato i cookie analitici GA non è caricato e l'evento non parte.
 */
export const trackEvent = (
  name: string,
  params: Record<string, string | number | boolean> = {},
) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
};
