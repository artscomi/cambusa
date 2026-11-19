import { Metadata } from "next";
import Link from "next/link";
import { LegalDoc, List, Section, TITOLARE } from "@/components/Legal/LegalDoc";

export const metadata: Metadata = {
  title: "Termini di Servizio | Cambusa",
  description: "Le condizioni di utilizzo di Cambusa e di Cambusa Express.",
};

export default function TermsPage() {
  return (
    <LegalDoc
      title="Termini di Servizio"
      updated="19 novembre 2026"
      intro={
        <p>
          Questi termini regolano l&apos;uso di Cambusa (cambusa-online.com).
          Usando il sito li accetti; se non sei d&apos;accordo, ti chiediamo di
          non utilizzarlo.
        </p>
      }
    >
      <Section title="1. Chi fornisce il servizio">
        <p>
          Cambusa è un progetto gestito a titolo privato da {TITOLARE.nome}.
          Contatti:{" "}
          <a href={`mailto:${TITOLARE.email}`}>{TITOLARE.email}</a>.
        </p>
      </Section>

      <Section title="2. Il servizio">
        <List>
          <li>
            <strong>Menu con l&apos;AI</strong>: generazione di menu e liste
            della spesa per la tua vacanza in barca, a partire da giorni, pasti,
            persone e preferenze.
          </li>
          <li>
            <strong>Gruppi</strong>: raccolta delle preferenze di tutto
            l&apos;equipaggio e voto dei piatti.
          </li>
          <li>
            <strong>Cambusa Express</strong>: lista della spesa condivisa, che
            si usa senza account.
          </li>
        </List>
      </Section>

      <Section title="3. Account">
        <p>
          Per generare menu e usare i gruppi serve accedere con un account
          Google. Sei responsabile
          dei dati che inserisci e della sicurezza del tuo accesso; avvisaci se
          noti un uso non autorizzato. Puoi chiedere di chiudere l&apos;account in
          qualsiasi momento scrivendoci.
        </p>
      </Section>

      <Section title="4. Liste e gruppi condivisi">
        <List>
          <li>
            Chiunque abbia il link di una lista Express o di un gruppo può
            vederne il contenuto, i nomi dei partecipanti e, nelle liste
            Express, aggiungere e votare prodotti. Condividi il link solo con chi
            vuoi.
          </li>
          <li>
            Sei responsabile di ciò che scrivi. Non inserire contenuti offensivi,
            illegali o dati personali di altre persone senza il loro permesso.
          </li>
          <li>
            Chi ha creato la lista può eliminare qualsiasi prodotto; ciascuno può
            eliminare i prodotti che ha aggiunto. Possiamo rimuovere contenuti
            che violano questi termini.
          </li>
        </List>
      </Section>

      <Section title="5. Prezzi e pagamenti">
        <p>
          Cambusa è gratuito, con un numero limitato di generazioni del menu con
          l&apos;AI (3 per account). Puoi acquistare un pacchetto di{" "}
          <strong>5 rigenerazioni aggiuntive</strong> al prezzo indicato prima
          del pagamento (IVA inclusa), con pagamento unico tramite Stripe
          (carta o PayPal). Non ci sono abbonamenti né rinnovi automatici.
        </p>
        <p>
          <strong>Diritto di recesso.</strong> Le rigenerazioni sono un
          contenuto digitale fornito subito dopo il pagamento. Al momento
          dell&apos;acquisto ci chiedi di renderle disponibili immediatamente e
          riconosci che, per questo, perdi il diritto di recesso di 14 giorni
          (art. 59, lett. o, Codice del Consumo). Se le rigenerazioni non ti
          vengono accreditate per un nostro errore, scrivici e ti rimborsiamo.
        </p>
      </Section>

      <Section title="6. Menu, allergie e sicurezza alimentare">
        <p>
          I menu e le liste sono <strong>suggerimenti generati automaticamente</strong>{" "}
          e possono contenere errori. In caso di allergie o intolleranze
          controlla sempre gli ingredienti e le etichette: Cambusa non sostituisce
          il parere di un medico. Conservazione e preparazione degli alimenti a
          bordo restano sotto la tua responsabilità.
        </p>
      </Section>

      <Section title="7. Uso corretto">
        <p>Non è consentito:</p>
        <List>
          <li>usare Cambusa per scopi illegali o per inviare spam;</li>
          <li>tentare di accedere senza autorizzazione ai nostri sistemi o di ostacolarne il funzionamento;</li>
          <li>usare strumenti automatici per generare menu o contenuti in massa.</li>
        </List>
        <p>Possiamo sospendere gli account o le liste che violano queste regole.</p>
      </Section>

      <Section title="8. Proprietà intellettuale">
        <p>
          Il sito, il marchio, i testi e la grafica di Cambusa sono di{" "}
          {TITOLARE.nome}. Puoi usare liberamente, per uso personale, i menu e le
          liste che generi.
        </p>
      </Section>

      <Section title="9. Disponibilità e responsabilità">
        <p>
          Facciamo del nostro meglio perché Cambusa funzioni sempre, ma non
          possiamo garantire che sia privo di interruzioni o errori. Possiamo
          modificare o sospendere funzioni del servizio; per le modifiche
          importanti ti avviseremo sul sito.
        </p>
        <p>
          Nei limiti consentiti dalla legge, non rispondiamo dei danni indiretti
          derivanti dall&apos;uso del servizio. Restano salvi i diritti che la
          legge riconosce ai consumatori e la responsabilità per dolo o colpa
          grave.
        </p>
      </Section>

      <Section title="10. Privacy">
        <p>
          L&apos;uso dei tuoi dati è descritto nella{" "}
          <Link href="/privacy-policy">Privacy Policy</Link> e nella{" "}
          <Link href="/cookies">Cookie Policy</Link>.
        </p>
      </Section>

      <Section title="11. Modifiche a questi termini">
        <p>
          Possiamo aggiornare questi termini. La data in alto indica
          l&apos;ultima modifica; continuando a usare Cambusa dopo una modifica,
          accetti la nuova versione.
        </p>
      </Section>

      <Section title="12. Legge applicabile">
        <p>
          Si applica la legge italiana. Se sei un consumatore, per eventuali
          controversie è competente il giudice del luogo in cui risiedi.
          Puoi anche usare la piattaforma europea per la risoluzione online
          delle controversie.
        </p>
      </Section>
    </LegalDoc>
  );
}
