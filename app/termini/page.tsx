export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Termini di Servizio</h1>

      <div className="prose prose-lg">
        <h2 className="text-2xl font-semibold mb-4">
          1. Accettazione dei Termini
        </h2>
        <p className="mb-4">
          Utilizzando Cambusa, accetti di essere vincolato dai presenti Termini
          di Servizio. Se non accetti questi termini, ti preghiamo di non
          utilizzare il servizio.
        </p>

        <h2 className="text-2xl font-semibold mb-4">
          2. Descrizione del Servizio
        </h2>
        <p className="mb-4">
          Cambusa è un servizio che aiuta gli utenti a pianificare i pasti e
          generare liste della spesa in base alle loro preferenze alimentari.
        </p>

        <h2 className="text-2xl font-semibold mb-4">
          3. Utilizzo del Servizio
        </h2>
        <p className="mb-4">L&apos;utente si impegna a:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Fornire informazioni accurate e veritiere</li>
          <li>Non utilizzare il servizio per scopi illegali</li>
          <li>Non tentare di accedere a parti del servizio non autorizzate</li>
          <li>
            Non utilizzare il servizio in modo da danneggiare o compromettere il
            suo funzionamento
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">
          4. Limitazioni di Responsabilità
        </h2>
        <p className="mb-4">Cambusa non si assume alcuna responsabilità per:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Eventuali allergie o intolleranze alimentari</li>
          <li>La qualità o la sicurezza degli ingredienti suggeriti</li>
          <li>Interruzioni o malfunzionamenti del servizio</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">5. Modifiche ai Termini</h2>
        <p className="mb-4">
          Ci riserviamo il diritto di modificare questi termini in qualsiasi
          momento. Le modifiche entreranno in vigore immediatamente dopo la
          pubblicazione sul sito.
        </p>

        <h2 className="text-2xl font-semibold mb-4">6. Contatto</h2>
        <p className="mb-4">
          Per qualsiasi domanda riguardante questi termini, contattaci
          all&apos;indirizzo email: cristina.luerti@gmail.com
        </p>
      </div>
    </div>
  );
}
