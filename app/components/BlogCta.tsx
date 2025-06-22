"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface BlogCtaProps {
  title?: string;
  description?: string;
  ctaText?: string;
  linkText?: string;
  linkUrl?: string;
  emoji?: string;
}

export const BlogCta: React.FC<BlogCtaProps> = ({
  title = "Vuoi semplificare la gestione della tua cambusa?",
  description = "Scopri come",
  ctaText = "cambusaai",
  linkText = "può aiutarti a creare la cambusa perfetta!",
  linkUrl = "https://cambusa-online.com",
  emoji = "⛵🥑",
}) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mt-20 mb-16"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 blog-cta-background -z-10"></div>

      <div className="text-center max-w-4xl mx-auto">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full mb-6"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
        >
          {title}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
        >
          <strong className="text-primary">
            {description}{" "}
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-light transition-colors duration-300 decoration-2 underline-offset-4"
            >
              {ctaText}
            </a>{" "}
            {linkText}
          </strong>{" "}
          <span className="text-2xl">{emoji}</span>
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center"
        >
          <Button
            center
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <span>Genera il menu!</span>
            <ArrowRight size={20} />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
