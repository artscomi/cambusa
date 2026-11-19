"use client";

import { useState, useEffect, useCallback } from "react";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
}

/** Evento con cui il banner avvisa gli altri componenti che il consenso è cambiato. */
const CONSENT_EVENT = "cookie-consent-change";

export const useCookieConsent = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    functional: false,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Carica le preferenze dal localStorage solo sul client
    if (typeof window !== "undefined") {
      const savedConsent = localStorage.getItem("cookie-consent");
      if (savedConsent) {
        try {
          const parsedPreferences = JSON.parse(savedConsent);
          setPreferences(parsedPreferences);
        } catch (error) {
          console.error("Errore nel parsing delle preferenze cookie:", error);
        }
      }
    }
    setIsLoaded(true);

    // Aggiorna subito questo componente quando il consenso cambia altrove (es. il banner)
    const onChange = (e: Event) => {
      setPreferences((e as CustomEvent<CookiePreferences>).detail);
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  const updatePreferences = useCallback((newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    if (typeof window !== "undefined") {
      localStorage.setItem("cookie-consent", JSON.stringify(newPreferences));
      window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: newPreferences }));
    }
  }, []);

  const hasConsent = (type: keyof CookiePreferences): boolean => {
    return preferences[type];
  };

  const canLoadAnalytics = (): boolean => {
    return hasConsent("analytics");
  };

  const canLoadFunctional = (): boolean => {
    return hasConsent("functional");
  };

  const resetConsent = useCallback(() => {
    const reset = { necessary: true, analytics: false, functional: false };
    if (typeof window !== "undefined") {
      localStorage.removeItem("cookie-consent");
      window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: reset }));
    }
    setPreferences(reset);
  }, []);

  return {
    preferences,
    isLoaded,
    isMounted,
    updatePreferences,
    hasConsent,
    canLoadAnalytics,
    canLoadFunctional,
    resetConsent,
  };
};
