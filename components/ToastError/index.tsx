import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export const ToastError: React.FC<{ error: string | null; setError: any }> = ({
  error,
  setError,
}) => {
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <AnimatePresence>
      {error && (
        <div className="fixed left-1/2 transform -translate-x-1/2 bottom-20 w-auto">
          <motion.p
            initial={{
              opacity: 0,
              y: 50,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-red-500 rounded  text-white p-4"
          >
            {error}
          </motion.p>
        </div>
      )}
    </AnimatePresence>
  );
};
