import React, { useState } from "react";
import { Icon } from "../Icons";
import Toast from "../Toast";

const CopyLink: React.FC<{ url: string }> = ({ url }) => {
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
    <div className="flex justify-center">
      <div className="inline-flex items-center justify-center p-4 border border-gray-300 rounded-lg shadow-md gap-5 bg-white text-sm">
        <p>{url}</p>
        <button
          onClick={handleCopy}
          className="text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 p-3"
          aria-label="Copia link negli appunti"
        >
          <Icon.Copy height={22} width={22} />
        </button>
        <Toast
          message={"Link copiato negli appunti!"}
          type="info"
          onClose={() => setShowToast(false)}
          showToast={showToast}
        />
      </div>
    </div>
  );
};

export default CopyLink;
