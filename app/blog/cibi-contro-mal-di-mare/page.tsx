import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import { BlogCta } from "@/app/components/BlogCta";

export const metadata: Metadata = {
  title:
    "Cibi Contro il Mal di Mare: Alimentazione per Navigare Senza Nausea | CambusaAI",
  description:
    "Scopri quali cibi mangiare per prevenire il mal di mare e mantenere l'equilibrio durante la navigazione. Consigli pratici per una crociera senza nausea su cambusa-ai.com!",
};

export default function CibiControMalDiMare() {
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
          <li className="text-gray-700 font-semibold">
            Cibi Contro il Mal di Mare
          </li>
        </ol>
      </nav>

      {/* Articolo */}
      <article className="prose prose-lg prose-blue dark:prose-invert">
        <h1>
          Cibi Contro il Mal di Mare: Alimentazione per Navigare Senza Nausea
        </h1>

        <p className="mb-8">
          Il mal di mare può rovinare anche la più bella delle crociere. Ma
          sapevi che l'alimentazione gioca un ruolo fondamentale nella
          prevenzione di questo fastidioso disturbo? Che tu stia pianificando
          una <strong>cambusa per una settimana in barca</strong> o una
          traversata più breve, conoscere i cibi giusti può fare la differenza
          tra una navigazione serena e un'esperienza da dimenticare.
        </p>

        {/* 1. Principi Base */}
        <section className="mb-12">
          <h2>1. Principi Base dell'Alimentazione Anti-Nausea</h2>
          <p>
            Prima di tutto, è importante capire come funziona il mal di mare e
            come l'alimentazione può aiutare a prevenirlo. Il nostro apparato
            digerente è strettamente collegato al sistema vestibolare,
            responsabile dell'equilibrio:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Stomaco leggero:</strong> Evita pasti pesanti e ricchi
                di grassi che rallentano la digestione e aumentano il rischio di
                nausea
              </li>
              <li>
                <strong>Idratazione costante:</strong> Bevi piccole quantità di
                acqua frequentemente per mantenere l'equilibrio idrico senza
                sovraccaricare lo stomaco
              </li>
              <li>
                <strong>Frequenza dei pasti:</strong> Preferisci piccoli
                spuntini frequenti invece di pasti abbondanti per mantenere
                stabili i livelli di zucchero nel sangue
              </li>
              <li>
                <strong>Digestione facile:</strong> Scegli cibi che si
                digeriscono rapidamente e non richiedono un grande sforzo
                digestivo
              </li>
            </ul>
          </div>
        </section>

        {/* 2. Cibi Consigliati */}
        <section className="mb-12">
          <h2>2. Cibi Consigliati: La Tua Arma Segreta</h2>
          <p>
            Alcuni alimenti sono particolarmente efficaci nel prevenire e
            alleviare il mal di mare. Ecco i migliori alleati per la tua cambusa
            barca a vela:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Zenzero:</strong> Il rimedio naturale più efficace. Puoi
                portarlo fresco, in polvere, candito o in tisane. Lo zenzero
                calma lo stomaco e riduce la nausea
              </li>
              <li>
                <strong>Crackers e gallette:</strong> Alimenti secchi e neutri
                che assorbono l'acidità gastrica e forniscono energia senza
                appesantire
              </li>
              <li>
                <strong>Banane:</strong> Ricche di potassio, aiutano a mantenere
                l'equilibrio elettrolitico e sono facilmente digeribili
              </li>
              <li>
                <strong>Mele:</strong> Contengono pectina che aiuta a
                stabilizzare lo stomaco e forniscono fibre solubili
              </li>
              <li>
                <strong>Riso bianco:</strong> Facilmente digeribile e neutro,
                perfetto per pasti leggeri durante la navigazione
              </li>
              <li>
                <strong>Pollo bollito:</strong> Proteine magre che non
                appesantiscono e forniscono energia sostenuta
              </li>
            </ul>
          </div>
        </section>

        {/* Consiglio Rapido */}
        <div className="bg-accent-5 p-6 rounded-xl my-8">
          <h3 className="text-xl font-semibold mb-2">💡 Consiglio Rapido</h3>
          <p>
            Prepara una "scatola anti-nausea" nella tua cambusa con zenzero
            candito, crackers, tisane e caramelle allo zenzero. Avere questi
            rimedi sempre a portata di mano può salvare la tua crociera!
          </p>
        </div>

        {/* 3. Cibi da Evitare */}
        <section className="mb-12">
          <h2>3. Cibi da Evitare Assolutamente</h2>
          <p>
            Così come alcuni alimenti aiutano, altri possono peggiorare
            significativamente il mal di mare. Per una cambusa per una settimana
            in barca sicura, evita questi cibi:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Cibi grassi e fritti:</strong> Hamburger, patatine
                fritte, cibi elaborati rallentano la digestione e aumentano il
                rischio di nausea
              </li>
              <li>
                <strong>Latticini pesanti:</strong> Formaggi stagionati, panna,
                burro possono risultare difficili da digerire in mare
              </li>
              <li>
                <strong>Alcolici:</strong> Disidratano e peggiorano i sintomi
                del mal di mare, oltre a compromettere l'equilibrio
              </li>
              <li>
                <strong>Cibi piccanti:</strong> Irritano lo stomaco e possono
                causare acidità, aggravando la nausea
              </li>
              <li>
                <strong>Bevande gassate:</strong> Aumentano la sensazione di
                gonfiore e possono causare reflusso
              </li>
              <li>
                <strong>Cibi molto salati:</strong> Aumentano la disidratazione
                e possono peggiorare i sintomi
              </li>
            </ul>
          </div>
        </section>

        {/* 4. Timing dei Pasti */}
        <section className="mb-12">
          <h2>4. Timing dei Pasti: Quando Mangiare</h2>
          <p>
            Non solo cosa mangi, ma anche quando mangi è fondamentale per
            prevenire il mal di mare. Ecco la strategia temporale ottimale:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>2-3 ore prima della partenza:</strong> Fai un pasto
                leggero ma nutriente (es. riso con verdure e una piccola
                porzione di proteine)
              </li>
              <li>
                <strong>Durante la navigazione:</strong> Mangia piccoli spuntini
                ogni 2-3 ore per mantenere stabili i livelli di zucchero
              </li>
              <li>
                <strong>In caso di mare mosso:</strong> Riduci ulteriormente le
                porzioni e aumenta la frequenza degli spuntini
              </li>
              <li>
                <strong>Prima di dormire:</strong> Un piccolo spuntino leggero
                (crackers e tisana) può aiutare a prevenire la nausea notturna
              </li>
            </ul>
          </div>
        </section>

        {/* Sostenibilità */}
        <div className="bg-green-50 p-6 rounded-xl border border-green-100 my-8">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            🌊 Navigazione Responsabile
          </h3>
          <p className="text-green-900">
            Scegliere cibi anti-nausea non solo ti aiuta a stare meglio, ma
            contribuisce anche a una navigazione più sostenibile. Cibi freschi,
            locali e stagionali riducono l'impatto ambientale e supportano le
            comunità costiere.
          </p>
        </div>

        {/* 5. Rimedi Naturali */}
        <section className="mb-12">
          <h2>5. Rimedi Naturali da Includere nella Cambusa</h2>
          <p>
            Oltre ai cibi, alcuni rimedi naturali possono essere molto efficaci.
            Assicurati di includere questi elementi nella tua cambusa barca a
            vela:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Tisane:</strong> Camomilla, menta piperita, zenzero e
                limone sono ottime per calmare lo stomaco
              </li>
              <li>
                <strong>Oli essenziali:</strong> Menta piperita e zenzero
                possono essere inalati per alleviare la nausea
              </li>
              <li>
                <strong>Acupressione:</strong> Impara a massaggiare il punto P6
                (tre dita sopra il polso) per alleviare la nausea
              </li>
              <li>
                <strong>Respirazione:</strong> Tecniche di respirazione profonda
                possono aiutare a controllare la nausea
              </li>
            </ul>
          </div>
        </section>

        {/* 6. Menu Tipo per una Giornata */}
        <section className="mb-12">
          <h2>6. Menu Tipo per una Giornata in Mare</h2>
          <p>
            Ecco un esempio pratico di come strutturare l'alimentazione durante
            una giornata di navigazione:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">
                  Colazione (2 ore prima della partenza)
                </h4>
                <p>
                  • Tisana allo zenzero
                  <br />
                  • 2-3 crackers integrali
                  <br />
                  • 1 banana
                  <br />• 1 cucchiaino di miele
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg">
                  Spuntino mattutino (ogni 2 ore)
                </h4>
                <p>
                  • Gallette di riso
                  <br />
                  • Zenzero candito
                  <br />• Acqua naturale
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Pranzo leggero</h4>
                <p>
                  • Riso bianco bollito
                  <br />
                  • Verdure al vapore (carote, zucchine)
                  <br />
                  • Piccola porzione di pollo bollito
                  <br />• Tisana alla camomilla
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Spuntino pomeridiano</h4>
                <p>
                  • 1 mela
                  <br />
                  • Crackers secchi
                  <br />• Acqua con limone
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Cena</h4>
                <p>
                  • Minestra di verdure leggera
                  <br />
                  • Riso o pasta in bianco
                  <br />• Tisana alla menta
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Preparazione della Cambusa */}
        <section className="mb-12">
          <h2>7. Preparazione della Cambusa Anti-Nausea</h2>
          <p>
            Organizzare la cambusa con cibi anti-nausea richiede una
            pianificazione attenta. Ecco come preparare al meglio la tua cambusa
            per una settimana in barca:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Scorte di emergenza:</strong> Mantieni sempre scorte di
                crackers, zenzero e tisane per situazioni di emergenza
              </li>
              <li>
                <strong>Varietà:</strong> Includi diversi tipi di cibi
                anti-nausea per evitare la monotonia e mantenere l'appetito
              </li>
              <li>
                <strong>Conservazione:</strong> Assicurati che tutti i cibi
                siano ben conservati in contenitori ermetici per mantenere la
                freschezza
              </li>
              <li>
                <strong>Accessibilità:</strong> Posiziona i cibi anti-nausea in
                luoghi facilmente accessibili per emergenze
              </li>
            </ul>
          </div>
        </section>

        {/* Conclusione */}
        <section className="mb-12">
          <h2>Conclusione</h2>
          <p>
            Prevenire il mal di mare attraverso l'alimentazione è possibile e
            può trasformare completamente la tua esperienza di navigazione.
            Ricorda che ogni persona è diversa: prova diversi cibi e rimedi per
            trovare quelli che funzionano meglio per te.
          </p>
          <p>
            Una cambusa ben organizzata con cibi anti-nausea non solo ti aiuterà
            a evitare la nausea, ma contribuirà anche a una navigazione più
            piacevole e sicura. Pianifica con attenzione, sperimenta e goditi il
            mare senza preoccupazioni!
          </p>
        </section>

        {/* Call to Action */}
        <div className="bg-primary text-white p-6 rounded-xl my-8">
          <h3 className="text-xl font-semibold mb-2">
            🚢 Pronto per la Tua Prossima Crociera?
          </h3>
          <p className="mb-4">
            Ora che sai come organizzare una cambusa anti-nausea, scopri come
            ottimizzare completamente la tua cambusa per una settimana in barca.
          </p>
          <Link
            href="/blog/cambusa-settimanale-barca-vela"
            className="inline-block bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Leggi la Guida Completa →
          </Link>
        </div>
      </article>

      <div className="mt-12">
        <BlogCta />
      </div>
    </main>
  );
}
