"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import React from "react";

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
    <div className="mt-16 mb-12 text-center">
      <p className="text-lg mb-4">{title}</p>
      <p className="text-lg mb-12">
        <strong>
          {description}{" "}
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark transition-colors"
          >
            {ctaText}
          </a>{" "}
          {linkText} {emoji}
        </strong>
      </p>
      <Button center onClick={() => router.push("/")}>
        Genera il menu!
      </Button>
    </div>
  );
};
