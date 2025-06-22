// app/blog/page.tsx

"use client";

import React from "react";
import Link from "next/link";
import { BlogCta } from "@/app/components/BlogCta";
import { motion, AnimatePresence } from "framer-motion";
import {
  blogContainerVariants,
  blogHeaderVariants,
  blogCardVariants,
  blogCtaVariants,
} from "@/animations/framer-variants";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

const articles = [
  {
    title:
      "Cibi Contro il Mal di Mare: Alimentazione per Navigare Senza Nausea",
    description:
      "Scopri quali cibi mangiare per prevenire il mal di mare e mantenere l'equilibrio durante la navigazione. Consigli pratici per una crociera senza nausea.",
    slug: "cibi-contro-mal-di-mare",
    date: "2024-03-21",
    readTime: "6 min",
    category: "Salute",
  },
  {
    title:
      "Come Organizzare una Cambusa Efficiente: Guida Completa per Evitare gli Sprechi",
    description:
      "Scopri i segreti per una gestione ottimale della cambusa in barca. Dalla pianificazione alla conservazione, impara a evitare gli sprechi e mantenere una dieta equilibrata durante la navigazione.",
    slug: "cambusa-efficiente",
    date: "2024-03-20",
    readTime: "5 min",
    image: "/basket.png",
    category: "Organizzazione",
  },
  {
    title: "Pasti veloci in barca: 5 idee pratiche per la tua cambusa",
    description:
      "Scopri come preparare pasti veloci e nutrienti in barca con ingredienti semplici e facilmente conservabili.",
    slug: "pasti-in-barca-cambusa",
    date: "2024-03-19",
    readTime: "4 min",
    category: "Ricette",
  },
  {
    title: "Cambusa per una settimana in barca a vela: la guida definitiva",
    slug: "cambusa-settimanale-barca-vela",
    description:
      "Una guida completa per organizzare la tua cambusa settimanale. Dalla pianificazione dei pasti alla lista della spesa, tutti i consigli per una crociera senza pensieri. Inclusi suggerimenti per la conservazione e la gestione degli spazi.",
    date: "2024-03-18",
    readTime: "8 min",
    category: "Guida",
  },
];

export default function BlogPage() {
  return (
    <AnimatePresence>
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          variants={blogHeaderVariants}
          initial="hidden"
          animate="visible"
          className="mb-16 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-primary">
            Blog
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Esplora i nostri articoli e scopri consigli utili per organizzare al
            meglio la tua cambusa in barca. Guide pratiche, ricette e
            suggerimenti per navigare con gusto e sicurezza.
          </motion.p>
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          variants={blogContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {articles.map((article, index) => (
            <motion.div
              key={article.slug}
              variants={blogCardVariants}
              className="group h-full"
            >
              <Link href={`/blog/${article.slug}`} className="block h-full">
                <article className="blog-card h-full flex flex-col">
                  {/* Card Header */}
                  <div className="blog-header-gradient p-6 relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="blog-category-badge">
                          {article.category}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
                        {article.title}
                      </h2>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                      {article.description}
                    </p>

                    {/* Card Footer */}
                    <div className="space-y-4 flex-shrink-0">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>
                              {new Date(article.date).toLocaleDateString(
                                "it-IT",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-primary font-medium transition-colors duration-300">
                          Leggi l'articolo
                        </span>
                        <ArrowRight
                          size={16}
                          className="text-primary transition-colors duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={blogCtaVariants}
          initial="hidden"
          animate="visible"
        >
          <BlogCta />
        </motion.div>
      </main>
    </AnimatePresence>
  );
}
