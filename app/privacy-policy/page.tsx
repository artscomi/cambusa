"use client";

import { motion } from "framer-motion";
import { itemVariants } from "@/animations/framer-variants";
import { Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPolicyPage() {
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
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-lg">
          Ultimo aggiornamento: 27 luglio 2025
        </p>
      </motion.div>

      {/* Content */}
      <motion.div variants={itemVariants} className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Informazioni Generali
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Cambusaai ("noi", "nostro", "ci") rispetta la tua privacy e si
            impegna a proteggere i tuoi dati personali. Questa Privacy Policy
            spiega come raccogliamo, utilizziamo e proteggiamo le tue
            informazioni quando utilizzi il nostro servizio di pianificazione
            menu per barche.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Utilizzando Cambusaai, accetti le pratiche descritte in questa
            Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" />
            Dati che Raccogliamo
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Dati di Registrazione
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Nome e cognome</li>
                <li>Indirizzo email</li>
                <li>Informazioni del profilo utente</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Dati di Utilizzo
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Preferenze alimentari e restrizioni dietetiche</li>
                <li>Menu generati e liste della spesa</li>
                <li>Dati di navigazione e utilizzo dell'app</li>
                <li>Informazioni tecniche (IP, browser, dispositivo)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-primary" />
            Come Utilizziamo i Tuoi Dati
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Utilizziamo i tuoi dati personali per:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                Fornire e migliorare il nostro servizio di pianificazione menu
              </li>
              <li>Generare menu personalizzati basati sulle tue preferenze</li>
              <li>Creare liste della spesa accurate</li>
              <li>Comunicare con te riguardo al servizio</li>
              <li>Analizzare l'utilizzo per migliorare l'esperienza utente</li>
              <li>Rispettare gli obblighi legali</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary" />
            Protezione dei Dati
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Implementiamo misure di sicurezza tecniche e organizzative
            appropriate per proteggere i tuoi dati personali contro accesso non
            autorizzato, alterazione, divulgazione o distruzione.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Crittografia dei dati in transito e a riposo</li>
            <li>Controlli di accesso rigorosi</li>
            <li>Monitoraggio continuo della sicurezza</li>
            <li>Backup regolari e sicuri</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Condivisione dei Dati
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Non vendiamo, affittiamo o condividiamo i tuoi dati personali con
            terze parti, eccetto nei seguenti casi:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Con il tuo consenso esplicito</li>
            <li>Per rispettare obblighi legali o ordini giudiziari</li>
            <li>
              Con fornitori di servizi che ci aiutano a operare (con garanzie di
              protezione)
            </li>
            <li>In caso di fusione o acquisizione aziendale</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            I Tuoi Diritti
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Hai il diritto di:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Accedere ai tuoi dati personali</li>
            <li>Correggere dati inesatti o incompleti</li>
            <li>Richiedere la cancellazione dei tuoi dati</li>
            <li>Limitare il trattamento dei tuoi dati</li>
            <li>Portabilità dei dati</li>
            <li>Opporti al trattamento dei dati</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Cookie e Tecnologie Simili
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Utilizziamo cookie e tecnologie simili per migliorare l'esperienza
            utente, analizzare l'utilizzo del sito e personalizzare il
            contenuto. Puoi controllare l'uso dei cookie attraverso le
            impostazioni del tuo browser.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Conservazione dei Dati
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Conserviamo i tuoi dati personali solo per il tempo necessario a
            fornire il servizio e rispettare gli obblighi legali. I dati vengono
            eliminati in modo sicuro quando non sono più necessari.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Modifiche alla Privacy Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Ci riserviamo il diritto di aggiornare questa Privacy Policy
            periodicamente. Ti notificheremo eventuali modifiche significative
            tramite email o attraverso il nostro sito web.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contattaci
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Se hai domande su questa Privacy Policy o sul trattamento dei tuoi
            dati personali, contattaci:
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
