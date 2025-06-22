"use client";

import { motion } from "framer-motion";
import {
  pageContainerVariants,
  pageItemVariants,
} from "@/animations/framer-variants";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CreateGroupLayoutProps {
  children: React.ReactNode;
}

export const CreateGroupLayout: React.FC<CreateGroupLayoutProps> = ({
  children,
}) => {
  return (
    <motion.main
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
      className="overflow-x-hidden w-full max-w-full"
    >
      {/* Header */}
      <motion.section
        variants={pageItemVariants}
        className="relative pt-4 sm:pt-8 pb-4 sm:pb-8 px-4 overflow-x-hidden"
      >
        <div className="max-w-2xl mx-auto overflow-x-hidden">
          {/* Page Header */}
          <motion.header
            variants={pageItemVariants}
            className="text-center mb-8 sm:mb-12 overflow-x-hidden"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 sm:mb-6 text-primary">
              Crea il tuo gruppo
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Raccogli le preferenze alimentari di tutta la ciurma.
              <br className="hidden sm:block" /> Crea un gruppo per gestire le
              preferenze del tuo equipaggio.
            </p>
          </motion.header>

          {/* Main Form */}
          <motion.div
            variants={pageItemVariants}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 overflow-x-hidden"
          >
            {children}
          </motion.div>

          {/* Back Button */}
          <motion.div
            variants={pageItemVariants}
            className="mt-8 sm:mt-12 text-center overflow-x-hidden"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Torna alla home</span>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </motion.main>
  );
};
