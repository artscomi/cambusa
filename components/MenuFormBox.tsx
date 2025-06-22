"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChefHat, ArrowRight } from "lucide-react";

export const MenuFormBox: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-primary w-full cursor-pointer h-full flex flex-col justify-center"
      role="button"
      tabIndex={0}
      aria-label="Apri form di creazione menu"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => (window.location.href = "/menu/create")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.location.href = "/menu/create";
        }
      }}
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-4 sm:mb-6">
          <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-primary">
          Crea il tuo menu
        </h2>

        <p className="text-base sm:text-lg mb-6 sm:mb-8 text-gray-700 leading-relaxed">
          La scelta più diretta quando il gruppo è omogeneo.
          <br className="hidden sm:block" />
          Pianifica subito i pasti per la tua vacanza in barca.
        </p>

        <motion.button
          animate={{ scale: isHovered ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span>Inizia ora</span>
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
