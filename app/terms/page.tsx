"use client";

import { motion } from "framer-motion";
import { itemVariants } from "@/animations/framer-variants";
import { FileText, AlertTriangle, CheckCircle, Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-6 md:px-10 py-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
          Termini di Servizio
        </h1>
        <p className="text-gray-600 text-lg">
          Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
        </p>
      </motion.div>

      {/* Content */}
      <motion.div variants={itemVariants} className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Accettazione dei Termini
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Utilizzando Cambusaai ("il Servizio"), accetti di essere vincolato
            da questi Termini di Servizio ("Termini"). Se non accetti questi
            Termini, non utilizzare il Servizio.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Ci riserviamo il diritto di modificare questi Termini in qualsiasi
            momento. Le modifiche saranno effettive immediatamente dopo la
            pubblicazione sul sito web.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-primary" />
            Descrizione del Servizio
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Cambusaai è un servizio di pianificazione menu per barche a vela che
            utilizza l'intelligenza artificiale per generare menu personalizzati
            e liste della spesa basati su:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Durata del viaggio</li>
            <li>Numero di persone</li>
            <li>Preferenze alimentari</li>
            <li>Restrizioni dietetiche</li>
            <li>Allergie e intolleranze</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Registrazione e Account
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Per utilizzare il Servizio, potresti dover creare un account. Sei
              responsabile di:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Fornire informazioni accurate e complete</li>
              <li>Mantenere la sicurezza del tuo account</li>
              <li>Notificare immediatamente qualsiasi uso non autorizzato</li>
              <li>
                Essere responsabile di tutte le attività che avvengono nel tuo
                account
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-primary" />
            Limitazioni di Responsabilità
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              <strong>Disclaimer:</strong> I menu e le liste della spesa
              generati sono suggerimenti basati sui dati forniti. Non garantiamo
              che siano privi di errori o completamente accurati.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Allergie e Intolleranze:</strong> Sebbene ci sforziamo di
              evitare ingredienti problematici, è tua responsabilità verificare
              sempre gli ingredienti e consultare un medico per gravi allergie.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Conservazione Alimenti:</strong> Non siamo responsabili
              per la conservazione o la preparazione degli alimenti. Segui
              sempre le linee guida di sicurezza alimentare.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Uso Accettabile
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Ti impegni a utilizzare il Servizio solo per scopi legittimi e in
            conformità con questi Termini. Non è consentito:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Utilizzare il Servizio per scopi illegali o fraudolenti</li>
            <li>Tentare di accedere non autorizzato ai nostri sistemi</li>
            <li>Interferire con il funzionamento del Servizio</li>
            <li>Violare i diritti di proprietà intellettuale</li>
            <li>Trasmettere virus o codice dannoso</li>
            <li>Utilizzare il Servizio per spam o contenuti offensivi</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" />
            Proprietà Intellettuale
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Il Servizio e tutto il suo contenuto, inclusi ma non limitati a
              testi, grafica, loghi, icone, immagini, clip audio, download
              digitali e software, sono di proprietà di Cambusaai o dei suoi
              fornitori di contenuti e sono protetti dalle leggi italiane e
              internazionali sulla proprietà intellettuale.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Ti viene concessa una licenza limitata, non esclusiva e revocabile
              per utilizzare il Servizio per scopi personali e non commerciali.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Privacy e Dati Personali
          </h2>
          <p className="text-gray-700 leading-relaxed">
            La raccolta e l'utilizzo dei tuoi dati personali sono regolati dalla
            nostra Privacy Policy, che forma parte integrante di questi Termini.
            Utilizzando il Servizio, accetti anche i termini della nostra
            Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Modifiche al Servizio
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Ci riserviamo il diritto di modificare, sospendere o interrompere il
            Servizio in qualsiasi momento, con o senza preavviso. Non saremo
            responsabili nei tuoi confronti o nei confronti di terze parti per
            qualsiasi modifica, sospensione o interruzione del Servizio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Limitazione di Responsabilità
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            In nessun caso Cambusaai, i suoi dirigenti, dipendenti o agenti
            saranno responsabili per danni diretti, indiretti, incidentali,
            speciali, consequenziali o punitivi, inclusi ma non limitati a:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Perdita di profitti</li>
            <li>Perdita di dati</li>
            <li>Interruzione del servizio</li>
            <li>Danni alla reputazione</li>
            <li>Qualsiasi altro danno immateriale</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Indennizzo
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Ti impegni a indennizzare e tenere indenne Cambusaai da qualsiasi
            reclamo, danno, perdita, responsabilità, costo o spesa (incluse le
            spese legali) derivanti da o in qualsiasi modo correlati al tuo
            utilizzo del Servizio o alla violazione di questi Termini.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Legge Applicabile e Foro Competente
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Questi Termini sono regolati e interpretati in conformità con le
            leggi italiane. Qualsiasi controversia derivante da o correlata a
            questi Termini sarà soggetta alla giurisdizione esclusiva dei
            tribunali italiani.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Disposizioni Generali
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Se una qualsiasi disposizione di questi Termini è ritenuta
              invalida o inapplicabile, le restanti disposizioni continueranno
              ad essere in pieno vigore ed effetto.
            </p>
            <p className="text-gray-700 leading-relaxed">
              La mancata applicazione di qualsiasi diritto o disposizione di
              questi Termini non costituisce una rinuncia a tale diritto o
              disposizione.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contattaci
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Se hai domande su questi Termini di Servizio, contattaci:
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:artscomi.web@gmail.com"
                className="text-primary hover:underline"
              >
                artscomi.web@gmail.com
              </a>
            </p>
          </div>
        </section>
      </motion.div>
    </motion.div>
  );
}
