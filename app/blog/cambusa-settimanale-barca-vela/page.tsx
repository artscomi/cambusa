import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { BlogCta } from "../pasti-in-barca-cambusa/cta";

export const metadata: Metadata = {
  title:
    "Cambusa per una settimana in barca a vela: guida completa | Cambusa Online",
  description:
    "Scopri come organizzare la tua cambusa per una settimana in barca a vela. Consigli pratici e lista della spesa per una crociera senza pensieri su cambusa-online.com!",
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
          <li className="text-gray-700 font-semibold">Cambusa Settimanale</li>
        </ol>
      </nav>

      {/* Articolo */}
      <article className="prose prose-lg prose-blue dark:prose-invert">
        <h1>Cambusa per una Settimana in Barca a Vela: La Guida Definitiva</h1>

        <p className="mb-8">
          Organizzare la cambusa per una settimana in barca a vela richiede una
          pianificazione attenta. In questa guida ti forniremo tutti i consigli
          necessari per preparare una cambusa completa che ti permetterà di
          navigare serenamente per sette giorni, senza rinunciare al gusto e
          alla praticità.
        </p>

        {/* 1. Pianificazione della Cambusa */}
        <section className="mb-12">
          <h2>1. Pianificazione della Cambusa</h2>
          <p>
            Prima di tutto, è fondamentale pianificare i pasti settimanali.
            Considera il numero di persone a bordo, le preferenze alimentari e
            le eventuali intolleranze. Prepara un menu settimanale che includa
            colazioni, pranzi, cene e spuntini.
          </p>

          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <h3 className="text-xl font-semibold">Checklist Essenziale:</h3>
            <ul className="list-inside list-disc mt-4">
              <li>Numero di persone a bordo</li>
              <li>Durata della crociera</li>
              <li>Disponibilità di frigorifero</li>
              <li>Spazio di stivaggio</li>
              <li>Preferenze alimentari</li>
            </ul>
          </div>
        </section>

        {/* 2. Alimenti Base */}
        <section className="mb-12">
          <h2>2. Alimenti Base da Non Dimenticare</h2>
          <p>
            Questi alimenti costituiscono la base della tua cambusa settimanale.
            Sono versatili, duraturi e fondamentali per preparare pasti veloci e
            nutrienti.
          </p>

          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <h3 className="text-xl font-semibold">Lista Alimenti Base:</h3>
            <ul className="list-inside list-disc mt-4">
              <li>Pasta (500g)</li>
              <li>Riso (500g)</li>
              <li>Cous cous (300g)</li>
              <li>Farina (500g)</li>
              <li>Olio extravergine d&apos;oliva (1L)</li>
              <li>Sale e spezie varie</li>
              <li>Zucchero (300g)</li>
              <li>Caffè e tè</li>
            </ul>
          </div>
        </section>

        {/* 3. Proteine e Latticini */}
        <section className="mb-12">
          <h2>3. Proteine e Latticini</h2>
          <p>
            Le proteine sono essenziali per mantenere l&apos;energia durante la
            navigazione. Scegli prodotti che si conservano bene e che possono
            essere utilizzati in diversi modi.
          </p>

          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <h3 className="text-xl font-semibold">Lista Proteine:</h3>
            <ul className="list-inside list-disc mt-4">
              <li>Tonno in scatola (4 scatole)</li>
              <li>Salmone in scatola (2 scatole)</li>
              <li>Legumi in scatola (ceci, lenticchie, fagioli)</li>
              <li>Formaggi a lunga conservazione</li>
              <li>Uova (1 dozzina)</li>
              <li>Prosciutto crudo</li>
            </ul>
          </div>
        </section>

        {/* 4. Frutta e Verdura */}
        <section className="mb-12">
          <h2>4. Frutta e Verdura</h2>
          <p>
            Scegli frutta e verdura che si conservano bene e che possono essere
            consumate in diversi giorni. Preferisci prodotti di stagione e
            locali.
          </p>

          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <h3 className="text-xl font-semibold">Lista Frutta e Verdura:</h3>
            <ul className="list-inside list-disc mt-4">
              <li>Mele (1kg)</li>
              <li>Arance (1kg)</li>
              <li>Banane (1kg)</li>
              <li>Pomodori (500g)</li>
              <li>Zucchine (500g)</li>
              <li>Patate (1kg)</li>
              <li>Cipolle (500g)</li>
              <li>Carote (500g)</li>
            </ul>
          </div>
        </section>

        {/* 5. Snack e Bevande */}
        <section className="mb-12">
          <h2>5. Snack e Bevande</h2>
          <p>
            Gli snack sono fondamentali durante la navigazione. Scegli opzioni
            nutrienti e pratiche da consumare durante le tappe o le manovre.
          </p>

          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <h3 className="text-xl font-semibold">Lista Snack e Bevande:</h3>
            <ul className="list-inside list-disc mt-4">
              <li>Frutta secca mista (500g)</li>
              <li>Biscotti (2 pacchi)</li>
              <li>Barrette energetiche (10)</li>
              <li>Acqua (20L)</li>
              <li>Bevande isotoniche (6)</li>
              <li>Succhi di frutta (6)</li>
            </ul>
          </div>
        </section>

        <hr className="my-12" />

        {/* Sezione finale */}
        <section className="mb-8">
          <h2>Consigli per una Cambusa Efficiente</h2>
          <ul className="list-disc pl-5">
            <li>Organizza gli alimenti per tipo e data di scadenza</li>
            <li>Utilizza contenitori ermetici per la conservazione</li>
            <li>Pianifica i pasti in base alle condizioni meteo</li>
            <li>Mantieni un inventario aggiornato</li>
          </ul>

          <p className="mt-6 mb-12 text-center mt-16">
            Vuoi semplificare la gestione della tua cambusa? <br />
            <strong>
              {" "}
              Scopri come{" "}
              <a
                href="https://cambusa-online.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                cambusa-online.com
              </a>{" "}
              può aiutarti a creare il tuo piano pasti personalizzato! 🚤🍴
            </strong>
          </p>

          <BlogCta />
        </section>
      </article>
    </main>
  );
}
