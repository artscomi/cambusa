"use client";

import { useCookieConsent } from "@/hooks/useCookieConsent";

/** Riapre il banner dei cookie (stesso comportamento di "Impostazioni Cookie" nel footer). */
export function CookieSettingsButton() {
  const { resetConsent } = useCookieConsent();
  return (
    <button
      type="button"
      onClick={() => {
        resetConsent();
        window.location.reload();
      }}
      className="inline-flex min-h-[44px] items-center rounded-full border-2 border-primary px-5 font-semibold text-primary transition hover:bg-secondary"
    >
      Cambia le preferenze sui cookie
    </button>
  );
}
