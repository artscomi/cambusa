// components/Toast.tsx
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
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const toastClasses = `
  fixed top-10 right-10 p-4 rounded-lg shadow-lg text-white
  ${type === "success" ? "bg-teal-500" : ""}
  ${type === "error" ? "bg-red-500" : ""}
  ${type === "info" ? "bg-blue-500" : ""}
`;
  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          initial={{ scale: 0, opacity: 0 }}
          className={toastClasses}
          exit={{ scale: 0, opacity: 0 }}
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
