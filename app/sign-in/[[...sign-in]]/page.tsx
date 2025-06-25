"use client";

import { SignIn } from "@clerk/nextjs";
import { isInWebview } from "@/app/utils";
import { useEffect, useState } from "react";

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);
  const [isWebview, setIsWebview] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setIsWebview(isInWebview());
    }
  }, []);

  if (!isMounted) {
    return null; // Return null during SSR to prevent hydration mismatch
  }

  if (isWebview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Accesso non disponibile</h1>
        <p className="text-gray-600">
          Per accedere a Cambusa, ti preghiamo di utilizzare un browser web
          standard.
        </p>
      </div>
    );
  }

  return (
    <SignIn
      appearance={{
        elements: {
          socialButtonsBlockButton: {
            display: isWebview ? "none" : "block",
          },
          footerActionLink: {
            color: "var(--clerk-primary)",
          },
        },
        layout: {
          termsPageUrl: "/termini",
          privacyPageUrl: "/privacy",
        },
      }}
    />
  );
}
