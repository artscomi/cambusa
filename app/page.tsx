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
import { CTA } from "@/components/CTA";
import { useSearchParams } from "next/navigation";
import Toast from "@/components/Toast";
import { resetApiCallCount } from "./api/actions";
import { motion, AnimatePresence } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  blogHeaderVariants,
} from "@/animations/framer-variants";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successPayment, setSuccessPayment] = useState(false);
  const searchParams = useSearchParams();
  const { user } = useUser();

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
              if (user?.id) {
                await resetApiCallCount(user.id);
              }
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
  }, [searchParams, user?.id]);

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
          className="relative min-h-[50vh] flex flex-col justify-center -mt-[75px] md:-mt-20 pt-24 md:pt-28 pb-4 sm:pb-8 px-6 md:px-10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/hero-bg.png)",
          }}
        >
          {/* Overlay blu sopra l'immagine per leggibilità del copy */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            aria-hidden
            style={{
              background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.65))",
            }}
          />
          <div className="relative z-20 max-w-7xl mx-auto w-full pb-14 sm:pb-20 md:pb-28">
            {/* Header */}
            <motion.header
              variants={itemVariants}
              className="text-center mb-6 sm:mb-8"
            >
              <Link
                href="/"
                aria-label="Torna alla home di cambusaai"
                className="inline-block hover:opacity-90 transition-opacity mb-4 sm:mb-6"
              >
                <span className="text-2xl sm:text-3xl font-display font-bold text-white drop-shadow-md">
                  Cambusa<span className="text-primary-light">ai</span>
                </span>
              </Link>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4 sm:mb-6 drop-shadow-lg text-white leading-tight">
                La cambusa perfetta
                <br />
                per ogni viaggio
              </h1>

              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed px-2 drop-shadow-md mb-6 sm:mb-8"
                role="doc-subtitle"
              >
                Crea il menu perfetto per tutto l&apos;equipaggio con l&apos;aiuto
                dell&apos;intelligenza artificiale. Siete pronti a salpare? ⛵
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-3 sm:gap-4"
              >
                <CTA href="#main-content" variant="solid">
                  Inizia ora →
                </CTA>
                <CTA href="#how-it-works" variant="ghost">
                  Scopri di più
                </CTA>
              </motion.div>
            </motion.header>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mb-12 sm:mb-16 md:mb-20"
            >
              <FeaturesCarousel />
            </motion.div>
          </div>

          {/* Onda di separazione: forma più realistica e spazio sotto la hero */}
          <div className="absolute bottom-0 left-0 w-full leading-none z-10" aria-hidden>
            <svg
              viewBox="0 0 1440 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              className="w-full h-20 sm:h-28 md:h-36 block"
            >
              <path
                d="M0 50L48 45C96 40 192 30 288 35C384 40 480 60 576 65C672 70 768 60 864 50C960 40 1056 30 1152 35C1248 40 1344 60 1392 70L1440 80V100H0V50Z"
                fill="white"
              />
            </svg>
          </div>
        </motion.section>

        {/* Main Content Section */}
        <motion.section
          id="main-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative py-12 sm:py-16 md:py-20 px-6 md:px-10 max-w-7xl mx-auto bg-white"
          aria-label="Strumenti di pianificazione menu"
        >
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
