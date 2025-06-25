"use client";

import {
  Instagram,
  Mail,
  Anchor,
  Heart,
  BookOpen,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { LegalLinks } from "./LegalLinks";

export const Footer = () => {
  const { resetConsent, isMounted } = useCookieConsent();

  const handleCookieSettings = () => {
    // Rimuovi le preferenze salvate per mostrare di nuovo il banner
    resetConsent();
    // Ricarica la pagina per mostrare il banner
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <h3 className="text-2xl font-display font-bold text-primary">
                Cambusa<span className="text-secondary">ai</span>
              </h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Crea la cambusa perfetta per la tua vacanza in barca a vela. Menu
              personalizzati e liste della spesa automatiche.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-gray-900 mb-4">Link Utili</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href="mailto:artscomi.web@gmail.com"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contattaci
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/cambusaai/"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </li>
              {isMounted && (
                <li>
                  <button
                    onClick={handleCookieSettings}
                    className="text-gray-600 hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2 w-full text-left"
                  >
                    <Settings className="w-4 h-4" />
                    Impostazioni Cookie
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Legal Links */}
          <LegalLinks />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 text-center md:text-left">
              © 2024 cambusaai
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by</span>
              <a
                href="https://www.instagram.com/artscomi/"
                className="font-semibold text-primary hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                artscomi
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
