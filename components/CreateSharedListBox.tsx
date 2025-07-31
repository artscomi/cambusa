"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { List, ArrowRight, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export const CreateSharedListBox: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== "undefined") {
      router.push("/shared-lists/create");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="bg-gradient-to-br from-primary to-primary-light rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-white w-full h-full flex flex-col justify-center cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label="Crea una lista condivisa"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full mb-4 sm:mb-6">
          <List className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">
          Crea una lista condivisa
        </h2>

        <p className="text-base sm:text-lg mb-6 sm:mb-8 text-white/95 leading-relaxed">
          Crea e condividi liste di ingredienti con il tuo gruppo per organizzare meglio la spesa
        </p>

        <motion.button
          animate={{ scale: isHovered ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto w-full sm:w-auto justify-center"
        >
          <span>Crea una lista</span>
          <motion.div
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
}; 