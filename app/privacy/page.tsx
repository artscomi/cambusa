export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Informativa sulla Privacy</h1>

      <div className="prose prose-lg">
        <h2 className="text-2xl font-semibold mb-4">
          1. Raccolta delle Informazioni
        </h2>
        <p className="mb-4">Raccogliamo le seguenti informazioni:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Informazioni di base del profilo (nome, email)</li>
          <li>Preferenze alimentari</li>
          <li>Dati di utilizzo del servizio</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">
          2. Utilizzo delle Informazioni
        </h2>
        <p className="mb-4">Utilizziamo le informazioni raccolte per:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Fornire e migliorare il nostro servizio</li>
          <li>Personalizzare l&apos;esperienza utente</li>
          <li>Comunicare con te per migliorare il servizio</li>
          <li>Inviare aggiornamenti e novità sul servizio</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">
          3. Protezione delle Informazioni
        </h2>
        <p className="mb-4">
          Implementiamo misure di sicurezza per proteggere le tue informazioni
          personali. I tuoi dati sono archiviati in modo sicuro e accessibili
          solo al personale autorizzato.
        </p>

        <h2 className="text-2xl font-semibold mb-4">
          4. Condivisione delle Informazioni
        </h2>
        <p className="mb-4">
          Non vendiamo, scambiamo o trasferiamo le tue informazioni personali a
          terze parti, eccetto quando necessario per:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Fornire il servizio richiesto</li>
          <li>Rispettare obblighi legali</li>
          <li>Proteggere i nostri diritti</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">5. I Tuoi Diritti</h2>
        <p className="mb-4">Hai il diritto di:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Accedere alle tue informazioni personali</li>
          <li>Correggere informazioni inesatte</li>
          <li>Richiedere la cancellazione dei tuoi dati</li>
          <li>Opporti al trattamento dei tuoi dati</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">6. Contatti</h2>
        <p className="mb-4">
          Per qualsiasi domanda sulla privacy, contattaci all&apos;indirizzo
          email: artscomi.web@gmail.com
        </p>

        <h2 className="text-2xl font-semibold mb-4">
          7. Modifiche alla Privacy Policy
        </h2>
        <p className="mb-4">
          Ci riserviamo il diritto di modificare questa privacy policy in
          qualsiasi momento. Le modifiche saranno pubblicate su questa pagina.
        </p>
      </div>
    </div>
  );
}
