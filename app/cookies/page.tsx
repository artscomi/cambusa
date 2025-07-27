"use client";

import { motion } from "framer-motion";
import { itemVariants } from "@/animations/framer-variants";
import { Cookie, Settings, Shield, Eye } from "lucide-react";

export default function CookiePolicyPage() {
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
          <Cookie className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
          Cookie Policy
        </h1>
        <p className="text-gray-600 text-lg">
          Ultimo aggiornamento: 27 luglio 2025
        </p>
      </motion.div>

      {/* Content */}
      <motion.div variants={itemVariants} className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Cosa sono i Cookie
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            I cookie sono piccoli file di testo che vengono memorizzati sul tuo
            dispositivo (computer, tablet, smartphone) quando visiti un sito
            web. Questi file contengono informazioni che permettono al sito di
            ricordare le tue preferenze e migliorare la tua esperienza di
            navigazione.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Cambusaai utilizza cookie e tecnologie simili per migliorare il
            funzionamento del sito, analizzare l'utilizzo e personalizzare
            l'esperienza utente.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Tipi di Cookie che Utilizziamo
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Cookie Tecnici (Necessari)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Questi cookie sono essenziali per il funzionamento del sito e
                non possono essere disabilitati.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Cookie di sessione per mantenere attiva la tua sessione</li>
                <li>
                  Cookie di sicurezza per proteggere da attacchi informatici
                </li>
                <li>Cookie di preferenze per ricordare le tue impostazioni</li>
                <li>Cookie di autenticazione per mantenere il tuo login</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Cookie Analitici
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Questi cookie ci aiutano a capire come utilizzi il sito per
                migliorare i nostri servizi. Utilizziamo Google Analytics e
                Microsoft Clarity per:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Analisi del traffico e delle pagine più visitate</li>
                <li>Monitoraggio delle performance del sito</li>
                <li>Identificazione di errori e problemi tecnici</li>
                <li>Statistiche di utilizzo per ottimizzare l'esperienza</li>
                <li>Mappe di calore per comprendere l'interazione utente</li>
                <li>Registrazioni delle sessioni per migliorare l'usabilità</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Cookie di Funzionalità
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Questi cookie permettono al sito di ricordare le tue scelte e
                fornire funzionalità personalizzate.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Preferenze alimentari e restrizioni dietetiche</li>
                <li>Impostazioni di lingua e regione</li>
                <li>Menu e liste della spesa salvate</li>
                <li>Personalizzazione dell'interfaccia utente</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-primary" />
            Cookie di Terze Parti
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Il nostro sito utilizza servizi di terze parti che installano i
            propri cookie per migliorare l'esperienza utente e analizzare
            l'utilizzo del sito:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Google Analytics
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Utilizziamo Google Analytics per analizzare il traffico del sito
                e comprendere come gli utenti interagiscono con le nostre
                pagine.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Analisi del traffico e delle pagine più visitate</li>
                <li>Comportamento degli utenti e tempo di permanenza</li>
                <li>Origine del traffico (ricerca, social, diretta)</li>
                <li>Performance del sito e velocità di caricamento</li>
                <li>Dispositivi e browser utilizzati</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3 text-sm">
                <strong>Privacy:</strong> Google Analytics può raccogliere il
                tuo indirizzo IP, ma noi abbiamo configurato l'anonimizzazione
                per proteggere la tua privacy. Puoi anche installare il
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  className="text-primary hover:underline ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
                .
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Microsoft Clarity
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Microsoft Clarity ci aiuta a comprendere meglio l'esperienza
                utente attraverso analisi del comportamento e mappe di calore.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Mappe di calore per vedere dove clicchi e scorri</li>
                <li>Registrazioni delle sessioni per analizzare l'usabilità</li>
                <li>Identificazione di problemi di navigazione</li>
                <li>Analisi del comportamento degli utenti</li>
                <li>Ottimizzazione dell'interfaccia utente</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3 text-sm">
                <strong>Privacy:</strong> Clarity raccoglie dati di navigazione
                ma non raccoglie informazioni personali come password o dati di
                pagamento. Puoi disabilitare Clarity tramite le impostazioni del
                browser.
              </p>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed mt-6">
            <strong>Nota:</strong> I cookie di terze parti sono soggetti alle
            policy di privacy dei rispettivi fornitori. Ti consigliamo di
            consultare le loro policy per maggiori informazioni:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
            <li>
              <a
                href="https://policies.google.com/privacy"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="https://privacy.microsoft.com/it-it/privacystatement"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Microsoft Privacy Statement
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Durata dei Cookie
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Cookie di Sessione
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Vengono eliminati automaticamente quando chiudi il browser. Sono
                utilizzati per mantenere attiva la tua sessione durante la
                navigazione.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Cookie Persistenti
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Rimangono sul tuo dispositivo per un periodo specifico (da pochi
                giorni a diversi anni) o fino a quando non li elimini
                manualmente. Sono utilizzati per ricordare le tue preferenze e
                migliorare l'esperienza futura.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Gestione dei Cookie
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Hai il controllo completo sui cookie che vengono installati sul
              tuo dispositivo:
            </p>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Impostazioni del Browser
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Puoi modificare le impostazioni del tuo browser per:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Bloccare tutti i cookie</li>
                <li>Accettare solo cookie di prima parte</li>
                <li>Eliminare i cookie esistenti</li>
                <li>Ricevere notifiche quando vengono installati cookie</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Banner di Consenso
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Quando visiti il nostro sito per la prima volta, ti mostreremo
                un banner che ti permette di accettare o rifiutare i cookie non
                necessari. Puoi modificare le tue preferenze in qualsiasi
                momento.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Link Utili
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Per maggiori informazioni su come gestire i cookie, visita:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/it-it/guide/safari/sfri11471/mac"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/it-it/help/17442/windows-internet-explorer-delete-manage-cookies"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Internet Explorer
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Impatto della Disabilitazione dei Cookie
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Se disabiliti i cookie, alcune funzionalità del sito potrebbero non
            funzionare correttamente:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Potresti dover reimpostare le tue preferenze ad ogni visita</li>
            <li>
              Alcune funzionalità personalizzate potrebbero non essere
              disponibili
            </li>
            <li>L'esperienza di navigazione potrebbe essere meno fluida</li>
            <li>Potresti non ricevere contenuti personalizzati</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Aggiornamenti alla Cookie Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Ci riserviamo il diritto di aggiornare questa Cookie Policy
            periodicamente per riflettere eventuali modifiche nelle nostre
            pratiche o per altri motivi operativi, legali o normativi. Ti
            notificheremo eventuali modifiche significative tramite il nostro
            sito web.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contattaci
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Se hai domande su questa Cookie Policy o sul nostro utilizzo dei
            cookie, contattaci:
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
