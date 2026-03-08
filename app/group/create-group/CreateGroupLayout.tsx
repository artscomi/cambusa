"use client";

import { motion } from "framer-motion";
import {
  pageContainerVariants,
  pageItemVariants,
} from "@/animations/framer-variants";
import { PageContainer } from "@/components/PageContainer";
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
      <PageContainer className="overflow-x-hidden">
      <motion.section
        variants={pageItemVariants}
        className="relative overflow-x-hidden"
      >
        <div className="max-w-2xl mx-auto overflow-x-hidden">
          <motion.header
            variants={pageItemVariants}
            className="text-center mb-8 sm:mb-12 overflow-x-hidden"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 sm:mb-6 text-primary">
              Crea il tuo gruppo
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Raccogli le preferenze alimentari di tutta la ciurma.
              <br className="hidden sm:block" /> Crea un gruppo per gestire le
              preferenze del tuo equipaggio.
            </p>
          </motion.header>

          <motion.div
            variants={pageItemVariants}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 overflow-x-hidden"
          >
            {children}
          </motion.div>

          <motion.div
            variants={pageItemVariants}
            className="mt-8 sm:mt-12 text-center overflow-x-hidden"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Torna alla home</span>
            </Link>
          </motion.div>
        </div>
      </motion.section>
      </PageContainer>
    </motion.main>
  );
};
