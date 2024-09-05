import { AnimatePresence, motion } from "framer-motion";

export const ToastError: React.FC<{ error: boolean }> = ({ error }) => (
  <AnimatePresence>
    {error && (
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
        exit={{ y: 300 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="rounded text-white p-2 bg-red-500 fixed bottom-20 left-1/2 transform -translate-x-1/2 w-auto"
      >
        Oops.. qualcosa è andato storto, riprova
      </motion.p>
    )}
  </AnimatePresence>
);
