import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { BlogCta } from "@/app/components/BlogCta";
import { PageContainer } from "@/components/PageContainer";

export const metadata: Metadata = {
  title:
    "Come Conservare il Cibo in Barca Senza Frigorifero: Guida Pratica | Cambusa Online",
  description:
    "Scopri come conservare frutta, verdura, uova, formaggi e pane in barca anche senza frigorifero. Consigli pratici per una cambusa che dura tutta la crociera su cambusa-online.com!",
};

export default function ConservareCiboBarcaSenzaFrigo() {
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
          <li className="text-gray-700 font-semibold">Conservare il Cibo</li>
        </ol>
      </nav>

      {/* Articolo */}
      <article className="prose prose-lg prose-blue dark:prose-invert">
        <h1>
          Come Conservare il Cibo in Barca Senza Frigorifero: Guida Pratica
        </h1>

        <p className="mb-8">
          Frigoriferi piccoli, batterie da risparmiare e temperature estive:
          in barca conservare il cibo è una sfida. La buona notizia è che con
          le giuste scelte puoi organizzare una{" "}
          <strong>cambusa per una settimana in barca</strong> anche con poco
          freddo a disposizione, o addirittura senza, mangiando bene fino
          all&apos;ultimo giorno.
        </p>

        {/* 1. Frutta e Verdura */}
        <section className="mb-12">
          <h2>1. Frutta e Verdura: Scegliere e Conservare</h2>
          <p>
            Frutta e verdura fresche sono le prime a soffrire il caldo e
            l&apos;umidità. Il segreto è comprarle nel modo giusto e trattarle
            con cura:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Non lavarle prima di imbarcarle:</strong> l&apos;umidità
                accelera la formazione di muffe. Lavale solo al momento di
                consumarle
              </li>
              <li>
                <strong>Compra a diversi gradi di maturazione:</strong> pomodori
                e banane in parte verdi maturano durante la settimana, così hai
                sempre qualcosa pronto da mangiare
              </li>
              <li>
                <strong>Avvolgi nella carta:</strong> mele, agrumi e pomodori
                avvolti singolarmente in carta di giornale o da cucina durano
                molto di più
              </li>
              <li>
                <strong>Tieni separate le banane:</strong> rilasciano etilene,
                un gas che fa maturare (e marcire) più in fretta la frutta
                vicina
              </li>
              <li>
                <strong>Le verdure più resistenti:</strong> patate, cipolle,
                aglio, carote, cavolo cappuccio e zucca si conservano anche per
                settimane in un luogo fresco, buio e ventilato
              </li>
            </ul>
          </div>
        </section>

        {/* 2. Proteine */}
        <section className="mb-12">
          <h2>2. Proteine a Lunga Conservazione</h2>
          <p>
            Senza frigorifero carne e pesce freschi vanno consumati il primo
            giorno. Per il resto della crociera punta su proteine che non
            temono il caldo:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Uova:</strong> se non sono mai state in frigo si
                conservano per 2-3 settimane a temperatura ambiente. Girale ogni
                due giorni per mantenere il tuorlo al centro
              </li>
              <li>
                <strong>Formaggi stagionati:</strong> parmigiano, pecorino e
                grana resistono a lungo, soprattutto se avvolti in un panno
                leggermente imbevuto di aceto
              </li>
              <li>
                <strong>Salumi interi:</strong> salame e speck interi durano
                molto più di quelli affettati. Tagliali solo quando servono
              </li>
              <li>
                <strong>Scatolame:</strong> tonno, sgombro, legumi e carne in
                scatola sono la base di una cambusa barca a vela senza frigo
              </li>
            </ul>
          </div>
        </section>

        {/* Consiglio Rapido */}
        <div className="bg-accent-5 p-6 rounded-xl my-8">
          <h3 className="text-xl font-semibold mb-2">💡 Consiglio Rapido</h3>
          <p>
            Preferisci confezioni piccole e monoporzione: una volta aperta,
            una scatoletta o un brick senza frigorifero va consumato in
            giornata. Meglio due scatolette piccole che una grande da buttare a
            metà.
          </p>
        </div>

        {/* 3. Pane e Latticini */}
        <section className="mb-12">
          <h2>3. Pane, Latte e Latticini</h2>
          <p>
            Pane fresco e latte sono tra gli alimenti più difficili da gestire
            in barca. Ecco le alternative che funzionano davvero:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Pane:</strong> il pane fresco dura 2-3 giorni. Per il
                resto della settimana porta piadine, pane a lunga
                conservazione, gallette, crackers e fette biscottate
              </li>
              <li>
                <strong>Latte UHT:</strong> si conserva per mesi chiuso. Scegli
                i formati piccoli da 200-500 ml
              </li>
              <li>
                <strong>Latte in polvere:</strong> leggero e compatto, è perfetto
                per colazioni e ricette durante le lunghe navigazioni
              </li>
              <li>
                <strong>Burro e yogurt:</strong> senza freddo durano poco.
                Sostituisci il burro con olio extravergine d&apos;oliva e lo
                yogurt con frutta secca e cereali
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
            Conservare bene il cibo significa buttarne meno. Ogni frutto che
            arriva intatto a fine crociera è uno spreco in meno e un sacchetto
            di rifiuti in meno da portare a terra. Il mare ringrazia.
          </p>
        </div>

        {/* 4. Dove e Come Stivare */}
        <section className="mb-12">
          <h2>4. Dove e Come Stivare le Provviste</h2>
          <p>
            Anche la posizione in barca conta. La temperatura cambia molto da
            un gavone all&apos;altro, e scegliere il posto giusto può far durare
            gli alimenti giorni in più:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>In basso è più fresco:</strong> i gavoni sotto il
                pagliolo, vicino alla linea di galleggiamento, sono i punti più
                freschi della barca
              </li>
              <li>
                <strong>Lontano dal motore:</strong> evita di stivare cibo
                vicino al vano motore o in zone esposte al sole
              </li>
              <li>
                <strong>Ventilazione:</strong> usa reti e cassette aperte per
                frutta e verdura, così l&apos;aria circola e si riduce la muffa
              </li>
              <li>
                <strong>Sottovuoto:</strong> formaggi, salumi e frutta secca
                confezionati sottovuoto prima della partenza occupano meno
                spazio e si conservano più a lungo
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Ordine di Consumo */}
        <section className="mb-12">
          <h2>5. L&apos;Ordine Giusto per Consumare gli Alimenti</h2>
          <p>
            Pianificare cosa mangiare e quando è il trucco più efficace per
            una cambusa senza frigo. Organizza il menu della settimana
            seguendo questo ordine:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Giorni 1-2:</strong> carne e pesce freschi, verdure a
                foglia, pane fresco, frutta delicata come pesche e fragole
              </li>
              <li>
                <strong>Giorni 3-4:</strong> zucchine, peperoni, pomodori,
                uova, formaggi freschi rimasti
              </li>
              <li>
                <strong>Giorni 5-7:</strong> verdure resistenti (patate, carote,
                cavolo), formaggi stagionati, salumi interi e scatolame
              </li>
              <li>
                <strong>Sempre disponibili:</strong> pasta, riso, cous cous,
                legumi e una scorta di emergenza per gli imprevisti
              </li>
            </ul>
          </div>
        </section>

        {/* Sezione finale */}
        <section className="mb-8">
          <h2>Perché conservare bene il cibo in barca?</h2>
          <ul className="list-disc pl-5 mt-0">
            <li>Mangi bene fino all&apos;ultimo giorno di navigazione</li>
            <li>Risparmi energia e batterie limitando l&apos;uso del frigo</li>
            <li>
              Eviti sprechi e riduci i rifiuti da gestire a bordo
            </li>
          </ul>

          <BlogCta />
        </section>
      </article>
      </PageContainer>
    </main>
  );
}
