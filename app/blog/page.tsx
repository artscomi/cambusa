// app/blog/page.tsx

import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { BlogCta } from "../components/BlogCta";

export const metadata: Metadata = {
  title: "Blog - CambusaAI",
  description: "Consigli e guide per la gestione della cambusa in barca",
};

const articles = [
  {
    title:
      "Come Organizzare una Cambusa Efficiente: Guida Completa per Evitare gli Sprechi",
    description:
      "Scopri i segreti per una gestione ottimale della cambusa in barca. Dalla pianificazione alla conservazione, impara a evitare gli sprechi e mantenere una dieta equilibrata durante la navigazione.",
    slug: "cambusa-efficiente",
    date: "2024-03-20",
    readTime: "5 min",
    image: "/basket.png",
  },
  {
    title: "Pasti veloci in barca: 5 idee pratiche per la tua cambusa",
    description:
      "Scopri come preparare pasti veloci e nutrienti in barca con ingredienti semplici e facilmente conservabili.",
    slug: "pasti-in-barca-cambusa",
  },
  {
    title: "Cambusa per una settimana in barca a vela: la guida definitiva",
    slug: "cambusa-settimanale-barca-vela",
    description:
      "Una guida completa per organizzare la tua cambusa settimanale. Dalla pianificazione dei pasti alla lista della spesa, tutti i consigli per una crociera senza pensieri. Inclusi suggerimenti per la conservazione e la gestione degli spazi.",
  },
];

export default function BlogPage() {
  return (
    <main className="max-w-[1024px] mx-auto">
      <div className="mb-12">
        <h1 className="text-6xl font-display font-bold mb-4">Blog</h1>
        <p className="text-base lg:text-xl text-left text-pretty font-subtitle text-gray-700">
          Esplora i nostri articoli e scopri consigli utili per organizzare al
          meglio la tua cambusa in barca
        </p>
      </div>

      {/* Elenco degli articoli */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="block"
          >
            <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] h-full flex flex-col">
              <div className="bg-primary p-6 rounded-t-lg">
                <h2 className="text-2xl font-bold text-white">
                  {article.title}
                </h2>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-gray-700 font-subtitle text-base leading-relaxed mb-6">
                  {article.description}
                </p>
                <div className="mt-auto flex justify-end">
                  <span className="text-accent font-medium hover:text-accent/80 transition-colors duration-200">
                    Leggi di più →
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <BlogCta />
      </div>
    </main>
  );
}
