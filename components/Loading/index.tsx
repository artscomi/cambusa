import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Countdown = () => {
  const [countdown, setCountdown] = useState(90);

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
      <span className="text-2xl font-bold text-primary">
        {countdown}s
      </span>
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
      alert("La generazione è in corso. Non puoi navigare via in questo momento.");
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
          ⏱️ La generazione impiegherà al massimo 90 secondi
        </motion.p>
        <Countdown />
        <motion.p
          animate={{ opacity: 1, transition: { delay: 2, duration: 2 } }}
          initial={{ opacity: 0 }}
          className="md:text-lg mb-8"
        >
          🗑️ Dai un'occhiata: se un pasto non ti convince, puoi rimuoverlo dalla
          lista
        </motion.p>
        <motion.p
          animate={{ opacity: 1, transition: { delay: 5, duration: 2 } }}
          initial={{ opacity: 0 }}
          className="md:text-lg mb-10"
        >
          🛒 Quando è tutto pronto, clicca su &quot;Genera lista&quot; per
          creare una lista della spesa da portare con te per andare a{" "}
          <i>fare Cambusa!</i>
        </motion.p>

        <motion.p
          animate={{ opacity: 1, transition: { delay: 10, duration: 2 } }}
          initial={{ opacity: 0 }}
          className="md:text-lg"
        >
          🧘‍♀️ Ancora un attimo di pazienza, l&apos;AI sta ancora meditando per
          creare il menu perfetto per te...
        </motion.p>
      </div>
    </motion.div>
  );
};
