"use client";

import { motion } from "framer-motion";
import { itemVariants } from "@/animations/framer-variants";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marco Rossi",
    role: "Skipper Professionale",
    content:
      "Cambusaai ha rivoluzionato il modo in cui organizzo i viaggi. Prima passavo ore a pianificare i menu, ora in 5 minuti ho tutto pronto!",
    rating: 5,
    avatar: "⛵",
  },
  {
    name: "Sofia Bianchi",
    role: "Crocierista",
    content:
      "Perfetto per gestire le preferenze di tutto l'equipaggio. La lista della spesa automatica mi ha salvato più volte!",
    rating: 5,
    avatar: "🌊",
  },
  {
    name: "Luca Verdi",
    role: "Proprietario Charter",
    content:
      "I clienti sono sempre soddisfatti dei menu. L'AI considera davvero tutte le esigenze alimentari. Ottimo investimento!",
    rating: 5,
    avatar: "⚓",
  },
  {
    name: "Anna Neri",
    role: "Capitana di Lungo Corso",
    content:
      "Dopo 15 anni di navigazione, finalmente ho trovato uno strumento che semplifica davvero la gestione della cambusa.",
    rating: 5,
    avatar: "🧭",
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <motion.section variants={itemVariants} className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          variants={itemVariants}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-3 sm:mb-4">
            I numeri di Cambusaai
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Migliaia di navigatori hanno già semplificato la loro cambusa
          </p>
        </motion.div>
        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
        >
          <motion.div 
            className="text-center"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
              500+
            </div>
            <div className="text-gray-600 text-sm sm:text-base">
              Menu Generati
            </div>
          </motion.div>
          <motion.div 
            className="text-center"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
              4.9/5
            </div>
            <div className="text-gray-600 text-sm sm:text-base">
              Valutazione Media
            </div>
          </motion.div>
          <motion.div 
            className="text-center"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
              1000+
            </div>
            <div className="text-gray-600 text-sm sm:text-base">
              Navigatori Soddisfatti
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
