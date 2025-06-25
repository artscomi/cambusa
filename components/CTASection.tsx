"use client";

import { motion } from "framer-motion";
import { itemVariants } from "@/animations/framer-variants";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { Anchor, Sparkles, ArrowRight } from "lucide-react";

export const CTASection: React.FC = () => {
  const router = useRouter();

  return (
    <motion.section
      variants={itemVariants}
      className="py-16 sm:py-20 bg-gradient-to-br from-primary to-primary-light relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div variants={itemVariants} className="text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8"
          >
            <Anchor className="w-10 h-10 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-6"
          >
            Pronti a Salpare?
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Unisciti a migliaia di navigatori che hanno già rivoluzionato la
            gestione della loro cambusa. Inizia ora e scopri quanto è semplice
            creare menu perfetti per ogni viaggio.
          </motion.p>

          {/* Features */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          >
            <div className="flex items-center justify-center gap-2 text-white/90">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm sm:text-base">Menu Personalizzati</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm sm:text-base">
                Lista Spesa Automatica
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm sm:text-base">
                Condividi con l'equipaggio
              </span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={() => router.push("/")}
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <span>Inizia ora</span>
              <ArrowRight size={20} />
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/blog")}
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              Scopri il nostro Blog
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
