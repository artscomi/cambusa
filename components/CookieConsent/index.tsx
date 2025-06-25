"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings, Check, X as XIcon } from "lucide-react";
import Link from "next/link";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
}

interface CookieConsentProps {
  onPreferencesChange: (preferences: CookiePreferences) => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  onPreferencesChange,
}) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Sempre true, non può essere disabilitato
    analytics: false,
    functional: false,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Controlla se l'utente ha già fatto una scelta
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("cookie-consent");
      if (!consent) {
        setShowBanner(true);
      } else {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
        onPreferencesChange(savedPreferences);
      }
    }
  }, []); // Rimossa la dipendenza onPreferencesChange

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      functional: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted));
    setShowBanner(false);
    onPreferencesChange(allAccepted);
  };

  const handleRejectAll = () => {
    const allRejected = {
      necessary: true, // Sempre true
      analytics: false,
      functional: false,
    };
    setPreferences(allRejected);
    localStorage.setItem("cookie-consent", JSON.stringify(allRejected));
    setShowBanner(false);
    onPreferencesChange(allRejected);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
    onPreferencesChange(preferences);
  };

  const handlePreferenceChange = (
    type: keyof CookiePreferences,
    value: boolean
  ) => {
    if (type === "necessary") return; // Non può essere modificato
    setPreferences((prev) => ({ ...prev, [type]: value }));
  };

  // Non renderizzare nulla finché non siamo montati sul client
  if (!isMounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            {!showSettings ? (
              // Banner principale
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    <Cookie className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Utilizziamo i cookie
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Utilizziamo cookie e tecnologie simili per migliorare la
                      tua esperienza, analizzare il traffico e personalizzare i
                      contenuti.{" "}
                      <Link
                        href="/cookies"
                        className="text-primary hover:underline font-medium"
                      >
                        Scopri di più
                      </Link>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Impostazioni
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                    Rifiuta tutti
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Accetta tutti
                  </button>
                </div>
              </div>
            ) : (
              // Pannello impostazioni dettagliate
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    Impostazioni Cookie
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Cookie Necessari */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Cookie Necessari
                      </h4>
                      <p className="text-sm text-gray-600">
                        Essenziali per il funzionamento del sito. Non possono
                        essere disabilitati.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.necessary}
                        disabled
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Cookie Analitici */}
                  <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Cookie Analitici
                      </h4>
                      <p className="text-sm text-gray-600">
                        Google Analytics e Microsoft Clarity per analizzare
                        l'utilizzo del sito.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          handlePreferenceChange("analytics", e.target.checked)
                        }
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Cookie Funzionali */}
                  <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Cookie Funzionali
                      </h4>
                      <p className="text-sm text-gray-600">
                        Per ricordare le tue preferenze e personalizzare
                        l'esperienza.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) =>
                          handlePreferenceChange("functional", e.target.checked)
                        }
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    onClick={handleRejectAll}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                    Rifiuta tutti
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Accetta tutti
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                  >
                    Salva preferenze
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
