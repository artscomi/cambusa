import { motion } from "framer-motion";
import { useEffect } from "react";
import dynamic from "next/dynamic";

export const Loading = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
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

        <motion.p
          animate={{ opacity: 1, transition: { delay: 2, duration: 2 } }}
          initial={{ opacity: 0 }}
          className="md:text-lg mt-8 mb-8"
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
