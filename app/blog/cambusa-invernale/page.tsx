import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { BlogCta } from "@/app/components/BlogCta";
import { PageContainer } from "@/components/PageContainer";

export const metadata: Metadata = {
  title:
    "Cambusa Invernale: Cosa Portare in Barca d'Inverno | Cambusa Online",
  description:
    "Come organizzare la cambusa per navigare d'inverno: pasti caldi, alimenti di stagione, bevande calde e consigli pratici per affrontare il freddo in barca su cambusa-online.com!",
};

export default function CambusaInvernale() {
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
          <li className="text-gray-700 font-semibold">Cambusa Invernale</li>
        </ol>
      </nav>

      {/* Articolo */}
      <article className="prose prose-lg prose-blue dark:prose-invert">
        <h1>
          Cambusa Invernale: Cosa Portare in Barca per Navigare al Caldo
        </h1>

        <p className="mb-8">
          Navigare d&apos;inverno ha un fascino unico: porti tranquilli, mare
          tutto per te e luci basse sull&apos;orizzonte. Ma il freddo cambia
          completamente le esigenze di chi è a bordo. Organizzare una{" "}
          <strong>cambusa invernale</strong> significa pensare a pasti caldi,
          più energia e alimenti che sappiano scaldare anche le giornate più
          umide.
        </p>

        {/* 1. Pianificazione */}
        <section className="mb-12">
          <h2>1. Pianificare la Cambusa per il Freddo</h2>
          <p>
            In inverno il corpo consuma più energia per mantenersi caldo e le
            giornate sono più corte. Prima di fare la spesa, considera questi
            aspetti:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Più calorie:</strong> con il freddo e le manovre
                l&apos;equipaggio ha bisogno di pasti più sostanziosi.
                Aumenta leggermente le porzioni rispetto alla stagione estiva
              </li>
              <li>
                <strong>Giornate corte:</strong> con il buio che arriva presto,
                prevedi cene semplici da preparare e pranzi pronti da mangiare
                in navigazione
              </li>
              <li>
                <strong>Porti meno serviti:</strong> d&apos;inverno molti negozi
                vicino ai porti turistici sono chiusi. Porta qualche scorta in
                più del solito
              </li>
              <li>
                <strong>Gas di scorta:</strong> cucinerai più spesso piatti
                caldi, quindi controlla la bombola e portane una di riserva
              </li>
            </ul>
          </div>
        </section>

        {/* 2. Pasti Caldi */}
        <section className="mb-12">
          <h2>2. Pasti Caldi e Sostanziosi</h2>
          <p>
            Il pasto caldo è il momento più atteso della giornata invernale in
            barca. Punta su piatti unici, che si preparano in una sola pentola:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Zuppe e minestroni:</strong> legumi, orzo, farro e
                verdure di stagione. Puoi prepararli a casa e portarli in
                barattoli di vetro o sottovuoto
              </li>
              <li>
                <strong>Pasta e legumi:</strong> pasta e ceci, pasta e fagioli,
                pasta e lenticchie. Nutrienti, economici e perfetti con il
                freddo
              </li>
              <li>
                <strong>Risotti:</strong> con zucca, funghi secchi o radicchio,
                si preparano in una sola pentola e scaldano subito
              </li>
              <li>
                <strong>Polenta istantanea:</strong> pronta in pochi minuti,
                ottima con formaggi stagionati o spezzatino in scatola
              </li>
            </ul>
          </div>
        </section>

        {/* Consiglio Rapido */}
        <div className="bg-accent-5 p-6 rounded-xl my-8">
          <h3 className="text-xl font-semibold mb-2">💡 Consiglio Rapido</h3>
          <p>
            La pentola a pressione è la migliore alleata della cambusa
            invernale: dimezza i tempi di cottura di legumi e zuppe, consuma
            meno gas e, con il coperchio bloccato, è più sicura anche con un
            po&apos; di mare.
          </p>
        </div>

        {/* 3. Alimenti di Stagione */}
        <section className="mb-12">
          <h2>3. Frutta e Verdura Invernali</h2>
          <p>
            Il vantaggio dell&apos;inverno è che fa fresco anche in barca: frutta
            e verdura durano molto più a lungo che in estate. Scegli prodotti di
            stagione:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Agrumi:</strong> arance, mandarini e limoni durano
                settimane e sono ricchi di vitamina C per difendersi dai
                malanni di stagione
              </li>
              <li>
                <strong>Cavoli e verze:</strong> cavolo cappuccio, verza e
                cavolfiore sono resistentissimi e ottimi in zuppe e stufati
              </li>
              <li>
                <strong>Zucca:</strong> intera si conserva per settimane e si usa
                in risotti, vellutate e contorni
              </li>
              <li>
                <strong>Finocchi, carote e porri:</strong> perfetti crudi in
                insalata o cotti nei minestroni
              </li>
              <li>
                <strong>Mele e pere:</strong> lo spuntino ideale durante i turni
                di guardia
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
            Scegliere prodotti di stagione e locali riduce i trasporti e
            l&apos;impatto ambientale della tua cambusa. D&apos;inverno, poi,
            con temperature più basse puoi spesso fare a meno del frigorifero
            e risparmiare energia a bordo.
          </p>
        </div>

        {/* 4. Bevande Calde */}
        <section className="mb-12">
          <h2>4. Bevande Calde e Idratazione</h2>
          <p>
            Con il freddo si tende a bere meno, ma restare idratati è
            fondamentale anche d&apos;inverno. Le bevande calde aiutano a farlo
            con piacere:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Thermos:</strong> preparane uno la mattina con tè,
                tisana o brodo caldo. Sarà prezioso durante la navigazione
              </li>
              <li>
                <strong>Tisane e tè:</strong> zenzero e limone, camomilla,
                tè nero. Leggere e facili da conservare
              </li>
              <li>
                <strong>Cioccolata calda:</strong> in polvere o in bustine, per
                una pausa energetica dopo una manovra al freddo
              </li>
              <li>
                <strong>Brodo granulare o dado:</strong> una tazza di brodo
                caldo scalda e reintegra i sali minerali
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Consigli Pratici */}
        <section className="mb-12">
          <h2>5. Consigli Pratici per la Cambusa Invernale</h2>
          <p>
            Il freddo e l&apos;umidità invernale richiedono qualche attenzione
            in più nella gestione della cambusa:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mt-6">
            <ul className="list-inside list-disc">
              <li>
                <strong>Attenzione alla condensa:</strong> d&apos;inverno
                l&apos;umidità in barca è alta. Usa contenitori ermetici per
                pasta, riso, biscotti e zucchero
              </li>
              <li>
                <strong>Snack energetici a portata di mano:</strong> frutta
                secca, cioccolato fondente e barrette da tenere vicino al
                pozzetto per i turni di guardia
              </li>
              <li>
                <strong>Pasti pronti da casa:</strong> sughi, zuppe e
                spezzatini cucinati prima di partire e conservati sottovuoto
                si scaldano in pochi minuti
              </li>
              <li>
                <strong>Ventila la dinette:</strong> quando cucini piatti caldi
                apri un osteriggio per far uscire vapore e umidità
              </li>
              <li>
                <strong>Scorta di emergenza:</strong> d&apos;inverno il meteo
                può costringerti in porto più a lungo del previsto. Tieni
                sempre qualche pasto in più
              </li>
            </ul>
          </div>
        </section>

        {/* Sezione finale */}
        <section className="mb-8">
          <h2>Perché preparare una cambusa invernale?</h2>
          <ul className="list-disc pl-5 mt-0">
            <li>Mantieni l&apos;equipaggio caldo, energico e di buon umore</li>
            <li>Sfrutti i prodotti di stagione, che durano di più</li>
            <li>
              Affronti con serenità anche i giorni di maltempo in porto
            </li>
          </ul>

          <BlogCta />
        </section>
      </article>
      </PageContainer>
    </main>
  );
}
