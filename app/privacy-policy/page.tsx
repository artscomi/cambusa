import { Metadata } from "next";
import Link from "next/link";
import { LegalDoc, List, Section, Table, TITOLARE } from "@/components/Legal/LegalDoc";
import { EXPRESS_RETENTION_MONTHS } from "@/lib/express/retention";

export const metadata: Metadata = {
  title: "Privacy Policy | Cambusa",
  description: "Come Cambusa raccoglie, usa e protegge i dati personali.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      updated="19 novembre 2026"
      intro={
        <p>
          Questa informativa spiega quali dati personali raccoglie Cambusa
          (cambusa-online.com), perché, con chi li condivide e quali sono i tuoi
          diritti, ai sensi del Regolamento UE 2016/679 (GDPR).
        </p>
      }
    >
      <Section title="1. Titolare del trattamento">
        <p>
          Titolare del trattamento è {TITOLARE.nome}, persona fisica, che
          gestisce Cambusa a titolo privato. Per qualsiasi richiesta sulla
          privacy puoi scrivere a{" "}
          <a href={`mailto:${TITOLARE.email}`}>{TITOLARE.email}</a>.
        </p>
      </Section>

      <Section title="2. Quali dati raccogliamo">
        <p>
          <strong>Se accedi con il tuo account Google</strong> (l&apos;unico
          metodo di accesso, gestito dal nostro fornitore di autenticazione):
          nome, indirizzo email, immagine del profilo e identificativo
          dell&apos;account. Non riceviamo la tua password.
        </p>
        <p>
          <strong>Quando usi il generatore di menu e i gruppi</strong>: numero
          di persone, pasti e giorni del viaggio, preferenze alimentari, alcolici
          e acqua, e le note che scrivi (per esempio &quot;vegetariano&quot;,
          &quot;senza glutine&quot;); i menu e le liste della spesa generati; i
          voti ai piatti dei menu di gruppo.
        </p>
        <p>
          <strong>Quando usi Cambusa Express</strong> (anche senza account): il
          nome (non il cognome) che inserisci, i prodotti che aggiungi, i voti che dai e le
          spunte. Per riconoscerti tra una visita e l&apos;altra salviamo nel
          tuo browser un codice casuale anonimo (cookie
          &quot;cambusa_guest&quot;) e il tuo nome (memoria locale del browser).
          Quando crei una lista salviamo anche un&apos;impronta non reversibile
          del tuo indirizzo IP, solo per impedire la creazione di liste a raffica.
        </p>
        <p>
          <strong>Quando acquisti rigenerazioni</strong>: i dati di pagamento
          sono raccolti direttamente da Stripe. Noi riceviamo solo l&apos;esito
          del pagamento e l&apos;email associata; non vediamo né conserviamo i
          dati della tua carta.
        </p>
        <p>
          <strong>Dati di navigazione</strong>: indirizzo IP, browser,
          dispositivo, pagine visitate e azioni sul sito, raccolti dai nostri
          fornitori tecnici e, solo con il tuo consenso, dagli strumenti di
          statistica (vedi la <Link href="/cookies">Cookie Policy</Link>).
        </p>
      </Section>

      <Section title="3. Dati sulla salute (allergie e intolleranze)">
        <p>
          Le preferenze alimentari possono rivelare informazioni sulla salute,
          come allergie, intolleranze o celiachia. Le usiamo{" "}
          <strong>solo per generare il menu e la lista della spesa</strong> che
          ci chiedi, sulla base del tuo consenso esplicito, che esprimi
          inserendole volontariamente (art. 9.2.a GDPR). Non sei obbligato a
          inserirle e puoi cancellarle in qualsiasi momento.
        </p>
        <p>
          Nei gruppi e nelle liste Express, quello che scrivi è visibile agli
          altri partecipanti: inserisci solo ciò che vuoi condividere con loro.
        </p>
      </Section>

      <Section title="4. Perché usiamo i dati e su quale base">
        <Table
          head={["Finalità", "Base giuridica"]}
          rows={[
            ["Fornirti il servizio: account, menu, gruppi, liste Express", "Esecuzione del contratto (art. 6.1.b)"],
            ["Usare le preferenze alimentari che riguardano la salute", "Consenso esplicito (art. 9.2.a)"],
            ["Gestire i pagamenti e le relative ricevute", "Contratto e obblighi di legge (art. 6.1.b e c)"],
            ["Statistiche, mappe di calore e registrazioni delle sessioni", "Consenso tramite il banner cookie (art. 6.1.a)"],
            ["Sicurezza del sito e prevenzione degli abusi", "Legittimo interesse (art. 6.1.f)"],
            ["Rispondere alle tue richieste", "Esecuzione del contratto o legittimo interesse"],
          ]}
        />
      </Section>

      <Section title="5. Con chi condividiamo i dati">
        <p>
          Non vendiamo i tuoi dati. Li condividiamo solo con i fornitori che ci
          servono per far funzionare Cambusa, che li trattano per nostro conto
          come responsabili del trattamento:
        </p>
        <Table
          head={["Fornitore", "A cosa serve", "Dove"]}
          rows={[
            ["Vercel Inc.", "Hosting del sito, statistiche di visita senza cookie e velocità delle pagine", "USA / UE"],
            ["Supabase Inc.", "Database", "UE / USA"],
            ["Clerk Inc.", "Accesso con Google", "USA"],
            ["OpenAI", "Generazione dei menu: riceve le preferenze del viaggio, non nome o email", "USA"],
            ["Stripe", "Pagamenti", "UE / USA"],
            ["Google (Analytics)", "Statistiche, solo con consenso", "USA"],
            ["Microsoft (Clarity)", "Mappe di calore e registrazioni, solo con consenso", "USA"],
            ["Hotjar", "Mappe di calore, registrazioni e chat di supporto, solo con consenso", "UE"],
            ["Ahrefs", "Statistiche di visita per la SEO, senza cookie", "UE / Singapore"],
          ]}
        />
        <p>
          <strong>Splitwise (solo se lo scegli tu).</strong> In Cambusa Express
          puoi collegare il tuo account Splitwise per registrare il totale della
          spesa in un tuo gruppo. In quel caso inviamo a Splitwise, a tuo nome,
          solo i dati di quella spesa: importo, nome della lista e prodotti
          presi. Il permesso di accesso che Splitwise ci dà resta in un cookie
          nel tuo browser per 30 giorni e non lo salviamo nei nostri database;
          puoi revocarlo in qualsiasi momento dalla lista (&quot;Scollega
          Splitwise&quot;) o dalle impostazioni del tuo account Splitwise.
          Splitwise (USA) tratta questi dati come titolare autonomo, secondo la
          sua privacy policy.
        </p>
        <p>
          Possiamo comunicare i dati alle autorità quando lo richiede la legge.
        </p>
      </Section>

      <Section title="6. Trasferimenti fuori dall'UE">
        <p>
          Alcuni fornitori hanno sede negli Stati Uniti. I trasferimenti
          avvengono sulla base del Data Privacy Framework UE-USA, per i
          fornitori che vi aderiscono, o delle Clausole Contrattuali Standard
          approvate dalla Commissione europea.
        </p>
      </Section>

      <Section title="7. Per quanto tempo conserviamo i dati">
        <List>
          <li>Dati dell&apos;account, menu e gruppi: finché l&apos;account è attivo; li cancelliamo entro 30 giorni dalla tua richiesta di eliminazione.</li>
          <li>Liste Express: vengono cancellate automaticamente, con prodotti e voti, dopo {EXPRESS_RETENTION_MONTHS} mesi senza modifiche. Prima di allora puoi chiederne la cancellazione in qualsiasi momento.</li>
          <li>Dati dei pagamenti: 10 anni, come richiesto dalle norme fiscali.</li>
          <li>Statistiche: secondo le impostazioni dei singoli strumenti (per esempio 14 mesi per Google Analytics).</li>
        </List>
      </Section>

      <Section title="8. I tuoi diritti">
        <p>Puoi chiederci in qualsiasi momento di:</p>
        <List>
          <li>accedere ai tuoi dati e riceverne una copia;</li>
          <li>correggerli o cancellarli;</li>
          <li>limitarne l&apos;uso o opporti al trattamento;</li>
          <li>ricevere i dati in un formato leggibile (portabilità);</li>
          <li>revocare il consenso, senza che questo cambi la liceità di quanto fatto prima.</li>
        </List>
        <p>
          Scrivi a <a href={`mailto:${TITOLARE.email}`}>{TITOLARE.email}</a>:
          rispondiamo entro 30 giorni. Hai anche il diritto di presentare
          reclamo al{" "}
          <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
            Garante per la protezione dei dati personali
          </a>
          .
        </p>
      </Section>

      <Section title="9. Minori">
        <p>
          Cambusa non è pensato per i minori di 14 anni e non raccogliamo
          consapevolmente i loro dati.
        </p>
      </Section>

      <Section title="10. Modifiche">
        <p>
          Possiamo aggiornare questa informativa. La data in alto indica
          l&apos;ultima modifica; per i cambiamenti importanti ti avviseremo sul
          sito o via email.
        </p>
      </Section>
    </LegalDoc>
  );
}
