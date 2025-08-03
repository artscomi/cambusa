import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Countdown = () => {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      animate={{ opacity: 1, transition: { delay: 1, duration: 2 } }}
      initial={{ opacity: 0 }}
      className="text-center mb-8"
    >
      <span className="text-2xl font-bold text-primary">{countdown}s</span>
    </motion.div>
  );
};



const PhraseCarousel = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  
  const phrases = [
    {
      icon: "🗑️",
      text: "Dai un'occhiata: se un pasto non ti convince, puoi rimuoverlo dal menu oppure rigenerarlo"
    },
    {
      icon: "✏️", 
      text: "Dopo aver creato la lista, potrai modificarla o aggiungere nuovi elementi in qualsiasi momento"
    },
    {
      icon: "👤",
      text: "Una volta generato, potrai sempre vedere il tuo menu nel tuo profilo"
    },
    {
      icon: "🛒",
      text: "Quando è tutto pronto, clicca su \"Genera lista\" per creare una lista della spesa da portare con te per andare a fare Cambusa!"
    },
    {
      icon: "🧘‍♀️",
      text: "Ancora un attimo di pazienza, l'AI sta ancora meditando per creare il menu perfetto per te..."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 6000); // Cambia ogni 6 secondi (30s / 5 phrases = 6s)

    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <motion.div
      key={currentPhrase}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-8"
    >
      <p className="md:text-lg">
        {phrases[currentPhrase].icon} {phrases[currentPhrase].text}
      </p>
    </motion.div>
  );
};

export const Loading = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  // Protezione per evitare refresh e navigazione durante la generazione
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "La generazione è in corso. Sei sicuro di voler uscire?";
      return "La generazione è in corso. Sei sicuro di voler uscire?";
    };

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
      alert(
        "La generazione è in corso. Non puoi navigare via in questo momento."
      );
    };

    // Blocca il refresh della pagina
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Blocca la navigazione con i pulsanti del browser
    window.addEventListener("popstate", handlePopState);

    // Aggiungi un entry extra alla history per bloccare il pulsante "indietro"
    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const LottieAnimation = dynamic(
    () => import("@/components/LottieAnimation"),
    {
      ssr: false,
    }
  );

  return (
    <motion.div className="flex flex-col items-center justify-center  m-auto px-8">
      <h1 className="mb-6 text-4xl text-pretty">
        Stiamo generando la tua proposta di menu
      </h1>
      <LottieAnimation name="groovyWalk" />
      <div className="max-w-[700px]">
        <motion.p
          animate={{ opacity: 1, transition: { delay: 0, duration: 2 } }}
          initial={{ opacity: 0 }}
          className="md:text-lg mt-8 mb-8 text-center font-medium text-primary"
        >
          ⏱️ La generazione impiegherà circa 60 secondi
        </motion.p>
        <Countdown />
        
        {/* Progress bar per dare senso di avanzamento */}
        <motion.div
          animate={{ opacity: 1, transition: { delay: 1, duration: 2 } }}
          initial={{ opacity: 0 }}
          className="w-full bg-gray-200 rounded-full h-2 mb-8"
        >
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 60, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Stages di generazione usando le frasi esistenti */}

        {/* Carousel di frasi */}
        <PhraseCarousel />
      </div>
    </motion.div>
  );
};
