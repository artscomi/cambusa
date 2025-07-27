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
  title = "Condividi il link del gruppo",
  description = "Condividi questo link con i membri del gruppo per permettere loro di aggiungere le loro preferenze"
}) => {
  const [supportsShare, setSupportsShare] = useState(false);

  // Check if Web Share API is supported
  useEffect(() => {
    setSupportsShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const handleShare = async ({ groupName, url }: { groupName: string; url: string }) => {
    try {
      const shareData = {
        title: `Gruppo ${groupName} - Cambusa`,
        text: `Ciao! Sei stato invitato a prendere parte al gruppo: ${groupName} su Cambusa. Clicca qui per aggiungere le tue preferenze alimentari: ${url}`,
        url: url,
      };

      await navigator.share(shareData);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error("Errore durante la condivisione:", err);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-center sm:text-left">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm">
          {description}
        </p>
      </div>
      <div className="flex-shrink-0 max-w-full">
        {/* Show share button if navigator.share is supported, copy link if not */}
        {supportsShare ? (
          <button
            onClick={() => handleShare({
              groupName,
              url: shareUrl,
            })}
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