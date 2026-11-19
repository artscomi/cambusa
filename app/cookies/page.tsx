import { Metadata } from "next";
import Link from "next/link";
import { LegalDoc, Section, Table, TITOLARE } from "@/components/Legal/LegalDoc";
import { CookieSettingsButton } from "./CookieSettingsButton";

export const metadata: Metadata = {
  title: "Cookie Policy | Cambusa",
  description: "Quali cookie e strumenti di tracciamento usa Cambusa e come gestirli.",
};

export default function CookiesPage() {
  return (
    <LegalDoc
      title="Cookie Policy"
      updated="19 novembre 2026"
      intro={
        <p>
          I cookie sono piccoli file che il sito salva nel tuo browser. Qui
          trovi quali usa Cambusa, a cosa servono e come puoi cambiare le tue
          scelte. Per il resto dei dati personali vedi la{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>.
        </p>
      }
    >
      <Section title="1. Cookie tecnici (sempre attivi)">
        <p>
          Servono a far funzionare il sito e non richiedono il tuo consenso.
        </p>
        <Table
          head={["Cookie o fornitore", "A cosa serve", "Durata"]}
          rows={[
            ["Clerk (__session, __client e simili)", "Mantenere l'accesso al tuo account", "Sessione / fino a 1 anno"],
            ["cambusa_guest", "Cambusa Express: riconoscere chi ha aggiunto o votato un prodotto, senza account", "1 anno"],
            ["Stripe", "Pagamento sicuro e prevenzione delle frodi, solo durante l'acquisto", "Fino a 1 anno"],
            ["Memoria locale del browser", "Ricordare la tua scelta sui cookie, il nome usato in Express e le preferenze dei menu", "Finché non la cancelli"],
          ]}
        />
      </Section>

      <Section title="2. Statistiche senza cookie (sempre attive)">
        <p>
          Questi strumenti contano le visite in forma aggregata,{" "}
          <strong>senza cookie</strong> e senza identificarti:
        </p>
        <Table
          head={["Fornitore", "A cosa serve"]}
          rows={[
            ["Vercel Web Analytics", "Numero di visite, pagine più viste, provenienza"],
            ["Vercel Speed Insights", "Velocità di caricamento delle pagine"],
            ["Ahrefs Web Analytics", "Statistiche di visita per migliorare la presenza su Google"],
          ]}
        />
      </Section>

      <Section title="3. Cookie analitici (solo con il tuo consenso)">
        <p>
          Si attivano solo se scegli &quot;Accetta tutti&quot; o abiliti le
          statistiche nelle impostazioni del banner.
        </p>
        <Table
          head={["Fornitore", "A cosa serve", "Durata"]}
          rows={[
            [
              <a key="ga" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Analytics</a>,
              "Statistiche su visite e azioni (per esempio liste create, menu generati)",
              "Fino a 2 anni",
            ],
            [
              <a key="cl" href="https://privacy.microsoft.com/it-it/privacystatement" target="_blank" rel="noopener noreferrer">Microsoft Clarity</a>,
              "Mappe di calore e registrazioni anonime delle sessioni",
              "Fino a 1 anno",
            ],
            [
              <a key="hj" href="https://www.hotjar.com/legal/policies/privacy/" target="_blank" rel="noopener noreferrer">Hotjar</a>,
              "Mappe di calore, registrazioni delle sessioni e chat di supporto",
              "Fino a 1 anno",
            ],
          ]}
        />
        <p>
          Le registrazioni nascondono automaticamente i campi di testo sensibili
          come password e dati di pagamento.
        </p>
      </Section>

      <Section title="4. Come cambiare le tue scelte">
        <p>
          Puoi cambiare idea in qualsiasi momento: riapri il banner e scegli di
          nuovo. Puoi anche bloccare o cancellare i cookie dalle impostazioni del
          browser; in quel caso alcune funzioni, come l&apos;accesso o il
          riconoscimento in Cambusa Express, potrebbero non funzionare.
        </p>
        <CookieSettingsButton />
      </Section>

      <Section title="5. Contatti">
        <p>
          Per domande sui cookie scrivi a{" "}
          <a href={`mailto:${TITOLARE.email}`}>{TITOLARE.email}</a>.
        </p>
      </Section>
    </LegalDoc>
  );
}
