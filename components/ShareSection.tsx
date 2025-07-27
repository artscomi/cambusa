"use client";

import React, { useState, useEffect } from "react";
import CopyLink from "@/components/CopyLinkButton";
import { Share2 } from "lucide-react";

interface ShareSectionProps {
  groupName: string;
  shareUrl: string;
  copyLinkUrl: string;
  title?: string;
  description?: string;
}

export const ShareSection: React.FC<ShareSectionProps> = ({
  groupName,
  shareUrl,
  copyLinkUrl,
  title,
  description = " Ora puoi condividere il link con i tuoi compagni di viaggio.",
}) => {
  const [supportsShare, setSupportsShare] = useState(false);

  // Check if Web Share API is supported
  useEffect(() => {
    setSupportsShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

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
        {description && <p className="text-gray-600 text-l">{description}</p>}
      </div>
      <div className="flex-shrink-0">
        {/* Show share button if navigator.share is supported, copy link if not */}
        {supportsShare ? (
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
            Condividi
          </button>
        ) : (
          <CopyLink url={copyLinkUrl} />
        )}
      </div>
    </div>
  );
};
