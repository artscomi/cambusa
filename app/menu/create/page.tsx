"use client";

import { MainForm } from "@/components/MainForm";
import { ToastError } from "@/components/ToastError";
import { Loading } from "@/components/Loading";
import { PageContainer } from "@/components/PageContainer";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  pageContainerVariants,
  pageItemVariants,
} from "@/animations/framer-variants";
import { ArrowLeft } from "lucide-react";
import { CTA } from "@/components/CTA";

export default function CreateMenuPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return isPending ? (
    <Loading />
  ) : (
    <motion.main
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
      className="overflow-x-hidden w-full max-w-full"
    >
      <PageContainer className="overflow-x-hidden">
      {/* Header */}
      <motion.section
        variants={pageItemVariants}
        className="relative overflow-x-hidden"
      >
        <div className="max-w-2xl mx-auto overflow-x-hidden">
          {/* Page Header */}
          <motion.header
            variants={pageItemVariants}
            className="text-center mb-8 sm:mb-12 overflow-x-hidden"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 sm:mb-6 text-primary">
              Crea il tuo menu
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Pianifica i pasti per la tua vacanza in barca.
              <br className="hidden sm:block" /> Inizia subito a creare il menu
              perfetto per il tuo equipaggio.
            </p>
          </motion.header>

          {/* Main Form */}
          <motion.div
            variants={pageItemVariants}
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 overflow-x-hidden"
          >
            <MainForm startTransition={startTransition} setError={setError} />
          </motion.div>

          {/* Back Button */}
          <motion.div
            variants={pageItemVariants}
            className="mt-8 sm:mt-12 text-center overflow-x-hidden"
          >
            <CTA href="/" variant="textIconStart">
              <ArrowLeft aria-hidden />
              Torna alla home
            </CTA>
          </motion.div>
        </div>
      </motion.section>
      </PageContainer>

      {/* Toast Notifications */}
      <div role="alert" aria-live="polite">
        <ToastError error={error} setError={setError} />
      </div>
    </motion.main>
  );
}
