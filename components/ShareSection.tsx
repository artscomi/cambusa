"use client";

import React, { useState, useEffect } from "react";
import CopyLink from "@/components/CopyLinkButton";
import { CTA } from "@/components/CTA";
import Toast from "@/components/Toast";
import { cn } from "@/lib/utils";
import { Share2 } from "lucide-react";

// Hook to detect mobile using media query
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    
    const updateIsMobile = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // Set initial value
    updateIsMobile(mediaQuery);

    // Add listener
    mediaQuery.addEventListener("change", updateIsMobile);

    // Cleanup
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  return isMobile;
};

interface ShareSectionProps {
  groupName: string;
  shareUrl: string;
  copyLinkUrl: string;
  title?: string;
  description?: string;
  shareButtonText?: string;
  copyLinkText?: string;
  /**
   * `dashboard`: tipografia e layout come le sezioni della pagina menu gruppo.
   * `default`: layout centrato (es. colonna laterale pagina preferenze).
   */
  variant?: "default" | "dashboard";
  /** Sopratitolo in maiuscoletto (solo con `variant="dashboard"`). */
  overline?: string;
  /**
   * Colonna stretta (es. sidebar): niente fila orizzontale copia+condividi
   * (evita rotture perché `sm:` segue la viewport, non la larghezza del contenitore).
   */
  narrow?: boolean;
  /** Blocco in evidenza in cima pagina (es. organizzatore): titolo grande, senza overline. */
  lead?: boolean;
  /** `id` sull’`h2` del titolo (es. per `aria-labelledby` della sezione). */
  headingId?: string;
}

