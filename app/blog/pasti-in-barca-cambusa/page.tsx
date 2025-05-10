// app/blog/pasti-in-barca/page.tsx

import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import { BlogCta } from "@/app/components/BlogCta";

export const metadata: Metadata = {
  title: "Pasti veloci in barca: 5 idee pratiche | Cambusa Online",
  description:
    "Scopri 5 idee semplici per organizzare la tua cambusa in barca senza stress. Pianifica la tua cambusa in pochi click su cambusa-online.com!",
};

export default function BlogPost() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex space-x-2">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-700 font-semibold">Pasti in Barca</li>
        </ol>
      </nav>

      {/* Articolo */}
      <article className="prose prose-lg prose-blue dark:prose-invert">
        <h1>
          5 Idee Veloci per Pasti in Barca: Semplici, Gustosi e Senza Stress
        </h1>

        <div className="mt-6 mb-8">
          <Image
            src="/images/blog/pasti-veloci-in-barca.png"
            alt="cambusa in barca- pranzo in navigazione"
            width={1152}
            height={768}
            className="rounded-2xl shadow-md object-cover w-full h-auto"
            priority
          />
        </div>

        <p className="mb-8">
          Organizzare i pasti in barca può sembrare complicato, ma con un
          po&apos; di pianificazione diventa un piacere! In questo articolo ti
          proponiamo
          <strong> 5 idee rapide </strong> per mangiare bene anche quando sei a
          bordo, senza bisogno di forno né di ricette elaborate.
        </p>

        {/* 1. Insalata di Riso Mediterranea */}
        <section className="mb-12">
          <h2>1. Insalata di Riso Mediterranea</h2>
          {/* <div className="mt-4 mb-6">
            <Image
              src="/images/blog/insalata-di-riso.png"
              alt="Insalata di Riso Mediterranea"
              width={800}
              height={600}
              className="rounded-xl shadow object-cover w-full h-auto"
            />
          </div> */}
          <p>
            Un grande classico intramontabile. Prepara il riso in anticipo,
            condisci con tonno, olive nere, pomodorini, mais e un filo
            d&apos;olio extravergine d&apos;oliva. Si conserva facilmente e si
            adatta a qualsiasi pranzo veloce in navigazione.
          </p>
          <p className="italic">
            Consiglio in più: aggiungi cubetti di feta per una marcia in più!
          </p>

          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <h3 className="text-xl font-semibold">Ricetta:</h3>
            <ul className="list-inside list-disc mt-4">
              <li>200g di riso</li>
              <li>1 scatola di tonno sott&apos;olio</li>
              <li>100g di olive nere</li>
              <li>100g di pomodorini</li>
              <li>100g di mais</li>
              <li>4 cucchiai di olio extravergine d&apos;oliva</li>
              <li>Sale e pepe q.b.</li>
              <li>Feta (opzionale)</li>
            </ul>
            <h4 className="font-semibold mt-4">Preparazione:</h4>
            <ol className="list-decimal pl-5">
              <li>Cuoci il riso in acqua salata e lascia raffreddare.</li>
              <li>Unisci il tonno, le olive, i pomodorini e il mais.</li>
              <li>
                Condire con olio, sale e pepe, e aggiungi la feta (opzionale).
              </li>
            </ol>
          </div>
        </section>

        {/* 2. Piadine Farcite */}
        <section className="mb-12">
          <h2>2. Piadine Farcite</h2>
          {/* <div className="mt-4 mb-6">
            <Image
              src="/images/blog/piadine-farcite.png"
              alt="Piadine farcite in barca"
              width={800}
              height={600}
              className="rounded-xl shadow object-cover w-full h-auto"
            />
          </div> */}
          <p>
            Le piadine sono pratiche, versatili e non occupano spazio. Porta a
            bordo un po&apos; di formaggio spalmabile, prosciutto crudo,
            insalata e pomodori a fette. In pochi minuti avrai un pranzo
            sfizioso e senza bisogno di cucinare.
          </p>
          <p className="italic">
            Idea bonus: scaldale brevemente su una padella antiaderente per
            renderle ancora più buone.
          </p>

          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <h3 className="text-xl font-semibold">Ricetta:</h3>
            <ul className="list-inside list-disc mt-4">
              <li>4 piadine</li>
              <li>100g di formaggio spalmabile</li>
              <li>100g di prosciutto crudo</li>
              <li>Insalata mista</li>
              <li>2 pomodori</li>
            </ul>
            <h4 className="font-semibold mt-4">Preparazione:</h4>
            <ol className="list-decimal pl-5">
              <li>Spalma il formaggio sulle piadine.</li>
              <li>Aggiungi prosciutto, insalata e pomodori.</li>
              <li>Scalda in padella per una versione più croccante.</li>
            </ol>
          </div>
        </section>

        {/* 3. Cous Cous Freddo */}
        <section className="mb-12">
          <h2>3. Cous Cous Freddo</h2>
          {/* <div className="mt-4 mb-6">
            <Image
              src="/images/blog/cous-cous-freddo.png"
              alt="Cous cous freddo per barca"
              width={800}
              height={600}
              className="rounded-xl shadow object-cover w-full h-auto"
            />
          </div> */}
          <p>
            Basta un po&apos; d&apos;acqua calda per prepararlo! Condisci il
            cous cous con verdure grigliate, ceci, menta fresca e limone. È
            leggero, nutriente e perfetto anche sotto il sole.
          </p>

          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <h3 className="text-xl font-semibold">Ricetta:</h3>
            <ul className="list-inside list-disc mt-4">
              <li>200g di cous cous</li>
              <li>1 zucchina</li>
              <li>1 peperone</li>
              <li>100g di ceci cotti</li>
              <li>Menta fresca</li>
              <li>Succo di 1 limone</li>
              <li>Olio extravergine d&apos;oliva</li>
              <li>Sale e pepe q.b.</li>
            </ul>
            <h4 className="font-semibold mt-4">Preparazione:</h4>
            <ol className="list-decimal pl-5">
              <li>Prepara il cous cous con acqua calda e sgranalo.</li>
              <li>Griglia zucchina e peperone tagliati a cubetti.</li>
              <li>Unisci cous cous, verdure, ceci e menta.</li>
              <li>Condire con limone, olio, sale e pepe.</li>
            </ol>
          </div>
        </section>

        {/* 4. Tortillas con Verdure e Tonno */}
        <section className="mb-12">
          <h2>4. Tortillas con Verdure e Tonno</h2>
          {/* <div className="mt-4 mb-6">
            <Image
              src="/images/blog/tortillas-tonno.png"
              alt="Tortillas tonno e verdure"
              width={800}
              height={600}
              className="rounded-xl shadow object-cover w-full h-auto"
            />
          </div> */}
          <p>
            Le tortillas di grano sono ideali da farcire al volo. Tonno
            sgocciolato, mais, insalata croccante e maionese leggera: arrotola e
            il gioco è fatto!
          </p>

          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <h3 className="text-xl font-semibold">Ricetta:</h3>
            <ul className="list-inside list-disc mt-4">
              <li>4 tortillas di grano</li>
              <li>1 scatola di tonno sott&apos;olio</li>
              <li>100g di mais</li>
              <li>Insalata mista</li>
              <li>2 cucchiai di maionese leggera</li>
            </ul>
            <h4 className="font-semibold mt-4">Preparazione:</h4>
            <ol className="list-decimal pl-5">
              <li>Unisci tonno, mais, insalata e maionese.</li>
              <li>Farcisci le tortillas e arrotolale.</li>
            </ol>
          </div>
        </section>

        {/* 5. Frutta Fresca e Fette Biscottate */}
        <section className="mb-12">
          <h2>5. Frutta Fresca e Fette Biscottate</h2>
          {/* <div className="mt-4 mb-6">
            <Image
              src="/images/blog/frutta-fette-biscottate.png"
              alt="Colazione in barca: frutta e fette biscottate"
              width={800}
              height={600}
              className="rounded-xl shadow object-cover w-full h-auto"
            />
          </div> */}
          <p>
            Non dimenticare le colazioni: fette biscottate, marmellata e frutta
            fresca sono perfetti per iniziare la giornata senza appesantirti.
          </p>

          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <h3 className="text-xl font-semibold">Ricetta:</h3>
            <ul className="list-inside list-disc mt-4">
              <li>Fette biscottate</li>
              <li>Marmellata a piacere</li>
              <li>Frutta fresca (mela, banana, agrumi)</li>
            </ul>
            <h4 className="font-semibold mt-4">Preparazione:</h4>
            <ol className="list-decimal pl-5">
              <li>Spalma la marmellata sulle fette biscottate.</li>
              <li>Aggiungi frutta fresca a piacere.</li>
            </ol>
          </div>
        </section>

        <hr className="my-12" />

        {/* Sezione finale */}
        <section className="mb-8">
          <h2>Perché pianificare i pasti in barca?</h2>
          <ul className="list-disc pl-5">
            <li>Risparmi spazio e tempo</li>
            <li>Eviti sprechi di cibo</li>
            <li>Vivi la navigazione senza pensieri</li>
          </ul>

          <BlogCta />
        </section>
      </article>
    </main>
  );
}
