"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { isInternalVisitor } from "@/lib/internalTraffic";

/**
 * Vercel Web Analytics (senza cookie, attivo anche senza consenso) e Ahrefs.
 * Entrambi si spengono sui browser segnati come traffico interno.
 */
export const SiteAnalytics = () => {
  const [internal, setInternal] = useState<boolean | null>(null);

  useEffect(() => {
    setInternal(isInternalVisitor());
  }, []);

  return (
    <>
      <VercelAnalytics
        beforeSend={(event) => (isInternalVisitor() ? null : event)}
      />
      {internal === false && (
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="0936IsFm5X3AsXRbCcwqZw"
          strategy="afterInteractive"
        />
      )}
    </>
  );
};