export const ShareSection: React.FC<ShareSectionProps> = ({
  groupName,
  shareUrl,
  copyLinkUrl,
  title,
  description,
  shareButtonText = "Condividi",
  copyLinkText = "Copia link",
  variant = "default",
  overline = "Condivisione",
  narrow = false,
  lead = false,
  headingId,
}) => {
  const [supportsShare, setSupportsShare] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const isMobile = useIsMobile();

  // Check if Web Share API is supported
  useEffect(() => {
    const hasShareAPI = typeof navigator !== "undefined" && "share" in navigator;
    setSupportsShare(hasShareAPI);
  }, []);

  // Dynamic description based on device and API support
  const getDynamicDescription = () => {
    if (description) return description;
    if (lead) {
      return "Condividi il link: ognuno apre la pagina e salva le proprie preferenze.";
    }
    if (isMobile) {
      if (supportsShare) {
        return "Condividi il gruppo con i tuoi compagni di viaggio. Usa il pulsante Condividi per inviare il link.";
      }
      return "Condividi il gruppo con i tuoi compagni di viaggio. Con Condividi copiamo il link negli appunti: poi incollalo dove preferisci.";
    } else {
      return "Condividi il gruppo con i tuoi compagni di viaggio. Copia il link e invialo ai tuoi amici.";
    }
  };

  const desc = getDynamicDescription();

  const handleShare = async ({
    groupName,
    url,
  }: {
    groupName: string;
    url: string;
  }) => {
    try {
      // L’URL solo nel testo: se passiamo anche `url`, molti client uniscono i due campi e il link compare due volte.
      // Così il link c’è sempre (anche dove si legge solo `text`) senza duplicati.
      const shareData: ShareData = {
        title: `Gruppo ${groupName} - Cambusa`,
        text: `Ciao! Sei stato invitato a prendere parte al gruppo: ${groupName} su Cambusa. Aggiungi le tue preferenze alimentari qui: ${url}`,
      };

      await navigator.share(shareData);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Errore durante la condivisione:", err);
      }
    }
  };

  const handleMobileShare = async () => {
    if (supportsShare) {
      await handleShare({ groupName, url: shareUrl });
      return;
    }
    try {
      await navigator.clipboard.writeText(copyLinkUrl);
      setShowCopiedToast(true);
    } catch (err) {
      console.error("Impossibile copiare il link:", err);
    }
  };

  /** Allineato in altezza alla barra URL (`min-h-10` / `sm:min-h-10`). */
  const ctaShareSmall =
    "h-10 min-h-10 gap-1.5 px-4 py-0 text-sm font-semibold leading-none sm:px-5";

  const shareActions = (() => {
    if (isMobile) {
      return (
        <>
          <CTA
            type="button"
            variant="accent"
            onClick={() => void handleMobileShare()}
            className={cn(
              ctaShareSmall,
              variant === "dashboard" && "w-full justify-center",
            )}
            title="Condividi gruppo"
          >
            <Share2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {shareButtonText}
          </CTA>
          <Toast
            message={`${copyLinkText} copiato negli appunti!`}
            type="info"
            onClose={() => setShowCopiedToast(false)}
            showToast={showCopiedToast}
          />
        </>
      );
    }

    if (supportsShare) {
      if (variant === "dashboard") {
        if (narrow) {
          return (
            <div className="flex w-full min-w-0 flex-col gap-3">
              <CopyLink
                url={copyLinkUrl}
                text={copyLinkText}
                compact
                className="w-full min-w-0 max-w-none sm:max-w-none sm:flex-none"
              />
              <p className="text-center text-xs text-gray-500">oppure</p>
              <CTA
                type="button"
                variant="accent"
                onClick={() =>
                  handleShare({
                    groupName,
                    url: shareUrl,
                  })
                }
                className={cn(ctaShareSmall, "w-full justify-center")}
                title="Condividi gruppo"
              >
                <Share2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {shareButtonText}
              </CTA>
            </div>
          );
        }
        return (
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
            <CopyLink
              url={copyLinkUrl}
              text={copyLinkText}
              compact
              className="w-full min-w-0 sm:flex-1"
            />
            <span className="hidden shrink-0 text-xs text-gray-500 sm:inline">
              oppure
            </span>
            <CTA
              type="button"
              variant="accent"
              onClick={() =>
                handleShare({
                  groupName,
                  url: shareUrl,
                })
              }
              className={cn(ctaShareSmall, "w-full shrink-0 justify-center sm:w-auto")}
              title="Condividi gruppo"
            >
              <Share2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {shareButtonText}
            </CTA>
          </div>
        );
      }
      return (
        <>
          <CopyLink url={copyLinkUrl} text={copyLinkText} />
          <div className="space-y-3 text-center">
            <p className="text-sm text-gray-600">oppure condividi il link</p>
            <CTA
              type="button"
              variant="accent"
              onClick={() =>
                handleShare({
                  groupName,
                  url: shareUrl,
                })
              }
              center
              title="Condividi gruppo"
            >
              <Share2 className="h-4 w-4 shrink-0" aria-hidden />
              {shareButtonText}
            </CTA>
          </div>
        </>
      );
    }

    return (
      <CopyLink
        url={copyLinkUrl}
        text={copyLinkText}
        compact={variant === "dashboard"}
        className={
          variant === "dashboard"
            ? cn("w-full", narrow && "max-w-none sm:max-w-none sm:flex-none")
            : undefined
        }
      />
    );
  })();

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col gap-5",
        variant === "dashboard"
          ? narrow
            ? "items-stretch text-left"
            : lead
              ? "items-stretch gap-6 text-left sm:gap-8"
              : "items-stretch text-center sm:items-start sm:text-left"
          : "items-center gap-4 text-center",
      )}
    >
      {variant === "dashboard" ? (
        <div className="space-y-0">
          {!lead && overline ? (
            <p className="font-subtitle text-[11px] font-bold uppercase tracking-[0.2em] text-primary/75">
              {overline}
            </p>
          ) : null}
          {title ? (
            <h2
              id={headingId}
              className={cn(
                "font-display font-bold text-primary",
                lead
                  ? "text-2xl leading-tight sm:text-3xl md:text-[2.125rem]"
                  : narrow
                    ? "mt-0 text-xl leading-snug"
                    : "mt-2 text-xl sm:text-2xl",
              )}
            >
              {title}
            </h2>
          ) : null}
          {desc ? (
            <p
              className={cn(
                "max-w-2xl leading-relaxed text-gray-700",
                lead
                  ? "mt-3 text-base font-medium sm:text-lg"
                  : narrow
                    ? "mt-2 text-sm leading-relaxed text-gray-600"
                    : "mt-2 text-sm text-gray-600 sm:text-[0.95rem]",
              )}
            >
              {desc}
            </p>
          ) : null}
        </div>
      ) : (
        <div>
          {title ? (
            <h3 className="mb-2 text-lg font-semibold text-primary">{title}</h3>
          ) : null}
          {desc ? (
            <p className="text-sm leading-relaxed text-gray-600">{desc}</p>
          ) : null}
        </div>
      )}

      <div
        className={cn(
          "flex w-full min-w-0 flex-shrink-0 flex-col gap-3 sm:gap-4",
          lead && "gap-4 sm:gap-5",
        )}
      >
        {shareActions}
      </div>
    </div>
  );
};
