import React from "react";
import { Icon } from "../Icons";

const CopyLink: React.FC<{ url: string }> = ({ url }) => {
  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copiato negli appunti!");
    } catch (error) {
      console.error("Errore nella copia del link:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center justify-center p-4 border border-gray-300 rounded-lg shadow-md gap-5">
        <p>{url}</p>
        <button
          onClick={handleCopy}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Copia link negli appunti"
        >
          <Icon.Copy height={20} />
        </button>
      </div>
    </div>
  );
};

export default CopyLink;
