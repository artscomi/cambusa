"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChefHat, Users, Zap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Choice = {
  href: string;
  icon: LucideIcon;
  audience: string;
  title: string;
  description: string;
  cta: string;
  tone: "primary" | "accent";
  badge?: string;
};

/** Le tre strade della home: lista Express (la novità), menu con l'AI, gruppo. */
const CHOICES: Choice[] = [
  {
    href: "/express",
    icon: Zap,
    audience: "Senza registrazione",
    title: "Lista Express",
    description:
      "Una lista della spesa condivisa: ognuno aggiunge e vota i prodotti dal telefono.",
    cta: "Crea la lista",
    tone: "accent",
    badge: "Novità",
  },
  {
    href: "/menu/create",
    icon: ChefHat,
    audience: "Hai già le idee chiare",
    title: "Crea il tuo menu",
    description:
      "Indica giorni, pasti e preferenze: in un minuto hai il menu e la lista della spesa.",
    cta: "Crea il menu",
    tone: "primary",
  },
  {
    href: "/group/create-group",
    icon: Users,
    audience: "Per tutta la crew",
    title: "Crea un gruppo",
    description:
      "Ognuno indica gusti, allergie e preferenze: il menu terrà conto di tutti.",
    cta: "Crea un gruppo",
    tone: "primary",
  },
];

const tones = {
  primary: {
    icon: "bg-secondary text-primary",
    audience: "text-primary",
    button: "bg-primary hover:bg-primary-light",
    border: "hover:border-primary/40",
  },
  accent: {
    icon: "bg-pink-50 text-accent",
    audience: "text-accent",
    button: "bg-accent hover:bg-accent-light",
    border: "border-accent-40 hover:border-accent",
  },
};

export function HomeChoiceCards() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
      {CHOICES.map((choice) => {
        const t = tones[choice.tone];
        const Icon = choice.icon;
        return (
          <motion.div
            key={choice.href}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="h-full"
          >
            <Link
              href={choice.href}
              className={cn(
                "group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(13,32,49,0.08)] sm:p-7",
                t.border,
              )}
            >
              {choice.badge && (
                <span className="absolute right-5 top-5 rounded-full bg-accent px-2.5 py-1 font-subtitle text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                  {choice.badge}
                </span>
              )}
              <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl", t.icon)}>
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <span
                className={cn(
                  "mt-5 font-subtitle text-[11px] font-bold uppercase tracking-[0.18em]",
                  t.audience,
                )}
              >
                {choice.audience}
              </span>
              <span className="mt-1.5 font-display text-2xl font-bold text-gray-900">
                {choice.title}
              </span>
              <span className="mt-2 flex-1 text-base leading-relaxed text-gray-600">
                {choice.description}
              </span>
              <span
                className={cn(
                  "mt-6 inline-flex items-center justify-center gap-2 self-start rounded-full px-5 py-2.5 font-semibold text-white transition-colors",
                  t.button,
                )}
              >
                {choice.cta}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
