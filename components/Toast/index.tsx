import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  showToast: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, showToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const toastClasses = `
  fixed right-5 sm:left-auto p-4 m-auto left-5 rounded-lg shadow-lg text-white max-sm:b-10 bottom-10 sm:bottom-auto sm:top-10 z-10
  ${type === "success" ? "bg-teal-500" : ""}
  ${type === "error" ? "bg-red-500" : ""}
  ${type === "info" ? "bg-tertiary" : ""}
`;
  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          initial={{ scale: 0, opacity: 0 }}
          className={toastClasses}
          exit={{ opacity: 0, y: 30 }}
        >
          <div className="flex items-center justify-between">
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 text-lg font-bold">
              &times;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
