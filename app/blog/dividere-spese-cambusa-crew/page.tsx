import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { BlogCta } from "@/app/components/BlogCta";
import { PageContainer } from "@/components/PageContainer";

export const metadata: Metadata = {
  title:
    "Come Dividere le Spese della Cambusa con la Crew: Guida Pratica | Cambusa Online",
  description:
    "Cassa comune, app per le spese o conto finale? I metodi per dividere la spesa in barca senza discussioni, cosa mettere in comune e come gestire i casi delicati.",
};

export default function DividereSpeseCambusaCrew() {
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
          <li className="text-gray-700 font-semibold">Dividere le spese</li>
        </ol>
      </nav>

      {/* Articolo */}
      <article className="prose prose-lg prose-blue dark:prose-invert">
        <h1>
          Come Dividere le Spese della Cambusa con la Crew (Senza
          Discussioni)
        </h1>

        <p className="mb-8">
          La settimana in barca è finita, siete tutti abbronzati e felici, e
          poi arriva il momento degli scontrini. &quot;Ma il vino lo abbiamo
          bevuto solo noi tre&quot;, &quot;Io sono arrivata martedì&quot;,
          &quot;Chi ha pagato il ghiaccio?&quot;. I soldi sono l&apos;argomento
          che rovina più facilmente l&apos;atmosfera a bordo. La buona notizia
          è che basta mettersi d&apos;accordo <strong>prima di partire</strong>{" "}
          su poche regole semplici. In questa guida trovi i metodi più usati
          dalle crew e i consigli per gestire i casi delicati.
        </p>

        {/* 1. Prima regola */}
        <section className="mb-12">
          <h2>1. La Regola d&apos;Oro: Decidere Prima di Partire</h2>
          <p>
            Quasi tutte le discussioni nascono da aspettative diverse, non dai
            soldi in sé. Bastano dieci minuti nel gruppo WhatsApp, qualche
            settimana prima, per chiarire:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Cosa entra nella cassa comune:</strong> solo la
                cambusa, oppure anche gasolio, ormeggi e cene a terra
              </li>
              <li>
                <strong>Come si divide:</strong> in parti uguali, oppure in
                base ai giorni a bordo o a cosa consuma ognuno
              </li>
              <li>
                <strong>Chi tiene i conti:</strong> una persona sola, oppure
                un&apos;app che vedono tutti
              </li>
              <li>
                <strong>Quando si salda:</strong> subito alla fine della
                crociera, prima che i ricordi (e gli scontrini) si perdano
              </li>
            </ul>
          </div>
        </section>

        {/* 2. Metodi */}
        <section className="mb-12">
          <h2>2. Tre Metodi per Dividere la Spesa</h2>
          <p>
            Non esiste il metodo perfetto: dipende da quanto vi conoscete e da
            quanto volete essere precisi. Questi sono i tre più usati.
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>La cassa comune:</strong> prima di partire ognuno
                versa la stessa cifra a un &quot;cassiere&quot; (spesso lo
                skipper o chi organizza la cambusa), che paga tutto da lì. A
                fine crociera si divide quello che avanza o si aggiunge quello
                che manca. È il metodo più semplice e funziona benissimo tra
                amici
              </li>
              <li>
                <strong>Paga uno, si divide alla fine:</strong> chi fa la spesa
                anticipa e tiene gli scontrini, poi si fa il conto e ognuno
                rimborsa la sua parte. Va bene per le crociere brevi, ma chi
                anticipa si trova a gestire cifre importanti
              </li>
              <li>
                <strong>Un&apos;app per le spese di gruppo:</strong> app come
                Splitwise o Tricount permettono a chiunque paghi qualcosa di
                segnarlo subito dal telefono. Alla fine l&apos;app calcola chi
                deve quanto a chi, con il minor numero di bonifici possibile. È
                il metodo più preciso quando pagano in tanti
              </li>
            </ul>
          </div>
        </section>

        {/* Consiglio Rapido */}
        <div className="bg-accent-5 p-6 rounded-xl my-8">
          <h3 className="text-xl font-semibold mb-2">💡 Consiglio Rapido</h3>
          <p>
            Fotografate ogni scontrino appena pagato e mandatelo nel gruppo o
            caricatelo nell&apos;app. In barca la carta si bagna, si perde o
            finisce nella spazzatura insieme agli imballaggi.
          </p>
        </div>

        {/* 3. Cosa mettere in comune */}
        <section className="mb-12">
          <h2>3. Cosa Mettere in Comune e Cosa No</h2>
          <p>
            Separare le spese in poche categorie evita la maggior parte delle
            discussioni. Una divisione che funziona per molte crew:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Cambusa base, in comune:</strong> acqua, pane, pasta,
                frutta e verdura, colazioni, condimenti e tutto quello che si
                cucina per tutti
              </li>
              <li>
                <strong>Spese della barca, in comune:</strong> gasolio,
                ormeggi, gas, ghiaccio e cauzione, spesso divise a parte
                rispetto al cibo
              </li>
              <li>
                <strong>Alcol, da decidere:</strong> se in crew c&apos;è chi
                non beve, meglio una cassa separata per vino, birra e
                aperitivi
              </li>
              <li>
                <strong>Sfizi personali, a parte:</strong> il proprio
                integratore, le sigarette, la marca di caffè che vuole solo
                uno: ognuno se li compra da sé
              </li>
              <li>
                <strong>Cene a terra, a parte:</strong> al ristorante ognuno
                paga il suo, oppure si divide il conto di quella sera, ma
                fuori dalla cassa della cambusa
              </li>
            </ul>
          </div>
        </section>

        {/* 4. Casi delicati */}
        <section className="mb-12">
          <h2>4. I Casi Delicati (e Come Gestirli)</h2>
          <p>
            Sono sempre gli stessi, e conviene parlarne prima che diventino un
            problema:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Chi non beve alcol:</strong> con una cassa separata per
                gli alcolici nessuno paga per quello che non consuma
              </li>
              <li>
                <strong>Chi sale o scende a metà settimana:</strong> dividete
                la cambusa per &quot;giorni a bordo&quot;. Si sommano i giorni
                di tutti, si divide la spesa e ognuno paga in proporzione ai
                suoi
              </li>
              <li>
                <strong>Diete particolari:</strong> i prodotti senza glutine o
                vegani possono costare di più. Molte crew li mettono comunque
                in comune, perché a bordo si mangia insieme; l&apos;importante
                è deciderlo prima
              </li>
              <li>
                <strong>Bambini:</strong> c&apos;è chi li conta come mezza
                quota per il cibo. Anche qui, basta mettersi d&apos;accordo
              </li>
              <li>
                <strong>Gli avanzi:</strong> a fine crociera rimangono quasi
                sempre olio, caffè o bottiglie. Si possono dividere tra chi li
                vuole portare a casa, oppure lasciare a chi prende la barca
                dopo di voi
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
            La spesa più cara è quella che si butta. Comprare solo quello che
            la crew vuole davvero fa risparmiare tutti e riduce il cibo
            sprecato e i rifiuti da riportare a terra.
          </p>
        </div>

        {/* 5. Lista condivisa */}
        <section className="mb-12">
          <h2>5. Il Segreto per Spendere Meno: Decidere Insieme Cosa Comprare</h2>
          <p>
            Molte discussioni sui soldi in realtà riguardano la spesa:
            &quot;perché abbiamo pagato tre pacchi di biscotti che nessuno ha
            mangiato?&quot;. Se la lista si decide insieme prima di andare al
            supermercato, ognuno sa già cosa sta pagando. Una{" "}
            <Link href="/blog/lista-spesa-condivisa-barca">
              lista della spesa condivisa
            </Link>{" "}
            aiuta proprio in questo:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Ognuno propone e vota:</strong> con un 👍 o un 👎 si
                capisce subito cosa vuole la maggioranza, e si evitano i
                prodotti che nessuno avrebbe usato
              </li>
              <li>
                <strong>Le eccezioni sono chiare:</strong> scrivere &quot;latte
                di soia per Giulia&quot; o &quot;birra x24 (cassa
                alcol)&quot; rende evidente cosa va diviso a parte
              </li>
              <li>
                <strong>Niente doppioni:</strong> chi è al supermercato spunta
                i prodotti man mano, e gli altri vedono cosa è già stato
                comprato
              </li>
            </ul>
          </div>
          <p>
            Una lista condivisa non sostituisce l&apos;app per le spese, ma
            rende il conto finale molto più sereno: nessuno paga per cose che
            non voleva.
          </p>
        </section>

        {/* Invito a provare */}
        <div className="not-prose my-10 rounded-2xl border border-accent-40 bg-gradient-to-br from-accent/10 via-white to-accent-light/15 p-6 text-center sm:p-8">
          <p className="font-subtitle text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            Gratis e senza registrazione
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            Decidete insieme la cambusa, prima di pagarla
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
          <h2>In breve: come dividere le spese in barca</h2>
          <ul className="list-disc pl-5 mt-0">
            <li>Mettetevi d&apos;accordo sulle regole prima di partire</li>
            <li>
              Scegliete un metodo: cassa comune, conto finale o app per le
              spese
            </li>
            <li>
              Separate cambusa, spese della barca, alcol e cene a terra
            </li>
            <li>
              Decidete insieme cosa comprare, così nessuno paga per quello che
              non voleva
            </li>
          </ul>

          <BlogCta />
        </section>
      </article>
      </PageContainer>
    </main>
  );
}
