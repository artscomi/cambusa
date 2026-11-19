import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { BlogCta } from "@/app/components/BlogCta";
import { PageContainer } from "@/components/PageContainer";

export const metadata: Metadata = {
  title:
    "Lista della Spesa Condivisa per la Barca: Come Funziona Cambusa Express | Cambusa Online",
  description:
    "Organizza la cambusa con tutta la crew: crea una lista della spesa condivisa in 30 secondi, ognuno aggiunge e vota i prodotti dal telefono. Gratis e senza registrazione.",
};

export default function ListaSpesaCondivisaBarca() {
  return (
    <main>
      <PageContainer narrow>
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
          <li className="text-gray-700 font-semibold">Cambusa Express</li>
        </ol>
      </nav>

      {/* Articolo */}
      <article className="prose prose-lg prose-blue dark:prose-invert">
        <h1>
          Lista della Spesa Condivisa per la Barca: Come Organizzare la
          Cambusa con Tutta la Crew
        </h1>

        <p className="mb-8">
          &quot;Chi porta la Nutella?&quot;, &quot;Ricordatevi che sono
          vegetariana!&quot;, &quot;Il caffè lo compra qualcuno?&quot;. Se hai
          mai organizzato una crociera con gli amici conosci bene la chat di
          gruppo prima della partenza: decine di messaggi, idee che si perdono
          e alla fine una sola persona che deve mettere tutto insieme. Per
          questo abbiamo creato <strong>Cambusa Express</strong>, una{" "}
          <strong>lista della spesa condivisa</strong> pensata per la barca,
          che si prepara insieme alla crew in pochi minuti.
        </p>

        {/* 1. Il problema */}
        <section className="mb-12">
          <h2>1. Perché la Cambusa in Gruppo è Così Complicata</h2>
          <p>
            Organizzare una cambusa per una settimana in barca non è difficile
            in sé. Diventa complicato quando a bordo siete in sei, ognuno con i
            suoi gusti e le sue abitudini. I problemi sono sempre gli stessi:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Informazioni sparse:</strong> le richieste arrivano in
                chat, a voce o per messaggio privato e qualcosa si perde sempre
              </li>
              <li>
                <strong>Doppioni e mancanze:</strong> tre pacchi di caffè e
                nemmeno uno di zucchero, perché nessuno sapeva cosa avevano già
                preso gli altri
              </li>
              <li>
                <strong>Tutto sulle spalle di uno:</strong> chi organizza deve
                raccogliere le preferenze, scrivere la lista e decidere per
                tutti
              </li>
              <li>
                <strong>Gusti diversi:</strong> senza un modo semplice per
                capire cosa piace alla maggioranza, si finisce per comprare
                troppo o le cose sbagliate
              </li>
            </ul>
          </div>
        </section>

        {/* 2. Cos'è */}
        <section className="mb-12">
          <h2>2. Cos&apos;è Cambusa Express</h2>
          <p>
            Cambusa Express è una lista della spesa condivisa per la barca:
            la crei tu, la mandi alla crew e ognuno la completa dal proprio
            telefono. Ecco cosa la rende diversa da una semplice nota
            condivisa:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Nessuna registrazione:</strong> né tu né i tuoi
                compagni di viaggio dovete creare un account. Basta scrivere il
                proprio nome
              </li>
              <li>
                <strong>Voti per ogni prodotto:</strong> ognuno può dare un 👍
                o un 👎 alle proposte degli altri, così vince quello che piace a
                tutti
              </li>
              <li>
                <strong>Divisa per reparto:</strong> i prodotti si organizzano
                da soli in frutta e verdura, dispensa, bevande, latticini e così
                via, come al supermercato
              </li>
              <li>
                <strong>Sempre aggiornata:</strong> quello che aggiunge un
                membro della crew compare sui telefoni di tutti dopo pochi
                secondi
              </li>
            </ul>
          </div>
        </section>

        {/* Consiglio Rapido */}
        <div className="bg-accent-5 p-6 rounded-xl my-8">
          <h3 className="text-xl font-semibold mb-2">💡 Consiglio Rapido</h3>
          <p>
            Crea la lista appena avete fissato la data della crociera e mandala
            subito nel gruppo WhatsApp. Lasciate qualche giorno a tutti per
            aggiungere e votare: quando arriva il momento della spesa, la lista
            sarà già pronta e condivisa.
          </p>
        </div>

        {/* 3. Come funziona */}
        <section className="mb-12">
          <h2>3. Come Funziona, Passo per Passo</h2>
          <p>
            Usare Cambusa Express richiede meno tempo che scrivere un messaggio
            nel gruppo. Bastano quattro passaggi:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Crea la lista:</strong> vai su{" "}
                <Link href="/express">Cambusa Express</Link>, scrivi il nome
                della crociera (per esempio &quot;Eolie agosto&quot;), il tuo
                nome e, se vuoi, quante persone siete
              </li>
              <li>
                <strong>Condividi il link:</strong> con il pulsante
                &quot;Invia su WhatsApp&quot; mandi il link nel gruppo della
                crew con un messaggio già pronto
              </li>
              <li>
                <strong>Aggiungete i prodotti:</strong> ognuno scrive quello
                che vuole a bordo. Puoi aggiungerne più di uno alla volta
                separandoli con una virgola: &quot;pomodori, birra x24,
                Nutella&quot;
              </li>
              <li>
                <strong>Votate le proposte:</strong> un 👍 a quello che vuoi
                anche tu, un 👎 a quello che non serve. I prodotti più votati
                salgono in cima a ogni reparto
              </li>
            </ul>
          </div>
        </section>

        {/* Sostenibilità */}
        <div className="bg-green-50 p-6 rounded-xl border border-green-100 my-8">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            🌱 Sostenibilità
          </h3>
          <p className="text-green-900">
            Una lista decisa insieme significa comprare solo quello che serve
            davvero. Niente doppioni, meno cibo buttato a fine crociera e meno
            rifiuti da gestire a bordo: un piccolo gesto che fa bene al mare.
          </p>
        </div>

        {/* 4. Al supermercato */}
        <section className="mb-12">
          <h2>4. Al Supermercato: la Lista Lavora per Te</h2>
          <p>
            Il giorno della spesa, Cambusa Express diventa la tua lista da
            spuntare. Ecco come vi aiuta a fare tutto in fretta:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Spunta mentre compri:</strong> tocca il quadratino
                accanto al prodotto e finisce tra i &quot;Già presi&quot;
              </li>
              <li>
                <strong>Dividetevi i reparti:</strong> se siete in due o tre al
                supermercato, ognuno vede in tempo reale cosa hanno già preso
                gli altri
              </li>
              <li>
                <strong>Niente doppioni:</strong> se qualcuno prova ad
                aggiungere un prodotto che c&apos;è già, la lista non lo
                duplica ma aggiunge il suo voto
              </li>
              <li>
                <strong>Tutto sotto controllo:</strong> in cima alla lista vedi
                quanti prodotti restano da comprare e quanti sono già nel
                carrello
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Consigli */}
        <section className="mb-12">
          <h2>5. Consigli per una Lista Condivisa Perfetta</h2>
          <p>
            Qualche accorgimento per ottenere il massimo dalla vostra lista
            della spesa condivisa:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Scrivi le quantità:</strong> &quot;acqua 6 casse&quot; o
                &quot;pasta 3 kg&quot; è molto più utile di &quot;acqua&quot; e
                &quot;pasta&quot;
              </li>
              <li>
                <strong>Segnala allergie e intolleranze:</strong> aggiungi
                prodotti specifici come &quot;pasta senza glutine per
                Marco&quot;, così nessuno se ne dimentica
              </li>
              <li>
                <strong>Parti dalla base:</strong> usa i suggerimenti rapidi
                (acqua, pane, pasta, caffè, uova) per non dimenticare gli
                essenziali
              </li>
              <li>
                <strong>Fissa una scadenza:</strong> chiedi alla crew di
                completare la lista entro un giorno preciso prima della spesa
              </li>
              <li>
                <strong>Pensa anche alla barca:</strong> carta da cucina,
                sacchetti per i rifiuti, detersivo e crema solare fanno parte
                della cambusa tanto quanto il cibo
              </li>
            </ul>
          </div>
        </section>

        {/* Invito a provare */}
        <div className="not-prose my-10 rounded-2xl border border-accent-40 bg-gradient-to-br from-accent/10 via-white to-accent-light/15 p-6 text-center sm:p-8">
          <p className="font-subtitle text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            Gratis e senza registrazione
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            Crea la lista della tua crew in 30 secondi
          </p>
          <Link
            href="/express"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-light"
          >
            Prova Cambusa Express →
          </Link>
        </div>

        {/* Sezione finale */}
        <section className="mb-8">
          <h2>Perché usare una lista della spesa condivisa in barca?</h2>
          <ul className="list-disc pl-5 mt-0">
            <li>Ognuno dice la sua, senza perdersi nella chat di gruppo</li>
            <li>Comprate solo quello che piace alla crew, senza doppioni</li>
            <li>
              Chi organizza non deve più fare tutto da solo: la cambusa la
              decide tutta la crew
            </li>
          </ul>

          <BlogCta />
        </section>
      </article>
      </PageContainer>
    </main>
  );
}
