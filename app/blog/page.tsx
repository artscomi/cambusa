// app/blog/page.tsx

import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { BlogCta } from "./pasti-in-barca/cta";

export const metadata: Metadata = {
  title: "Blog | Cambusa Online",
  description:
    "Esplora gli articoli e le idee per organizzare i tuoi pasti in barca.",
};

const articles = [
  {
    title: "Pasti veloci in barca: 5 idee pratiche per la tua cambusa",
    slug: "pasti-in-barca-cambusa",
    description:
      "Scopri 5 idee semplici per organizzare la tua cambusa in barca senza stress.",
  },
];

export default function BlogPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Blog</h1>

      {/* Elenco degli articoli */}
      <ul className="my-12">
        {articles.map((article) => (
          <li key={article.slug} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/blog/${article.slug}`} className="hover:underline">
                {article.title}
              </Link>
            </h2>
            <p>{article.description}</p>
          </li>
        ))}
      </ul>

      {/* Call to action */}
      <BlogCta />
    </main>
  );
}
