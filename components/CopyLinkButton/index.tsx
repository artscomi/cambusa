import React, { useState } from "react";
import Toast from "../Toast";
import { Clipboard } from "lucide-react";
import { cn } from "@/lib/utils";

const CopyLink: React.FC<{
  url: string;
  text?: string;
  /** Stile compatto allineato alle card dashboard (es. pagina menu gruppo). */
  compact?: boolean;
  className?: string;
}> = ({ url, text = "Copia link", compact = false, className }) => {
  const [showToast, setShowToast] = useState(false);
  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setShowToast(true);
    } catch (error) {
      console.error("Errore nella copia del link:", error);
    }
  };

  return (
    <div
      className={cn(
        "flex max-w-full items-center overflow-hidden",
        compact
          ? "min-h-10 w-full min-w-0 gap-2 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 sm:min-w-0 sm:flex-1 sm:rounded-2xl sm:px-3 sm:py-2"
          : "m-auto w-full min-w-0 max-w-full items-center justify-center gap-5 rounded-lg border border-gray-200 bg-white p-4 md:max-w-[500px]",
        className,
      )}
    >
      <p
        title={url}
        className={cn(
          "min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap",
          compact
            ? "text-left text-xs leading-5 text-gray-600"
            : "text-sm text-gray-600",
        )}
      >
        {url}
      </p>
      <button
        onClick={handleCopy}
        type="button"
        className={cn(
          "flex shrink-0 items-center justify-center transition-colors",
          compact
            ? "h-8 w-8 rounded-lg border border-primary/20 bg-primary/[0.06] text-primary hover:bg-primary/[0.12] sm:h-9 sm:w-9"
            : "bg-gray-100 p-3 text-gray-600 hover:text-gray-900",
        )}
        aria-label={`${text} negli appunti`}
      >
        <Clipboard height={compact ? 16 : 22} width={compact ? 16 : 22} />
      </button>
      <Toast
        message={`${text} copiato negli appunti!`}
        type="info"
        onClose={() => setShowToast(false)}
        showToast={showToast}
      />
    </div>
  );
};

export default CopyLink;
