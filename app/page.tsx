"use client";

import { CreateGroupBox } from "@/components/CreateGroupBox";
import { Loading } from "@/components/Loading";
import { ToastError } from "@/components/ToastError";
import { FeaturesCarousel } from "@/components/FeaturesCarousel";
import { MenuFormBox } from "@/components/MenuFormBox";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Toast from "@/components/Toast";
import { resetApiCallCount } from "./api/actions";
import { motion, AnimatePresence } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  blogHeaderVariants,
} from "@/animations/framer-variants";

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successPayment, setSuccessPayment] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchStripeState = async () => {
      return fetch(
        `/api/checkout-sessions?session_id=${searchParams.get("session_id")}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then(async (data) => {
          if (data.status === "complete") {
            try {
              await resetApiCallCount();
              console.log("API call count reset successfully");
              setSuccessPayment(true);
            } catch (e) {
              console.error("Error resetting API call count:");
            }
          } else {
            throw new Error("Pagamento non completato, riprova");
          }
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    };

    if (searchParams.get("session_id")) {
      fetchStripeState();
    }
  }, [searchParams]);

  return isPending ? (
    <Loading />
  ) : (
    <AnimatePresence>
      <main className="min-h-screen">
        {/* Hero Section */}
        <motion.section
          variants={blogHeaderVariants}
          initial="hidden"
          animate="visible"
          className="relative pt-4 sm:pt-8 pb-4 sm:pb-8 px-6 md:px-10"
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.header
              variants={itemVariants}
              className="text-center mb-8 sm:mb-12"
            >
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-4 sm:mb-6">
                <Link
                  href="/"
                  aria-label="Torna alla home di cambusaai"
                  className="hover:opacity-80 transition-opacity"
                >
                  Cambusa<span className="text-primary">ai</span>
                </Link>
              </h1>

              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-2"
                role="doc-subtitle"
              >
                Crea il menu perfetto per tutto l&apos;equipaggio.
                <br className="hidden sm:block" /> Siete pronti a salpare? ⛵
              </motion.p>
            </motion.header>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mb-8 sm:mb-12"
            >
              <FeaturesCarousel />
            </motion.div>
          </div>
        </motion.section>

        {/* Main Content Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative px-6 md:px-32 max-w-7xl mx-auto"
          aria-label="Strumenti di pianificazione menu"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-stretch">
              {/* Menu Form Box */}
              <motion.div
                variants={itemVariants}
                className="order-1 w-full h-full"
                role="complementary"
                aria-label="Box di creazione menu"
              >
                <MenuFormBox />
              </motion.div>

              {/* Create Group Box */}
              <motion.div
                variants={itemVariants}
                className="order-2 w-full h-full"
                role="complementary"
                aria-label="Creazione gruppo"
              >
                <CreateGroupBox />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <HowItWorksSection />
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <TestimonialsSection />
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <FAQSection />
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <CTASection />
        </motion.div>

        {/* Toast Notifications */}
        <div role="alert" aria-live="polite">
          <ToastError error={error} setError={setError} />
          <Toast
            message="Pagamento effettuato con successo!"
            type="success"
            onClose={() => setSuccessPayment(false)}
            showToast={successPayment}
          />
        </div>
      </main>
    </AnimatePresence>
  );
}
