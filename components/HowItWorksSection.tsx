"use client";

import { motion } from "framer-motion";
import { itemVariants } from "@/animations/framer-variants";
import {
  Anchor,
  Users,
  ChefHat,
  ShoppingCart,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: <Anchor className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />,
    title: "Pianifica il Viaggio",
    description:
      "Inserisci durata, numero di pasti e preferenze alimentari del tuo equipaggio",
  },
  {
    icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />,
    title: "Gestisci l'Equipaggio",
    description:
      "Aggiungi le preferenze e restrizioni alimentari di ogni membro",
  },
  {
    icon: <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />,
    title: "Genera il Menu",
    description:
      "L'AI crea un menu personalizzato e bilanciato per tutto il viaggio",
  },
  {
    icon: <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />,
    title: "Lista della Spesa",
    description:
      "Ricevi automaticamente la lista completa degli ingredienti necessari",
  },
  {
    icon: <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />,
    title: "Salpa Sereno",
    description: "Tutto pronto per una crociera senza pensieri alimentari!",
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <motion.section
      variants={itemVariants}
      className="py-12 sm:py-10 mt-24 md:py-20 bg-gradient-to-br from-blue-50 to-cyan-50 w-full"
    >
      <div className="w-full px-10 sm:px-6 md:px-10">
        <motion.div
          variants={itemVariants}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-3 sm:mb-4">
            Come Funziona
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl sm:max-w-3xl mx-auto px-2">
            In soli 5 semplici passaggi, avrai la tua cambusa perfetta pronta
            per salpare
          </p>
        </motion.div>

        {/* Mobile: Single column layout */}
        <div className="block sm:hidden space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                {index + 1}
              </div>

              {/* Step Card */}
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      {step.icon}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="flex justify-center mt-4">
                  <ArrowRight className="w-4 h-4 text-primary rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Desktop: Grid layout with arrows */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-5 gap-12 max-w-7xl mx-auto relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                  {index + 1}
                </div>

                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full relative">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                      {step.icon}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>

                    <p className="text-base text-gray-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 left-full transform -translate-y-1/2 translate-x-3 z-20">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tablet: Grid layout */}
        <div className="hidden sm:grid lg:hidden sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-2 -left-2 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                {index + 1}
              </div>

              {/* Step Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full relative">
                <div className="flex flex-col items-center text-center h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-3">
                    {step.icon}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-gray-700 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tablet arrows */}
        <div className="hidden sm:flex lg:hidden justify-center mt-6">
          <div className="flex space-x-2">
            {[...Array(4)].map((_, index) => (
              <ArrowRight
                key={index}
                className="w-4 h-4 text-primary rotate-90"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
