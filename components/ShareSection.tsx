"use client";

import React, { useState, useEffect } from "react";
import CopyLink from "@/components/CopyLinkButton";
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
}

export const ShareSection: React.FC<ShareSectionProps> = ({
  groupName,
  shareUrl,
  copyLinkUrl,
  title,
  description,
  shareButtonText = "Condividi",
  copyLinkText = "Copia link",
}) => {
  const [supportsShare, setSupportsShare] = useState(false);
  const isMobile = useIsMobile();

  // Check if Web Share API is supported
  useEffect(() => {
    const hasShareAPI = typeof navigator !== "undefined" && "share" in navigator;
    setSupportsShare(hasShareAPI);
  }, []);

  // Dynamic description based on device and API support
  const getDynamicDescription = () => {
    if (description) return description;
    
    if (isMobile) {
      if (supportsShare) {
        return "Condividi il gruppo con i tuoi compagni di viaggio. Usa il pulsante 'Condividi' per inviare il link.";
      } else {
        return "Condividi il gruppo con i tuoi compagni di viaggio. Copia il link e invialo ai tuoi amici.";
      }
    } else {
      return "Condividi il gruppo con i tuoi compagni di viaggio. Copia il link e invialo ai tuoi amici.";
    }
  };

  const handleShare = async ({
    groupName,
    url,
  }: {
    groupName: string;
    url: string;
  }) => {
    try {
      const shareData = {
        title: `Gruppo ${groupName} - Cambusa`,
        text: `Ciao! Sei stato invitato a prendere parte al gruppo: ${groupName} su Cambusa. Clicca qui per aggiungere le tue preferenze alimentari: ${url}`,
        url: url,
      };

      await navigator.share(shareData);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Errore durante la condivisione:", err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div>
        {title && (
          <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
        )}
        {getDynamicDescription() && <p className="text-gray-600 text-l">{getDynamicDescription()}</p>}
      </div>
      <div className="flex-shrink-0">
        {/* Show share button if on mobile AND Web Share API is supported */}
        {isMobile && supportsShare && (
          <button
            onClick={() =>
              handleShare({
                groupName,
                url: shareUrl,
              })
            }
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-accent/90 transition-colors duration-200"
            title="Condividi gruppo"
          >
            <Share2 className="w-4 h-4" />
            {shareButtonText}
          </button>
        )}
        
        {/* Show copy link button on desktop OR if Web Share API is not supported on mobile */}
        {(!isMobile || (isMobile && !supportsShare)) && (
          <CopyLink url={copyLinkUrl} text={copyLinkText} />
        )}
        
        {/* Show share button on desktop if Web Share API is supported */}
        {!isMobile && supportsShare && (
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm mb-2">oppure condividi il link</p>
            <button
              onClick={() =>
                handleShare({
                  groupName,
                  url: shareUrl,
                })
              }
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-accent/90 transition-colors duration-200 mx-auto"
              title="Condividi gruppo"
            >
              <Share2 className="w-4 h-4" />
              {shareButtonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
