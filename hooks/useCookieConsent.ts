"use client";

import { useState, useEffect, useCallback } from "react";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
}

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
  }, []);

  const updatePreferences = useCallback((newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    if (typeof window !== "undefined") {
      localStorage.setItem("cookie-consent", JSON.stringify(newPreferences));
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
    if (typeof window !== "undefined") {
      localStorage.removeItem("cookie-consent");
    }
    setPreferences({
      necessary: true,
      analytics: false,
      functional: false,
    });
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
