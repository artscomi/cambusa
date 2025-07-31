import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Share2, Link, Users } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface ShareListModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  listName: string;
  currentUrl: string;
}

const ShareListModal: React.FC<ShareListModalProps> = ({
  isOpen,
  onClose,
  listId,
  listName,
  currentUrl,
}) => {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<"link" | "native">("link");

  const shareUrl = `${window.location.origin}/shared-lists/${listId}`;
  const shareText = `Ho creato una lista della spesa condivisa: "${listName}". Vieni a votare sugli ingredienti! 🛒`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Errore nel copiare il link:", error);
    }
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Lista: ${listName}`,
          text: shareText,
          url: shareUrl,
        });
      } else {
        setShareMethod("link");
      }
    } catch (error) {
      console.error("Errore nella condivisione:", error);
      setShareMethod("link");
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, "_blank");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Lista della spesa condivisa: ${listName}`);
    const body = encodeURIComponent(`${shareText}\n\nLink: ${shareUrl}`);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Share2 size={20} />
                Condividi Lista
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {listName}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Condividi questa lista con i tuoi amici per votare sugli ingredienti!
                </p>
              </div>

              {/* Link Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Link size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Link diretto</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 p-2 text-sm border border-gray-300 rounded bg-white"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`p-2 rounded transition-colors ${
                      copied
                        ? "bg-green-100 text-green-600"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                    title="Copia link"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-green-600 mt-1">Link copiato!</p>
                )}
              </div>

              {/* Share Options */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Users size={16} />
                  Condividi via
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {/* Native Share */}
                  <button
                    onClick={handleNativeShare}
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Share2 size={16} />
                    <span className="text-sm">Condividi</span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsAppShare}
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">📱</span>
                    <span className="text-sm">WhatsApp</span>
                  </button>

                  {/* Telegram */}
                  <button
                    onClick={handleTelegramShare}
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">✈️</span>
                    <span className="text-sm">Telegram</span>
                  </button>

                  {/* Email */}
                  <button
                    onClick={handleEmailShare}
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">📧</span>
                    <span className="text-sm">Email</span>
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  💡 <strong>Suggerimento:</strong> Chiunque abbia il link può votare sugli ingredienti e aggiungere nuovi elementi alla lista!
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareListModal; 