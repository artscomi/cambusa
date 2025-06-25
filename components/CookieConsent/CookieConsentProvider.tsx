"use client";

import { ReactNode, useCallback } from "react";
import { CookieConsent } from "./index";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { Analytics } from "../Analytics";

interface CookieConsentProviderProps {
  children: ReactNode;
}

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({
  children,
}) => {
  const { updatePreferences } = useCookieConsent();

  const handlePreferencesChange = useCallback(
    (preferences: any) => {
      updatePreferences(preferences);
    },
    [updatePreferences]
  );

  return (
    <>
      {children}
      <CookieConsent onPreferencesChange={handlePreferencesChange} />
      <Analytics />
    </>
  );
};
